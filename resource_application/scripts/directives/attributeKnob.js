/**
 * Created by Rajinda on 5/30/2016.
 */
mainApp.directive("resourceskill", function ($filter, $uibModal, resourceService, uuid) {

    return {
        restrict: "EAA",
        scope: {
            resourceId: "=",
            taskType: "=",
            selectedAttribute: "=",
            'deleteAttributedrictive': '&'
        },

        templateUrl: 'resource_application/partials/template/attributeKnob.html',

        link: function (scope, element, attributes) {

            var knobLoading = true;
            scope.getRandomSpan = function () {
                return Math.floor((Math.random() * 6) + 1);
            };

            scope.knobId = uuid.new();

            scope.knobValue = 0;
            scope.$watch("knobValue",
                function (newValue, oldValue) {
                    console.info(scope.knobId + ":" + newValue);
                    $("#" + scope.knobId).val(newValue).trigger("change");
                }
            );

            scope.knobValue = scope.selectedAttribute.Percentage;

            scope.deleteAttribute = function (item) {
                scope.deleteAttributedrictive(item);
            };

            <!-- jQuery Knob -->
            $(".knob").knob({

                change: function (value) {
                    /*console.log("change : " + value);*/
                    knobLoading = false;
                },
                release: function (value) {
                    //console.log(this.$.attr('value'));
                    if (scope.selectedAttribute && scope.selectedAttribute.savedObj)
                        scope.selectedAttribute.savedObj.Percentage = value;
                    if (!knobLoading) {
                        resourceService.UpdateAttributesAttachToResource(scope.selectedAttribute).then(function (response) {

                            if (response.IsSuccess) {
                                console.log("UpdateAttributesAttachToResource : " + value);

                                if (value >= 0) {
                                    var updateRealTimeObj = {
                                        ResourceId: scope.resourceId,
                                        ResourceAttributeInfo: {
                                            Attribute: scope.selectedAttribute.savedObj.AttributeId.toString(),
                                            HandlingType: scope.taskType,
                                            Percentage: value
                                        },
                                        OtherInfo: ""
                                    };

                                    resourceService.AssignAttributeToResource(updateRealTimeObj).then(function (response) {
                                        if (response.IsSuccess) {
                                            console.info("AssignAttributeToResource real time success");
                                        } else {
                                            console.info("AssignAttributeToResource real time failed");
                                        }

                                    }, function (error) {
                                        console.info("AssignAttributeToResource real time err" + error);
                                    });
                                }
                            }
                            else {

                            }
                        }, function (error) {
                            console.info("AssignTaskToResource err" + error);
                        });
                    }
                    knobLoading = false;
                    console.log("release : " + value);


                },
                cancel: function () {
                    console.log("cancel : ", this);
                },
                format: function (value) {
                    return value + '%';
                },
                draw: function () {

                    // "tron" case
                    if (this.$.data('skin') == 'tron') {

                        this.cursorExt = 0.3;

                        var a = this.arc(this.cv) // Arc
                            ,
                            pa // Previous arc
                            , r = 1;

                        this.g.lineWidth = this.lineWidth;

                        if (this.o.displayPrevious) {
                            pa = this.arc(this.v);
                            this.g.beginPath();
                            this.g.strokeStyle = this.pColor;
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                            this.g.stroke();
                        }

                        this.g.beginPath();
                        this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                        this.g.stroke();

                        this.g.lineWidth = 2;
                        this.g.beginPath();
                        this.g.strokeStyle = this.o.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                        this.g.stroke();
                        return false;
                    }
                }
            });


            // Kasun_Wijeratne_23_OCT_2018
            scope.attrEditOn = false;
            scope.initAttributeEdit = function () {
                scope.attrEditOn = !scope.attrEditOn;
            };
            // END - Kasun_Wijeratne_23_OCT_2018


        }

    }
});


mainApp.factory('uuid', function () {
    var svc = {
        new: function () {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }

            return _p8() + _p8(true) + _p8(true) + _p8();
        },

        empty: function () {
            return '00000000-0000-0000-0000-000000000000';
        }
    };

    return svc;
});