'use strict';

angular.module('konkursApp')
  .controller('UserModalCtrl', function ($scope, $modalInstance) {
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
