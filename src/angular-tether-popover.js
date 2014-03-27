
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
          templateUrl: 'popover.html',
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
        
        scope.$watch('sharedLocals.config.targetAttachment', function(){
          if (scope.sharedLocals.isActive()) {
            scope.sharedLocals.position()
          }
        }, true);

        scope.$watch('sharedLocals.config.attachment', function(){
          if (scope.sharedLocals.isActive()) {
            scope.sharedLocals.position()
          }
        }, true);


      }
    };
  });
