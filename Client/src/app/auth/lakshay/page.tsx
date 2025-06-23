import React, { useEffect, useState } from "react";

const LakshayTestPage = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("https://api.thapargo.com/auth/lakshay/")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || data.message || "Error fetching message");
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ fontSize: 24, textAlign: "center", marginTop: 40 }}>
      Lakshay Test Message: <strong>{message}</strong>
    </div>
  );
};

export default LakshayTestPage;
