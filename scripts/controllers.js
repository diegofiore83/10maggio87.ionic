﻿angular.module('angularApp.controllers', [])

.controller('AppCtrl', function () {

})

.controller('ErrorCtrl', function ($scope, $stateParams, authService, $state, $ionicHistory, $ionicLoading, localStorageService) {
    $scope.errorCode = $stateParams.errorCode;

    if ($scope.errorCode == 0 && authService.authentication.isAuth) {
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $state.go('app.newsLast', {}, { relaod: true });
    }

    $scope.login = function () {

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        authService.login().then(function (response) {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $ionicLoading.hide();
            $state.go('app.newsLast', {}, { relaod: true });

        },
         function (err) {
             $ionicLoading.hide();
         });
    };

    var errorData = localStorageService.get('errorData');
    if ($scope.errorCode != 0 && errorData) {
        if (errorData.code)
            $scope.message = errorData.code;
        else
            $scope.message = errorData.statusText;
    }
})

.controller('CalendarCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.season = $stateParams.season;
    $scope.matches = [];

    // Setup the loader
    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get(sharedSettings.getWebapi() + '/api/matches/season/' + $scope.season).then(function (resp) {
        $scope.matches = resp.data;
    }, function (err) {
        console.log('Loading Error - ' + err.status + ': ' + err.statusText);
    }).finally(function () {
        $ionicLoading.hide();
    });
})

.controller('CompetitionCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {

    $scope.season = sharedSettings.getCurrentSeason();
    $scope.competition = $stateParams.competition.replace('-', ' ');

    $scope.newsList = [];
    $scope.ranking = [];
    $scope.fixtures = [];

    $scope.tab = 'news';

    var url = sharedSettings.getWebapi() + '/api/news/tag/' + $scope.competition + '/';

    $scope.newsLoaded = 10;

    $scope.getRanking = function () {

        $scope.tab = 'ranking';

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(sharedSettings.getWebapi() + '/api/ranking/' + $scope.season + '/' + $scope.competition).then(function (resp) {
            $scope.ranking = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getFixtures = function () {

        $scope.tab = 'fixtures';

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(sharedSettings.getWebapi() + '/api/fixtures/' + $scope.season + '/' + $scope.competition).then(function (resp) {
            $scope.fixtures = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getNews = function (news) {

        $scope.tab = 'news';

        $scope.newsLoaded = news;
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(url + $scope.newsLoaded).then(function (resp) {
            $scope.newsList = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getNews($scope.newsLoaded);

})

.controller('EventsCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {

    $scope.eventsList = [];

    var url = sharedSettings.getWebapi() + '/api/events/last/';

    $scope.eventsLoaded = 10;

    $scope.getEvents = function (events) {

        $scope.eventsLoaded = events;
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(url + $scope.eventsLoaded).then(function (resp) {
            $scope.eventsList = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide()
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.getEvents($scope.eventsLoaded);

})

.controller('MatchCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.matchId = $stateParams.matchId;
    $scope.hasDetails = true;
    $scope.hasMatchHistory = false;
    $scope.matchHistory = [];

    $scope.getMatch = function (hasDetails) {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $scope.hasDetails = hasDetails;
        $http.get(sharedSettings.getWebapi() + '/api/match/' + $scope.matchId + '/' + hasDetails).then(function (resp) {
            $scope.match = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getMatchHistory = function () {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(sharedSettings.getWebapi() + '/api/matches/previous/' + $scope.match.Profile.Opponent + '/').then(function (resp) {
            $scope.matchHistory = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
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

.controller('NewsCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.id = $stateParams.newsId;
    $scope.news = {};

    // Setup the loader
    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get(sharedSettings.getWebapi() + '/api/news/id/' + $scope.id).then(function (resp) {
        $scope.news = resp.data;
    }, function (err) {
        console.log('Loading Error - ' + err.status + ': ' + err.statusText);
    }).finally(function () {
        $ionicLoading.hide();
    });
})

.controller('NewsListCtrl', function ($state, $scope, $http, $window, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {

    $scope.keyword = $stateParams.keyword;
    $scope.news = [];
    $scope.event = null;
    $scope.showEvent = false;

    var url = sharedSettings.getWebapi() + '/api/news/last/';
    if (typeof $stateParams.keyword == "string") {
        url = sharedSettings.getWebapi() + '/api/news/keyword/' + $scope.keyword + '/';
    }
    $scope.newsLoaded = 10;

    $scope.getLastMatch = function () {
        $scope.match = {};
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(sharedSettings.getWebapi() + '/api/matches/last').then(function (resp) {
            $scope.match = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
            $scope.getEvent();
        });
    };

    $scope.getEvent = function () {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(sharedSettings.getWebapi() + '/api/events/last/1').then(function (resp) {
            $scope.event = resp.data[0];
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
            $scope.checkDatesNextEvent();
            $scope.getNews($scope.newsLoaded);
        });
    };

    $scope.getNews = function (news) {
        $scope.newsLoaded = news;
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(url + $scope.newsLoaded).then(function (resp) {
            $scope.newsList = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.checkDatesNextEvent = function () {
        var dateMatch = new Date($scope.match.Date);
        var dateEvent = new Date($scope.event.Date);
        var dateNow = new Date();
        var timeDiffMatch = Math.abs(dateMatch.getTime() - dateNow.getTime());
        var timeDiffEvent = Math.abs(dateEvent.getTime() - dateNow.getTime());
        if (timeDiffEvent < timeDiffMatch) {
            $scope.showEvent = true;
        }
    };

    $scope.setVideoDimensions = function () {
        var width = $window.innerWidth - 20;
        $scope.videoWidth = width + 'px';
        $scope.videoHeight = (width * 9 / 16) + 'px';
    };

    $scope.setVideoDimensions();

    // Disable before new season start
    $scope.getLastMatch();
})

.controller('PlayerCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.playerTag = $stateParams.playerTag;
    $scope.hasDetails = false;
    $scope.currentCompetition = [0, 0, 0, 0, 0];
    $scope.currentSeason = sharedSettings.getCurrentSeason();

    $scope.selectCompetition = function (seasonIndex, competitionIndex) {
        $scope.currentCompetition[seasonIndex] = competitionIndex;
    };

    $scope.getPlayer = function (hasDetails) {

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $scope.hasDetails = hasDetails;

        $http.get(sharedSettings.getWebapi() + '/api/player/' + $stateParams.playerTag + '/' + hasDetails).then(function (resp) {
            $scope.player = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getPlayer(false);
})

.controller('PrimatesCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {

    $scope.getPrimates = function () {

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get(sharedSettings.getWebapi() + '/api/primates/').then(function (resp) {
            $scope.primates = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.bolds = ["Serie A", "Serie B", "Serie C1", "casa", "trasferta", "reti", "presenze", "sconfitte", "pareggi", "vittorie", "Sconfitte", "Pareggi", "Vittorie", "Media punti", "Risultati utili", "Risultati negativi", "Coppa Italia", "Supercoppa Italiana", "Europa"];

    $scope.displayPrimacy = function (type, value) {
        if (type.indexOf("Percentuale") > 0) {
            return value + " %";
        }
        return value;
    };

    $scope.getLink = function (type, recordman) {
        if (type == "Giocatore") {
            return "#/app/player/" + recordman.split(' - ')[0];
        }
        return "#/app/season/" + recordman.split(' - ')[0];
    };

    $scope.isRecord = function (primacy) {
        if (primacy.Description.indexOf('minim') > -1) {
            if (primacy.ActualRecord <= primacy.Record) {
                return true;
            }
            return false;
        } else {
            if (primacy.ActualRecord >= primacy.Record) {
                return true;
            }
            return false;
        }
    };

    $scope.getPrimates();
})

.controller('RecordCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.recordId = $stateParams.recordId;
    $scope.showTotal = 'Total';
    $scope.recordLoaded = 25;
    $scope.players = [];

    $scope.getRecords = function (records, order) {
        $scope.showTotal = order;
        $scope.recordLoaded = records;

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get(sharedSettings.getWebapi() + '/api/record/story/' + $stateParams.recordId + '/' + $scope.recordLoaded + '/' + $scope.showTotal + '/').then(function (resp) {
            $scope.players = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.getRecords($scope.recordLoaded, $scope.showTotal);

    $scope.getDigits = function () {
        if ($scope.recordId == 23)
            return 3;
        return 0;
    };

})

.controller('SearchCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.type = $stateParams.type;
    $scope.results = [];
    $scope.filters = {};
    $scope.recordSearch = function () {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        if ($scope.filters.text.length > 2) {
            $http.get(sharedSettings.getWebapi() + '/api/' + $scope.type + '/search/' + $scope.filters.text + '/25/').then(function (resp) {
                $scope.results = resp.data;
            }, function (err) {
                console.log('Loading Error - ' + err.status + ': ' + err.statusText);
            }).finally(function () {
                $ionicLoading.hide();
            });
        } else {
            $scope.results = [];
            $ionicLoading.hide();
        }
    }
})

.controller('SeasonCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.season = $stateParams.season;
    $scope.players = [];
    $scope.tab = 'players';

    $scope.getTeamPlayers = function () {
        $scope.tab = 'players';
        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get(sharedSettings.getWebapi() + '/api/players/team/' + $scope.season).then(function (resp) {
            $scope.players = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    }

    $scope.getTeamInfo = function () {
        $scope.tab = 'info';
        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get(sharedSettings.getWebapi() + '/api/season/' + $scope.season).then(function (resp) {
            $scope.info = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getTeamCalendar = function () {
        $scope.tab = 'calendar';
        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get(sharedSettings.getWebapi() + '/api/matches/season/' + $scope.season).then(function (resp) {
            $scope.matches = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getTeamFormation = function () {
        $scope.tab = 'formation';
        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get(sharedSettings.getWebapi() + '/api/formation/' + $scope.season).then(function (resp) {
            $scope.formation = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getTeamPlayers();

})

.controller('SeasonsCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.seasons = [];

    // Setup the loader
    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

    $http.get(sharedSettings.getWebapi() + '/api/seasons/').then(function (resp) {
        $scope.seasons = resp.data;
    }, function (err) {
        console.log('Loading Error - ' + err.status + ': ' + err.statusText);
    }).finally(function () {
        $ionicLoading.hide();
    });
})

.controller('SquadCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.players = [];
    $scope.season = sharedSettings.getCurrentSeason();

    $scope.getTeamPlayers = function () {

        // Setup the loader
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });

        $http.get(sharedSettings.getWebapi() + '/api/players/squad').then(function (resp) {
            $scope.players = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.sliderOptions = {
        loop: false,
        nextButton: ".slider-button-next",
        prevButton: ".slider-button-prev",
        paginationType: 'fraction',
        lazyLoading: true
    };

    $scope.getTeamPlayers();

})

.controller('TeamCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {
    $scope.name = $stateParams.name;
    $scope.matchHistory = [];

    $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
    $http.get(sharedSettings.getWebapi() + '/api/team/' + $scope.name + '/').then(function (resp) {
        $scope.records = resp.data;
        $scope.total = $scope.getTotal();
    }, function (err) {
        console.log('Loading Error - ' + err.status + ': ' + err.statusText);
    }).finally(function () {
        $ionicLoading.hide();
        $scope.getMatchHistory();
    });

    $scope.getMatchHistory = function () {
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(sharedSettings.getWebapi() + '/api/matches/previous/' + $scope.name + '/').then(function (resp) {
            $scope.matchHistory = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
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

})

.controller('TransfersCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {

    $scope.newsList = [];
    $scope.transfersIn = [];
    $scope.transfersOut = [];
    $scope.tab = 'news';

    var url = sharedSettings.getWebapi() + '/api/news/tag/Calciomercato/';

    $scope.newsLoaded = 10;

    $scope.getTransfers = function () {

        $scope.tab = 'transfers';

        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(sharedSettings.getWebapi() + '/api/events/transfers').then(function (resp) {
            $scope.transfersIn = [];
            $scope.transfersOut = [];
            resp.data.forEach(function (transfer) {
                if (transfer.Payperview) { // Type of Transfers
                    $scope.transfersIn.push(transfer);
                } else {
                    $scope.transfersOut.push(transfer);
                }
            }, this);
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getNews = function (news) {

        $scope.tab = 'news';

        $scope.newsLoaded = news;
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(url + $scope.newsLoaded).then(function (resp) {
            $scope.newsList = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $scope.getNews($scope.newsLoaded);

})

.controller('VideosCtrl', function ($state, $scope, $http, $window, $sce, $stateParams, $ionicLoading, $ionicPopup, sharedSettings) {

    $scope.keyword = $stateParams.keyword;
    $scope.videos = [];

    var url = sharedSettings.getWebapi() + '/api/videos/last/';

    $scope.videosLoaded = 10;

    $scope.getVideos = function (videos) {
        $scope.videosLoaded = videos;
        $ionicLoading.show({ templateUrl: "templates/loading.html", content: 'Loading', animation: 'fade-in', showBackdrop: true, maxWidth: 200, showDelay: 0 });
        $http.get(url + $scope.videosLoaded).then(function (resp) {
            $scope.videosList = resp.data;
        }, function (err) {
            console.log('Loading Error - ' + err.status + ': ' + err.statusText);
        }).finally(function () {
            $ionicLoading.hide();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.setVideoDimensions = function () {
        var width = $window.innerWidth - 22;
        $scope.videoWidth = width + 'px';
        $scope.videoHeight = (width * 9 / 16) + 'px';
    };

    $scope.setVideoDimensions();

    // Disable before new season start
    $scope.getVideos($scope.videosLoaded);
});