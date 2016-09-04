// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('angularApp', ['ionic', 'angularApp.filters', 'angularApp.controllers', 'authService', 'authInterceptorService', 'LocalStorageModule'])

.service('sharedSettings', function () {
    var webapi = 'http://api.10maggio87.it'; /* 'http://api2.10maggio87.it'; */
    var username = 'appuser%4010maggio87.it';
    var password = 'UQAL92anF-U4zvX';
    var currentSeason = '2016-17';
    return {
        getCurrentSeason: function () {
            return currentSeason;
        },
        getUsername: function () {
            return username;
        },
        getPassword: function () {
            return password;
        },
        getWebapi: function () {
            return webapi;
        },
        getHost: function () {
            return webapi.replace('http://', '');
        },
        setWebapi: function (value) {
            webapi = value;
        }
    };
})

.config(function ($compileProvider, $stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

    $httpProvider.interceptors.push('authInterceptorService');

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    // // Use $compileProvider.urlSanitizationWhitelist(...) for Angular 1.2
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\//);

    $ionicConfigProvider.scrolling.jsScrolling(true);

    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: "/search/:type",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html",
                controller: 'SearchCtrl'
            }
        }
    })

    .state('app.team', {
        url: "/team/:name",
        views: {
            'menuContent': {
                templateUrl: "templates/team.html",
                controller: 'TeamCtrl'
            }
        }
    })

    .state('app.competition', {
        url: "/competition/:competition",
        views: {
            'menuContent': {
                templateUrl: "templates/competition.html",
                controller: 'CompetitionCtrl'
            }
        }
    })
    
    .state('app.squad', {
        url: "/squad",
        views: {
            'menuContent': {
                templateUrl: "templates/squad.html",
                controller: 'SquadCtrl'
            }
        }
    })

    .state('app.record', {
        url: "/record/:recordId",
        views: {
            'menuContent': {
                templateUrl: "templates/record.html",
                controller: 'RecordCtrl'
            }
        }
    })

     .state('app.browse', {
         url: "/browse",
         views: {
             'menuContent': {
                 templateUrl: "templates/browse.html"
             }
         }
     })

    .state('app.season', {
        url: "/season/:season",
        views: {
            'menuContent': {
                templateUrl: "templates/season.html",
                controller: 'SeasonCtrl'
            }
        }
    })

    .state('app.player', {
        url: "/player/:playerTag",
        views: {
            'menuContent': {
                templateUrl: "templates/player.html",
                controller: 'PlayerCtrl'
            }
        }
    })

    .state('app.primates', {
        url: "/primates",
        views: {
            'menuContent': {
                templateUrl: "templates/primates.html",
                controller: 'PrimatesCtrl'
            }
        }
    })

    .state('app.seasons', {
        url: "/seasons",
        views: {
            'menuContent': {
                templateUrl: "templates/seasons.html",
                controller: 'SeasonsCtrl'
            }
        }
    })

    .state('app.calendar', {
        url: "/calendar/:season",
        views: {
            'menuContent': {
                templateUrl: "templates/calendar.html",
                controller: 'CalendarCtrl'
            }
        }
    })

    .state('app.match', {
        url: "/match/:matchId",
        views: {
            'menuContent': {
                templateUrl: "templates/match.html",
                controller: 'MatchCtrl'
            }
        }
    })

    .state('app.newsId', {
        url: "/news/id/:newsId",
        views: {
            'menuContent': {
                templateUrl: "templates/news.html",
                controller: 'NewsCtrl'
            }
        }
    })

    .state('app.newsKeyword', {
        url: "/news/keyword/:keyword",
        views: {
            'menuContent': {
                templateUrl: "templates/news-list.html",
                controller: 'NewsListCtrl'
            }
        }
    })

    .state('app.newsLast', {
        url: "/news/last",
        views: {
            'menuContent': {
                templateUrl: "templates/news-cards.html",
                controller: 'NewsListCtrl'
            }
        }
    })

    .state('app.transfers', {
        url: "/transfers",
        views: {
            'menuContent': {
                templateUrl: "templates/transfers.html",
                controller: 'TransfersCtrl'
            }
        }
    })

    .state('app.events', {
        url: "/events",
        views: {
            'menuContent': {
                templateUrl: "templates/events.html",
                controller: 'EventsCtrl'
            }
        }
    })

    .state('app.error', {
        url: "/error/:errorCode",
        views: {
            'menuContent': {
                templateUrl: "templates/error.html",
                controller: 'ErrorCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/app/error/0');
    
})

.run(function ($ionicPlatform, authService, $rootScope) {

    authService.fillAuthData();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        debugger;
    });

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        if (typeof analytics !== "undefined") {
            console.log("Google Analytics Available");
            analytics.startTrackerWithId("UA-83643991-1");
        } else {
            console.log("Google Analytics Unavailable");
        }
    });
});
