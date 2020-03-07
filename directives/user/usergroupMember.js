/**
 * Created by Pawan on 11/9/2016.
 */
mainApp.directive("groupmemberviewer", function ($filter, $uibModal, userProfileApiAccess) {

    return {
        restrict: "EAA",
        scope: {
            groupid: "="

        },

        templateUrl: 'views/user/groupMembers.html',

        link: function (scope) {

            scope.groupMemberlist = [];
            scope.agents = [];
            scope.showAlert = function (title, type, content) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };


            scope.loadAllAgents = function () {
                userProfileApiAccess.getUsers().then(function (data) {
                    if (data.IsSuccess) {
                        scope.agents = data.Result;
                        removeAllocatedAgents();
                    }
                }, function (error) {
                    scope.showAlert("Loading Agent details", "error", "Error in loading Agent details");
                });
            }
            scope.loadAllAgents();

            scope.loadGroupMembers = function () {
                userProfileApiAccess.getGroupMembers(scope.groupid).then(function (response) {
                    if (response.IsSuccess) {
                        scope.groupMemberlist = response.Result;
                        console.log("Members ", response.Result);
                        removeAllocatedAgents()
                    }
                    else {
                        console.log("Error in loading Group member list");
                        scope.showAlert("User removing from group", "error", "Error in removing user from group");
                    }
                }, function (err) {
                    console.log("Error in loading Group member list ", err);
                    scope.showAlert("User removing from group", "error", "Error in removing user from group");
                })
            };

            scope.removeGroupMember = function (userID) {
                userProfileApiAccess.removeUserFromGroup(scope.groupid, userID).then(function (response) {

                    if (response.IsSuccess) {
                        scope.groupMemberlist.filter(function (userObj) {
                            if (userObj._id == userID) {
                                scope.groupMemberlist.splice(scope.groupMemberlist.indexOf(userObj), 1);
                                scope.agents.push(userObj);
                                scope.showAlert("User removing from group", "success", "User removed from group successfully");
                            }

                        })


                    }
                    else {
                        scope.showAlert("User removing from group", "error", "Error in removing user from group");
                    }
                }, function (error) {
                    scope.showAlert("User removing from group", "error", "User removing from group failed");
                })
            };

            scope.loadGroupMembers();


            scope.addUserToGroup = function (userID) {
                userProfileApiAccess.addMemberToGroup(scope.groupid, userID).then(function (response) {

                    if (response.IsSuccess) {

                        scope.agents.filter(function (userObj) {
                            if (userObj._id == userID) {
                                scope.groupMemberlist.push(userObj);
                                scope.showAlert("Member added to group", "success", "Member added to group successfully");
                                removeAllocatedAgents();

                            }

                        })


                    }
                    else {
                        scope.showAlert("Member added to group", "error", "Error in Member adding to group");
                    }
                }, function (error) {
                    scope.showAlert("Member added to group", "error", "Member added to group failed");
                })
            }


            scope.getAllStates = function (callback) {
                callback(scope.allStates);
            };

            scope.stateSelected = function (state) {
                scope.stateInfo = state.name + " (" + state.id + ")";
            }

            scope.allStates = [
                {"name": "Alabama", "id": "AL"},
                {"name": "Alaska", "id": "AK"}]


            angular.element(document).ready(function () {
                $("#e1").select2();
            });


            var removeAllocatedAgents = function () {

                scope.groupMemberlist.filter(function (member) {

                    scope.agents.filter(function (agent) {
                        if (agent._id == member._id) {
                            scope.agents.splice(scope.agents.indexOf(agent), 1);
                        }
                    })
                })
            }


        }

    }
});

