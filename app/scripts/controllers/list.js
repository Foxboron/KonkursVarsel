'use strict';

angular.module('konkursApp')
  .controller('ListCtrl', function ($rootScope, $scope, $http, OrgResource) {
    $rootScope.frontpage = false;

    $scope.orgs = [];

    $scope.query = function (val) {
      return $http.get('http://hotell.difi.no/api/json/brreg/enhetsregisteret', {
        params: {
          query: val
        }
      }).then(function(response){
        $scope.res = response.data;
        return response.data.entries;
      });
    };

    $scope.onSelect = function ($item, $model, $label) {
      $scope.organization = "";

      var org = OrgResource.get({identifier: $item.orgnr}, function() {
        
      });
    };
  });
