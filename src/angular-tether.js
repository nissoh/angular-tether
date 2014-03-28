

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
  .factory('Tether', function ($compile, $rootScope, $animate, $controller, $timeout, $q, $http, $templateCache) {
    return function (config) {
      'use strict';

      if ((+!!config.template) + (+!!config.templateUrl) !== 1) {
        throw new Error('Expected one of either `template` or `templateUrl`');
      }

      config.tether = config.tether || {};

      var
        controller    = config.controller || angular.noop,
        controllerAs  = config.controllerAs,
        parentScope   = config.parentScope || $rootScope,
        extend        = angular.extend,
        element       = null,
        scope, html, tether;

      var target = config.tether.target = config.tether.target || document.body;


      // Attach a tether element and the target element.
      function attachTether() {
        tether = new Tether(extend({
          element: element[0]
        }, config.tether));
//         tether.position();
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
        scope.$on('$destroy', destroy);
        
        // timeout is used because digest is being called in the html's promise wrapper
        // when the asynced digest cycle is done the $timeout will be called gracefully
        $timeout(function() {
          attachTether();
          $animate.enter(element, null, angular.element(target));
        });
        
        angular.element(document.body).append(element);
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
          $animate.move(element, null, angular.element(target));
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
        config : config.tether
      };
    };
  });


