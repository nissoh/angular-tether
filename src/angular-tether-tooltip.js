angular.module('ngTether')
  .directive('tetherTooltip', function (Tether) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=?tetherTooltipConfig'
      },
      link: function (scope, elem, attrs) {

        var tooltip = Tether({
          template: '<div class="tooltip">{{ content }}fff</div>',
          target: elem[0],
          attachment: 'top middle',
          targetAttachment: 'bottom middle',
          constraints: [
            {
              to: 'window',
              attachment: 'together'
            }
          ]
        });


        elem.on('mouseenter', function(){
          scope.$apply(tooltip.enter)
        });
        elem.on('mouseleave', function(){
          scope.$apply(tooltip.leave);
        });

        scope.$on('$destroy', function(){
          _elm.unbind('hover');
          _elm.unbind('mouseleave');
        });


      }
    };
  });
