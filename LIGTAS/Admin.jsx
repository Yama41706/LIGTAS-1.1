import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function AdminDashboard({ token }) {
  const [sosData, setSosData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/sos-data", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSosData(data));
  }, [token]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%", height: "100vh" }}>
        <MapContainer center={[14.5995, 120.9842]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {sosData.map((sos, i) => (
            <Marker key={i} position={[sos.lat, sos.lon]}>
              <Popup>
                <strong>{sos.email}</strong><br/>
                {sos.message}<br/>
                {sos.timestamp}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div style={{ width: "30%", padding: "1em" }}>
        <h3>Feedback</h3>
        {sosData.map((sos, i) => (
          <div key={i} style={{ marginBottom: "1em" }}>
            <strong>{sos.email}</strong><br/>
            {sos.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;