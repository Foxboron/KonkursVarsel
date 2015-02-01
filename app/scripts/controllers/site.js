'use strict';

angular.module('konkursApp')
  .controller('SiteCtrl', function ($rootScope, UserResource, $modal) {
    $rootScope.user = UserResource.get({}, function() {
      if ($rootScope.user.error != undefined)
        $rootScope.user = null;
    });


    $rootScope.editUser = function() {
      $modal.open({ templateUrl: 'views/userModal.html', controller: 'UserModalCtrl' });
    }
  });
