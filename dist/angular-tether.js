/*! angular-tether - v0.0.1 - 2014-03-23 */angular.module('ngTether').directive('tetherTooltip', [
  'Tether',
  function (Tether) {
    return {
      scope: {
        content: '@tetherTooltip',
        config: '=?tetherTooltipConfig'
      },
      link: function (scope, elem, attrs) {
        var tooltip = Tether({
            controller: [
              '$scope',
              function ($scope) {
                $scope.content = 'wsup boi!';
              }
            ],
            template: '<div class="tooltip">{{ content }}</div>',
            tether: { target: elem[0] }
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
    return function modalFactory(config) {
      'use strict';
      if (+!!config.template + +!!config.templateUrl !== 1) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }
      config.tether = config.tether || {};
      var template = config.template, controller = config.controller || angular.noop, controllerAs = config.controllerAs, extend = angular.extend, target = angular.element(config.tether.target || document.body), element = null, html, tether;
      var defaultConfig = {
          attachment: 'top middle',
          targetAttachment: 'bottom middle',
          constraints: [{
              to: 'window',
              attachment: 'together'
            }]
        };
      extend(defaultConfig, config.tether);
      // Attach a tether element and the target element.
      function attachTether() {
        tether = new Tether(extend({
          element: element[0],
          target: target[0]
        }, defaultConfig));
      }
      if (config.template) {
        var deferred = $q.defer();
        deferred.resolve(config.template);
        html = deferred.promise;
      } else {
        html = $http.get(config.templateUrl, { cache: $templateCache }).then(function (response) {
          return response.data;
        });
      }
      function create(html, locals) {
        element = angular.element(html);
        var scope = $rootScope.$new();
        if (locals) {
          for (var prop in locals) {
            scope[prop] = locals[prop];
          }
        }
        var ctrl = $controller(controller, { $scope: scope });
        if (controllerAs) {
          scope[controllerAs] = ctrl;
        }
        $compile(element)(scope);
        $animate.enter(element, null, target);
        attachTether();
      }
      // Attach tether and add it to the dom
      function enter(locals) {
        html.then(function (html) {
          if (!element) {
            create(html, locals);
          } else {
            $animate.enter(element, null, target);
            attachTether();
          }
        });
      }
      // Detach the tether and remove it from the dom
      function leave() {
        if (element) {
          $animate.leave(element);
        }
      }
      // bool. did get element get assigned ? true : false
      function isActive() {
        return !!element;
      }
      return {
        enter: enter,
        leave: leave,
        isActive: isActive
      };
    };
  }
]);