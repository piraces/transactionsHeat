'use strict';

/**
* @ngdoc function
* @name ismaelApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the ismaelApp
*/
angular.module('ismaelApp')
.controller('MainCtrl', function (leafletData,$scope,$http) {


  var self = this;
  this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];


  this.defaults = {

   minZoom: 12
  }
  this.bounds = {
    southWest: {
        lat: 41.29251159,
        lng: 2.0101547,
    },
    northEast: {
        lat:41.498549,
       lng:2.349357,
    }

}
  this.center = {
    lat:41.3947688,
    long:2.0787282,
    zoom:12
  };

  this.allPoints = [];

  this.markers = [];
  this.ageFrom = 50;
  this.ageTo = 60;
  this.topLeft = {}
  this.bottomRight = {};
  this.layer = {};

  $scope.$on('leafletDirectiveMarker.mouseover', function(e, args) {

    args.leafletEvent.target.openPopup();


  });


  $scope.$on('leafletDirectiveMap.moveend', function(e,args){
    console.log("se ha movido");

    leafletData.getMap().then(function(map) {

      //L.GeoIP.centerMapOnPosition(map, 15);
      var bounds  = map.getBounds();
      self.topLeft = {
        lat: bounds._northEast.lat,
        lon: bounds._southWest.lng
      }

      self.bottomRight = {
        lat: bounds._southWest.lat,
        lon: bounds._northEast.lng

      }


      self.loadData();
    });

    leafletData.getMap().then(function(map) {


    });

    //Dibujamos solo los markers que estén en nuestra parte


  });
  $scope.$on('leafletDirectiveMarker.mouseout', function(e, args) {

    args.leafletEvent.target.closePopup();
  });


  //First, set to Barcelona
  leafletData.getMap().then(function(map) {
    //L.GeoIP.centerMapOnPosition(map, 15);
    map.setView(new L.LatLng(41.3878145,2.1734853), 12);

  });




  var icon =   L.icon({
    iconUrl: 'leaf-green.png',
    shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  })




  //Function to paint heatMaps. INput format: the one from the backend
  this.paintHeatMap = function(sourceData){

    var result = [];
    for(var i = 0; i < sourceData.length; i++){
      var current = sourceData[i];
      result.push([current.lat,current.lon,current.intensity]);
      self.markers.push({lat:current.lat,lng:current.lon,message: "Intensity: " + current.intensity, draggable:false, icon: {
        iconUrl: 'images/marker.png',
        shadowUrl: 'images/marker.png',
        iconSize:     [38, 95],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62]
    }})

    }


    leafletData.getMap().then(function(map) {
      //L.GeoIP.centerMapOnPosition(map, 15);
      self.layer = L.heatLayer(result, {radius: 25}).addTo(map);



      console.log("Painted new points: " + result.length)
    });


  };




  this.clear = function(){

    self.money = undefined;
    self.ageTo = undefined;
    self.ageFrom = undefined;
    self.profile = undefined;


  }

  this.loadData = function(){

    leafletData.getMap().then(function(map) {
      map.removeLayer(self.layer);

      var query = '';
      if(self.profile && self.profile.length>0){
          query += '/profile/';
      }
      else{
          query += '/heat/';
      }

      query+= self.topLeft.lat + "/" + self.topLeft.lon + "/" + self.bottomRight.lat + "/" + self.bottomRight.lon + "/" + self.ageFrom ;
      if(self.ageTo && self.ageTo.length>0){
          query += "-" + self.ageTo;
      }
      if(self.money && self.money.length>0){
         query+= "/" + self.money;
      }
      if(self.profile && self.profile.length > 0){
        query += "/" + self.profile;
      }
      $http.get( query).then(function(result){

          self.allPoints = result.data;
          self.paintHeatMap(result.data);


      })
      .catch(function(error){
        console.error(error);
      });
    });


  }












});
