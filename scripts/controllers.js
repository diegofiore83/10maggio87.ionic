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

.controller('CalendarCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.season = $stateParams.season;
    $scope.matches = [];

    // Setup the loader
    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get('http://api.10maggio87.it/api/matches/season/' + $scope.season).then(function (resp) {
        $scope.matches = resp.data;
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
})

.controller('MatchCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.matchId = $stateParams.matchId;
    $scope.hasDetails = true;
    $scope.hasMatchHistory = false;
    $scope.matchHistory = [];

    $scope.getMatch = function (hasDetails) {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $scope.hasDetails = hasDetails;
        $http.get('http://api.10maggio87.it/api/match/' + $scope.matchId + '/' + hasDetails).then(function (resp) {
            $scope.match = resp.data;
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
    };

    $scope.getMatchHistory = function () {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get('http://api.10maggio87.it/api/matches/previous/' + $scope.match.Profile.Opponent + '/').then(function (resp) {
            $scope.matchHistory = resp.data;
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
            $scope.hasMatchHistory = true;
        });
    };

    $scope.displayScoreboard = function (player) {
        var display = "";
        if (player.YellowCard)
            display = display + "<img src='http://www.10maggio87.it/Images/Layout/Tabellino/yellow.png' class='icon' />";
        if (player.RedCard)
            display = display + "<img src='http://www.10maggio87.it/Images/Layout/Tabellino/red.png' class='icon' />";
        for (var i = 0; i < player.GoalsConceded; i++)
            display = display + "<img src='http://www.10maggio87.it/Images/Layout/Tabellino/in-goal.png' class='icon' />";
        for (i = 0; i < player.OwnGoals; i++)
            display = display + "<img src='http://www.10maggio87.it/Images/Layout/Tabellino/own-goal.png' class='icon' />";
        for (i = 0; i < player.Goals; i++)
            display = display + "<img src='http://www.10maggio87.it/Images/Layout/Tabellino/score-goal.png' class='icon' />";
        for (i = 0; i < player.Assist; i++)
            display = display + "<img src='http://www.10maggio87.it/Images/Layout/Tabellino/assist-goal.png' class='icon'/>";
        return display;
    };

    $scope.displayVote = function (player) {
        if (player.Corriere == null || player.Gazzetta == null) {
            if (player.Corriere == null && player.Gazzetta == null)
                return 'sv';
            else if (player.Corriere == null)
                return player.Gazzetta;
            else {
                return player.Corriere;
            }
        }
        return (player.Corriere + player.Gazzetta) / 2;
    };

    $scope.isSub = function (player) {
        for (var i in $scope.match.Scoreboard) {
            var playerIt = $scope.match.Scoreboard[i];
            if (player.PlayerId == playerIt.SubId) {
                return true;
            }
        };
        return false;
    };

    $scope.isThe = function (player, status) {
        for (var i in $scope.match.Scoreboard) {
            var playerIt = $scope.match.Scoreboard[i];
            if (player.PlayerId == playerIt.PlayerId && playerIt.Status == status) {
                return true;
            }
        };
        return false;
    };

    $scope.getMatch(true);

})

.controller('NewsCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.id = $stateParams.newsId;
    $scope.news = {};

    // Setup the loader
    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get('http://api.10maggio87.it/api/news/id/' + $scope.id).then(function (resp) {
    // $http.get('http://api.10maggio87.it/api/news/last/1').then(function (resp) {
        // $scope.news = resp.data;
        $scope.news = resp.data;
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
})

.controller('NewsListCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.keyword = $stateParams.keyword;
    $scope.news = [];

    var url = 'http://api.10maggio87.it/api/news/last/';
    if (typeof $stateParams.keyword == "string") {
        url = 'http://api.10maggio87.it/api/news/keyword/' + $scope.keyword + '/';
    }
    $scope.newsLoaded = 10;

    $scope.getNextMatch = function () {
        $scope.match = {};
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get('http://api.10maggio87.it/api/matches/next').then(function (resp) {
            $scope.match = resp.data;
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
            $scope.getNews($scope.newsLoaded);
        });
    };

    $scope.getNews = function(news) {
        $scope.newsLoaded = news;
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(url + $scope.newsLoaded).then(function (resp) {
            $scope.newsList = resp.data;
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
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.getNextMatch();
    
})

.controller('PlayerCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.playerTag = $stateParams.playerTag;
    $scope.hasDetails = false;
    $scope.currentCompetition = [0, 0, 0, 0, 0];

    $scope.selectCompetition = function (seasonIndex, competitionIndex) {
        $scope.currentCompetition[seasonIndex] = competitionIndex;
    };

    $scope.getPlayer = function (hasDetails) {

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $scope.hasDetails = hasDetails;

        $http.get('http://api.10maggio87.it/api/player/' + $stateParams.playerTag + '/' + hasDetails).then(function (resp) {
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
    };

    $scope.getPlayer(false);
})

.controller('RecordCtrl', function($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.recordId = $stateParams.recordId;
    $scope.showTotal = 'Total';
    $scope.recordLoaded = 25;
    $scope.players = [];

    $scope.getRecords = function(records, order) {
        $scope.showTotal = order;
        $scope.recordLoaded = records;

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get('http://api.10maggio87.it/api/record/story/' + $stateParams.recordId + '/' + $scope.recordLoaded + '/' + $scope.showTotal).then(function(resp) {
            $scope.players = resp.data;
        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Loading Error',
                template: 'Check your connection'
            });
            alertPopup.then(function(res) {
                console.log(err);
            });
        }).finally(function() {
            $ionicLoading.hide();
        });
    };

    $scope.getRecords($scope.recordLoaded, $scope.showTotal);

    $scope.getDigits = function () {
        if ($scope.recordId == 23)
            return 3;
        return 0;
    };

})

.controller('SearchCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.type = $stateParams.type;
    $scope.results = [];
    $scope.filters = {};
    $scope.recordSearch = function () {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        if ($scope.filters.text != '') {
            $http.get('http://api.10maggio87.it/api/' + $scope.type + '/search/' + $scope.filters.text + '/25').then(function (resp) {
                $scope.results = resp.data;
            }, function(err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Loading Error',
                    template: 'Check your connection'
                });
                alertPopup.then(function(res) {
                    console.log(err);
                });
            }).finally(function() {
                $ionicLoading.hide();
            });
        } else {
            $scope.results = [];
            $ionicLoading.hide();
        }
    }
})

.controller('SeasonCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.season = $stateParams.season;
    $scope.players = [];
    $scope.tab = 'players';

    $scope.getTeamPlayers = function () {
        $scope.tab = 'players';
        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get('http://api.10maggio87.it/api/players/team/' + $scope.season).then(function(resp) {
            $scope.players = resp.data;
        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Loading Error',
                template: 'Check your connection'
            });
            alertPopup.then(function(res) {
                console.log(err);
            });
        }).finally(function() {
            $ionicLoading.hide();
        });
    }

    $scope.getTeamInfo = function () {
        $scope.tab = 'info';
        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get('http://api.10maggio87.it/api/season/' + $scope.season).then(function (resp) {
            $scope.info = resp.data;
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
    };

    $scope.getTeamCalendar = function () {
        $scope.tab = 'calendar';
        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get('http://api.10maggio87.it/api/matches/season/' + $scope.season).then(function (resp) {
            $scope.matches = resp.data;
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
    };

    $scope.getTeamFormation = function () {
        $scope.tab = 'formation';
    };

    $scope.getTeamPlayers();

})

.controller('SeasonsCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.seasons = [];

    // Setup the loader
    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get('http://api.10maggio87.it/api/seasons/').then(function (resp) {
        $scope.seasons = resp.data;
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
})

.controller('TeamCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
    $scope.name = $stateParams.name;
    $scope.matchHistory = [];

    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
    $http.get('http://api.10maggio87.it/api/team/' + $scope.name + '/').then(function (resp) {
        $scope.records = resp.data;
        $scope.total = $scope.getTotal();
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
        $scope.getMatchHistory();
    });

    $scope.getMatchHistory = function () {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get('http://api.10maggio87.it/api/matches/previous/' + $scope.name + '/').then(function (resp) {
            $scope.matchHistory = resp.data;
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
    };

    $scope.getTotal = function () {
        var total = { P: 0, W: 0, D: 0, L: 0, GS: 0, GC: 0 };
        for (var i = 0; i < $scope.records.length; i++) {
            var record = $scope.records[i];
            total.P += record.P;
            total.W += record.W;
            total.D += record.D;
            total.L += record.L;
            total.GS += record.GS;
            total.GC += record.GC;
        }
        return total;
    };

});