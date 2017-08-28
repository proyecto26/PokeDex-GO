(function () {
    'use strict';

    angular
        .module('App')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', 'myConfig', 'Ionic', 'Model', 'Angular'];
    function AppController($scope, myConfig, Ionic, Model, Angular) {
        
        var $translate = Angular.$filter('translate');

        $scope.items = [
            {
                color: "#28AAFD",
                icon: "ion-chatboxes",
                title: "teams",
                state: 'app.teams',
                img: "img/pokestop.svg",
                left: "88px"
            }
            // {
            //     color: "#28AAFD",
            //     icon: "ion-ios-people",
            //     title: "credits",
            //     state: "app.credits"
            // }
            // {
            //     color: "#28AAFD",
            //     icon: "ion-earth",
            //     title: "events",
            //     state: 'app.events'
            // },
            // {
            //     color: "#28AAFD",
            //     icon: "ion-clipboard",
            //     title: "report",
            //     state: 'app.report'
            // },
            // {
            //     color: "#28AAFD",
            //     icon: "ion-person",
            //     title: "my_profile",
            //     state: 'app.myProfile'
            // },
            // {
            //     color: "#28AAFD",
            //     icon: "ion-android-cart",
            //     title: "poke_stops",
            //     state: 'app.pokeStops'
            // },
            // {
            //     color: "#28AAFD",
            //     icon: "ion-calculator",
            //     title: "calculator",
            //     state: 'app.calculator'
            // },
            // {
            //     color: "#28AAFD",
            //     icon: "ion-connection-bars",
            //     title: "statistics",
            //     state: 'app.statistics'
            // }
        ];

        var showAuthentication = function(){
            $scope.popup = Ionic.$ionicPopup.alert({
                scope: $scope,
                title: $translate('logInTitle'),
                templateUrl: 'templates/modals/auth.html',
                hideOnStateChange: true,
                okText: $translate('cancelText'),
                okType: 'button-assertive',
                cssClass: 'animated rollIn'
            });
        };

        var nextState = null;

        $scope.$on(myConfig.authEvents.notAuthorized, function(event, args) {
            nextState = {
                next: args.next,
                nextParams: args.nextParams
            };
            showAuthentication();
        });

        var UserAuthentication = function(){
            var self = this;
            self.stopped = false;

            Model.Network.tryToConnect().then(function(){
                Model.Auth.login().then(function(auth){
                    Model.Loader.hide();
                    if(nextState){
                        Angular.$rootScope.user = auth.user || auth;
                        Angular.$state.go(nextState.next, nextState.nextParams);
                        nextState = null;
                    }
                }).catch(function(err){
                    alert(err)
                    if(!self.stopped){
                        Model.Loader.hide();
                        showAuthentication();
                    }
                });
            }).catch(function(error){
                if(!self.stopped){
                    Model.Loader.hide();
                    $scope.popup = Ionic.$ionicPopup.alert({
                        title: $translate('networkErrorTitle'),
                        template: $translate('networkErrorTemplate'),
                        hideOnStageChange: true,
                        cssClass: 'animated rotateIn',
                        okType: 'button-assertive',
                    }).then(function(){
                        showAuthentication();
                    });
                }
            });
        };

        var currentAuthentication;

        $scope.login = function(){
            Model.Loader.show($scope);
            if($scope.popup && $scope.popup.close) {
                $scope.popup.close();
                $scope.popup = null;
            }

            currentAuthentication = new UserAuthentication();
        };

        $scope.logout = function(){
            Ionic.$ionicPopup.confirm({
                title: $translate('logOutTitle'),
                template: $translate('logOutTemplate'),
                okText: $translate('logOutOk'),
                okType: 'button-assertive',
                cancelText: $translate('cancelText'),
                cssClass: 'animated bounceInDown'
            }).then(function(res){
                res && Model.Auth.logout();
            });
        };

        $scope.stopLoading = function(){
            Ionic.$ionicLoading.hide();
            Model.Network.stop();
            currentAuthentication.stopped = true;
        };

        $scope.openAd = function(){
            Model.Audio.play('pikapi');
            Model.Admob.open();
        };

        $scope.exitApp = function () {
            ionic.Platform.exitApp();
        };

        Model.Audio.preload('pikapi');
    }
})();