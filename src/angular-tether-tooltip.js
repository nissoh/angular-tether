angular.module('ngTether')
  .directive('tetherTooltip', function (Tether) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=?tetherTooltipConfig'
      },
      link: function (scope, elem, attrs) {

        var tooltip = Tether({
          controller: ['$scope', function($scope){
            $scope.content = 'wsup boi!';
          }],
          template: '<div class="tooltip">{{ content }}</div>',
          tether: {
            target: elem[0]
          }
        });


        elem.on('mouseenter', function(){
          scope.$apply(tooltip.enter);
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
