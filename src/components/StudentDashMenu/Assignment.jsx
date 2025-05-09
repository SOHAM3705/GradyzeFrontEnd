import React from "react";

const StudentAssignment = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.5rem", // Slightly smaller font size for better mobile responsiveness
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#f8fafc", // Light background color
        color: "#4a5568", // Text color
      }}
    >
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Coming Soon</h1>
        <p style={{ fontSize: "1rem", color: "#718096" }}>
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default StudentAssignment;
