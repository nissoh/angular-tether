
angular.module('ngTetherPopover', ['ngTether'])
  .directive('tetherPopover', function (Tether, $parse, Utils) {
    return {
      template: "<div ng-transclude></div>",
      transclude: true,
      link: function (scope, elem, attrs) {

        var config = $parse(attrs.popoverConfig)(scope);

        scope[attrs.tetherPopover] = Tether(Utils.extendDeep({
          parentScope: scope,
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
        }, config));
        
        scope.$watch(attrs.tetherPopover + '.config.targetAttachment', function(){
          if (scope[attrs.tetherPopover].isActive()) {
            scope[attrs.tetherPopover].position()
          }
        }, true);

        scope.$watch(attrs.tetherPopover + '.config.attachment', function(){
          if (scope[attrs.tetherPopover].isActive()) {
            scope[attrs.tetherPopover].position()
          }
        }, true);

        if (config.closeOnBlue) {

        }


      }
    };
  });
