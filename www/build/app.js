// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'App' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic', 'ionic.cloud', 'ngCordova', 'ngAnimate', 'pascalprecht.translate', 'ngCordovaOauth', 'firebase', 'monospaced.elastic', 'angularMoment'])

    .run(['$ionicPlatform',
        '$sqliteService',
        '$animate',
        'myConfig',
        'Admob',
        'Store',
        'amMoment',
        '$rootScope',
        '$ionicDeploy',
        function ($ionicPlatform, $sqliteService, $animate, myConfig, Admob, Store, amMoment, $rootScope, $ionicDeploy) {

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

                //Load the Pre-populated database, debug = true
                $sqliteService.preloadDataBase(true);

                //Prepare Admob
                Admob.prepare();

                //Initialize Store
                Store.initialize();

                //Configure code push
                $ionicDeploy.channel = 'dev';
                $ionicDeploy.check().then(function(snapshotAvailable) {
                    if (snapshotAvailable) {
                        $ionicDeploy.download().then(function() {
                            return $ionicDeploy.extract();
                        }).then(function() {
                            Ionic.$ionicPopup.show({
                                title: $translate('cancelText'),
                                subTitle: $translate('updateDownloaded'),
                                buttons: [
                                    { 
                                        text: $translate('notNow') 
                                    },
                                    {
                                        text: $translate('restart'),
                                        onTap: function() {
                                            $ionicDeploy.load();
                                        }
                                    }
                                ]
                            });
                        });
                    }
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
		.service('$sqliteService', $sqliteService);

	$sqliteService.$inject = ['$q', '$cordovaSQLite'];
	function $sqliteService($q, $cordovaSQLite) {

		var self = this;
		var _db;

		self.db = function () {
			if (!_db) {
				if (window.sqlitePlugin !== undefined) {
					_db = window.sqlitePlugin.openDatabase({ name: "pre.db", location: 2, createFromLocation: 1 });
				} else {
					// For debugging in the browser
					_db = window.openDatabase("pre.db", "1.0", "Database", 200000);
				}
			}
			return _db;
		};

		self.getFirstItem = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {

				if (res.rows.length > 0)
					return deferred.resolve(res.rows.item(0));
				else
					return deferred.reject("There aren't items matching");
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.getFirstOrDefaultItem = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {

				if (res.rows.length > 0)
					return deferred.resolve(res.rows.item(0));
				else
					return deferred.resolve(null);
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.getItems = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {
				var items = [];
				for (var i = 0; i < res.rows.length; i++) {
					items.push(res.rows.item(i));
				}
				return deferred.resolve(items);
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.preloadDataBase = function (enableLog) {
			var deferred = $q.defer();

			//window.open("data:text/plain;charset=utf-8," + JSON.stringify({ data: window.queries.join('').replace(/\\n/g, '\n') }));
			if (window.sqlitePlugin === undefined) {
				//enableLog && console.log('%c ***************** Starting the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
				self.db().transaction(function (tx) {
					for (var i = 0; i < window.queries.length; i++) {
						var query = window.queries[i].replace(/\\n/g, '\n');

						//enableLog && console.log(window.queries[i]);
						tx.executeSql(query);
					}
				}, function (error) {
					deferred.reject(error);
				}, function () {
					//enableLog && console.log('%c ***************** Completing the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
					deferred.resolve("OK");
				});
			}
			else {
				deferred.resolve("OK");
			}

			return deferred.promise;
		};

		self.executeSql = function (query, parameters) {
			return $cordovaSQLite.execute(self.db(), query, parameters);
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
		.factory('Users', Users);

	Users.$inject = ['$q', '$sqliteService'];
	function Users($q, $sqliteService) {

		return {
			getAll: function () {
				var query = "Select * FROM Users";
				return $q.when($sqliteService.getItems(query));
			},
			add: function (user) {
				var query = "INSERT INTO Users (Name) VALUES (?)";
				return $q.when($sqliteService.executeSql(query, [user.Name]));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImlzc3Vlcy5qcyIsInF1ZXJpZXMuanMiLCJjb250cm9sbGVycy9hcHAuanMiLCJjb250cm9sbGVycy9jYWxjdWxhdG9yLmpzIiwiY29udHJvbGxlcnMvY2hhdC5qcyIsImNvbnRyb2xsZXJzL2NyZWRpdHMuanMiLCJjb250cm9sbGVycy9ldmVudHMuanMiLCJjb250cm9sbGVycy9maW5kUG9rZW1vbi5qcyIsImNvbnRyb2xsZXJzL2hvbWUuanMiLCJjb250cm9sbGVycy9pdGVtLmpzIiwiY29udHJvbGxlcnMvbXlQcm9maWxlLmpzIiwiY29udHJvbGxlcnMvcG9rZVN0b3BzLmpzIiwiY29udHJvbGxlcnMvcmVwb3J0LmpzIiwiY29udHJvbGxlcnMvc3RhdGlzdGljcy5qcyIsImNvbnRyb2xsZXJzL3RlYW1zLmpzIiwiZmlsdGVycy9lbXB0eVJlcGxhY2UuanMiLCJkaXJlY3RpdmVzL2F1dG9saW5rZXIuanMiLCJkaXJlY3RpdmVzL2RheU9yTmlnaHQuanMiLCJkaXJlY3RpdmVzL2hvbGRMaXN0LmpzIiwiZGlyZWN0aXZlcy9pbWcuanMiLCJkaXJlY3RpdmVzL211bHRpcGxlU2VsZWN0LmpzIiwiZGlyZWN0aXZlcy9yZXNpemVIZWlnaHQuanMiLCJkaXJlY3RpdmVzL3NlYXJjaFNlbGVjdC5qcyIsInNlcnZpY2VzL2FkbW9iLmpzIiwic2VydmljZXMvYW5ndWxhci5qcyIsInNlcnZpY2VzL2F1ZGlvLmpzIiwic2VydmljZXMvYXV0aC5qcyIsInNlcnZpY2VzL2NoYXQuanMiLCJzZXJ2aWNlcy9nZW9sb2NhdGlvbi5qcyIsInNlcnZpY2VzL2lvbmljLmpzIiwic2VydmljZXMvbG9hZGVyLmpzIiwic2VydmljZXMvbWVkaWEuanMiLCJzZXJ2aWNlcy9tb2RhbHMuanMiLCJzZXJ2aWNlcy9tb2RlbC5qcyIsInNlcnZpY2VzL25ldHdvcmsuanMiLCJzZXJ2aWNlcy9zcWxpdGUuanMiLCJzZXJ2aWNlcy9zdG9yZS5qcyIsInNlcnZpY2VzL3VzZXJzLmpzIiwic2VydmljZXMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDalVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnQXBwJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuYW5ndWxhci5tb2R1bGUoJ0FwcCcsIFsnaW9uaWMnLCAnaW9uaWMuY2xvdWQnLCAnbmdDb3Jkb3ZhJywgJ25nQW5pbWF0ZScsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJywgJ25nQ29yZG92YU9hdXRoJywgJ2ZpcmViYXNlJywgJ21vbm9zcGFjZWQuZWxhc3RpYycsICdhbmd1bGFyTW9tZW50J10pXG5cbiAgICAucnVuKFsnJGlvbmljUGxhdGZvcm0nLFxuICAgICAgICAnJHNxbGl0ZVNlcnZpY2UnLFxuICAgICAgICAnJGFuaW1hdGUnLFxuICAgICAgICAnbXlDb25maWcnLFxuICAgICAgICAnQWRtb2InLFxuICAgICAgICAnU3RvcmUnLFxuICAgICAgICAnYW1Nb21lbnQnLFxuICAgICAgICAnJHJvb3RTY29wZScsXG4gICAgICAgICckaW9uaWNEZXBsb3knLFxuICAgICAgICBmdW5jdGlvbiAoJGlvbmljUGxhdGZvcm0sICRzcWxpdGVTZXJ2aWNlLCAkYW5pbWF0ZSwgbXlDb25maWcsIEFkbW9iLCBTdG9yZSwgYW1Nb21lbnQsICRyb290U2NvcGUsICRpb25pY0RlcGxveSkge1xuXG4gICAgICAgICAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgICAgICAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgcmVtb3ZlIHRoaXMgbGluZSB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLiBJdCBzdG9wcyB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSBzbmFwcGluZyB3aGVuIHRleHQgaW5wdXRzIGFyZSBmb2N1c2VkLiBJb25pYyBoYW5kbGVzIHRoaXMgaW50ZXJuYWxseSBmb3JcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBtdWNoIG5pY2VyIGtleWJvYXJkIGV4cGVyaWVuY2UuXG4gICAgICAgICAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgICAgICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9Mb2FkIHRoZSBQcmUtcG9wdWxhdGVkIGRhdGFiYXNlLCBkZWJ1ZyA9IHRydWVcbiAgICAgICAgICAgICAgICAkc3FsaXRlU2VydmljZS5wcmVsb2FkRGF0YUJhc2UodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvL1ByZXBhcmUgQWRtb2JcbiAgICAgICAgICAgICAgICBBZG1vYi5wcmVwYXJlKCk7XG5cbiAgICAgICAgICAgICAgICAvL0luaXRpYWxpemUgU3RvcmVcbiAgICAgICAgICAgICAgICBTdG9yZS5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgICAgICAvL0NvbmZpZ3VyZSBjb2RlIHB1c2hcbiAgICAgICAgICAgICAgICAkaW9uaWNEZXBsb3kuY2hhbm5lbCA9ICdkZXYnO1xuICAgICAgICAgICAgICAgICRpb25pY0RlcGxveS5jaGVjaygpLnRoZW4oZnVuY3Rpb24oc25hcHNob3RBdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNuYXBzaG90QXZhaWxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNEZXBsb3kuZG93bmxvYWQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkaW9uaWNEZXBsb3kuZXh0cmFjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJb25pYy4kaW9uaWNQb3B1cC5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2NhbmNlbFRleHQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViVGl0bGU6ICR0cmFuc2xhdGUoJ3VwZGF0ZURvd25sb2FkZWQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAkdHJhbnNsYXRlKCdub3ROb3cnKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJHRyYW5zbGF0ZSgncmVzdGFydCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uVGFwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljRGVwbG95LmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9FbmFibGUgQW5ndWxhciBhbmltYXRpb25cbiAgICAgICAgICAgICRhbmltYXRlLmVuYWJsZWQodHJ1ZSk7XG5cbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckdHJhbnNsYXRlQ2hhbmdlRW5kJywgZnVuY3Rpb24oZGF0YSwgY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGFtTW9tZW50LmNoYW5nZUxvY2FsZShjdXJyZW50Lmxhbmd1YWdlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKVxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsXG4gICAgICAgICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgICAgICAnJGlvbmljQ29uZmlnUHJvdmlkZXInLFxuICAgICAgICAnJGNvbXBpbGVQcm92aWRlcicsXG4gICAgICAgIFwiJHRyYW5zbGF0ZVByb3ZpZGVyXCIsXG4gICAgICAgIFwiJGlvbmljQ2xvdWRQcm92aWRlclwiLFxuICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGlvbmljQ29uZmlnUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsICR0cmFuc2xhdGVQcm92aWRlciwgJGlvbmljQ2xvdWRQcm92aWRlcikge1xuXG4gICAgICAgICAgICAkaW9uaWNDbG91ZFByb3ZpZGVyLmluaXQoe1xuICAgICAgICAgICAgICAgIFwiY29yZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYXBwX2lkXCI6IFwiOGQ1Y2QyN2RcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGFwaUtleTogXCJBSXphU3lBa1lKZlcwRDFFc0RQRWxZcUpvYW4zQUg2WDhhZ1FyMmtcIixcbiAgICAgICAgICAgICAgICBhdXRoRG9tYWluOiBcInBva2VkZXgtZ28tNmY1ZjIuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgICAgICAgICAgICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9wb2tlZGV4LWdvLTZmNWYyLmZpcmViYXNlaW8uY29tXCIsXG4gICAgICAgICAgICAgICAgcHJvamVjdElkOiBcInBva2VkZXgtZ28tNmY1ZjJcIixcbiAgICAgICAgICAgICAgICBzdG9yYWdlQnVja2V0OiBcInBva2VkZXgtZ28tNmY1ZjIuYXBwc3BvdC5jb21cIixcbiAgICAgICAgICAgICAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCI0ODA4NDEyNTU1MjBcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZpcmViYXNlLmluaXRpYWxpemVBcHAoY29uZmlnKTtcblxuICAgICAgICAgICAgJGNvbXBpbGVQcm92aWRlci5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3QoL15cXHMqKGh0dHBzP3xmdHB8ZmlsZXxibG9ifGNvbnRlbnR8bXMtYXBweHx4LXdtYXBwMCk6fGRhdGE6aW1hZ2VcXC98aW1nXFwvLyk7XG4gICAgICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfG1haWx0b3xmaWxlfGdodHRwcz98bXMtYXBweHx4LXdtYXBwMCk6Lyk7XG5cbiAgICAgICAgICAgIGlmIChpb25pYy5QbGF0Zm9ybS5pc0lPUygpKSB7XG4gICAgICAgICAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuc2Nyb2xsaW5nLmpzU2Nyb2xsaW5nKHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci52aWV3cy5zd2lwZUJhY2tFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLm5hdkJhci5hbGlnblRpdGxlKCdyaWdodCcpO1xuXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xuICAgICAgICAgICAgICAgIHByZWZpeDogJ2xhbmd1YWdlLycsXG4gICAgICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnJlZ2lzdGVyQXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKFsnZW4nLCAnZXMnXSwge1xuICAgICAgICAgICAgICAgICdlbl8qJzogJ2VuJyxcbiAgICAgICAgICAgICAgICAnZXNfKic6ICdlcycsXG4gICAgICAgICAgICAgICAgJyonOiAnZW4nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKCk7XG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIuZmFsbGJhY2tMYW5ndWFnZSgnZW4nKTtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRMYW5nID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYW5nJyk7XG4gICAgICAgICAgICBpZiAoY3VycmVudExhbmcpIHtcbiAgICAgICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoY3VycmVudExhbmcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGUnKTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwcCcsXG4gICAgICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQXBwQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21lbnUuaHRtbCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmhvbWUnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvaG9tZVwiLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvaG9tZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC50ZWFtcycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZWFtc1wiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy90ZWFtcy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RlYW1zQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAudGVhbXMuY2hhdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jaGF0XCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVhbTogJ2FsbCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYXV0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd2aWV3Q29udGVudEBhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2NoYXQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGF0Q29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3JlZGl0cycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jcmVkaXRzXCIsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9jcmVkaXRzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlZGl0c0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLml0ZW0nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvaXRlbS97dGl0bGV9XCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvaXRlbS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0l0ZW1Db250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5maW5kUG9rZW1vbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9maW5kUG9rZW1vblwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2ZpbmRQb2tlbW9uLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRmluZFBva2Vtb25Db250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5ldmVudHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvZXZlbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvZXZlbnRzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRzQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3JlcG9ydFwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3JlcG9ydC5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm15UHJvZmlsZScsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9teVByb2ZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9teVByb2ZpbGUuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNeVByb2ZpbGVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5wb2tlU3RvcHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcG9rZVN0b3BzXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcG9rZVN0b3BzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUG9rZVN0b3BzQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuY2FsY3VsYXRvcicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jYWxjdWxhdG9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvY2FsY3VsYXRvci5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhbGN1bGF0b3JDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5zdGF0aXN0aWNzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3N0YXRpc3RpY3NcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9zdGF0aXN0aWNzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU3RhdGlzdGljc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKGZ1bmN0aW9uICgkaW5qZWN0b3IsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciAkc3RhdGUgPSAkaW5qZWN0b3IuZ2V0KFwiJHN0YXRlXCIpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ob21lXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dKVxuICAgIC5jb25zdGFudCgnbXlDb25maWcnLCB7XG4gICAgICAgIGdvb2dsZUNsaWVudElkOiBcIjQ4MDg0MTI1NTUyMC1laWZsNzZidnJidHA5aHYzNnN0ZTV0YzllYXF2am5pZi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbVwiLFxuICAgICAgICBmaXJlYmFzZVVybDogXCJodHRwczovL3Bva2VkZXgtZ28tNmY1ZjIuZmlyZWJhc2Vpby5jb21cIixcbiAgICAgICAgZmlyZWJhc2VNc2dVcmw6IFwiXCIsXG4gICAgICAgIGF1dGhFdmVudHM6IHtcbiAgICAgICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgICAgICB9LFxuICAgICAgICBhZE1vYjoge1xuICAgICAgICAgICAgaWQ6ICdjYS1hcHAtcHViLTEzNDE2MDQ2MTUyMTIyMDIvNDcxMDc1MzE3OCdcbiAgICAgICAgfVxuICAgIH0pOyIsIi8qIGdsb2JhbCBpb25pYyAqL1xuKGZ1bmN0aW9uIChhbmd1bGFyLCBpb25pYykge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpb25pYy5QbGF0Zm9ybS5pc0lFID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBpb25pYy5QbGF0Zm9ybS51YS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3RyaWRlbnQnKSA+IC0xO1xuXHR9XG5cblx0aWYgKGlvbmljLlBsYXRmb3JtLmlzSUUoKSkge1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdpb25pYycpXG5cdFx0XHQuZmFjdG9yeSgnJGlvbmljTmdDbGljaycsIFsnJHBhcnNlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRwYXJzZSwgJHRpbWVvdXQpIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgY2xpY2tFeHByKSB7XG5cdFx0XHRcdFx0dmFyIGNsaWNrSGFuZGxlciA9IGFuZ3VsYXIuaXNGdW5jdGlvbihjbGlja0V4cHIpID8gY2xpY2tFeHByIDogJHBhcnNlKGNsaWNrRXhwcik7XG5cblx0XHRcdFx0XHRlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNsaWNrdGltZXIpIHJldHVybjsgLy8gU2Vjb25kIGNhbGxcblx0XHRcdFx0XHRcdFx0Y2xpY2tIYW5kbGVyKHNjb3BlLCB7ICRldmVudDogKGV2ZW50KSB9KTtcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2xpY2t0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHsgZGVsZXRlIHNjb3BlLmNsaWNrdGltZXI7IH0sIDEsIGZhbHNlKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly8gSGFjayBmb3IgaU9TIFNhZmFyaSdzIGJlbmVmaXQuIEl0IGdvZXMgc2VhcmNoaW5nIGZvciBvbmNsaWNrIGhhbmRsZXJzIGFuZCBpcyBsaWFibGUgdG8gY2xpY2tcblx0XHRcdFx0XHQvLyBzb21ldGhpbmcgZWxzZSBuZWFyYnkuXG5cdFx0XHRcdFx0ZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7IH07XG5cdFx0XHRcdH07XG5cdFx0XHR9XSk7XG5cdH1cblxuXHRmdW5jdGlvbiBTZWxlY3REaXJlY3RpdmUoKSB7XG5cdFx0J3VzZSBzdHJpY3QnO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRyZXBsYWNlOiBmYWxzZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRpZiAoaW9uaWMuUGxhdGZvcm0gJiYgKGlvbmljLlBsYXRmb3JtLmlzV2luZG93c1Bob25lKCkgfHwgaW9uaWMuUGxhdGZvcm0uaXNJRSgpIHx8IGlvbmljLlBsYXRmb3JtLnBsYXRmb3JtKCkgPT09IFwiZWRnZVwiKSkge1xuXHRcdFx0XHRcdGVsZW1lbnQuYXR0cignZGF0YS10YXAtZGlzYWJsZWQnLCAndHJ1ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdGFuZ3VsYXIubW9kdWxlKCdpb25pYycpXG4gICAgLmRpcmVjdGl2ZSgnc2VsZWN0JywgU2VsZWN0RGlyZWN0aXZlKTtcblxuXHQvKmFuZ3VsYXIubW9kdWxlKCdpb25pYy1kYXRlcGlja2VyJylcblx0LmRpcmVjdGl2ZSgnc2VsZWN0JywgU2VsZWN0RGlyZWN0aXZlKTsqL1xuXG59KShhbmd1bGFyLCBpb25pYyk7Iiwid2luZG93LnF1ZXJpZXMgPSBbXG5cdC8vRHJvcCB0YWJsZXNcbiAgIFwiRFJPUCBUQUJMRSBJRiBFWElTVFMgVXNlcnM7XCIsXG5cdC8vQ3JlYXRlIHRhYmxlc1xuXHRcIkNSRUFURSBUQUJMRSBVc2VycyAoSWRVc2VyIGludGVnZXIgcHJpbWFyeSBrZXkgYXV0b2luY3JlbWVudCwgTmFtZSB0ZXh0IG5vdCBudWxsKTtcIixcblx0Ly9JbnNlcnQgVXNlcnNcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0p1YW4gRGF2aWQgTmljaG9sbHMgQ2FyZG9uYScpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnS2hyaXp0aWFuIE1vcmVubyBadWx1YWdhJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdDcmlzdGlhbiBSaXZhcyBCdWl0cmFnbycpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnSnVhbiBEYXZpZCBTw6FuY2hleicpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnTmljb2xhcyBNb2xpbmEnKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ01peWFtb3RvIE11c2FzaGkgRklsYW5kZXInKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0RpZGllciBIZXJuYW5kZXonKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0x1aXMgRWR1YXJkbyBPcXVlbmRvIFDDqXJleicpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnQ2FybG9zIFJvamFzJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdMZXZhbm8gQ2FzdGlsbGEgQ2FybG9zIE1pZ3VlbCcpO1wiXG5dOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIEFwcENvbnRyb2xsZXIpO1xuXG4gICAgQXBwQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbXlDb25maWcnLCAnSW9uaWMnLCAnTW9kZWwnLCAnQW5ndWxhciddO1xuICAgIGZ1bmN0aW9uIEFwcENvbnRyb2xsZXIoJHNjb3BlLCBteUNvbmZpZywgSW9uaWMsIE1vZGVsLCBBbmd1bGFyKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgJHRyYW5zbGF0ZSA9IEFuZ3VsYXIuJGZpbHRlcigndHJhbnNsYXRlJyk7XG5cbiAgICAgICAgJHNjb3BlLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcImlvbi1jaGF0Ym94ZXNcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0ZWFtc1wiLFxuICAgICAgICAgICAgICAgIHN0YXRlOiAnYXBwLnRlYW1zJyxcbiAgICAgICAgICAgICAgICBpbWc6IFwiaW1nL3Bva2VzdG9wLnN2Z1wiLFxuICAgICAgICAgICAgICAgIGxlZnQ6IFwiODhweFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWlvcy1wZW9wbGVcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJjcmVkaXRzXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6IFwiYXBwLmNyZWRpdHNcIlxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1lYXJ0aFwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcImV2ZW50c1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLmV2ZW50cydcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWNsaXBib2FyZFwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcInJlcG9ydFwiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLnJlcG9ydCdcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLXBlcnNvblwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcIm15X3Byb2ZpbGVcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5teVByb2ZpbGUnXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1hbmRyb2lkLWNhcnRcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJwb2tlX3N0b3BzXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6ICdhcHAucG9rZVN0b3BzJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tY2FsY3VsYXRvclwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcImNhbGN1bGF0b3JcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5jYWxjdWxhdG9yJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tY29ubmVjdGlvbi1iYXJzXCIsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6IFwic3RhdGlzdGljc1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLnN0YXRpc3RpY3MnXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIHNob3dBdXRoZW50aWNhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUucG9wdXAgPSBJb25pYy4kaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZSgnbG9nSW5UaXRsZScpLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21vZGFscy9hdXRoLmh0bWwnLFxuICAgICAgICAgICAgICAgIGhpZGVPblN0YXRlQ2hhbmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZSgnY2FuY2VsVGV4dCcpLFxuICAgICAgICAgICAgICAgIG9rVHlwZTogJ2J1dHRvbi1hc3NlcnRpdmUnLFxuICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnYW5pbWF0ZWQgcm9sbEluJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG5leHRTdGF0ZSA9IG51bGw7XG5cbiAgICAgICAgJHNjb3BlLiRvbihteUNvbmZpZy5hdXRoRXZlbnRzLm5vdEF1dGhvcml6ZWQsIGZ1bmN0aW9uKGV2ZW50LCBhcmdzKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgbmV4dDogYXJncy5uZXh0LFxuICAgICAgICAgICAgICAgIG5leHRQYXJhbXM6IGFyZ3MubmV4dFBhcmFtc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNob3dBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgVXNlckF1dGhlbnRpY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuc3RvcHBlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBNb2RlbC5OZXR3b3JrLnRyeVRvQ29ubmVjdCgpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBNb2RlbC5BdXRoLmxvZ2luKCkudGhlbihmdW5jdGlvbihhdXRoKXtcbiAgICAgICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYobmV4dFN0YXRlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFuZ3VsYXIuJHJvb3RTY29wZS51c2VyID0gYXV0aC51c2VyIHx8IGF1dGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBBbmd1bGFyLiRzdGF0ZS5nbyhuZXh0U3RhdGUubmV4dCwgbmV4dFN0YXRlLm5leHRQYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycilcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuc3RvcHBlZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBNb2RlbC5Mb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0F1dGhlbnRpY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICBpZighc2VsZi5zdG9wcGVkKXtcbiAgICAgICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBvcHVwID0gSW9uaWMuJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ25ldHdvcmtFcnJvclRpdGxlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZSgnbmV0d29ya0Vycm9yVGVtcGxhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVPblN0YWdlQ2hhbmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdhbmltYXRlZCByb3RhdGVJbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0F1dGhlbnRpY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjdXJyZW50QXV0aGVudGljYXRpb247XG5cbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkxvYWRlci5zaG93KCRzY29wZSk7XG4gICAgICAgICAgICBpZigkc2NvcGUucG9wdXAgJiYgJHNjb3BlLnBvcHVwLmNsb3NlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvcHVwLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvcHVwID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3VycmVudEF1dGhlbnRpY2F0aW9uID0gbmV3IFVzZXJBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljUG9wdXAuY29uZmlybSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2xvZ091dFRpdGxlJyksXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUoJ2xvZ091dFRlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlKCdsb2dPdXRPaycpLFxuICAgICAgICAgICAgICAgIG9rVHlwZTogJ2J1dHRvbi1hc3NlcnRpdmUnLFxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICR0cmFuc2xhdGUoJ2NhbmNlbFRleHQnKSxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2FuaW1hdGVkIGJvdW5jZUluRG93bidcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICByZXMgJiYgTW9kZWwuQXV0aC5sb2dvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5zdG9wTG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBJb25pYy4kaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgIE1vZGVsLk5ldHdvcmsuc3RvcCgpO1xuICAgICAgICAgICAgY3VycmVudEF1dGhlbnRpY2F0aW9uLnN0b3BwZWQgPSB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vcGVuQWQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuQXVkaW8ucGxheSgncGlrYXBpJyk7XG4gICAgICAgICAgICBNb2RlbC5BZG1vYi5vcGVuKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmV4aXRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpb25pYy5QbGF0Zm9ybS5leGl0QXBwKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kZWwuQXVkaW8ucHJlbG9hZCgncGlrYXBpJyk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignQ2FsY3VsYXRvckNvbnRyb2xsZXInLCBDYWxjdWxhdG9yQ29udHJvbGxlcik7XG5cbiAgICBDYWxjdWxhdG9yQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ0lvbmljJywgJ0FuZ3VsYXInXTtcblxuICAgIGZ1bmN0aW9uIENhbGN1bGF0b3JDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBJb25pYywgQW5ndWxhcikge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICBJb25pYy4kaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEFuZ3VsYXIuJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbihmaXJlYmFzZSkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignQ2hhdENvbnRyb2xsZXInLCBDaGF0Q29udHJvbGxlcik7XG5cbiAgICBDaGF0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQW5ndWxhcicsICdJb25pYycsICdNb2RlbCcsICckY29yZG92YUNsaXBib2FyZCcsICckc3RhdGVQYXJhbXMnXTtcbiAgICBmdW5jdGlvbiBDaGF0Q29udHJvbGxlcigkc2NvcGUsIEFuZ3VsYXIsIElvbmljLCBNb2RlbCwgJGNvcmRvdmFDbGlwYm9hcmQsICRzdGF0ZVBhcmFtcykge1xuXG4gICAgICAgIHZhciAkdHJhbnNsYXRlID0gQW5ndWxhci4kZmlsdGVyKCd0cmFuc2xhdGUnKTtcblxuICAgICAgICB2YXIgdmlld1Njcm9sbCA9IElvbmljLiRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgndXNlck1lc3NhZ2VTY3JvbGwnKTtcbiAgICAgICAgdmFyIGZvb3RlckJhcjsgLy8gZ2V0cyBzZXQgaW4gJGlvbmljVmlldy5lbnRlclxuICAgICAgICB2YXIgc2Nyb2xsZXI7XG4gICAgICAgIHZhciB0eHRJbnB1dDtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2VzID0gW107XG5cbiAgICAgICAgdmFyIGNyZWF0ZU1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbWVzc2FnZS5faWQgPSBub3cuZ2V0VGltZSgpOyAvLyA6filcbiAgICAgICAgICAgIG1lc3NhZ2UuZGF0ZSA9IG5vdy50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgbWVzc2FnZS51c2VybmFtZSA9ICRzY29wZS51c2VyLnVzZXJuYW1lO1xuICAgICAgICAgICAgbWVzc2FnZS51c2VySWQgPSAkc2NvcGUudXNlci5faWQ7XG4gICAgICAgICAgICBtZXNzYWdlLnBpYyA9ICRzY29wZS51c2VyLnBpYyB8fCBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKHNlbmRNZXNzYWdlRm9ybSkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgICAgdGV4dDogJHNjb3BlLmlucHV0Lm1lc3NhZ2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGlmIHlvdSBkbyBhIHdlYiBzZXJ2aWNlIGNhbGwgdGhpcyB3aWxsIGJlIG5lZWRlZCBhcyB3ZWxsIGFzIGJlZm9yZSB0aGUgdmlld1Njcm9sbCBjYWxsc1xuICAgICAgICAgICAgLy8geW91IGNhbid0IHNlZSB0aGUgZWZmZWN0IG9mIHRoaXMgaW4gdGhlIGJyb3dzZXIgaXQgbmVlZHMgdG8gYmUgdXNlZCBvbiBhIHJlYWwgZGV2aWNlXG4gICAgICAgICAgICAvLyBmb3Igc29tZSByZWFzb24gdGhlIG9uZSB0aW1lIGJsdXIgZXZlbnQgaXMgbm90IGZpcmluZyBpbiB0aGUgYnJvd3NlciBidXQgZG9lcyBvbiBkZXZpY2VzXG4gICAgICAgICAgICBrZWVwS2V5Ym9hcmRPcGVuKCk7XG5cbiAgICAgICAgICAgIGNyZWF0ZU1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRzY29wZS5pbnB1dC5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIE1vZGVsLkNoYXQuYWRkTWVzc2FnZUFuZExvY2F0aW9uKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICBBbmd1bGFyLiR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGtlZXBLZXlib2FyZE9wZW4oKTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGtlZXBLZXlib2FyZE9wZW4oKSB7XG4gICAgICAgICAgICB0eHRJbnB1dC5vbmUoJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0eHRJbnB1dFswXS5mb2N1cygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUub25NZXNzYWdlSG9sZCA9IGZ1bmN0aW9uKGUsIGl0ZW1JbmRleCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYoIW1lc3NhZ2UucGhvdG8pe1xuICAgICAgICAgICAgICAgIElvbmljLiRpb25pY0FjdGlvblNoZWV0LnNob3coe1xuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJHRyYW5zbGF0ZSgnY29weU1lc3NhZ2UnKVxuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhQ2xpcGJvYXJkLmNvcHkobWVzc2FnZS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHRoaXMgcHJvYiBzZWVtcyB3ZWlyZCBoZXJlIGJ1dCBJIGhhdmUgcmVhc29ucyBmb3IgdGhpcyBpbiBteSBhcHAsIHNlY3JldCFcbiAgICAgICAgJHNjb3BlLnZpZXdQcm9maWxlID0gZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICBpZiAobXNnLnVzZXJJZCA9PT0gJHNjb3BlLnVzZXIuX2lkKSB7XG4gICAgICAgICAgICAgICAgLy8gZ28gdG8geW91ciBwcm9maWxlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGdvIHRvIG90aGVyIHVzZXJzIHByb2ZpbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdlbGFzdGljOnJlc2l6ZScsIGZ1bmN0aW9uKGV2ZW50LCBlbGVtZW50LCBvbGRIZWlnaHQsIG5ld0hlaWdodCkge1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICghZm9vdGVyQmFyKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBuZXdGb290ZXJIZWlnaHQgPSBuZXdIZWlnaHQgKyAxMDtcbiAgICAgICAgICAgIG5ld0Zvb3RlckhlaWdodCA9IChuZXdGb290ZXJIZWlnaHQgPiA0NCkgPyBuZXdGb290ZXJIZWlnaHQgOiA0NDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9vdGVyQmFyLnN0eWxlLmhlaWdodCA9IG5ld0Zvb3RlckhlaWdodCArICdweCc7XG4gICAgICAgICAgICBzY3JvbGxlci5zdHlsZS5ib3R0b20gPSBuZXdGb290ZXJIZWlnaHQgKyAncHgnOyBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLm9uUHJvZmlsZVBpY0Vycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20udWEvaW1hZ2VzL3NycHIvbG9nbzR3LnBuZyc7IC8vIHNldCBhIGZhbGxiYWNrXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnJlZnJlc2hTY3JvbGwgPSBmdW5jdGlvbihzY3JvbGxCb3R0b20sIHRpbWVvdXQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQW5ndWxhci4kdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxCb3R0b20gPSBzY3JvbGxCb3R0b20gfHwgJHNjb3BlLnNjcm9sbERvd247XG4gICAgICAgICAgICAgICAgdmlld1Njcm9sbC5yZXNpemUoKTtcbiAgICAgICAgICAgICAgICBpZihzY3JvbGxCb3R0b20pe1xuICAgICAgICAgICAgICAgICAgICB2aWV3U2Nyb2xsLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNoZWNrU2Nyb2xsKCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0IHx8IDEwMDApO1xuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuc2Nyb2xsRG93biA9IHRydWU7XG4gICAgICAgICRzY29wZS5jaGVja1Njcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUb3AgPSB2aWV3U2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCkudG9wO1xuICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxhYmxlRGlzdGFuY2VGcm9tVG9wID0gdmlld1Njcm9sbC5nZXRTY3JvbGxWaWV3KCkuX19tYXhTY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNjcm9sbERvd24gPSAoY3VycmVudFRvcCA+PSBtYXhTY3JvbGxhYmxlRGlzdGFuY2VGcm9tVG9wKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciByZWZyZXNoTG9jYXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuR2VvbG9jYXRpb24uZ2V0TG9jYXRpb24oKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgICAgICAgICBNb2RlbC5DaGF0LnVwZGF0ZUdlb1F1ZXJ5KHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBsb2NhdGlvbkludGVydmFsO1xuICAgICAgICB2YXIgaW5pdENoYXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuTG9hZGVyLnNob3coJHNjb3BlKTtcbiAgICAgICAgICAgIE1vZGVsLkdlb2xvY2F0aW9uLmdldExvY2F0aW9uKCkudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBNb2RlbC5DaGF0LmluaXRpYWxpemUoJHN0YXRlUGFyYW1zLnRlYW0pO1xuICAgICAgICAgICAgICAgIE1vZGVsLkNoYXQuY3JlYXRlR2VvUXVlcnkoJHNjb3BlLm1lc3NhZ2VzLCAkc2NvcGUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICBNb2RlbC5Mb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgIElvbmljLiRpb25pY1BvcHVwLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZSgnZ3BzVGl0bGUnKSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUoJ2dwc1RlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZSgnb2tUZXh0JyksXG4gICAgICAgICAgICAgICAgICAgIG9rVHlwZTogJ2J1dHRvbi1hc3NlcnRpdmUnLFxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxUZXh0OiAkdHJhbnNsYXRlKCdjYW5jZWxUZXh0JyksXG4gICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnYW5pbWF0ZWQgYm91bmNlSW5Eb3duJ1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRDaGF0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja1RvVGVhbVN0YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGJhY2tUb1RlYW1TdGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBJb25pYy4kaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEFuZ3VsYXIuJHN0YXRlLmdvKCdhcHAudGVhbXMnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmJlZm9yZUVudGVyJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlciB8fCBBbmd1bGFyLiRyb290U2NvcGUudXNlcjtcbiAgICAgICAgICAgIGlmKCFjdXJyZW50VXNlcil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJhY2tUb1RlYW1TdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB7XG4gICAgICAgICAgICAgICAgX2lkOiBjdXJyZW50VXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgICBwaWM6IGN1cnJlbnRVc2VyLnBob3RvVVJMIHx8IGN1cnJlbnRVc2VyLnByb3ZpZGVyRGF0YVswXS5waG90b1VSTCB8fCAnaW1nL3BsYXllci5zdmcnLFxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAoXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyLmRpc3BsYXlOYW1lIHx8IGN1cnJlbnRVc2VyLnByb3ZpZGVyRGF0YVswXS5kaXNwbGF5TmFtZSB8fCBjdXJyZW50VXNlci5lbWFpbC5zcGxpdCgnQCcpWzBdXG4gICAgICAgICAgICAgICAgKS5zcGxpdCgnICcpLnNwbGljZSgwLCAyKS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW5pdENoYXQoKTtcbiAgICAgICAgICAgICRzY29wZS5wcm9ncmVzc0JhciA9IDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuZW50ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQW5ndWxhci4kdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBmb290ZXJCYXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5jaGF0VmlldyAuYmFyLWZvb3RlcicpO1xuICAgICAgICAgICAgICAgIHNjcm9sbGVyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcuY2hhdFZpZXcgLnNjcm9sbC1jb250ZW50Jyk7XG4gICAgICAgICAgICAgICAgdHh0SW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoZm9vdGVyQmFyLnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJykpO1xuICAgICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgICAgIGxvY2F0aW9uSW50ZXJ2YWwgPSBBbmd1bGFyLiRpbnRlcnZhbChyZWZyZXNoTG9jYXRpb24sIDEyMDAwMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuYmVmb3JlTGVhdmUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgQW5ndWxhci4kaW50ZXJ2YWwuY2FuY2VsKGxvY2F0aW9uSW50ZXJ2YWwpO1xuICAgICAgICAgICAgTW9kZWwuQ2hhdC5kZXN0cm95R2VvUXVlcnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLnN0b3BMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vVE9ETzogQ2FuY2VsIGxvYWRpbmcgYW5kIGJhY2tcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc2VuZFBob3RvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLk1lZGlhLmdldFBob3RvKCkudGhlbihmdW5jdGlvbihpbWFnZURhdGEpe1xuICAgICAgICAgICAgICAgIHZhciBtc2dJbmZvID0gTW9kZWwuQ2hhdC5hZGRFbXB0eU1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICBNb2RlbC5NZWRpYS51cGxvYWRGaWxlKGltYWdlRGF0YSwgJ2NoYXQnLCBtc2dJbmZvLmtleSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwaG90byA6IHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBNb2RlbC5DaGF0LnVwZGF0ZU1lc3NhZ2VBbmRMb2NhdGlvbihtc2dJbmZvLnBhdGgsIG1zZ0luZm8ua2V5LCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgQW5ndWxhci4kdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzQmFyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzc0JhciA9IHByb2dyZXNzICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUucGhvdG9Ccm93c2VyID0gZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZXMgPSBBbmd1bGFyLiRmaWx0ZXIoJ2ZpbHRlcicpKCRzY29wZS5tZXNzYWdlcywgeyBwaG90bzogJycgfSk7XG4gICAgICAgICAgICAkc2NvcGUuYWN0aXZlU2xpZGUgPSBtZXNzYWdlcy5pbmRleE9mKG1lc3NhZ2UpO1xuICAgICAgICAgICAgJHNjb3BlLmFsbEltYWdlcyA9IG1lc3NhZ2VzLm1hcChmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZS5waG90bztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBNb2RlbC5Nb2RhbHMub3Blbk1vZGFsKCRzY29wZSwgJ3RlbXBsYXRlcy9tb2RhbHMvZnVsbHNjcmVlbkltYWdlcy5odG1sJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuTW9kYWxzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgfTtcbiAgICB9XG59KShmaXJlYmFzZSk7IiwiKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignQ3JlZGl0c0NvbnRyb2xsZXInLCBDcmVkaXRzQ29udHJvbGxlcik7XG5cbiAgICBDcmVkaXRzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbiAgICBmdW5jdGlvbiBDcmVkaXRzQ29udHJvbGxlcigkc2NvcGUpIHtcbiAgICAgICAgXG4gICAgICAgIFxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0V2ZW50c0NvbnRyb2xsZXInLCBFdmVudHNDb250cm9sbGVyKTtcblxuICAgIEV2ZW50c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIEV2ZW50c0NvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdGaW5kUG9rZW1vbkNvbnRyb2xsZXInLCBGaW5kUG9rZW1vbkNvbnRyb2xsZXIpO1xuXG4gICAgRmluZFBva2Vtb25Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBGaW5kUG9rZW1vbkNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG5cbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUubmFtZXMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiWWFcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIllhXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJZYVwiIH1cbiAgICAgICAgXTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKGZpcmViYXNlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICAgIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdBbmd1bGFyJywgJ0lvbmljJywgJ01vZGVsJ107XG4gICAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlLCBBbmd1bGFyLCBJb25pYywgTW9kZWwpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5vcGVuSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgQW5ndWxhci4kc3RhdGUuZ28oaXRlbS5zdGF0ZSwgeyB0aXRsZTogaXRlbS50aXRsZSwgaWNvbjogaXRlbS5pY29uLCBjb2xvcjogaXRlbS5jb2xvciB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRMYW5ndWFnZSA9IEFuZ3VsYXIuJHRyYW5zbGF0ZS51c2UoKTtcbiAgICAgICAgJHNjb3BlLmxhbmd1YWdlcyA9IEFuZ3VsYXIuJHRyYW5zbGF0ZS5nZXRBdmFpbGFibGVMYW5ndWFnZUtleXMoKTtcblxuICAgICAgICBJb25pYy4kaW9uaWNQb3BvdmVyLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL21vZGFscy9jaGFuZ2VMYW5ndWFnZS5odG1sJywge1xuICAgICAgICAgICAgc2NvcGU6ICRzY29wZVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChwb3BvdmVyKSB7XG4gICAgICAgICAgICAkc2NvcGUucG9wb3ZlciA9IHBvcG92ZXI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5vcGVuUG9wb3ZlciA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcbiAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnNob3coJGV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24obGFuZyl7XG4gICAgICAgICAgICBBbmd1bGFyLiR0cmFuc2xhdGUudXNlKGxhbmcpO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRMYW5ndWFnZSA9IGxhbmc7XG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhbmcnLCBsYW5nKTtcbiAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBNb2RlbC5BdWRpby5wcmVsb2FkKCdwaWthY2h1Jyk7XG5cbiAgICAgICAgJHNjb3BlLnBsYXlBdWRpbyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncGxheScpXG4gICAgICAgICAgICBNb2RlbC5BdWRpby5wbGF5KCdwaWthY2h1Jyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmluaXRTdG9yZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5TdG9yZS5idXkoKTtcbiAgICAgICAgfTtcbiAgICB9XG59KShmaXJlYmFzZSk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0l0ZW1Db250cm9sbGVyJywgSXRlbUNvbnRyb2xsZXIpO1xuXG4gICAgSXRlbUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIEl0ZW1Db250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdNeVByb2ZpbGVDb250cm9sbGVyJywgTXlQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBNeVByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBNeVByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignUG9rZVN0b3BzQ29udHJvbGxlcicsIFBva2VTdG9wc0NvbnRyb2xsZXIpO1xuXG4gICAgUG9rZVN0b3BzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gUG9rZVN0b3BzQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1JlcG9ydENvbnRyb2xsZXInLCBSZXBvcnRDb250cm9sbGVyKTtcblxuICAgIFJlcG9ydENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIFJlcG9ydENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdTdGF0aXN0aWNzQ29udHJvbGxlcicsIFN0YXRpc3RpY3NDb250cm9sbGVyKTtcblxuICAgIFN0YXRpc3RpY3NDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBTdGF0aXN0aWNzQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RlYW1zQ29udHJvbGxlcicsIFRlYW1zQ29udHJvbGxlcik7XG5cbiAgICBUZWFtc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcyddO1xuXG4gICAgZnVuY3Rpb24gVGVhbXNDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUgfHwgJ3RlYW1zJyxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uIHx8ICdpb24tYW5kcm9pZC1nbG9iZSdcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJykuZmlsdGVyKCdubDJicicsIFsnJGZpbHRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbigkZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEucmVwbGFjZSgvXFxuXFxyPy9nLCAnPGJyIC8+Jyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG59KSgpOyIsIihmdW5jdGlvbiAoQXV0b2xpbmtlcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnYXV0b2xpbmtlcicsIGF1dG9saW5rZXIpO1xuXG4gICAgYXV0b2xpbmtlci4kaW5qZWN0ID0gWyckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIGF1dG9saW5rZXIoJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlSHRtbCA9IGVsZW1lbnQuaHRtbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVIdG1sID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBBdXRvbGlua2VyLmxpbmsoZWxlSHRtbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXV0b2xpbmtlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdXaW5kb3c6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0b2xpbmtzID0gZWxlbWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdXRvbGlua2VyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdXRvbGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChhdXRvbGlua3NbaV0pLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IGUudGFyZ2V0LmhyZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhyZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy93aW5kb3cub3BlbihocmVmLCAnX3N5c3RlbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihocmVmLCAnX2JsYW5rJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkoQXV0b2xpbmtlcik7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnZGF5T3JOaWdodCcsIGRheU9yTmlnaHQpO1xuXG4gICAgLy9kYXlPck5pZ2h0LiRpbmplY3QgPSBbJyddO1xuICAgIGZ1bmN0aW9uIGRheU9yTmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiZGF5XCI7XG4gICAgICAgICAgICAgICAgaWYoKG5ldyBEYXRlKCkpLmdldEhvdXJzKCkgPj0gMTgpe1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBcIm5pZ2h0XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZGlyZWN0aXZlKCdob2xkTGlzdCcsIGhvbGRMaXN0KTtcblxuXHRob2xkTGlzdC4kaW5qZWN0ID0gWyckaW9uaWNHZXN0dXJlJ107XG5cdGZ1bmN0aW9uIGhvbGRMaXN0KCRpb25pY0dlc3R1cmUpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0XHQkaW9uaWNHZXN0dXJlLm9uKCdob2xkJywgZnVuY3Rpb24gKGUpIHtcblxuXHRcdFx0XHRcdHZhciBjb250ZW50ID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcuaXRlbS1jb250ZW50Jyk7XG5cblx0XHRcdFx0XHR2YXIgYnV0dG9ucyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLml0ZW0tb3B0aW9ucycpO1xuXHRcdFx0XHRcdHZhciBidXR0b25zV2lkdGggPSBidXR0b25zLm9mZnNldFdpZHRoO1xuXG5cdFx0XHRcdFx0aW9uaWMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGNvbnRlbnQuc3R5bGVbaW9uaWMuQ1NTLlRSQU5TSVRJT05dID0gJ2FsbCBlYXNlLW91dCAuMjVzJztcblxuXHRcdFx0XHRcdFx0aWYgKCFidXR0b25zLmNsYXNzTGlzdC5jb250YWlucygnaW52aXNpYmxlJykpIHtcblx0XHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICcnO1xuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRidXR0b25zLmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuXHRcdFx0XHRcdFx0XHR9LCAyNTApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0YnV0dG9ucy5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcblx0XHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICd0cmFuc2xhdGUzZCgtJyArIGJ1dHRvbnNXaWR0aCArICdweCwgMCwgMCknO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdFx0fSwgZWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCdpbWcnLCBpbWcpO1xuXG4gICAgaW1nLiRpbmplY3QgPSBbJyRwYXJzZSddO1xuICAgIGZ1bmN0aW9uIGltZygkcGFyc2UpIHtcbiAgICAgICAgZnVuY3Rpb24gZW5kc1dpdGggKHVybCwgcGF0aCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdXJsLmxlbmd0aCAtIHBhdGgubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIHVybC5pbmRleE9mKHBhdGgsIGluZGV4KSAhPT0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7ICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy5zcmM7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IGF0dHJpYnV0ZXMubmdFcnJvciAmJiAkcGFyc2UoYXR0cmlidXRlcy5uZ0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmVzIGFuIG5nLWVycm9yIGNhbGxiYWNrIHRoZW4gY2FsbCBpdFxuICAgICAgICAgICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm4oc2NvcGUsIHsgJGV2ZW50OiBldiwgJHNyYzogc3JjIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlcyBhbiBuZy1lcnJvci1zcmMgdGhlbiBzZXQgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMubmdFcnJvclNyYyAmJiAhZW5kc1dpdGgoc3JjLCBhdHRyaWJ1dGVzLm5nRXJyb3JTcmMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ3NyYycsIGF0dHJpYnV0ZXMubmdFcnJvclNyYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdsb2FkJywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gYXR0cmlidXRlcy5uZ1N1Y2Nlc3MgJiYgJHBhcnNlKGF0dHJpYnV0ZXMubmdTdWNjZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoZm4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbihzY29wZSwgeyAkZXZlbnQ6IGV2IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5kaXJlY3RpdmUoJ2lvbk11bHRpcGxlU2VsZWN0JywgaW9uTXVsdGlwbGVTZWxlY3QpO1xuXG5cdGlvbk11bHRpcGxlU2VsZWN0LiRpbmplY3QgPSBbJyRpb25pY01vZGFsJywgJyRpb25pY0dlc3R1cmUnXTtcblx0ZnVuY3Rpb24gaW9uTXVsdGlwbGVTZWxlY3QoJGlvbmljTW9kYWwsICRpb25pY0dlc3R1cmUpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0b3B0aW9uczogXCI9XCJcblx0XHRcdH0sXG5cdFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdCRzY29wZS5tdWx0aXBsZVNlbGVjdCA9IHtcblx0XHRcdFx0XHR0aXRsZTogJGF0dHJzLnRpdGxlIHx8IFwiU2VsZWN0IE9wdGlvbnNcIixcblx0XHRcdFx0XHR0ZW1wT3B0aW9uczogW10sXG5cdFx0XHRcdFx0a2V5UHJvcGVydHk6ICRhdHRycy5rZXlQcm9wZXJ0eSB8fCBcImlkXCIsXG5cdFx0XHRcdFx0dmFsdWVQcm9wZXJ0eTogJGF0dHJzLnZhbHVlUHJvcGVydHkgfHwgXCJ2YWx1ZVwiLFxuXHRcdFx0XHRcdHNlbGVjdGVkUHJvcGVydHk6ICRhdHRycy5zZWxlY3RlZFByb3BlcnR5IHx8IFwic2VsZWN0ZWRcIixcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd0ZW1wbGF0ZXMvbW9kYWxzL211bHRpcGxlU2VsZWN0Lmh0bWwnLFxuXHRcdFx0XHRcdHJlbmRlckNoZWNrYm94OiAkYXR0cnMucmVuZGVyQ2hlY2tib3ggPyAkYXR0cnMucmVuZGVyQ2hlY2tib3ggPT0gXCJ0cnVlXCIgOiB0cnVlLFxuXHRcdFx0XHRcdGFuaW1hdGlvbjogJGF0dHJzLmFuaW1hdGlvbiB8fCAnc2xpZGUtaW4tdXAnXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JHNjb3BlLk9wZW5Nb2RhbEZyb21UZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVVybCkge1xuXHRcdFx0XHRcdCRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGF0ZVVybCwge1xuXHRcdFx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJHNjb3BlLm11bHRpcGxlU2VsZWN0LmFuaW1hdGlvblxuXHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwgPSBtb2RhbDtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbC5zaG93KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGlvbmljR2VzdHVyZS5vbigndGFwJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHQkc2NvcGUubXVsdGlwbGVTZWxlY3QudGVtcE9wdGlvbnMgPSAkc2NvcGUub3B0aW9ucy5tYXAoZnVuY3Rpb24gKG9wdGlvbikge1xuXHRcdFx0XHRcdFx0dmFyIHRlbXBPcHRpb24gPSB7fTtcblx0XHRcdFx0XHRcdHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LmtleVByb3BlcnR5XSA9IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldO1xuXHRcdFx0XHRcdFx0dGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3QudmFsdWVQcm9wZXJ0eV0gPSBvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnZhbHVlUHJvcGVydHldO1xuXHRcdFx0XHRcdFx0dGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV0gPSBvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnNlbGVjdGVkUHJvcGVydHldO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGVtcE9wdGlvbjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlKCRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wbGF0ZVVybCk7XG5cdFx0XHRcdH0sICRlbGVtZW50KTtcblxuXHRcdFx0XHQkc2NvcGUuc2F2ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUubXVsdGlwbGVTZWxlY3QudGVtcE9wdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHZhciB0ZW1wT3B0aW9uID0gJHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBPcHRpb25zW2ldO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCAkc2NvcGUub3B0aW9ucy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0XHR2YXIgb3B0aW9uID0gJHNjb3BlLm9wdGlvbnNbal07XG5cdFx0XHRcdFx0XHRcdGlmICh0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV0gPT0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV0pIHtcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnNlbGVjdGVkUHJvcGVydHldID0gdGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHNjb3BlLmNsb3NlTW9kYWwoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdCRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICgkc2NvcGUubW9kYWwpIHtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZSgncmVzaXplSGVpZ2h0JywgcmVzaXplSGVpZ2h0KTtcblxuICAgIHJlc2l6ZUhlaWdodC4kaW5qZWN0ID0gWyckd2luZG93JywgJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gcmVzaXplSGVpZ2h0KCR3aW5kb3csICR0aW1lb3V0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc2l6ZUVsZW1lbnQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5wYXJlbnQoKVswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnQucGFyZW50KClbMF0ub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZVBpeGVscyA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgaWYoc2NhbGVQaXhlbHMgPiB3aWR0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZVBpeGVscyA9IHdpZHRoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IHNjYWxlUGl4ZWxzIC8gYXR0cnMucmVzaXplSGVpZ2h0IC0gMC4zO1xuICAgICAgICAgICAgICAgICAgICBpZihzY2FsZSA8IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbMF0uc3R5bGVbaW9uaWMuQ1NTLlRSQU5TRk9STV0gPSAnc2NhbGUoJyArIHNjYWxlICsgJyknO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNpemVFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXNpemVFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZGlyZWN0aXZlKCdpb25TZWFyY2hTZWxlY3QnLCBpb25TZWFyY2hTZWxlY3QpO1xuXG5cdGlvblNlYXJjaFNlbGVjdC4kaW5qZWN0ID0gWyckaW9uaWNNb2RhbCcsICckaW9uaWNHZXN0dXJlJ107XG5cdGZ1bmN0aW9uIGlvblNlYXJjaFNlbGVjdCgkaW9uaWNNb2RhbCwgJGlvbmljR2VzdHVyZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiBcIj1cIixcblx0XHRcdFx0b3B0aW9uU2VsZWN0ZWQ6IFwiPVwiXG5cdFx0XHR9LFxuXHRcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xuXHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0ID0ge1xuXHRcdFx0XHRcdHRpdGxlOiAkYXR0cnMudGl0bGUgfHwgXCJTZWFyY2hcIixcblx0XHRcdFx0XHRrZXlQcm9wZXJ0eTogJGF0dHJzLmtleVByb3BlcnR5LFxuXHRcdFx0XHRcdHZhbHVlUHJvcGVydHk6ICRhdHRycy52YWx1ZVByb3BlcnR5LFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAkYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3RlbXBsYXRlcy9zZWFyY2hTZWxlY3QuaHRtbCcsXG5cdFx0XHRcdFx0YW5pbWF0aW9uOiAkYXR0cnMuYW5pbWF0aW9uIHx8ICdzbGlkZS1pbi11cCcsXG5cdFx0XHRcdFx0b3B0aW9uOiBudWxsLFxuXHRcdFx0XHRcdHNlYXJjaHZhbHVlOiBcIlwiLFxuXHRcdFx0XHRcdGVuYWJsZVNlYXJjaDogJGF0dHJzLmVuYWJsZVNlYXJjaCA/ICRhdHRycy5lbmFibGVTZWFyY2ggPT0gXCJ0cnVlXCIgOiB0cnVlXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGlvbmljR2VzdHVyZS5vbigndGFwJywgZnVuY3Rpb24gKGUpIHtcblxuXHRcdFx0XHRcdGlmICghISRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHkgJiYgISEkc2NvcGUuc2VhcmNoU2VsZWN0LnZhbHVlUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdGlmICgkc2NvcGUub3B0aW9uU2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb24gPSAkc2NvcGUub3B0aW9uU2VsZWN0ZWRbJHNjb3BlLnNlYXJjaFNlbGVjdC5rZXlQcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb24gPSAkc2NvcGUub3B0aW9uU2VsZWN0ZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUoJHNjb3BlLnNlYXJjaFNlbGVjdC50ZW1wbGF0ZVVybCk7XG5cdFx0XHRcdH0sICRlbGVtZW50KTtcblxuXHRcdFx0XHQkc2NvcGUuc2F2ZU9wdGlvbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoISEkc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5ICYmICEhJHNjb3BlLnNlYXJjaFNlbGVjdC52YWx1ZVByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBjdXJyZW50T3B0aW9uID0gJHNjb3BlLm9wdGlvbnNbaV07XG5cdFx0XHRcdFx0XHRcdGlmIChjdXJyZW50T3B0aW9uWyRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHldID09ICRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLm9wdGlvblNlbGVjdGVkID0gY3VycmVudE9wdGlvbjtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdCRzY29wZS5vcHRpb25TZWxlY3RlZCA9ICRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0LnNlYXJjaHZhbHVlID0gXCJcIjtcblx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JHNjb3BlLmNsZWFyU2VhcmNoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3Quc2VhcmNodmFsdWUgPSBcIlwiO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0JHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5tb2RhbCkge1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JHNjb3BlLk9wZW5Nb2RhbEZyb21UZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVVybCkge1xuXHRcdFx0XHRcdCRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGF0ZVVybCwge1xuXHRcdFx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJHNjb3BlLnNlYXJjaFNlbGVjdC5hbmltYXRpb25cblx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsID0gbW9kYWw7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwuc2hvdygpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnQWRtb2InLCBBZG1vYik7XG5cbiAgICBBZG1vYi4kaW5qZWN0ID0gWydteUNvbmZpZycsICckd2luZG93JywgJyRyb290U2NvcGUnLCAnJGludGVydmFsJ107XG4gICAgZnVuY3Rpb24gQWRtb2IobXlDb25maWcsICR3aW5kb3csICRyb290U2NvcGUsICRpbnRlcnZhbCkge1xuXG4gICAgICAgIHZhciB2YWxpZGF0ZUFkbW9iID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCEkcm9vdFNjb3BlLmFkbW9iKXtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhbERhdGUgPSBuZXcgRGF0ZSgkd2luZG93LmxvY2FsU3RvcmFnZVtcImFkbW9iRGF0ZVwiXSB8fCAobmV3IERhdGUoKSkuc2V0RGF0ZShjdXJyZW50RGF0ZS5nZXREYXRlKCkgLSAxKSk7XG4gICAgICAgICAgICAgICAgaWYoY3VycmVudERhdGUgPiBsb2NhbERhdGUpe1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkbW9iID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJGludGVydmFsKHZhbGlkYXRlQWRtb2IsIDEwMDAwKTtcbiAgICAgICAgdmFsaWRhdGVBZG1vYigpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcmVwYXJlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkd2luZG93LkFkTW9iICYmICR3aW5kb3cuQWRNb2IucHJlcGFyZUludGVyc3RpdGlhbCh7XG4gICAgICAgICAgICAgICAgICAgIGFkSWQ6IG15Q29uZmlnLmFkTW9iLmlkLFxuICAgICAgICAgICAgICAgICAgICBpc1Rlc3Rpbmc6IHRydWUsIC8vIFRPRE86IHJlbW92ZSB0aGlzIGxpbmUgd2hlbiByZWxlYXNlXG4gICAgICAgICAgICAgICAgICAgIGF1dG9TaG93OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hZG1vYiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TWludXRlcyhjdXJyZW50RGF0ZS5nZXRNaW51dGVzKCkgKyA1KTtcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtcImFkbW9iRGF0ZVwiXSA9IGN1cnJlbnREYXRlO1xuICAgICAgICAgICAgICAgICR3aW5kb3cuQWRNb2IgJiYgJHdpbmRvdy5BZE1vYi5zaG93SW50ZXJzdGl0aWFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJlcGFyZSgpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJlcGFyZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdBbmd1bGFyJywgQW5ndWxhcik7XG5cblx0QW5ndWxhci4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJHRpbWVvdXQnLCAnJHJvb3RTY29wZScsICckZmlsdGVyJywgJyR0cmFuc2xhdGUnLCAnJGludGVydmFsJ107XG5cdGZ1bmN0aW9uIEFuZ3VsYXIoJHN0YXRlLCAkdGltZW91dCwgJHJvb3RTY29wZSwgJGZpbHRlciwgJHRyYW5zbGF0ZSwgJGludGVydmFsKSB7XG5cblx0XHRyZXR1cm4ge1xuICAgICAgICAgICAgJHN0YXRlOiAkc3RhdGUsXG5cdFx0XHQkdGltZW91dDogJHRpbWVvdXQsXG4gICAgICAgICAgICAkcm9vdFNjb3BlOiAkcm9vdFNjb3BlLFxuICAgICAgICAgICAgJGZpbHRlcjogJGZpbHRlcixcblx0XHRcdCR0cmFuc2xhdGU6ICR0cmFuc2xhdGUsXG5cdFx0XHQkaW50ZXJ2YWw6ICRpbnRlcnZhbFxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnQXVkaW8nLCBBdWRpbyk7XG5cbiAgICBBdWRpby4kaW5qZWN0ID0gWyckY29yZG92YU5hdGl2ZUF1ZGlvJ107XG4gICAgZnVuY3Rpb24gQXVkaW8oJGNvcmRvdmFOYXRpdmVBdWRpbykge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcmVsb2FkIDogZnVuY3Rpb24obmFtZSwgZXh0KXtcbiAgICAgICAgICAgICAgICBpb25pYy5QbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBpZih3aW5kb3cucGx1Z2lucyAmJiB3aW5kb3cucGx1Z2lucy5OYXRpdmVBdWRpbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YU5hdGl2ZUF1ZGlvLnByZWxvYWRDb21wbGV4KG5hbWUsICdhdWRpby8nICsgbmFtZSArICcuJyArIChleHQgfHwgJ3dhdicpLCAxLCAxLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsYXk6IGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5wbHVnaW5zICYmIHdpbmRvdy5wbHVnaW5zLk5hdGl2ZUF1ZGlvKXtcbiAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFOYXRpdmVBdWRpby5wbGF5KG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbihmaXJlYmFzZSkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnQXV0aCcsIEF1dGgpO1xuXG4gICAgQXV0aC4kaW5qZWN0ID0gWyckcScsICckZmlyZWJhc2VBdXRoJywgJ215Q29uZmlnJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJ107XG4gICAgZnVuY3Rpb24gQXV0aCgkcSwgJGZpcmViYXNlQXV0aCwgbXlDb25maWcsICRyb290U2NvcGUsICRzdGF0ZSkge1xuXG4gICAgICAgICRmaXJlYmFzZUF1dGgoKS4kb25BdXRoU3RhdGVDaGFuZ2VkKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgaWYoIXVzZXIgJiYgJHN0YXRlLmN1cnJlbnQgJiYgJHN0YXRlLmN1cnJlbnQuYXV0aCl7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJDaGFuZ2Ugc3RhdGUuLi5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgbmV4dFBhcmFtcywgZnJvbVN0YXRlKSB7XG4gICAgICAgICAgICBpZiAoJ2F1dGgnIGluIG5leHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoISRyb290U2NvcGUudXNlciAmJiAkc3RhdGUuY3VycmVudC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChteUNvbmZpZy5hdXRoRXZlbnRzLm5vdEF1dGhvcml6ZWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ6IG5leHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0UGFyYW1zOiBuZXh0UGFyYW1zXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHNjb3BlcyA9IFtcbiAgICAgICAgICAgIFwiZW1haWxcIixcbiAgICAgICAgICAgIFwicHJvZmlsZVwiLFxuICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3BsdXMubWVcIixcbiAgICAgICAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC91c2VyaW5mby5lbWFpbFwiLFxuICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLnByb2ZpbGVcIixcbiAgICAgICAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9wbHVzLmxvZ2luXCIsXG4gICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvZ2FtZXNcIlxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBfbmF0aXZlTG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5wbHVnaW5zLmdvb2dsZXBsdXMubG9naW4oXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzY29wZXMnOiBzY29wZXMuam9pbignICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYkNsaWVudElkJzogbXlDb25maWcuZ29vZ2xlQ2xpZW50SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb2ZmbGluZSc6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvZ2luIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmKGlvbmljLlBsYXRmb3JtLmlzV2ViVmlldygpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9uYXRpdmVMb2dpbigpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWwgPSBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlci5jcmVkZW50aWFsKHJlc3VsdC5pZFRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aENyZWRlbnRpYWwoY3JlZGVudGlhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSBuZXcgZmlyZWJhc2UuYXV0aC5Hb29nbGVBdXRoUHJvdmlkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVzLmZvckVhY2goZnVuY3Rpb24oc2NvcGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIuYWRkU2NvcGUoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpcmViYXNlLmF1dGgoKS5zaWduSW5XaXRoUG9wdXAocHJvdmlkZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpcmViYXNlLmF1dGgoKS5zaWduT3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UpOyIsIihmdW5jdGlvbihmaXJlYmFzZSwgR2VvRmlyZSkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnQ2hhdCcsIENoYXQpO1xuXG4gICAgQ2hhdC4kaW5qZWN0ID0gWyckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIENoYXQoJHRpbWVvdXQpIHtcblxuICAgICAgICB2YXIgcmVmO1xuICAgICAgICB2YXIgY2hhdFJlZjtcbiAgICAgICAgdmFyIG1lc3NhZ2VzUmVmO1xuICAgICAgICB2YXIgZ2VvRmlyZTtcbiAgICAgICAgdmFyIGdlb1F1ZXJ5O1xuICAgICAgICB2YXIgY3VycmVudFRlYW1SZWY7XG4gICAgICAgIHZhciBjdXJyZW50UG9zaXRpb247XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHRlYW0pe1xuICAgICAgICAgICAgICAgIHRlYW0gPSB0ZWFtIHx8IFwiYWxsXCI7XG4gICAgICAgICAgICAgICAgcmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKTtcbiAgICAgICAgICAgICAgICBjaGF0UmVmID0gcmVmLmNoaWxkKFwiY2hhdFwiKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlc1JlZiA9IGNoYXRSZWYuY2hpbGQoXCJtZXNzYWdlc1wiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGVhbVJlZiA9IG1lc3NhZ2VzUmVmLmNoaWxkKHRlYW0pO1xuICAgICAgICAgICAgICAgIGdlb0ZpcmUgPSBuZXcgR2VvRmlyZShjaGF0UmVmLmNoaWxkKFwibG9jYXRpb25zXCIpLmNoaWxkKHRlYW0pKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRFbXB0eU1lc3NhZ2U6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGN1cnJlbnRUZWFtUmVmLnB1c2goKS5rZXk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3VycmVudFRlYW1SZWYudG9TdHJpbmcoKS5zdWJzdHJpbmcoY3VycmVudFRlYW1SZWYucm9vdC50b1N0cmluZygpLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBkYXRlTWVzc2FnZUFuZExvY2F0aW9uOiBmdW5jdGlvbihwYXRoLCBrZXksIG1lc3NhZ2Upe1xuICAgICAgICAgICAgICAgIHJlZi5jaGlsZChwYXRoICsgXCIvXCIgKyBrZXkpLnVwZGF0ZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBnZW9GaXJlLnNldChrZXksIFtjdXJyZW50UG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBjdXJyZW50UG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZV0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZE1lc3NhZ2VBbmRMb2NhdGlvbiA6IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBjdXJyZW50VGVhbVJlZi5wdXNoKG1lc3NhZ2UpLmtleTtcbiAgICAgICAgICAgICAgICBnZW9GaXJlLnNldChrZXksIFtjdXJyZW50UG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBjdXJyZW50UG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZV0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZUdlb1F1ZXJ5OiBmdW5jdGlvbihtZXNzYWdlcywgJHNjb3BlLCBwb3NpdGlvbiwgcmFkKXtcbiAgICAgICAgICAgICAgICBjdXJyZW50UG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBnZW9RdWVyeSA9IGdlb0ZpcmUucXVlcnkoe1xuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IFtwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVdLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IHJhZCB8fCAxNVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGdlb1F1ZXJ5Lm9uKFwia2V5X2VudGVyZWRcIiwgZnVuY3Rpb24oa2V5LCBsb2NhdGlvbiwgZGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRlYW1SZWYub3JkZXJCeUtleSgpLmVxdWFsVG8oa2V5KS5vbmNlKCd2YWx1ZScpLnRoZW4oZnVuY3Rpb24oc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goZGF0YVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBkYXRlR2VvUXVlcnk6IGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgICAgICAgICBnZW9RdWVyeSAmJiBnZW9RdWVyeS51cGRhdGVDcml0ZXJpYSh7XG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogW3Bvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95R2VvUXVlcnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZ2VvUXVlcnkgJiYgZ2VvUXVlcnkuY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UsIEdlb0ZpcmUpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0dlb2xvY2F0aW9uJywgR2VvbG9jYXRpb24pO1xuXG4gICAgR2VvbG9jYXRpb24uJGluamVjdCA9IFsnJGNvcmRvdmFHZW9sb2NhdGlvbiddO1xuICAgIGZ1bmN0aW9uIEdlb2xvY2F0aW9uKCRjb3Jkb3ZhR2VvbG9jYXRpb24pIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0TG9jYXRpb24gOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7bWF4aW11bUFnZTogMTAwMDAsIHRpbWVvdXQ6IDUwMDAsIGVuYWJsZUhpZ2hBY2N1cmFjeTogZmFsc2V9O1xuICAgICAgICAgICAgICAgIHJldHVybiAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnSW9uaWMnLCBJb25pYyk7XG5cblx0SW9uaWMuJGluamVjdCA9IFsnJGlvbmljQWN0aW9uU2hlZXQnLCAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRpb25pY0hpc3RvcnknLCAnJGlvbmljUG9wdXAnLCAnJGlvbmljTG9hZGluZycsICckaW9uaWNQb3BvdmVyJ107XG5cdGZ1bmN0aW9uIElvbmljKCRpb25pY0FjdGlvblNoZWV0LCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgJGlvbmljVmlld1N3aXRjaGVyLCAkaW9uaWNIaXN0b3J5LCAkaW9uaWNQb3B1cCwgJGlvbmljTG9hZGluZywgJGlvbmljUG9wb3Zlcikge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCRpb25pY0FjdGlvblNoZWV0OiAkaW9uaWNBY3Rpb25TaGVldCxcbiAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlOiAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSxcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlcjogJGlvbmljVmlld1N3aXRjaGVyLFxuICAgICAgICAgICAgJGlvbmljSGlzdG9yeTogJGlvbmljSGlzdG9yeSxcbiAgICAgICAgICAgICRpb25pY1BvcHVwOiAkaW9uaWNQb3B1cCxcbiAgICAgICAgICAgICRpb25pY0xvYWRpbmc6ICRpb25pY0xvYWRpbmcsXG5cdFx0XHQkaW9uaWNQb3BvdmVyOiAkaW9uaWNQb3BvdmVyXG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ0xvYWRlcicsIExvYWRlcik7XG5cblx0TG9hZGVyLiRpbmplY3QgPSBbJyRpb25pY0xvYWRpbmcnXTtcblx0ZnVuY3Rpb24gTG9hZGVyKCRpb25pY0xvYWRpbmcpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzaG93OiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21vZGFscy9sb2FkZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgIGhpZGVPblN0YWdlQ2hhbmdlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGlkZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbihmaXJlYmFzZSkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnTWVkaWEnLCBNZWRpYSk7XG5cbiAgICBNZWRpYS4kaW5qZWN0ID0gWyckcScsICckaW9uaWNBY3Rpb25TaGVldCcsICckd2luZG93JywgJyRjb3Jkb3ZhQ2FtZXJhJywgJyRmaWx0ZXInLCAnJHRpbWVvdXQnLCAnJGNvcmRvdmFGaWxlJywgJ1V0aWxpdGllcyddO1xuICAgIGZ1bmN0aW9uIE1lZGlhKCRxLCAkaW9uaWNBY3Rpb25TaGVldCwgJHdpbmRvdywgJGNvcmRvdmFDYW1lcmEsICRmaWx0ZXIsICR0aW1lb3V0LCAkY29yZG92YUZpbGUsIFV0aWxpdGllcykge1xuICAgICAgICBcbiAgICAgICAgdmFyICR0cmFuc2xhdGUgPSAkZmlsdGVyKCd0cmFuc2xhdGUnKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXBsb2FkRmlsZTogZnVuY3Rpb24oaW1hZ2VEYXRhLCBmb2xkZXJOYW1lLCB1bmlxdWVGaWxlTmFtZSl7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2VCbG9iID0gVXRpbGl0aWVzLmI2NHRvQmxvYihpbWFnZURhdGEpO1xuICAgICAgICAgICAgICAgIHZhciBzdG9yYWdlUmVmID0gZmlyZWJhc2Uuc3RvcmFnZSgpLnJlZihmb2xkZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgdXBsb2FkVGFzayA9IHN0b3JhZ2VSZWYuY2hpbGQodW5pcXVlRmlsZU5hbWUgKyBcIi5qcGdcIikucHV0KGltYWdlQmxvYik7XG4gICAgICAgICAgICAgICAgdXBsb2FkVGFzay5vbihmaXJlYmFzZS5zdG9yYWdlLlRhc2tFdmVudC5TVEFURV9DSEFOR0VELCBmdW5jdGlvbiAoc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gc25hcHNob3QuYnl0ZXNUcmFuc2ZlcnJlZCAqIDEwMCAvIHNuYXBzaG90LnRvdGFsQnl0ZXM7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLm5vdGlmeShwcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZG93bmxvYWRVUkwgPSB1cGxvYWRUYXNrLnNuYXBzaG90LmRvd25sb2FkVVJMO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRvd25sb2FkVVJMKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRQaG90bzogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICRpb25pY0FjdGlvblNoZWV0LnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJHRyYW5zbGF0ZSgndGFrZVBob3RvJykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICR0cmFuc2xhdGUoJ3Bob3RvRnJvbUxpYnJhcnknKSB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGVUZXh0OiAkdHJhbnNsYXRlKCdsb2FkSW1hZ2UnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICR0cmFuc2xhdGUoXCJjYW5jZWxUZXh0XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0NBTkNFTCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaW9uaWMuUGxhdGZvcm0uaXNXZWJWaWV3KCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gJHdpbmRvdy5DYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuQ0FNRVJBO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpbmRleCA9PT0gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UgPSAkd2luZG93LkNhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5QSE9UT0xJQlJBUlk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFsaXR5OiA1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFdpZHRoOiAzMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvblR5cGU6ICR3aW5kb3cuQ2FtZXJhLkRlc3RpbmF0aW9uVHlwZS5EQVRBX1VSTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVR5cGU6IHNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZ1R5cGU6ICR3aW5kb3cuQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wb3Zlck9wdGlvbnM6ICR3aW5kb3cuQ2FtZXJhUG9wb3Zlck9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVG9QaG90b0FsYnVtOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlY3RPcmllbnRhdGlvbjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKGltYWdlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpbWFnZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0JST1dTRVInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKGZpcmViYXNlKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ01vZGFscycsIE1vZGFscyk7XG5cblx0TW9kYWxzLiRpbmplY3QgPSBbJyRpb25pY01vZGFsJ107XG5cdGZ1bmN0aW9uIE1vZGFscygkaW9uaWNNb2RhbCkge1xuXG5cdFx0dmFyIG1vZGFscyA9IFtdO1xuXG5cdFx0dmFyIF9vcGVuTW9kYWwgPSBmdW5jdGlvbiAoJHNjb3BlLCB0ZW1wbGF0ZVVybCwgYW5pbWF0aW9uKSB7XG5cdFx0XHRyZXR1cm4gJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XG5cdFx0XHRcdHNjb3BlOiAkc2NvcGUsXG5cdFx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uIHx8ICdzbGlkZS1pbi11cCcsXG5cdFx0XHRcdGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiBmYWxzZVxuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcblx0XHRcdFx0bW9kYWxzLnB1c2gobW9kYWwpO1xuXHRcdFx0XHRtb2RhbC5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0dmFyIF9jbG9zZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGN1cnJlbnRNb2RhbCA9IG1vZGFscy5zcGxpY2UoLTEsIDEpWzBdO1xuXHRcdFx0Y3VycmVudE1vZGFsLnJlbW92ZSgpO1xuXHRcdH07XG5cblx0XHR2YXIgX2Nsb3NlQWxsTW9kYWxzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0bW9kYWxzLm1hcChmdW5jdGlvbiAobW9kYWwpIHtcblx0XHRcdFx0bW9kYWwucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdG1vZGFscyA9IFtdO1xuXHRcdH07XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0b3Blbk1vZGFsOiBfb3Blbk1vZGFsLFxuXHRcdFx0Y2xvc2VNb2RhbDogX2Nsb3NlTW9kYWwsXG5cdFx0XHRjbG9zZUFsbE1vZGFsczogX2Nsb3NlQWxsTW9kYWxzXG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ01vZGVsJywgTW9kZWwpO1xuXG5cdE1vZGVsLiRpbmplY3QgPSBbJ1VzZXJzJywgJ0dlb2xvY2F0aW9uJywgJ0F1dGgnLCAnTmV0d29yaycsICdBZG1vYicsICdBdWRpbycsICdDaGF0JywgJ0xvYWRlcicsICdNZWRpYScsICdNb2RhbHMnLCAnU3RvcmUnXTtcblx0ZnVuY3Rpb24gTW9kZWwoVXNlcnMsIEdlb2xvY2F0aW9uLCBBdXRoLCBOZXR3b3JrLCBBZG1vYiwgQXVkaW8sIENoYXQsIExvYWRlciwgTWVkaWEsIE1vZGFscywgU3RvcmUpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRVc2VyczogVXNlcnMsXG5cdFx0XHRHZW9sb2NhdGlvbjogR2VvbG9jYXRpb24sXG5cdFx0XHRBdXRoOiBBdXRoLFxuXHRcdFx0TmV0d29yazogTmV0d29yayxcblx0XHRcdEFkbW9iOiBBZG1vYixcblx0XHRcdEF1ZGlvOiBBdWRpbyxcblx0XHRcdENoYXQ6IENoYXQsXG5cdFx0XHRMb2FkZXI6IExvYWRlcixcblx0XHRcdE1lZGlhOiBNZWRpYSxcblx0XHRcdE1vZGFsczogTW9kYWxzLFxuXHRcdFx0U3RvcmU6IFN0b3JlXG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdOZXR3b3JrJywgTmV0d29yayk7XG5cbiAgICBOZXR3b3JrLiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckY29yZG92YU5ldHdvcmsnLCAnJHEnXTtcbiAgICBmdW5jdGlvbiBOZXR3b3JrKCR0aW1lb3V0LCAkaW50ZXJ2YWwsICRjb3Jkb3ZhTmV0d29yaywgJHEpIHtcblxuICAgICAgICB2YXIgZGVmZXJyZWQsIGludGVydmFsUHJvbWlzZSwgdGltZU91dFByb21pc2U7XG5cbiAgICAgICAgdmFyIHRyeVRvQ29ubmVjdCA9IGZ1bmN0aW9uKG1heFRpbWUpe1xuICAgICAgICAgICAgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgbWF4VGltZSA9IG1heFRpbWUgfHwgNTAwMDtcbiAgICAgICAgICAgIGlmKGlvbmljLlBsYXRmb3JtLmlzV2ViVmlldygpKXtcbiAgICAgICAgICAgICAgICBpbnRlcnZhbFByb21pc2UgPSAkaW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsUHJvbWlzZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJ09LJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICB0aW1lT3V0UHJvbWlzZSA9ICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbFByb21pc2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgnVElNRU9VVCcpO1xuICAgICAgICAgICAgICAgIH0sIG1heFRpbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCdPSycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbmNlbFByb21pc2UgPSBmdW5jdGlvbihwcm9taXNlLCAkc2VydmljZSl7XG4gICAgICAgICAgICBwcm9taXNlICYmICRzZXJ2aWNlLmNhbmNlbChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjYW5jZWxQcm9taXNlcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjYW5jZWxQcm9taXNlKGludGVydmFsUHJvbWlzZSwgJGludGVydmFsKTtcbiAgICAgICAgICAgIGNhbmNlbFByb21pc2UodGltZU91dFByb21pc2UsICR0aW1lb3V0KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc3RvcCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjYW5jZWxQcm9taXNlcygpO1xuICAgICAgICAgICAgZGVmZXJyZWQgJiYgZGVmZXJyZWQucmVqZWN0KCdTVE9QUEVEJyk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHJ5VG9Db25uZWN0OiB0cnlUb0Nvbm5lY3QsXG4gICAgICAgICAgICBzdG9wOiBzdG9wXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LnNlcnZpY2UoJyRzcWxpdGVTZXJ2aWNlJywgJHNxbGl0ZVNlcnZpY2UpO1xuXG5cdCRzcWxpdGVTZXJ2aWNlLiRpbmplY3QgPSBbJyRxJywgJyRjb3Jkb3ZhU1FMaXRlJ107XG5cdGZ1bmN0aW9uICRzcWxpdGVTZXJ2aWNlKCRxLCAkY29yZG92YVNRTGl0ZSkge1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBfZGI7XG5cblx0XHRzZWxmLmRiID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCFfZGIpIHtcblx0XHRcdFx0aWYgKHdpbmRvdy5zcWxpdGVQbHVnaW4gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdF9kYiA9IHdpbmRvdy5zcWxpdGVQbHVnaW4ub3BlbkRhdGFiYXNlKHsgbmFtZTogXCJwcmUuZGJcIiwgbG9jYXRpb246IDIsIGNyZWF0ZUZyb21Mb2NhdGlvbjogMSB9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBGb3IgZGVidWdnaW5nIGluIHRoZSBicm93c2VyXG5cdFx0XHRcdFx0X2RiID0gd2luZG93Lm9wZW5EYXRhYmFzZShcInByZS5kYlwiLCBcIjEuMFwiLCBcIkRhdGFiYXNlXCIsIDIwMDAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBfZGI7XG5cdFx0fTtcblxuXHRcdHNlbGYuZ2V0Rmlyc3RJdGVtID0gZnVuY3Rpb24gKHF1ZXJ5LCBwYXJhbWV0ZXJzKSB7XG5cdFx0XHR2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXHRcdFx0c2VsZi5leGVjdXRlU3FsKHF1ZXJ5LCBwYXJhbWV0ZXJzKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblxuXHRcdFx0XHRpZiAocmVzLnJvd3MubGVuZ3RoID4gMClcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXMucm93cy5pdGVtKDApKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZWplY3QoXCJUaGVyZSBhcmVuJ3QgaXRlbXMgbWF0Y2hpbmdcIik7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZWplY3QoZXJyKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcblx0XHR9O1xuXG5cdFx0c2VsZi5nZXRGaXJzdE9yRGVmYXVsdEl0ZW0gPSBmdW5jdGlvbiAocXVlcnksIHBhcmFtZXRlcnMpIHtcblx0XHRcdHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0XHRzZWxmLmV4ZWN1dGVTcWwocXVlcnksIHBhcmFtZXRlcnMpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXG5cdFx0XHRcdGlmIChyZXMucm93cy5sZW5ndGggPiAwKVxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlcy5yb3dzLml0ZW0oMCkpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZWplY3QoZXJyKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcblx0XHR9O1xuXG5cdFx0c2VsZi5nZXRJdGVtcyA9IGZ1bmN0aW9uIChxdWVyeSwgcGFyYW1ldGVycykge1xuXHRcdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblx0XHRcdHNlbGYuZXhlY3V0ZVNxbChxdWVyeSwgcGFyYW1ldGVycykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHZhciBpdGVtcyA9IFtdO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5yb3dzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aXRlbXMucHVzaChyZXMucm93cy5pdGVtKGkpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShpdGVtcyk7XG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZWplY3QoZXJyKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcblx0XHR9O1xuXG5cdFx0c2VsZi5wcmVsb2FkRGF0YUJhc2UgPSBmdW5jdGlvbiAoZW5hYmxlTG9nKSB7XG5cdFx0XHR2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG5cdFx0XHQvL3dpbmRvdy5vcGVuKFwiZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTgsXCIgKyBKU09OLnN0cmluZ2lmeSh7IGRhdGE6IHdpbmRvdy5xdWVyaWVzLmpvaW4oJycpLnJlcGxhY2UoL1xcXFxuL2csICdcXG4nKSB9KSk7XG5cdFx0XHRpZiAod2luZG93LnNxbGl0ZVBsdWdpbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdC8vZW5hYmxlTG9nICYmIGNvbnNvbGUubG9nKCclYyAqKioqKioqKioqKioqKioqKiBTdGFydGluZyB0aGUgY3JlYXRpb24gb2YgdGhlIGRhdGFiYXNlIGluIHRoZSBicm93c2VyICoqKioqKioqKioqKioqKioqICcsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2JhZGE1NScpO1xuXHRcdFx0XHRzZWxmLmRiKCkudHJhbnNhY3Rpb24oZnVuY3Rpb24gKHR4KSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3aW5kb3cucXVlcmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIHF1ZXJ5ID0gd2luZG93LnF1ZXJpZXNbaV0ucmVwbGFjZSgvXFxcXG4vZywgJ1xcbicpO1xuXG5cdFx0XHRcdFx0XHQvL2VuYWJsZUxvZyAmJiBjb25zb2xlLmxvZyh3aW5kb3cucXVlcmllc1tpXSk7XG5cdFx0XHRcdFx0XHR0eC5leGVjdXRlU3FsKHF1ZXJ5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnJvcik7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL2VuYWJsZUxvZyAmJiBjb25zb2xlLmxvZygnJWMgKioqKioqKioqKioqKioqKiogQ29tcGxldGluZyB0aGUgY3JlYXRpb24gb2YgdGhlIGRhdGFiYXNlIGluIHRoZSBicm93c2VyICoqKioqKioqKioqKioqKioqICcsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2JhZGE1NScpO1xuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoXCJPS1wiKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShcIk9LXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcblx0XHR9O1xuXG5cdFx0c2VsZi5leGVjdXRlU3FsID0gZnVuY3Rpb24gKHF1ZXJ5LCBwYXJhbWV0ZXJzKSB7XG5cdFx0XHRyZXR1cm4gJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShzZWxmLmRiKCksIHF1ZXJ5LCBwYXJhbWV0ZXJzKTtcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ1N0b3JlJywgU3RvcmUpO1xyXG5cclxuXHRTdG9yZS4kaW5qZWN0ID0gWyckd2luZG93JywgJyRyb290U2NvcGUnXTtcclxuXHRmdW5jdGlvbiBTdG9yZSgkd2luZG93LCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgICAgIHZhciBzdG9yZSA9ICR3aW5kb3cuc3RvcmU7XHJcblxyXG4gICAgICAgIHZhciBnZXRJbmZvID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSBzdG9yZS5nZXQoJ2NvLm5pY2hvbGxzLnBva2VkZXhnby5yZW1vdmVhZHMnKTtcclxuXHJcbiAgICAgICAgICAgICRyb290U2NvcGUuc2hvd0FkcyA9ICFwcm9kdWN0Lm93bmVkO1xyXG4gICAgICAgICAgICBpZihwcm9kdWN0Lm93bmVkKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlLm9mZihnZXRJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlID0gJHdpbmRvdy5zdG9yZTtcclxuICAgICAgICAgICAgICAgIGlmKHN0b3JlKXtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS52ZXJib3NpdHkgPSBzdG9yZS5JTkZPO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnJlZ2lzdGVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICAgICdjby5uaWNob2xscy5wb2tlZGV4Z28ucmVtb3ZlYWRzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXM6ICdSZW1vdmUgQWRzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogICBzdG9yZS5OT05fQ09OU1VNQUJMRVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRJbmZvKCk7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLndoZW4oXCJSZW1vdmUgQWRzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5sb2FkZWQoZnVuY3Rpb24ocHJvZHVjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcImxvYWRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZWQoZ2V0SW5mbylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcHJvdmVkKGZ1bmN0aW9uIChwcm9kdWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvZygnWW91IGp1c3QgdW5sb2NrZWQgdGhlIEZVTEwgVkVSU0lPTiEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc2hvd0FkcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJhcHByb3ZlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3QuZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vd25lZChmdW5jdGlvbihwcm9kdWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb2R1Y3QuZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIm93bmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVmdW5kZWQoZnVuY3Rpb24ocHJvZHVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJyZWZ1bmRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHByb2R1Y3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhbmNlbGxlZChmdW5jdGlvbihwcm9kdWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2FuY2VsbGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNob3dBZHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBidXk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZigkcm9vdFNjb3BlLnNob3dBZHMpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLm9yZGVyKCdSZW1vdmUgQWRzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnVXNlcnMnLCBVc2Vycyk7XG5cblx0VXNlcnMuJGluamVjdCA9IFsnJHEnLCAnJHNxbGl0ZVNlcnZpY2UnXTtcblx0ZnVuY3Rpb24gVXNlcnMoJHEsICRzcWxpdGVTZXJ2aWNlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2V0QWxsOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBxdWVyeSA9IFwiU2VsZWN0ICogRlJPTSBVc2Vyc1wiO1xuXHRcdFx0XHRyZXR1cm4gJHEud2hlbigkc3FsaXRlU2VydmljZS5nZXRJdGVtcyhxdWVyeSkpO1xuXHRcdFx0fSxcblx0XHRcdGFkZDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdFx0dmFyIHF1ZXJ5ID0gXCJJTlNFUlQgSU5UTyBVc2VycyAoTmFtZSkgVkFMVUVTICg/KVwiO1xuXHRcdFx0XHRyZXR1cm4gJHEud2hlbigkc3FsaXRlU2VydmljZS5leGVjdXRlU3FsKHF1ZXJ5LCBbdXNlci5OYW1lXSkpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdVdGlsaXRpZXMnLCBVdGlsaXRpZXMpO1xuXG5cdC8vVXRpbGl0aWVzLiRpbmplY3QgPSBbXTtcblx0ZnVuY3Rpb24gVXRpbGl0aWVzKCkge1xuXG5cdFx0cmV0dXJuIHtcbiAgICAgICAgICAgIGI2NHRvQmxvYjogZnVuY3Rpb24oYjY0RGF0YSwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSl7XG4gICAgICAgICAgICAgICAgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCAnaW1hZ2UvcG5nJztcbiAgICAgICAgICAgICAgICBzbGljZVNpemUgPSBzbGljZVNpemUgfHwgNTEyO1xuXG4gICAgICAgICAgICAgICAgdmFyIGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihiNjREYXRhKTtcbiAgICAgICAgICAgICAgICB2YXIgYnl0ZUFycmF5cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgYnl0ZUNoYXJhY3RlcnMubGVuZ3RoOyBvZmZzZXQgKz0gc2xpY2VTaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ5dGVOdW1iZXJzID0gbmV3IEFycmF5KHNsaWNlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVOdW1iZXJzW2ldID0gc2xpY2UuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgYnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZU51bWJlcnMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBieXRlQXJyYXlzLnB1c2goYnl0ZUFycmF5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9iO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGFVUkx0b0Jsb2I6IGZ1bmN0aW9uKGRhdGFVUkwsIGNvbnRlbnRUeXBlKXtcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICdpbWFnZS9wbmcnO1xuICAgICAgICAgICAgICAgIC8vIERlY29kZSB0aGUgZGF0YVVSTCAgIFxuICAgICAgICAgICAgICAgIHZhciBiaW5hcnkgPSBhdG9iKGRhdGFVUkwuc3BsaXQoJywnKVsxXSk7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIDgtYml0IHVuc2lnbmVkIGFycmF5XG4gICAgICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChiaW5hcnkuY2hhckNvZGVBdChpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFJldHVybiBvdXIgQmxvYiBvYmplY3RcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJsb2IoW25ldyBVaW50OEFycmF5KGFycmF5KV0sIHsgdHlwZTogY29udGVudFR5cGUgfSk7XG4gICAgICAgICAgICB9XG5cdFx0fTtcblx0fVxufSkoKTsiXX0=
