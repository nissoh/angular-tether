(function(){

  angular.module('ngTetherPopover', ['ngTether'])
      .directive('tetherPopover', tetherPopoverDirective);

  function tetherPopoverDirective(Tether, TetherUtils) {
    return {
      restrict: 'A',
      scope: {
        tetherPopover: '=',
        config: '='
      },
      link: function postLink(scope, elem) {

        scope.tetherPopover = new Tether(TetherUtils.extendDeep({
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

      }
    };
  }

}());
