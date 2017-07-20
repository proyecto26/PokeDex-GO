(function() {
    'use strict';

    angular
        .module('App')
        .directive('resizeHeight', resizeHeight);

    resizeHeight.$inject = ['$window', '$timeout'];
    function resizeHeight($window, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var resizeElement = function(){
                    var height = element.parent()[0].offsetHeight;
                    var width = element.parent()[0].offsetWidth;
                    var scalePixels = height;
                    if(scalePixels > width){
                        scalePixels = width;
                    }
                    var scale = scalePixels / attrs.resizeHeight - 0.3;
                    if(scale < 1){
                        scale = 1;
                    }
                    element[0].style[ionic.CSS.TRANSFORM] = 'scale(' + scale + ')';
                };

                angular.element($window).bind('resize', function () {
                    resizeElement();
                });

                $timeout(function(){
                    resizeElement();
                }, 200);
            }
        };
    }
})();