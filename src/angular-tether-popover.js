
angular.module('ngTetherPopover', ['ngTether'])
  .directive('tetherPopover', function (Tether) {
    return {
      scope: {
        config: '=?popoverConfig',
        tetherPopover: '=tetherPopover'
      },
      template: "<div ng-transclude></div>",
      transclude: true,
      link: function (scope, elem, attrs) {

        scope.tetherPopover = Tether(angular.extend({
          parentScope: scope,
          tether : {
            target: elem[0],
            attachment: 'middle right',
            targetAttachment: 'middle left',
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
