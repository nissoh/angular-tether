var app = angular.module('app', ['ng', 'ngAnimate', 'ngTether']);

app.factory('myModal', ['Tether', function (Tether) {
//  return Tether({
//    controller: ['$scope', function($scope){
//      $scope.content = 'wsup boi!';
//    }],
//    template: '<div class="tooltip">{{ content }}</div>'
//  });
}]);

app.controller('appCtrl', ['$scope','myModal',function($scope, myModal){
  $scope.tether =  myModal;
}]);