/*! angular-tether - v0.1.5 - 2014-07-15 */(function (root, factory) {if (typeof define === "function" && define.amd) {define(["tether"], factory);} else if (typeof exports === "object") {module.exports = factory(require("tether"));} else {root.test = factory(root.Tether)};}(this, function(Tether) { angular.module('ngTetherPopover', ['ngTether']).directive('tetherPopover', [
  'Tether',
  '$parse',
  'Utils',
  function (Tether, $parse, Utils) {
    return {
      restrict: 'A',
      scope: {
        tetherPopover: '=',
        config: '='
      },
      link: function postLink(scope, elem, attrs) {
        scope.tetherPopover = new Tether(Utils.extendDeep({
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
        scope.$watch('tetherPopover.config.targetAttachment', function () {
          if (scope.tetherPopover.isActive()) {
            scope.tetherPopover.position();
          }
        }, true);
        scope.$watch('tetherPopover.config.attachment', function () {
          if (scope.tetherPopover.isActive()) {
            scope.tetherPopover.position();
          }
        }, true);
      }
    };
  }
]);
angular.module('ngTetherTooltip', ['ngTether']).directive('tetherTooltip', [
  'Tether',
  'Utils',
  function (Tether, Utils) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=config'
      },
      link: function postLink(scope, elem, attrs) {
        var tooltip = new Tether(Utils.extendDeep({
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
          tooltip.leave();
        });
        scope.$on('$destroy', function () {
          elem.unbind('hover');
          elem.unbind('mouseleave');
        });
      }
    };
  }
]);
angular.module('ngTether', []).factory('Utils', [
  '$compile',
  function ($compile) {
    var Utils = {};
    Utils.extendDeep = function deepExtend(target, source) {
      for (var prop in source)
        if (prop in target)
          angular.extend(target[prop], source[prop]);
        else
          target[prop] = source[prop];
      return target;
    };
    return Utils;
  }
]).factory('Tether', [
  '$compile',
  '$rootScope',
  '$log',
  '$window',
  '$animate',
  '$controller',
  '$timeout',
  '$q',
  '$http',
  '$templateCache',
  function ($compile, $rootScope, $log, $window, $animate, $controller, $timeout, $q, $http, $templateCache) {
    return function (config) {
      'use strict';
      if (!(!config.template ^ !config.templateUrl)) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }
      config.tether = config.tether || {};
      var controller = config.controller || angular.noop, controllerAs = config.controllerAs, parentScope = config.parentScope || $rootScope, extend = angular.extend, element = null, scope, html, tether, bodyEl = angular.element($window.document.body);
      // Attach a tether element and the target element.
      function attachTether() {
        tether = new Tether(extend({ element: element[0] }, config.tether));
      }
      function templateDfd() {
        var template = config.template ? $templateCache.get(config.template) || config.template : $http.get(config.templateUrl, { cache: $templateCache }).then(function (resp) {
            return resp.data;
          });
        return $q.when(template);
      }
      function create(html, locals) {
        element = angular.element(html.trim());
        scope = parentScope.$new();
        // assign locals being passed on enter method.
        if (locals) {
          for (var prop in locals) {
            scope[prop] = locals[prop];
          }
        }
        if (config.controller) {
          var ctrl = $controller(controller, { $scope: scope });
        }
        if (controllerAs) {
          scope[controllerAs] = ctrl;
        }
        $compile(element)(scope);
        scope.$on('$destroy', destroy);
        // Hack. html is being compiled asynchronously the dimensions of the element
        // would most likley have a different dimensions after compilation
        $timeout(function () {
          if (!element)
            return;
          $animate.enter(element, bodyEl);
          attachTether();
          tether.position();
          if (config.leaveOnBlur) {
            bodyEl.on('click touchend', leaveOnBlur);
          }
        }, 15);
      }
      function leaveOnBlur(evt) {
        var target = evt.target;
        if (!element || target === element[0]) {
          return;
        }
        while (target.parentElement !== null) {
          if (target.parentElement == element[0]) {
            return;
          }
          target = target.parentElement;
        }
        return leave();
      }
      // Attach tether and add it to the dom
      function enter(locals) {
        if (element) {
          return $log.debug('Tethered instance is already active; now toggling');
        }
        templateDfd().then(function (html) {
          create(html, locals);
        });
      }
      // Detach the tether and remove it from the dom
      function leave() {
        if (config.leaveOnBlur) {
          bodyEl.off('click touchend', leaveOnBlur);
        }
        if (!isActive()) {
          if (element) {
            element = null;
          }
          return false;
        }
        tether.destroy();
        $timeout(function () {
          element && $animate.leave(element, function () {
            destroy();
          });
        });
      }
      function destroy() {
        if (!element) {
          return;
        }
        element.remove();
        element = null;
      }
      function position() {
        if (element) {
          $animate.move(element, bodyEl);
          attachTether();
        }
      }
      // bool. is tethered instance got destroyed
      function isActive() {
        return tether && tether.enabled;
      }
      return {
        enter: enter,
        leave: leave,
        position: position,
        isActive: isActive,
        tether: html,
        config: config.tether
      };
    };
  }
]);}));