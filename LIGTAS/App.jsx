import { useState } from "react";

export default function App() {
  const [userId, setUserId] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const sendReport = async () => {
    const incident = {
      user_id: userId,
      location,
      description,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:8080/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incident),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="container">
      <h2>Incident Report</h2>
      <input type="text" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} />
      <input type="text" placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)}></textarea>
      <button onClick={sendReport}>Submit Report</button>
      <p>{message}</p>
    </div>
  );
}