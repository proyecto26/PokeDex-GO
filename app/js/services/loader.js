(function () {
	'use strict';

	angular
		.module('App')
		.factory('Loader', Loader);

	Loader.$inject = ['$ionicLoading'];
	function Loader($ionicLoading) {

		return {
			show: function($scope){
                $ionicLoading.show({
                    templateUrl: 'templates/modals/loader.html',
                    scope: $scope,
                    hideOnStageChange: true
                });
            },
            hide: function(){
                $ionicLoading.hide();
            }
		};
	}
})();