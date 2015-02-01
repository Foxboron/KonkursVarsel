'use strict';

angular.module('konkursApp')
  .controller('ListCtrl', function ($rootScope, $scope, $http, OrgResource, $modal) {
    $rootScope.frontpage = false;

    if ($rootScope.user == null) {
      $modal.open({ templateUrl: 'views/signinModal.html', controller: 'SigninModalCtrl', resolve: { item: function () { return {message: "Logg inn for å fortsette", redirect: "/auth/github"}; }} });
      return;
    }

    $scope.updateOrgs = function() {
      $scope.orgs = OrgResource.query();
      $scope.orgs.sort(function (a,b) { return a.navn.localeCompare(b.navn, 'nb'); });
    }
    $scope.updateOrgs();

    $scope.query = function (val) {
      return $http.get('http://hotell.difi.no/api/json/brreg/enhetsregisteret', {
        params: {
          query: val
        }
      }).then(function(response){
        return response.data.entries;
      });
    };

    $scope.onSelect = function ($item, $model, $label) {
      $scope.organization = "";

      var org = OrgResource.get({identifier: $item.orgnr}, function() {
        $scope.orgs.push(org);
        $scope.orgs.sort(function (a,b) { return a.navn.localeCompare(b.navn, 'nb'); });
      });
    };

    $scope.delete = function (item) {
      OrgResource.delete({identifier: item.orgnr});
      $scope.updateOrgs();
    };
  });
