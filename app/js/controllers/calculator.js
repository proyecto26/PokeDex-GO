(function() {
    'use strict';

    angular
        .module('App')
        .controller('CalculatorController', CalculatorController);

    CalculatorController.$inject = ['$scope', '$stateParams', 'Ionic', 'Angular'];

    function CalculatorController($scope, $stateParams, Ionic, Angular) {
        
        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            Ionic.$ionicViewSwitcher.nextDirection('back');
            Ionic.$ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            Angular.$state.go('app.home');
        }

    }
})();