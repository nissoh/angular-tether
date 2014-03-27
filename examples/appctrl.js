var app = angular.module('app', ['ng', 'ngAnimate', 'ngTetherTooltip', 'ngTetherPopover']);


app.controller('appCtrl', ['$scope','Tether',function($scope, Tether){
  
  $scope.sharedLocalsWithCtrlPopover = "this string will be mutated by popover directive";


  $scope.MIRROR_ATTACH = [
    'top', 'right', 'bottom', 'left',
    'center', 'middle'
  ];

  $scope.posX = [
    'left',
    'right',
    'center'
  ];
  $scope.posY = [
    'top',
    'bottom',
    'middle'
  ];


//  $scope.tetherConfig = {
//    attachment: 'bottom center',
//    targetAttachment: 'top center',
//    constraints: [
//      {
//        to: 'window',
//        attachment: 'together'
//      }
//    ]
//  };

}]);