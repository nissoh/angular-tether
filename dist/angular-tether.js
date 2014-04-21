/*! angular-tether - v0.1.0 - 2014-04-21 */(function (root, factory) {if (typeof define === "function" && define.amd) {define(["tether"], factory);} else if (typeof exports === "object") {module.exports = factory(require("tether"));} else {root.test = factory(root.jQuery, root.jade, root._)};}(this, function(Tether) {angular.module('ngTetherPopover', ['ngTether']).directive('tetherPopover', [
  'Tether',
  '$parse',
  'Utils',
  function (Tether, $parse, Utils) {
    return {
      restrict: 'A',
      scope: { tetherPopover: '=' },
      link: function (scope, elem, attrs) {
        scope.tetherPopover = Tether(Utils.extendDeep({
          parentScope: scope.$parent,
          tether: {
            target: elem[0],
            attachment: 'top center',
            targetAttachment: 'bottom center',
            constraints: [{
                to: 'window',
                attachment: 'together'
              }]
          }
        }, scope.tetherPopover));
        scope.$watch('tetherPopover.config.targetAttachment', function () {
          if (scope.tetherPopover.isActive()) {
            scope.tetherPopover.position();
          }
        }, true);
        scope.$watch('tetherPopover.config.attachment', function () {
          if (scope.tetherPopover.isActive()) {
            scope.tetherPopover.position();
          }
        }, true);  //        if (config.closeOnBlue) {
                   //
                   //        }
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
        config: '=?tetherTooltipConfig'
      },
      link: function (scope, elem, attrs) {
        var tooltip = Tether(Utils.extendDeep({
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
    Utils.extendDeep = function (destination, source) {
      for (var property in source) {
        if (source[property] && source[property].constructor && source[property].constructor === Object) {
          destination[property] = destination[property] || {};
          arguments.callee(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    };
    return Utils;
  }
]).factory('Tether', [
  '$compile',
  '$rootScope',
  '$animate',
  '$controller',
  '$timeout',
  '$q',
  '$http',
  '$templateCache',
  function ($compile, $rootScope, $animate, $controller, $timeout, $q, $http, $templateCache) {
    return function (config) {
      'use strict';
      if (!(!config.template ^ !config.templateUrl)) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }
      config.tether = config.tether || {};
      var controller = config.controller || angular.noop, controllerAs = config.controllerAs, parentScope = config.parentScope || $rootScope, extend = angular.extend, element = null, scope, html, tether;
      var target = config.tether.target = config.tether.target || document.body;
      // Attach a tether element and the target element.
      function attachTether() {
        tether = new Tether(extend({ element: element[0] }, config.tether));
      }
      if (config.template) {
        var deferred = $q.defer();
        deferred.resolve($templateCache.get(config.template) || config.template);
        html = deferred.promise;
      } else {
        html = $http.get(config.templateUrl, { cache: $templateCache }).then(function (response) {
          return response.data;
        });
      }
      function create(html, locals) {
        element = angular.element(html);
        scope = parentScope.$new();
        if (locals) {
          scope.$locals = locals;
        }
        if (config.controller) {
          var ctrl = $controller(controller, { $scope: scope });
        }
        if (controllerAs) {
          scope[controllerAs] = ctrl;
        }
        $compile(element)(scope);
        scope.$on('$destroy', destroy);
        $timeout(function () {
          $animate.enter(element, angular.element(document.body));
          attachTether();
          tether.position();
        });
      }
      // Attach tether and add it to the dom
      function enter(locals) {
        html.then(function (html) {
          create(html, locals);
        });
      }
      // Detach the tether and remove it from the dom
      function leave() {
        if (element) {
          $timeout(function () {
            tether.destroy();
            $animate.leave(element);
          });
        }
      }
      function position() {
        if (element) {
          $animate.move(element, angular.element(document.body));
          attachTether();
        }
      }
      function destroy() {
        element = null;
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
        tether: element,
        config: config.tether
      };
    };
  }
]);}));