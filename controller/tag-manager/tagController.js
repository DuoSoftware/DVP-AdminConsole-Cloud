/**
 * Created by Pawan on 8/23/2016.
 */
/**
 * Created by Pawan on 8/23/2016.
 */


mainApp.controller('tagcontroller', function ($scope, $rootScope, $state, $uibModal, jwtHelper,  tagBackendService, loginService,$anchorScroll) {
    var apple_selected, tree, treedata_avm = [], treedata_geography;
    $anchorScroll();
    $scope.my_data = [];
    $scope.newChildObject = {};

    $scope.loadTagDetails = function (tagID, callback) {
        if (tagID) {
            tagBackendService.getTagDetails(tagID).then(function (response) {

                if (!response.data.IsSuccess) {
                    callback(new Error("Error"), null);

                }
                else {
                    callback(null, response.data.Result);

                }
            }, function (err) {
                loginService.isCheckResponse(err);
                console.log("Tag detail picking error ", err);
                callback(err, null);
            });


        }
        else {
            callback(new Error("Invalid Tag"), null);
        }

    };

    $scope.childTreeGenerator = function (childTags, motherBranch) {

        for (var i = 0; i < childTags.length; i++) {
            $scope.loadTagDetails(childTags[i], function (error, tagResponse) {
                if (error) {
                    console.log(error);
                }
                else {
                    var newChild = $scope.try_adding_a_branch(motherBranch, tagResponse);

                    if (tagResponse.tags.length > 0) {
                        $scope.childTreeGenerator(tagResponse.tags, newChild)
                    }


                }
            });
        }
    }

    $scope.loadCategoryData = function () {
        tagBackendService.getTagCategories("57bc1a43c71845e82377daea").then(function (response) {

            if (!response.data.IsSuccess) {

                console.info("Error in adding new Application " + response.data.Exception);

                //$scope.showAlert("Error",)
            }
            else {
                console.log("Success");
                console.log(response.data.Result);

                var rootData =
                {
                    label: response.data.Result.name,
                    catId: response.data.Result._id,
                    children: []


                }
                var childTags = response.data.Result.tags;
                treedata_avm.push(rootData);
                console.log("Tree data found ", JSON.stringify(treedata_avm));
                $scope.my_data = treedata_avm;
                $scope.my_tree_handler(treedata_avm[0]);

                $scope.childTreeGenerator(childTags, treedata_avm[0]);


            }

        }, function (err) {
            loginService.isCheckResponse(err);
            console.info("Error in adding new Application " + err);


        });
    };

    $scope.$watch('my_data', function () {

    });

    $scope.loadCategoryData();

    $scope.my_tree_handler = function (branch) {
        var _ref;
        $scope.output = "You selected: " + branch.label;
        if ((_ref = branch.data) != null ? _ref.description : void 0) {
            return $scope.output += '(' + branch.data.description + ')';
        }
    };
    apple_selected = function (branch) {
        return $scope.output = "APPLE! : " + branch.label;
    };
    /* treedata_avm = [
     {
     label: 'Animal',
     children: [
     {
     label: 'Dog',
     data: {
     description: "man's best friend"
     }
     }, {
     label: 'Cat',
     data: {
     description: "Felis catus"
     }
     }, {
     label: 'Hippopotamus',
     data: {
     description: "hungry, hungry"
     }
     }, {
     label: 'Chicken',
     children: ['White Leghorn', 'Rhode Island Red', 'Jersey Giant']
     }
     ]
     }, {
     label: 'Vegetable',
     data: {
     definition: "A plant or part of a plant used as food, typically as accompaniment to meat or fish, such as a cabbage, potato, carrot, or bean.",
     data_can_contain_anything: true
     },
     onSelect: function(branch) {
     return $scope.output = "Vegetable: " + branch.data.definition;
     },
     children: [
     {
     label: 'Oranges'
     }, {
     label: 'Apples',
     children: [
     {
     label: 'Granny Smith',
     onSelect: apple_selected
     }, {
     label: 'Red Delicous',
     onSelect: apple_selected
     }, {
     label: 'Fuji',
     onSelect: apple_selected
     }
     ]
     }
     ]
     }, {
     label: 'Mineral',
     children: [
     {
     label: 'Rock',
     children: ['Igneous', 'Sedimentary', 'Metamorphic']
     }, {
     label: 'Metal',
     children: ['Aluminum', 'Steel', 'Copper']
     }, {
     label: 'Plastic',
     children: [
     {
     label: 'Thermoplastic',
     children: ['polyethylene', 'polypropylene', 'polystyrene', ' polyvinyl chloride']
     }, {
     label: 'Thermosetting Polymer',
     children: ['polyester', 'polyurethane', 'vulcanized rubber', 'bakelite', 'urea-formaldehyde']
     }
     ]
     }
     ]
     }
     ];*/
    treedata_geography = [
        {
            label: 'North America',
            children: [
                {
                    label: 'Canada',
                    children: ['Toronto', 'Vancouver']
                }, {
                    label: 'USA',
                    children: ['New York', 'Los Angeles']
                }, {
                    label: 'Mexico',
                    children: ['Mexico City', 'Guadalajara']
                }
            ]
        }, {
            label: 'South America',
            children: [
                {
                    label: 'Venezuela',
                    children: ['Caracas', 'Maracaibo']
                }, {
                    label: 'Brazil',
                    children: ['Sao Paulo', 'Rio de Janeiro']
                }, {
                    label: 'Argentina',
                    children: ['Buenos Aires', 'Cordoba']
                }
            ]
        }
    ];
    $scope.my_data = treedata_avm;
    $scope.try_changing_the_tree_data = function () {
        if ($scope.my_data === treedata_avm) {
            return $scope.my_data = treedata_geography;
        } else {
            return $scope.my_data = treedata_avm;
        }
    };
    $scope.my_tree = tree = {};
    $scope.try_async_load = function () {
        $scope.my_data = [];
        $scope.doing_async = true;
        return $timeout(function () {
            if (Math.random() < 0.5) {
                $scope.my_data = treedata_avm;
            } else {
                $scope.my_data = treedata_geography;
            }
            $scope.doing_async = false;
            return tree.expand_all();
        }, 1000);
    };
    return $scope.try_adding_a_branch = function (currentBranch, childDetails) {
        var b;
        b = tree.get_selected_branch();

        return tree.add_branch(currentBranch, {
            label: childDetails.name,
            tagID: childDetails._id,
            children: []

        });
    };

});


