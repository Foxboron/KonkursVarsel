'use strict';

angular.module('konkursApp')
  .controller('SiteCtrl', function ($rootScope, UserResource) {
    $rootScope.user = UserResource.get();
    if ($rootScope.user.name == undefined) {
      $rootScope.user = null;
    }
  });
