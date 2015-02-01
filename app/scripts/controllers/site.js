'use strict';

angular.module('konkursApp')
  .controller('SiteCtrl', function ($rootScope, UserResource) {
    $rootScope.user = UserResource.get({}, function() {
      if ($rootScope.user.error != undefined)
        $rootScope.user = null;
    });
  });
