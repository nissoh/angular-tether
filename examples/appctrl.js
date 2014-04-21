var app = angular.module('app', ['ng', 'ngAnimate', 'ngTetherTooltip', 'ngTetherPopover']);


app.controller('appCtrl', ['$scope','Tether',function($scope, Tether){


  $scope.MIRROR_ATTACH = [
    'top', 'right', 'bottom', 'left',
    'center', 'middle'
  ];

  $scope.popoverConfig = {
    template: 'popover.html',
    tether: {
      attachment: 'middle right',
      targetAttachment: 'middle left',
      offset: '0 10px',
      targetOffset: '20px 0'
    }
  };

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