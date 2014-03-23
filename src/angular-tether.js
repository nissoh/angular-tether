angular.module('ngTether', [])
  .factory('Tether', function ($compile, $rootScope, $animate, $controller, $q, $http, $templateCache) {
    return function (config) {
      'use strict';

      if ((+!!config.template) + (+!!config.templateUrl) !== 1) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }

      config.tether = config.tether || {};

      var template    = config.template,
        controller    = config.controller || angular.noop,
        controllerAs  = config.controllerAs,
        extend        = angular.extend,
        target        = angular.element(config.tether.target || document.body),
        element       = null,
        html, tether;


      var defaultConfig = {
        attachment: 'top middle',
        targetAttachment: 'bottom middle',
        constraints: [
          {
            to: 'window',
            attachment: 'together'
          }
        ]
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
        html = $http.get(config.templateUrl, {
          cache: $templateCache
        }).
          then(function (response) {
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
  });