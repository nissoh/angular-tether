(function(){
  angular.module('ngTetherTooltip', ['ngTether'])
      .directive('tetherTooltip', tetherTooltipDirective);

  function tetherTooltipDirective(Tether, TetherUtils) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=config'
      },
      link: function  postLink(scope, elem) {

        var tooltip = new Tether(TetherUtils.extendDeep({
          template: '<div class="tooltip fade-anim">{{ content }}</div>',
          parentScope: scope,
          tether: {
            target: elem[0],
            attachment: 'top center',
            targetAttachment: 'bottom center',
            constraints: [{
              to: 'window',
              attachment: 'together',
              pin: true
            }]
          }
        }, scope.config));

        elem.on('mouseenter', function(){
          tooltip.enter();
        });
        elem.on('mouseleave', function(){
          scope.$apply(tooltip.leave);
        });

      }
    };
  }

}());
