
angular.module('app', ['ng', 'ngAnimate', 'ngTetherTooltip', 'ngTetherPopover', 'ui.ace'])
    .controller('appCtrl', function($scope, Tether, $templateCache) {

      $scope.aceLoaded = function(_editor) {
        _editor.renderer.setShowGutter(false);
        _editor.renderer.setHighlightGutterLine(false);
        _editor.getSession().setValue($templateCache.get('popoverDemo.html'));
//    _editor.setReadOnly(true);
      };

      $scope.getTemplate = function() {
        return 'popoverDemo.html';
      };

      $scope.aceChanged = function(args) {
        var changed = args[0];
        var _editor = args[1];
        $templateCache.put('popoverDemo.html', _editor.getSession().getValue());

      };

      $scope.editorConfig = {
        showLineNumbers: false,
        mode: 'html',
        onLoad: $scope.aceLoaded,
        onChange: $scope.aceChanged
      };

      $scope.MIRROR_ATTACH = [
        'top', 'right', 'bottom', 'left',
        'center', 'middle'
      ];

      $scope.popoverConfig = {
        template: 'popover.html',
        tether: {
          attachment: 'middle right',
          targetAttachment: 'middle left'
        }
      };

      $scope.posX = [
        'left',
        'right',
        'center'
      ];
      $scope.posY = [
        'top',
        'bottom',
        'middle'
      ];

    })

    .directive('tetherBlock', function(Tether){
      return {
        scope: {
          options : '=',
          tetherOptions: '='
        },
        link: function(scope, elm){
          new Tether({
            templateUrl: 'intro.html',
            tether: angular.extend({
                  target: elm[0],
                  attachment: 'bottom center',
                  targetAttachment: 'middle center',
                  targetModifier: 'visible',
                  constraints: [
                    {
                      to: elm,
                      pin: true
                    }
                  ]
                }, scope.tetherOptions)
          }).enter();
        }
      };
    })

;



