(function() {
'use strict';

    angular
        .module('App')
        .factory('Audio', Audio);

    Audio.$inject = ['$cordovaNativeAudio'];
    function Audio($cordovaNativeAudio) {

        return {
            preload : function(name, ext){
                ionic.Platform.ready(function(){
                    if(window.plugins && window.plugins.NativeAudio){
                        $cordovaNativeAudio.preloadComplex(name, 'audio/' + name + '.' + (ext || 'wav'), 1, 1, 0);
                    }
                });
            },
            play: function(name){
                if(window.plugins && window.plugins.NativeAudio){
                    $cordovaNativeAudio.play(name);
                }
            }
        };
    }
})();