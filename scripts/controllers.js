angular.module('angularApp.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlayersCtrl', function ($scope, $http, $ionicLoading, $ionicPopup) {
    $scope.players = [];

    // Setup the loader
    $ionicLoading.show({ templateUrl:"templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get('http://api.10maggio87.it/api/players/team').then(function (resp) {
        $scope.players = resp.data;
    }, function(err) {
        var alertPopup = $ionicPopup.alert({
            title: 'Loading Error',
            template: 'Check your connection'
        });
        alertPopup.then(function (res) {
            console.log(err);
        });
    }).finally(function () {
        $ionicLoading.hide();
    });
})

.controller('PlayerCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.playerTag = $stateParams.playerTag;

    $ionicLoading.show({ templateUrl:"templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get('http://api.10maggio87.it/api/player/' + $stateParams.playerTag).then(function (resp) {
        $scope.player = resp.data;
    }, function (err) {
        var alertPopup = $ionicPopup.alert({
            title: 'Loading Error',
            template: 'Check your connection'
        });
        alertPopup.then(function (res) {
            console.log(err);
        });
    }).finally(function () {
        $ionicLoading.hide();
    });

    $scope.currentCompetition = [0, 0, 0, 0, 0];

    $scope.selectCompetition = function (seasonIndex, competitionIndex) {
        $scope.currentCompetition[seasonIndex] = competitionIndex;
    };

})

.controller('RecordCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.recordId = $stateParams.recordId;

    $scope.players = [];

    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get('http://api.10maggio87.it/api/record/story/' + $stateParams.recordId).then(function (resp) {
        $scope.players = resp.data;
    }, function (err) {
        var alertPopup = $ionicPopup.alert({
            title: 'Loading Error',
            template: 'Check your connection'
        });
        alertPopup.then(function (res) {
            console.log(err);
        });
    }).finally(function () {
        $ionicLoading.hide();
    });
});