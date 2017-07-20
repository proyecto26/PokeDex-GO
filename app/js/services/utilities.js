(function () {
	'use strict';

	angular
		.module('App')
		.factory('Utilities', Utilities);

	//Utilities.$inject = [];
	function Utilities() {

		return {
            b64toBlob: function(b64Data, contentType, sliceSize){
                contentType = contentType || 'image/png';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);
                
                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                
                    var byteArray = new Uint8Array(byteNumbers);
                
                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, {type: contentType});
                return blob;
            },
            dataURLtoBlob: function(dataURL, contentType){
                contentType = contentType || 'image/png';
                // Decode the dataURL   
                var binary = atob(dataURL.split(',')[1]);
                // Create 8-bit unsigned array
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                // Return our Blob object
                return new Blob([new Uint8Array(array)], { type: contentType });
            }
		};
	}
})();