(function() {
    'use strict';

    angular
        .module('App')
        .controller('TeamsController', TeamsController);

    TeamsController.$inject = ['$scope', '$stateParams'];

    function TeamsController($scope, $stateParams) {
        
        $scope.item = {
            title: $stateParams.title || 'teams',
            icon: $stateParams.icon || 'ion-android-globe'
        };
    }
})();