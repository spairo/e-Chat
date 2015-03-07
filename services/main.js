'use strict';

/*
* @ngdoc function
* @name Camuapp.Services:Main
* @description
* # Main
* Services Camuapp
*/

app.service('ModalMessage', function($resource, $rootScope) {
	this.open = function (size,msg,title, $modal, $scope) {
		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: function ($scope, $modalInstance) {
				$scope.mensajemodal = msg;
				$scope.titulo = title;

				$scope.ok = function () {
					$modalInstance.dismiss('cancel');
				};
			},
			size: size,
			resolve: {
				   mensajemodal: function () {
			          return $scope.mesajemodal;
			        },
				   titulo: function () {
					  return $scope.titulo;
				   }
			}
		});
	};
});
