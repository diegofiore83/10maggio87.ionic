// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('angularApp', ['ionic', 'angularApp.filters', 'angularApp.controllers', 'hmacAuthInterceptor'])

.run(function ($ionicPlatform) {
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
    });
})

.run(['hmacInterceptor', function (hmacInterceptor) {
    console.log('Run Hmac Interceptor');
    // Configure the interceptor
    hmacInterceptor.host = 'api.10maggio87.it'; // 'localhost:3000';
    hmacInterceptor.whitelist = '/authenticate';
    hmacInterceptor.accessId = '4d53bce03ec34c0a911182d4c228ee6c';
    hmacInterceptor.secretKey = 'A93reRTUJHsCuQSHR+L3GxqOJyDmQpCgps102ciuabc=';

    // hmacInterceptor.headers.authorization = 'Authorization';
}])

.config(function ($compileProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('hmacInterceptor');

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    // // Use $compileProvider.urlSanitizationWhitelist(...) for Angular 1.2
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\//);

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
    });

    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/app/calendar/2015-16');
    $urlRouterProvider.otherwise('/app/news/last');
});
