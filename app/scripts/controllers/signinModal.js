'use strict';

angular.module('konkursApp')
  .controller('SigninModalCtrl', function ($scope, $modalInstance) {
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
