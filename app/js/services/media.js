(function(firebase) {
'use strict';

    angular
        .module('App')
        .factory('Media', Media);

    Media.$inject = ['$q', '$ionicActionSheet', '$window', '$cordovaCamera', '$filter', '$timeout', '$cordovaFile', 'Utilities'];
    function Media($q, $ionicActionSheet, $window, $cordovaCamera, $filter, $timeout, $cordovaFile, Utilities) {
        
        var $translate = $filter('translate');

        return {
            uploadFile: function(imageData, folderName, uniqueFileName){
                var deferred = $q.defer();
                var imageBlob = Utilities.b64toBlob(imageData);
                var storageRef = firebase.storage().ref(folderName);
                var uploadTask = storageRef.child(uniqueFileName + ".jpg").put(imageBlob);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                    var progress = snapshot.bytesTransferred * 100 / snapshot.totalBytes;
                    deferred.notify(progress);
                }, function (error) {
                    deferred.reject(error);
                }, function () {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    deferred.resolve(downloadURL);
                });
                return deferred.promise;
            },
            getPhoto: function(){
                return $q(function(resolve, reject) {
                    $ionicActionSheet.show({
                        buttons: [
                            { text: $translate('takePhoto') },
                            { text: $translate('photoFromLibrary') }
                        ],
                        titleText: $translate('loadImage'),
                        cancelText: $translate("cancelText"),
                        cancel: function() {
                            reject('CANCEL');
                        },
                        buttonClicked: function(index) {
                            if(ionic.Platform.isWebView()){
                                var source = $window.Camera.PictureSourceType.CAMERA;
                                if(index === 1){
                                    source = $window.Camera.PictureSourceType.PHOTOLIBRARY;
                                }
                                $cordovaCamera.getPicture({
                                    quality: 50,
                                    targetWidth: 320,
                                    destinationType: $window.Camera.DestinationType.DATA_URL,
                                    sourceType: source,
                                    allowEdit: false,
                                    encodingType: $window.Camera.EncodingType.JPEG,
                                    popoverOptions: $window.CameraPopoverOptions,
                                    saveToPhotoAlbum: false,
                                    correctOrientation: true
                                }).then(function(imageData) {
                                    resolve(imageData);
                                }).catch(function(err){
                                    reject(err);
                                });
                            }
                            else{
                                reject('BROWSER');
                            }
                            return true;
                        }
                    });
                });
            }
        };
    }
})(firebase);