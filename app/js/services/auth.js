(function(firebase) {
'use strict';

    angular
        .module('App')
        .factory('Auth', Auth);

    Auth.$inject = ['$q', '$firebaseAuth', 'myConfig', '$rootScope', '$state'];
    function Auth($q, $firebaseAuth, myConfig, $rootScope, $state) {

        $firebaseAuth().$onAuthStateChanged(function (user) {
            $rootScope.user = user;
            if(!user && $state.current && $state.current.auth){
                alert("Change state...");
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            if ('auth' in next) {
                if (!$rootScope.user && $state.current.name) {
                    event.preventDefault();
                    $rootScope.$broadcast(myConfig.authEvents.notAuthorized, {
                        next: next,
                        nextParams: nextParams
                    });
                }
            }
        });

        var scopes = [
            "email",
            "profile",
            "https://www.googleapis.com/auth/plus.me",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/games"
        ];

        var _nativeLogin = function(){
            return $q(function(resolve, reject) {
                window.plugins.googleplus.login(
                    {
                        'scopes': scopes.join(' '),
                        'webClientId': myConfig.googleClientId,
                        'offline': true,
                },
                function (res) {
                    resolve(res);
                },
                function (msg) {
                    reject(msg);
                }
                );
            });
        }
        
        return {
            login : function () {
                if(ionic.Platform.isWebView()){
                    return _nativeLogin().then(function (result) {
                        var credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
                        return firebase.auth().signInWithCredential(credential);
                    });
                }
                else{
                    var provider = new firebase.auth.GoogleAuthProvider();
                    scopes.forEach(function(scope){
                        provider.addScope(scope);
                    });
                    return firebase.auth().signInWithPopup(provider);
                }
            },
            logout: function(){
                return firebase.auth().signOut();
            }
        };
    }
})(firebase);