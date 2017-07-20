(function () {
	'use strict';

	angular
		.module('App')
		.factory('Angular', Angular);

	Angular.$inject = ['$state', '$timeout', '$rootScope', '$filter', '$translate', '$interval'];
	function Angular($state, $timeout, $rootScope, $filter, $translate, $interval) {

		return {
            $state: $state,
			$timeout: $timeout,
            $rootScope: $rootScope,
            $filter: $filter,
			$translate: $translate,
			$interval: $interval
		};
	}
})();