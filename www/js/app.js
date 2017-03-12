var coordinates;
angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.navBar.alignTitle("center");
  $ionicConfigProvider.scrolling.jsScrolling(true);

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html'
    })

  $stateProvider
    .state('categoria', {
      url: '/categoria',
      templateUrl: 'templates/categoria.html',
      controller: 'CategoriaCtrl'
    })

  $stateProvider
    .state('articulos', {
      url: '/articulos/:id',
      templateUrl: 'templates/articulos.html',
      controller: 'ArticuloCtrl'
    })

  $stateProvider
    .state('articulodetalle', {
      url: '/articulodetalle/:id',
      templateUrl: 'templates/articulo_detalle.html',
      controller: 'ArticuloDetalleCtrl'
    })

   $urlRouterProvider.otherwise('/home');

})

.controller('CategoriaCtrl',['$scope','$http','$state',function($scope,$http,$state){
  $scope.dataLoaded = false;
  $http.get('http://apirest-pachacamac.azurewebsites.net/api/categorias')
  .success(function(data){
    $scope.categorias=data;
    $scope.dataLoaded = true;
  })
    .error(function(data){
      alert(data);
    })

  document.images.src="http://apirest-pachacamac.azurewebsites.net/api/img/56c4b2dac0f5c9ec10016eff";
}])

.controller('ArticuloCtrl',['$scope','$http','$state',function($scope,$http,$state){
  $scope.dataLoaded = false;
  $http.get('http://apirest-pachacamac.azurewebsites.net/api/categorias/'+$state.params.id)
    .success(function(data){
      $scope.arttitle=data.title;
    });

  $http.get('http://apirest-pachacamac.azurewebsites.net/api/itemsxart/'+$state.params.id)
    .success(function(data){
      $scope.articulos=data;
      $scope.dataLoaded = true;
    });
}])

.controller('ArticuloDetalleCtrl',['$scope','$http','$state','$ionicModal',function($scope,$http,$state,$ionicModal){

  $http.get('http://apirest-pachacamac.azurewebsites.net/api/items/'+$state.params.id)
  .success(function(data){
    coordinates=data.coordinates;
    $scope.articulo=data;
  })

  $ionicModal.fromTemplateUrl('contact-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modalDragStart = { active: true, value: 0 }
  })

  $scope.closeModal = function() {
    return $scope.modal.hide();
  };

  $scope.enviarfeedback = function(){

    var dt ={
              name: document.getElementById('name').value,
              description:document.getElementById('description').value,
              item:document.getElementById('item').value
              }

    $http.post('http://apirest-pachacamac.azurewebsites.net/api/feedback', dt)
      .success(function(data) {
        $scope.res = 'FeelBack guardado con exito';
        return $scope.modal.hide();
      })
      .error(function(data) {
        console.log('Error:' + res);
      });
  }

  function getmap(){

    navigator.geolocation.getCurrentPosition(function(position){
      var directionsDisplay = new google.maps.DirectionsRenderer;
      var directionsService = new google.maps.DirectionsService;

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 41.85, lng: -87.65}
      });
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('right-panel'));

      var start = position.coords.latitude+","+position.coords.longitude;
      var end = coordinates;
      directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
    })
  }

  getmap();
}])

.directive('elasticImage', function($ionicScrollDelegate) {
  return {
    restrict: 'A',
    link: function($scope, $scroller, $attr) {
      var image = document.getElementById($attr.elasticImage);
      var imageHeight = image.offsetHeight;

      $scroller.bind('scroll', function(e) {
        var scrollTop = e.detail.scrollTop;
        var newImageHeight = imageHeight - scrollTop;
        if (newImageHeight < 0) {
          newImageHeight = 0;
        }
        image.style.height = newImageHeight + 'px';
      });
    }
  }
});
