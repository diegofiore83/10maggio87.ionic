angular.module('angularApp.filters', [])
    .filter('ageFilter', function () {
        function calculateAge(date, season) { // birthday is a date
            var currentSeason = season.split('-')[0];
            var birthday = new Date(date);
            var ageDifMs;
            if (currentSeason == '2015')
                ageDifMs = Date.now() - birthday.getTime();
            else {
                ageDifMs = new Date('December 31, ' + currentSeason + ' 00:00:00') - birthday.getTime();
            }
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        return function (birthdate, season) {
            return calculateAge(birthdate, season);
        };
    })
    .filter('position', function () {
        return function (text) {
            switch (text) {
                case 'Por': return "Portiere";
                case 'Dif': return "Difensore";
                case 'Cen': return "Centrocampista";
                case 'Att': return "Attaccante";
                case 'All': return "Allenatore";
                default: return "Undefined";
            }
        };
    })
    .filter('record', function () {
        return function (id) {

            switch (id) {
                case "13": return "Classifica Marcatori";
                case "14": return "Classifica Presenze";
                case "16": return "Classifica Stagioni";
                case "22": return "Classifica Panchine";
                default : return "Record";
            }
        };
    })
    .filter('toTrusted', function ($sce) {
        return function (value) {
            return $sce.trustAsHtml(value);
        };
    })
    .filter('translate', function () {
        return function (text) {
            switch (text) {
                case 'managers': return "Allenatori";
                case 'players': return "Giocatori";
                case 'teams': return "Squadre";
                default: return "Undefined";
            }
        };
    });