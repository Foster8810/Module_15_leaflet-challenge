// Create the map object
let myMap = L.map('map', {
    center: [40, -100],
    zoom: 5
});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load GeoJSON Data using d3.json
let geoData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(geoData).then(function(data) {
    // Function to get color based on earthquake depth
    function getColor(depth) {
        if (depth < 10) return 'yellow';
        else if (depth < 30) return 'lightgreen';
        else if (depth < 50) return 'green';
        else if (depth < 70) return 'darkgreen';
        else if (depth < 100) return 'red';
        else return 'darkred';
    }

    // Loop through earthquake data and add markers to map
    data.features.forEach(function(feature) {
        let long = feature.geometry.coordinates[0];
        let lat = feature.geometry.coordinates[1];
        let depth = feature.geometry.coordinates[2];
        let magnitude = feature.properties.mag;

        let circle = L.circleMarker([lat, long], {
            radius: magnitude * 3,
            fillColor: getColor(depth),
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(myMap);

        // Popup content
        let popupContent = `<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km<br><b>Place:</b> ${feature.properties.place}`;
        circle.bindPopup(popupContent);
    });

    // Add legend to the map
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [0, 10, 30, 50, 70, 100];

        // loop through our depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }

        return div;
    };

    legend.addTo(myMap);

})