(function () {
	'use strict';

	angular
		.module('App')
		.factory('Ionic', Ionic);

	Ionic.$inject = ['$ionicActionSheet', '$ionicScrollDelegate', '$ionicViewSwitcher', '$ionicHistory', '$ionicPopup', '$ionicLoading', '$ionicPopover'];
	function Ionic($ionicActionSheet, $ionicScrollDelegate, $ionicViewSwitcher, $ionicHistory, $ionicPopup, $ionicLoading, $ionicPopover) {

		return {
			$ionicActionSheet: $ionicActionSheet,
            $ionicScrollDelegate: $ionicScrollDelegate,
            $ionicViewSwitcher: $ionicViewSwitcher,
            $ionicHistory: $ionicHistory,
            $ionicPopup: $ionicPopup,
            $ionicLoading: $ionicLoading,
			$ionicPopover: $ionicPopover
		};
	}
})();