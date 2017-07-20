(function() {
    'use strict';

    angular
        .module('App')
        .controller('FindPokemonController', FindPokemonController);

    FindPokemonController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory'];

    function FindPokemonController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory) {

        $scope.item = {
            title: $stateParams.title,
            icon: $stateParams.icon,
            color: $stateParams.color
        };

        if (!$scope.item.icon) {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true,
                historyRoot: true
            });
            $state.go('app.home');
        }
        $scope.names = [
            { name: "Ya" },
            { name: "Ya" },
            { name: "Ya" }
        ];
    }
})();
