(function () {
	'use strict';

	angular
		.module('App')
		.factory('Model', Model);

	Model.$inject = ['Geolocation', 'Auth', 'Network', 'Admob', 'Audio', 'Chat', 'Loader', 'Media', 'Modals', 'Store'];
	function Model(Geolocation, Auth, Network, Admob, Audio, Chat, Loader, Media, Modals, Store) {

		return {
			Geolocation: Geolocation,
			Auth: Auth,
			Network: Network,
			Admob: Admob,
			Audio: Audio,
			Chat: Chat,
			Loader: Loader,
			Media: Media,
			Modals: Modals,
			Store: Store
		};
	}
})();