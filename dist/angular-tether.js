/*! angular-tether - v0.1.0 - 2014-03-27 */(function (root, factory) {if (typeof define === "function" && define.amd) {define(["tether"], factory);} else if (typeof exports === "object") {module.exports = factory(require("tether"));} else {root.test = factory(root.jQuery, root.jade, root._)};}(this, function(Tether) {angular.module('ngTetherPopover', ['ngTether']).directive('tetherPopover', [
  'Tether',
  function (Tether) {
    return {
      scope: {
        config: '=?popoverConfig',
        tetherPopover: '=tetherPopover'
      },
      template: '<div ng-transclude></div>',
      transclude: true,
      link: function (scope, elem, attrs) {
        scope.tetherPopover = Tether(angular.extend({
          parentScope: scope,
          tether: {
            target: elem[0],
            attachment: 'middle right',
            targetAttachment: 'middle left',
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
  function (Tether) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=?tetherTooltipConfig'
      },
      link: function (scope, elem, attrs) {
        var tooltip = Tether({
            template: '<div class="tooltip fade-anim">{{ content }}</div>',
            parentScope: scope,
            tether: {
              target: elem[0],
              attachment: 'top center',
              targetAttachment: 'bottom center'
            }
          });
        elem.on('mouseenter', function () {
          scope.$apply(tooltip.enter);
        });
        elem.on('mouseleave', function () {
          scope.$apply(tooltip.leave);
        });
        scope.$on('$destroy', function () {
          _elm.unbind('hover');
          _elm.unbind('mouseleave');
        });
      }
    };
  }
]);
angular.module('ngTether', []).factory('Tether', [
  '$compile',
  '$rootScope',
  '$animate',
  '$controller',
  '$q',
  '$http',
  '$templateCache',
  function ($compile, $rootScope, $animate, $controller, $q, $http, $templateCache) {
    return function (config) {
      'use strict';
      if (+!!config.template + +!!config.templateUrl !== 1) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }
      config.tether = config.tether || {};
      var controller = config.controller || angular.noop, controllerAs = config.controllerAs, parentScope = config.parentScope || $rootScope, extend = angular.extend, target = config.tether.target || document.body, element = null, scope, html, tether;
      // Attach a tether element and the target element.
      function attachTether() {
        tether = new Tether(extend({
          element: element[0],
          target: target
        }, config.tether));
        tether.position();
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
        var ctrl = $controller(controller, { $scope: scope });
        if (controllerAs) {
          scope[controllerAs] = ctrl;
        }
        $compile(element)(scope);
        $animate.enter(element, null, angular.element(target));
        attachTether();
      }
      // Attach tether and add it to the dom
      function enter(locals) {
        html.then(function (html) {
          if (!element) {
            create(html, locals);
          } else {
            $animate.enter(element, null, angular.element(target));
            attachTether();
          }
        });
      }
      // Detach the tether and remove it from the dom
      function leave() {
        if (element) {
          $animate.leave(element, function () {
            element = null;
            scope.$$phase && scope.$destroy() || scope.$apply(function () {
              scope.$destroy();
            });
          });
        }
      }
      function position() {
        if (element) {
          $animate.move(element, null, angular.element(target));
          attachTether();
        }
      }
      // bool. did get element get assigned ? true : false
      function isActive() {
        return !!element;
      }
      return {
        enter: enter,
        leave: leave,
        position: position,
        isActive: isActive,
        config: config.tether
      };
    };
  }
]);}));