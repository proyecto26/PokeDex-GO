(function () {
	'use strict';

	angular
		.module('App')
		.factory('Store', Store);

	Store.$inject = ['$window', '$rootScope'];
	function Store($window, $rootScope) {

        var store = $window.store;

        var getInfo = function(){
            var product = store.get('co.nicholls.pokedexgo.removeads');

            $rootScope.showAds = !product.owned;
            if(product.owned){
                store.off(getInfo);
            }
        };

		return {
			initialize: function(){
                store = $window.store;
                if(store){
                    store.verbosity = store.INFO;
                    store.register({
                        id:    'co.nicholls.pokedexgo.removeads',
                        alias: 'Remove Ads',
                        type:   store.NON_CONSUMABLE
                    });
                    
                    store.ready(function() {
                        getInfo();                        
                        store.when("Remove Ads")
                        .loaded(function(product){
                            alert("loaded");
                        })
                        .updated(getInfo)
                        .approved(function (product) {
                            //log('You just unlocked the FULL VERSION!');
                            $rootScope.showAds = false;
                            alert("approved");
                            product.finish();
                        })
                        .owned(function(product) {
                            //product.finish();
                            alert("owned");
                        })
                        .refunded(function(product) {
                            alert("refunded");
                        })
                        .error(function(product){
                            alert("error");
                        })
                        .cancelled(function(product){
                            alert("cancelled");
                        });
                    });

                    store.refresh();
                }
                else{
                    $rootScope.showAds = true;
                }
            },
            buy: function(){
                if($rootScope.showAds){
                    store.order('Remove Ads');
                }
            }
		};
	}
})();