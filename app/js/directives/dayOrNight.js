(function() {
    'use strict';

    angular
        .module('App')
        .directive('dayOrNight', dayOrNight);

    //dayOrNight.$inject = [''];
    function dayOrNight() {
        return {
			restrict: 'A',
			link: function (scope, element) {
                var className = "day";
                if((new Date()).getHours() >= 18){
                    className = "night";
                }
                element.addClass(className);
            }
        };
    }
})();