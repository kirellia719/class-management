import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import env from "env";
import "./style.scss"; // Import file CSS

mapboxgl.accessToken = env.MAPBOX_KEY;

const LocationManager = () => {
   const mapContainer = useRef(null);
   const [map, setMap] = useState(null);
   const [markers, setMarkers] = useState([]);
   const [locations, setLocations] = useState([
      { id: 1, name: "Hà Nội", longitude: 105.83416, latitude: 21.027763 },
      { id: 2, name: "TP Hồ Chí Minh", longitude: 106.62965, latitude: 10.82302 },
   ]);

   useEffect(() => {
      const initializeMap = () => {
         const mapInstance = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [105.83416, 21.027763],
            zoom: 5,
         });

         setMap(mapInstance);

         // Clean up on unmount
         return () => mapInstance.remove();
      };

      if (!map) initializeMap();
   }, [map]);

   useEffect(() => {
      const updateMarkerSize = () => {
         console.log("update");

         if (map) {
            const currentZoom = map.getZoom();
            const size = currentZoom > 10 ? "18px" : "12px";

            markers.forEach((marker) => {
               marker.getElement().style.width = size;
               marker.getElement().style.height = size;
            });
         }
      };

      if (map) {
         // Remove previous markers
         markers.forEach((marker) => marker.remove());

         const newMarkers = locations.map((location) => {
            // Create a custom marker as a circle (using a div element)
            const el = document.createElement("div");
            el.className = "circle-marker"; // Apply CSS class for styling

            const popup = new mapboxgl.Popup({
               closeButton: false,
               closeOnClick: false,
            }).setHTML(`<h4>${location.name}</h4>`);

            const marker = new mapboxgl.Marker(el) // Use the custom div for marker
               .setLngLat([location.longitude, location.latitude])
               .setPopup(popup) // Attach the popup to the marker
               .addTo(map);

            // Automatically open/close popup on hover
            marker.getElement().addEventListener("mouseenter", () => marker.togglePopup());
            marker.getElement().addEventListener("mouseleave", () => marker.togglePopup());

            return marker;
         });

         // Update the state with new markers
         setMarkers(newMarkers);

         // Call updateMarkerSize initially
         updateMarkerSize();

         // Add zoom event listener to update marker size when zoom level changes
         map.on("zoom", updateMarkerSize);
      }

      return () => {
         if (map) {
            map.off("zoom", updateMarkerSize); // Remove event listener when component unmounts
         }
      };
   }, [locations, map]);

   // Function to add a location
   const addLocation = () => {
      const newLocation = {
         id: locations.length + 1,
         name: `Vị trí mới ${locations.length + 1}`,
         longitude: 108.277199, // Tọa độ mặc định
         latitude: 14.058324,
      };
      setLocations([...locations, newLocation]);
   };

   // Function to remove a location
   const removeLocation = (id) => {
      setLocations(locations.filter((location) => location.id !== id));
   };

   return (
      <div>
         <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
         <button onClick={addLocation}>Thêm vị trí</button>
         {locations.map((location) => (
            <div key={location.id}>
               <span>{location.name}</span>
               <button onClick={() => removeLocation(location.id)}>Xóa</button>
            </div>
         ))}
      </div>
   );
};

export default LocationManager;
