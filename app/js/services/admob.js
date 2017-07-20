(function() {
'use strict';

    angular
        .module('App')
        .factory('Admob', Admob);

    Admob.$inject = ['myConfig', '$window', '$rootScope', '$interval'];
    function Admob(myConfig, $window, $rootScope, $interval) {

        var validateAdmob = function(){
            if(!$rootScope.admob){
                var currentDate = new Date();
                var localDate = new Date($window.localStorage["admobDate"] || (new Date()).setDate(currentDate.getDate() - 1));
                if(currentDate > localDate){
                    $rootScope.admob = true;
                }
            }
        };

        $interval(validateAdmob, 10000);
        validateAdmob();

        return {
            prepare : function(){
                $window.AdMob && $window.AdMob.prepareInterstitial({
                    adId: myConfig.adMob.id,
                    isTesting: true, // TODO: remove this line when release
                    autoShow: false
                });
            },
            open: function(){
                var self = this;

                $rootScope.admob = false;
                var currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + 5);
                $window.localStorage["admobDate"] = currentDate;
                $window.AdMob && $window.AdMob.showInterstitial(function(){
                    self.prepare();
                }, function(err){
                    self.prepare();
                });
            }
        };
    }
})();