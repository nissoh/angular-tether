angular.module('ngTetherTooltip', ['ngTether'])
  .directive('tetherTooltip', function (Tether) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=?tetherTooltipConfig'
      },
      link: function (scope, elem, attrs) {

        var tooltip = Tether({
          template: '<div class="tooltip fade-anim">{{ content }}</div>',
          parentScope: scope,
          tether : {
            target: elem[0],
            attachment: 'top center',
            targetAttachment: 'bottom center'
          }
        });


        elem.on('mouseenter', function(){
          tooltip.enter();
        });
        elem.on('mouseleave', function(){
          tooltip.leave();
        });

        scope.$on('$destroy', function(){
          _elm.unbind('hover');
          _elm.unbind('mouseleave');
        });


      }
    };
  });
