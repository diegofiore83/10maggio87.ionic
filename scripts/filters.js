angular.module('angularApp.filters', [])
    .filter('ageFilter', function () {
        function calculateAge(date) { // birthday is a date
            var birthday = new Date(date);
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        return function (birthdate) {
            return calculateAge(birthdate);
        };
    })
    .filter('position', function () {
        return function (text) {
            switch (text) {
                case 'Por': return "Portiere";
                case 'Dif': return "Difensore";
                case 'Cen': return "Centrocampista";
                case 'Att': return "Attaccante";
                default: return "Undefined";
            }
        };
    });