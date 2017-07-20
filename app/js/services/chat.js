(function(firebase, GeoFire) {
'use strict';

    angular
        .module('App')
        .factory('Chat', Chat);

    Chat.$inject = ['$timeout'];
    function Chat($timeout) {

        var ref;
        var chatRef;
        var messagesRef;
        var geoFire;
        var geoQuery;
        var currentTeamRef;
        var currentPosition;

        return {
            initialize: function(team){
                team = team || "all";
                ref = firebase.database().ref();
                chatRef = ref.child("chat");
                messagesRef = chatRef.child("messages");
                currentTeamRef = messagesRef.child(team);
                geoFire = new GeoFire(chatRef.child("locations").child(team));
            },
            addEmptyMessage: function(){
                var key = currentTeamRef.push().key;
                return {
                    path: currentTeamRef.toString().substring(currentTeamRef.root.toString().length - 1),
                    key: key
                };
            },
            updateMessageAndLocation: function(path, key, message){
                ref.child(path + "/" + key).update(message);
                geoFire.set(key, [currentPosition.coords.latitude, currentPosition.coords.longitude]);
            },
            addMessageAndLocation : function(message){
                var key = currentTeamRef.push(message).key;
                geoFire.set(key, [currentPosition.coords.latitude, currentPosition.coords.longitude]);
            },
            createGeoQuery: function(messages, $scope, position, rad){
                currentPosition = position;
                geoQuery = geoFire.query({
                    center: [position.coords.latitude, position.coords.longitude],
                    radius: rad || 15
                });
                geoQuery.on("key_entered", function(key, location, distance) {
                    currentTeamRef.orderByKey().equalTo(key).once('value').then(function(snapshot) {
                        var data = snapshot.val();
                        if(data){
                            $scope.$apply(function(){
                                messages.push(data[key]);
                            });
                        }
                    });
                });
            },
            updateGeoQuery: function(position){
                geoQuery && geoQuery.updateCriteria({
                    center: [position.coords.latitude, position.coords.longitude]
                });
            },
            destroyGeoQuery: function(){
                geoQuery && geoQuery.cancel();
            }
        };
    }
})(firebase, GeoFire);