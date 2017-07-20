(function(firebase) {
'use strict';

    angular
        .module('App')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', 'Angular', 'Ionic', 'Model', '$cordovaClipboard', '$stateParams'];
    function ChatController($scope, Angular, Ionic, Model, $cordovaClipboard, $stateParams) {

        var $translate = Angular.$filter('translate');

        var viewScroll = Ionic.$ionicScrollDelegate.$getByHandle('userMessageScroll');
        var footerBar; // gets set in $ionicView.enter
        var scroller;
        var txtInput;
        $scope.messages = [];

        var createMessage = function(message){
            var now = new Date();
            message._id = now.getTime(); // :~)
            message.date = now.toISOString();
            message.username = $scope.user.username;
            message.userId = $scope.user._id;
            message.pic = $scope.user.pic || null;
        };

        $scope.sendMessage = function(sendMessageForm) {
            var message = {
                text: $scope.input.message
            };

            // if you do a web service call this will be needed as well as before the viewScroll calls
            // you can't see the effect of this in the browser it needs to be used on a real device
            // for some reason the one time blur event is not firing in the browser but does on devices
            keepKeyboardOpen();

            createMessage(message);
            
            $scope.input.message = '';
            
            Model.Chat.addMessageAndLocation(message);

            Angular.$timeout(function() {
                keepKeyboardOpen();
            }, 0);
        };

        function keepKeyboardOpen() {
            txtInput.one('blur', function() {
                txtInput[0].focus();
            });
        }

        $scope.onMessageHold = function(e, itemIndex, message) {
            if(!message.photo){
                Ionic.$ionicActionSheet.show({
                    buttons: [{
                        text: $translate('copyMessage')
                    }],
                    buttonClicked: function(index) {
                        switch (index) {
                            case 0:
                                $cordovaClipboard.copy(message.text);
                                break;
                        }
                        return true;
                    }
                });
            }
        };

        // this prob seems weird here but I have reasons for this in my app, secret!
        $scope.viewProfile = function(msg) {
            if (msg.userId === $scope.user._id) {
                // go to your profile
            } else {
                // go to other users profile
            }
        };

        $scope.$on('elastic:resize', function(event, element, oldHeight, newHeight) {
        
            if (!footerBar) return;
            
            var newFooterHeight = newHeight + 10;
            newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
            
            footerBar.style.height = newFooterHeight + 'px';
            scroller.style.bottom = newFooterHeight + 'px'; 
        });

        $scope.onProfilePicError = function() {
            return 'https://www.google.com.ua/images/srpr/logo4w.png'; // set a fallback
        };

        $scope.refreshScroll = function(scrollBottom, timeout) {
            
            Angular.$timeout(function() {
                scrollBottom = scrollBottom || $scope.scrollDown;
                viewScroll.resize();
                if(scrollBottom){
                    viewScroll.scrollBottom(true);
                }
                $scope.checkScroll();
            }, timeout || 1000);
        };
        $scope.scrollDown = true;
        $scope.checkScroll = function () {
            Angular.$timeout(function() {
                var currentTop = viewScroll.getScrollPosition().top;
                var maxScrollableDistanceFromTop = viewScroll.getScrollView().__maxScrollTop;
                $scope.scrollDown = (currentTop >= maxScrollableDistanceFromTop);
                $scope.$apply();
            }, 0);
            return true;
        };

        var refreshLocation = function(){
            Model.Geolocation.getLocation().then(function(position){
                Model.Chat.updateGeoQuery(position);
            });
        };

        var locationInterval;
        var initChat = function(){
            Model.Loader.show($scope);
            Model.Geolocation.getLocation().then(function(position){
                Model.Loader.hide();
                Model.Chat.initialize($stateParams.team);
                Model.Chat.createGeoQuery($scope.messages, $scope, position);
            }).catch(function(error){
                Model.Loader.hide();
                Ionic.$ionicPopup.confirm({
                    title: $translate('gpsTitle'),
                    template: $translate('gpsTemplate'),
                    okText: $translate('okText'),
                    okType: 'button-assertive',
                    cancelText: $translate('cancelText'),
                    cssClass: 'animated bounceInDown'
                }).then(function(res){
                    if(res){
                        initChat();
                    }else{
                        backToTeamState();
                    }
                })
            });
        };

        var backToTeamState = function(){
            Ionic.$ionicViewSwitcher.nextDirection('back');
            Ionic.$ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            Angular.$state.go('app.teams');
        };

        $scope.$on('$ionicView.beforeEnter', function(){
            var currentUser = firebase.auth().currentUser || Angular.$rootScope.user;
            if(!currentUser){
                return backToTeamState();
            }
            $scope.user = {
                _id: currentUser.email,
                pic: currentUser.photoURL || currentUser.providerData[0].photoURL || 'img/player.svg',
                username: (
                    currentUser.displayName || currentUser.providerData[0].displayName || currentUser.email.split('@')[0]
                ).split(' ').splice(0, 2).filter(Boolean).join(' ')
            };
            initChat();
            $scope.progressBar = 0;
        });

        $scope.$on('$ionicView.enter', function() {
            
            Angular.$timeout(function() {
                footerBar = document.body.querySelector('.chatView .bar-footer');
                scroller = document.body.querySelector('.chatView .scroll-content');
                txtInput = angular.element(footerBar.querySelector('textarea'));
            }, 0);

            locationInterval = Angular.$interval(refreshLocation, 120000);
        });

        $scope.$on('$ionicView.beforeLeave', function(){
            Angular.$interval.cancel(locationInterval);
            Model.Chat.destroyGeoQuery();
        });

        $scope.stopLoading = function(){
            //TODO: Cancel loading and back
        };

        $scope.sendPhoto = function(){
            Model.Media.getPhoto().then(function(imageData){
                var msgInfo = Model.Chat.addEmptyMessage();
                Model.Media.uploadFile(imageData, 'chat', msgInfo.key).then(function(result) {
                    var message = {
                        photo : result
                    };
                    createMessage(message);
                    Model.Chat.updateMessageAndLocation(msgInfo.path, msgInfo.key, message);
                    Angular.$timeout(function(){
                        $scope.progressBar = 0;
                    }, 1500);
                }, function(err) {
                    alert(err);
                }, function (progress) {
                    $scope.progressBar = progress + "%";
                });
            });
        };

        $scope.photoBrowser = function(message){
            var messages = Angular.$filter('filter')($scope.messages, { photo: '' });
            $scope.activeSlide = messages.indexOf(message);
            $scope.allImages = messages.map(function(message){
                return message.photo;
            });
            
            Model.Modals.openModal($scope, 'templates/modals/fullscreenImages.html');
        };

        $scope.closeModal = function(){
            Model.Modals.closeModal();
        };
    }
})(firebase);