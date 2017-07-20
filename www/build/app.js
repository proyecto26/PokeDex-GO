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
        function ($ionicPlatform, $sqliteService, $animate, myConfig, Admob, Store, amMoment, $rootScope) {

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

    AppController.$inject = ['$scope', 'myConfig', 'Ionic', 'Model', 'Angular', '$ionicDeploy'];
    function AppController($scope, myConfig, Ionic, Model, Angular, $ionicDeploy) {
        
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

        /*ionic.Platform.ready(function(){
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
        });*/
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImlzc3Vlcy5qcyIsInF1ZXJpZXMuanMiLCJjb250cm9sbGVycy9hcHAuanMiLCJjb250cm9sbGVycy9jYWxjdWxhdG9yLmpzIiwiY29udHJvbGxlcnMvY2hhdC5qcyIsImNvbnRyb2xsZXJzL2NyZWRpdHMuanMiLCJjb250cm9sbGVycy9ldmVudHMuanMiLCJjb250cm9sbGVycy9maW5kUG9rZW1vbi5qcyIsImNvbnRyb2xsZXJzL2hvbWUuanMiLCJjb250cm9sbGVycy9pdGVtLmpzIiwiY29udHJvbGxlcnMvbXlQcm9maWxlLmpzIiwiY29udHJvbGxlcnMvcG9rZVN0b3BzLmpzIiwiY29udHJvbGxlcnMvcmVwb3J0LmpzIiwiY29udHJvbGxlcnMvc3RhdGlzdGljcy5qcyIsImNvbnRyb2xsZXJzL3RlYW1zLmpzIiwiZGlyZWN0aXZlcy9hdXRvbGlua2VyLmpzIiwiZGlyZWN0aXZlcy9kYXlPck5pZ2h0LmpzIiwiZGlyZWN0aXZlcy9ob2xkTGlzdC5qcyIsImRpcmVjdGl2ZXMvaW1nLmpzIiwiZGlyZWN0aXZlcy9tdWx0aXBsZVNlbGVjdC5qcyIsImRpcmVjdGl2ZXMvcmVzaXplSGVpZ2h0LmpzIiwiZGlyZWN0aXZlcy9zZWFyY2hTZWxlY3QuanMiLCJmaWx0ZXJzL2VtcHR5UmVwbGFjZS5qcyIsInNlcnZpY2VzL2FkbW9iLmpzIiwic2VydmljZXMvYW5ndWxhci5qcyIsInNlcnZpY2VzL2F1ZGlvLmpzIiwic2VydmljZXMvYXV0aC5qcyIsInNlcnZpY2VzL2NoYXQuanMiLCJzZXJ2aWNlcy9nZW9sb2NhdGlvbi5qcyIsInNlcnZpY2VzL2lvbmljLmpzIiwic2VydmljZXMvbG9hZGVyLmpzIiwic2VydmljZXMvbWVkaWEuanMiLCJzZXJ2aWNlcy9tb2RhbHMuanMiLCJzZXJ2aWNlcy9tb2RlbC5qcyIsInNlcnZpY2VzL25ldHdvcmsuanMiLCJzZXJ2aWNlcy9zcWxpdGUuanMiLCJzZXJ2aWNlcy9zdG9yZS5qcyIsInNlcnZpY2VzL3VzZXJzLmpzIiwic2VydmljZXMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnQXBwJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuYW5ndWxhci5tb2R1bGUoJ0FwcCcsIFsnaW9uaWMnLCAnaW9uaWMuY2xvdWQnLCAnbmdDb3Jkb3ZhJywgJ25nQW5pbWF0ZScsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJywgJ25nQ29yZG92YU9hdXRoJywgJ2ZpcmViYXNlJywgJ21vbm9zcGFjZWQuZWxhc3RpYycsICdhbmd1bGFyTW9tZW50J10pXG5cbiAgICAucnVuKFsnJGlvbmljUGxhdGZvcm0nLFxuICAgICAgICAnJHNxbGl0ZVNlcnZpY2UnLFxuICAgICAgICAnJGFuaW1hdGUnLFxuICAgICAgICAnbXlDb25maWcnLFxuICAgICAgICAnQWRtb2InLFxuICAgICAgICAnU3RvcmUnLFxuICAgICAgICAnYW1Nb21lbnQnLFxuICAgICAgICAnJHJvb3RTY29wZScsXG4gICAgICAgIGZ1bmN0aW9uICgkaW9uaWNQbGF0Zm9ybSwgJHNxbGl0ZVNlcnZpY2UsICRhbmltYXRlLCBteUNvbmZpZywgQWRtb2IsIFN0b3JlLCBhbU1vbWVudCwgJHJvb3RTY29wZSkge1xuXG4gICAgICAgICAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgICAgICAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgcmVtb3ZlIHRoaXMgbGluZSB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLiBJdCBzdG9wcyB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSBzbmFwcGluZyB3aGVuIHRleHQgaW5wdXRzIGFyZSBmb2N1c2VkLiBJb25pYyBoYW5kbGVzIHRoaXMgaW50ZXJuYWxseSBmb3JcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBtdWNoIG5pY2VyIGtleWJvYXJkIGV4cGVyaWVuY2UuXG4gICAgICAgICAgICAgICAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgICAgICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9Mb2FkIHRoZSBQcmUtcG9wdWxhdGVkIGRhdGFiYXNlLCBkZWJ1ZyA9IHRydWVcbiAgICAgICAgICAgICAgICAkc3FsaXRlU2VydmljZS5wcmVsb2FkRGF0YUJhc2UodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvL1ByZXBhcmUgQWRtb2JcbiAgICAgICAgICAgICAgICBBZG1vYi5wcmVwYXJlKCk7XG5cbiAgICAgICAgICAgICAgICAvL0luaXRpYWxpemUgU3RvcmVcbiAgICAgICAgICAgICAgICBTdG9yZS5pbml0aWFsaXplKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9FbmFibGUgQW5ndWxhciBhbmltYXRpb25cbiAgICAgICAgICAgICRhbmltYXRlLmVuYWJsZWQodHJ1ZSk7XG5cbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckdHJhbnNsYXRlQ2hhbmdlRW5kJywgZnVuY3Rpb24oZGF0YSwgY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGFtTW9tZW50LmNoYW5nZUxvY2FsZShjdXJyZW50Lmxhbmd1YWdlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKVxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsXG4gICAgICAgICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgICAgICAnJGlvbmljQ29uZmlnUHJvdmlkZXInLFxuICAgICAgICAnJGNvbXBpbGVQcm92aWRlcicsXG4gICAgICAgIFwiJHRyYW5zbGF0ZVByb3ZpZGVyXCIsXG4gICAgICAgIFwiJGlvbmljQ2xvdWRQcm92aWRlclwiLFxuICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGlvbmljQ29uZmlnUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsICR0cmFuc2xhdGVQcm92aWRlciwgJGlvbmljQ2xvdWRQcm92aWRlcikge1xuXG4gICAgICAgICAgICAkaW9uaWNDbG91ZFByb3ZpZGVyLmluaXQoe1xuICAgICAgICAgICAgICAgIFwiY29yZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYXBwX2lkXCI6IFwiOGQ1Y2QyN2RcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGFwaUtleTogXCJBSXphU3lBa1lKZlcwRDFFc0RQRWxZcUpvYW4zQUg2WDhhZ1FyMmtcIixcbiAgICAgICAgICAgICAgICBhdXRoRG9tYWluOiBcInBva2VkZXgtZ28tNmY1ZjIuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgICAgICAgICAgICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9wb2tlZGV4LWdvLTZmNWYyLmZpcmViYXNlaW8uY29tXCIsXG4gICAgICAgICAgICAgICAgcHJvamVjdElkOiBcInBva2VkZXgtZ28tNmY1ZjJcIixcbiAgICAgICAgICAgICAgICBzdG9yYWdlQnVja2V0OiBcInBva2VkZXgtZ28tNmY1ZjIuYXBwc3BvdC5jb21cIixcbiAgICAgICAgICAgICAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCI0ODA4NDEyNTU1MjBcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZpcmViYXNlLmluaXRpYWxpemVBcHAoY29uZmlnKTtcblxuICAgICAgICAgICAgJGNvbXBpbGVQcm92aWRlci5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3QoL15cXHMqKGh0dHBzP3xmdHB8ZmlsZXxibG9ifGNvbnRlbnR8bXMtYXBweHx4LXdtYXBwMCk6fGRhdGE6aW1hZ2VcXC98aW1nXFwvLyk7XG4gICAgICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfG1haWx0b3xmaWxlfGdodHRwcz98bXMtYXBweHx4LXdtYXBwMCk6Lyk7XG5cbiAgICAgICAgICAgIGlmIChpb25pYy5QbGF0Zm9ybS5pc0lPUygpKSB7XG4gICAgICAgICAgICAgICAgJGlvbmljQ29uZmlnUHJvdmlkZXIuc2Nyb2xsaW5nLmpzU2Nyb2xsaW5nKHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkaW9uaWNDb25maWdQcm92aWRlci52aWV3cy5zd2lwZUJhY2tFbmFibGVkKGZhbHNlKTtcbiAgICAgICAgICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLm5hdkJhci5hbGlnblRpdGxlKCdyaWdodCcpO1xuXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xuICAgICAgICAgICAgICAgIHByZWZpeDogJ2xhbmd1YWdlLycsXG4gICAgICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnJlZ2lzdGVyQXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKFsnZW4nLCAnZXMnXSwge1xuICAgICAgICAgICAgICAgICdlbl8qJzogJ2VuJyxcbiAgICAgICAgICAgICAgICAnZXNfKic6ICdlcycsXG4gICAgICAgICAgICAgICAgJyonOiAnZW4nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKCk7XG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIuZmFsbGJhY2tMYW5ndWFnZSgnZW4nKTtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRMYW5nID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYW5nJyk7XG4gICAgICAgICAgICBpZiAoY3VycmVudExhbmcpIHtcbiAgICAgICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoY3VycmVudExhbmcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGUnKTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwcCcsXG4gICAgICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQXBwQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21lbnUuaHRtbCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmhvbWUnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvaG9tZVwiLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvaG9tZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC50ZWFtcycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZWFtc1wiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy90ZWFtcy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RlYW1zQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAudGVhbXMuY2hhdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jaGF0XCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVhbTogJ2FsbCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYXV0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd2aWV3Q29udGVudEBhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2NoYXQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGF0Q29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuY3JlZGl0cycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jcmVkaXRzXCIsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9jcmVkaXRzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlZGl0c0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLml0ZW0nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvaXRlbS97dGl0bGV9XCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvaXRlbS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0l0ZW1Db250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5maW5kUG9rZW1vbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9maW5kUG9rZW1vblwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2ZpbmRQb2tlbW9uLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRmluZFBva2Vtb25Db250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5ldmVudHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvZXZlbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvZXZlbnRzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRzQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3JlcG9ydFwiLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdDb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3JlcG9ydC5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLm15UHJvZmlsZScsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9teVByb2ZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9teVByb2ZpbGUuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNeVByb2ZpbGVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5wb2tlU3RvcHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcG9rZVN0b3BzXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcG9rZVN0b3BzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUG9rZVN0b3BzQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuY2FsY3VsYXRvcicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jYWxjdWxhdG9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld0NvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvY2FsY3VsYXRvci5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhbGN1bGF0b3JDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5zdGF0aXN0aWNzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3N0YXRpc3RpY3NcIixcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9zdGF0aXN0aWNzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU3RhdGlzdGljc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKGZ1bmN0aW9uICgkaW5qZWN0b3IsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciAkc3RhdGUgPSAkaW5qZWN0b3IuZ2V0KFwiJHN0YXRlXCIpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ob21lXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dKVxuICAgIC5jb25zdGFudCgnbXlDb25maWcnLCB7XG4gICAgICAgIGdvb2dsZUNsaWVudElkOiBcIjQ4MDg0MTI1NTUyMC1laWZsNzZidnJidHA5aHYzNnN0ZTV0YzllYXF2am5pZi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbVwiLFxuICAgICAgICBmaXJlYmFzZVVybDogXCJodHRwczovL3Bva2VkZXgtZ28tNmY1ZjIuZmlyZWJhc2Vpby5jb21cIixcbiAgICAgICAgZmlyZWJhc2VNc2dVcmw6IFwiXCIsXG4gICAgICAgIGF1dGhFdmVudHM6IHtcbiAgICAgICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgICAgICB9LFxuICAgICAgICBhZE1vYjoge1xuICAgICAgICAgICAgaWQ6ICdjYS1hcHAtcHViLTEzNDE2MDQ2MTUyMTIyMDIvNDcxMDc1MzE3OCdcbiAgICAgICAgfVxuICAgIH0pOyIsIi8qIGdsb2JhbCBpb25pYyAqL1xuKGZ1bmN0aW9uIChhbmd1bGFyLCBpb25pYykge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpb25pYy5QbGF0Zm9ybS5pc0lFID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBpb25pYy5QbGF0Zm9ybS51YS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3RyaWRlbnQnKSA+IC0xO1xuXHR9XG5cblx0aWYgKGlvbmljLlBsYXRmb3JtLmlzSUUoKSkge1xuXHRcdGFuZ3VsYXIubW9kdWxlKCdpb25pYycpXG5cdFx0XHQuZmFjdG9yeSgnJGlvbmljTmdDbGljaycsIFsnJHBhcnNlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRwYXJzZSwgJHRpbWVvdXQpIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgY2xpY2tFeHByKSB7XG5cdFx0XHRcdFx0dmFyIGNsaWNrSGFuZGxlciA9IGFuZ3VsYXIuaXNGdW5jdGlvbihjbGlja0V4cHIpID8gY2xpY2tFeHByIDogJHBhcnNlKGNsaWNrRXhwcik7XG5cblx0XHRcdFx0XHRlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNjb3BlLmNsaWNrdGltZXIpIHJldHVybjsgLy8gU2Vjb25kIGNhbGxcblx0XHRcdFx0XHRcdFx0Y2xpY2tIYW5kbGVyKHNjb3BlLCB7ICRldmVudDogKGV2ZW50KSB9KTtcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2xpY2t0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHsgZGVsZXRlIHNjb3BlLmNsaWNrdGltZXI7IH0sIDEsIGZhbHNlKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly8gSGFjayBmb3IgaU9TIFNhZmFyaSdzIGJlbmVmaXQuIEl0IGdvZXMgc2VhcmNoaW5nIGZvciBvbmNsaWNrIGhhbmRsZXJzIGFuZCBpcyBsaWFibGUgdG8gY2xpY2tcblx0XHRcdFx0XHQvLyBzb21ldGhpbmcgZWxzZSBuZWFyYnkuXG5cdFx0XHRcdFx0ZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7IH07XG5cdFx0XHRcdH07XG5cdFx0XHR9XSk7XG5cdH1cblxuXHRmdW5jdGlvbiBTZWxlY3REaXJlY3RpdmUoKSB7XG5cdFx0J3VzZSBzdHJpY3QnO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRyZXBsYWNlOiBmYWxzZSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuXHRcdFx0XHRpZiAoaW9uaWMuUGxhdGZvcm0gJiYgKGlvbmljLlBsYXRmb3JtLmlzV2luZG93c1Bob25lKCkgfHwgaW9uaWMuUGxhdGZvcm0uaXNJRSgpIHx8IGlvbmljLlBsYXRmb3JtLnBsYXRmb3JtKCkgPT09IFwiZWRnZVwiKSkge1xuXHRcdFx0XHRcdGVsZW1lbnQuYXR0cignZGF0YS10YXAtZGlzYWJsZWQnLCAndHJ1ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdGFuZ3VsYXIubW9kdWxlKCdpb25pYycpXG4gICAgLmRpcmVjdGl2ZSgnc2VsZWN0JywgU2VsZWN0RGlyZWN0aXZlKTtcblxuXHQvKmFuZ3VsYXIubW9kdWxlKCdpb25pYy1kYXRlcGlja2VyJylcblx0LmRpcmVjdGl2ZSgnc2VsZWN0JywgU2VsZWN0RGlyZWN0aXZlKTsqL1xuXG59KShhbmd1bGFyLCBpb25pYyk7Iiwid2luZG93LnF1ZXJpZXMgPSBbXG5cdC8vRHJvcCB0YWJsZXNcbiAgIFwiRFJPUCBUQUJMRSBJRiBFWElTVFMgVXNlcnM7XCIsXG5cdC8vQ3JlYXRlIHRhYmxlc1xuXHRcIkNSRUFURSBUQUJMRSBVc2VycyAoSWRVc2VyIGludGVnZXIgcHJpbWFyeSBrZXkgYXV0b2luY3JlbWVudCwgTmFtZSB0ZXh0IG5vdCBudWxsKTtcIixcblx0Ly9JbnNlcnQgVXNlcnNcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0p1YW4gRGF2aWQgTmljaG9sbHMgQ2FyZG9uYScpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnS2hyaXp0aWFuIE1vcmVubyBadWx1YWdhJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdDcmlzdGlhbiBSaXZhcyBCdWl0cmFnbycpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnSnVhbiBEYXZpZCBTw6FuY2hleicpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnTmljb2xhcyBNb2xpbmEnKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ01peWFtb3RvIE11c2FzaGkgRklsYW5kZXInKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0RpZGllciBIZXJuYW5kZXonKTtcIixcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0x1aXMgRWR1YXJkbyBPcXVlbmRvIFDDqXJleicpO1wiLFxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnQ2FybG9zIFJvamFzJyk7XCIsXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdMZXZhbm8gQ2FzdGlsbGEgQ2FybG9zIE1pZ3VlbCcpO1wiXG5dOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIEFwcENvbnRyb2xsZXIpO1xuXG4gICAgQXBwQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnbXlDb25maWcnLCAnSW9uaWMnLCAnTW9kZWwnLCAnQW5ndWxhcicsICckaW9uaWNEZXBsb3knXTtcbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRzY29wZSwgbXlDb25maWcsIElvbmljLCBNb2RlbCwgQW5ndWxhciwgJGlvbmljRGVwbG95KSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgJHRyYW5zbGF0ZSA9IEFuZ3VsYXIuJGZpbHRlcigndHJhbnNsYXRlJyk7XG5cbiAgICAgICAgJHNjb3BlLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgICAgICBpY29uOiBcImlvbi1jaGF0Ym94ZXNcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0ZWFtc1wiLFxuICAgICAgICAgICAgICAgIHN0YXRlOiAnYXBwLnRlYW1zJyxcbiAgICAgICAgICAgICAgICBpbWc6IFwiaW1nL3Bva2VzdG9wLnN2Z1wiLFxuICAgICAgICAgICAgICAgIGxlZnQ6IFwiODhweFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWlvcy1wZW9wbGVcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJjcmVkaXRzXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6IFwiYXBwLmNyZWRpdHNcIlxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1lYXJ0aFwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcImV2ZW50c1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLmV2ZW50cydcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLWNsaXBib2FyZFwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcInJlcG9ydFwiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLnJlcG9ydCdcbiAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgY29sb3I6IFwiIzI4QUFGRFwiLFxuICAgICAgICAgICAgLy8gICAgIGljb246IFwiaW9uLXBlcnNvblwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcIm15X3Byb2ZpbGVcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5teVByb2ZpbGUnXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGNvbG9yOiBcIiMyOEFBRkRcIixcbiAgICAgICAgICAgIC8vICAgICBpY29uOiBcImlvbi1hbmRyb2lkLWNhcnRcIixcbiAgICAgICAgICAgIC8vICAgICB0aXRsZTogXCJwb2tlX3N0b3BzXCIsXG4gICAgICAgICAgICAvLyAgICAgc3RhdGU6ICdhcHAucG9rZVN0b3BzJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tY2FsY3VsYXRvclwiLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcImNhbGN1bGF0b3JcIixcbiAgICAgICAgICAgIC8vICAgICBzdGF0ZTogJ2FwcC5jYWxjdWxhdG9yJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBjb2xvcjogXCIjMjhBQUZEXCIsXG4gICAgICAgICAgICAvLyAgICAgaWNvbjogXCJpb24tY29ubmVjdGlvbi1iYXJzXCIsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6IFwic3RhdGlzdGljc1wiLFxuICAgICAgICAgICAgLy8gICAgIHN0YXRlOiAnYXBwLnN0YXRpc3RpY3MnXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIHNob3dBdXRoZW50aWNhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUucG9wdXAgPSBJb25pYy4kaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZSgnbG9nSW5UaXRsZScpLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21vZGFscy9hdXRoLmh0bWwnLFxuICAgICAgICAgICAgICAgIGhpZGVPblN0YXRlQ2hhbmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZSgnY2FuY2VsVGV4dCcpLFxuICAgICAgICAgICAgICAgIG9rVHlwZTogJ2J1dHRvbi1hc3NlcnRpdmUnLFxuICAgICAgICAgICAgICAgIGNzc0NsYXNzOiAnYW5pbWF0ZWQgcm9sbEluJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG5leHRTdGF0ZSA9IG51bGw7XG5cbiAgICAgICAgJHNjb3BlLiRvbihteUNvbmZpZy5hdXRoRXZlbnRzLm5vdEF1dGhvcml6ZWQsIGZ1bmN0aW9uKGV2ZW50LCBhcmdzKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgbmV4dDogYXJncy5uZXh0LFxuICAgICAgICAgICAgICAgIG5leHRQYXJhbXM6IGFyZ3MubmV4dFBhcmFtc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNob3dBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgVXNlckF1dGhlbnRpY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuc3RvcHBlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBNb2RlbC5OZXR3b3JrLnRyeVRvQ29ubmVjdCgpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBNb2RlbC5BdXRoLmxvZ2luKCkudGhlbihmdW5jdGlvbihhdXRoKXtcbiAgICAgICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYobmV4dFN0YXRlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFuZ3VsYXIuJHJvb3RTY29wZS51c2VyID0gYXV0aC51c2VyIHx8IGF1dGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBBbmd1bGFyLiRzdGF0ZS5nbyhuZXh0U3RhdGUubmV4dCwgbmV4dFN0YXRlLm5leHRQYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycilcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuc3RvcHBlZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBNb2RlbC5Mb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0F1dGhlbnRpY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICBpZighc2VsZi5zdG9wcGVkKXtcbiAgICAgICAgICAgICAgICAgICAgTW9kZWwuTG9hZGVyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBvcHVwID0gSW9uaWMuJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ25ldHdvcmtFcnJvclRpdGxlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZSgnbmV0d29ya0Vycm9yVGVtcGxhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVPblN0YWdlQ2hhbmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdhbmltYXRlZCByb3RhdGVJbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBva1R5cGU6ICdidXR0b24tYXNzZXJ0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0F1dGhlbnRpY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjdXJyZW50QXV0aGVudGljYXRpb247XG5cbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLkxvYWRlci5zaG93KCRzY29wZSk7XG4gICAgICAgICAgICBpZigkc2NvcGUucG9wdXAgJiYgJHNjb3BlLnBvcHVwLmNsb3NlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvcHVwLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvcHVwID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3VycmVudEF1dGhlbnRpY2F0aW9uID0gbmV3IFVzZXJBdXRoZW50aWNhdGlvbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgSW9uaWMuJGlvbmljUG9wdXAuY29uZmlybSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2xvZ091dFRpdGxlJyksXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUoJ2xvZ091dFRlbXBsYXRlJyksXG4gICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlKCdsb2dPdXRPaycpLFxuICAgICAgICAgICAgICAgIG9rVHlwZTogJ2J1dHRvbi1hc3NlcnRpdmUnLFxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICR0cmFuc2xhdGUoJ2NhbmNlbFRleHQnKSxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2FuaW1hdGVkIGJvdW5jZUluRG93bidcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICByZXMgJiYgTW9kZWwuQXV0aC5sb2dvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5zdG9wTG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBJb25pYy4kaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgICAgIE1vZGVsLk5ldHdvcmsuc3RvcCgpO1xuICAgICAgICAgICAgY3VycmVudEF1dGhlbnRpY2F0aW9uLnN0b3BwZWQgPSB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vcGVuQWQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuQXVkaW8ucGxheSgncGlrYXBpJyk7XG4gICAgICAgICAgICBNb2RlbC5BZG1vYi5vcGVuKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmV4aXRBcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpb25pYy5QbGF0Zm9ybS5leGl0QXBwKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kZWwuQXVkaW8ucHJlbG9hZCgncGlrYXBpJyk7XG5cbiAgICAgICAgLyppb25pYy5QbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAgICAgJGlvbmljRGVwbG95LmNoYW5uZWwgPSAnZGV2JztcbiAgICAgICAgICAgICRpb25pY0RlcGxveS5jaGVjaygpLnRoZW4oZnVuY3Rpb24oc25hcHNob3RBdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc25hcHNob3RBdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljRGVwbG95LmRvd25sb2FkKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkaW9uaWNEZXBsb3kuZXh0cmFjdCgpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSW9uaWMuJGlvbmljUG9wdXAuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUoJ2NhbmNlbFRleHQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJUaXRsZTogJHRyYW5zbGF0ZSgndXBkYXRlRG93bmxvYWRlZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICR0cmFuc2xhdGUoJ25vdE5vdycpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAkdHJhbnNsYXRlKCdyZXN0YXJ0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblRhcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlvbmljRGVwbG95LmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7Ki9cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdDYWxjdWxhdG9yQ29udHJvbGxlcicsIENhbGN1bGF0b3JDb250cm9sbGVyKTtcblxuICAgIENhbGN1bGF0b3JDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnSW9uaWMnLCAnQW5ndWxhciddO1xuXG4gICAgZnVuY3Rpb24gQ2FsY3VsYXRvckNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIElvbmljLCBBbmd1bGFyKSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgIElvbmljLiRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICBJb25pYy4kaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQW5ndWxhci4kc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKGZpcmViYXNlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdDaGF0Q29udHJvbGxlcicsIENoYXRDb250cm9sbGVyKTtcblxuICAgIENoYXRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdBbmd1bGFyJywgJ0lvbmljJywgJ01vZGVsJywgJyRjb3Jkb3ZhQ2xpcGJvYXJkJywgJyRzdGF0ZVBhcmFtcyddO1xuICAgIGZ1bmN0aW9uIENoYXRDb250cm9sbGVyKCRzY29wZSwgQW5ndWxhciwgSW9uaWMsIE1vZGVsLCAkY29yZG92YUNsaXBib2FyZCwgJHN0YXRlUGFyYW1zKSB7XG5cbiAgICAgICAgdmFyICR0cmFuc2xhdGUgPSBBbmd1bGFyLiRmaWx0ZXIoJ3RyYW5zbGF0ZScpO1xuXG4gICAgICAgIHZhciB2aWV3U2Nyb2xsID0gSW9uaWMuJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCd1c2VyTWVzc2FnZVNjcm9sbCcpO1xuICAgICAgICB2YXIgZm9vdGVyQmFyOyAvLyBnZXRzIHNldCBpbiAkaW9uaWNWaWV3LmVudGVyXG4gICAgICAgIHZhciBzY3JvbGxlcjtcbiAgICAgICAgdmFyIHR4dElucHV0O1xuICAgICAgICAkc2NvcGUubWVzc2FnZXMgPSBbXTtcblxuICAgICAgICB2YXIgY3JlYXRlTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBtZXNzYWdlLl9pZCA9IG5vdy5nZXRUaW1lKCk7IC8vIDp+KVxuICAgICAgICAgICAgbWVzc2FnZS5kYXRlID0gbm93LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICBtZXNzYWdlLnVzZXJuYW1lID0gJHNjb3BlLnVzZXIudXNlcm5hbWU7XG4gICAgICAgICAgICBtZXNzYWdlLnVzZXJJZCA9ICRzY29wZS51c2VyLl9pZDtcbiAgICAgICAgICAgIG1lc3NhZ2UucGljID0gJHNjb3BlLnVzZXIucGljIHx8IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24oc2VuZE1lc3NhZ2VGb3JtKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAkc2NvcGUuaW5wdXQubWVzc2FnZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gaWYgeW91IGRvIGEgd2ViIHNlcnZpY2UgY2FsbCB0aGlzIHdpbGwgYmUgbmVlZGVkIGFzIHdlbGwgYXMgYmVmb3JlIHRoZSB2aWV3U2Nyb2xsIGNhbGxzXG4gICAgICAgICAgICAvLyB5b3UgY2FuJ3Qgc2VlIHRoZSBlZmZlY3Qgb2YgdGhpcyBpbiB0aGUgYnJvd3NlciBpdCBuZWVkcyB0byBiZSB1c2VkIG9uIGEgcmVhbCBkZXZpY2VcbiAgICAgICAgICAgIC8vIGZvciBzb21lIHJlYXNvbiB0aGUgb25lIHRpbWUgYmx1ciBldmVudCBpcyBub3QgZmlyaW5nIGluIHRoZSBicm93c2VyIGJ1dCBkb2VzIG9uIGRldmljZXNcbiAgICAgICAgICAgIGtlZXBLZXlib2FyZE9wZW4oKTtcblxuICAgICAgICAgICAgY3JlYXRlTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLmlucHV0Lm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTW9kZWwuQ2hhdC5hZGRNZXNzYWdlQW5kTG9jYXRpb24obWVzc2FnZSk7XG5cbiAgICAgICAgICAgIEFuZ3VsYXIuJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAga2VlcEtleWJvYXJkT3BlbigpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24ga2VlcEtleWJvYXJkT3BlbigpIHtcbiAgICAgICAgICAgIHR4dElucHV0Lm9uZSgnYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHR4dElucHV0WzBdLmZvY3VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5vbk1lc3NhZ2VIb2xkID0gZnVuY3Rpb24oZSwgaXRlbUluZGV4LCBtZXNzYWdlKSB7XG4gICAgICAgICAgICBpZighbWVzc2FnZS5waG90byl7XG4gICAgICAgICAgICAgICAgSW9uaWMuJGlvbmljQWN0aW9uU2hlZXQuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAkdHJhbnNsYXRlKCdjb3B5TWVzc2FnZScpXG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICBidXR0b25DbGlja2VkOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvcmRvdmFDbGlwYm9hcmQuY29weShtZXNzYWdlLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gdGhpcyBwcm9iIHNlZW1zIHdlaXJkIGhlcmUgYnV0IEkgaGF2ZSByZWFzb25zIGZvciB0aGlzIGluIG15IGFwcCwgc2VjcmV0IVxuICAgICAgICAkc2NvcGUudmlld1Byb2ZpbGUgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIGlmIChtc2cudXNlcklkID09PSAkc2NvcGUudXNlci5faWQpIHtcbiAgICAgICAgICAgICAgICAvLyBnbyB0byB5b3VyIHByb2ZpbGVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZ28gdG8gb3RoZXIgdXNlcnMgcHJvZmlsZVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJ2VsYXN0aWM6cmVzaXplJywgZnVuY3Rpb24oZXZlbnQsIGVsZW1lbnQsIG9sZEhlaWdodCwgbmV3SGVpZ2h0KSB7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCFmb290ZXJCYXIpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG5ld0Zvb3RlckhlaWdodCA9IG5ld0hlaWdodCArIDEwO1xuICAgICAgICAgICAgbmV3Rm9vdGVySGVpZ2h0ID0gKG5ld0Zvb3RlckhlaWdodCA+IDQ0KSA/IG5ld0Zvb3RlckhlaWdodCA6IDQ0O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb290ZXJCYXIuc3R5bGUuaGVpZ2h0ID0gbmV3Rm9vdGVySGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgIHNjcm9sbGVyLnN0eWxlLmJvdHRvbSA9IG5ld0Zvb3RlckhlaWdodCArICdweCc7IFxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUub25Qcm9maWxlUGljRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS51YS9pbWFnZXMvc3Jwci9sb2dvNHcucG5nJzsgLy8gc2V0IGEgZmFsbGJhY2tcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUucmVmcmVzaFNjcm9sbCA9IGZ1bmN0aW9uKHNjcm9sbEJvdHRvbSwgdGltZW91dCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbmd1bGFyLiR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNjcm9sbEJvdHRvbSA9IHNjcm9sbEJvdHRvbSB8fCAkc2NvcGUuc2Nyb2xsRG93bjtcbiAgICAgICAgICAgICAgICB2aWV3U2Nyb2xsLnJlc2l6ZSgpO1xuICAgICAgICAgICAgICAgIGlmKHNjcm9sbEJvdHRvbSl7XG4gICAgICAgICAgICAgICAgICAgIHZpZXdTY3JvbGwuc2Nyb2xsQm90dG9tKHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkc2NvcGUuY2hlY2tTY3JvbGwoKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQgfHwgMTAwMCk7XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS5zY3JvbGxEb3duID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmNoZWNrU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQW5ndWxhci4kdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRvcCA9IHZpZXdTY3JvbGwuZ2V0U2Nyb2xsUG9zaXRpb24oKS50b3A7XG4gICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbGFibGVEaXN0YW5jZUZyb21Ub3AgPSB2aWV3U2Nyb2xsLmdldFNjcm9sbFZpZXcoKS5fX21heFNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2Nyb2xsRG93biA9IChjdXJyZW50VG9wID49IG1heFNjcm9sbGFibGVEaXN0YW5jZUZyb21Ub3ApO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHJlZnJlc2hMb2NhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5HZW9sb2NhdGlvbi5nZXRMb2NhdGlvbigpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICAgICAgICAgIE1vZGVsLkNoYXQudXBkYXRlR2VvUXVlcnkocG9zaXRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uSW50ZXJ2YWw7XG4gICAgICAgIHZhciBpbml0Q2hhdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5Mb2FkZXIuc2hvdygkc2NvcGUpO1xuICAgICAgICAgICAgTW9kZWwuR2VvbG9jYXRpb24uZ2V0TG9jYXRpb24oKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgICAgICAgICBNb2RlbC5Mb2FkZXIuaGlkZSgpO1xuICAgICAgICAgICAgICAgIE1vZGVsLkNoYXQuaW5pdGlhbGl6ZSgkc3RhdGVQYXJhbXMudGVhbSk7XG4gICAgICAgICAgICAgICAgTW9kZWwuQ2hhdC5jcmVhdGVHZW9RdWVyeSgkc2NvcGUubWVzc2FnZXMsICRzY29wZSwgcG9zaXRpb24pO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgIE1vZGVsLkxvYWRlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgSW9uaWMuJGlvbmljUG9wdXAuY29uZmlybSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlKCdncHNUaXRsZScpLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZSgnZ3BzVGVtcGxhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlKCdva1RleHQnKSxcbiAgICAgICAgICAgICAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWFzc2VydGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICR0cmFuc2xhdGUoJ2NhbmNlbFRleHQnKSxcbiAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdhbmltYXRlZCBib3VuY2VJbkRvd24nXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgICBpZihyZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdENoYXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrVG9UZWFtU3RhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgYmFja1RvVGVhbVN0YXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIElvbmljLiRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICBJb25pYy4kaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQW5ndWxhci4kc3RhdGUuZ28oJ2FwcC50ZWFtcycpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJyRpb25pY1ZpZXcuYmVmb3JlRW50ZXInLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyIHx8IEFuZ3VsYXIuJHJvb3RTY29wZS51c2VyO1xuICAgICAgICAgICAgaWYoIWN1cnJlbnRVc2VyKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmFja1RvVGVhbVN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGN1cnJlbnRVc2VyLmVtYWlsLFxuICAgICAgICAgICAgICAgIHBpYzogY3VycmVudFVzZXIucGhvdG9VUkwgfHwgY3VycmVudFVzZXIucHJvdmlkZXJEYXRhWzBdLnBob3RvVVJMIHx8ICdpbWcvcGxheWVyLnN2ZycsXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IChcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXIuZGlzcGxheU5hbWUgfHwgY3VycmVudFVzZXIucHJvdmlkZXJEYXRhWzBdLmRpc3BsYXlOYW1lIHx8IGN1cnJlbnRVc2VyLmVtYWlsLnNwbGl0KCdAJylbMF1cbiAgICAgICAgICAgICAgICApLnNwbGl0KCcgJykuc3BsaWNlKDAsIDIpLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJylcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpbml0Q2hhdCgpO1xuICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzQmFyID0gMDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5lbnRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBBbmd1bGFyLiR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZvb3RlckJhciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmNoYXRWaWV3IC5iYXItZm9vdGVyJyk7XG4gICAgICAgICAgICAgICAgc2Nyb2xsZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5jaGF0VmlldyAuc2Nyb2xsLWNvbnRlbnQnKTtcbiAgICAgICAgICAgICAgICB0eHRJbnB1dCA9IGFuZ3VsYXIuZWxlbWVudChmb290ZXJCYXIucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKSk7XG4gICAgICAgICAgICB9LCAwKTtcblxuICAgICAgICAgICAgbG9jYXRpb25JbnRlcnZhbCA9IEFuZ3VsYXIuJGludGVydmFsKHJlZnJlc2hMb2NhdGlvbiwgMTIwMDAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVMZWF2ZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBBbmd1bGFyLiRpbnRlcnZhbC5jYW5jZWwobG9jYXRpb25JbnRlcnZhbCk7XG4gICAgICAgICAgICBNb2RlbC5DaGF0LmRlc3Ryb3lHZW9RdWVyeSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuc3RvcExvYWRpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9UT0RPOiBDYW5jZWwgbG9hZGluZyBhbmQgYmFja1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5zZW5kUGhvdG8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgTW9kZWwuTWVkaWEuZ2V0UGhvdG8oKS50aGVuKGZ1bmN0aW9uKGltYWdlRGF0YSl7XG4gICAgICAgICAgICAgICAgdmFyIG1zZ0luZm8gPSBNb2RlbC5DaGF0LmFkZEVtcHR5TWVzc2FnZSgpO1xuICAgICAgICAgICAgICAgIE1vZGVsLk1lZGlhLnVwbG9hZEZpbGUoaW1hZ2VEYXRhLCAnY2hhdCcsIG1zZ0luZm8ua2V5KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBob3RvIDogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIE1vZGVsLkNoYXQudXBkYXRlTWVzc2FnZUFuZExvY2F0aW9uKG1zZ0luZm8ucGF0aCwgbXNnSW5mby5rZXksIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBBbmd1bGFyLiR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3NCYXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzQmFyID0gcHJvZ3Jlc3MgKyBcIiVcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5waG90b0Jyb3dzZXIgPSBmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlcyA9IEFuZ3VsYXIuJGZpbHRlcignZmlsdGVyJykoJHNjb3BlLm1lc3NhZ2VzLCB7IHBob3RvOiAnJyB9KTtcbiAgICAgICAgICAgICRzY29wZS5hY3RpdmVTbGlkZSA9IG1lc3NhZ2VzLmluZGV4T2YobWVzc2FnZSk7XG4gICAgICAgICAgICAkc2NvcGUuYWxsSW1hZ2VzID0gbWVzc2FnZXMubWFwKGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlLnBob3RvO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIE1vZGVsLk1vZGFscy5vcGVuTW9kYWwoJHNjb3BlLCAndGVtcGxhdGVzL21vZGFscy9mdWxsc2NyZWVuSW1hZ2VzLmh0bWwnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNb2RlbC5Nb2RhbHMuY2xvc2VNb2RhbCgpO1xuICAgICAgICB9O1xuICAgIH1cbn0pKGZpcmViYXNlKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdDcmVkaXRzQ29udHJvbGxlcicsIENyZWRpdHNDb250cm9sbGVyKTtcblxuICAgIENyZWRpdHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xuICAgIGZ1bmN0aW9uIENyZWRpdHNDb250cm9sbGVyKCRzY29wZSkge1xuICAgICAgICBcbiAgICAgICAgXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignRXZlbnRzQ29udHJvbGxlcicsIEV2ZW50c0NvbnRyb2xsZXIpO1xuXG4gICAgRXZlbnRzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gRXZlbnRzQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZpbmRQb2tlbW9uQ29udHJvbGxlcicsIEZpbmRQb2tlbW9uQ29udHJvbGxlcik7XG5cbiAgICBGaW5kUG9rZW1vbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIEZpbmRQb2tlbW9uQ29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcblxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5uYW1lcyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogXCJZYVwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiWWFcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIllhXCIgfVxuICAgICAgICBdO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oZmlyZWJhc2UpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xuXG4gICAgSG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0FuZ3VsYXInLCAnSW9uaWMnLCAnTW9kZWwnXTtcbiAgICBmdW5jdGlvbiBIb21lQ29udHJvbGxlcigkc2NvcGUsIEFuZ3VsYXIsIElvbmljLCBNb2RlbCkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLm9wZW5JdGVtID0gZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICBBbmd1bGFyLiRzdGF0ZS5nbyhpdGVtLnN0YXRlLCB7IHRpdGxlOiBpdGVtLnRpdGxlLCBpY29uOiBpdGVtLmljb24sIGNvbG9yOiBpdGVtLmNvbG9yIH0pO1xuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuY3VycmVudExhbmd1YWdlID0gQW5ndWxhci4kdHJhbnNsYXRlLnVzZSgpO1xuICAgICAgICAkc2NvcGUubGFuZ3VhZ2VzID0gQW5ndWxhci4kdHJhbnNsYXRlLmdldEF2YWlsYWJsZUxhbmd1YWdlS2V5cygpO1xuXG4gICAgICAgIElvbmljLiRpb25pY1BvcG92ZXIuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvbW9kYWxzL2NoYW5nZUxhbmd1YWdlLmh0bWwnLCB7XG4gICAgICAgICAgICBzY29wZTogJHNjb3BlXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHBvcG92ZXIpIHtcbiAgICAgICAgICAgICRzY29wZS5wb3BvdmVyID0gcG9wb3ZlcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Qb3BvdmVyID0gZnVuY3Rpb24gKCRldmVudCkge1xuICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIuc2hvdygkZXZlbnQpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbihsYW5nKXtcbiAgICAgICAgICAgIEFuZ3VsYXIuJHRyYW5zbGF0ZS51c2UobGFuZyk7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudExhbmd1YWdlID0gbGFuZztcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFuZycsIGxhbmcpO1xuICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIuaGlkZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIE1vZGVsLkF1ZGlvLnByZWxvYWQoJ3Bpa2FjaHUnKTtcblxuICAgICAgICAkc2NvcGUucGxheUF1ZGlvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwbGF5JylcbiAgICAgICAgICAgIE1vZGVsLkF1ZGlvLnBsYXkoJ3Bpa2FjaHUnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaW5pdFN0b3JlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1vZGVsLlN0b3JlLmJ1eSgpO1xuICAgICAgICB9O1xuICAgIH1cbn0pKGZpcmViYXNlKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignSXRlbUNvbnRyb2xsZXInLCBJdGVtQ29udHJvbGxlcik7XG5cbiAgICBJdGVtQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gSXRlbUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ015UHJvZmlsZUNvbnRyb2xsZXInLCBNeVByb2ZpbGVDb250cm9sbGVyKTtcblxuICAgIE15UHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIE15UHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRpb25pY1ZpZXdTd2l0Y2hlciwgJHN0YXRlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiAkc3RhdGVQYXJhbXMudGl0bGUsXG4gICAgICAgICAgICBpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcbiAgICAgICAgICAgIGNvbG9yOiAkc3RhdGVQYXJhbXMuY29sb3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoISRzY29wZS5pdGVtLmljb24pIHtcbiAgICAgICAgICAgICRpb25pY1ZpZXdTd2l0Y2hlci5uZXh0RGlyZWN0aW9uKCdiYWNrJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZUFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdQb2tlU3RvcHNDb250cm9sbGVyJywgUG9rZVN0b3BzQ29udHJvbGxlcik7XG5cbiAgICBQb2tlU3RvcHNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljVmlld1N3aXRjaGVyJywgJyRzdGF0ZScsICckaW9uaWNIaXN0b3J5J107XG5cbiAgICBmdW5jdGlvbiBQb2tlU3RvcHNDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignUmVwb3J0Q29udHJvbGxlcicsIFJlcG9ydENvbnRyb2xsZXIpO1xuXG4gICAgUmVwb3J0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeSddO1xuXG4gICAgZnVuY3Rpb24gUmVwb3J0Q29udHJvbGxlcigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJGlvbmljVmlld1N3aXRjaGVyLCAkc3RhdGUsICRpb25pY0hpc3RvcnkpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgIGljb246ICRzdGF0ZVBhcmFtcy5pY29uLFxuICAgICAgICAgICAgY29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghJHNjb3BlLml0ZW0uaWNvbikge1xuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlQmFjazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJyk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1N0YXRpc3RpY3NDb250cm9sbGVyJywgU3RhdGlzdGljc0NvbnRyb2xsZXIpO1xuXG4gICAgU3RhdGlzdGljc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJHN0YXRlJywgJyRpb25pY0hpc3RvcnknXTtcblxuICAgIGZ1bmN0aW9uIFN0YXRpc3RpY3NDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSkge1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XG4gICAgICAgICAgICB0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24sXG4gICAgICAgICAgICBjb2xvcjogJHN0YXRlUGFyYW1zLmNvbG9yXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5pY29uKSB7XG4gICAgICAgICAgICAkaW9uaWNWaWV3U3dpdGNoZXIubmV4dERpcmVjdGlvbignYmFjaycpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGRpc2FibGVCYWNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignVGVhbXNDb250cm9sbGVyJywgVGVhbXNDb250cm9sbGVyKTtcblxuICAgIFRlYW1zQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJ107XG5cbiAgICBmdW5jdGlvbiBUZWFtc0NvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5pdGVtID0ge1xuICAgICAgICAgICAgdGl0bGU6ICRzdGF0ZVBhcmFtcy50aXRsZSB8fCAndGVhbXMnLFxuICAgICAgICAgICAgaWNvbjogJHN0YXRlUGFyYW1zLmljb24gfHwgJ2lvbi1hbmRyb2lkLWdsb2JlJ1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uIChBdXRvbGlua2VyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCdhdXRvbGlua2VyJywgYXV0b2xpbmtlcik7XG5cbiAgICBhdXRvbGlua2VyLiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gYXV0b2xpbmtlcigkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVIdG1sID0gZWxlbWVudC5odG1sKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZUh0bWwgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IEF1dG9saW5rZXIubGluayhlbGVIdG1sLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhdXRvbGlua2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1dpbmRvdzogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5odG1sKHRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRvbGlua3MgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9saW5rZXInKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF1dG9saW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGF1dG9saW5rc1tpXSkuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBocmVmID0gZS50YXJnZXQuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dpbmRvdy5vcGVuKGhyZWYsICdfc3lzdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGhyZWYsICdfYmxhbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KShBdXRvbGlua2VyKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCdkYXlPck5pZ2h0JywgZGF5T3JOaWdodCk7XG5cbiAgICAvL2RheU9yTmlnaHQuJGluamVjdCA9IFsnJ107XG4gICAgZnVuY3Rpb24gZGF5T3JOaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJkYXlcIjtcbiAgICAgICAgICAgICAgICBpZigobmV3IERhdGUoKSkuZ2V0SG91cnMoKSA+PSAxOCl7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IFwibmlnaHRcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5kaXJlY3RpdmUoJ2hvbGRMaXN0JywgaG9sZExpc3QpO1xuXG5cdGhvbGRMaXN0LiRpbmplY3QgPSBbJyRpb25pY0dlc3R1cmUnXTtcblx0ZnVuY3Rpb24gaG9sZExpc3QoJGlvbmljR2VzdHVyZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0XHRcdCRpb25pY0dlc3R1cmUub24oJ2hvbGQnLCBmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLWNvbnRlbnQnKTtcblxuXHRcdFx0XHRcdHZhciBidXR0b25zID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcuaXRlbS1vcHRpb25zJyk7XG5cdFx0XHRcdFx0dmFyIGJ1dHRvbnNXaWR0aCA9IGJ1dHRvbnMub2Zmc2V0V2lkdGg7XG5cblx0XHRcdFx0XHRpb25pYy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNJVElPTl0gPSAnYWxsIGVhc2Utb3V0IC4yNXMnO1xuXG5cdFx0XHRcdFx0XHRpZiAoIWJ1dHRvbnMuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZpc2libGUnKSkge1xuXHRcdFx0XHRcdFx0XHRjb250ZW50LnN0eWxlW2lvbmljLkNTUy5UUkFOU0ZPUk1dID0gJyc7XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbnMuY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XG5cdFx0XHRcdFx0XHRcdH0sIDI1MCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRidXR0b25zLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xuXHRcdFx0XHRcdFx0XHRjb250ZW50LnN0eWxlW2lvbmljLkNTUy5UUkFOU0ZPUk1dID0gJ3RyYW5zbGF0ZTNkKC0nICsgYnV0dG9uc1dpZHRoICsgJ3B4LCAwLCAwKSc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHR9LCBlbGVtZW50KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2ltZycsIGltZyk7XG5cbiAgICBpbWcuJGluamVjdCA9IFsnJHBhcnNlJ107XG4gICAgZnVuY3Rpb24gaW1nKCRwYXJzZSkge1xuICAgICAgICBmdW5jdGlvbiBlbmRzV2l0aCAodXJsLCBwYXRoKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB1cmwubGVuZ3RoIC0gcGF0aC5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gdXJsLmluZGV4T2YocGF0aCwgaW5kZXgpICE9PSAtMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHsgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2Vycm9yJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcmMgPSB0aGlzLnNyYztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gYXR0cmlidXRlcy5uZ0Vycm9yICYmICRwYXJzZShhdHRyaWJ1dGVzLm5nRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZXMgYW4gbmctZXJyb3IgY2FsbGJhY2sgdGhlbiBjYWxsIGl0XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbihzY29wZSwgeyAkZXZlbnQ6IGV2LCAkc3JjOiBzcmMgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmVzIGFuIG5nLWVycm9yLXNyYyB0aGVuIHNldCBpdFxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlcy5uZ0Vycm9yU3JjICYmICFlbmRzV2l0aChzcmMsIGF0dHJpYnV0ZXMubmdFcnJvclNyYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignc3JjJywgYXR0cmlidXRlcy5uZ0Vycm9yU3JjKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2xvYWQnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBhdHRyaWJ1dGVzLm5nU3VjY2VzcyAmJiAkcGFyc2UoYXR0cmlidXRlcy5uZ1N1Y2Nlc3MpO1xuICAgICAgICAgICAgICAgICAgICBpZihmbil7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuKHNjb3BlLCB7ICRldmVudDogZXYgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmRpcmVjdGl2ZSgnaW9uTXVsdGlwbGVTZWxlY3QnLCBpb25NdWx0aXBsZVNlbGVjdCk7XG5cblx0aW9uTXVsdGlwbGVTZWxlY3QuJGluamVjdCA9IFsnJGlvbmljTW9kYWwnLCAnJGlvbmljR2VzdHVyZSddO1xuXHRmdW5jdGlvbiBpb25NdWx0aXBsZVNlbGVjdCgkaW9uaWNNb2RhbCwgJGlvbmljR2VzdHVyZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRvcHRpb25zOiBcIj1cIlxuXHRcdFx0fSxcblx0XHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcblx0XHRcdFx0JHNjb3BlLm11bHRpcGxlU2VsZWN0ID0ge1xuXHRcdFx0XHRcdHRpdGxlOiAkYXR0cnMudGl0bGUgfHwgXCJTZWxlY3QgT3B0aW9uc1wiLFxuXHRcdFx0XHRcdHRlbXBPcHRpb25zOiBbXSxcblx0XHRcdFx0XHRrZXlQcm9wZXJ0eTogJGF0dHJzLmtleVByb3BlcnR5IHx8IFwiaWRcIixcblx0XHRcdFx0XHR2YWx1ZVByb3BlcnR5OiAkYXR0cnMudmFsdWVQcm9wZXJ0eSB8fCBcInZhbHVlXCIsXG5cdFx0XHRcdFx0c2VsZWN0ZWRQcm9wZXJ0eTogJGF0dHJzLnNlbGVjdGVkUHJvcGVydHkgfHwgXCJzZWxlY3RlZFwiLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAkYXR0cnMudGVtcGxhdGVVcmwgfHwgJ3RlbXBsYXRlcy9tb2RhbHMvbXVsdGlwbGVTZWxlY3QuaHRtbCcsXG5cdFx0XHRcdFx0cmVuZGVyQ2hlY2tib3g6ICRhdHRycy5yZW5kZXJDaGVja2JveCA/ICRhdHRycy5yZW5kZXJDaGVja2JveCA9PSBcInRydWVcIiA6IHRydWUsXG5cdFx0XHRcdFx0YW5pbWF0aW9uOiAkYXR0cnMuYW5pbWF0aW9uIHx8ICdzbGlkZS1pbi11cCdcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlVXJsKSB7XG5cdFx0XHRcdFx0JGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XG5cdFx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAkc2NvcGUubXVsdGlwbGVTZWxlY3QuYW5pbWF0aW9uXG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbCA9IG1vZGFsO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnNob3coKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaW9uaWNHZXN0dXJlLm9uKCd0YXAnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdCRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9ucyA9ICRzY29wZS5vcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGVtcE9wdGlvbiA9IHt9O1xuXHRcdFx0XHRcdFx0dGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldID0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5rZXlQcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHR0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC52YWx1ZVByb3BlcnR5XSA9IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3QudmFsdWVQcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHR0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XSA9IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV07XG5cblx0XHRcdFx0XHRcdHJldHVybiB0ZW1wT3B0aW9uO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUoJHNjb3BlLm11bHRpcGxlU2VsZWN0LnRlbXBsYXRlVXJsKTtcblx0XHRcdFx0fSwgJGVsZW1lbnQpO1xuXG5cdFx0XHRcdCRzY29wZS5zYXZlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIHRlbXBPcHRpb24gPSAkc2NvcGUubXVsdGlwbGVTZWxlY3QudGVtcE9wdGlvbnNbaV07XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8ICRzY29wZS5vcHRpb25zLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBvcHRpb24gPSAkc2NvcGUub3B0aW9uc1tqXTtcblx0XHRcdFx0XHRcdFx0aWYgKHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LmtleVByb3BlcnR5XSA9PSBvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LmtleVByb3BlcnR5XSkge1xuXHRcdFx0XHRcdFx0XHRcdG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV0gPSB0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkc2NvcGUuY2xvc2VNb2RhbCgpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0JHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5tb2RhbCkge1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCdyZXNpemVIZWlnaHQnLCByZXNpemVIZWlnaHQpO1xuXG4gICAgcmVzaXplSGVpZ2h0LiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiByZXNpemVIZWlnaHQoJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVzaXplRWxlbWVudCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50LnBhcmVudCgpWzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudC5wYXJlbnQoKVswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlUGl4ZWxzID0gaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBpZihzY2FsZVBpeGVscyA+IHdpZHRoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlUGl4ZWxzID0gd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gc2NhbGVQaXhlbHMgLyBhdHRycy5yZXNpemVIZWlnaHQgLSAwLjM7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNjYWxlIDwgMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSc7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZUVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5kaXJlY3RpdmUoJ2lvblNlYXJjaFNlbGVjdCcsIGlvblNlYXJjaFNlbGVjdCk7XG5cblx0aW9uU2VhcmNoU2VsZWN0LiRpbmplY3QgPSBbJyRpb25pY01vZGFsJywgJyRpb25pY0dlc3R1cmUnXTtcblx0ZnVuY3Rpb24gaW9uU2VhcmNoU2VsZWN0KCRpb25pY01vZGFsLCAkaW9uaWNHZXN0dXJlKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG9wdGlvbnM6IFwiPVwiLFxuXHRcdFx0XHRvcHRpb25TZWxlY3RlZDogXCI9XCJcblx0XHRcdH0sXG5cdFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XG5cdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3QgPSB7XG5cdFx0XHRcdFx0dGl0bGU6ICRhdHRycy50aXRsZSB8fCBcIlNlYXJjaFwiLFxuXHRcdFx0XHRcdGtleVByb3BlcnR5OiAkYXR0cnMua2V5UHJvcGVydHksXG5cdFx0XHRcdFx0dmFsdWVQcm9wZXJ0eTogJGF0dHJzLnZhbHVlUHJvcGVydHksXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICRhdHRycy50ZW1wbGF0ZVVybCB8fCAndGVtcGxhdGVzL3NlYXJjaFNlbGVjdC5odG1sJyxcblx0XHRcdFx0XHRhbmltYXRpb246ICRhdHRycy5hbmltYXRpb24gfHwgJ3NsaWRlLWluLXVwJyxcblx0XHRcdFx0XHRvcHRpb246IG51bGwsXG5cdFx0XHRcdFx0c2VhcmNodmFsdWU6IFwiXCIsXG5cdFx0XHRcdFx0ZW5hYmxlU2VhcmNoOiAkYXR0cnMuZW5hYmxlU2VhcmNoID8gJGF0dHJzLmVuYWJsZVNlYXJjaCA9PSBcInRydWVcIiA6IHRydWVcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaW9uaWNHZXN0dXJlLm9uKCd0YXAnLCBmdW5jdGlvbiAoZSkge1xuXG5cdFx0XHRcdFx0aWYgKCEhJHNjb3BlLnNlYXJjaFNlbGVjdC5rZXlQcm9wZXJ0eSAmJiAhISRzY29wZS5zZWFyY2hTZWxlY3QudmFsdWVQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0aWYgKCRzY29wZS5vcHRpb25TZWxlY3RlZCkge1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbiA9ICRzY29wZS5vcHRpb25TZWxlY3RlZFskc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5XTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbiA9ICRzY29wZS5vcHRpb25TZWxlY3RlZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHNjb3BlLk9wZW5Nb2RhbEZyb21UZW1wbGF0ZSgkc2NvcGUuc2VhcmNoU2VsZWN0LnRlbXBsYXRlVXJsKTtcblx0XHRcdFx0fSwgJGVsZW1lbnQpO1xuXG5cdFx0XHRcdCRzY29wZS5zYXZlT3B0aW9uID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICghISRzY29wZS5zZWFyY2hTZWxlY3Qua2V5UHJvcGVydHkgJiYgISEkc2NvcGUuc2VhcmNoU2VsZWN0LnZhbHVlUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dmFyIGN1cnJlbnRPcHRpb24gPSAkc2NvcGUub3B0aW9uc1tpXTtcblx0XHRcdFx0XHRcdFx0aWYgKGN1cnJlbnRPcHRpb25bJHNjb3BlLnNlYXJjaFNlbGVjdC5rZXlQcm9wZXJ0eV0gPT0gJHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUub3B0aW9uU2VsZWN0ZWQgPSBjdXJyZW50T3B0aW9uO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNjb3BlLm9wdGlvblNlbGVjdGVkID0gJHNjb3BlLnNlYXJjaFNlbGVjdC5vcHRpb247XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3Quc2VhcmNodmFsdWUgPSBcIlwiO1xuXHRcdFx0XHRcdCRzY29wZS5tb2RhbC5yZW1vdmUoKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkc2NvcGUuY2xlYXJTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5zZWFyY2h2YWx1ZSA9IFwiXCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLm1vZGFsKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlVXJsKSB7XG5cdFx0XHRcdFx0JGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XG5cdFx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAkc2NvcGUuc2VhcmNoU2VsZWN0LmFuaW1hdGlvblxuXHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwgPSBtb2RhbDtcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbC5zaG93KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpLmZpbHRlcignbmwyYnInLCBbJyRmaWx0ZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24oJGZpbHRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLnJlcGxhY2UoL1xcblxccj8vZywgJzxiciAvPicpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBZG1vYicsIEFkbW9iKTtcblxuICAgIEFkbW9iLiRpbmplY3QgPSBbJ215Q29uZmlnJywgJyR3aW5kb3cnLCAnJHJvb3RTY29wZScsICckaW50ZXJ2YWwnXTtcbiAgICBmdW5jdGlvbiBBZG1vYihteUNvbmZpZywgJHdpbmRvdywgJHJvb3RTY29wZSwgJGludGVydmFsKSB7XG5cbiAgICAgICAgdmFyIHZhbGlkYXRlQWRtb2IgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoISRyb290U2NvcGUuYWRtb2Ipe1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsRGF0ZSA9IG5ldyBEYXRlKCR3aW5kb3cubG9jYWxTdG9yYWdlW1wiYWRtb2JEYXRlXCJdIHx8IChuZXcgRGF0ZSgpKS5zZXREYXRlKGN1cnJlbnREYXRlLmdldERhdGUoKSAtIDEpKTtcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50RGF0ZSA+IGxvY2FsRGF0ZSl7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYWRtb2IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkaW50ZXJ2YWwodmFsaWRhdGVBZG1vYiwgMTAwMDApO1xuICAgICAgICB2YWxpZGF0ZUFkbW9iKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByZXBhcmUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICR3aW5kb3cuQWRNb2IgJiYgJHdpbmRvdy5BZE1vYi5wcmVwYXJlSW50ZXJzdGl0aWFsKHtcbiAgICAgICAgICAgICAgICAgICAgYWRJZDogbXlDb25maWcuYWRNb2IuaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzVGVzdGluZzogdHJ1ZSwgLy8gVE9ETzogcmVtb3ZlIHRoaXMgbGluZSB3aGVuIHJlbGVhc2VcbiAgICAgICAgICAgICAgICAgICAgYXV0b1Nob3c6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkbW9iID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZS5zZXRNaW51dGVzKGN1cnJlbnREYXRlLmdldE1pbnV0ZXMoKSArIDUpO1xuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW1wiYWRtb2JEYXRlXCJdID0gY3VycmVudERhdGU7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5BZE1vYiAmJiAkd2luZG93LkFkTW9iLnNob3dJbnRlcnN0aXRpYWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmVwYXJlKCk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmVwYXJlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ0FuZ3VsYXInLCBBbmd1bGFyKTtcblxuXHRBbmd1bGFyLiRpbmplY3QgPSBbJyRzdGF0ZScsICckdGltZW91dCcsICckcm9vdFNjb3BlJywgJyRmaWx0ZXInLCAnJHRyYW5zbGF0ZScsICckaW50ZXJ2YWwnXTtcblx0ZnVuY3Rpb24gQW5ndWxhcigkc3RhdGUsICR0aW1lb3V0LCAkcm9vdFNjb3BlLCAkZmlsdGVyLCAkdHJhbnNsYXRlLCAkaW50ZXJ2YWwpIHtcblxuXHRcdHJldHVybiB7XG4gICAgICAgICAgICAkc3RhdGU6ICRzdGF0ZSxcblx0XHRcdCR0aW1lb3V0OiAkdGltZW91dCxcbiAgICAgICAgICAgICRyb290U2NvcGU6ICRyb290U2NvcGUsXG4gICAgICAgICAgICAkZmlsdGVyOiAkZmlsdGVyLFxuXHRcdFx0JHRyYW5zbGF0ZTogJHRyYW5zbGF0ZSxcblx0XHRcdCRpbnRlcnZhbDogJGludGVydmFsXG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBdWRpbycsIEF1ZGlvKTtcblxuICAgIEF1ZGlvLiRpbmplY3QgPSBbJyRjb3Jkb3ZhTmF0aXZlQXVkaW8nXTtcbiAgICBmdW5jdGlvbiBBdWRpbygkY29yZG92YU5hdGl2ZUF1ZGlvKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByZWxvYWQgOiBmdW5jdGlvbihuYW1lLCBleHQpe1xuICAgICAgICAgICAgICAgIGlvbmljLlBsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5wbHVnaW5zICYmIHdpbmRvdy5wbHVnaW5zLk5hdGl2ZUF1ZGlvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb3Jkb3ZhTmF0aXZlQXVkaW8ucHJlbG9hZENvbXBsZXgobmFtZSwgJ2F1ZGlvLycgKyBuYW1lICsgJy4nICsgKGV4dCB8fCAnd2F2JyksIDEsIDEsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGxheTogZnVuY3Rpb24obmFtZSl7XG4gICAgICAgICAgICAgICAgaWYod2luZG93LnBsdWdpbnMgJiYgd2luZG93LnBsdWdpbnMuTmF0aXZlQXVkaW8pe1xuICAgICAgICAgICAgICAgICAgICAkY29yZG92YU5hdGl2ZUF1ZGlvLnBsYXkobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKGZpcmViYXNlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBdXRoJywgQXV0aCk7XG5cbiAgICBBdXRoLiRpbmplY3QgPSBbJyRxJywgJyRmaXJlYmFzZUF1dGgnLCAnbXlDb25maWcnLCAnJHJvb3RTY29wZScsICckc3RhdGUnXTtcbiAgICBmdW5jdGlvbiBBdXRoKCRxLCAkZmlyZWJhc2VBdXRoLCBteUNvbmZpZywgJHJvb3RTY29wZSwgJHN0YXRlKSB7XG5cbiAgICAgICAgJGZpcmViYXNlQXV0aCgpLiRvbkF1dGhTdGF0ZUNoYW5nZWQoZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICBpZighdXNlciAmJiAkc3RhdGUuY3VycmVudCAmJiAkc3RhdGUuY3VycmVudC5hdXRoKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIkNoYW5nZSBzdGF0ZS4uLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBuZXh0UGFyYW1zLCBmcm9tU3RhdGUpIHtcbiAgICAgICAgICAgIGlmICgnYXV0aCcgaW4gbmV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghJHJvb3RTY29wZS51c2VyICYmICRzdGF0ZS5jdXJyZW50Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KG15Q29uZmlnLmF1dGhFdmVudHMubm90QXV0aG9yaXplZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dDogbmV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRQYXJhbXM6IG5leHRQYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgc2NvcGVzID0gW1xuICAgICAgICAgICAgXCJlbWFpbFwiLFxuICAgICAgICAgICAgXCJwcm9maWxlXCIsXG4gICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcGx1cy5tZVwiLFxuICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLmVtYWlsXCIsXG4gICAgICAgICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8ucHJvZmlsZVwiLFxuICAgICAgICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3BsdXMubG9naW5cIixcbiAgICAgICAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9nYW1lc1wiXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIF9uYXRpdmVMb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnBsdWdpbnMuZ29vZ2xlcGx1cy5sb2dpbihcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3Njb3Blcyc6IHNjb3Blcy5qb2luKCcgJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2ViQ2xpZW50SWQnOiBteUNvbmZpZy5nb29nbGVDbGllbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvZmZsaW5lJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9naW4gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYoaW9uaWMuUGxhdGZvcm0uaXNXZWJWaWV3KCkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX25hdGl2ZUxvZ2luKCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3JlZGVudGlhbCA9IGZpcmViYXNlLmF1dGguR29vZ2xlQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwocmVzdWx0LmlkVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpcmViYXNlLmF1dGgoKS5zaWduSW5XaXRoQ3JlZGVudGlhbChjcmVkZW50aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm92aWRlciA9IG5ldyBmaXJlYmFzZS5hdXRoLkdvb2dsZUF1dGhQcm92aWRlcigpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZXMuZm9yRWFjaChmdW5jdGlvbihzY29wZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlci5hZGRTY29wZShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLnNpZ25JbldpdGhQb3B1cChwcm92aWRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvZ291dDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlyZWJhc2UuYXV0aCgpLnNpZ25PdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KShmaXJlYmFzZSk7IiwiKGZ1bmN0aW9uKGZpcmViYXNlLCBHZW9GaXJlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdDaGF0JywgQ2hhdCk7XG5cbiAgICBDaGF0LiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gQ2hhdCgkdGltZW91dCkge1xuXG4gICAgICAgIHZhciByZWY7XG4gICAgICAgIHZhciBjaGF0UmVmO1xuICAgICAgICB2YXIgbWVzc2FnZXNSZWY7XG4gICAgICAgIHZhciBnZW9GaXJlO1xuICAgICAgICB2YXIgZ2VvUXVlcnk7XG4gICAgICAgIHZhciBjdXJyZW50VGVhbVJlZjtcbiAgICAgICAgdmFyIGN1cnJlbnRQb3NpdGlvbjtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24odGVhbSl7XG4gICAgICAgICAgICAgICAgdGVhbSA9IHRlYW0gfHwgXCJhbGxcIjtcbiAgICAgICAgICAgICAgICByZWYgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZigpO1xuICAgICAgICAgICAgICAgIGNoYXRSZWYgPSByZWYuY2hpbGQoXCJjaGF0XCIpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzUmVmID0gY2hhdFJlZi5jaGlsZChcIm1lc3NhZ2VzXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUZWFtUmVmID0gbWVzc2FnZXNSZWYuY2hpbGQodGVhbSk7XG4gICAgICAgICAgICAgICAgZ2VvRmlyZSA9IG5ldyBHZW9GaXJlKGNoYXRSZWYuY2hpbGQoXCJsb2NhdGlvbnNcIikuY2hpbGQodGVhbSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkZEVtcHR5TWVzc2FnZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gY3VycmVudFRlYW1SZWYucHVzaCgpLmtleTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdXJyZW50VGVhbVJlZi50b1N0cmluZygpLnN1YnN0cmluZyhjdXJyZW50VGVhbVJlZi5yb290LnRvU3RyaW5nKCkubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGVNZXNzYWdlQW5kTG9jYXRpb246IGZ1bmN0aW9uKHBhdGgsIGtleSwgbWVzc2FnZSl7XG4gICAgICAgICAgICAgICAgcmVmLmNoaWxkKHBhdGggKyBcIi9cIiArIGtleSkudXBkYXRlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGdlb0ZpcmUuc2V0KGtleSwgW2N1cnJlbnRQb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIGN1cnJlbnRQb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkTWVzc2FnZUFuZExvY2F0aW9uIDogZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGN1cnJlbnRUZWFtUmVmLnB1c2gobWVzc2FnZSkua2V5O1xuICAgICAgICAgICAgICAgIGdlb0ZpcmUuc2V0KGtleSwgW2N1cnJlbnRQb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIGN1cnJlbnRQb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlR2VvUXVlcnk6IGZ1bmN0aW9uKG1lc3NhZ2VzLCAkc2NvcGUsIHBvc2l0aW9uLCByYWQpe1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIGdlb1F1ZXJ5ID0gZ2VvRmlyZS5xdWVyeSh7XG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogW3Bvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZV0sXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogcmFkIHx8IDE1XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZ2VvUXVlcnkub24oXCJrZXlfZW50ZXJlZFwiLCBmdW5jdGlvbihrZXksIGxvY2F0aW9uLCBkaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGVhbVJlZi5vcmRlckJ5S2V5KCkuZXF1YWxUbyhrZXkpLm9uY2UoJ3ZhbHVlJykudGhlbihmdW5jdGlvbihzbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChkYXRhW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGVHZW9RdWVyeTogZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICAgICAgICAgIGdlb1F1ZXJ5ICYmIGdlb1F1ZXJ5LnVwZGF0ZUNyaXRlcmlhKHtcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiBbcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3Ryb3lHZW9RdWVyeTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBnZW9RdWVyeSAmJiBnZW9RdWVyeS5jYW5jZWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KShmaXJlYmFzZSwgR2VvRmlyZSk7IiwiKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnR2VvbG9jYXRpb24nLCBHZW9sb2NhdGlvbik7XG5cbiAgICBHZW9sb2NhdGlvbi4kaW5qZWN0ID0gWyckY29yZG92YUdlb2xvY2F0aW9uJ107XG4gICAgZnVuY3Rpb24gR2VvbG9jYXRpb24oJGNvcmRvdmFHZW9sb2NhdGlvbikge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRMb2NhdGlvbiA6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHttYXhpbXVtQWdlOiAxMDAwMCwgdGltZW91dDogNTAwMCwgZW5hYmxlSGlnaEFjY3VyYWN5OiBmYWxzZX07XG4gICAgICAgICAgICAgICAgcmV0dXJuICRjb3Jkb3ZhR2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdJb25pYycsIElvbmljKTtcblxuXHRJb25pYy4kaW5qZWN0ID0gWyckaW9uaWNBY3Rpb25TaGVldCcsICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsICckaW9uaWNWaWV3U3dpdGNoZXInLCAnJGlvbmljSGlzdG9yeScsICckaW9uaWNQb3B1cCcsICckaW9uaWNMb2FkaW5nJywgJyRpb25pY1BvcG92ZXInXTtcblx0ZnVuY3Rpb24gSW9uaWMoJGlvbmljQWN0aW9uU2hlZXQsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRpb25pY0hpc3RvcnksICRpb25pY1BvcHVwLCAkaW9uaWNMb2FkaW5nLCAkaW9uaWNQb3BvdmVyKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0JGlvbmljQWN0aW9uU2hlZXQ6ICRpb25pY0FjdGlvblNoZWV0LFxuICAgICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGU6ICRpb25pY1Njcm9sbERlbGVnYXRlLFxuICAgICAgICAgICAgJGlvbmljVmlld1N3aXRjaGVyOiAkaW9uaWNWaWV3U3dpdGNoZXIsXG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5OiAkaW9uaWNIaXN0b3J5LFxuICAgICAgICAgICAgJGlvbmljUG9wdXA6ICRpb25pY1BvcHVwLFxuICAgICAgICAgICAgJGlvbmljTG9hZGluZzogJGlvbmljTG9hZGluZyxcblx0XHRcdCRpb25pY1BvcG92ZXI6ICRpb25pY1BvcG92ZXJcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnTG9hZGVyJywgTG9hZGVyKTtcblxuXHRMb2FkZXIuJGluamVjdCA9IFsnJGlvbmljTG9hZGluZyddO1xuXHRmdW5jdGlvbiBMb2FkZXIoJGlvbmljTG9hZGluZykge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNob3c6IGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbW9kYWxzL2xvYWRlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgaGlkZU9uU3RhZ2VDaGFuZ2U6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaWRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgfVxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKGZpcmViYXNlKSB7XG4ndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdNZWRpYScsIE1lZGlhKTtcblxuICAgIE1lZGlhLiRpbmplY3QgPSBbJyRxJywgJyRpb25pY0FjdGlvblNoZWV0JywgJyR3aW5kb3cnLCAnJGNvcmRvdmFDYW1lcmEnLCAnJGZpbHRlcicsICckdGltZW91dCcsICckY29yZG92YUZpbGUnLCAnVXRpbGl0aWVzJ107XG4gICAgZnVuY3Rpb24gTWVkaWEoJHEsICRpb25pY0FjdGlvblNoZWV0LCAkd2luZG93LCAkY29yZG92YUNhbWVyYSwgJGZpbHRlciwgJHRpbWVvdXQsICRjb3Jkb3ZhRmlsZSwgVXRpbGl0aWVzKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgJHRyYW5zbGF0ZSA9ICRmaWx0ZXIoJ3RyYW5zbGF0ZScpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1cGxvYWRGaWxlOiBmdW5jdGlvbihpbWFnZURhdGEsIGZvbGRlck5hbWUsIHVuaXF1ZUZpbGVOYW1lKXtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZUJsb2IgPSBVdGlsaXRpZXMuYjY0dG9CbG9iKGltYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgdmFyIHN0b3JhZ2VSZWYgPSBmaXJlYmFzZS5zdG9yYWdlKCkucmVmKGZvbGRlck5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciB1cGxvYWRUYXNrID0gc3RvcmFnZVJlZi5jaGlsZCh1bmlxdWVGaWxlTmFtZSArIFwiLmpwZ1wiKS5wdXQoaW1hZ2VCbG9iKTtcbiAgICAgICAgICAgICAgICB1cGxvYWRUYXNrLm9uKGZpcmViYXNlLnN0b3JhZ2UuVGFza0V2ZW50LlNUQVRFX0NIQU5HRUQsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBzbmFwc2hvdC5ieXRlc1RyYW5zZmVycmVkICogMTAwIC8gc25hcHNob3QudG90YWxCeXRlcztcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQubm90aWZ5KHByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkb3dubG9hZFVSTCA9IHVwbG9hZFRhc2suc25hcHNob3QuZG93bmxvYWRVUkw7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZG93bmxvYWRVUkwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBob3RvOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljQWN0aW9uU2hlZXQuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAkdHJhbnNsYXRlKCd0YWtlUGhvdG8nKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJHRyYW5zbGF0ZSgncGhvdG9Gcm9tTGlicmFyeScpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZVRleHQ6ICR0cmFuc2xhdGUoJ2xvYWRJbWFnZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsVGV4dDogJHRyYW5zbGF0ZShcImNhbmNlbFRleHRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnQ0FOQ0VMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpb25pYy5QbGF0Zm9ybS5pc1dlYlZpZXcoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSAkd2luZG93LkNhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5DQU1FUkE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGluZGV4ID09PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSA9ICR3aW5kb3cuQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLlBIT1RPTElCUkFSWTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YWxpdHk6IDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0V2lkdGg6IDMyMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uVHlwZTogJHdpbmRvdy5DYW1lcmEuRGVzdGluYXRpb25UeXBlLkRBVEFfVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVHlwZTogc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kaW5nVHlwZTogJHdpbmRvdy5DYW1lcmEuRW5jb2RpbmdUeXBlLkpQRUcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BvdmVyT3B0aW9uczogJHdpbmRvdy5DYW1lcmFQb3BvdmVyT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUb1Bob3RvQWxidW06IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdE9yaWVudGF0aW9uOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oaW1hZ2VEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGltYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnQlJPV1NFUicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoZmlyZWJhc2UpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnTW9kYWxzJywgTW9kYWxzKTtcblxuXHRNb2RhbHMuJGluamVjdCA9IFsnJGlvbmljTW9kYWwnXTtcblx0ZnVuY3Rpb24gTW9kYWxzKCRpb25pY01vZGFsKSB7XG5cblx0XHR2YXIgbW9kYWxzID0gW107XG5cblx0XHR2YXIgX29wZW5Nb2RhbCA9IGZ1bmN0aW9uICgkc2NvcGUsIHRlbXBsYXRlVXJsLCBhbmltYXRpb24pIHtcblx0XHRcdHJldHVybiAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxhdGVVcmwsIHtcblx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0YW5pbWF0aW9uOiBhbmltYXRpb24gfHwgJ3NsaWRlLWluLXVwJyxcblx0XHRcdFx0YmFja2Ryb3BDbGlja1RvQ2xvc2U6IGZhbHNlXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuXHRcdFx0XHRtb2RhbHMucHVzaChtb2RhbCk7XG5cdFx0XHRcdG1vZGFsLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHR2YXIgX2Nsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY3VycmVudE1vZGFsID0gbW9kYWxzLnNwbGljZSgtMSwgMSlbMF07XG5cdFx0XHRjdXJyZW50TW9kYWwucmVtb3ZlKCk7XG5cdFx0fTtcblxuXHRcdHZhciBfY2xvc2VBbGxNb2RhbHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRtb2RhbHMubWFwKGZ1bmN0aW9uIChtb2RhbCkge1xuXHRcdFx0XHRtb2RhbC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0bW9kYWxzID0gW107XG5cdFx0fTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRvcGVuTW9kYWw6IF9vcGVuTW9kYWwsXG5cdFx0XHRjbG9zZU1vZGFsOiBfY2xvc2VNb2RhbCxcblx0XHRcdGNsb3NlQWxsTW9kYWxzOiBfY2xvc2VBbGxNb2RhbHNcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuZmFjdG9yeSgnTW9kZWwnLCBNb2RlbCk7XG5cblx0TW9kZWwuJGluamVjdCA9IFsnVXNlcnMnLCAnR2VvbG9jYXRpb24nLCAnQXV0aCcsICdOZXR3b3JrJywgJ0FkbW9iJywgJ0F1ZGlvJywgJ0NoYXQnLCAnTG9hZGVyJywgJ01lZGlhJywgJ01vZGFscycsICdTdG9yZSddO1xuXHRmdW5jdGlvbiBNb2RlbChVc2VycywgR2VvbG9jYXRpb24sIEF1dGgsIE5ldHdvcmssIEFkbW9iLCBBdWRpbywgQ2hhdCwgTG9hZGVyLCBNZWRpYSwgTW9kYWxzLCBTdG9yZSkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdFVzZXJzOiBVc2Vycyxcblx0XHRcdEdlb2xvY2F0aW9uOiBHZW9sb2NhdGlvbixcblx0XHRcdEF1dGg6IEF1dGgsXG5cdFx0XHROZXR3b3JrOiBOZXR3b3JrLFxuXHRcdFx0QWRtb2I6IEFkbW9iLFxuXHRcdFx0QXVkaW86IEF1ZGlvLFxuXHRcdFx0Q2hhdDogQ2hhdCxcblx0XHRcdExvYWRlcjogTG9hZGVyLFxuXHRcdFx0TWVkaWE6IE1lZGlhLFxuXHRcdFx0TW9kYWxzOiBNb2RhbHMsXG5cdFx0XHRTdG9yZTogU3RvcmVcblx0XHR9O1xuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ05ldHdvcmsnLCBOZXR3b3JrKTtcblxuICAgIE5ldHdvcmsuJGluamVjdCA9IFsnJHRpbWVvdXQnLCAnJGludGVydmFsJywgJyRjb3Jkb3ZhTmV0d29yaycsICckcSddO1xuICAgIGZ1bmN0aW9uIE5ldHdvcmsoJHRpbWVvdXQsICRpbnRlcnZhbCwgJGNvcmRvdmFOZXR3b3JrLCAkcSkge1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCwgaW50ZXJ2YWxQcm9taXNlLCB0aW1lT3V0UHJvbWlzZTtcblxuICAgICAgICB2YXIgdHJ5VG9Db25uZWN0ID0gZnVuY3Rpb24obWF4VGltZSl7XG4gICAgICAgICAgICBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBtYXhUaW1lID0gbWF4VGltZSB8fCA1MDAwO1xuICAgICAgICAgICAgaWYoaW9uaWMuUGxhdGZvcm0uaXNXZWJWaWV3KCkpe1xuICAgICAgICAgICAgICAgIGludGVydmFsUHJvbWlzZSA9ICRpbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBpZigkY29yZG92YU5ldHdvcmsuaXNPbmxpbmUoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxQcm9taXNlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgnT0snKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIHRpbWVPdXRQcm9taXNlID0gJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsUHJvbWlzZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdUSU1FT1VUJyk7XG4gICAgICAgICAgICAgICAgfSwgbWF4VGltZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoJ09LJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY2FuY2VsUHJvbWlzZSA9IGZ1bmN0aW9uKHByb21pc2UsICRzZXJ2aWNlKXtcbiAgICAgICAgICAgIHByb21pc2UgJiYgJHNlcnZpY2UuY2FuY2VsKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNhbmNlbFByb21pc2VzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNhbmNlbFByb21pc2UoaW50ZXJ2YWxQcm9taXNlLCAkaW50ZXJ2YWwpO1xuICAgICAgICAgICAgY2FuY2VsUHJvbWlzZSh0aW1lT3V0UHJvbWlzZSwgJHRpbWVvdXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzdG9wID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNhbmNlbFByb21pc2VzKCk7XG4gICAgICAgICAgICBkZWZlcnJlZCAmJiBkZWZlcnJlZC5yZWplY3QoJ1NUT1BQRUQnKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cnlUb0Nvbm5lY3Q6IHRyeVRvQ29ubmVjdCxcbiAgICAgICAgICAgIHN0b3A6IHN0b3BcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnQXBwJylcblx0XHQuc2VydmljZSgnJHNxbGl0ZVNlcnZpY2UnLCAkc3FsaXRlU2VydmljZSk7XG5cblx0JHNxbGl0ZVNlcnZpY2UuJGluamVjdCA9IFsnJHEnLCAnJGNvcmRvdmFTUUxpdGUnXTtcblx0ZnVuY3Rpb24gJHNxbGl0ZVNlcnZpY2UoJHEsICRjb3Jkb3ZhU1FMaXRlKSB7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIF9kYjtcblxuXHRcdHNlbGYuZGIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoIV9kYikge1xuXHRcdFx0XHRpZiAod2luZG93LnNxbGl0ZVBsdWdpbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0X2RiID0gd2luZG93LnNxbGl0ZVBsdWdpbi5vcGVuRGF0YWJhc2UoeyBuYW1lOiBcInByZS5kYlwiLCBsb2NhdGlvbjogMiwgY3JlYXRlRnJvbUxvY2F0aW9uOiAxIH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEZvciBkZWJ1Z2dpbmcgaW4gdGhlIGJyb3dzZXJcblx0XHRcdFx0XHRfZGIgPSB3aW5kb3cub3BlbkRhdGFiYXNlKFwicHJlLmRiXCIsIFwiMS4wXCIsIFwiRGF0YWJhc2VcIiwgMjAwMDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIF9kYjtcblx0XHR9O1xuXG5cdFx0c2VsZi5nZXRGaXJzdEl0ZW0gPSBmdW5jdGlvbiAocXVlcnksIHBhcmFtZXRlcnMpIHtcblx0XHRcdHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0XHRzZWxmLmV4ZWN1dGVTcWwocXVlcnksIHBhcmFtZXRlcnMpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXG5cdFx0XHRcdGlmIChyZXMucm93cy5sZW5ndGggPiAwKVxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlcy5yb3dzLml0ZW0oMCkpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlamVjdChcIlRoZXJlIGFyZW4ndCBpdGVtcyBtYXRjaGluZ1wiKTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXHRcdH07XG5cblx0XHRzZWxmLmdldEZpcnN0T3JEZWZhdWx0SXRlbSA9IGZ1bmN0aW9uIChxdWVyeSwgcGFyYW1ldGVycykge1xuXHRcdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblx0XHRcdHNlbGYuZXhlY3V0ZVNxbChxdWVyeSwgcGFyYW1ldGVycykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cblx0XHRcdFx0aWYgKHJlcy5yb3dzLmxlbmd0aCA+IDApXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzLnJvd3MuaXRlbSgwKSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXHRcdH07XG5cblx0XHRzZWxmLmdldEl0ZW1zID0gZnVuY3Rpb24gKHF1ZXJ5LCBwYXJhbWV0ZXJzKSB7XG5cdFx0XHR2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXHRcdFx0c2VsZi5leGVjdXRlU3FsKHF1ZXJ5LCBwYXJhbWV0ZXJzKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0dmFyIGl0ZW1zID0gW107XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLnJvd3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpdGVtcy5wdXNoKHJlcy5yb3dzLml0ZW0oaSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKGl0ZW1zKTtcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXHRcdH07XG5cblx0XHRzZWxmLnByZWxvYWREYXRhQmFzZSA9IGZ1bmN0aW9uIChlbmFibGVMb2cpIHtcblx0XHRcdHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cblx0XHRcdC8vd2luZG93Lm9wZW4oXCJkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCxcIiArIEpTT04uc3RyaW5naWZ5KHsgZGF0YTogd2luZG93LnF1ZXJpZXMuam9pbignJykucmVwbGFjZSgvXFxcXG4vZywgJ1xcbicpIH0pKTtcblx0XHRcdGlmICh3aW5kb3cuc3FsaXRlUGx1Z2luID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly9lbmFibGVMb2cgJiYgY29uc29sZS5sb2coJyVjICoqKioqKioqKioqKioqKioqIFN0YXJ0aW5nIHRoZSBjcmVhdGlvbiBvZiB0aGUgZGF0YWJhc2UgaW4gdGhlIGJyb3dzZXIgKioqKioqKioqKioqKioqKiogJywgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG5cdFx0XHRcdHNlbGYuZGIoKS50cmFuc2FjdGlvbihmdW5jdGlvbiAodHgpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHdpbmRvdy5xdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgcXVlcnkgPSB3aW5kb3cucXVlcmllc1tpXS5yZXBsYWNlKC9cXFxcbi9nLCAnXFxuJyk7XG5cblx0XHRcdFx0XHRcdC8vZW5hYmxlTG9nICYmIGNvbnNvbGUubG9nKHdpbmRvdy5xdWVyaWVzW2ldKTtcblx0XHRcdFx0XHRcdHR4LmV4ZWN1dGVTcWwocXVlcnkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcblx0XHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vZW5hYmxlTG9nICYmIGNvbnNvbGUubG9nKCclYyAqKioqKioqKioqKioqKioqKiBDb21wbGV0aW5nIHRoZSBjcmVhdGlvbiBvZiB0aGUgZGF0YWJhc2UgaW4gdGhlIGJyb3dzZXIgKioqKioqKioqKioqKioqKiogJywgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShcIk9LXCIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKFwiT0tcIik7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXHRcdH07XG5cblx0XHRzZWxmLmV4ZWN1dGVTcWwgPSBmdW5jdGlvbiAocXVlcnksIHBhcmFtZXRlcnMpIHtcblx0XHRcdHJldHVybiAkY29yZG92YVNRTGl0ZS5leGVjdXRlKHNlbGYuZGIoKSwgcXVlcnksIHBhcmFtZXRlcnMpO1xuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnU3RvcmUnLCBTdG9yZSk7XHJcblxyXG5cdFN0b3JlLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnJHJvb3RTY29wZSddO1xyXG5cdGZ1bmN0aW9uIFN0b3JlKCR3aW5kb3csICRyb290U2NvcGUpIHtcclxuXHJcbiAgICAgICAgdmFyIHN0b3JlID0gJHdpbmRvdy5zdG9yZTtcclxuXHJcbiAgICAgICAgdmFyIGdldEluZm8gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IHN0b3JlLmdldCgnY28ubmljaG9sbHMucG9rZWRleGdvLnJlbW92ZWFkcycpO1xyXG5cclxuICAgICAgICAgICAgJHJvb3RTY29wZS5zaG93QWRzID0gIXByb2R1Y3Qub3duZWQ7XHJcbiAgICAgICAgICAgIGlmKHByb2R1Y3Qub3duZWQpe1xyXG4gICAgICAgICAgICAgICAgc3RvcmUub2ZmKGdldEluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3RvcmUgPSAkd2luZG93LnN0b3JlO1xyXG4gICAgICAgICAgICAgICAgaWYoc3RvcmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLnZlcmJvc2l0eSA9IHN0b3JlLklORk87XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVnaXN0ZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogICAgJ2NvLm5pY2hvbGxzLnBva2VkZXhnby5yZW1vdmVhZHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlhczogJ1JlbW92ZSBBZHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAgIHN0b3JlLk5PTl9DT05TVU1BQkxFXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldEluZm8oKTsgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUud2hlbihcIlJlbW92ZSBBZHNcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmxvYWRlZChmdW5jdGlvbihwcm9kdWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwibG9hZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlZChnZXRJbmZvKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwcm92ZWQoZnVuY3Rpb24gKHByb2R1Y3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9nKCdZb3UganVzdCB1bmxvY2tlZCB0aGUgRlVMTCBWRVJTSU9OIScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zaG93QWRzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcImFwcHJvdmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdC5maW5pc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm93bmVkKGZ1bmN0aW9uKHByb2R1Y3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHJvZHVjdC5maW5pc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwib3duZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZWZ1bmRlZChmdW5jdGlvbihwcm9kdWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcInJlZnVuZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24ocHJvZHVjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcImVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2FuY2VsbGVkKGZ1bmN0aW9uKHByb2R1Y3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJjYW5jZWxsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuc2hvd0FkcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJ1eTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmKCRyb290U2NvcGUuc2hvd0Fkcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUub3JkZXIoJ1JlbW92ZSBBZHMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cdFx0fTtcclxuXHR9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdBcHAnKVxuXHRcdC5mYWN0b3J5KCdVc2VycycsIFVzZXJzKTtcblxuXHRVc2Vycy4kaW5qZWN0ID0gWyckcScsICckc3FsaXRlU2VydmljZSddO1xuXHRmdW5jdGlvbiBVc2VycygkcSwgJHNxbGl0ZVNlcnZpY2UpIHtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHF1ZXJ5ID0gXCJTZWxlY3QgKiBGUk9NIFVzZXJzXCI7XG5cdFx0XHRcdHJldHVybiAkcS53aGVuKCRzcWxpdGVTZXJ2aWNlLmdldEl0ZW1zKHF1ZXJ5KSk7XG5cdFx0XHR9LFxuXHRcdFx0YWRkOiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0XHR2YXIgcXVlcnkgPSBcIklOU0VSVCBJTlRPIFVzZXJzIChOYW1lKSBWQUxVRVMgKD8pXCI7XG5cdFx0XHRcdHJldHVybiAkcS53aGVuKCRzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVTcWwocXVlcnksIFt1c2VyLk5hbWVdKSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ0FwcCcpXG5cdFx0LmZhY3RvcnkoJ1V0aWxpdGllcycsIFV0aWxpdGllcyk7XG5cblx0Ly9VdGlsaXRpZXMuJGluamVjdCA9IFtdO1xuXHRmdW5jdGlvbiBVdGlsaXRpZXMoKSB7XG5cblx0XHRyZXR1cm4ge1xuICAgICAgICAgICAgYjY0dG9CbG9iOiBmdW5jdGlvbihiNjREYXRhLCBjb250ZW50VHlwZSwgc2xpY2VTaXplKXtcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlIHx8ICdpbWFnZS9wbmcnO1xuICAgICAgICAgICAgICAgIHNsaWNlU2l6ZSA9IHNsaWNlU2l6ZSB8fCA1MTI7XG5cbiAgICAgICAgICAgICAgICB2YXIgYnl0ZUNoYXJhY3RlcnMgPSBhdG9iKGI2NERhdGEpO1xuICAgICAgICAgICAgICAgIHZhciBieXRlQXJyYXlzID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBieXRlQ2hhcmFjdGVycy5sZW5ndGg7IG9mZnNldCArPSBzbGljZVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNsaWNlID0gYnl0ZUNoYXJhY3RlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzbGljZVNpemUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGJ5dGVBcnJheXMucHVzaChieXRlQXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoYnl0ZUFycmF5cywge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YVVSTHRvQmxvYjogZnVuY3Rpb24oZGF0YVVSTCwgY29udGVudFR5cGUpe1xuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgJ2ltYWdlL3BuZyc7XG4gICAgICAgICAgICAgICAgLy8gRGVjb2RlIHRoZSBkYXRhVVJMICAgXG4gICAgICAgICAgICAgICAgdmFyIGJpbmFyeSA9IGF0b2IoZGF0YVVSTC5zcGxpdCgnLCcpWzFdKTtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgOC1iaXQgdW5zaWduZWQgYXJyYXlcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJpbmFyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIG91ciBCbG9iIG9iamVjdFxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmxvYihbbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXSwgeyB0eXBlOiBjb250ZW50VHlwZSB9KTtcbiAgICAgICAgICAgIH1cblx0XHR9O1xuXHR9XG59KSgpOyJdfQ==
