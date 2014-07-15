
angular.module('ngTetherPopover', ['ngTether'])
  .directive('tetherPopover', function (Tether, $parse, Utils) {
    return {
      restrict: 'A',
      scope: {
        tetherPopover: '=',
        config: '='
      },
      link: function postLink(scope, elem, attrs) {

        scope.tetherPopover = new Tether(Utils.extendDeep({
          parentScope: scope.$parent,
          leaveOnBlur: true,
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
        }, scope.config));
        
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


      }
    };
  });
