var graymap = L.tileLayer(

  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 500,
    maxZoom: 20,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }
);

var map = L.map("mapid", {
  center: [
    40, -94
  ],
  zoom: 4
});

graymap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {


  function styleInfo(parameters) {
    return {
      opacity: 2,
      fillOpacity: 2,
      fillColor: getColor(parameters.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(parameters.properties.mag),
      stroke: true,
      weight: 1
    };
  }

  function getColor(levels) {
    switch (true) {
    case levels > 100:
      return "#72bcd4";
    case levels > 75:
      return "#86c5da";
    case levels > 50:
      return "#99cfe0";
    case levels > 25:
      return "#add8e6";
    case levels > 0:
      return "#c1e1ec";
    default:
      return "#d4ebf2";
    }
  };

  function getRadius(magnitudes) {
    if (magnitudes == 0) {
      return 1;
    }

    return magnitudes * 4;
  }

  L.geoJson(data, {
    pointToLayer: function(_parameters, coordinates) {
      return L.circleMarker(coordinates);
    },
    style: styleInfo,
    onEachFeature: function(parameters, layer) {
      layer.bindPopup(
        "Magnitude: "
          + parameters.properties.mag
          + "<br>Depth: "
          + parameters.geometry.coordinates[2]
          + "<br>Location: "
          + parameters.properties.place
      );
    }
  }).addTo(map);

  var legend = L.control({
  position: "bottomleft"
  });


  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    var legends = [-25, 0, 25, 50, 75, 100];
    var colors = [
      "#72bcd4",
      "#86c5da",
      "#99cfe0",
      "#add8e6",
      "#c1e1ec",
      "#d4ebf2"
    ];

    for (var i = 0; i < legends.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + legends[i] + (legends[i + 1] ? "&ndash;" + legends[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(map);
});
