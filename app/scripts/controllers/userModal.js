'use strict';

angular.module('konkursApp')
  .controller('UserModalCtrl', function ($rootScope, $scope, $modalInstance, UserResource) {
    $scope.item = UserResource.get();

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };

    $scope.save = function ( ) {
      $modalInstance.dismiss();
      $rootScope.updateUser();
    }
  });
