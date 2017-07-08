angular.module('angularApp.filters', ['angularApp.providers'])
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

            // disable UTC doesn't work
            // var dayUTC = new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), day.getUTCHours(), day.getUTCMinutes(), day.getUTCSeconds());
            var dayUTC = day;
            // end disable UTC doesn't work

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
    .filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }])
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
    .filter('groupBy', function ($parse, filterWatcher) {
        return function (collection, property) {
            
            if (collection.length === 0) {
                return collection;
            }

            return filterWatcher.isMemoized('groupBy', arguments) ||
                filterWatcher.memoize('groupBy', arguments, this,
                groupBy(collection, $parse(property)));

            function groupBy(colletion, property) {
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

        }
    });

angular.module('angularApp.providers', [])
  .provider('filterWatcher', function () {

      this.$get = ['$window', '$rootScope', function ($window, $rootScope) {

          /**
           * Cache storing
           * @type {Object}
           */
          var $$cache = {};

          /**
           * Scope listeners container
           * scope.$destroy => remove all cache keys
           * bind to current scope.
           * @type {Object}
           */
          var $$listeners = {};

          /**
           * $timeout without triggering the digest cycle
           * @type {function}
           */
          var $$timeout = $window.setTimeout;

          function isScope(obj) {
              return obj && obj.$evalAsync && obj.$watch;
          }

          function isNull(value) {
              return value === null;
          }

          /**
           * @description
           * get `HashKey` string based on the given arguments.
           * @param fName
           * @param args
           * @returns {string}
           */
          function getHashKey(fName, args) {
              function replacerFactory() {
                  var cache = [];
                  return function (key, val) {
                      if (angular.isObject(val) && !isNull(val)) {
                          if (~cache.indexOf(val)) return '[Circular]';
                          cache.push(val)
                      }
                      if ($window == val) return '$WINDOW';
                      if ($window.document == val) return '$DOCUMENT';
                      if (isScope(val)) return '$SCOPE';
                      return val;
                  }
              }
              return [fName, JSON.stringify(args, replacerFactory())]
                .join('#')
                .replace(/"/g, '');
          }

          /**
           * @description
           * fir on $scope.$destroy,
           * remove cache based scope from `$$cache`,
           * and remove itself from `$$listeners`
           * @param event
           */
          function removeCache(event) {
              var id = event.targetScope.$id;
              angular.forEach($$listeners[id], function (key) {
                  delete $$cache[key];
              });
              delete $$listeners[id];
          }

          /**
           * @description
           * for angular version that greater than v.1.3.0
           * it clear cache when the digest cycle is end.
           */
          function cleanStateless() {
              $$timeout(function () {
                  if (!$rootScope.$$phase)
                      $$cache = {};
              }, 2000);
          }

          /**
           * @description
           * Store hashKeys in $$listeners container
           * on scope.$destroy, remove them all(bind an event).
           * @param scope
           * @param hashKey
           * @returns {*}
           */
          function addListener(scope, hashKey) {
              var id = scope.$id;
              if (angular.isUndefined($$listeners[id])) {
                  scope.$on('$destroy', removeCache);
                  $$listeners[id] = [];
              }
              return $$listeners[id].push(hashKey);
          }

          /**
           * @description
           * return the `cacheKey` or undefined.
           * @param filterName
           * @param args
           * @returns {*}
           */
          function $$isMemoized(filterName, args) {
              var hashKey = getHashKey(filterName, args);
              return $$cache[hashKey];
          }

          /**
           * @description
           * store `result` in `$$cache` container, based on the hashKey.
           * add $destroy listener and return result
           * @param filterName
           * @param args
           * @param scope
           * @param result
           * @returns {*}
           */
          function $$memoize(filterName, args, scope, result) {
              var hashKey = getHashKey(filterName, args);
              //store result in `$$cache` container
              $$cache[hashKey] = result;
              // for angular versions that less than 1.3
              // add to `$destroy` listener, a cleaner callback
              if (isScope(scope)) {
                  addListener(scope, hashKey);
              } else {
                  cleanStateless();
              }
              return result;
          }

          return {
              isMemoized: $$isMemoized,
              memoize: $$memoize
          }
      }];
  });