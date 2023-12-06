import React from "react";

function Content() {
  return (
    <div>
      <div className="content-wrapper" style={{ backgroundColor: "#F44C0C", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "92.4vh" }}>
        <div style={{ textAlign: "center", color: '#fff' }} >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src="../src/assets/icon/logo.png"
              alt="ShowHuay Logo"
              className="img-circle"
              style={{ border: "5px solid #fff", width: "120px" }}
            />
            <h1>ShowHuay</h1>
            <h3>Admin System</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
