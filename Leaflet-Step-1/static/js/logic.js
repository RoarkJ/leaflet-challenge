// Define streetmap and darkmap layers
var greyscale = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  tileSize: 512,
  maxZoom: 15,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});
// var satelite_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     mapZoom: 15,
//     zoomOffset: -1,
//     id: "mapbox/satellite-v9",
//     accessToken: API_KEY
// });
    
// var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     mapZoom: 15,
//     zoomOffset: -1,
//     id: "mapbox/outdoors-v11",
//     accessToken: API_KEY
// });
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3,
});
greyscale.addTo(myMap);

//Base Map
// var baseMaps = {
//     Greyscale: greyscale,
//     Satellite: satelite_map,
//     Outdoor: outdoors
// };
// Overlays Maps
var earthquakes = new L.LayerGroup();
// var overlays = {
//    // "Techtonic Plates": techtonicplates, ( not adding to assignment)
//     "Earthquakes": earthquakes
// };
//Add Control Layer
// L.control.layers(baseMaps, overlays).addTo(myMap);
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
function circleColor(depth) {
  if (depth >90 ) return "#FF0000";
  else if (depth >70) return "#FF6600";
  else if (depth >50) return "#FFA366" ;
  else if (depth>30) return "#E6B800" ;
  else if (depth>10) return "#99FF66";
  else return "#009900";
  }
  function circleSize(mag) {
    if (mag === 0) {
      return 1;
    }
    return mag * 3;
  };
console.log(data)
function circleMakers(feature) {
  return {
    radius: circleSize(feature.properties.mag),
    fillColor: circleColor(feature.geometry.coordinates[2]),
    weight: 1, 
    color: "grey", 
    opacity: .9,
    fillOpacity: 0.8
    };
}
  // Create a GeoJSON layer containing the desired features on the earthquakeData object
   L.geoJSON(data, {
    pointToLayer: function(feature, latlong){
      return L.circleMarker(latlong);
      },
      //set up the pop up markers features
      style: circleMakers,
      onEachFeature: function (feature, layer) {
      layer.bindPopup( "Location: "+ feature.properties.place + "<br>" + new Date(feature.properties.time) + "<br>" + 
      "Magnitude "+ feature.properties.mag + "<br>" + "Depth: " + feature.geometry.coordinates[2]);
      }
      }).addTo(earthquakes);
earthquakes.addTo(myMap);
      // create a legend control object.
      var legend = L.control({
        position: "bottomright"
      });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depth = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    var colors = ["#009900", "#99FF66", "#E6B800", "#FFA366", "#FF6600", "#FF0000" ]
    var labels = [];
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
          // depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
          depth[i] + "<br>" ;

  } 
  return div
};
// Finally, add legend to the map.
legend.addTo(myMap);
});
