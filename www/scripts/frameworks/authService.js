(function () {
    'use strict';
    angular.module('authService', ['LocalStorageModule'])
        .factory('authService', ['$http', '$q', '$location', 'localStorageService', 'sharedSettings', '$state', function ($http, $q, $location, localStorageService, sharedSettings, $state) {

        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: ""
        };

        var _login = function () {

            var data = "grant_type=password&userName=" + sharedSettings.getUsername() + "&password=" + sharedSettings.getPassword();

            var deferred = $q.defer();

            $http.post(sharedSettings.getWebapi() + '/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                response.loginDate = Math.round(new Date().getTime() / 1000);
                localStorageService.set('authorizationData', response);

                _authentication.isAuth = true;
                _authentication.userName = sharedSettings.getUsername();

                deferred.resolve(response);

            }).error(function (err, status) {
                localStorageService.set('errorData', err);
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');
            var currentDate = Math.round(new Date().getTime() / 1000);
            if (authData) {
                if (currentDate < authData.loginDate + authData.expires_in) {
                    _authentication.isAuth = true;
                    _authentication.userName = authData.userName;
                } else {
                    localStorageService.remove('authorizationData');
                    _login();
                }
            } else {
                _login();
            }
        }

        authServiceFactory.login = _login;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }]);
})();