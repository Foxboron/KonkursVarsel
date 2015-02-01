'use strict';

angular.module('konkursApp')
  .controller('SiteCtrl', function ($rootScope, UserResource, $modal) {

    $rootScope.updateUser = function() {
      $rootScope.user = UserResource.get({}, function() {
        if ($rootScope.user.error != undefined)
          $rootScope.user = null;
      });
    };
    $rootScope.updateUser();

    $rootScope.editUser = function() {
      $modal.open({ templateUrl: 'views/userModal.html', controller: 'UserModalCtrl' });
    }
  });
