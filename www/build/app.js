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
                $cordovaToast.showShortBottom('Checking new versions...');
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
                                                $cordovaToast.showShortBottom($translate('restarting'));
                                            }).cacth(function(err){
                                                $cordovaToast.showShortBottom(err);
                                            })
                                        }
                                    }
                                ]
                            });
                        }).cacth(function(err){
                            $cordovaToast.showShortBottom(err);
                        });
                    }
                }).cacth(function(err){
                    $cordovaToast.showShortBottom(err);
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

	Model.$inject = ['Users', 'Geolocation', 'Auth', 'Network', 'Admob', 'Audio', 'Chat', 'Loader', 'Media', 'Modals', 'Store'];
	function Model(Users, Geolocation, Auth, Network, Admob, Audio, Chat, Loader, Media, Modals, Store) {

		return {
			Users: Users,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImlzc3Vlcy5qcyIsInF1ZXJpZXMuanMiLCJjb250cm9sbGVycy9hcHAuanMiLCJjb250cm9sbGVycy9jYWxjdWxhdG9yLmpzIiwiY29udHJvbGxlcnMvY2hhdC5qcyIsImNvbnRyb2xsZXJzL2NyZWRpdHMuanMiLCJjb250cm9sbGVycy9ldmVudHMuanMiLCJjb250cm9sbGVycy9maW5kUG9rZW1vbi5qcyIsImNvbnRyb2xsZXJzL2hvbWUuanMiLCJjb250cm9sbGVycy9pdGVtLmpzIiwiY29udHJvbGxlcnMvbXlQcm9maWxlLmpzIiwiY29udHJvbGxlcnMvcG9rZVN0b3BzLmpzIiwiY29udHJvbGxlcnMvcmVwb3J0LmpzIiwiY29udHJvbGxlcnMvc3RhdGlzdGljcy5qcyIsImNvbnRyb2xsZXJzL3RlYW1zLmpzIiwiZmlsdGVycy9lbXB0eVJlcGxhY2UuanMiLCJzZXJ2aWNlcy9hZG1vYi5qcyIsInNlcnZpY2VzL2FuZ3VsYXIuanMiLCJzZXJ2aWNlcy9hdWRpby5qcyIsInNlcnZpY2VzL2F1dGguanMiLCJzZXJ2aWNlcy9jaGF0LmpzIiwic2VydmljZXMvZ2VvbG9jYXRpb24uanMiLCJzZXJ2aWNlcy9pb25pYy5qcyIsInNlcnZpY2VzL2xvYWRlci5qcyIsInNlcnZpY2VzL21lZGlhLmpzIiwic2VydmljZXMvbW9kYWxzLmpzIiwic2VydmljZXMvbW9kZWwuanMiLCJzZXJ2aWNlcy9uZXR3b3JrLmpzIiwic2VydmljZXMvc3RvcmUuanMiLCJzZXJ2aWNlcy91dGlsaXRpZXMuanMiLCJkaXJlY3RpdmVzL2F1dG9saW5rZXIuanMiLCJkaXJlY3RpdmVzL2RheU9yTmlnaHQuanMiLCJkaXJlY3RpdmVzL2hvbGRMaXN0LmpzIiwiZGlyZWN0aXZlcy9pbWcuanMiLCJkaXJlY3RpdmVzL211bHRpcGxlU2VsZWN0LmpzIiwiZGlyZWN0aXZlcy9yZXNpemVIZWlnaHQuanMiLCJkaXJlY3RpdmVzL3NlYXJjaFNlbGVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnQXBwJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuYW5ndWxhci5tb2R1bGUoJ0FwcCcsIFsnaW9uaWMnLCAnaW9uaWMuY2xvdWQnLCAnbmdDb3Jkb3ZhJywgJ25nQW5pbWF0ZScsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJywgJ25nQ29yZG92YU9hdXRoJywgJ2ZpcmViYXNlJywgJ21vbm9zcGFjZWQuZWxhc3RpYycsICdhbmd1bGFyTW9tZW50J10pXG5cbiAgICAucnVuKFsnJGlvbmljUGxhdGZvcm0nLFxuICAgICAgICAnJGFuaW1hdGUnLFxuICAgICAgICAnbXlDb25maWcnLFxuICAgICAgICAnQWRtb2InLFxuICAgICAgICAnU3RvcmUnLFxuICAgICAgICAnYW1Nb21lbnQnLFxuICAgICAgICAnJHJvb3RTY29wZScsXG4gICAgICAgICckaW9uaWNEZXBsb3knLFxuICAgICAgICAnJGNvcmRvdmFUb2FzdCcsXG4gICAgICAgICckaW9uaWNQb3B1cCcsXG4gICAgICAgICckZmlsdGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtLCAkYW5pbWF0ZSwgbXlDb25maWcsIEFkbW9iLCBTdG9yZSwgYW1Nb21lbnQsICRyb290U2NvcGUsICRpb25pY0RlcGxveSwgJGNvcmRvdmFUb2FzdCwgJGlvbmljUG9wdXAsICRmaWx0ZXIpIHtcblxuICAgICAgICAgICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgICAgICAgICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERvbid0IHJlbW92ZSB0aGlzIGxpbmUgdW5sZXNzIHlvdSBrbm93IHdoYXQgeW91IGFyZSBkb2luZy4gSXQgc3RvcHMgdGhlIHZpZXdwb3J0XG4gICAgICAgICAgICAgICAgICAgIC8vIGZyb20gc25hcHBpbmcgd2hlbiB0ZXh0IGlucHV0cyBhcmUgZm9jdXNlZC4gSW9uaWMgaGFuZGxlcyB0aGlzIGludGVybmFsbHkgZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgbXVjaCBuaWNlciBrZXlib2FyZCBleHBlcmllbmNlLlxuICAgICAgICAgICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vUHJlcGFyZSBBZG1vYlxuICAgICAgICAgICAgICAgIEFkbW9iLnByZXBhcmUoKTtcblxuICAgICAgICAgICAgICAgIC8vSW5pdGlhbGl6ZSBTdG9yZVxuICAgICAgICAgICAgICAgIFN0b3JlLmluaXRpYWxpemUoKTtcblxuICAgICAgICAgICAgICAgIC8vQ29uZmlndXJlIGNvZGUgcHVzaFxuICAgICAgICAgICAgICAgIHZhciAkdHJhbnNsYXRlID0gJGZpbHRlcigndHJhbnNsYXRlJyk7XG4gICAgICAgICAgICAgICAgJGlvbmljRGVwbG95LmNoYW5uZWwgPSAnZGV2JztcbiAgICAgICAgICAgICAgICAkY29yZG92YVRvYXN0LnNob3dTaG9ydEJvdHRvbSgnQ2hlY2tpbmcgbmV3IHZlcnNpb25zLi4uJyk7XG4gICAgICAgICAgICAgICAgJGlvbmljRGVwbG95LmNoZWNrKCkudGhlbihmdW5jdGlvbihzbmFwc2hvdEF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc25hcHNob3RBdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY0RlcGxveS5kb3dubG9hZCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRpb25pY0RlcGxveS5leHRyYWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZSgnY2FuY2VsVGV4dCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJUaXRsZTogJHRyYW5zbGF0ZSgndXBkYXRlRG93bmxvYWRlZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICR0cmFuc2xhdGUoJ25vdE5vdycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAkdHJhbnNsYXRlKCdyZXN0YXJ0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25UYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNEZXBsb3kubG9hZCgpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhVG9hc3Quc2hvd1Nob3J0Qm90dG9tKCR0cmFuc2xhdGUoJ3Jlc3RhcnRpbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhY3RoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVRvYXN0LnNob3dTaG9ydEJvdHRvbShlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2FjdGgoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YVRvYXN0LnNob3dTaG9ydEJvdHRvbShlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYWN0aChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICAkY29yZG92YVRvYXN0LnNob3dTaG9ydEJvdHRvbShlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vRW5hYmxlIEFuZ3VsYXIgYW5pbWF0aW9uXG4gICAgICAgICAgICAkYW5pbWF0ZS5lbmFibGVkKHRydWUpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHRyYW5zbGF0ZUNoYW5nZUVuZCcsIGZ1bmN0aW9uKGRhdGEsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBhbU1vbWVudC5jaGFuZ2VMb2NhbGUoY3VycmVudC5sYW5ndWFnZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSlcbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLFxuICAgICAgICAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICAgICAgJyRpb25pY0NvbmZpZ1Byb3ZpZGVyJyxcbiAgICAgICAgJyRjb21waWxlUHJvdmlkZXInLFxuICAgICAgICBcIiR0cmFuc2xhdGVQcm92aWRlclwiLFxuICAgICAgICBcIiRpb25pY0Nsb3VkUHJvdmlkZXJcIixcbiAgICAgICAgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRpb25pY0NvbmZpZ1Byb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCAkdHJhbnNsYXRlUHJvdmlkZXIsICRpb25pY0Nsb3VkUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJGlvbmljQ2xvdWRQcm92aWRlci5pbml0KHtcbiAgICAgICAgICAgICAgICBcImNvcmVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFwcF9pZFwiOiBcIjhkNWNkMjdkXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBhcGlLZXk6IFwiQUl6YVN5QWtZSmZXMEQxRXNEUEVsWXFKb2FuM0FINlg4YWdRcjJrXCIsXG4gICAgICAgICAgICAgICAgYXV0aERvbWFpbjogXCJwb2tlZGV4LWdvLTZmNWYyLmZpcmViYXNlYXBwLmNvbVwiLFxuICAgICAgICAgICAgICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcG9rZWRleC1nby02ZjVmMi5maXJlYmFzZWlvLmNvbVwiLFxuICAgICAgICAgICAgICAgIHByb2plY3RJZDogXCJwb2tlZGV4LWdvLTZmNWYyXCIsXG4gICAgICAgICAgICAgICAgc3RvcmFnZUJ1Y2tldDogXCJwb2tlZGV4LWdvLTZmNWYyLmFwcHNwb3QuY29tXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNDgwODQxMjU1NTIwXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICRjb21waWxlUHJvdmlkZXIuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfGZpbGV8YmxvYnxjb250ZW50fG1zLWFwcHh8eC13bWFwcDApOnxkYXRhOmltYWdlXFwvfGltZ1xcLy8pO1xuICAgICAgICAgICAgJGNvbXBpbGVQcm92aWRlci5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZ0cHxtYWlsdG98ZmlsZXxnaHR0cHM/fG1zLWFwcHh8eC13bWFwcDApOi8pO1xuXG4gICAgICAgICAgICBpZiAoaW9uaWMuUGxhdGZvcm0uaXNJT1MoKSkge1xuICAgICAgICAgICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnNjcm9sbGluZy5qc1Njcm9sbGluZyh0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIudmlld3Muc3dpcGVCYWNrRW5hYmxlZChmYWxzZSk7XG4gICAgICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci5uYXZCYXIuYWxpZ25UaXRsZSgncmlnaHQnKTtcblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVN0YXRpY0ZpbGVzTG9hZGVyKHtcbiAgICAgICAgICAgICAgICBwcmVmaXg6ICdsYW5ndWFnZS8nLFxuICAgICAgICAgICAgICAgIHN1ZmZpeDogJy5qc29uJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ2VuJywgJ2VzJ10sIHtcbiAgICAgICAgICAgICAgICAnZW5fKic6ICdlbicsXG4gICAgICAgICAgICAgICAgJ2VzXyonOiAnZXMnLFxuICAgICAgICAgICAgICAgICcqJzogJ2VuJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlci5kZXRlcm1pbmVQcmVmZXJyZWRMYW5ndWFnZSgpO1xuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLmZhbGxiYWNrTGFuZ3VhZ2UoJ2VuJyk7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50TGFuZyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFuZycpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRMYW5nKSB7XG4gICAgICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKGN1cnJlbnRMYW5nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlJyk7XG5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcHAnLFxuICAgICAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FwcENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tZW51Lmh0bWwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5ob21lJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2hvbWVcIixcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2hvbWUuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAudGVhbXMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVhbXNcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvdGVhbXMuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUZWFtc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnRlYW1zLmNoYXQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY2hhdFwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW06ICdhbGwnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGF1dGg6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndmlld0NvbnRlbnRAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9jaGF0Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hhdENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNyZWRpdHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY3JlZGl0c1wiLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvY3JlZGl0cy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWRpdHNDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5pdGVtJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2l0ZW0ve3RpdGxlfVwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2l0ZW0uaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJdGVtQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuZmluZFBva2Vtb24nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvZmluZFBva2Vtb25cIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9maW5kUG9rZW1vbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZpbmRQb2tlbW9uQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuZXZlbnRzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2V2ZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2V2ZW50cy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0V2ZW50c0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZXBvcnRcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9yZXBvcnQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5teVByb2ZpbGUnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvbXlQcm9maWxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvbXlQcm9maWxlLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTXlQcm9maWxlQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAucG9rZVN0b3BzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3Bva2VTdG9wc1wiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Bva2VTdG9wcy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Bva2VTdG9wc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNhbGN1bGF0b3InLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY2FsY3VsYXRvclwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2NhbGN1bGF0b3IuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYWxjdWxhdG9yQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuc3RhdGlzdGljcycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9zdGF0aXN0aWNzXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvc3RhdGlzdGljcy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1N0YXRpc3RpY3NDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgJHN0YXRlID0gJGluamVjdG9yLmdldChcIiRzdGF0ZVwiKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuaG9tZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XSlcbiAgICAuY29uc3RhbnQoJ215Q29uZmlnJywge1xuICAgICAgICBnb29nbGVDbGllbnRJZDogXCI0ODA4NDEyNTU1MjAtZWlmbDc2YnZyYnRwOWh2MzZzdGU1dGM5ZWFxdmpuaWYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIixcbiAgICAgICAgZmlyZWJhc2VVcmw6IFwiaHR0cHM6Ly9wb2tlZGV4LWdvLTZmNWYyLmZpcmViYXNlaW8uY29tXCIsXG4gICAgICAgIGZpcmViYXNlTXNnVXJsOiBcIlwiLFxuICAgICAgICBhdXRoRXZlbnRzOiB7XG4gICAgICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICAgICAgfSxcbiAgICAgICAgYWRNb2I6IHtcbiAgICAgICAgICAgIGlkOiAnY2EtYXBwLXB1Yi0xMzQxNjA0NjE1MjEyMjAyLzQ3MTA3NTMxNzgnXG4gICAgICAgIH1cbiAgICB9KTsiLCIvKiBnbG9iYWwgaW9uaWMgKi9cbihmdW5jdGlvbiAoYW5ndWxhciwgaW9uaWMpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aW9uaWMuUGxhdGZvcm0uaXNJRSA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gaW9uaWMuUGxhdGZvcm0udWEudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd0cmlkZW50JykgPiAtMTtcblx0fVxuXG5cdGlmIChpb25pYy5QbGF0Zm9ybS5pc0lFKCkpIHtcblx0XHRhbmd1bGFyLm1vZHVsZSgnaW9uaWMnKVxuXHRcdFx0LmZhY3RvcnkoJyRpb25pY05nQ2xpY2snLCBbJyRwYXJzZScsICckdGltZW91dCcsIGZ1bmN0aW9uICgkcGFyc2UsICR0aW1lb3V0KSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGNsaWNrRXhwcikge1xuXHRcdFx0XHRcdHZhciBjbGlja0hhbmRsZXIgPSBhbmd1bGFyLmlzRnVuY3Rpb24oY2xpY2tFeHByKSA/IGNsaWNrRXhwciA6ICRwYXJzZShjbGlja0V4cHIpO1xuXG5cdFx0XHRcdFx0ZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0XHRcdHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jbGlja3RpbWVyKSByZXR1cm47IC8vIFNlY29uZCBjYWxsXG5cdFx0XHRcdFx0XHRcdGNsaWNrSGFuZGxlcihzY29wZSwgeyAkZXZlbnQ6IChldmVudCkgfSk7XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNsaWNrdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7IGRlbGV0ZSBzY29wZS5jbGlja3RpbWVyOyB9LCAxLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIEhhY2sgZm9yIGlPUyBTYWZhcmkncyBiZW5lZml0LiBJdCBnb2VzIHNlYXJjaGluZyBmb3Igb25jbGljayBoYW5kbGVycyBhbmQgaXMgbGlhYmxlIHRvIGNsaWNrXG5cdFx0XHRcdFx0Ly8gc29tZXRoaW5nIGVsc2UgbmVhcmJ5LlxuXHRcdFx0XHRcdGVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChldmVudCkgeyB9O1xuXHRcdFx0XHR9O1xuXHRcdFx0fV0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gU2VsZWN0RGlyZWN0aXZlKCkge1xuXHRcdCd1c2Ugc3RyaWN0JztcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogZmFsc2UsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcblx0XHRcdFx0aWYgKGlvbmljLlBsYXRmb3JtICYmIChpb25pYy5QbGF0Zm9ybS5pc1dpbmRvd3NQaG9uZSgpIHx8IGlvbmljLlBsYXRmb3JtLmlzSUUoKSB8fCBpb25pYy5QbGF0Zm9ybS5wbGF0Zm9ybSgpID09PSBcImVkZ2VcIikpIHtcblx0XHRcdFx0XHRlbGVtZW50LmF0dHIoJ2RhdGEtdGFwLWRpc2FibGVkJywgJ3RydWUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRhbmd1bGFyLm1vZHVsZSgnaW9uaWMnKVxuICAgIC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7XG5cblx0Lyphbmd1bGFyLm1vZHVsZSgnaW9uaWMtZGF0ZXBpY2tlcicpXG5cdC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7Ki9cblxufSkoYW5ndWxhciwgaW9uaWMpOyIsIndpbmRvdy5xdWVyaWVzID0gW1xuXHQvL0Ryb3AgdGFibGVzXG4gICBcIkRST1AgVEFCTEUgSUYgRVhJU1RTIFVzZXJzO1wiLFxuXHQvL0NyZWF0ZSB0YWJsZXNcblx0XCJDUkVBVEUgVEFCTEUgVXNlcnMgKElkVXNlciBpbnRlZ2VyIHByaW1hcnkga2V5IGF1dG9pbmNyZW1lbnQsIE5hbWUgdGV4dCBub3QgbnVsbCk7XCIsXG5cdC8vSW5zZXJ0IFVzZXJzXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdKdWFuIERhdmlkIE5pY2hvbGxzIENhcmRvbmEnKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0tocml6dGlhbiBNb3Jlbm8gWnVsdWFnYScpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnQ3Jpc3RpYW4gUml2YXMgQnVpdHJhZ28nKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0p1YW4gRGF2aWQgU8OhbmNoZXonKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ05pY29sYXMgTW9saW5hJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdNaXlhbW90byBNdXNhc2hpIEZJbGFuZGVyJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdEaWRpZXIgSGVybmFuZGV6Jyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdMdWlzIEVkdWFyZG8gT3F1ZW5kbyBQw6lyZXonKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0NhcmxvcyBSb2phcycpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnTGV2YW5vIENhc3RpbGxhIENhcmxvcyBNaWd1ZWwnKTtcIlxuXTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKTtcblxuICAgIEFwcENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ215Q29uZmlnJywgJ0lvbmljJywgJ01vZGVsJywgJ0FuZ3VsYXInXTtcbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRzY29wZSwgbXlDb25maWcsIElvbmljLCBNb2RlbCwgQW5ndWxhcikge1xuICAgICAgICBcbiAgICAgICAgdmFyICR0cmFuc2xhdGUgPSBBbmd1bGFyLiRmaWx0ZXIoJ3RyYW5zbGF0ZScpO1xuXG4gICAgICAgICRzY29wZS5pdGVtcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogXCJpb24tY2hhdGJveGVzXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwidGVhbXNcIixcbiAgICAgICAgICAgICAgICBzdGF0ZTogJ2FwcC50ZWFtcycsXG4gICAgICAgICAgICAgICAgaW1nOiBcImltZy9wb2tlc3RvcC5zdmdcIixcbiAgICAgICAgICAgICAgICBsZWZ0OiBcIjg4cHhcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1pb3MtcGVvcGxlXCIsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6IFwiY3JlZGl0c1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiBcImFwcC5jcmVkaXRzXCJcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tZWFydGhcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJldmVudHNcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5ldmVudHMnXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1jbGlwYm9hcmRcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJyZXBvcnRcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5yZXBvcnQnXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1wZXJzb25cIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJteV9wcm9maWxlXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6ICdhcHAubXlQcm9maWxlJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tYW5kcm9pZC1jYXJ0XCIsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6IFwicG9rZV9zdG9wc1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLnBva2VTdG9wcydcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWNhbGN1bGF0b3JcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJjYWxjdWxhdG9yXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6ICdhcHAuY2FsY3VsYXRvcidcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWNvbm5lY3Rpb24tYmFyc1wiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcInN0YXRpc3RpY3NcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5zdGF0aXN0aWNzJ1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBzaG93QXV0aGVudGljYXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLnBvcHVwID0gSW9uaWMuJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2xvZ0luVGl0bGUnKSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tb2RhbHMvYXV0aC5odG1sJyxcbiAgICAgICAgICAgICAgICBoaWRlT25TdGF0ZUNoYW5nZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBva1RleHQ6ICR0cmFuc2xhdGUoJ2NhbmNlbFRleHQnKSxcbiAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2FuaW1hdGVkIHJvbGxJbidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBuZXh0U3RhdGUgPSBudWxsO1xuXG4gICAgICAgICRzY29wZS4kb24obXlDb25maWcuYXV0aEV2ZW50cy5ub3RBdXRob3JpemVkLCBmdW5jdGlvbihldmVudCwgYXJncykge1xuICAgICAgICAgICAgbmV4dFN0YXRlID0ge1xuICAgICAgICAgICAgICAgIG5leHQ6IGFyZ3MubmV4dCxcbiAgICAgICAgICAgICAgICBuZXh0UGFyYW1zOiBhcmdzLm5leHRQYXJhbXNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzaG93QXV0aGVudGljYXRpb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIFVzZXJBdXRoZW50aWNhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZWxmLnN0b3BwZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgTW9kZWwuTmV0d29yay50cnlUb0Nvbm5lY3QoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgTW9kZWwuQXV0aC5sb2dpbigpLnRoZW4oZnVuY3Rpb24oYXV0aCl7XG4gICAgICAgICAgICAgICAgICAgIE1vZGVsLkxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKG5leHRTdGF0ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBBbmd1bGFyLiRyb290U2NvcGUudXNlciA9IGF1dGgudXNlciB8fCBhdXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgQW5ndWxhci4kc3RhdGUuZ28obmV4dFN0YXRlLm5leHQsIG5leHRTdGF0ZS5uZXh0UGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIpXG4gICAgICAgICAgICAgICAgICAgIGlmKCFzZWxmLnN0b3BwZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgaWYoIXNlbGYuc3RvcHBlZCl7XG4gICAgICAgICAgICAgICAgICAgIE1vZGVsLkxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wb3B1cCA9IElvbmljLiRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlKCduZXR3b3JrRXJyb3JUaXRsZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUoJ25ldHdvcmtFcnJvclRlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlT25TdGFnZUNoYW5nZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnYW5pbWF0ZWQgcm90YXRlSW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWFzc2VydGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY3VycmVudEF1dGhlbnRpY2F0aW9uO1xuXG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5Mb2FkZXIuc2hvdygkc2NvcGUpO1xuICAgICAgICAgICAgaWYoJHNjb3BlLnBvcHVwICYmICRzY29wZS5wb3B1cC5jbG9zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wb3B1cC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICRzY29wZS5wb3B1cCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1cnJlbnRBdXRoZW50aWNhdGlvbiA9IG5ldyBVc2VyQXV0aGVudGljYXRpb24oKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIElvbmljLiRpb25pY1BvcHVwLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlKCdsb2dPdXRUaXRsZScpLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAkdHJhbnNsYXRlKCdsb2dPdXRUZW1wbGF0ZScpLFxuICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZSgnbG9nT3V0T2snKSxcbiAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICBjYW5jZWxUZXh0OiAkdHJhbnNsYXRlKCdjYW5jZWxUZXh0JyksXG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdhbmltYXRlZCBib3VuY2VJbkRvd24nXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgcmVzICYmIE1vZGVsLkF1dGgubG9nb3V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc3RvcExvYWRpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICBNb2RlbC5OZXR3b3JrLnN0b3AoKTtcbiAgICAgICAgICAgIGN1cnJlbnRBdXRoZW50aWNhdGlvbi5zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUub3BlbkFkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkF1ZGlvLnBsYXkoJ3Bpa2FwaScpO1xuICAgICAgICAgICAgTW9kZWwuQWRtb2Iub3BlbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5leGl0QXBwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW9uaWMuUGxhdGZvcm0uZXhpdEFwcCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIE1vZGVsLkF1ZGlvLnByZWxvYWQoJ3Bpa2FwaScpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NhbGN1bGF0b3JDb250cm9sbGVyJywgQ2FsY3VsYXRvckNvbnRyb2xsZXIpO1xuXG4gICAgQ2FsY3VsYXRvckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdJb25pYycsICdBbmd1bGFyJ107XG5cbiAgICBmdW5jdGlvbiBDYWxjdWxhdG9yQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgSW9uaWMsIEFuZ3VsYXIpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgIElvbmljLiRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBBbmd1bGFyLiRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oZmlyZWJhc2UpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NoYXRDb250cm9sbGVyJywgQ2hhdENvbnRyb2xsZXIpO1xuXG4gICAgQ2hhdENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0FuZ3VsYXInLCAnSW9uaWMnLCAnTW9kZWwnLCAnJGNvcmRvdmFDbGlwYm9hcmQnLCAnJHN0YXRlUGFyYW1zJ107XG4gICAgZnVuY3Rpb24gQ2hhdENvbnRyb2xsZXIoJHNjb3BlLCBBbmd1bGFyLCBJb25pYywgTW9kZWwsICRjb3Jkb3ZhQ2xpcGJvYXJkLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICAgICB2YXIgJHRyYW5zbGF0ZSA9IEFuZ3VsYXIuJGZpbHRlcigndHJhbnNsYXRlJyk7XG5cbiAgICAgICAgdmFyIHZpZXdTY3JvbGwgPSBJb25pYy4kaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ3VzZXJNZXNzYWdlU2Nyb2xsJyk7XG4gICAgICAgIHZhciBmb290ZXJCYXI7IC8vIGdldHMgc2V0IGluICRpb25pY1ZpZXcuZW50ZXJcbiAgICAgICAgdmFyIHNjcm9sbGVyO1xuICAgICAgICB2YXIgdHh0SW5wdXQ7XG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9IFtdO1xuXG4gICAgICAgIHZhciBjcmVhdGVNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuX2lkID0gbm93LmdldFRpbWUoKTsgLy8gOn4pXG4gICAgICAgICAgICBtZXNzYWdlLmRhdGUgPSBub3cudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIG1lc3NhZ2UudXNlcm5hbWUgPSAkc2NvcGUudXNlci51c2VybmFtZTtcbiAgICAgICAgICAgIG1lc3NhZ2UudXNlcklkID0gJHNjb3BlLnVzZXIuX2lkO1xuICAgICAgICAgICAgbWVzc2FnZS5waWMgPSAkc2NvcGUudXNlci5waWMgfHwgbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihzZW5kTWVzc2FnZUZvcm0pIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgIHRleHQ6ICRzY29wZS5pbnB1dC5tZXNzYWdlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBpZiB5b3UgZG8gYSB3ZWIgc2VydmljZSBjYWxsIHRoaXMgd2lsbCBiZSBuZWVkZWQgYXMgd2VsbCBhcyBiZWZvcmUgdGhlIHZpZXdTY3JvbGwgY2FsbHNcbiAgICAgICAgICAgIC8vIHlvdSBjYW4ndCBzZWUgdGhlIGVmZmVjdCBvZiB0aGlzIGluIHRoZSBicm93c2VyIGl0IG5lZWRzIHRvIGJlIHVzZWQgb24gYSByZWFsIGRldmljZVxuICAgICAgICAgICAgLy8gZm9yIHNvbWUgcmVhc29uIHRoZSBvbmUgdGltZSBibHVyIGV2ZW50IGlzIG5vdCBmaXJpbmcgaW4gdGhlIGJyb3dzZXIgYnV0IGRvZXMgb24gZGV2aWNlc1xuICAgICAgICAgICAga2VlcEtleWJvYXJkT3BlbigpO1xuXG4gICAgICAgICAgICBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkc2NvcGUuaW5wdXQubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBNb2RlbC5DaGF0LmFkZE1lc3NhZ2VBbmRMb2NhdGlvbihtZXNzYWdlKTtcblxuICAgICAgICAgICAgQW5ndWxhci4kdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBrZWVwS2V5Ym9hcmRPcGVuKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBrZWVwS2V5Ym9hcmRPcGVuKCkge1xuICAgICAgICAgICAgdHh0SW5wdXQub25lKCdibHVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdHh0SW5wdXRbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm9uTWVzc2FnZUhvbGQgPSBmdW5jdGlvbihlLCBpdGVtSW5kZXgsIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmKCFtZXNzYWdlLnBob3RvKXtcbiAgICAgICAgICAgICAgICBJb25pYy4kaW9uaWNBY3Rpb25TaGVldC5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICR0cmFuc2xhdGUoJ2NvcHlNZXNzYWdlJylcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YUNsaXBib2FyZC5jb3B5KG1lc3NhZ2UudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyB0aGlzIHByb2Igc2VlbXMgd2VpcmQgaGVyZSBidXQgSSBoYXZlIHJlYXNvbnMgZm9yIHRoaXMgaW4gbXkgYXBwLCBzZWNyZXQhXG4gICAgICAgICRzY29wZS52aWV3UHJvZmlsZSA9IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgaWYgKG1zZy51c2VySWQgPT09ICRzY29wZS51c2VyLl9pZCkge1xuICAgICAgICAgICAgICAgIC8vIGdvIHRvIHlvdXIgcHJvZmlsZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBnbyB0byBvdGhlciB1c2VycyBwcm9maWxlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignZWxhc3RpYzpyZXNpemUnLCBmdW5jdGlvbihldmVudCwgZWxlbWVudCwgb2xkSGVpZ2h0LCBuZXdIZWlnaHQpIHtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWZvb3RlckJhcikgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbmV3Rm9vdGVySGVpZ2h0ID0gbmV3SGVpZ2h0ICsgMTA7XG4gICAgICAgICAgICBuZXdGb290ZXJIZWlnaHQgPSAobmV3Rm9vdGVySGVpZ2h0ID4gNDQpID8gbmV3Rm9vdGVySGVpZ2h0IDogNDQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvb3RlckJhci5zdHlsZS5oZWlnaHQgPSBuZXdGb290ZXJIZWlnaHQgKyAncHgnO1xuICAgICAgICAgICAgc2Nyb2xsZXIuc3R5bGUuYm90dG9tID0gbmV3Rm9vdGVySGVpZ2h0ICsgJ3B4JzsgXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5vblByb2ZpbGVQaWNFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICdodHRwczovL3d3dy5nb29nbGUuY29tLnVhL2ltYWdlcy9zcnByL2xvZ280dy5wbmcnOyAvLyBzZXQgYSBmYWxsYmFja1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5yZWZyZXNoU2Nyb2xsID0gZnVuY3Rpb24oc2Nyb2xsQm90dG9tLCB0aW1lb3V0KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsQm90dG9tID0gc2Nyb2xsQm90dG9tIHx8ICRzY29wZS5zY3JvbGxEb3duO1xuICAgICAgICAgICAgICAgIHZpZXdTY3JvbGwucmVzaXplKCk7XG4gICAgICAgICAgICAgICAgaWYoc2Nyb2xsQm90dG9tKXtcbiAgICAgICAgICAgICAgICAgICAgdmlld1Njcm9sbC5zY3JvbGxCb3R0b20odHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzY29wZS5jaGVja1Njcm9sbCgpO1xuICAgICAgICAgICAgfSwgdGltZW91dCB8fCAxMDAwKTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnNjcm9sbERvd24gPSB0cnVlO1xuICAgICAgICAkc2NvcGUuY2hlY2tTY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBbmd1bGFyLiR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VG9wID0gdmlld1Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpLnRvcDtcbiAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsYWJsZURpc3RhbmNlRnJvbVRvcCA9IHZpZXdTY3JvbGwuZ2V0U2Nyb2xsVmlldygpLl9fbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgICRzY29wZS5zY3JvbGxEb3duID0gKGN1cnJlbnRUb3AgPj0gbWF4U2Nyb2xsYWJsZURpc3RhbmNlRnJvbVRvcCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcmVmcmVzaExvY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkdlb2xvY2F0aW9uLmdldExvY2F0aW9uKCkudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgICAgICAgICAgTW9kZWwuQ2hhdC51cGRhdGVHZW9RdWVyeShwb3NpdGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9jYXRpb25JbnRlcnZhbDtcbiAgICAgICAgdmFyIGluaXRDaGF0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkxvYWRlci5zaG93KCRzY29wZSk7XG4gICAgICAgICAgICBNb2RlbC5HZW9sb2NhdGlvbi5nZXRMb2NhdGlvbigpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICAgICAgICAgIE1vZGVsLkxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgTW9kZWwuQ2hhdC5pbml0aWFsaXplKCRzdGF0ZVBhcmFtcy50ZWFtKTtcbiAgICAgICAgICAgICAgICBNb2RlbC5DaGF0LmNyZWF0ZUdlb1F1ZXJ5KCRzY29wZS5tZXNzYWdlcywgJHNjb3BlLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBJb25pYy4kaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2dwc1RpdGxlJyksXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAkdHJhbnNsYXRlKCdncHNUZW1wbGF0ZScpLFxuICAgICAgICAgICAgICAgICAgICBva1RleHQ6ICR0cmFuc2xhdGUoJ29rVGV4dCcpLFxuICAgICAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsVGV4dDogJHRyYW5zbGF0ZSgnY2FuY2VsVGV4dCcpLFxuICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2FuaW1hdGVkIGJvdW5jZUluRG93bidcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0Q2hhdCgpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tUb1RlYW1TdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBiYWNrVG9UZWFtU3RhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgIElvbmljLiRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBBbmd1bGFyLiRzdGF0ZS5nbygnYXBwLnRlYW1zJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVFbnRlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBmaXJlYmFzZS5hdXRoKCkuY3VycmVudFVzZXIgfHwgQW5ndWxhci4kcm9vdFNjb3BlLnVzZXI7XG4gICAgICAgICAgICBpZighY3VycmVudFVzZXIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBiYWNrVG9UZWFtU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS51c2VyID0ge1xuICAgICAgICAgICAgICAgIF9pZDogY3VycmVudFVzZXIuZW1haWwsXG4gICAgICAgICAgICAgICAgcGljOiBjdXJyZW50VXNlci5waG90b1VSTCB8fCBjdXJyZW50VXNlci5wcm92aWRlckRhdGFbMF0ucGhvdG9VUkwgfHwgJ2ltZy9wbGF5ZXIuc3ZnJyxcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogKFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlci5kaXNwbGF5TmFtZSB8fCBjdXJyZW50VXNlci5wcm92aWRlckRhdGFbMF0uZGlzcGxheU5hbWUgfHwgY3VycmVudFVzZXIuZW1haWwuc3BsaXQoJ0AnKVswXVxuICAgICAgICAgICAgICAgICkuc3BsaXQoJyAnKS5zcGxpY2UoMCwgMikuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGluaXRDaGF0KCk7XG4gICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3NCYXIgPSAwO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmVudGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZm9vdGVyQmFyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcuY2hhdFZpZXcgLmJhci1mb290ZXInKTtcbiAgICAgICAgICAgICAgICBzY3JvbGxlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmNoYXRWaWV3IC5zY3JvbGwtY29udGVudCcpO1xuICAgICAgICAgICAgICAgIHR4dElucHV0ID0gYW5ndWxhci5lbGVtZW50KGZvb3RlckJhci5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgICAgICBsb2NhdGlvbkludGVydmFsID0gQW5ndWxhci4kaW50ZXJ2YWwocmVmcmVzaExvY2F0aW9uLCAxMjAwMDApO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmJlZm9yZUxlYXZlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIEFuZ3VsYXIuJGludGVydmFsLmNhbmNlbChsb2NhdGlvbkludGVydmFsKTtcbiAgICAgICAgICAgIE1vZGVsLkNoYXQuZGVzdHJveUdlb1F1ZXJ5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5zdG9wTG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL1RPRE86IENhbmNlbCBsb2FkaW5nIGFuZCBiYWNrXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnNlbmRQaG90byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5NZWRpYS5nZXRQaG90bygpLnRoZW4oZnVuY3Rpb24oaW1hZ2VEYXRhKXtcbiAgICAgICAgICAgICAgICB2YXIgbXNnSW5mbyA9IE1vZGVsLkNoYXQuYWRkRW1wdHlNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgTW9kZWwuTWVkaWEudXBsb2FkRmlsZShpbWFnZURhdGEsICdjaGF0JywgbXNnSW5mby5rZXkpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGhvdG8gOiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgTW9kZWwuQ2hhdC51cGRhdGVNZXNzYWdlQW5kTG9jYXRpb24obXNnSW5mby5wYXRoLCBtc2dJbmZvLmtleSwgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzc0JhciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3NCYXIgPSBwcm9ncmVzcyArIFwiJVwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnBob3RvQnJvd3NlciA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VzID0gQW5ndWxhci4kZmlsdGVyKCdmaWx0ZXInKSgkc2NvcGUubWVzc2FnZXMsIHsgcGhvdG86ICcnIH0pO1xuICAgICAgICAgICAgJHNjb3BlLmFjdGl2ZVNsaWRlID0gbWVzc2FnZXMuaW5kZXhPZihtZXNzYWdlKTtcbiAgICAgICAgICAgICRzY29wZS5hbGxJbWFnZXMgPSBtZXNzYWdlcy5tYXAoZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UucGhvdG87XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTW9kZWwuTW9kYWxzLm9wZW5Nb2RhbCgkc2NvcGUsICd0ZW1wbGF0ZXMvbW9kYWxzL2Z1bGxzY3JlZW5JbWFnZXMuaHRtbCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLk1vZGFscy5jbG9zZU1vZGFsKCk7XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NyZWRpdHNDb250cm9sbGVyJywgQ3JlZGl0c0NvbnRyb2xsZXIpO1xuXG4gICAgQ3JlZGl0c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XG4gICAgZnVuY3Rpb24gQ3JlZGl0c0NvbnRyb2xsZXIoJHNjb3BlKSB7XG4gICAgICAgIFxuICAgICAgICBcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdFdmVudHNDb250cm9sbGVyJywgRXZlbnRzQ29udHJvbGxlcik7XG5cbiAgICBFdmVudHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBFdmVudHNDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignRmluZFBva2Vtb25Db250cm9sbGVyJywgRmluZFBva2Vtb25Db250cm9sbGVyKTtcblxuICAgIEZpbmRQb2tlbW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gRmluZFBva2Vtb25Db250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLm5hbWVzID0gW1xuICAgICAgICAgICAgeyBuYW1lOiBcIllhXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJZYVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiWWFcIiB9XG4gICAgICAgIF07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbihmaXJlYmFzZSkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XG5cbiAgICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQW5ndWxhcicsICdJb25pYycsICdNb2RlbCddO1xuICAgIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSwgQW5ndWxhciwgSW9uaWMsIE1vZGVsKSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUub3Blbkl0ZW0gPSBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIEFuZ3VsYXIuJHN0YXRlLmdvKGl0ZW0uc3RhdGUsIHsgdGl0bGU6IGl0ZW0udGl0bGUsIGljb246IGl0ZW0uaWNvbiwgY29sb3I6IGl0ZW0uY29sb3IgfSk7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5jdXJyZW50TGFuZ3VhZ2UgPSBBbmd1bGFyLiR0cmFuc2xhdGUudXNlKCk7XG4gICAgICAgICRzY29wZS5sYW5ndWFnZXMgPSBBbmd1bGFyLiR0cmFuc2xhdGUuZ2V0QXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKCk7XG5cbiAgICAgICAgSW9uaWMuJGlvbmljUG9wb3Zlci5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9tb2RhbHMvY2hhbmdlTGFuZ3VhZ2UuaHRtbCcsIHtcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocG9wb3Zlcikge1xuICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIgPSBwb3BvdmVyO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUub3BlblBvcG92ZXIgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5zaG93KCRldmVudCk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uKGxhbmcpe1xuICAgICAgICAgICAgQW5ndWxhci4kdHJhbnNsYXRlLnVzZShsYW5nKTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50TGFuZ3VhZ2UgPSBsYW5nO1xuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYW5nJywgbGFuZyk7XG4gICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kZWwuQXVkaW8ucHJlbG9hZCgncGlrYWNodScpO1xuXG4gICAgICAgICRzY29wZS5wbGF5QXVkaW8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3BsYXknKVxuICAgICAgICAgICAgTW9kZWwuQXVkaW8ucGxheSgncGlrYWNodScpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pbml0U3RvcmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuU3RvcmUuYnV5KCk7XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdJdGVtQ29udHJvbGxlcicsIEl0ZW1Db250cm9sbGVyKTtcblxuICAgIEl0ZW1Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBJdGVtQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignTXlQcm9maWxlQ29udHJvbGxlcicsIE15UHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gICAgTXlQcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gTXlQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Bva2VTdG9wc0NvbnRyb2xsZXInLCBQb2tlU3RvcHNDb250cm9sbGVyKTtcblxuICAgIFBva2VTdG9wc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIFBva2VTdG9wc0NvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdSZXBvcnRDb250cm9sbGVyJywgUmVwb3J0Q29udHJvbGxlcik7XG5cbiAgICBSZXBvcnRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBSZXBvcnRDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignU3RhdGlzdGljc0NvbnRyb2xsZXInLCBTdGF0aXN0aWNzQ29udHJvbGxlcik7XG5cbiAgICBTdGF0aXN0aWNzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gU3RhdGlzdGljc0NvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdUZWFtc0NvbnRyb2xsZXInLCBUZWFtc0NvbnRyb2xsZXIpO1xuXG4gICAgVGVhbXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnXTtcblxuICAgIGZ1bmN0aW9uIFRlYW1zQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlIHx8ICd0ZWFtcycsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbiB8fCAnaW9uLWFuZHJvaWQtZ2xvYmUnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpLmZpbHRlcignbmwyYnInLCBbJyRmaWx0ZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24oJGZpbHRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLnJlcGxhY2UoL1xcblxccj8vZywgJzxiciAvPicpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBZG1vYicsIEFkbW9iKTtcblxuICAgIEFkbW9iLiRpbmplY3QgPSBbJ215Q29uZmlnJywgJyR3aW5kb3cnLCAnJHJvb3RTY29wZScsICckaW50ZXJ2YWwnXTtcbiAgICBmdW5jdGlvbiBBZG1vYihteUNvbmZpZywgJHdpbmRvdywgJHJvb3RTY29wZSwgJGludGVydmFsKSB7XG5cbiAgICAgICAgdmFyIHZhbGlkYXRlQWRtb2IgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoISRyb290U2NvcGUuYWRtb2Ipe1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsRGF0ZSA9IG5ldyBEYXRlKCR3aW5kb3cubG9jYWxTdG9yYWdlW1wiYWRtb2JEYXRlXCJdIHx8IChuZXcgRGF0ZSgpKS5zZXREYXRlKGN1cnJlbnREYXRlLmdldERhdGUoKSAtIDEpKTtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50RGF0ZSA+IGxvY2FsRGF0ZSl7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYWRtb2IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkaW50ZXJ2YWwodmFsaWRhdGVBZG1vYiwgMTAwMDApO1xuICAgICAgICB2YWxpZGF0ZUFkbW9iKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByZXBhcmUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICR3aW5kb3cuQWRNb2IgJiYgJHdpbmRvdy5BZE1vYi5wcmVwYXJlSW50ZXJzdGl0aWFsKHtcbiAgICAgICAgICAgICAgICAgICAgYWRJZDogbXlDb25maWcuYWRNb2IuaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzVGVzdGluZzogdHJ1ZSwgLy8gVE9ETzogcmVtb3ZlIHRoaXMgbGluZSB3aGVuIHJlbGVhc2VcbiAgICAgICAgICAgICAgICAgICAgYXV0b1Nob3c6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkbW9iID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZS5zZXRNaW51dGVzKGN1cnJlbnREYXRlLmdldE1pbnV0ZXMoKSArIDUpO1xuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW1wiYWRtb2JEYXRlXCJdID0gY3VycmVudERhdGU7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5BZE1vYiAmJiAkd2luZG93LkFkTW9iLnNob3dJbnRlcnN0aXRpYWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmVwYXJlKCk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmVwYXJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ0FuZ3VsYXInLCBBbmd1bGFyKTtcblxuXHRBbmd1bGFyLiRpbmplY3QgPSBbJyRzdGF0ZScsICckdGltZW91dCcsICckcm9vdFNjb3BlJywgJyRmaWx0ZXInLCAnJHRyYW5zbGF0ZScsICckaW50ZXJ2YWwnXTtcblx0ZnVuY3Rpb24gQW5ndWxhcigkc3RhdGUsICR0aW1lb3V0LCAkcm9vdFNjb3BlLCAkZmlsdGVyLCAkdHJhbnNsYXRlLCAkaW50ZXJ2YWwpIHtcblxuXHRcdHJldHVybiB7XG4gICAgICAgICAgICAkc3RhdGU6ICRzdGF0ZSxcblx0XHRcdCR0aW1lb3V0OiAkdGltZW91dCxcbiAgICAgICAgICAgICRyb290U2NvcGU6ICRyb290U2NvcGUsXG4gICAgICAgICAgICAkZmlsdGVyOiAkZmlsdGVyLFxuXHRcdFx0JHRyYW5zbGF0ZTogJHRyYW5zbGF0ZSxcblx0XHRcdCRpbnRlcnZhbDogJGludGVydmFsXG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBdWRpbycsIEF1ZGlvKTtcblxuICAgIEF1ZGlvLiRpbmplY3QgPSBbJyRjb3Jkb3ZhTmF0aXZlQXVkaW8nXTtcbiAgICBmdW5jdGlvbiBBdWRpbygkY29yZG92YU5hdGl2ZUF1ZGlvKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByZWxvYWQgOiBmdW5jdGlvbihuYW1lLCBleHQpe1xuICAgICAgICAgICAgICAgIGlvbmljLlBsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5wbHVnaW5zICYmIHdpbmRvdy5wbHVnaW5zLk5hdGl2ZUF1ZGlvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhTmF0aXZlQXVkaW8ucHJlbG9hZENvbXBsZXgobmFtZSwgJ2F1ZGlvLycgKyBuYW1lICsgJy4nICsgKGV4dCB8fCAnd2F2JyksIDEsIDEsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGxheTogZnVuY3Rpb24obmFtZSl7XG4gICAgICAgICAgICAgICAgaWYod2luZG93LnBsdWdpbnMgJiYgd2luZG93LnBsdWdpbnMuTmF0aXZlQXVkaW8pe1xuICAgICAgICAgICAgICAgICAgICAkY29yZG92YU5hdGl2ZUF1ZGlvLnBsYXkobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKGZpcmViYXNlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBdXRoJywgQXV0aCk7XG5cbiAgICBBdXRoLiRpbmplY3QgPSBbJyRxJywgJyRmaXJlYmFzZUF1dGgnLCAnbXlDb25maWcnLCAnJHJvb3RTY29wZScsICckc3RhdGUnXTtcbiAgICBmdW5jdGlvbiBBdXRoKCRxLCAkZmlyZWJhc2VBdXRoLCBteUNvbmZpZywgJHJvb3RTY29wZSwgJHN0YXRlKSB7XG5cbiAgICAgICAgJGZpcmViYXNlQXV0aCgpLiRvbkF1dGhTdGF0ZUNoYW5nZWQoZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICBpZighdXNlciAmJiAkc3RhdGUuY3VycmVudCAmJiAkc3RhdGUuY3VycmVudC5hdXRoKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIkNoYW5nZSBzdGF0ZS4uLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBuZXh0UGFyYW1zLCBmcm9tU3RhdGUpIHtcbiAgICAgICAgICAgIGlmICgnYXV0aCcgaW4gbmV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghJHJvb3RTY29wZS51c2VyICYmICRzdGF0ZS5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KG15Q29uZmlnLmF1dGhFdmVudHMubm90QXV0aG9yaXplZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dDogbmV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRQYXJhbXM6IG5leHRQYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgc2NvcGVzID0gW1xuICAgICAgICAgICAgXCJlbWFpbFwiLFxuICAgICAgICAgICAgXCJwcm9maWxlXCIsXG4gICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcGx1cy5tZVwiLFxuICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLmVtYWlsXCIsXG4gICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8ucHJvZmlsZVwiLFxuICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3BsdXMubG9naW5cIixcbiAgICAgICAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9nYW1lc1wiXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIF9uYXRpdmVMb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnBsdWdpbnMuZ29vZ2xlcGx1cy5sb2dpbihcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3Blcyc6IHNjb3Blcy5qb2luKCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2ViQ2xpZW50SWQnOiBteUNvbmZpZy5nb29nbGVDbGllbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvZmZsaW5lJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9naW4gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYoaW9uaWMuUGxhdGZvcm0uaXNXZWJWaWV3KCkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX25hdGl2ZUxvZ2luKCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3JlZGVudGlhbCA9IGZpcmViYXNlLmF1dGguR29vZ2xlQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwocmVzdWx0LmlkVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpcmViYXNlLmF1dGgoKS5zaWduSW5XaXRoQ3JlZGVudGlhbChjcmVkZW50aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm92aWRlciA9IG5ldyBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlcigpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZXMuZm9yRWFjaChmdW5jdGlvbihzY29wZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlci5hZGRTY29wZShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLnNpZ25JbldpdGhQb3B1cChwcm92aWRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvZ291dDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KShmaXJlYmFzZSk7IiwiKGZ1bmN0aW9uKGZpcmViYXNlLCBHZW9GaXJlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdDaGF0JywgQ2hhdCk7XG5cbiAgICBDaGF0LiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gQ2hhdCgkdGltZW91dCkge1xuXG4gICAgICAgIHZhciByZWY7XG4gICAgICAgIHZhciBjaGF0UmVmO1xuICAgICAgICB2YXIgbWVzc2FnZXNSZWY7XG4gICAgICAgIHZhciBnZW9GaXJlO1xuICAgICAgICB2YXIgZ2VvUXVlcnk7XG4gICAgICAgIHZhciBjdXJyZW50VGVhbVJlZjtcbiAgICAgICAgdmFyIGN1cnJlbnRQb3NpdGlvbjtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24odGVhbSl7XG4gICAgICAgICAgICAgICAgdGVhbSA9IHRlYW0gfHwgXCJhbGxcIjtcbiAgICAgICAgICAgICAgICByZWYgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZigpO1xuICAgICAgICAgICAgICAgIGNoYXRSZWYgPSByZWYuY2hpbGQoXCJjaGF0XCIpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzUmVmID0gY2hhdFJlZi5jaGlsZChcIm1lc3NhZ2VzXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUZWFtUmVmID0gbWVzc2FnZXNSZWYuY2hpbGQodGVhbSk7XG4gICAgICAgICAgICAgICAgZ2VvRmlyZSA9IG5ldyBHZW9GaXJlKGNoYXRSZWYuY2hpbGQoXCJsb2NhdGlvbnNcIikuY2hpbGQodGVhbSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZEVtcHR5TWVzc2FnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gY3VycmVudFRlYW1SZWYucHVzaCgpLmtleTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJyZW50VGVhbVJlZi50b1N0cmluZygpLnN1YnN0cmluZyhjdXJyZW50VGVhbVJlZi5yb290LnRvU3RyaW5nKCkubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGVNZXNzYWdlQW5kTG9jYXRpb246IGZ1bmN0aW9uKHBhdGgsIGtleSwgbWVzc2FnZSl7XG4gICAgICAgICAgICAgICAgcmVmLmNoaWxkKHBhdGggKyBcIi9cIiArIGtleSkudXBkYXRlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGdlb0ZpcmUuc2V0KGtleSwgW2N1cnJlbnRQb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIGN1cnJlbnRQb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkTWVzc2FnZUFuZExvY2F0aW9uIDogZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGN1cnJlbnRUZWFtUmVmLnB1c2gobWVzc2FnZSkua2V5O1xuICAgICAgICAgICAgICAgIGdlb0ZpcmUuc2V0KGtleSwgW2N1cnJlbnRQb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIGN1cnJlbnRQb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlR2VvUXVlcnk6IGZ1bmN0aW9uKG1lc3NhZ2VzLCAkc2NvcGUsIHBvc2l0aW9uLCByYWQpe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGdlb1F1ZXJ5ID0gZ2VvRmlyZS5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogW3Bvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZV0sXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogcmFkIHx8IDE1XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ2VvUXVlcnkub24oXCJrZXlfZW50ZXJlZFwiLCBmdW5jdGlvbihrZXksIGxvY2F0aW9uLCBkaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGVhbVJlZi5vcmRlckJ5S2V5KCkuZXF1YWxUbyhrZXkpLm9uY2UoJ3ZhbHVlJykudGhlbihmdW5jdGlvbihzbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChkYXRhW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGVHZW9RdWVyeTogZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICAgICAgICAgIGdlb1F1ZXJ5ICYmIGdlb1F1ZXJ5LnVwZGF0ZUNyaXRlcmlhKHtcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiBbcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3Ryb3lHZW9RdWVyeTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBnZW9RdWVyeSAmJiBnZW9RdWVyeS5jYW5jZWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KShmaXJlYmFzZSwgR2VvRmlyZSk7IiwiKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnR2VvbG9jYXRpb24nLCBHZW9sb2NhdGlvbik7XG5cbiAgICBHZW9sb2NhdGlvbi4kaW5qZWN0ID0gWyckY29yZG92YUdlb2xvY2F0aW9uJ107XG4gICAgZnVuY3Rpb24gR2VvbG9jYXRpb24oJGNvcmRvdmFHZW9sb2NhdGlvbikge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRMb2NhdGlvbiA6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHttYXhpbXVtQWdlOiAxMDAwMCwgdGltZW91dDogNTAwMCwgZW5hYmxlSGlnaEFjY3VyYWN5OiBmYWxzZX07XG4gICAgICAgICAgICAgICAgcmV0dXJuICRjb3Jkb3ZhR2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdJb25pYycsIElvbmljKTtcblxuXHRJb25pYy4kaW5qZWN0ID0gWyckaW9uaWNBY3Rpb25TaGVldCcsICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJGlvbmljSGlzdG9yeScsICckaW9uaWNQb3B1cCcsICckaW9uaWNMb2FkaW5nJywgJyRpb25pY1BvcG92ZXInXTtcblx0ZnVuY3Rpb24gSW9uaWMoJGlvbmljQWN0aW9uU2hlZXQsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRpb25pY0hpc3RvcnksICRpb25pY1BvcHVwLCAkaW9uaWNMb2FkaW5nLCAkaW9uaWNQb3BvdmVyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0JGlvbmljQWN0aW9uU2hlZXQ6ICRpb25pY0FjdGlvblNoZWV0LFxuICAgICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGU6ICRpb25pY1Njcm9sbERlbGVnYXRlLFxuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyOiAkaW9uaWNWaWV3U3dpdGNoZXIsXG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5OiAkaW9uaWNIaXN0b3J5LFxuICAgICAgICAgICAgJGlvbmljUG9wdXA6ICRpb25pY1BvcHVwLFxuICAgICAgICAgICAgJGlvbmljTG9hZGluZzogJGlvbmljTG9hZGluZyxcblx0XHRcdCRpb25pY1BvcG92ZXI6ICRpb25pY1BvcG92ZXJcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnTG9hZGVyJywgTG9hZGVyKTtcblxuXHRMb2FkZXIuJGluamVjdCA9IFsnJGlvbmljTG9hZGluZyddO1xuXHRmdW5jdGlvbiBMb2FkZXIoJGlvbmljTG9hZGluZykge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbW9kYWxzL2xvYWRlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgaGlkZU9uU3RhZ2VDaGFuZ2U6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaWRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKGZpcmViYXNlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdNZWRpYScsIE1lZGlhKTtcblxuICAgIE1lZGlhLiRpbmplY3QgPSBbJyRxJywgJyRpb25pY0FjdGlvblNoZWV0JywgJyR3aW5kb3cnLCAnJGNvcmRvdmFDYW1lcmEnLCAnJGZpbHRlcicsICckdGltZW91dCcsICckY29yZG92YUZpbGUnLCAnVXRpbGl0aWVzJ107XG4gICAgZnVuY3Rpb24gTWVkaWEoJHEsICRpb25pY0FjdGlvblNoZWV0LCAkd2luZG93LCAkY29yZG92YUNhbWVyYSwgJGZpbHRlciwgJHRpbWVvdXQsICRjb3Jkb3ZhRmlsZSwgVXRpbGl0aWVzKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgJHRyYW5zbGF0ZSA9ICRmaWx0ZXIoJ3RyYW5zbGF0ZScpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1cGxvYWRGaWxlOiBmdW5jdGlvbihpbWFnZURhdGEsIGZvbGRlck5hbWUsIHVuaXF1ZUZpbGVOYW1lKXtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZUJsb2IgPSBVdGlsaXRpZXMuYjY0dG9CbG9iKGltYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgdmFyIHN0b3JhZ2VSZWYgPSBmaXJlYmFzZS5zdG9yYWdlKCkucmVmKGZvbGRlck5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciB1cGxvYWRUYXNrID0gc3RvcmFnZVJlZi5jaGlsZCh1bmlxdWVGaWxlTmFtZSArIFwiLmpwZ1wiKS5wdXQoaW1hZ2VCbG9iKTtcbiAgICAgICAgICAgICAgICB1cGxvYWRUYXNrLm9uKGZpcmViYXNlLnN0b3JhZ2UuVGFza0V2ZW50LlNUQVRFX0NIQU5HRUQsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBzbmFwc2hvdC5ieXRlc1RyYW5zZmVycmVkICogMTAwIC8gc25hcHNob3QudG90YWxCeXRlcztcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQubm90aWZ5KHByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkb3dubG9hZFVSTCA9IHVwbG9hZFRhc2suc25hcHNob3QuZG93bmxvYWRVUkw7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZG93bmxvYWRVUkwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBob3RvOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljQWN0aW9uU2hlZXQuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAkdHJhbnNsYXRlKCd0YWtlUGhvdG8nKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJHRyYW5zbGF0ZSgncGhvdG9Gcm9tTGlicmFyeScpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZVRleHQ6ICR0cmFuc2xhdGUoJ2xvYWRJbWFnZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsVGV4dDogJHRyYW5zbGF0ZShcImNhbmNlbFRleHRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnQ0FOQ0VMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpb25pYy5QbGF0Zm9ybS5pc1dlYlZpZXcoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSAkd2luZG93LkNhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5DQU1FUkE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGluZGV4ID09PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSA9ICR3aW5kb3cuQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLlBIT1RPTElCUkFSWTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YWxpdHk6IDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0V2lkdGg6IDMyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uVHlwZTogJHdpbmRvdy5DYW1lcmEuRGVzdGluYXRpb25UeXBlLkRBVEFfVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVHlwZTogc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kaW5nVHlwZTogJHdpbmRvdy5DYW1lcmEuRW5jb2RpbmdUeXBlLkpQRUcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BvdmVyT3B0aW9uczogJHdpbmRvdy5DYW1lcmFQb3BvdmVyT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUb1Bob3RvQWxidW06IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdE9yaWVudGF0aW9uOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oaW1hZ2VEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGltYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnQlJPV1NFUicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnTW9kYWxzJywgTW9kYWxzKTtcblxuXHRNb2RhbHMuJGluamVjdCA9IFsnJGlvbmljTW9kYWwnXTtcblx0ZnVuY3Rpb24gTW9kYWxzKCRpb25pY01vZGFsKSB7XG5cblx0XHR2YXIgbW9kYWxzID0gW107XG5cblx0XHR2YXIgX29wZW5Nb2RhbCA9IGZ1bmN0aW9uICgkc2NvcGUsIHRlbXBsYXRlVXJsLCBhbmltYXRpb24pIHtcblx0XHRcdHJldHVybiAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxhdGVVcmwsIHtcblx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0YW5pbWF0aW9uOiBhbmltYXRpb24gfHwgJ3NsaWRlLWluLXVwJyxcblx0XHRcdFx0YmFja2Ryb3BDbGlja1RvQ2xvc2U6IGZhbHNlXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuXHRcdFx0XHRtb2RhbHMucHVzaChtb2RhbCk7XG5cdFx0XHRcdG1vZGFsLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHR2YXIgX2Nsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY3VycmVudE1vZGFsID0gbW9kYWxzLnNwbGljZSgtMSwgMSlbMF07XG5cdFx0XHRjdXJyZW50TW9kYWwucmVtb3ZlKCk7XG5cdFx0fTtcblxuXHRcdHZhciBfY2xvc2VBbGxNb2RhbHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRtb2RhbHMubWFwKGZ1bmN0aW9uIChtb2RhbCkge1xuXHRcdFx0XHRtb2RhbC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0bW9kYWxzID0gW107XG5cdFx0fTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRvcGVuTW9kYWw6IF9vcGVuTW9kYWwsXG5cdFx0XHRjbG9zZU1vZGFsOiBfY2xvc2VNb2RhbCxcblx0XHRcdGNsb3NlQWxsTW9kYWxzOiBfY2xvc2VBbGxNb2RhbHNcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnTW9kZWwnLCBNb2RlbCk7XG5cblx0TW9kZWwuJGluamVjdCA9IFsnVXNlcnMnLCAnR2VvbG9jYXRpb24nLCAnQXV0aCcsICdOZXR3b3JrJywgJ0FkbW9iJywgJ0F1ZGlvJywgJ0NoYXQnLCAnTG9hZGVyJywgJ01lZGlhJywgJ01vZGFscycsICdTdG9yZSddO1xuXHRmdW5jdGlvbiBNb2RlbChVc2VycywgR2VvbG9jYXRpb24sIEF1dGgsIE5ldHdvcmssIEFkbW9iLCBBdWRpbywgQ2hhdCwgTG9hZGVyLCBNZWRpYSwgTW9kYWxzLCBTdG9yZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdFVzZXJzOiBVc2Vycyxcblx0XHRcdEdlb2xvY2F0aW9uOiBHZW9sb2NhdGlvbixcblx0XHRcdEF1dGg6IEF1dGgsXG5cdFx0XHROZXR3b3JrOiBOZXR3b3JrLFxuXHRcdFx0QWRtb2I6IEFkbW9iLFxuXHRcdFx0QXVkaW86IEF1ZGlvLFxuXHRcdFx0Q2hhdDogQ2hhdCxcblx0XHRcdExvYWRlcjogTG9hZGVyLFxuXHRcdFx0TWVkaWE6IE1lZGlhLFxuXHRcdFx0TW9kYWxzOiBNb2RhbHMsXG5cdFx0XHRTdG9yZTogU3RvcmVcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ05ldHdvcmsnLCBOZXR3b3JrKTtcblxuICAgIE5ldHdvcmsuJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnJGludGVydmFsJywgJyRjb3Jkb3ZhTmV0d29yaycsICckcSddO1xuICAgIGZ1bmN0aW9uIE5ldHdvcmsoJHRpbWVvdXQsICRpbnRlcnZhbCwgJGNvcmRvdmFOZXR3b3JrLCAkcSkge1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCwgaW50ZXJ2YWxQcm9taXNlLCB0aW1lT3V0UHJvbWlzZTtcblxuICAgICAgICB2YXIgdHJ5VG9Db25uZWN0ID0gZnVuY3Rpb24obWF4VGltZSl7XG4gICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBtYXhUaW1lID0gbWF4VGltZSB8fCA1MDAwO1xuICAgICAgICAgICAgaWYoaW9uaWMuUGxhdGZvcm0uaXNXZWJWaWV3KCkpe1xuICAgICAgICAgICAgICAgIGludGVydmFsUHJvbWlzZSA9ICRpbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBpZigkY29yZG92YU5ldHdvcmsuaXNPbmxpbmUoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxQcm9taXNlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgnT0snKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIHRpbWVPdXRQcm9taXNlID0gJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsUHJvbWlzZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdUSU1FT1VUJyk7XG4gICAgICAgICAgICAgICAgfSwgbWF4VGltZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJ09LJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY2FuY2VsUHJvbWlzZSA9IGZ1bmN0aW9uKHByb21pc2UsICRzZXJ2aWNlKXtcbiAgICAgICAgICAgIHByb21pc2UgJiYgJHNlcnZpY2UuY2FuY2VsKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbmNlbFByb21pc2VzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNhbmNlbFByb21pc2UoaW50ZXJ2YWxQcm9taXNlLCAkaW50ZXJ2YWwpO1xuICAgICAgICAgICAgY2FuY2VsUHJvbWlzZSh0aW1lT3V0UHJvbWlzZSwgJHRpbWVvdXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzdG9wID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNhbmNlbFByb21pc2VzKCk7XG4gICAgICAgICAgICBkZWZlcnJlZCAmJiBkZWZlcnJlZC5yZWplY3QoJ1NUT1BQRUQnKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cnlUb0Nvbm5lY3Q6IHRyeVRvQ29ubmVjdCxcbiAgICAgICAgICAgIHN0b3A6IHN0b3BcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ1N0b3JlJywgU3RvcmUpO1xyXG5cclxuXHRTdG9yZS4kaW5qZWN0ID0gWyckd2luZG93JywgJyRyb290U2NvcGUnXTtcclxuXHRmdW5jdGlvbiBTdG9yZSgkd2luZG93LCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgICAgIHZhciBzdG9yZSA9ICR3aW5kb3cuc3RvcmU7XHJcblxyXG4gICAgICAgIHZhciBnZXRJbmZvID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSBzdG9yZS5nZXQoJ2NvLm5pY2hvbGxzLnBva2VkZXhnby5yZW1vdmVhZHMnKTtcclxuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuc2hvd0FkcyA9ICFwcm9kdWN0Lm93bmVkO1xyXG4gICAgICAgICAgICBpZihwcm9kdWN0Lm93bmVkKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlLm9mZihnZXRJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlID0gJHdpbmRvdy5zdG9yZTtcclxuICAgICAgICAgICAgICAgIGlmKHN0b3JlKXtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS52ZXJib3NpdHkgPSBzdG9yZS5JTkZPO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnJlZ2lzdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICAgICdjby5uaWNob2xscy5wb2tlZGV4Z28ucmVtb3ZlYWRzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXM6ICdSZW1vdmUgQWRzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogICBzdG9yZS5OT05fQ09OU1VNQUJMRVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRJbmZvKCk7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLndoZW4oXCJSZW1vdmUgQWRzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sb2FkZWQoZnVuY3Rpb24ocHJvZHVjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcImxvYWRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZWQoZ2V0SW5mbylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcHJvdmVkKGZ1bmN0aW9uIChwcm9kdWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvZygnWW91IGp1c3QgdW5sb2NrZWQgdGhlIEZVTEwgVkVSU0lPTiEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc2hvd0FkcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJhcHByb3ZlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3QuZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vd25lZChmdW5jdGlvbihwcm9kdWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb2R1Y3QuZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIm93bmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVmdW5kZWQoZnVuY3Rpb24ocHJvZHVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJyZWZ1bmRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHByb2R1Y3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhbmNlbGxlZChmdW5jdGlvbihwcm9kdWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2FuY2VsbGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNob3dBZHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBidXk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZigkcm9vdFNjb3BlLnNob3dBZHMpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLm9yZGVyKCdSZW1vdmUgQWRzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnVXRpbGl0aWVzJywgVXRpbGl0aWVzKTtcblxuXHQvL1V0aWxpdGllcy4kaW5qZWN0ID0gW107XG5cdGZ1bmN0aW9uIFV0aWxpdGllcygpIHtcblxuXHRcdHJldHVybiB7XG4gICAgICAgICAgICBiNjR0b0Jsb2I6IGZ1bmN0aW9uKGI2NERhdGEsIGNvbnRlbnRUeXBlLCBzbGljZVNpemUpe1xuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJ2ltYWdlL3BuZyc7XG4gICAgICAgICAgICAgICAgc2xpY2VTaXplID0gc2xpY2VTaXplIHx8IDUxMjtcblxuICAgICAgICAgICAgICAgIHZhciBieXRlQ2hhcmFjdGVycyA9IGF0b2IoYjY0RGF0YSk7XG4gICAgICAgICAgICAgICAgdmFyIGJ5dGVBcnJheXMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2xpY2UgPSBieXRlQ2hhcmFjdGVycy5zbGljZShvZmZzZXQsIG9mZnNldCArIHNsaWNlU2l6ZSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBieXRlTnVtYmVyc1tpXSA9IHNsaWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ5dGVOdW1iZXJzKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihieXRlQXJyYXlzLCB7dHlwZTogY29udGVudFR5cGV9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvYjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhVVJMdG9CbG9iOiBmdW5jdGlvbihkYXRhVVJMLCBjb250ZW50VHlwZSl7XG4gICAgICAgICAgICAgICAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnaW1hZ2UvcG5nJztcbiAgICAgICAgICAgICAgICAvLyBEZWNvZGUgdGhlIGRhdGFVUkwgICBcbiAgICAgICAgICAgICAgICB2YXIgYmluYXJ5ID0gYXRvYihkYXRhVVJMLnNwbGl0KCcsJylbMV0pO1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSA4LWJpdCB1bnNpZ25lZCBhcnJheVxuICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2goYmluYXJ5LmNoYXJDb2RlQXQoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gb3VyIEJsb2Igb2JqZWN0XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFtuZXcgVWludDhBcnJheShhcnJheSldLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xuICAgICAgICAgICAgfVxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uIChBdXRvbGlua2VyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCdhdXRvbGlua2VyJywgYXV0b2xpbmtlcik7XG5cbiAgICBhdXRvbGlua2VyLiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gYXV0b2xpbmtlcigkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVIdG1sID0gZWxlbWVudC5odG1sKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZUh0bWwgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IEF1dG9saW5rZXIubGluayhlbGVIdG1sLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhdXRvbGlua2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1dpbmRvdzogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5odG1sKHRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRvbGlua3MgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9saW5rZXInKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF1dG9saW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGF1dG9saW5rc1tpXSkuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBocmVmID0gZS50YXJnZXQuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dpbmRvdy5vcGVuKGhyZWYsICdfc3lzdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGhyZWYsICdfYmxhbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KShBdXRvbGlua2VyKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCdkYXlPck5pZ2h0JywgZGF5T3JOaWdodCk7XG5cbiAgICAvL2RheU9yTmlnaHQuJGluamVjdCA9IFsnJ107XG4gICAgZnVuY3Rpb24gZGF5T3JOaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJkYXlcIjtcbiAgICAgICAgICAgICAgICBpZigobmV3IERhdGUoKSkuZ2V0SG91cnMoKSA+PSAxOCl7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwibmlnaHRcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5kaXJlY3RpdmUoJ2hvbGRMaXN0JywgaG9sZExpc3QpO1xuXG5cdGhvbGRMaXN0LiRpbmplY3QgPSBbJyRpb25pY0dlc3R1cmUnXTtcblx0ZnVuY3Rpb24gaG9sZExpc3QoJGlvbmljR2VzdHVyZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0XHRcdCRpb25pY0dlc3R1cmUub24oJ2hvbGQnLCBmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLWNvbnRlbnQnKTtcblxuXHRcdFx0XHRcdHZhciBidXR0b25zID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcuaXRlbS1vcHRpb25zJyk7XG5cdFx0XHRcdFx0dmFyIGJ1dHRvbnNXaWR0aCA9IGJ1dHRvbnMub2Zmc2V0V2lkdGg7XG5cblx0XHRcdFx0XHRpb25pYy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNJVElPTl0gPSAnYWxsIGVhc2Utb3V0IC4yNXMnO1xuXG5cdFx0XHRcdFx0XHRpZiAoIWJ1dHRvbnMuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZpc2libGUnKSkge1xuXHRcdFx0XHRcdFx0XHRjb250ZW50LnN0eWxlW2lvbmljLkNTUy5UUkFOU0ZPUk1dID0gJyc7XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbnMuY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XG5cdFx0XHRcdFx0XHRcdH0sIDI1MCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRidXR0b25zLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xuXHRcdFx0XHRcdFx0XHRjb250ZW50LnN0eWxlW2lvbmljLkNTUy5UUkFOU0ZPUk1dID0gJ3RyYW5zbGF0ZTNkKC0nICsgYnV0dG9uc1dpZHRoICsgJ3B4LCAwLCAwKSc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHR9LCBlbGVtZW50KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2ltZycsIGltZyk7XG5cbiAgICBpbWcuJGluamVjdCA9IFsnJHBhcnNlJ107XG4gICAgZnVuY3Rpb24gaW1nKCRwYXJzZSkge1xuICAgICAgICBmdW5jdGlvbiBlbmRzV2l0aCAodXJsLCBwYXRoKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB1cmwubGVuZ3RoIC0gcGF0aC5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gdXJsLmluZGV4T2YocGF0aCwgaW5kZXgpICE9PSAtMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHsgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2Vycm9yJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnNyYztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gYXR0cmlidXRlcy5uZ0Vycm9yICYmICRwYXJzZShhdHRyaWJ1dGVzLm5nRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZXMgYW4gbmctZXJyb3IgY2FsbGJhY2sgdGhlbiBjYWxsIGl0XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbihzY29wZSwgeyAkZXZlbnQ6IGV2LCAkc3JjOiBzcmMgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmVzIGFuIG5nLWVycm9yLXNyYyB0aGVuIHNldCBpdFxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlcy5uZ0Vycm9yU3JjICYmICFlbmRzV2l0aChzcmMsIGF0dHJpYnV0ZXMubmdFcnJvclNyYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignc3JjJywgYXR0cmlidXRlcy5uZ0Vycm9yU3JjKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2xvYWQnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBhdHRyaWJ1dGVzLm5nU3VjY2VzcyAmJiAkcGFyc2UoYXR0cmlidXRlcy5uZ1N1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgICAgICBpZihmbil7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuKHNjb3BlLCB7ICRldmVudDogZXYgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmRpcmVjdGl2ZSgnaW9uTXVsdGlwbGVTZWxlY3QnLCBpb25NdWx0aXBsZVNlbGVjdCk7XG5cblx0aW9uTXVsdGlwbGVTZWxlY3QuJGluamVjdCA9IFsnJGlvbmljTW9kYWwnLCAnJGlvbmljR2VzdHVyZSddO1xuXHRmdW5jdGlvbiBpb25NdWx0aXBsZVNlbGVjdCgkaW9uaWNNb2RhbCwgJGlvbmljR2VzdHVyZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiBcIj1cIlxuXHRcdFx0fSxcblx0XHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0JHNjb3BlLm11bHRpcGxlU2VsZWN0ID0ge1xuXHRcdFx0XHRcdHRpdGxlOiAkYXR0cnMudGl0bGUgfHwgXCJTZWxlY3QgT3B0aW9uc1wiLFxuXHRcdFx0XHRcdHRlbXBPcHRpb25zOiBbXSxcblx0XHRcdFx0XHRrZXlQcm9wZXJ0eTogJGF0dHJzLmtleVByb3BlcnR5IHx8IFwiaWRcIixcblx0XHRcdFx0XHR2YWx1ZVByb3BlcnR5OiAkYXR0cnMudmFsdWVQcm9wZXJ0eSB8fCBcInZhbHVlXCIsXG5cdFx0XHRcdFx0c2VsZWN0ZWRQcm9wZXJ0eTogJGF0dHJzLnNlbGVjdGVkUHJvcGVydHkgfHwgXCJzZWxlY3RlZFwiLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAkYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3RlbXBsYXRlcy9tb2RhbHMvbXVsdGlwbGVTZWxlY3QuaHRtbCcsXG5cdFx0XHRcdFx0cmVuZGVyQ2hlY2tib3g6ICRhdHRycy5yZW5kZXJDaGVja2JveCA/ICRhdHRycy5yZW5kZXJDaGVja2JveCA9PSBcInRydWVcIiA6IHRydWUsXG5cdFx0XHRcdFx0YW5pbWF0aW9uOiAkYXR0cnMuYW5pbWF0aW9uIHx8ICdzbGlkZS1pbi11cCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlVXJsKSB7XG5cdFx0XHRcdFx0JGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XG5cdFx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAkc2NvcGUubXVsdGlwbGVTZWxlY3QuYW5pbWF0aW9uXG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbCA9IG1vZGFsO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnNob3coKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaW9uaWNHZXN0dXJlLm9uKCd0YXAnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdCRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9ucyA9ICRzY29wZS5vcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGVtcE9wdGlvbiA9IHt9O1xuXHRcdFx0XHRcdFx0dGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldID0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHR0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC52YWx1ZVByb3BlcnR5XSA9IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3QudmFsdWVQcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHR0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XSA9IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV07XG5cblx0XHRcdFx0XHRcdHJldHVybiB0ZW1wT3B0aW9uO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUoJHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBsYXRlVXJsKTtcblx0XHRcdFx0fSwgJGVsZW1lbnQpO1xuXG5cdFx0XHRcdCRzY29wZS5zYXZlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIHRlbXBPcHRpb24gPSAkc2NvcGUubXVsdGlwbGVTZWxlY3QudGVtcE9wdGlvbnNbaV07XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8ICRzY29wZS5vcHRpb25zLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBvcHRpb24gPSAkc2NvcGUub3B0aW9uc1tqXTtcblx0XHRcdFx0XHRcdFx0aWYgKHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LmtleVByb3BlcnR5XSA9PSBvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LmtleVByb3BlcnR5XSkge1xuXHRcdFx0XHRcdFx0XHRcdG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV0gPSB0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkc2NvcGUuY2xvc2VNb2RhbCgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0JHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5tb2RhbCkge1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCdyZXNpemVIZWlnaHQnLCByZXNpemVIZWlnaHQpO1xuXG4gICAgcmVzaXplSGVpZ2h0LiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiByZXNpemVIZWlnaHQoJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVzaXplRWxlbWVudCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50LnBhcmVudCgpWzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudC5wYXJlbnQoKVswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlUGl4ZWxzID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpZihzY2FsZVBpeGVscyA+IHdpZHRoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlUGl4ZWxzID0gd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gc2NhbGVQaXhlbHMgLyBhdHRycy5yZXNpemVIZWlnaHQgLSAwLjM7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNjYWxlIDwgMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSc7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5kaXJlY3RpdmUoJ2lvblNlYXJjaFNlbGVjdCcsIGlvblNlYXJjaFNlbGVjdCk7XG5cblx0aW9uU2VhcmNoU2VsZWN0LiRpbmplY3QgPSBbJyRpb25pY01vZGFsJywgJyRpb25pY0dlc3R1cmUnXTtcblx0ZnVuY3Rpb24gaW9uU2VhcmNoU2VsZWN0KCRpb25pY01vZGFsLCAkaW9uaWNHZXN0dXJlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6IFwiPVwiLFxuXHRcdFx0XHRvcHRpb25TZWxlY3RlZDogXCI9XCJcblx0XHRcdH0sXG5cdFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3QgPSB7XG5cdFx0XHRcdFx0dGl0bGU6ICRhdHRycy50aXRsZSB8fCBcIlNlYXJjaFwiLFxuXHRcdFx0XHRcdGtleVByb3BlcnR5OiAkYXR0cnMua2V5UHJvcGVydHksXG5cdFx0XHRcdFx0dmFsdWVQcm9wZXJ0eTogJGF0dHJzLnZhbHVlUHJvcGVydHksXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICRhdHRycy50ZW1wbGF0ZVVybCB8fCAndGVtcGxhdGVzL3NlYXJjaFNlbGVjdC5odG1sJyxcblx0XHRcdFx0XHRhbmltYXRpb246ICRhdHRycy5hbmltYXRpb24gfHwgJ3NsaWRlLWluLXVwJyxcblx0XHRcdFx0XHRvcHRpb246IG51bGwsXG5cdFx0XHRcdFx0c2VhcmNodmFsdWU6IFwiXCIsXG5cdFx0XHRcdFx0ZW5hYmxlU2VhcmNoOiAkYXR0cnMuZW5hYmxlU2VhcmNoID8gJGF0dHJzLmVuYWJsZVNlYXJjaCA9PSBcInRydWVcIiA6IHRydWVcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaW9uaWNHZXN0dXJlLm9uKCd0YXAnLCBmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdFx0aWYgKCEhJHNjb3BlLnNlYXJjaFNlbGVjdC5rZXlQcm9wZXJ0eSAmJiAhISRzY29wZS5zZWFyY2hTZWxlY3QudmFsdWVQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0aWYgKCRzY29wZS5vcHRpb25TZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbiA9ICRzY29wZS5vcHRpb25TZWxlY3RlZFskc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbiA9ICRzY29wZS5vcHRpb25TZWxlY3RlZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHNjb3BlLk9wZW5Nb2RhbEZyb21UZW1wbGF0ZSgkc2NvcGUuc2VhcmNoU2VsZWN0LnRlbXBsYXRlVXJsKTtcblx0XHRcdFx0fSwgJGVsZW1lbnQpO1xuXG5cdFx0XHRcdCRzY29wZS5zYXZlT3B0aW9uID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICghISRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHkgJiYgISEkc2NvcGUuc2VhcmNoU2VsZWN0LnZhbHVlUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dmFyIGN1cnJlbnRPcHRpb24gPSAkc2NvcGUub3B0aW9uc1tpXTtcblx0XHRcdFx0XHRcdFx0aWYgKGN1cnJlbnRPcHRpb25bJHNjb3BlLnNlYXJjaFNlbGVjdC5rZXlQcm9wZXJ0eV0gPT0gJHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUub3B0aW9uU2VsZWN0ZWQgPSBjdXJyZW50T3B0aW9uO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNjb3BlLm9wdGlvblNlbGVjdGVkID0gJHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb247XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3Quc2VhcmNodmFsdWUgPSBcIlwiO1xuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkc2NvcGUuY2xlYXJTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5zZWFyY2h2YWx1ZSA9IFwiXCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLm1vZGFsKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlVXJsKSB7XG5cdFx0XHRcdFx0JGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XG5cdFx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAkc2NvcGUuc2VhcmNoU2VsZWN0LmFuaW1hdGlvblxuXHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwgPSBtb2RhbDtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbC5zaG93KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSkoKTsiXX0=
