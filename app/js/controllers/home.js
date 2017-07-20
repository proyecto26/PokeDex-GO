(function(firebase) {
'use strict';

    angular
        .module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Angular', 'Ionic', 'Model'];
    function HomeController($scope, Angular, Ionic, Model) {
        
        $scope.openItem = function(item){
            Angular.$state.go(item.state, { title: item.title, icon: item.icon, color: item.color });
        };
        $scope.currentLanguage = Angular.$translate.use();
        $scope.languages = Angular.$translate.getAvailableLanguageKeys();

        Ionic.$ionicPopover.fromTemplateUrl('templates/modals/changeLanguage.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });

        $scope.changeLanguage = function(lang){
            Angular.$translate.use(lang);
            $scope.currentLanguage = lang;
            window.localStorage.setItem('lang', lang);
            $scope.popover.hide();
        };

        Model.Audio.preload('pikachu');

        $scope.playAudio = function(){
            console.log('play')
            Model.Audio.play('pikachu');
        };

        $scope.initStore = function(){
            Model.Store.buy();
        };
    }
})(firebase);