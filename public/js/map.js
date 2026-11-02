// This file contains JavaScript code that initializes a Mapbox map and adds a marker with a popup to display the location of a listing. It uses the Mapbox GL JS library to create an interactive map.

// The map is centered on the coordinates of the listing, and a marker is placed at that location. When the marker is clicked, a popup appears showing the location name and a message indicating that the exact location will be provided after booking.

// The map is created using the mapboxgl.Map constructor, and the marker is created using the mapboxgl.Marker constructor. The access token for Mapbox is set using the mapboxgl.accessToken property.

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: listing.geometry.coordinates,
    zoom: 9,
});

const marker = new mapboxgl.Marker({ color: "Red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25}).setHTML(
        `<h3>${listing.location}</h3>
        <p>Exact location provided after booking</p>`))
    .addTo(map);

