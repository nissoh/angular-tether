
angular.module('ngTetherPopover', ['ngTether'])
  .directive('tetherPopover', function (Tether, $parse, Utils) {
    return {
      restrict: 'A',
      scope: {
        tetherPopover: '='
      },
      link: function (scope, elem, attrs) {

        scope.tetherPopover = Tether(Utils.extendDeep({
          parentScope: scope.$parent,
          tether : {
            target: elem[0],
            attachment: 'top center',
            targetAttachment: 'bottom center',
            constraints: [
              {
                to: 'window',
                attachment: 'together'
              }
            ]
          }
        }, scope.tetherPopover));
        
        scope.$watch('tetherPopover.config.targetAttachment', function(){
          if (scope.tetherPopover.isActive()) {
            scope.tetherPopover.position()
          }
        }, true);

        scope.$watch('tetherPopover.config.attachment', function(){
          if (scope.tetherPopover.isActive()) {
            scope.tetherPopover.position()
          }
        }, true);

//        if (config.closeOnBlue) {
//
//        }


      }
    };
  });
