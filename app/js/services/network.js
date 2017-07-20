(function() {
'use strict';

    angular
        .module('App')
        .factory('Network', Network);

    Network.$inject = ['$timeout', '$interval', '$cordovaNetwork', '$q'];
    function Network($timeout, $interval, $cordovaNetwork, $q) {

        var deferred, intervalPromise, timeOutPromise;

        var tryToConnect = function(maxTime){
            deferred = $q.defer();
            maxTime = maxTime || 5000;
            if(ionic.Platform.isWebView()){
                intervalPromise = $interval(function(){
                    if($cordovaNetwork.isOnline()){
                        cancelPromises();
                        deferred.resolve('OK');
                    }
                }, 1000);
                timeOutPromise = $timeout(function(){
                    cancelPromises();
                    deferred.reject('TIMEOUT');
                }, maxTime);
            }
            else{
                deferred.resolve('OK');
            }
            return deferred.promise;
        };

        var cancelPromise = function(promise, $service){
            promise && $service.cancel(promise);
            promise = null;
        };

        var cancelPromises = function(){
            cancelPromise(intervalPromise, $interval);
            cancelPromise(timeOutPromise, $timeout);
        };

        var stop = function(){
            cancelPromises();
            deferred && deferred.reject('STOPPED');
        };
        
        return {
            tryToConnect: tryToConnect,
            stop: stop
        };
    }
})();