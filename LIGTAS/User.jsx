import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function UserDashboard({ token }) {
  const [position, setPosition] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    navigator.geolocation.watchPosition(pos => {
      setPosition({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      });
    });
  }, []);

  const sendSOS = async () => {
    const res = await fetch("http://localhost:8080/sos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "",
        lat: position.lat,
        lon: position.lon,
        message,
        timestamp: new Date().toISOString()
      })
    });

    if (res.ok) {
      alert("SOS sent");
    } else {
      alert("Failed to send SOS");
    }
  };

  return (
    <div>
      {position && (
        <MapContainer center={[position.lat, position.lon]} zoom={16} style={{ height: "50vh", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[position.lat, position.lon]}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      )}
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter why you need help" rows={4} style={{ width: "100%", marginTop: "1em" }} />
      <button onClick={sendSOS}>Send SOS</button>
    </div>
  );
}

export default UserDashboard;
