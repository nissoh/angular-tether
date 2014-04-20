angular.module('ngTetherTooltip', ['ngTether'])
  .directive('tetherTooltip', function (Tether, Utils) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=?tetherTooltipConfig'
      },
      link: function (scope, elem, attrs) {

        var tooltip = Tether(Utils.extendDeep({
          template: '<div class="tooltip fade-anim">{{ content }}</div>',
          parentScope: scope.$parent,
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
          tooltip.leave();
        });

        scope.$on('$destroy', function(){
          elem.unbind('hover');
          elem.unbind('mouseleave');
        });


      }
    };
  });
