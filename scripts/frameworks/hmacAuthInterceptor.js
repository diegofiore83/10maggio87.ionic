(function () {
    'use strict';

    angular.module('hmacAuthInterceptor', ['hmacAuthInterceptorSigner', 'hmacAuthInterceptorUtil'])

    .factory('hmacInterceptor', ['hmacSigner', 'hmacUtil', function (hmacSigner, hmacUtil) {

        var configurations = {
            host: '',
            whitelist: [],
            accessId: '',
            secretKey: '',
            headers: {
                contentType: 'Content-Type',
                contentMD5: 'Content-MD5',
                date: 'Date',
                authorization: 'Authorization'
            }
        };

        var getConfig = function (field, isHeader) {
            isHeader = typeof (isHeader) !== 'undefined' ? isHeader : false;
            var value = isHeader ? configurations.headers[field] : configurations[field];
            return angular.isFunction(value) ? value() : value;
        };

        var setConfig = function (field, value, isHeader) {
            isHeader = typeof (isHeader) !== 'undefined' ? isHeader : false;
            if (isHeader) {
                configurations.headers[field] = value;
            } else {
                configurations[field] = value;
            }
        };

        var request = function (config) {
            var urlHost = hmacUtil.getHost(config.url);
            if (urlHost.search(getConfig('host')) > -1) {

                var isWhitelist = false;
                var whitelistArray = [].concat(getConfig('whitelist'));
                var urlRelativePath = hmacUtil.getRelativePath(config.url);

                for (var i = 0; i < whitelistArray.length; i++) {
                    if (urlRelativePath.search(whitelistArray[i]) > -1) {
                        isWhitelist = true;
                        break;
                    }
                }

                if (!isWhitelist) hmacSigner.sign(config, getConfig('accessId'), getConfig('secretKey'), configurations.headers);
            }
            return config;
        };

        return {
            set host(v) { setConfig('host', v); },
            get host() { return getConfig('host'); },
            set whitelist(v) { setConfig('whitelist', v); },
            get whitelist() { return getConfig('whitelist'); },
            set accessId(v) { setConfig('accessId', v); },
            get accessId() { return getConfig('accessId'); },
            set secretKey(v) { setConfig('secretKey', v); },
            get secretKey() { return getConfig('secretKey'); },
            headers: {
                set contentType(v) { setConfig('contentType', v, true); },
                get contentType() { return getConfig('contentType', true); },
                set contentMD5(v) { setConfig('contentMD5', v, true); },
                get contentMD5() { return getConfig('contentMD5', true); },
                set date(v) { setConfig('date', v, true); },
                get date() { return getConfig('date', true); },
                set authorization(v) { setConfig('authorization', v, true); },
                get authorization() { return getConfig('authorization', true); }
            },
            request: request
        };

    }]);

    angular.module('hmacAuthInterceptorSigner', ['hmacAuthInterceptorUtil'])

    .factory('hmacSigner', ['hmacUtil', function (hmacUtil) {

        var sign = function (request, accessId, secretKey, headersConfig) {
            setCustomHeaders(request, headersConfig);
            setAuthorizationAmx(request, accessId, secretKey, headersConfig);
        };

        var setCustomHeaders = function (request, headersConfig) {
            setHeader(request, headersConfig.contentType, contentType(request));
            setHeader(request, headersConfig.contentMD5, contentMD5(request));
            setHeader(request, headersConfig.date, date(request));
        };

        var setAuthorizationAmx = function (request, accessId, secretKey, headersConfig) {
            var message = canonicalStringAmx(request, accessId);
            var secretSign = signature(message.join(''), secretKey);
            var value = 'amx ' + [
                accessId,
                secretSign,
                message[4], // GUID
                message[3] // TIMESTAMP
            ].join(':');
            setHeader(request, headersConfig.authorization, value);
        };

        var signature = function (message, secretKey) {
            var crypto = CryptoJS.HmacSHA256(message, secretKey);
            return crypto.toString(CryptoJS.enc.Base64);
        };

        var canonicalStringAmx = function (request, accessId) {
            var csa = [
                accessId,
                request.method,
                request.url,
                getRequestTimeStamp(),
                generateGuid(),
                contentMD5(request)
            ];
            return csa;
        };

        var getRequestTimeStamp = function () {
            if (!Date.now) {
                Date.now = function () { return new Date().getTime(); }
            }
            var requestTimeStamp = Math.floor(Date.now() / 1000);
            return requestTimeStamp;
        };

        var generateGuid = function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
            return guid;
        };

        var date = function(request){
          return getHeader(request, 'Date') || new Date().toUTCString();
        };

        var contentType = function(request) {
            return 'application/json'; // getHeader(request, 'Content-Type') || '';
        };

        var contentMD5 = function (request) {
            var content = body(request);
            return getHeader(request, 'Content-MD5') || CryptoJS.MD5(content).toString(CryptoJS.enc.Base64);
        };

        var body = function (request) {
            var data = request.data;
            return angular.isObject(data) ? angular.toJson(data) : data || '';
        };

        var getHeader = function (request, field) {
            return request.headers[field];
        };

        var setHeader = function (request, field, value) {
            request.headers[field] = value;
        };

        return {
            sign: sign
        };

    }]);

    angular.module('hmacAuthInterceptorUtil', []).factory('hmacUtil', function () {

        var createAnchor = function (url) {
            var a = document.createElement("a");
            a.href = url;
            return a;
        };

        var getHost = function (url) {
            return createAnchor(url).host;
        };

        var getRelativePath = function (url) {
            return createAnchor(url).pathname;
        };

        return {
            getHost: getHost,
            getRelativePath: getRelativePath
        };

    });

})();
