/**
 * Created by Pawan on 3/22/2017.
 */
mainApp.directive("editnotice", function ($filter,$uibModal,noticeBackendService) {

    return {
        restrict: "EAA",
        scope: {
            notice: "=",
            applist: "=",
            'updateNotice': '&',
            'reloadpage':'&'
        },

        templateUrl: 'views/notice-config/partials/noticeItem.html',

        link: function (scope) {

            scope.notice.users=[];
            scope.notice.group_users=[];
            if(scope.notice.toUser)
            {
                angular.forEach(scope.notice.toUser, function (user) {
                    scope.notice.users.push(user.username);
                });
            }
             if(scope.notice.toGroup)
             {
                 angular.forEach(scope.notice.toGroup, function (group) {
                     scope.notice.group_users.push(group.name);
                 });
             }

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

                (new PNotify({
                    title: tittle,
                    text: content,
                    icon: 'glyphicon glyphicon-question-sign',
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    }
                })).get().on('pnotify.confirm', function () {
                        OkCallback("confirm");
                    }).on('pnotify.cancel', function () {

                    });

            };
            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.removeNotice = function (item) {

                scope.showConfirm("Delete File", "Delete", "ok", "cancel", "Do you want to delete " + item.title, function (obj) {

                    noticeBackendService.removeNotice(item._id).then(function (response) {
                        if (response.IsSuccess) {
                            scope.updateNotice(item);
                            scope.showAlert("Deleted","File " + item.title + " Deleted successfully","success");
                        }
                        else
                            scope.showAlert("Error", "Error in file removing", "error");
                    }, function (error) {
                        scope.showAlert("Error", "Error in file removing", "error");
                    });

                }, function () {

                }, item);


            };


        }

    }
});