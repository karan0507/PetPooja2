import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { Container, Button } from 'react-bootstrap';

// Sample coordinates in Brampton for restaurants
const restaurantCoordinatesList = [
  [43.7315, -79.7624],
  [43.7326, -79.7500],
  [43.7383, -79.7610],
  [43.7307, -79.7435],
];

// Sample coordinates in Mississauga for customers
const customerCoordinatesList = [
  [43.7066, -79.7398],
  [43.7001, -79.7437],
  [43.7079, -79.7347],
  [43.7033, -79.7496],
];

// Function to select random coordinates
const getRandomCoordinates = (coordinatesList) => {
  return coordinatesList[Math.floor(Math.random() * coordinatesList.length)];
};

const createIcon = (iconClass, color = 'red') => {
  return L.divIcon({
    html: `<i class="${iconClass}" style="font-size: 24px; color: ${color};"></i>`,
    className: 'custom-marker-icon',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -45],
  });
};

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const routingControlRef = useRef(null);
  const navigate = useNavigate();

  const restaurantCoordinates = getRandomCoordinates(restaurantCoordinatesList);
  const customerCoordinates = getRandomCoordinates(customerCoordinatesList);

  useEffect(() => {
    // Initialize the map
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: restaurantCoordinates,
        zoom: 13,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }),
        ],
      });

      // Add restaurant and customer markers
      L.marker(restaurantCoordinates, { icon: createIcon('bi bi-shop', 'blue') })
        .addTo(mapRef.current)
        .bindPopup('Restaurant');

      L.marker(customerCoordinates, { icon: createIcon('bi bi-house', 'green') })
        .addTo(mapRef.current)
        .bindPopup('Customer');

      // Add moving marker for the driver
      markerRef.current = L.marker(restaurantCoordinates, { icon: createIcon('bi bi-truck', 'red') })
        .addTo(mapRef.current);

      // Initialize routing control
      routingControlRef.current = L.Routing.control({
        waypoints: [L.latLng(...restaurantCoordinates), L.latLng(...customerCoordinates)],
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: 'blue', weight: 4 }],
        },
        addWaypoints: false,
        routeWhileDragging: false,
        show: true,
        router: new L.Routing.OSRMv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
        }),
      }).addTo(mapRef.current);

      routingControlRef.current.on('routesfound', function (e) {
        const route = e.routes[0].coordinates;
        let index = 0;

        const moveMarker = () => {
          if (index < route.length - 1) {
            const start = L.latLng(route[index]);
            const end = L.latLng(route[index + 1]);
            const duration = 500; // duration in milliseconds
            const steps = 50; // number of steps for smooth movement
            const stepLat = (end.lat - start.lat) / steps;
            const stepLng = (end.lng - start.lng) / steps;

            let currentStep = 0;

            const move = () => {
              if (currentStep < steps && markerRef.current && mapRef.current) {
                const newLat = start.lat + stepLat * currentStep;
                const newLng = start.lng + stepLng * currentStep;
                markerRef.current.setLatLng([newLat, newLng]);
                mapRef.current.panTo([newLat, newLng]);
                currentStep += 1;
                setTimeout(move, duration / steps);
              } else {
                index += 1;
                moveMarker();
              }
            };

            move();
          }
        };

        moveMarker();
      });
    }

    return () => {
      // Cleanup map and routing control
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [restaurantCoordinates, customerCoordinates]);

  return (
    <Container>
      <h2>Track Your Order</h2>
      <div id="map" style={{ height: '500px', width: '100%' }} />
      <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>Back</Button>
    </Container>
  );
};

export default TrackOrderPage;
