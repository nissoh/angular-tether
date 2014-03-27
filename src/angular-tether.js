

angular.module('ngTether', [])
  .factory('Tether', function ($compile, $rootScope, $animate, $controller, $q, $http, $templateCache) {
    return function (config) {
      'use strict';

      if ((+!!config.template) + (+!!config.templateUrl) !== 1) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }

      config.tether = config.tether || {};

      var controller    = config.controller || angular.noop,
        controllerAs  = config.controllerAs,
        parentScope   = config.parentScope || $rootScope,
        extend        = angular.extend,
        target        = config.tether.target || document.body,
        element       = null,
        scope, html, tether;


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
        html = $http.get(config.templateUrl, {
          cache: $templateCache
        }).then(function (response) {
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
          $animate.leave(element, function(){
            element = null;
            scope.$$phase && scope.$destroy() || scope.$apply(function(){
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
        config : config.tether
      };
    };
  });


