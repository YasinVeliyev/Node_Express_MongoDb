import mapboxgl from "mapbox-gl";

export const displayMap = (locations) => {
    mapboxgl.accessToken = "pk.eyJ1IjoieWFzaW52IiwiYSI6ImNrc3c3Mzh5OTF4cTkyd3RmbDk4d2p5dmkifQ.auaGIbpxyWavALwqMT8VBw";
    let map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        scrollZoom: false,
        // center: [-118.113491, 34.111745],
        // zoom: 10,
    });

    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc) => {
        const el = document.createElement("div");
        el.className = "marker";
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom",
        })
            .setLngLat(loc.coordinates)
            .addTo(map);
        bounds.extend(loc.coordinates);
        new mapboxgl.Popup({ offset: 30 })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>${loc.day}:${loc.description}<p>`)
            .addTo(map);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 200,
            left: 100,
            right: 100,
        },
    });
};
