'use strict';

angular.module('konkursApp')
  .controller('UserModalCtrl', function ($scope, $modalInstance, UserResource) {
    $scope.item = UserResource.get();

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.save = function ( ) {
      $modalInstance.dismiss();
    }
  });
