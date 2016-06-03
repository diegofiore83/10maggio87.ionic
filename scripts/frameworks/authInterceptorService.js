(function () {
    'use strict';
    angular.module('authInterceptorService', ['LocalStorageModule'])
        .factory('authInterceptorService', ['$q', '$location', 'localStorageService', function ($q, $location, localStorageService) {

            var authInterceptorServiceFactory = {};

            var _request = function (config) {

                config.headers = config.headers || {};

                var authData = localStorageService.get('authorizationData');
                if (authData && config.url.indexOf('api') > -1) {
                    config.headers.Authorization = 'Bearer ' + authData.access_token;
                }

                return config;
            }

            var _responseError = function (rejection) {
                localStorageService.set('errorData', rejection);
                localStorageService.remove('authorizationData');
                $location.path('/app/error/' + rejection.status);
                return $q.reject(rejection);
            }

            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.responseError = _responseError;

            return authInterceptorServiceFactory;
        }]);
})();