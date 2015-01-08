(function () {
  angular.module('ngTetherPopover', ['ngTether']).directive('tetherPopover', tetherPopoverDirective);
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
          tether: {
            target: elem[0],
            attachment: 'top center',
            targetAttachment: 'bottom center',
            constraints: [{
                to: 'window',
                attachment: 'together'
              }]
          }
        }, scope.config));
      }
    };
  }
}());
(function () {
  angular.module('ngTetherTooltip', ['ngTether']).directive('tetherTooltip', tetherTooltipDirective);
  function tetherTooltipDirective(Tether, TetherUtils) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=config'
      },
      link: function postLink(scope, elem) {
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
        elem.on('mouseenter', function () {
          tooltip.enter();
        });
        elem.on('mouseleave', function () {
          scope.$apply(tooltip.leave);
        });
      }
    };
  }
}());
(function (Tether, angular) {
  angular.module('ngTether', []).factory('TetherUtils', tetherUtils).factory('Tether', tetherInstanceDirective);
  function tetherUtils() {
    var Utils = {};
    Utils.extendDeep = function deepExtend(target, source) {
      for (var key in source) {
        if (key in target) {
          angular.extend(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };
    return Utils;
  }
  tetherInstanceDirective.$inject = [
    '$compile',
    '$rootScope',
    '$document',
    '$templateCache',
    '$animate',
    '$controller',
    '$q',
    '$http'
  ];
  function tetherInstanceDirective($compile, $rootScope, $document, $templateCache, $animate, $controller, $q, $http) {
    return function (config) {
      'use strict';
      if (!Tether) {
        throw new Error('Tether is required`');
      }
      config.tether = config.tether || {};
      var element = null, scope, tether = this;
      ;
      function templateDeferred() {
        var template;
        if (config.template) {
          template = $templateCache.get(config.template) || config.template;
        } else {
          template = $http.get(config.templateUrl, { cache: $templateCache }).then(function (resp) {
            return resp.data;
          });
        }
        return $q.when(template);
      }
      function create(html, locals) {
        var ctrl, parentScope = config.parentScope || $rootScope;
        ;
        element = angular.element(html.trim());
        tether.tetherInstance = new Tether(angular.extend({ element: element[0] }, config.tether));
        scope = parentScope.$new();
        // assign locals being passed on enter method.
        if (locals) {
          for (var key in locals) {
            if (locals.hasOwnProperty(key)) {
              scope[key] = locals[key];
            }
          }
        }
        if (config.controller) {
          ctrl = $controller(config.controller, { $scope: scope });
        }
        if (config.controllerAs) {
          scope[config.controllerAs] = ctrl;
        }
        $compile(element)(scope);
        tether.active = true;
        scope.$watch(function () {
          tether.tetherInstance.position();
        });
        // prevents document instant click fire. there's no need to run digest cycle.
        setTimeout(function () {
          if (config.leaveOnBlur) {
            $document.on('click touchend', leaveOnBlur);
          }
        }, 0);
        return $animate.enter(element, tether.tetherInstance.target.parentNode, tether.tetherInstance.target);
      }
      function leaveOnBlur(evt) {
        var target = evt.target;
        if (tether.active === false || target === element[0]) {
          return;
        }
        while (target.parentElement !== null) {
          if (target.parentElement === element[0]) {
            return;
          }
          target = target.parentElement;
        }
        scope.$applyAsync(tether.leave);
      }
      // Attach tether and add it to the dom
      tether.enter = function enter(locals) {
        if (!(config.template || config.templateUrl)) {
          throw new Error('Expected one of either `template` or `templateUrl`');
        }
        if (tether.active) {
          tether.leave();
        }
        return templateDeferred().then(function (html) {
          return create(html, locals);
        });
      };
      // Detach the tether and remove it from the dom
      tether.leave = function leave() {
        if (tether.active === false) {
          return $q.when(tether.active);
        }
        if (config.leaveOnBlur) {
          $document.off('click touchend', leaveOnBlur);
        }
        tether.active = false;
        tether.tetherInstance.destroy();
        scope.$destroy();
        return $animate.leave(element);
      };
      // backward compatible method until next major version is released
      tether.isActive = function () {
        return tether.active;
      };
      tether.active = false;
      tether.config = config.tether;
      return tether;
    };
  }
}(Tether, angular));