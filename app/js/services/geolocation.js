(function() {
'use strict';

    angular
        .module('App')
        .factory('Geolocation', Geolocation);

    Geolocation.$inject = ['$cordovaGeolocation'];
    function Geolocation($cordovaGeolocation) {

        return {
            getLocation : function(options){
                options = options || {maximumAge: 10000, timeout: 5000, enableHighAccuracy: false};
                return $cordovaGeolocation.getCurrentPosition(options);
            }
        };
    }
})();