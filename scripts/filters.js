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
    .filter('dayFilter', ['$filter', function ($filter) {
        function chooseDay(date) {
            var day = new Date(date);
            var dayUTC = new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), day.getUTCHours(), day.getUTCMinutes(), day.getUTCSeconds());
            var timeToEvent = dayUTC.getTime() - Date.now();
            var hoursToEvent = ((timeToEvent / 1000) / 60) / 60;

            if (hoursToEvent > 168) // Più di una settimana
                return $filter('date')(dayUTC, "EEE d MMM yyyy - H:mm");

            if (hoursToEvent > 48) // Più di 2 giorni
                return $filter('date')(dayUTC, "EEEE d 'alle' H:mm");

            if (hoursToEvent > 24) // Domani
                return $filter('date')(dayUTC, "'Domani alle' H:mm");

            if (hoursToEvent > 2) // Oggi
                return $filter('date')(dayUTC, "'Oggi alle' H:mm");

            return $filter('date')(dayUTC, 'dd/MM/yyyy - H:mm');
        }

        return function (eventDate) {
            return chooseDay(eventDate);
        };
    }])
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
                case "24": return "Marcatori per Anno";
                case "25": return "Presenze per Anno";
                default: return "Record";
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
    })
    .filter('makeitbold', function () {

        function replaceAll(txt, find, replace) {
            return txt.replace(new RegExp(find, 'g'), replace);
        }

        return function (text, bolds) {
            for (var i in bolds) {
                var bold = bolds[i];
                text = replaceAll(text, bold, "<strong>" + bold + "</strong>");
            }
            return text;
        }
    })
    .filter('groupBy', function ($parse) {
        return function (collection, property) {
            //if (!isUndefined(collection) || isUndefined(property)) {
            //    return collection;
            //}

            var getter = $parse(property);

            var result = {};
            var prop;

            collection.forEach(function (elm) {
                prop = getter(elm);

                if (!result[prop]) {
                    result[prop] = [];
                }
                result[prop].push(elm);
            });
            return result;
    }
});