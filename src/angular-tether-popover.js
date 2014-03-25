
angular.module('ngTether')
  .directive('tetherPopover', function (Tether) {
    return {
      scope: {
        content: '@',
        config: '=?popoverConfig',
        sharedLocals: '=sharedLocals'
      },
      template: "<div ng-transclude></div>",
      transclude: true,
      link: function (scope, elem, attrs) {

        scope.sharedLocals = Tether(angular.extend({
          parentScope: scope,
          templateUrl: 'popover.html',
          target: elem[0],
          attachment: 'middle right',
          targetAttachment: 'middle left',
          constraints: [
            {
              to: 'window',
              attachment: 'together'
            }
          ]
        }, scope.config));
        
        scope.$watch('sharedLocals.tether.targetAttachment', function(){
          if (scope.sharedLocals.isActive()) {
            scope.sharedLocals.enter()
          }
        }, true);

        scope.$watch('sharedLocals.tether.attachment', function(){
          if (scope.sharedLocals.isActive()) {
            scope.sharedLocals.enter()
          }
        }, true);


      }
    };
  });
