// Map of English teachers in Hamburg with the option to filter by area of expertise
// Project by A. Bales, C.-M. Forke, D. Szablowski
// HAW Hamburg, Faculty Engineering & Computer Science, Technical English (L. Harris), Summer Semester 2019
// 2019-05-02

// load teacher data from an external json file
// each should have at least a name and address, the rest is optional (can be left out or represented as "" and will not show)
// will not throw an error even if name or address are empty
$.ajax({
  url: "teachers.json"
}).done(function(teachers) {
  var mymap = L.map('mapid');
  
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGF1dG9sb2d5IiwiYSI6ImNqdWVrMjd3aDA0MHczeXBkeGkxZWl6aXMifQ.YAYwpv66L9LS2F6EMIEe6A'
  }).addTo(mymap);

// adapt initial map display to area covered by pins
  function zoomMapToFitTeachers(teachers) {
    var minLat;
    var minLng;
    var maxLat;
    var maxLng;
  
    teachers.forEach(function(teacher) {
      if (!minLat || minLat > teacher.lat) {
        minLat = teacher.lat;
      }
  
      if (!maxLat || maxLat < teacher.lat) {
        maxLat = teacher.lat;
      }
  
      if (!minLng || minLng > teacher.lng) {
        minLng = teacher.lng;
      }
  
      if (!maxLng || maxLng < teacher.lng) {
        maxLng = teacher.lng;
      }
    });
  
    mymap.fitBounds([
      [minLat, minLng],
      [maxLat, maxLng]
    ]);
  }  

zoomMapToFitTeachers(teachers);
var markers = [];

// add teachers as pins
teachers.forEach(addAsMarker);  

//  add attributes to popup content

function addAsMarker(teacher) {
  var marker = L.marker([teacher.lat, teacher.lng]).addTo(mymap);

  var popupContent = "<b>" + teacher.name + "</b>";

  if (teacher.specialisations) {
    popupContent += "<br>" + teacher.specialisations.join(", ");
  }
  popupContent += "<br><br>" + teacher.address;

  if (teacher.telephone) {
    popupContent += "<br>" + teacher.telephone;
  }

  if (teacher.mobile) {
    popupContent += "<br>" + teacher.mobile;
  }

  if (teacher.whatsapp) {
    popupContent += "<br>" + teacher.whatsapp;
  }

  if (teacher.email) {
    popupContent += "<br> <a href=\"mailto:" + teacher.email + "\">" + teacher.email + "</a>"
  }

  if (teacher.facebook) {
    popupContent += "<br> <a target=\"_blank\" href=\"" + teacher.website + "\"> facebook </a>"
  }

  if (teacher.website) {
    popupContent += "<br> <a target=\"_blank\" href=\"" + teacher.website + "\">" + teacher.website + "</a>"
  }

  marker.bindPopup(popupContent);
  markers.push(marker);
}

// create specialisation categories
var specialisations = [];
teachers.forEach(function(teacher) {
  teacher.specialisations.forEach(function(specialisation) {
    if (specialisations.indexOf(specialisation) === -1) {
      specialisations.push(specialisation);
    }
  });
});

// create filter buttons from set of attributes
function createButton(label, filterFunction) {
  var button = document.createElement("button");
  button.type = "button";
  button.innerHTML = label;
  button.addEventListener('click', function() {
    clearMarkers();
    teachers.filter(filterFunction).forEach(addAsMarker);
    highlightButton(label);
  });

  return button;
}

// highlight active filter button
function highlightButton(label) {
  var buttonContainer = document.querySelector("#specialisations");
  console.log(buttonContainer.children);
  var buttons = buttonContainer.children;
  Array.prototype.forEach.call(buttons, function(button) {
    if (button.innerHTML === label) {
      button.className = "active";
    } else {
      button.className = "inactive";
    }
  });
}

// remove shown markers to show only a subset
function clearMarkers() {
  markers.forEach(function(marker) {
    marker.removeFrom(mymap);
  });
  markers = [];
}

// create filter buttons from set of attributes
var buttonContainer = document.querySelector("#specialisations");
buttonContainer.append(createButton("all", function() {
  return true
}));

specialisations.forEach(function(specialisation) {
  buttonContainer.append(createButton(specialisation, function(teacher) {
    return teacher.specialisations.indexOf(specialisation) >= 0;
  }));
});

highlightButton("all");

});
