// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'App' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic', 'ionic.cloud', 'ngCordova', 'ngAnimate', 'pascalprecht.translate', 'ngCordovaOauth', 'firebase', 'monospaced.elastic', 'angularMoment'])

    .run(['$ionicPlatform',
        '$animate',
        'myConfig',
        'Admob',
        'Store',
        'amMoment',
        '$rootScope',
        '$ionicDeploy',
        '$cordovaToast',
        '$ionicPopup',
        '$filter',
        function ($ionicPlatform, $animate, myConfig, Admob, Store, amMoment, $rootScope, $ionicDeploy, $cordovaToast, $ionicPopup, $filter) {

            var showAlert = function(msg){
                if(window.cordova){
                    $cordovaToast.showShortBottom(msg);
                }
                else{
                    alert(msg);
                }
            }
            
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                //Prepare Admob
                Admob.prepare();

                //Initialize Store
                Store.initialize();

                //Configure code push
                var $translate = $filter('translate');
                $ionicDeploy.channel = 'dev';
                showAlert('Checking new versions...');
                $ionicDeploy.check().then(function(snapshotAvailable) {
                    if (snapshotAvailable) {
                        $ionicDeploy.download().then(function() {
                            return $ionicDeploy.extract();
                        }).then(function() {
                            $ionicPopup.show({
                                title: $translate('cancelText'),
                                subTitle: $translate('updateDownloaded'),
                                buttons: [
                                    { 
                                        text: $translate('notNow') 
                                    },
                                    {
                                        text: $translate('restart'),
                                        onTap: function() {
                                            $ionicDeploy.load().then(function(){
                                                showAlert($translate('restarting'));
                                            }).cacth(function(err){
                                                showAlert(err);
                                            })
                                        }
                                    }
                                ]
                            });
                        }).cacth(function(err){
                            showAlert(err);
                        });
                    }
                }).cacth(function(err){
                    showAlert(err);
                });
            });

            //Enable Angular animation
            $animate.enabled(true);

            $rootScope.$on('$translateChangeEnd', function(data, current) {
                amMoment.changeLocale(current.language);
            })
        }])
    .config(['$stateProvider',
        '$urlRouterProvider',
        '$ionicConfigProvider',
        '$compileProvider',
        "$translateProvider",
        "$ionicCloudProvider",
        function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, $translateProvider, $ionicCloudProvider) {

            $ionicCloudProvider.init({
                "core": {
                    "app_id": "8d5cd27d"
                }
            });

            var config = {
                apiKey: "AIzaSyAkYJfW0D1EsDPElYqJoan3AH6X8agQr2k",
                authDomain: "pokedex-go-6f5f2.firebaseapp.com",
                databaseURL: "https://pokedex-go-6f5f2.firebaseio.com",
                projectId: "pokedex-go-6f5f2",
                storageBucket: "pokedex-go-6f5f2.appspot.com",
                messagingSenderId: "480841255520"
            };
            firebase.initializeApp(config);

            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content|ms-appx|x-wmapp0):|data:image\/|img\//);
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

            if (ionic.Platform.isIOS()) {
                $ionicConfigProvider.scrolling.jsScrolling(true);
            }

            $ionicConfigProvider.views.swipeBackEnabled(false);
            $ionicConfigProvider.navBar.alignTitle('right');

            $translateProvider.useStaticFilesLoader({
                prefix: 'language/',
                suffix: '.json'
            });

            $translateProvider.registerAvailableLanguageKeys(['en', 'es'], {
                'en_*': 'en',
                'es_*': 'es',
                '*': 'en'
            });

            $translateProvider.determinePreferredLanguage();
            $translateProvider.fallbackLanguage('en');

            var currentLang = window.localStorage.getItem('lang');
            if (currentLang) {
                $translateProvider.preferredLanguage(currentLang);
            }

            $translateProvider.useSanitizeValueStrategy('escape');

            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    controller: 'AppController',
                    templateUrl: 'templates/menu.html'
                })
                .state('app.home', {
                    url: "/home",
                    views: {
                        viewContent: {
                            templateUrl: "templates/home.html",
                            controller: 'HomeController'
                        }
                    }
                })
                .state('app.teams', {
                    url: "/teams",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    views: {
                        viewContent: {
                            templateUrl: "templates/teams.html",
                            controller: 'TeamsController'
                        }
                    }
                })
                .state('app.teams.chat', {
                    url: "/chat",
                    params: {
                        team: 'all',
                    },
                    cache: false,
                    auth: true,
                    views: {
                        'viewContent@app': {
                            templateUrl: "templates/chat.html",
                            controller: 'ChatController'
                        }
                    }
                })
                .state('app.credits', {
                    url: "/credits",
                    views: {
                        viewContent: {
                            templateUrl: "templates/credits.html",
                            controller: 'CreditsController'
                        }
                    }
                })
                .state('app.item', {
                    url: "/item/{title}",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/item.html",
                            controller: 'ItemController'
                        }
                    }
                })
                .state('app.findPokemon', {
                    url: "/findPokemon",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/findPokemon.html",
                            controller: 'FindPokemonController'
                        }
                    }
                })
                .state('app.events', {
                    url: "/events",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/events.html",
                            controller: 'EventsController'
                        }
                    }
                })
                .state('app.report', {
                    url: "/report",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/report.html",
                            controller: 'ReportController'
                        }
                    }
                })
                .state('app.myProfile', {
                    url: "/myProfile",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/myProfile.html",
                            controller: 'MyProfileController'
                        }
                    }
                })
                .state('app.pokeStops', {
                    url: "/pokeStops",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/pokeStops.html",
                            controller: 'PokeStopsController'
                        }
                    }
                })
                .state('app.calculator', {
                    url: "/calculator",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/calculator.html",
                            controller: 'CalculatorController'
                        }
                    }
                })
                .state('app.statistics', {
                    url: "/statistics",
                    params: {
                        title: null,
                        color: null,
                        icon: null
                    },
                    cache: false,
                    views: {
                        viewContent: {
                            templateUrl: "templates/statistics.html",
                            controller: 'StatisticsController'
                        }
                    }
                })

            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get("$state");
                $state.go("app.home");
            });
        }])
    .constant('myConfig', {
        googleClientId: "480841255520-eifl76bvrbtp9hv36ste5tc9eaqvjnif.apps.googleusercontent.com",
        firebaseUrl: "https://pokedex-go-6f5f2.firebaseio.com",
        firebaseMsgUrl: "",
        authEvents: {
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        },
        adMob: {
            id: 'ca-app-pub-1341604615212202/4710753178'
        }
    });
/* global ionic */
(function (angular, ionic) {
	"use strict";

	ionic.Platform.isIE = function () {
		return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
	}

	if (ionic.Platform.isIE()) {
		angular.module('ionic')
			.factory('$ionicNgClick', ['$parse', '$timeout', function ($parse, $timeout) {
				return function (scope, element, clickExpr) {
					var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);

					element.on('click', function (event) {
						scope.$apply(function () {
							if (scope.clicktimer) return; // Second call
							clickHandler(scope, { $event: (event) });
							scope.clicktimer = $timeout(function () { delete scope.clicktimer; }, 1, false);
						});
					});

					// Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
					// something else nearby.
					element.onclick = function (event) { };
				};
			}]);
	}

	function SelectDirective() {
		'use strict';

		return {
			restrict: 'E',
			replace: false,
			link: function (scope, element) {
				if (ionic.Platform && (ionic.Platform.isWindowsPhone() || ionic.Platform.isIE() || ionic.Platform.platform() === "edge")) {
					element.attr('data-tap-disabled', 'true');
				}
			}
		};
	}

	angular.module('ionic')
    .directive('select', SelectDirective);

	/*angular.module('ionic-datepicker')
	.directive('select', SelectDirective);*/

})(angular, ionic);
window.queries = [
	//Drop tables
   "DROP TABLE IF EXISTS Users;",
	//Create tables
	"CREATE TABLE Users (IdUser integer primary key autoincrement, Name text not null);",
	//Insert Users
	"INSERT INTO 'Users' ('Name') VALUES ('Juan David Nicholls Cardona');",
	"INSERT INTO 'Users' ('Name') VALUES ('Khriztian Moreno Zuluaga');",
	"INSERT INTO 'Users' ('Name') VALUES ('Cristian Rivas Buitrago');",
	"INSERT INTO 'Users' ('Name') VALUES ('Juan David Sánchez');",
	"INSERT INTO 'Users' ('Name') VALUES ('Nicolas Molina');",
	"INSERT INTO 'Users' ('Name') VALUES ('Miyamoto Musashi FIlander');",
	"INSERT INTO 'Users' ('Name') VALUES ('Didier Hernandez');",
	"INSERT INTO 'Users' ('Name') VALUES ('Luis Eduardo Oquendo Pérez');",
	"INSERT INTO 'Users' ('Name') VALUES ('Carlos Rojas');",
	"INSERT INTO 'Users' ('Name') VALUES ('Levano Castilla Carlos Miguel');"
];
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
(function() {
    'use strict';

    angular
        .module('App')
        .controller('CalculatorController', CalculatorController);

    CalculatorController.$inject = ['$scope', '$stateParams', 'Ionic', 'Angular'];

    function CalculatorController($scope, $stateParams, Ionic, Angular) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            Ionic.$ionicViewSwitcher.nextDirection('back');
            Ionic.$ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            Angular.$state.go('app.home');
        }

    }
})();
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
(function() {
'use strict';

    angular
        .module('App')
        .controller('CreditsController', CreditsController);

    CreditsController.$inject = ['$scope'];
    function CreditsController($scope) {
        
        
    }
})();
(function() {
    'use strict';

    angular
        .module('App')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function EventsController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }

    }
})();
(function() {
    'use strict';

    angular
        .module('App')
        .controller('FindPokemonController', FindPokemonController);

    FindPokemonController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function FindPokemonController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {

        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }
        $scope.names = [
            { name: "Ya" },
            { name: "Ya" },
            { name: "Ya" }
        ];
    }
})();

(function(firebase) {
'use strict';

    angular
        .module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Angular', 'Ionic', 'Model'];
    function HomeController($scope, Angular, Ionic, Model) {
        
        $scope.openItem = function(item){
            Angular.$state.go(item.state, { title: item.title, icon: item.icon, color: item.color });
        };
        $scope.currentLanguage = Angular.$translate.use();
        $scope.languages = Angular.$translate.getAvailableLanguageKeys();

        Ionic.$ionicPopover.fromTemplateUrl('templates/modals/changeLanguage.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });

        $scope.changeLanguage = function(lang){
            Angular.$translate.use(lang);
            $scope.currentLanguage = lang;
            window.localStorage.setItem('lang', lang);
            $scope.popover.hide();
        };

        Model.Audio.preload('pikachu');

        $scope.playAudio = function(){
            console.log('play')
            Model.Audio.play('pikachu');
        };

        $scope.initStore = function(){
            Model.Store.buy();
        };
    }
})(firebase);
(function() {
    'use strict';

    angular
        .module('App')
        .controller('ItemController', ItemController);

    ItemController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function ItemController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('App')
        .controller('MyProfileController', MyProfileController);

    MyProfileController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function MyProfileController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }

    }
})();
(function() {
    'use strict';

    angular
        .module('App')
        .controller('PokeStopsController', PokeStopsController);

    PokeStopsController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function PokeStopsController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }

    }
})();
(function() {
    'use strict';

    angular
        .module('App')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function ReportController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }

    }
})();
(function() {
    'use strict';

    angular
        .module('App')
        .controller('StatisticsController', StatisticsController);

    StatisticsController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function StatisticsController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }

    }
})();
(function() {
    'use strict';

    angular
        .module('App')
        .controller('TeamsController', TeamsController);

    TeamsController.$inject = ['$scope', '$stateParams'];

    function TeamsController($scope, $stateParams) {
        
        $scope.item = {
            title: $stateParams.title || 'teams',
            icon: $stateParams.icon || 'ion-android-globe'
        };
    }
})();
(function (Autolinker) {
    'use strict';

    angular
        .module('App')
        .directive('autolinker', autolinker);

    autolinker.$inject = ['$timeout'];
    function autolinker($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var eleHtml = element.html();

                    if (eleHtml === '') {
                        return false;
                    }

                    var text = Autolinker.link(eleHtml, {
                        className: 'autolinker',
                        newWindow: false
                    });

                    element.html(text);

                    var autolinks = element[0].getElementsByClassName('autolinker');

                    for (var i = 0; i < autolinks.length; i++) {
                        angular.element(autolinks[i]).bind('click', function (e) {
                            var href = e.target.href;
                            if (href) {
                                //window.open(href, '_system');
                                window.open(href, '_blank');
                            }
                            e.preventDefault();
                            return false;
                        });
                    }
                }, 0);
            }
        }
    }
})(Autolinker);
(function() {
    'use strict';

    angular
        .module('App')
        .directive('dayOrNight', dayOrNight);

    //dayOrNight.$inject = [''];
    function dayOrNight() {
        return {
			restrict: 'A',
			link: function (scope, element) {
                var className = "day";
                if((new Date()).getHours() >= 18){
                    className = "night";
                }
                element.addClass(className);
            }
        };
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('holdList', holdList);

	holdList.$inject = ['$ionicGesture'];
	function holdList($ionicGesture) {

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				$ionicGesture.on('hold', function (e) {

					var content = element[0].querySelector('.item-content');

					var buttons = element[0].querySelector('.item-options');
					var buttonsWidth = buttons.offsetWidth;

					ionic.requestAnimationFrame(function () {
						content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

						if (!buttons.classList.contains('invisible')) {
							content.style[ionic.CSS.TRANSFORM] = '';
							setTimeout(function () {
								buttons.classList.add('invisible');
							}, 250);
						} else {
							buttons.classList.remove('invisible');
							content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
						}
					});


				}, element);
			}
		};
	}
})();
(function() {
    'use strict';

    angular
        .module('App')
        .directive('img', img);

    img.$inject = ['$parse'];
    function img($parse) {
        function endsWith (url, path) {
            var index = url.length - path.length;
            return url.indexOf(path, index) !== -1;
        }
        
        return {
            restrict: 'E',
            link: function (scope, element, attributes) {        
                
                element.on('error', function (ev) {
                    var src = this.src;
                    var fn = attributes.ngError && $parse(attributes.ngError);
                    // If theres an ng-error callback then call it
                    if (fn) {
                        scope.$apply(function () {
                            fn(scope, { $event: ev, $src: src });
                        });
                    }
                    
                    // If theres an ng-error-src then set it
                    if (attributes.ngErrorSrc && !endsWith(src, attributes.ngErrorSrc)) {
                        element.attr('src', attributes.ngErrorSrc);
                    }
                });
                
                element.on('load', function(ev) {
                    var fn = attributes.ngSuccess && $parse(attributes.ngSuccess);
                    if(fn){
                        scope.$apply(function () {
                            fn(scope, { $event: ev });
                        });
                    }
                });
            }
        }
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('ionMultipleSelect', ionMultipleSelect);

	ionMultipleSelect.$inject = ['$ionicModal', '$ionicGesture'];
	function ionMultipleSelect($ionicModal, $ionicGesture) {

		return {
			restrict: 'E',
			scope: {
				options: "="
			},
			controller: function ($scope, $element, $attrs) {
				$scope.multipleSelect = {
					title: $attrs.title || "Select Options",
					tempOptions: [],
					keyProperty: $attrs.keyProperty || "id",
					valueProperty: $attrs.valueProperty || "value",
					selectedProperty: $attrs.selectedProperty || "selected",
					templateUrl: $attrs.templateUrl || 'templates/modals/multipleSelect.html',
					renderCheckbox: $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
					animation: $attrs.animation || 'slide-in-up'
				};

				$scope.OpenModalFromTemplate = function (templateUrl) {
					$ionicModal.fromTemplateUrl(templateUrl, {
						scope: $scope,
						animation: $scope.multipleSelect.animation
					}).then(function (modal) {
						$scope.modal = modal;
						$scope.modal.show();
					});
				};

				$ionicGesture.on('tap', function (e) {
					$scope.multipleSelect.tempOptions = $scope.options.map(function (option) {
						var tempOption = {};
						tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
						tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
						tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];

						return tempOption;
					});
					$scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
				}, $element);

				$scope.saveOptions = function () {
					for (var i = 0; i < $scope.multipleSelect.tempOptions.length; i++) {
						var tempOption = $scope.multipleSelect.tempOptions[i];
						for (var j = 0; j < $scope.options.length; j++) {
							var option = $scope.options[j];
							if (tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]) {
								option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
								break;
							}
						}
					}
					$scope.closeModal();
				};

				$scope.closeModal = function () {
					$scope.modal.remove();
				};
				$scope.$on('$destroy', function () {
					if ($scope.modal) {
						$scope.modal.remove();
					}
				});
			}
		};
	}
})();
(function() {
    'use strict';

    angular
        .module('App')
        .directive('resizeHeight', resizeHeight);

    resizeHeight.$inject = ['$window', '$timeout'];
    function resizeHeight($window, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var resizeElement = function(){
                    var height = element.parent()[0].offsetHeight;
                    var width = element.parent()[0].offsetWidth;
                    var scalePixels = height;
                    if(scalePixels > width){
                        scalePixels = width;
                    }
                    var scale = scalePixels / attrs.resizeHeight - 0.3;
                    if(scale < 1){
                        scale = 1;
                    }
                    element[0].style[ionic.CSS.TRANSFORM] = 'scale(' + scale + ')';
                };

                angular.element($window).bind('resize', function () {
                    resizeElement();
                });

                $timeout(function(){
                    resizeElement();
                }, 200);
            }
        };
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('ionSearchSelect', ionSearchSelect);

	ionSearchSelect.$inject = ['$ionicModal', '$ionicGesture'];
	function ionSearchSelect($ionicModal, $ionicGesture) {

		return {
			restrict: 'E',
			scope: {
				options: "=",
				optionSelected: "="
			},
			controller: function ($scope, $element, $attrs) {
				$scope.searchSelect = {
					title: $attrs.title || "Search",
					keyProperty: $attrs.keyProperty,
					valueProperty: $attrs.valueProperty,
					templateUrl: $attrs.templateUrl || 'templates/searchSelect.html',
					animation: $attrs.animation || 'slide-in-up',
					option: null,
					searchvalue: "",
					enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
				};

				$ionicGesture.on('tap', function (e) {

					if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
						if ($scope.optionSelected) {
							$scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
						}
					}
					else {
						$scope.searchSelect.option = $scope.optionSelected;
					}
					$scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
				}, $element);

				$scope.saveOption = function () {
					if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
						for (var i = 0; i < $scope.options.length; i++) {
							var currentOption = $scope.options[i];
							if (currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option) {
								$scope.optionSelected = currentOption;
								break;
							}
						}
					}
					else {
						$scope.optionSelected = $scope.searchSelect.option;
					}
					$scope.searchSelect.searchvalue = "";
					$scope.modal.remove();
				};

				$scope.clearSearch = function () {
					$scope.searchSelect.searchvalue = "";
				};

				$scope.closeModal = function () {
					$scope.modal.remove();
				};
				$scope.$on('$destroy', function () {
					if ($scope.modal) {
						$scope.modal.remove();
					}
				});

				$scope.OpenModalFromTemplate = function (templateUrl) {
					$ionicModal.fromTemplateUrl(templateUrl, {
						scope: $scope,
						animation: $scope.searchSelect.animation
					}).then(function (modal) {
						$scope.modal = modal;
						$scope.modal.show();
					});
				};
			}
		};
	}
})();
(function() {
'use strict';

    angular
        .module('App').filter('nl2br', ['$filter',
            function($filter) {
                return function(data) {
                    if (!data) return data;
                    return data.replace(/\n\r?/g, '<br />');
                };
            }
        ]);
})();
(function() {
'use strict';

    angular
        .module('App')
        .factory('Admob', Admob);

    Admob.$inject = ['myConfig', '$window', '$rootScope', '$interval'];
    function Admob(myConfig, $window, $rootScope, $interval) {

        var validateAdmob = function(){
            if(!$rootScope.admob){
                var currentDate = new Date();
                var localDate = new Date($window.localStorage["admobDate"] || (new Date()).setDate(currentDate.getDate() - 1));
                if(currentDate > localDate){
                    $rootScope.admob = true;
                }
            }
        };

        $interval(validateAdmob, 10000);
        validateAdmob();

        return {
            prepare : function(){
                $window.AdMob && $window.AdMob.prepareInterstitial({
                    adId: myConfig.adMob.id,
                    isTesting: true, // TODO: remove this line when release
                    autoShow: false
                });
            },
            open: function(){
                var self = this;

                $rootScope.admob = false;
                var currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + 5);
                $window.localStorage["admobDate"] = currentDate;
                $window.AdMob && $window.AdMob.showInterstitial(function(){
                    self.prepare();
                }, function(err){
                    self.prepare();
                });
            }
        };
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Angular', Angular);

	Angular.$inject = ['$state', '$timeout', '$rootScope', '$filter', '$translate', '$interval'];
	function Angular($state, $timeout, $rootScope, $filter, $translate, $interval) {

		return {
            $state: $state,
			$timeout: $timeout,
            $rootScope: $rootScope,
            $filter: $filter,
			$translate: $translate,
			$interval: $interval
		};
	}
})();
(function() {
'use strict';

    angular
        .module('App')
        .factory('Audio', Audio);

    Audio.$inject = ['$cordovaNativeAudio'];
    function Audio($cordovaNativeAudio) {

        return {
            preload : function(name, ext){
                ionic.Platform.ready(function(){
                    if(window.plugins && window.plugins.NativeAudio){
                        $cordovaNativeAudio.preloadComplex(name, 'audio/' + name + '.' + (ext || 'wav'), 1, 1, 0);
                    }
                });
            },
            play: function(name){
                if(window.plugins && window.plugins.NativeAudio){
                    $cordovaNativeAudio.play(name);
                }
            }
        };
    }
})();
(function(firebase) {
'use strict';

    angular
        .module('App')
        .factory('Auth', Auth);

    Auth.$inject = ['$q', '$firebaseAuth', 'myConfig', '$rootScope', '$state'];
    function Auth($q, $firebaseAuth, myConfig, $rootScope, $state) {

        $firebaseAuth().$onAuthStateChanged(function (user) {
            $rootScope.user = user;
            if(!user && $state.current && $state.current.auth){
                alert("Change state...");
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            if ('auth' in next) {
                if (!$rootScope.user && $state.current.name) {
                    event.preventDefault();
                    $rootScope.$broadcast(myConfig.authEvents.notAuthorized, {
                        next: next,
                        nextParams: nextParams
                    });
                }
            }
        });

        var scopes = [
            "email",
            "profile",
            "https://www.googleapis.com/auth/plus.me",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/games"
        ];

        var _nativeLogin = function(){
            return $q(function(resolve, reject) {
                window.plugins.googleplus.login(
                    {
                        'scopes': scopes.join(' '),
                        'webClientId': myConfig.googleClientId,
                        'offline': true,
                },
                function (res) {
                    resolve(res);
                },
                function (msg) {
                    reject(msg);
                }
                );
            });
        }
        
        return {
            login : function () {
                if(ionic.Platform.isWebView()){
                    return _nativeLogin().then(function (result) {
                        var credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
                        return firebase.auth().signInWithCredential(credential);
                    });
                }
                else{
                    var provider = new firebase.auth.GoogleAuthProvider();
                    scopes.forEach(function(scope){
                        provider.addScope(scope);
                    });
                    return firebase.auth().signInWithPopup(provider);
                }
            },
            logout: function(){
                return firebase.auth().signOut();
            }
        };
    }
})(firebase);
(function(firebase, GeoFire) {
'use strict';

    angular
        .module('App')
        .factory('Chat', Chat);

    Chat.$inject = ['$timeout'];
    function Chat($timeout) {

        var ref;
        var chatRef;
        var messagesRef;
        var geoFire;
        var geoQuery;
        var currentTeamRef;
        var currentPosition;

        return {
            initialize: function(team){
                team = team || "all";
                ref = firebase.database().ref();
                chatRef = ref.child("chat");
                messagesRef = chatRef.child("messages");
                currentTeamRef = messagesRef.child(team);
                geoFire = new GeoFire(chatRef.child("locations").child(team));
            },
            addEmptyMessage: function(){
                var key = currentTeamRef.push().key;
                return {
                    path: currentTeamRef.toString().substring(currentTeamRef.root.toString().length - 1),
                    key: key
                };
            },
            updateMessageAndLocation: function(path, key, message){
                ref.child(path + "/" + key).update(message);
                geoFire.set(key, [currentPosition.coords.latitude, currentPosition.coords.longitude]);
            },
            addMessageAndLocation : function(message){
                var key = currentTeamRef.push(message).key;
                geoFire.set(key, [currentPosition.coords.latitude, currentPosition.coords.longitude]);
            },
            createGeoQuery: function(messages, $scope, position, rad){
                currentPosition = position;
                geoQuery = geoFire.query({
                    center: [position.coords.latitude, position.coords.longitude],
                    radius: rad || 15
                });
                geoQuery.on("key_entered", function(key, location, distance) {
                    currentTeamRef.orderByKey().equalTo(key).once('value').then(function(snapshot) {
                        var data = snapshot.val();
                        if(data){
                            $scope.$apply(function(){
                                messages.push(data[key]);
                            });
                        }
                    });
                });
            },
            updateGeoQuery: function(position){
                geoQuery && geoQuery.updateCriteria({
                    center: [position.coords.latitude, position.coords.longitude]
                });
            },
            destroyGeoQuery: function(){
                geoQuery && geoQuery.cancel();
            }
        };
    }
})(firebase, GeoFire);
(function() {
'use strict';

    angular
        .module('App')
        .factory('Geolocation', Geolocation);

    Geolocation.$inject = ['$cordovaGeolocation'];
    function Geolocation($cordovaGeolocation) {

        return {
            getLocation : function(options){
                options = options || {maximumAge: 10000, timeout: 5000, enableHighAccuracy: false};
                return $cordovaGeolocation.getCurrentPosition(options);
            }
        };
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Ionic', Ionic);

	Ionic.$inject = ['$ionicActionSheet', '$ionicScrollDelegate', '$ionicViewSwitcher', '$ionicHistory', '$ionicPopup', '$ionicLoading', '$ionicPopover'];
	function Ionic($ionicActionSheet, $ionicScrollDelegate, $ionicViewSwitcher, $ionicHistory, $ionicPopup, $ionicLoading, $ionicPopover) {

		return {
			$ionicActionSheet: $ionicActionSheet,
            $ionicScrollDelegate: $ionicScrollDelegate,
            $ionicViewSwitcher: $ionicViewSwitcher,
            $ionicHistory: $ionicHistory,
            $ionicPopup: $ionicPopup,
            $ionicLoading: $ionicLoading,
			$ionicPopover: $ionicPopover
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Loader', Loader);

	Loader.$inject = ['$ionicLoading'];
	function Loader($ionicLoading) {

		return {
			show: function($scope){
                $ionicLoading.show({
                    templateUrl: 'templates/modals/loader.html',
                    scope: $scope,
                    hideOnStageChange: true
                });
            },
            hide: function(){
                $ionicLoading.hide();
            }
		};
	}
})();
(function(firebase) {
'use strict';

    angular
        .module('App')
        .factory('Media', Media);

    Media.$inject = ['$q', '$ionicActionSheet', '$window', '$cordovaCamera', '$filter', '$timeout', '$cordovaFile', 'Utilities'];
    function Media($q, $ionicActionSheet, $window, $cordovaCamera, $filter, $timeout, $cordovaFile, Utilities) {
        
        var $translate = $filter('translate');

        return {
            uploadFile: function(imageData, folderName, uniqueFileName){
                var deferred = $q.defer();
                var imageBlob = Utilities.b64toBlob(imageData);
                var storageRef = firebase.storage().ref(folderName);
                var uploadTask = storageRef.child(uniqueFileName + ".jpg").put(imageBlob);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                    var progress = snapshot.bytesTransferred * 100 / snapshot.totalBytes;
                    deferred.notify(progress);
                }, function (error) {
                    deferred.reject(error);
                }, function () {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    deferred.resolve(downloadURL);
                });
                return deferred.promise;
            },
            getPhoto: function(){
                return $q(function(resolve, reject) {
                    $ionicActionSheet.show({
                        buttons: [
                            { text: $translate('takePhoto') },
                            { text: $translate('photoFromLibrary') }
                        ],
                        titleText: $translate('loadImage'),
                        cancelText: $translate("cancelText"),
                        cancel: function() {
                            reject('CANCEL');
                        },
                        buttonClicked: function(index) {
                            if(ionic.Platform.isWebView()){
                                var source = $window.Camera.PictureSourceType.CAMERA;
                                if(index === 1){
                                    source = $window.Camera.PictureSourceType.PHOTOLIBRARY;
                                }
                                $cordovaCamera.getPicture({
                                    quality: 50,
                                    targetWidth: 320,
                                    destinationType: $window.Camera.DestinationType.DATA_URL,
                                    sourceType: source,
                                    allowEdit: false,
                                    encodingType: $window.Camera.EncodingType.JPEG,
                                    popoverOptions: $window.CameraPopoverOptions,
                                    saveToPhotoAlbum: false,
                                    correctOrientation: true
                                }).then(function(imageData) {
                                    resolve(imageData);
                                }).catch(function(err){
                                    reject(err);
                                });
                            }
                            else{
                                reject('BROWSER');
                            }
                            return true;
                        }
                    });
                });
            }
        };
    }
})(firebase);
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Modals', Modals);

	Modals.$inject = ['$ionicModal'];
	function Modals($ionicModal) {

		var modals = [];

		var _openModal = function ($scope, templateUrl, animation) {
			return $ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: animation || 'slide-in-up',
				backdropClickToClose: false
			}).then(function (modal) {
				modals.push(modal);
				modal.show();
			});
		};

		var _closeModal = function () {
			var currentModal = modals.splice(-1, 1)[0];
			currentModal.remove();
		};

		var _closeAllModals = function () {
			modals.map(function (modal) {
				modal.remove();
			});
			modals = [];
		};

		return {
			openModal: _openModal,
			closeModal: _closeModal,
			closeAllModals: _closeAllModals
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Model', Model);

	Model.$inject = ['Geolocation', 'Auth', 'Network', 'Admob', 'Audio', 'Chat', 'Loader', 'Media', 'Modals', 'Store'];
	function Model(Geolocation, Auth, Network, Admob, Audio, Chat, Loader, Media, Modals, Store) {

		return {
			Geolocation: Geolocation,
			Auth: Auth,
			Network: Network,
			Admob: Admob,
			Audio: Audio,
			Chat: Chat,
			Loader: Loader,
			Media: Media,
			Modals: Modals,
			Store: Store
		};
	}
})();
(function() {
'use strict';

    angular
        .module('App')
        .factory('Network', Network);

    Network.$inject = ['$timeout', '$interval', '$cordovaNetwork', '$q'];
    function Network($timeout, $interval, $cordovaNetwork, $q) {

        var deferred, intervalPromise, timeOutPromise;

        var tryToConnect = function(maxTime){
            deferred = $q.defer();
            maxTime = maxTime || 5000;
            if(ionic.Platform.isWebView()){
                intervalPromise = $interval(function(){
                    if($cordovaNetwork.isOnline()){
                        cancelPromises();
                        deferred.resolve('OK');
                    }
                }, 1000);
                timeOutPromise = $timeout(function(){
                    cancelPromises();
                    deferred.reject('TIMEOUT');
                }, maxTime);
            }
            else{
                deferred.resolve('OK');
            }
            return deferred.promise;
        };

        var cancelPromise = function(promise, $service){
            promise && $service.cancel(promise);
            promise = null;
        };

        var cancelPromises = function(){
            cancelPromise(intervalPromise, $interval);
            cancelPromise(timeOutPromise, $timeout);
        };

        var stop = function(){
            cancelPromises();
            deferred && deferred.reject('STOPPED');
        };
        
        return {
            tryToConnect: tryToConnect,
            stop: stop
        };
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Store', Store);

	Store.$inject = ['$window', '$rootScope'];
	function Store($window, $rootScope) {

        var store = $window.store;

        var getInfo = function(){
            var product = store.get('co.nicholls.pokedexgo.removeads');

            $rootScope.showAds = !product.owned;
            if(product.owned){
                store.off(getInfo);
            }
        };

		return {
			initialize: function(){
                store = $window.store;
                if(store){
                    store.verbosity = store.INFO;
                    store.register({
                        id:    'co.nicholls.pokedexgo.removeads',
                        alias: 'Remove Ads',
                        type:   store.NON_CONSUMABLE
                    });
                    
                    store.ready(function() {
                        getInfo();                        
                        store.when("Remove Ads")
                        .loaded(function(product){
                            alert("loaded");
                        })
                        .updated(getInfo)
                        .approved(function (product) {
                            //log('You just unlocked the FULL VERSION!');
                            $rootScope.showAds = false;
                            alert("approved");
                            product.finish();
                        })
                        .owned(function(product) {
                            //product.finish();
                            alert("owned");
                        })
                        .refunded(function(product) {
                            alert("refunded");
                        })
                        .error(function(product){
                            alert("error");
                        })
                        .cancelled(function(product){
                            alert("cancelled");
                        });
                    });

                    store.refresh();
                }
                else{
                    $rootScope.showAds = true;
                }
            },
            buy: function(){
                if($rootScope.showAds){
                    store.order('Remove Ads');
                }
            }
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Utilities', Utilities);

	//Utilities.$inject = [];
	function Utilities() {

		return {
            b64toBlob: function(b64Data, contentType, sliceSize){
                contentType = contentType || 'image/png';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);
                
                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                
                    var byteArray = new Uint8Array(byteNumbers);
                
                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, {type: contentType});
                return blob;
            },
            dataURLtoBlob: function(dataURL, contentType){
                contentType = contentType || 'image/png';
                // Decode the dataURL   
                var binary = atob(dataURL.split(',')[1]);
                // Create 8-bit unsigned array
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                // Return our Blob object
                return new Blob([new Uint8Array(array)], { type: contentType });
            }
		};
	}
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImlzc3Vlcy5qcyIsInF1ZXJpZXMuanMiLCJjb250cm9sbGVycy9hcHAuanMiLCJjb250cm9sbGVycy9jYWxjdWxhdG9yLmpzIiwiY29udHJvbGxlcnMvY2hhdC5qcyIsImNvbnRyb2xsZXJzL2NyZWRpdHMuanMiLCJjb250cm9sbGVycy9ldmVudHMuanMiLCJjb250cm9sbGVycy9maW5kUG9rZW1vbi5qcyIsImNvbnRyb2xsZXJzL2hvbWUuanMiLCJjb250cm9sbGVycy9pdGVtLmpzIiwiY29udHJvbGxlcnMvbXlQcm9maWxlLmpzIiwiY29udHJvbGxlcnMvcG9rZVN0b3BzLmpzIiwiY29udHJvbGxlcnMvcmVwb3J0LmpzIiwiY29udHJvbGxlcnMvc3RhdGlzdGljcy5qcyIsImNvbnRyb2xsZXJzL3RlYW1zLmpzIiwiZGlyZWN0aXZlcy9hdXRvbGlua2VyLmpzIiwiZGlyZWN0aXZlcy9kYXlPck5pZ2h0LmpzIiwiZGlyZWN0aXZlcy9ob2xkTGlzdC5qcyIsImRpcmVjdGl2ZXMvaW1nLmpzIiwiZGlyZWN0aXZlcy9tdWx0aXBsZVNlbGVjdC5qcyIsImRpcmVjdGl2ZXMvcmVzaXplSGVpZ2h0LmpzIiwiZGlyZWN0aXZlcy9zZWFyY2hTZWxlY3QuanMiLCJmaWx0ZXJzL2VtcHR5UmVwbGFjZS5qcyIsInNlcnZpY2VzL2FkbW9iLmpzIiwic2VydmljZXMvYW5ndWxhci5qcyIsInNlcnZpY2VzL2F1ZGlvLmpzIiwic2VydmljZXMvYXV0aC5qcyIsInNlcnZpY2VzL2NoYXQuanMiLCJzZXJ2aWNlcy9nZW9sb2NhdGlvbi5qcyIsInNlcnZpY2VzL2lvbmljLmpzIiwic2VydmljZXMvbG9hZGVyLmpzIiwic2VydmljZXMvbWVkaWEuanMiLCJzZXJ2aWNlcy9tb2RhbHMuanMiLCJzZXJ2aWNlcy9tb2RlbC5qcyIsInNlcnZpY2VzL25ldHdvcmsuanMiLCJzZXJ2aWNlcy9zdG9yZS5qcyIsInNlcnZpY2VzL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25WQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ0FwcCcgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbmFuZ3VsYXIubW9kdWxlKCdBcHAnLCBbJ2lvbmljJywgJ2lvbmljLmNsb3VkJywgJ25nQ29yZG92YScsICduZ0FuaW1hdGUnLCAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsICduZ0NvcmRvdmFPYXV0aCcsICdmaXJlYmFzZScsICdtb25vc3BhY2VkLmVsYXN0aWMnLCAnYW5ndWxhck1vbWVudCddKVxuXG4gICAgLnJ1bihbJyRpb25pY1BsYXRmb3JtJyxcbiAgICAgICAgJyRhbmltYXRlJyxcbiAgICAgICAgJ215Q29uZmlnJyxcbiAgICAgICAgJ0FkbW9iJyxcbiAgICAgICAgJ1N0b3JlJyxcbiAgICAgICAgJ2FtTW9tZW50JyxcbiAgICAgICAgJyRyb290U2NvcGUnLFxuICAgICAgICAnJGlvbmljRGVwbG95JyxcbiAgICAgICAgJyRjb3Jkb3ZhVG9hc3QnLFxuICAgICAgICAnJGlvbmljUG9wdXAnLFxuICAgICAgICAnJGZpbHRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkaW9uaWNQbGF0Zm9ybSwgJGFuaW1hdGUsIG15Q29uZmlnLCBBZG1vYiwgU3RvcmUsIGFtTW9tZW50LCAkcm9vdFNjb3BlLCAkaW9uaWNEZXBsb3ksICRjb3Jkb3ZhVG9hc3QsICRpb25pY1BvcHVwLCAkZmlsdGVyKSB7XG5cbiAgICAgICAgICAgIHZhciBzaG93QWxlcnQgPSBmdW5jdGlvbihtc2cpe1xuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5jb3Jkb3ZhKXtcbiAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFUb2FzdC5zaG93U2hvcnRCb3R0b20obXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQobXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAgICAgICAgICAgICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCByZW1vdmUgdGhpcyBsaW5lIHVubGVzcyB5b3Uga25vdyB3aGF0IHlvdSBhcmUgZG9pbmcuIEl0IHN0b3BzIHRoZSB2aWV3cG9ydFxuICAgICAgICAgICAgICAgICAgICAvLyBmcm9tIHNuYXBwaW5nIHdoZW4gdGV4dCBpbnB1dHMgYXJlIGZvY3VzZWQuIElvbmljIGhhbmRsZXMgdGhpcyBpbnRlcm5hbGx5IGZvclxuICAgICAgICAgICAgICAgICAgICAvLyBhIG11Y2ggbmljZXIga2V5Ym9hcmQgZXhwZXJpZW5jZS5cbiAgICAgICAgICAgICAgICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAgICAgICAgICAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL1ByZXBhcmUgQWRtb2JcbiAgICAgICAgICAgICAgICBBZG1vYi5wcmVwYXJlKCk7XG5cbiAgICAgICAgICAgICAgICAvL0luaXRpYWxpemUgU3RvcmVcbiAgICAgICAgICAgICAgICBTdG9yZS5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgICAgICAvL0NvbmZpZ3VyZSBjb2RlIHB1c2hcbiAgICAgICAgICAgICAgICB2YXIgJHRyYW5zbGF0ZSA9ICRmaWx0ZXIoJ3RyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgICRpb25pY0RlcGxveS5jaGFubmVsID0gJ2Rldic7XG4gICAgICAgICAgICAgICAgc2hvd0FsZXJ0KCdDaGVja2luZyBuZXcgdmVyc2lvbnMuLi4nKTtcbiAgICAgICAgICAgICAgICAkaW9uaWNEZXBsb3kuY2hlY2soKS50aGVuKGZ1bmN0aW9uKHNuYXBzaG90QXZhaWxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzbmFwc2hvdEF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljRGVwbG95LmRvd25sb2FkKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGlvbmljRGVwbG95LmV4dHJhY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlKCdjYW5jZWxUZXh0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YlRpdGxlOiAkdHJhbnNsYXRlKCd1cGRhdGVEb3dubG9hZGVkJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJHRyYW5zbGF0ZSgnbm90Tm93JykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICR0cmFuc2xhdGUoJ3Jlc3RhcnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblRhcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0RlcGxveS5sb2FkKCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FsZXJ0KCR0cmFuc2xhdGUoJ3Jlc3RhcnRpbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhY3RoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93QWxlcnQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhY3RoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FsZXJ0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhY3RoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGVydChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vRW5hYmxlIEFuZ3VsYXIgYW5pbWF0aW9uXG4gICAgICAgICAgICAkYW5pbWF0ZS5lbmFibGVkKHRydWUpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHRyYW5zbGF0ZUNoYW5nZUVuZCcsIGZ1bmN0aW9uKGRhdGEsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBhbU1vbWVudC5jaGFuZ2VMb2NhbGUoY3VycmVudC5sYW5ndWFnZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSlcbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLFxuICAgICAgICAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICAgICAgJyRpb25pY0NvbmZpZ1Byb3ZpZGVyJyxcbiAgICAgICAgJyRjb21waWxlUHJvdmlkZXInLFxuICAgICAgICBcIiR0cmFuc2xhdGVQcm92aWRlclwiLFxuICAgICAgICBcIiRpb25pY0Nsb3VkUHJvdmlkZXJcIixcbiAgICAgICAgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRpb25pY0NvbmZpZ1Byb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCAkdHJhbnNsYXRlUHJvdmlkZXIsICRpb25pY0Nsb3VkUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJGlvbmljQ2xvdWRQcm92aWRlci5pbml0KHtcbiAgICAgICAgICAgICAgICBcImNvcmVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFwcF9pZFwiOiBcIjhkNWNkMjdkXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5QWtZSmZXMEQxRXNEUEVsWXFKb2FuM0FINlg4YWdRcjJrXCIsXG4gICAgICAgICAgICAgICAgYXV0aERvbWFpbjogXCJwb2tlZGV4LWdvLTZmNWYyLmZpcmViYXNlYXBwLmNvbVwiLFxuICAgICAgICAgICAgICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcG9rZWRleC1nby02ZjVmMi5maXJlYmFzZWlvLmNvbVwiLFxuICAgICAgICAgICAgICAgIHByb2plY3RJZDogXCJwb2tlZGV4LWdvLTZmNWYyXCIsXG4gICAgICAgICAgICAgICAgc3RvcmFnZUJ1Y2tldDogXCJwb2tlZGV4LWdvLTZmNWYyLmFwcHNwb3QuY29tXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNDgwODQxMjU1NTIwXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICRjb21waWxlUHJvdmlkZXIuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfGZpbGV8YmxvYnxjb250ZW50fG1zLWFwcHh8eC13bWFwcDApOnxkYXRhOmltYWdlXFwvfGltZ1xcLy8pO1xuICAgICAgICAgICAgJGNvbXBpbGVQcm92aWRlci5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZ0cHxtYWlsdG98ZmlsZXxnaHR0cHM/fG1zLWFwcHh8eC13bWFwcDApOi8pO1xuXG4gICAgICAgICAgICBpZiAoaW9uaWMuUGxhdGZvcm0uaXNJT1MoKSkge1xuICAgICAgICAgICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnNjcm9sbGluZy5qc1Njcm9sbGluZyh0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIudmlld3Muc3dpcGVCYWNrRW5hYmxlZChmYWxzZSk7XG4gICAgICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5uYXZCYXIuYWxpZ25UaXRsZSgncmlnaHQnKTtcblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVN0YXRpY0ZpbGVzTG9hZGVyKHtcbiAgICAgICAgICAgICAgICBwcmVmaXg6ICdsYW5ndWFnZS8nLFxuICAgICAgICAgICAgICAgIHN1ZmZpeDogJy5qc29uJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ2VuJywgJ2VzJ10sIHtcbiAgICAgICAgICAgICAgICAnZW5fKic6ICdlbicsXG4gICAgICAgICAgICAgICAgJ2VzXyonOiAnZXMnLFxuICAgICAgICAgICAgICAgICcqJzogJ2VuJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci5kZXRlcm1pbmVQcmVmZXJyZWRMYW5ndWFnZSgpO1xuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLmZhbGxiYWNrTGFuZ3VhZ2UoJ2VuJyk7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50TGFuZyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFuZycpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRMYW5nKSB7XG4gICAgICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKGN1cnJlbnRMYW5nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlJyk7XG5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcHAnLFxuICAgICAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FwcENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tZW51Lmh0bWwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5ob21lJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2hvbWVcIixcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2hvbWUuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAudGVhbXMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVhbXNcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvdGVhbXMuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUZWFtc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnRlYW1zLmNoYXQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY2hhdFwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW06ICdhbGwnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGF1dGg6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndmlld0NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9jaGF0Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hhdENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNyZWRpdHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY3JlZGl0c1wiLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvY3JlZGl0cy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWRpdHNDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5pdGVtJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2l0ZW0ve3RpdGxlfVwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2l0ZW0uaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJdGVtQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuZmluZFBva2Vtb24nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvZmluZFBva2Vtb25cIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9maW5kUG9rZW1vbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZpbmRQb2tlbW9uQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2V2ZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2V2ZW50cy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50c0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZXBvcnRcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9yZXBvcnQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5teVByb2ZpbGUnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvbXlQcm9maWxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvbXlQcm9maWxlLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTXlQcm9maWxlQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAucG9rZVN0b3BzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3Bva2VTdG9wc1wiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Bva2VTdG9wcy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Bva2VTdG9wc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNhbGN1bGF0b3InLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY2FsY3VsYXRvclwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2NhbGN1bGF0b3IuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYWxjdWxhdG9yQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuc3RhdGlzdGljcycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9zdGF0aXN0aWNzXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvc3RhdGlzdGljcy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1N0YXRpc3RpY3NDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgJHN0YXRlID0gJGluamVjdG9yLmdldChcIiRzdGF0ZVwiKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuaG9tZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XSlcbiAgICAuY29uc3RhbnQoJ215Q29uZmlnJywge1xuICAgICAgICBnb29nbGVDbGllbnRJZDogXCI0ODA4NDEyNTU1MjAtZWlmbDc2YnZyYnRwOWh2MzZzdGU1dGM5ZWFxdmpuaWYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIixcbiAgICAgICAgZmlyZWJhc2VVcmw6IFwiaHR0cHM6Ly9wb2tlZGV4LWdvLTZmNWYyLmZpcmViYXNlaW8uY29tXCIsXG4gICAgICAgIGZpcmViYXNlTXNnVXJsOiBcIlwiLFxuICAgICAgICBhdXRoRXZlbnRzOiB7XG4gICAgICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICAgICAgfSxcbiAgICAgICAgYWRNb2I6IHtcbiAgICAgICAgICAgIGlkOiAnY2EtYXBwLXB1Yi0xMzQxNjA0NjE1MjEyMjAyLzQ3MTA3NTMxNzgnXG4gICAgICAgIH1cbiAgICB9KTsiLCIvKiBnbG9iYWwgaW9uaWMgKi9cbihmdW5jdGlvbiAoYW5ndWxhciwgaW9uaWMpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aW9uaWMuUGxhdGZvcm0uaXNJRSA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gaW9uaWMuUGxhdGZvcm0udWEudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd0cmlkZW50JykgPiAtMTtcblx0fVxuXG5cdGlmIChpb25pYy5QbGF0Zm9ybS5pc0lFKCkpIHtcblx0XHRhbmd1bGFyLm1vZHVsZSgnaW9uaWMnKVxuXHRcdFx0LmZhY3RvcnkoJyRpb25pY05nQ2xpY2snLCBbJyRwYXJzZScsICckdGltZW91dCcsIGZ1bmN0aW9uICgkcGFyc2UsICR0aW1lb3V0KSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGNsaWNrRXhwcikge1xuXHRcdFx0XHRcdHZhciBjbGlja0hhbmRsZXIgPSBhbmd1bGFyLmlzRnVuY3Rpb24oY2xpY2tFeHByKSA/IGNsaWNrRXhwciA6ICRwYXJzZShjbGlja0V4cHIpO1xuXG5cdFx0XHRcdFx0ZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jbGlja3RpbWVyKSByZXR1cm47IC8vIFNlY29uZCBjYWxsXG5cdFx0XHRcdFx0XHRcdGNsaWNrSGFuZGxlcihzY29wZSwgeyAkZXZlbnQ6IChldmVudCkgfSk7XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNsaWNrdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7IGRlbGV0ZSBzY29wZS5jbGlja3RpbWVyOyB9LCAxLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIEhhY2sgZm9yIGlPUyBTYWZhcmkncyBiZW5lZml0LiBJdCBnb2VzIHNlYXJjaGluZyBmb3Igb25jbGljayBoYW5kbGVycyBhbmQgaXMgbGlhYmxlIHRvIGNsaWNrXG5cdFx0XHRcdFx0Ly8gc29tZXRoaW5nIGVsc2UgbmVhcmJ5LlxuXHRcdFx0XHRcdGVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChldmVudCkgeyB9O1xuXHRcdFx0XHR9O1xuXHRcdFx0fV0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gU2VsZWN0RGlyZWN0aXZlKCkge1xuXHRcdCd1c2Ugc3RyaWN0JztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogZmFsc2UsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcblx0XHRcdFx0aWYgKGlvbmljLlBsYXRmb3JtICYmIChpb25pYy5QbGF0Zm9ybS5pc1dpbmRvd3NQaG9uZSgpIHx8IGlvbmljLlBsYXRmb3JtLmlzSUUoKSB8fCBpb25pYy5QbGF0Zm9ybS5wbGF0Zm9ybSgpID09PSBcImVkZ2VcIikpIHtcblx0XHRcdFx0XHRlbGVtZW50LmF0dHIoJ2RhdGEtdGFwLWRpc2FibGVkJywgJ3RydWUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRhbmd1bGFyLm1vZHVsZSgnaW9uaWMnKVxuICAgIC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7XG5cblx0Lyphbmd1bGFyLm1vZHVsZSgnaW9uaWMtZGF0ZXBpY2tlcicpXG5cdC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7Ki9cblxufSkoYW5ndWxhciwgaW9uaWMpOyIsIndpbmRvdy5xdWVyaWVzID0gW1xuXHQvL0Ryb3AgdGFibGVzXG4gICBcIkRST1AgVEFCTEUgSUYgRVhJU1RTIFVzZXJzO1wiLFxuXHQvL0NyZWF0ZSB0YWJsZXNcblx0XCJDUkVBVEUgVEFCTEUgVXNlcnMgKElkVXNlciBpbnRlZ2VyIHByaW1hcnkga2V5IGF1dG9pbmNyZW1lbnQsIE5hbWUgdGV4dCBub3QgbnVsbCk7XCIsXG5cdC8vSW5zZXJ0IFVzZXJzXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdKdWFuIERhdmlkIE5pY2hvbGxzIENhcmRvbmEnKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0tocml6dGlhbiBNb3Jlbm8gWnVsdWFnYScpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnQ3Jpc3RpYW4gUml2YXMgQnVpdHJhZ28nKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0p1YW4gRGF2aWQgU8OhbmNoZXonKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ05pY29sYXMgTW9saW5hJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdNaXlhbW90byBNdXNhc2hpIEZJbGFuZGVyJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdEaWRpZXIgSGVybmFuZGV6Jyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdMdWlzIEVkdWFyZG8gT3F1ZW5kbyBQw6lyZXonKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0NhcmxvcyBSb2phcycpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnTGV2YW5vIENhc3RpbGxhIENhcmxvcyBNaWd1ZWwnKTtcIlxuXTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKTtcblxuICAgIEFwcENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ215Q29uZmlnJywgJ0lvbmljJywgJ01vZGVsJywgJ0FuZ3VsYXInXTtcbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRzY29wZSwgbXlDb25maWcsIElvbmljLCBNb2RlbCwgQW5ndWxhcikge1xuICAgICAgICBcbiAgICAgICAgdmFyICR0cmFuc2xhdGUgPSBBbmd1bGFyLiRmaWx0ZXIoJ3RyYW5zbGF0ZScpO1xuXG4gICAgICAgICRzY29wZS5pdGVtcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJpb24tY2hhdGJveGVzXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwidGVhbXNcIixcbiAgICAgICAgICAgICAgICBzdGF0ZTogJ2FwcC50ZWFtcycsXG4gICAgICAgICAgICAgICAgaW1nOiBcImltZy9wb2tlc3RvcC5zdmdcIixcbiAgICAgICAgICAgICAgICBsZWZ0OiBcIjg4cHhcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1pb3MtcGVvcGxlXCIsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6IFwiY3JlZGl0c1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiBcImFwcC5jcmVkaXRzXCJcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tZWFydGhcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJldmVudHNcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5ldmVudHMnXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1jbGlwYm9hcmRcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJyZXBvcnRcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5yZXBvcnQnXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1wZXJzb25cIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJteV9wcm9maWxlXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6ICdhcHAubXlQcm9maWxlJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tYW5kcm9pZC1jYXJ0XCIsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6IFwicG9rZV9zdG9wc1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLnBva2VTdG9wcydcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWNhbGN1bGF0b3JcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJjYWxjdWxhdG9yXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6ICdhcHAuY2FsY3VsYXRvcidcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWNvbm5lY3Rpb24tYmFyc1wiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcInN0YXRpc3RpY3NcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5zdGF0aXN0aWNzJ1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBzaG93QXV0aGVudGljYXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnBvcHVwID0gSW9uaWMuJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2xvZ0luVGl0bGUnKSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tb2RhbHMvYXV0aC5odG1sJyxcbiAgICAgICAgICAgICAgICBoaWRlT25TdGF0ZUNoYW5nZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBva1RleHQ6ICR0cmFuc2xhdGUoJ2NhbmNlbFRleHQnKSxcbiAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2FuaW1hdGVkIHJvbGxJbidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBuZXh0U3RhdGUgPSBudWxsO1xuXG4gICAgICAgICRzY29wZS4kb24obXlDb25maWcuYXV0aEV2ZW50cy5ub3RBdXRob3JpemVkLCBmdW5jdGlvbihldmVudCwgYXJncykge1xuICAgICAgICAgICAgbmV4dFN0YXRlID0ge1xuICAgICAgICAgICAgICAgIG5leHQ6IGFyZ3MubmV4dCxcbiAgICAgICAgICAgICAgICBuZXh0UGFyYW1zOiBhcmdzLm5leHRQYXJhbXNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzaG93QXV0aGVudGljYXRpb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIFVzZXJBdXRoZW50aWNhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLnN0b3BwZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgTW9kZWwuTmV0d29yay50cnlUb0Nvbm5lY3QoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgTW9kZWwuQXV0aC5sb2dpbigpLnRoZW4oZnVuY3Rpb24oYXV0aCl7XG4gICAgICAgICAgICAgICAgICAgIE1vZGVsLkxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKG5leHRTdGF0ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBBbmd1bGFyLiRyb290U2NvcGUudXNlciA9IGF1dGgudXNlciB8fCBhdXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgQW5ndWxhci4kc3RhdGUuZ28obmV4dFN0YXRlLm5leHQsIG5leHRTdGF0ZS5uZXh0UGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIpXG4gICAgICAgICAgICAgICAgICAgIGlmKCFzZWxmLnN0b3BwZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgaWYoIXNlbGYuc3RvcHBlZCl7XG4gICAgICAgICAgICAgICAgICAgIE1vZGVsLkxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wb3B1cCA9IElvbmljLiRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlKCduZXR3b3JrRXJyb3JUaXRsZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUoJ25ldHdvcmtFcnJvclRlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlT25TdGFnZUNoYW5nZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnYW5pbWF0ZWQgcm90YXRlSW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWFzc2VydGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY3VycmVudEF1dGhlbnRpY2F0aW9uO1xuXG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5Mb2FkZXIuc2hvdygkc2NvcGUpO1xuICAgICAgICAgICAgaWYoJHNjb3BlLnBvcHVwICYmICRzY29wZS5wb3B1cC5jbG9zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wb3B1cC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICRzY29wZS5wb3B1cCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1cnJlbnRBdXRoZW50aWNhdGlvbiA9IG5ldyBVc2VyQXV0aGVudGljYXRpb24oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIElvbmljLiRpb25pY1BvcHVwLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlKCdsb2dPdXRUaXRsZScpLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAkdHJhbnNsYXRlKCdsb2dPdXRUZW1wbGF0ZScpLFxuICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZSgnbG9nT3V0T2snKSxcbiAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICBjYW5jZWxUZXh0OiAkdHJhbnNsYXRlKCdjYW5jZWxUZXh0JyksXG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdhbmltYXRlZCBib3VuY2VJbkRvd24nXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgcmVzICYmIE1vZGVsLkF1dGgubG9nb3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc3RvcExvYWRpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICBNb2RlbC5OZXR3b3JrLnN0b3AoKTtcbiAgICAgICAgICAgIGN1cnJlbnRBdXRoZW50aWNhdGlvbi5zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUub3BlbkFkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkF1ZGlvLnBsYXkoJ3Bpa2FwaScpO1xuICAgICAgICAgICAgTW9kZWwuQWRtb2Iub3BlbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5leGl0QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW9uaWMuUGxhdGZvcm0uZXhpdEFwcCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIE1vZGVsLkF1ZGlvLnByZWxvYWQoJ3Bpa2FwaScpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NhbGN1bGF0b3JDb250cm9sbGVyJywgQ2FsY3VsYXRvckNvbnRyb2xsZXIpO1xuXG4gICAgQ2FsY3VsYXRvckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdJb25pYycsICdBbmd1bGFyJ107XG5cbiAgICBmdW5jdGlvbiBDYWxjdWxhdG9yQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgSW9uaWMsIEFuZ3VsYXIpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgIElvbmljLiRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBBbmd1bGFyLiRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oZmlyZWJhc2UpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NoYXRDb250cm9sbGVyJywgQ2hhdENvbnRyb2xsZXIpO1xuXG4gICAgQ2hhdENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0FuZ3VsYXInLCAnSW9uaWMnLCAnTW9kZWwnLCAnJGNvcmRvdmFDbGlwYm9hcmQnLCAnJHN0YXRlUGFyYW1zJ107XG4gICAgZnVuY3Rpb24gQ2hhdENvbnRyb2xsZXIoJHNjb3BlLCBBbmd1bGFyLCBJb25pYywgTW9kZWwsICRjb3Jkb3ZhQ2xpcGJvYXJkLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgICB2YXIgJHRyYW5zbGF0ZSA9IEFuZ3VsYXIuJGZpbHRlcigndHJhbnNsYXRlJyk7XG5cbiAgICAgICAgdmFyIHZpZXdTY3JvbGwgPSBJb25pYy4kaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ3VzZXJNZXNzYWdlU2Nyb2xsJyk7XG4gICAgICAgIHZhciBmb290ZXJCYXI7IC8vIGdldHMgc2V0IGluICRpb25pY1ZpZXcuZW50ZXJcbiAgICAgICAgdmFyIHNjcm9sbGVyO1xuICAgICAgICB2YXIgdHh0SW5wdXQ7XG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9IFtdO1xuXG4gICAgICAgIHZhciBjcmVhdGVNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuX2lkID0gbm93LmdldFRpbWUoKTsgLy8gOn4pXG4gICAgICAgICAgICBtZXNzYWdlLmRhdGUgPSBub3cudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIG1lc3NhZ2UudXNlcm5hbWUgPSAkc2NvcGUudXNlci51c2VybmFtZTtcbiAgICAgICAgICAgIG1lc3NhZ2UudXNlcklkID0gJHNjb3BlLnVzZXIuX2lkO1xuICAgICAgICAgICAgbWVzc2FnZS5waWMgPSAkc2NvcGUudXNlci5waWMgfHwgbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihzZW5kTWVzc2FnZUZvcm0pIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgIHRleHQ6ICRzY29wZS5pbnB1dC5tZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBpZiB5b3UgZG8gYSB3ZWIgc2VydmljZSBjYWxsIHRoaXMgd2lsbCBiZSBuZWVkZWQgYXMgd2VsbCBhcyBiZWZvcmUgdGhlIHZpZXdTY3JvbGwgY2FsbHNcbiAgICAgICAgICAgIC8vIHlvdSBjYW4ndCBzZWUgdGhlIGVmZmVjdCBvZiB0aGlzIGluIHRoZSBicm93c2VyIGl0IG5lZWRzIHRvIGJlIHVzZWQgb24gYSByZWFsIGRldmljZVxuICAgICAgICAgICAgLy8gZm9yIHNvbWUgcmVhc29uIHRoZSBvbmUgdGltZSBibHVyIGV2ZW50IGlzIG5vdCBmaXJpbmcgaW4gdGhlIGJyb3dzZXIgYnV0IGRvZXMgb24gZGV2aWNlc1xuICAgICAgICAgICAga2VlcEtleWJvYXJkT3BlbigpO1xuXG4gICAgICAgICAgICBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUuaW5wdXQubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBNb2RlbC5DaGF0LmFkZE1lc3NhZ2VBbmRMb2NhdGlvbihtZXNzYWdlKTtcblxuICAgICAgICAgICAgQW5ndWxhci4kdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBrZWVwS2V5Ym9hcmRPcGVuKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBrZWVwS2V5Ym9hcmRPcGVuKCkge1xuICAgICAgICAgICAgdHh0SW5wdXQub25lKCdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdHh0SW5wdXRbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm9uTWVzc2FnZUhvbGQgPSBmdW5jdGlvbihlLCBpdGVtSW5kZXgsIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmKCFtZXNzYWdlLnBob3RvKXtcbiAgICAgICAgICAgICAgICBJb25pYy4kaW9uaWNBY3Rpb25TaGVldC5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICR0cmFuc2xhdGUoJ2NvcHlNZXNzYWdlJylcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YUNsaXBib2FyZC5jb3B5KG1lc3NhZ2UudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyB0aGlzIHByb2Igc2VlbXMgd2VpcmQgaGVyZSBidXQgSSBoYXZlIHJlYXNvbnMgZm9yIHRoaXMgaW4gbXkgYXBwLCBzZWNyZXQhXG4gICAgICAgICRzY29wZS52aWV3UHJvZmlsZSA9IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgaWYgKG1zZy51c2VySWQgPT09ICRzY29wZS51c2VyLl9pZCkge1xuICAgICAgICAgICAgICAgIC8vIGdvIHRvIHlvdXIgcHJvZmlsZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBnbyB0byBvdGhlciB1c2VycyBwcm9maWxlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignZWxhc3RpYzpyZXNpemUnLCBmdW5jdGlvbihldmVudCwgZWxlbWVudCwgb2xkSGVpZ2h0LCBuZXdIZWlnaHQpIHtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWZvb3RlckJhcikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbmV3Rm9vdGVySGVpZ2h0ID0gbmV3SGVpZ2h0ICsgMTA7XG4gICAgICAgICAgICBuZXdGb290ZXJIZWlnaHQgPSAobmV3Rm9vdGVySGVpZ2h0ID4gNDQpID8gbmV3Rm9vdGVySGVpZ2h0IDogNDQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvb3RlckJhci5zdHlsZS5oZWlnaHQgPSBuZXdGb290ZXJIZWlnaHQgKyAncHgnO1xuICAgICAgICAgICAgc2Nyb2xsZXIuc3R5bGUuYm90dG9tID0gbmV3Rm9vdGVySGVpZ2h0ICsgJ3B4JzsgXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5vblByb2ZpbGVQaWNFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwczovL3d3dy5nb29nbGUuY29tLnVhL2ltYWdlcy9zcnByL2xvZ280dy5wbmcnOyAvLyBzZXQgYSBmYWxsYmFja1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5yZWZyZXNoU2Nyb2xsID0gZnVuY3Rpb24oc2Nyb2xsQm90dG9tLCB0aW1lb3V0KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsQm90dG9tID0gc2Nyb2xsQm90dG9tIHx8ICRzY29wZS5zY3JvbGxEb3duO1xuICAgICAgICAgICAgICAgIHZpZXdTY3JvbGwucmVzaXplKCk7XG4gICAgICAgICAgICAgICAgaWYoc2Nyb2xsQm90dG9tKXtcbiAgICAgICAgICAgICAgICAgICAgdmlld1Njcm9sbC5zY3JvbGxCb3R0b20odHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzY29wZS5jaGVja1Njcm9sbCgpO1xuICAgICAgICAgICAgfSwgdGltZW91dCB8fCAxMDAwKTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnNjcm9sbERvd24gPSB0cnVlO1xuICAgICAgICAkc2NvcGUuY2hlY2tTY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBbmd1bGFyLiR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VG9wID0gdmlld1Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpLnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsYWJsZURpc3RhbmNlRnJvbVRvcCA9IHZpZXdTY3JvbGwuZ2V0U2Nyb2xsVmlldygpLl9fbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgICRzY29wZS5zY3JvbGxEb3duID0gKGN1cnJlbnRUb3AgPj0gbWF4U2Nyb2xsYWJsZURpc3RhbmNlRnJvbVRvcCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcmVmcmVzaExvY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkdlb2xvY2F0aW9uLmdldExvY2F0aW9uKCkudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgICAgICAgICAgTW9kZWwuQ2hhdC51cGRhdGVHZW9RdWVyeShwb3NpdGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9jYXRpb25JbnRlcnZhbDtcbiAgICAgICAgdmFyIGluaXRDaGF0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkxvYWRlci5zaG93KCRzY29wZSk7XG4gICAgICAgICAgICBNb2RlbC5HZW9sb2NhdGlvbi5nZXRMb2NhdGlvbigpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICAgICAgICAgIE1vZGVsLkxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgTW9kZWwuQ2hhdC5pbml0aWFsaXplKCRzdGF0ZVBhcmFtcy50ZWFtKTtcbiAgICAgICAgICAgICAgICBNb2RlbC5DaGF0LmNyZWF0ZUdlb1F1ZXJ5KCRzY29wZS5tZXNzYWdlcywgJHNjb3BlLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBJb25pYy4kaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2dwc1RpdGxlJyksXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAkdHJhbnNsYXRlKCdncHNUZW1wbGF0ZScpLFxuICAgICAgICAgICAgICAgICAgICBva1RleHQ6ICR0cmFuc2xhdGUoJ29rVGV4dCcpLFxuICAgICAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsVGV4dDogJHRyYW5zbGF0ZSgnY2FuY2VsVGV4dCcpLFxuICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2FuaW1hdGVkIGJvdW5jZUluRG93bidcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0Q2hhdCgpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tUb1RlYW1TdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBiYWNrVG9UZWFtU3RhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgIElvbmljLiRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBBbmd1bGFyLiRzdGF0ZS5nbygnYXBwLnRlYW1zJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVFbnRlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBmaXJlYmFzZS5hdXRoKCkuY3VycmVudFVzZXIgfHwgQW5ndWxhci4kcm9vdFNjb3BlLnVzZXI7XG4gICAgICAgICAgICBpZighY3VycmVudFVzZXIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBiYWNrVG9UZWFtU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS51c2VyID0ge1xuICAgICAgICAgICAgICAgIF9pZDogY3VycmVudFVzZXIuZW1haWwsXG4gICAgICAgICAgICAgICAgcGljOiBjdXJyZW50VXNlci5waG90b1VSTCB8fCBjdXJyZW50VXNlci5wcm92aWRlckRhdGFbMF0ucGhvdG9VUkwgfHwgJ2ltZy9wbGF5ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogKFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlci5kaXNwbGF5TmFtZSB8fCBjdXJyZW50VXNlci5wcm92aWRlckRhdGFbMF0uZGlzcGxheU5hbWUgfHwgY3VycmVudFVzZXIuZW1haWwuc3BsaXQoJ0AnKVswXVxuICAgICAgICAgICAgICAgICkuc3BsaXQoJyAnKS5zcGxpY2UoMCwgMikuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGluaXRDaGF0KCk7XG4gICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3NCYXIgPSAwO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmVudGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZm9vdGVyQmFyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcuY2hhdFZpZXcgLmJhci1mb290ZXInKTtcbiAgICAgICAgICAgICAgICBzY3JvbGxlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmNoYXRWaWV3IC5zY3JvbGwtY29udGVudCcpO1xuICAgICAgICAgICAgICAgIHR4dElucHV0ID0gYW5ndWxhci5lbGVtZW50KGZvb3RlckJhci5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgICAgICBsb2NhdGlvbkludGVydmFsID0gQW5ndWxhci4kaW50ZXJ2YWwocmVmcmVzaExvY2F0aW9uLCAxMjAwMDApO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmJlZm9yZUxlYXZlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIEFuZ3VsYXIuJGludGVydmFsLmNhbmNlbChsb2NhdGlvbkludGVydmFsKTtcbiAgICAgICAgICAgIE1vZGVsLkNoYXQuZGVzdHJveUdlb1F1ZXJ5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5zdG9wTG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1RPRE86IENhbmNlbCBsb2FkaW5nIGFuZCBiYWNrXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnNlbmRQaG90byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5NZWRpYS5nZXRQaG90bygpLnRoZW4oZnVuY3Rpb24oaW1hZ2VEYXRhKXtcbiAgICAgICAgICAgICAgICB2YXIgbXNnSW5mbyA9IE1vZGVsLkNoYXQuYWRkRW1wdHlNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgTW9kZWwuTWVkaWEudXBsb2FkRmlsZShpbWFnZURhdGEsICdjaGF0JywgbXNnSW5mby5rZXkpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGhvdG8gOiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgTW9kZWwuQ2hhdC51cGRhdGVNZXNzYWdlQW5kTG9jYXRpb24obXNnSW5mby5wYXRoLCBtc2dJbmZvLmtleSwgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzc0JhciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3NCYXIgPSBwcm9ncmVzcyArIFwiJVwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnBob3RvQnJvd3NlciA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VzID0gQW5ndWxhci4kZmlsdGVyKCdmaWx0ZXInKSgkc2NvcGUubWVzc2FnZXMsIHsgcGhvdG86ICcnIH0pO1xuICAgICAgICAgICAgJHNjb3BlLmFjdGl2ZVNsaWRlID0gbWVzc2FnZXMuaW5kZXhPZihtZXNzYWdlKTtcbiAgICAgICAgICAgICRzY29wZS5hbGxJbWFnZXMgPSBtZXNzYWdlcy5tYXAoZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UucGhvdG87XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTW9kZWwuTW9kYWxzLm9wZW5Nb2RhbCgkc2NvcGUsICd0ZW1wbGF0ZXMvbW9kYWxzL2Z1bGxzY3JlZW5JbWFnZXMuaHRtbCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLk1vZGFscy5jbG9zZU1vZGFsKCk7XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NyZWRpdHNDb250cm9sbGVyJywgQ3JlZGl0c0NvbnRyb2xsZXIpO1xuXG4gICAgQ3JlZGl0c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XG4gICAgZnVuY3Rpb24gQ3JlZGl0c0NvbnRyb2xsZXIoJHNjb3BlKSB7XG4gICAgICAgIFxuICAgICAgICBcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdFdmVudHNDb250cm9sbGVyJywgRXZlbnRzQ29udHJvbGxlcik7XG5cbiAgICBFdmVudHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBFdmVudHNDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignRmluZFBva2Vtb25Db250cm9sbGVyJywgRmluZFBva2Vtb25Db250cm9sbGVyKTtcblxuICAgIEZpbmRQb2tlbW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gRmluZFBva2Vtb25Db250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLm5hbWVzID0gW1xuICAgICAgICAgICAgeyBuYW1lOiBcIllhXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJZYVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiWWFcIiB9XG4gICAgICAgIF07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbihmaXJlYmFzZSkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XG5cbiAgICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQW5ndWxhcicsICdJb25pYycsICdNb2RlbCddO1xuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSwgQW5ndWxhciwgSW9uaWMsIE1vZGVsKSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUub3Blbkl0ZW0gPSBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIEFuZ3VsYXIuJHN0YXRlLmdvKGl0ZW0uc3RhdGUsIHsgdGl0bGU6IGl0ZW0udGl0bGUsIGljb246IGl0ZW0uaWNvbiwgY29sb3I6IGl0ZW0uY29sb3IgfSk7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5jdXJyZW50TGFuZ3VhZ2UgPSBBbmd1bGFyLiR0cmFuc2xhdGUudXNlKCk7XG4gICAgICAgICRzY29wZS5sYW5ndWFnZXMgPSBBbmd1bGFyLiR0cmFuc2xhdGUuZ2V0QXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKCk7XG5cbiAgICAgICAgSW9uaWMuJGlvbmljUG9wb3Zlci5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9tb2RhbHMvY2hhbmdlTGFuZ3VhZ2UuaHRtbCcsIHtcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocG9wb3Zlcikge1xuICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIgPSBwb3BvdmVyO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUub3BlblBvcG92ZXIgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5zaG93KCRldmVudCk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uKGxhbmcpe1xuICAgICAgICAgICAgQW5ndWxhci4kdHJhbnNsYXRlLnVzZShsYW5nKTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50TGFuZ3VhZ2UgPSBsYW5nO1xuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYW5nJywgbGFuZyk7XG4gICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kZWwuQXVkaW8ucHJlbG9hZCgncGlrYWNodScpO1xuXG4gICAgICAgICRzY29wZS5wbGF5QXVkaW8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BsYXknKVxuICAgICAgICAgICAgTW9kZWwuQXVkaW8ucGxheSgncGlrYWNodScpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pbml0U3RvcmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuU3RvcmUuYnV5KCk7XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdJdGVtQ29udHJvbGxlcicsIEl0ZW1Db250cm9sbGVyKTtcblxuICAgIEl0ZW1Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBJdGVtQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignTXlQcm9maWxlQ29udHJvbGxlcicsIE15UHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gICAgTXlQcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gTXlQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Bva2VTdG9wc0NvbnRyb2xsZXInLCBQb2tlU3RvcHNDb250cm9sbGVyKTtcblxuICAgIFBva2VTdG9wc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIFBva2VTdG9wc0NvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdSZXBvcnRDb250cm9sbGVyJywgUmVwb3J0Q29udHJvbGxlcik7XG5cbiAgICBSZXBvcnRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBSZXBvcnRDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignU3RhdGlzdGljc0NvbnRyb2xsZXInLCBTdGF0aXN0aWNzQ29udHJvbGxlcik7XG5cbiAgICBTdGF0aXN0aWNzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gU3RhdGlzdGljc0NvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdUZWFtc0NvbnRyb2xsZXInLCBUZWFtc0NvbnRyb2xsZXIpO1xuXG4gICAgVGVhbXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnXTtcblxuICAgIGZ1bmN0aW9uIFRlYW1zQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlIHx8ICd0ZWFtcycsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbiB8fCAnaW9uLWFuZHJvaWQtZ2xvYmUnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKEF1dG9saW5rZXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2F1dG9saW5rZXInLCBhdXRvbGlua2VyKTtcblxuICAgIGF1dG9saW5rZXIuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiBhdXRvbGlua2VyKCR0aW1lb3V0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZUh0bWwgPSBlbGVtZW50Lmh0bWwoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlSHRtbCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gQXV0b2xpbmtlci5saW5rKGVsZUh0bWwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F1dG9saW5rZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3V2luZG93OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lmh0bWwodGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGF1dG9saW5rcyA9IGVsZW1lbnRbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXV0b2xpbmtlcicpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXV0b2xpbmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoYXV0b2xpbmtzW2ldKS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBlLnRhcmdldC5ocmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChocmVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vd2luZG93Lm9wZW4oaHJlZiwgJ19zeXN0ZW0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oaHJlZiwgJ19ibGFuaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pKEF1dG9saW5rZXIpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2RheU9yTmlnaHQnLCBkYXlPck5pZ2h0KTtcblxuICAgIC8vZGF5T3JOaWdodC4kaW5qZWN0ID0gWycnXTtcbiAgICBmdW5jdGlvbiBkYXlPck5pZ2h0KCkge1xuICAgICAgICByZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdBJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSBcImRheVwiO1xuICAgICAgICAgICAgICAgIGlmKChuZXcgRGF0ZSgpKS5nZXRIb3VycygpID49IDE4KXtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gXCJuaWdodFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmRpcmVjdGl2ZSgnaG9sZExpc3QnLCBob2xkTGlzdCk7XG5cblx0aG9sZExpc3QuJGluamVjdCA9IFsnJGlvbmljR2VzdHVyZSddO1xuXHRmdW5jdGlvbiBob2xkTGlzdCgkaW9uaWNHZXN0dXJlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdBJyxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0JGlvbmljR2VzdHVyZS5vbignaG9sZCcsIGZ1bmN0aW9uIChlKSB7XG5cblx0XHRcdFx0XHR2YXIgY29udGVudCA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLml0ZW0tY29udGVudCcpO1xuXG5cdFx0XHRcdFx0dmFyIGJ1dHRvbnMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLW9wdGlvbnMnKTtcblx0XHRcdFx0XHR2YXIgYnV0dG9uc1dpZHRoID0gYnV0dG9ucy5vZmZzZXRXaWR0aDtcblxuXHRcdFx0XHRcdGlvbmljLnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRjb250ZW50LnN0eWxlW2lvbmljLkNTUy5UUkFOU0lUSU9OXSA9ICdhbGwgZWFzZS1vdXQgLjI1cyc7XG5cblx0XHRcdFx0XHRcdGlmICghYnV0dG9ucy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmlzaWJsZScpKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQuc3R5bGVbaW9uaWMuQ1NTLlRSQU5TRk9STV0gPSAnJztcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0YnV0dG9ucy5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcblx0XHRcdFx0XHRcdFx0fSwgMjUwKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGJ1dHRvbnMuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQuc3R5bGVbaW9uaWMuQ1NTLlRSQU5TRk9STV0gPSAndHJhbnNsYXRlM2QoLScgKyBidXR0b25zV2lkdGggKyAncHgsIDAsIDApJztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdH0sIGVsZW1lbnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnaW1nJywgaW1nKTtcblxuICAgIGltZy4kaW5qZWN0ID0gWyckcGFyc2UnXTtcbiAgICBmdW5jdGlvbiBpbWcoJHBhcnNlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGVuZHNXaXRoICh1cmwsIHBhdGgpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHVybC5sZW5ndGggLSBwYXRoLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiB1cmwuaW5kZXhPZihwYXRoLCBpbmRleCkgIT09IC0xO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykgeyAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMuc3JjO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBhdHRyaWJ1dGVzLm5nRXJyb3IgJiYgJHBhcnNlKGF0dHJpYnV0ZXMubmdFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlcyBhbiBuZy1lcnJvciBjYWxsYmFjayB0aGVuIGNhbGwgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuKHNjb3BlLCB7ICRldmVudDogZXYsICRzcmM6IHNyYyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZXMgYW4gbmctZXJyb3Itc3JjIHRoZW4gc2V0IGl0XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLm5nRXJyb3JTcmMgJiYgIWVuZHNXaXRoKHNyYywgYXR0cmlidXRlcy5uZ0Vycm9yU3JjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdzcmMnLCBhdHRyaWJ1dGVzLm5nRXJyb3JTcmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignbG9hZCcsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IGF0dHJpYnV0ZXMubmdTdWNjZXNzICYmICRwYXJzZShhdHRyaWJ1dGVzLm5nU3VjY2Vzcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGZuKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm4oc2NvcGUsIHsgJGV2ZW50OiBldiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZGlyZWN0aXZlKCdpb25NdWx0aXBsZVNlbGVjdCcsIGlvbk11bHRpcGxlU2VsZWN0KTtcblxuXHRpb25NdWx0aXBsZVNlbGVjdC4kaW5qZWN0ID0gWyckaW9uaWNNb2RhbCcsICckaW9uaWNHZXN0dXJlJ107XG5cdGZ1bmN0aW9uIGlvbk11bHRpcGxlU2VsZWN0KCRpb25pY01vZGFsLCAkaW9uaWNHZXN0dXJlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6IFwiPVwiXG5cdFx0XHR9LFxuXHRcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHQkc2NvcGUubXVsdGlwbGVTZWxlY3QgPSB7XG5cdFx0XHRcdFx0dGl0bGU6ICRhdHRycy50aXRsZSB8fCBcIlNlbGVjdCBPcHRpb25zXCIsXG5cdFx0XHRcdFx0dGVtcE9wdGlvbnM6IFtdLFxuXHRcdFx0XHRcdGtleVByb3BlcnR5OiAkYXR0cnMua2V5UHJvcGVydHkgfHwgXCJpZFwiLFxuXHRcdFx0XHRcdHZhbHVlUHJvcGVydHk6ICRhdHRycy52YWx1ZVByb3BlcnR5IHx8IFwidmFsdWVcIixcblx0XHRcdFx0XHRzZWxlY3RlZFByb3BlcnR5OiAkYXR0cnMuc2VsZWN0ZWRQcm9wZXJ0eSB8fCBcInNlbGVjdGVkXCIsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICRhdHRycy50ZW1wbGF0ZVVybCB8fCAndGVtcGxhdGVzL21vZGFscy9tdWx0aXBsZVNlbGVjdC5odG1sJyxcblx0XHRcdFx0XHRyZW5kZXJDaGVja2JveDogJGF0dHJzLnJlbmRlckNoZWNrYm94ID8gJGF0dHJzLnJlbmRlckNoZWNrYm94ID09IFwidHJ1ZVwiIDogdHJ1ZSxcblx0XHRcdFx0XHRhbmltYXRpb246ICRhdHRycy5hbmltYXRpb24gfHwgJ3NsaWRlLWluLXVwJ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGVVcmwpIHtcblx0XHRcdFx0XHQkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxhdGVVcmwsIHtcblx0XHRcdFx0XHRcdHNjb3BlOiAkc2NvcGUsXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICRzY29wZS5tdWx0aXBsZVNlbGVjdC5hbmltYXRpb25cblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsID0gbW9kYWw7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwuc2hvdygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpb25pY0dlc3R1cmUub24oJ3RhcCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0JHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBPcHRpb25zID0gJHNjb3BlLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChvcHRpb24pIHtcblx0XHRcdFx0XHRcdHZhciB0ZW1wT3B0aW9uID0ge307XG5cdFx0XHRcdFx0XHR0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV0gPSBvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LmtleVByb3BlcnR5XTtcblx0XHRcdFx0XHRcdHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnZhbHVlUHJvcGVydHldID0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC52YWx1ZVByb3BlcnR5XTtcblx0XHRcdFx0XHRcdHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnNlbGVjdGVkUHJvcGVydHldID0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRlbXBPcHRpb247XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JHNjb3BlLk9wZW5Nb2RhbEZyb21UZW1wbGF0ZSgkc2NvcGUubXVsdGlwbGVTZWxlY3QudGVtcGxhdGVVcmwpO1xuXHRcdFx0XHR9LCAkZWxlbWVudCk7XG5cblx0XHRcdFx0JHNjb3BlLnNhdmVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGVtcE9wdGlvbiA9ICRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9uc1tpXTtcblx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgJHNjb3BlLm9wdGlvbnMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0dmFyIG9wdGlvbiA9ICRzY29wZS5vcHRpb25zW2pdO1xuXHRcdFx0XHRcdFx0XHRpZiAodGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldID09IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldKSB7XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XSA9IHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnNlbGVjdGVkUHJvcGVydHldO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCRzY29wZS5jbG9zZU1vZGFsKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLm1vZGFsKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Jlc2l6ZUhlaWdodCcsIHJlc2l6ZUhlaWdodCk7XG5cbiAgICByZXNpemVIZWlnaHQuJGluamVjdCA9IFsnJHdpbmRvdycsICckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIHJlc2l6ZUhlaWdodCgkd2luZG93LCAkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZXNpemVFbGVtZW50ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnQucGFyZW50KClbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50LnBhcmVudCgpWzBdLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVQaXhlbHMgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNjYWxlUGl4ZWxzID4gd2lkdGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVQaXhlbHMgPSB3aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBzY2FsZVBpeGVscyAvIGF0dHJzLnJlc2l6ZUhlaWdodCAtIDAuMztcbiAgICAgICAgICAgICAgICAgICAgaWYoc2NhbGUgPCAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnN0eWxlW2lvbmljLkNTUy5UUkFOU0ZPUk1dID0gJ3NjYWxlKCcgKyBzY2FsZSArICcpJztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplRWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplRWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmRpcmVjdGl2ZSgnaW9uU2VhcmNoU2VsZWN0JywgaW9uU2VhcmNoU2VsZWN0KTtcblxuXHRpb25TZWFyY2hTZWxlY3QuJGluamVjdCA9IFsnJGlvbmljTW9kYWwnLCAnJGlvbmljR2VzdHVyZSddO1xuXHRmdW5jdGlvbiBpb25TZWFyY2hTZWxlY3QoJGlvbmljTW9kYWwsICRpb25pY0dlc3R1cmUpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0b3B0aW9uczogXCI9XCIsXG5cdFx0XHRcdG9wdGlvblNlbGVjdGVkOiBcIj1cIlxuXHRcdFx0fSxcblx0XHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdCA9IHtcblx0XHRcdFx0XHR0aXRsZTogJGF0dHJzLnRpdGxlIHx8IFwiU2VhcmNoXCIsXG5cdFx0XHRcdFx0a2V5UHJvcGVydHk6ICRhdHRycy5rZXlQcm9wZXJ0eSxcblx0XHRcdFx0XHR2YWx1ZVByb3BlcnR5OiAkYXR0cnMudmFsdWVQcm9wZXJ0eSxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd0ZW1wbGF0ZXMvc2VhcmNoU2VsZWN0Lmh0bWwnLFxuXHRcdFx0XHRcdGFuaW1hdGlvbjogJGF0dHJzLmFuaW1hdGlvbiB8fCAnc2xpZGUtaW4tdXAnLFxuXHRcdFx0XHRcdG9wdGlvbjogbnVsbCxcblx0XHRcdFx0XHRzZWFyY2h2YWx1ZTogXCJcIixcblx0XHRcdFx0XHRlbmFibGVTZWFyY2g6ICRhdHRycy5lbmFibGVTZWFyY2ggPyAkYXR0cnMuZW5hYmxlU2VhcmNoID09IFwidHJ1ZVwiIDogdHJ1ZVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpb25pY0dlc3R1cmUub24oJ3RhcCcsIGZ1bmN0aW9uIChlKSB7XG5cblx0XHRcdFx0XHRpZiAoISEkc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5ICYmICEhJHNjb3BlLnNlYXJjaFNlbGVjdC52YWx1ZVByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRpZiAoJHNjb3BlLm9wdGlvblNlbGVjdGVkKSB7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uID0gJHNjb3BlLm9wdGlvblNlbGVjdGVkWyRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uID0gJHNjb3BlLm9wdGlvblNlbGVjdGVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlKCRzY29wZS5zZWFyY2hTZWxlY3QudGVtcGxhdGVVcmwpO1xuXHRcdFx0XHR9LCAkZWxlbWVudCk7XG5cblx0XHRcdFx0JHNjb3BlLnNhdmVPcHRpb24gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKCEhJHNjb3BlLnNlYXJjaFNlbGVjdC5rZXlQcm9wZXJ0eSAmJiAhISRzY29wZS5zZWFyY2hTZWxlY3QudmFsdWVQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHR2YXIgY3VycmVudE9wdGlvbiA9ICRzY29wZS5vcHRpb25zW2ldO1xuXHRcdFx0XHRcdFx0XHRpZiAoY3VycmVudE9wdGlvblskc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5XSA9PSAkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5vcHRpb25TZWxlY3RlZCA9IGN1cnJlbnRPcHRpb247XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUub3B0aW9uU2VsZWN0ZWQgPSAkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5zZWFyY2h2YWx1ZSA9IFwiXCI7XG5cdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRzY29wZS5jbGVhclNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0LnNlYXJjaHZhbHVlID0gXCJcIjtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdCRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICgkc2NvcGUubW9kYWwpIHtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGVVcmwpIHtcblx0XHRcdFx0XHQkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxhdGVVcmwsIHtcblx0XHRcdFx0XHRcdHNjb3BlOiAkc2NvcGUsXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICRzY29wZS5zZWFyY2hTZWxlY3QuYW5pbWF0aW9uXG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbCA9IG1vZGFsO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnNob3coKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJykuZmlsdGVyKCdubDJicicsIFsnJGZpbHRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbigkZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEucmVwbGFjZSgvXFxuXFxyPy9nLCAnPGJyIC8+Jyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0FkbW9iJywgQWRtb2IpO1xuXG4gICAgQWRtb2IuJGluamVjdCA9IFsnbXlDb25maWcnLCAnJHdpbmRvdycsICckcm9vdFNjb3BlJywgJyRpbnRlcnZhbCddO1xuICAgIGZ1bmN0aW9uIEFkbW9iKG15Q29uZmlnLCAkd2luZG93LCAkcm9vdFNjb3BlLCAkaW50ZXJ2YWwpIHtcblxuICAgICAgICB2YXIgdmFsaWRhdGVBZG1vYiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZighJHJvb3RTY29wZS5hZG1vYil7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYWxEYXRlID0gbmV3IERhdGUoJHdpbmRvdy5sb2NhbFN0b3JhZ2VbXCJhZG1vYkRhdGVcIl0gfHwgKG5ldyBEYXRlKCkpLnNldERhdGUoY3VycmVudERhdGUuZ2V0RGF0ZSgpIC0gMSkpO1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnREYXRlID4gbG9jYWxEYXRlKXtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hZG1vYiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgICRpbnRlcnZhbCh2YWxpZGF0ZUFkbW9iLCAxMDAwMCk7XG4gICAgICAgIHZhbGlkYXRlQWRtb2IoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJlcGFyZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5BZE1vYiAmJiAkd2luZG93LkFkTW9iLnByZXBhcmVJbnRlcnN0aXRpYWwoe1xuICAgICAgICAgICAgICAgICAgICBhZElkOiBteUNvbmZpZy5hZE1vYi5pZCxcbiAgICAgICAgICAgICAgICAgICAgaXNUZXN0aW5nOiB0cnVlLCAvLyBUT0RPOiByZW1vdmUgdGhpcyBsaW5lIHdoZW4gcmVsZWFzZVxuICAgICAgICAgICAgICAgICAgICBhdXRvU2hvdzogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuYWRtb2IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlLnNldE1pbnV0ZXMoY3VycmVudERhdGUuZ2V0TWludXRlcygpICsgNSk7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2VbXCJhZG1vYkRhdGVcIl0gPSBjdXJyZW50RGF0ZTtcbiAgICAgICAgICAgICAgICAkd2luZG93LkFkTW9iICYmICR3aW5kb3cuQWRNb2Iuc2hvd0ludGVyc3RpdGlhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnByZXBhcmUoKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnByZXBhcmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnQW5ndWxhcicsIEFuZ3VsYXIpO1xuXG5cdEFuZ3VsYXIuJGluamVjdCA9IFsnJHN0YXRlJywgJyR0aW1lb3V0JywgJyRyb290U2NvcGUnLCAnJGZpbHRlcicsICckdHJhbnNsYXRlJywgJyRpbnRlcnZhbCddO1xuXHRmdW5jdGlvbiBBbmd1bGFyKCRzdGF0ZSwgJHRpbWVvdXQsICRyb290U2NvcGUsICRmaWx0ZXIsICR0cmFuc2xhdGUsICRpbnRlcnZhbCkge1xuXG5cdFx0cmV0dXJuIHtcbiAgICAgICAgICAgICRzdGF0ZTogJHN0YXRlLFxuXHRcdFx0JHRpbWVvdXQ6ICR0aW1lb3V0LFxuICAgICAgICAgICAgJHJvb3RTY29wZTogJHJvb3RTY29wZSxcbiAgICAgICAgICAgICRmaWx0ZXI6ICRmaWx0ZXIsXG5cdFx0XHQkdHJhbnNsYXRlOiAkdHJhbnNsYXRlLFxuXHRcdFx0JGludGVydmFsOiAkaW50ZXJ2YWxcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0F1ZGlvJywgQXVkaW8pO1xuXG4gICAgQXVkaW8uJGluamVjdCA9IFsnJGNvcmRvdmFOYXRpdmVBdWRpbyddO1xuICAgIGZ1bmN0aW9uIEF1ZGlvKCRjb3Jkb3ZhTmF0aXZlQXVkaW8pIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJlbG9hZCA6IGZ1bmN0aW9uKG5hbWUsIGV4dCl7XG4gICAgICAgICAgICAgICAgaW9uaWMuUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgaWYod2luZG93LnBsdWdpbnMgJiYgd2luZG93LnBsdWdpbnMuTmF0aXZlQXVkaW8pe1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFOYXRpdmVBdWRpby5wcmVsb2FkQ29tcGxleChuYW1lLCAnYXVkaW8vJyArIG5hbWUgKyAnLicgKyAoZXh0IHx8ICd3YXYnKSwgMSwgMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwbGF5OiBmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBpZih3aW5kb3cucGx1Z2lucyAmJiB3aW5kb3cucGx1Z2lucy5OYXRpdmVBdWRpbyl7XG4gICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhTmF0aXZlQXVkaW8ucGxheShuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oZmlyZWJhc2UpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0F1dGgnLCBBdXRoKTtcblxuICAgIEF1dGguJGluamVjdCA9IFsnJHEnLCAnJGZpcmViYXNlQXV0aCcsICdteUNvbmZpZycsICckcm9vdFNjb3BlJywgJyRzdGF0ZSddO1xuICAgIGZ1bmN0aW9uIEF1dGgoJHEsICRmaXJlYmFzZUF1dGgsIG15Q29uZmlnLCAkcm9vdFNjb3BlLCAkc3RhdGUpIHtcblxuICAgICAgICAkZmlyZWJhc2VBdXRoKCkuJG9uQXV0aFN0YXRlQ2hhbmdlZChmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgIGlmKCF1c2VyICYmICRzdGF0ZS5jdXJyZW50ICYmICRzdGF0ZS5jdXJyZW50LmF1dGgpe1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ2hhbmdlIHN0YXRlLi4uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIG5leHRQYXJhbXMsIGZyb21TdGF0ZSkge1xuICAgICAgICAgICAgaWYgKCdhdXRoJyBpbiBuZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkcm9vdFNjb3BlLnVzZXIgJiYgJHN0YXRlLmN1cnJlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QobXlDb25maWcuYXV0aEV2ZW50cy5ub3RBdXRob3JpemVkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0OiBuZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFBhcmFtczogbmV4dFBhcmFtc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBzY29wZXMgPSBbXG4gICAgICAgICAgICBcImVtYWlsXCIsXG4gICAgICAgICAgICBcInByb2ZpbGVcIixcbiAgICAgICAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9wbHVzLm1lXCIsXG4gICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWxcIixcbiAgICAgICAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC91c2VyaW5mby5wcm9maWxlXCIsXG4gICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcGx1cy5sb2dpblwiLFxuICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2dhbWVzXCJcbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgX25hdGl2ZUxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucGx1Z2lucy5nb29nbGVwbHVzLmxvZ2luKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnc2NvcGVzJzogc2NvcGVzLmpvaW4oJyAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3ZWJDbGllbnRJZCc6IG15Q29uZmlnLmdvb2dsZUNsaWVudElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ29mZmxpbmUnOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChtc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2dpbiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZihpb25pYy5QbGF0Zm9ybS5pc1dlYlZpZXcoKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfbmF0aXZlTG9naW4oKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjcmVkZW50aWFsID0gZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIuY3JlZGVudGlhbChyZXN1bHQuaWRUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLnNpZ25JbldpdGhDcmVkZW50aWFsKGNyZWRlbnRpYWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3ZpZGVyID0gbmV3IGZpcmViYXNlLmF1dGguR29vZ2xlQXV0aFByb3ZpZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3Blcy5mb3JFYWNoKGZ1bmN0aW9uKHNjb3BlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyLmFkZFNjb3BlKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aFBvcHVwKHByb3ZpZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9nb3V0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHJldHVybiBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKGZpcmViYXNlKTsiLCIoZnVuY3Rpb24oZmlyZWJhc2UsIEdlb0ZpcmUpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0NoYXQnLCBDaGF0KTtcblxuICAgIENoYXQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiBDaGF0KCR0aW1lb3V0KSB7XG5cbiAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgdmFyIGNoYXRSZWY7XG4gICAgICAgIHZhciBtZXNzYWdlc1JlZjtcbiAgICAgICAgdmFyIGdlb0ZpcmU7XG4gICAgICAgIHZhciBnZW9RdWVyeTtcbiAgICAgICAgdmFyIGN1cnJlbnRUZWFtUmVmO1xuICAgICAgICB2YXIgY3VycmVudFBvc2l0aW9uO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbih0ZWFtKXtcbiAgICAgICAgICAgICAgICB0ZWFtID0gdGVhbSB8fCBcImFsbFwiO1xuICAgICAgICAgICAgICAgIHJlZiA9IGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKCk7XG4gICAgICAgICAgICAgICAgY2hhdFJlZiA9IHJlZi5jaGlsZChcImNoYXRcIik7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXNSZWYgPSBjaGF0UmVmLmNoaWxkKFwibWVzc2FnZXNcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudFRlYW1SZWYgPSBtZXNzYWdlc1JlZi5jaGlsZCh0ZWFtKTtcbiAgICAgICAgICAgICAgICBnZW9GaXJlID0gbmV3IEdlb0ZpcmUoY2hhdFJlZi5jaGlsZChcImxvY2F0aW9uc1wiKS5jaGlsZCh0ZWFtKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkRW1wdHlNZXNzYWdlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBjdXJyZW50VGVhbVJlZi5wdXNoKCkua2V5O1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN1cnJlbnRUZWFtUmVmLnRvU3RyaW5nKCkuc3Vic3RyaW5nKGN1cnJlbnRUZWFtUmVmLnJvb3QudG9TdHJpbmcoKS5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVwZGF0ZU1lc3NhZ2VBbmRMb2NhdGlvbjogZnVuY3Rpb24ocGF0aCwga2V5LCBtZXNzYWdlKXtcbiAgICAgICAgICAgICAgICByZWYuY2hpbGQocGF0aCArIFwiL1wiICsga2V5KS51cGRhdGUobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgZ2VvRmlyZS5zZXQoa2V5LCBbY3VycmVudFBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgY3VycmVudFBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVdKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRNZXNzYWdlQW5kTG9jYXRpb24gOiBmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gY3VycmVudFRlYW1SZWYucHVzaChtZXNzYWdlKS5rZXk7XG4gICAgICAgICAgICAgICAgZ2VvRmlyZS5zZXQoa2V5LCBbY3VycmVudFBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgY3VycmVudFBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVdKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGVHZW9RdWVyeTogZnVuY3Rpb24obWVzc2FnZXMsICRzY29wZSwgcG9zaXRpb24sIHJhZCl7XG4gICAgICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICAgICAgZ2VvUXVlcnkgPSBnZW9GaXJlLnF1ZXJ5KHtcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiBbcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiByYWQgfHwgMTVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBnZW9RdWVyeS5vbihcImtleV9lbnRlcmVkXCIsIGZ1bmN0aW9uKGtleSwgbG9jYXRpb24sIGRpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUZWFtUmVmLm9yZGVyQnlLZXkoKS5lcXVhbFRvKGtleSkub25jZSgndmFsdWUnKS50aGVuKGZ1bmN0aW9uKHNuYXBzaG90KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKGRhdGFba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVwZGF0ZUdlb1F1ZXJ5OiBmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgICAgICAgICAgZ2VvUXVlcnkgJiYgZ2VvUXVlcnkudXBkYXRlQ3JpdGVyaWEoe1xuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IFtwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzdHJveUdlb1F1ZXJ5OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGdlb1F1ZXJ5ICYmIGdlb1F1ZXJ5LmNhbmNlbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKGZpcmViYXNlLCBHZW9GaXJlKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdHZW9sb2NhdGlvbicsIEdlb2xvY2F0aW9uKTtcblxuICAgIEdlb2xvY2F0aW9uLiRpbmplY3QgPSBbJyRjb3Jkb3ZhR2VvbG9jYXRpb24nXTtcbiAgICBmdW5jdGlvbiBHZW9sb2NhdGlvbigkY29yZG92YUdlb2xvY2F0aW9uKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldExvY2F0aW9uIDogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge21heGltdW1BZ2U6IDEwMDAwLCB0aW1lb3V0OiA1MDAwLCBlbmFibGVIaWdoQWNjdXJhY3k6IGZhbHNlfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ0lvbmljJywgSW9uaWMpO1xuXG5cdElvbmljLiRpbmplY3QgPSBbJyRpb25pY0FjdGlvblNoZWV0JywgJyRpb25pY1Njcm9sbERlbGVnYXRlJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckaW9uaWNIaXN0b3J5JywgJyRpb25pY1BvcHVwJywgJyRpb25pY0xvYWRpbmcnLCAnJGlvbmljUG9wb3ZlciddO1xuXHRmdW5jdGlvbiBJb25pYygkaW9uaWNBY3Rpb25TaGVldCwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsICRpb25pY1ZpZXdTd2l0Y2hlciwgJGlvbmljSGlzdG9yeSwgJGlvbmljUG9wdXAsICRpb25pY0xvYWRpbmcsICRpb25pY1BvcG92ZXIpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHQkaW9uaWNBY3Rpb25TaGVldDogJGlvbmljQWN0aW9uU2hlZXQsXG4gICAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZTogJGlvbmljU2Nyb2xsRGVsZWdhdGUsXG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXI6ICRpb25pY1ZpZXdTd2l0Y2hlcixcbiAgICAgICAgICAgICRpb25pY0hpc3Rvcnk6ICRpb25pY0hpc3RvcnksXG4gICAgICAgICAgICAkaW9uaWNQb3B1cDogJGlvbmljUG9wdXAsXG4gICAgICAgICAgICAkaW9uaWNMb2FkaW5nOiAkaW9uaWNMb2FkaW5nLFxuXHRcdFx0JGlvbmljUG9wb3ZlcjogJGlvbmljUG9wb3ZlclxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdMb2FkZXInLCBMb2FkZXIpO1xuXG5cdExvYWRlci4kaW5qZWN0ID0gWyckaW9uaWNMb2FkaW5nJ107XG5cdGZ1bmN0aW9uIExvYWRlcigkaW9uaWNMb2FkaW5nKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hvdzogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLnNob3coe1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tb2RhbHMvbG9hZGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICBoaWRlT25TdGFnZUNoYW5nZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oZmlyZWJhc2UpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ01lZGlhJywgTWVkaWEpO1xuXG4gICAgTWVkaWEuJGluamVjdCA9IFsnJHEnLCAnJGlvbmljQWN0aW9uU2hlZXQnLCAnJHdpbmRvdycsICckY29yZG92YUNhbWVyYScsICckZmlsdGVyJywgJyR0aW1lb3V0JywgJyRjb3Jkb3ZhRmlsZScsICdVdGlsaXRpZXMnXTtcbiAgICBmdW5jdGlvbiBNZWRpYSgkcSwgJGlvbmljQWN0aW9uU2hlZXQsICR3aW5kb3csICRjb3Jkb3ZhQ2FtZXJhLCAkZmlsdGVyLCAkdGltZW91dCwgJGNvcmRvdmFGaWxlLCBVdGlsaXRpZXMpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciAkdHJhbnNsYXRlID0gJGZpbHRlcigndHJhbnNsYXRlJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVwbG9hZEZpbGU6IGZ1bmN0aW9uKGltYWdlRGF0YSwgZm9sZGVyTmFtZSwgdW5pcXVlRmlsZU5hbWUpe1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlQmxvYiA9IFV0aWxpdGllcy5iNjR0b0Jsb2IoaW1hZ2VEYXRhKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RvcmFnZVJlZiA9IGZpcmViYXNlLnN0b3JhZ2UoKS5yZWYoZm9sZGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIHVwbG9hZFRhc2sgPSBzdG9yYWdlUmVmLmNoaWxkKHVuaXF1ZUZpbGVOYW1lICsgXCIuanBnXCIpLnB1dChpbWFnZUJsb2IpO1xuICAgICAgICAgICAgICAgIHVwbG9hZFRhc2sub24oZmlyZWJhc2Uuc3RvcmFnZS5UYXNrRXZlbnQuU1RBVEVfQ0hBTkdFRCwgZnVuY3Rpb24gKHNuYXBzaG90KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IHNuYXBzaG90LmJ5dGVzVHJhbnNmZXJyZWQgKiAxMDAgLyBzbmFwc2hvdC50b3RhbEJ5dGVzO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5ub3RpZnkocHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvd25sb2FkVVJMID0gdXBsb2FkVGFzay5zbmFwc2hvdC5kb3dubG9hZFVSTDtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkb3dubG9hZFVSTCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0UGhvdG86IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAkaW9uaWNBY3Rpb25TaGVldC5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICR0cmFuc2xhdGUoJ3Rha2VQaG90bycpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAkdHJhbnNsYXRlKCdwaG90b0Zyb21MaWJyYXJ5JykgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlVGV4dDogJHRyYW5zbGF0ZSgnbG9hZEltYWdlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxUZXh0OiAkdHJhbnNsYXRlKFwiY2FuY2VsVGV4dFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdDQU5DRUwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25DbGlja2VkOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlvbmljLlBsYXRmb3JtLmlzV2ViVmlldygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9ICR3aW5kb3cuQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaW5kZXggPT09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlID0gJHdpbmRvdy5DYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuUEhPVE9MSUJSQVJZO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhQ2FtZXJhLmdldFBpY3R1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbGl0eTogNTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRXaWR0aDogMzIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25UeXBlOiAkd2luZG93LkNhbWVyYS5EZXN0aW5hdGlvblR5cGUuREFUQV9VUkwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2RpbmdUeXBlOiAkd2luZG93LkNhbWVyYS5FbmNvZGluZ1R5cGUuSlBFRyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcG92ZXJPcHRpb25zOiAkd2luZG93LkNhbWVyYVBvcG92ZXJPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3JyZWN0T3JpZW50YXRpb246IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihpbWFnZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaW1hZ2VEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdCUk9XU0VSJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KShmaXJlYmFzZSk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdNb2RhbHMnLCBNb2RhbHMpO1xuXG5cdE1vZGFscy4kaW5qZWN0ID0gWyckaW9uaWNNb2RhbCddO1xuXHRmdW5jdGlvbiBNb2RhbHMoJGlvbmljTW9kYWwpIHtcblxuXHRcdHZhciBtb2RhbHMgPSBbXTtcblxuXHRcdHZhciBfb3Blbk1vZGFsID0gZnVuY3Rpb24gKCRzY29wZSwgdGVtcGxhdGVVcmwsIGFuaW1hdGlvbikge1xuXHRcdFx0cmV0dXJuICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGF0ZVVybCwge1xuXHRcdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0XHRhbmltYXRpb246IGFuaW1hdGlvbiB8fCAnc2xpZGUtaW4tdXAnLFxuXHRcdFx0XHRiYWNrZHJvcENsaWNrVG9DbG9zZTogZmFsc2Vcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG5cdFx0XHRcdG1vZGFscy5wdXNoKG1vZGFsKTtcblx0XHRcdFx0bW9kYWwuc2hvdygpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdHZhciBfY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjdXJyZW50TW9kYWwgPSBtb2RhbHMuc3BsaWNlKC0xLCAxKVswXTtcblx0XHRcdGN1cnJlbnRNb2RhbC5yZW1vdmUoKTtcblx0XHR9O1xuXG5cdFx0dmFyIF9jbG9zZUFsbE1vZGFscyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdG1vZGFscy5tYXAoZnVuY3Rpb24gKG1vZGFsKSB7XG5cdFx0XHRcdG1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHRtb2RhbHMgPSBbXTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG9wZW5Nb2RhbDogX29wZW5Nb2RhbCxcblx0XHRcdGNsb3NlTW9kYWw6IF9jbG9zZU1vZGFsLFxuXHRcdFx0Y2xvc2VBbGxNb2RhbHM6IF9jbG9zZUFsbE1vZGFsc1xuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdNb2RlbCcsIE1vZGVsKTtcblxuXHRNb2RlbC4kaW5qZWN0ID0gWydHZW9sb2NhdGlvbicsICdBdXRoJywgJ05ldHdvcmsnLCAnQWRtb2InLCAnQXVkaW8nLCAnQ2hhdCcsICdMb2FkZXInLCAnTWVkaWEnLCAnTW9kYWxzJywgJ1N0b3JlJ107XG5cdGZ1bmN0aW9uIE1vZGVsKEdlb2xvY2F0aW9uLCBBdXRoLCBOZXR3b3JrLCBBZG1vYiwgQXVkaW8sIENoYXQsIExvYWRlciwgTWVkaWEsIE1vZGFscywgU3RvcmUpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRHZW9sb2NhdGlvbjogR2VvbG9jYXRpb24sXG5cdFx0XHRBdXRoOiBBdXRoLFxuXHRcdFx0TmV0d29yazogTmV0d29yayxcblx0XHRcdEFkbW9iOiBBZG1vYixcblx0XHRcdEF1ZGlvOiBBdWRpbyxcblx0XHRcdENoYXQ6IENoYXQsXG5cdFx0XHRMb2FkZXI6IExvYWRlcixcblx0XHRcdE1lZGlhOiBNZWRpYSxcblx0XHRcdE1vZGFsczogTW9kYWxzLFxuXHRcdFx0U3RvcmU6IFN0b3JlXG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdOZXR3b3JrJywgTmV0d29yayk7XG5cbiAgICBOZXR3b3JrLiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckY29yZG92YU5ldHdvcmsnLCAnJHEnXTtcbiAgICBmdW5jdGlvbiBOZXR3b3JrKCR0aW1lb3V0LCAkaW50ZXJ2YWwsICRjb3Jkb3ZhTmV0d29yaywgJHEpIHtcblxuICAgICAgICB2YXIgZGVmZXJyZWQsIGludGVydmFsUHJvbWlzZSwgdGltZU91dFByb21pc2U7XG5cbiAgICAgICAgdmFyIHRyeVRvQ29ubmVjdCA9IGZ1bmN0aW9uKG1heFRpbWUpe1xuICAgICAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgbWF4VGltZSA9IG1heFRpbWUgfHwgNTAwMDtcbiAgICAgICAgICAgIGlmKGlvbmljLlBsYXRmb3JtLmlzV2ViVmlldygpKXtcbiAgICAgICAgICAgICAgICBpbnRlcnZhbFByb21pc2UgPSAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsUHJvbWlzZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJ09LJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICB0aW1lT3V0UHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbFByb21pc2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnVElNRU9VVCcpO1xuICAgICAgICAgICAgICAgIH0sIG1heFRpbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCdPSycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbmNlbFByb21pc2UgPSBmdW5jdGlvbihwcm9taXNlLCAkc2VydmljZSl7XG4gICAgICAgICAgICBwcm9taXNlICYmICRzZXJ2aWNlLmNhbmNlbChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjYW5jZWxQcm9taXNlcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjYW5jZWxQcm9taXNlKGludGVydmFsUHJvbWlzZSwgJGludGVydmFsKTtcbiAgICAgICAgICAgIGNhbmNlbFByb21pc2UodGltZU91dFByb21pc2UsICR0aW1lb3V0KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc3RvcCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjYW5jZWxQcm9taXNlcygpO1xuICAgICAgICAgICAgZGVmZXJyZWQgJiYgZGVmZXJyZWQucmVqZWN0KCdTVE9QUEVEJyk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHJ5VG9Db25uZWN0OiB0cnlUb0Nvbm5lY3QsXG4gICAgICAgICAgICBzdG9wOiBzdG9wXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5mYWN0b3J5KCdTdG9yZScsIFN0b3JlKTtcclxuXHJcblx0U3RvcmUuJGluamVjdCA9IFsnJHdpbmRvdycsICckcm9vdFNjb3BlJ107XHJcblx0ZnVuY3Rpb24gU3RvcmUoJHdpbmRvdywgJHJvb3RTY29wZSkge1xyXG5cclxuICAgICAgICB2YXIgc3RvcmUgPSAkd2luZG93LnN0b3JlO1xyXG5cclxuICAgICAgICB2YXIgZ2V0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gc3RvcmUuZ2V0KCdjby5uaWNob2xscy5wb2tlZGV4Z28ucmVtb3ZlYWRzJyk7XHJcblxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLnNob3dBZHMgPSAhcHJvZHVjdC5vd25lZDtcclxuICAgICAgICAgICAgaWYocHJvZHVjdC5vd25lZCl7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5vZmYoZ2V0SW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzdG9yZSA9ICR3aW5kb3cuc3RvcmU7XHJcbiAgICAgICAgICAgICAgICBpZihzdG9yZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUudmVyYm9zaXR5ID0gc3RvcmUuSU5GTztcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZWdpc3Rlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAgICAnY28ubmljaG9sbHMucG9rZWRleGdvLnJlbW92ZWFkcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzOiAnUmVtb3ZlIEFkcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICAgc3RvcmUuTk9OX0NPTlNVTUFCTEVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0SW5mbygpOyAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS53aGVuKFwiUmVtb3ZlIEFkc1wiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubG9hZGVkKGZ1bmN0aW9uKHByb2R1Y3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJsb2FkZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGVkKGdldEluZm8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHByb3ZlZChmdW5jdGlvbiAocHJvZHVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9sb2coJ1lvdSBqdXN0IHVubG9ja2VkIHRoZSBGVUxMIFZFUlNJT04hJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNob3dBZHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiYXBwcm92ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0LmZpbmlzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub3duZWQoZnVuY3Rpb24ocHJvZHVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9kdWN0LmZpbmlzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJvd25lZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlZnVuZGVkKGZ1bmN0aW9uKHByb2R1Y3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwicmVmdW5kZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihwcm9kdWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYW5jZWxsZWQoZnVuY3Rpb24ocHJvZHVjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcImNhbmNlbGxlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zaG93QWRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYnV5OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYoJHJvb3RTY29wZS5zaG93QWRzKXtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5vcmRlcignUmVtb3ZlIEFkcycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ1V0aWxpdGllcycsIFV0aWxpdGllcyk7XG5cblx0Ly9VdGlsaXRpZXMuJGluamVjdCA9IFtdO1xuXHRmdW5jdGlvbiBVdGlsaXRpZXMoKSB7XG5cblx0XHRyZXR1cm4ge1xuICAgICAgICAgICAgYjY0dG9CbG9iOiBmdW5jdGlvbihiNjREYXRhLCBjb250ZW50VHlwZSwgc2xpY2VTaXplKXtcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICdpbWFnZS9wbmcnO1xuICAgICAgICAgICAgICAgIHNsaWNlU2l6ZSA9IHNsaWNlU2l6ZSB8fCA1MTI7XG5cbiAgICAgICAgICAgICAgICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xuICAgICAgICAgICAgICAgIHZhciBieXRlQXJyYXlzID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWNlID0gYnl0ZUNoYXJhY3RlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzbGljZVNpemUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGJ5dGVBcnJheXMucHVzaChieXRlQXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoYnl0ZUFycmF5cywge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YVVSTHRvQmxvYjogZnVuY3Rpb24oZGF0YVVSTCwgY29udGVudFR5cGUpe1xuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJ2ltYWdlL3BuZyc7XG4gICAgICAgICAgICAgICAgLy8gRGVjb2RlIHRoZSBkYXRhVVJMICAgXG4gICAgICAgICAgICAgICAgdmFyIGJpbmFyeSA9IGF0b2IoZGF0YVVSTC5zcGxpdCgnLCcpWzFdKTtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgOC1iaXQgdW5zaWduZWQgYXJyYXlcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIG91ciBCbG9iIG9iamVjdFxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmxvYihbbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcbiAgICAgICAgICAgIH1cblx0XHR9O1xuXHR9XG59KSgpOyJdfQ==
