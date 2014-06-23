

angular.module('ngTether', [])
  .factory('Utils', function($compile) {
    var Utils = {};

    Utils.extendDeep = function(destination, source) {
      for (var property in source) {
        if (source[property] && source[property].constructor &&
          source[property].constructor === Object) {
          destination[property] = destination[property] || {};
          arguments.callee(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    };

    return Utils;
  })
  .factory('Tether', function ($compile, $rootScope, $window, $animate, $controller, $timeout, $q, $http, $templateCache) {
    return function (config) {
      'use strict';

      if (!(!config.template ^ !config.templateUrl)) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }


      config.tether = config.tether || {};

      var
        controller    = config.controller || angular.noop,
        controllerAs  = config.controllerAs,
        parentScope   = config.parentScope || $rootScope,
        extend        = angular.extend,
        element       = null,
        scope, html, tether,
        bodyEl = angular.element($window.document.body);

      // Attach a tether element and the target element.
      function attachTether() {
        tether = new Tether(extend({
          element: element[0]
        }, config.tether));
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
        element = angular.element(html.trim());

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


        $timeout(function(){
          $animate.enter(element, bodyEl);
          attachTether();
          tether.position();

          if (config.leaveOnBlur) {
            bodyEl.on('click', leaveOnBlur);
          }
        })
      }

      function leaveOnBlur(evt) {
        var target = evt.target;
        if (!element || target === element[0]) return;
        while (target.parentElement !== null) {
          if (target.parentElement == element[0]) {
            return
          }
          target = target.parentElement;
        }

        bodyEl.off('click', leaveOnBlur);
        return leave();
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
          $timeout(function(){
            tether.destroy();
            $animate.leave(element);
          });
        }
      }

      function position() {
        if (element) {
          $animate.move(element, bodyEl);
          attachTether();
        }
      }

      function destroy() {
        if (isActive()) {
          $animate.leave(element, function(){
            element = null;
          })
        } else {
          element = null;
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
        config : config.tether
      };
    };
  });


