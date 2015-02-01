'use strict';

angular.module('konkursApp')
  .controller('SiteCtrl', function ($rootScope, UserResource) {
    $rootScope.user = UserResource.get();
    if ($rootScope.user.navn == undefined) {
      $rootScope.user = null;
    }
  });
