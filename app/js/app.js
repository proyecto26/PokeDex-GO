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