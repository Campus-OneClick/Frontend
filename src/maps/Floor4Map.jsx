import React from "react";

export default function Floor4Map({ onSelectRoom }) {
  return (
    <div>
      <h2>4층 도면</h2>

      <div className="map-container">
        <img className="map-img" src="/floor4.png" alt="4층 도면" />

        <button
          className="room-hitbox"
          style={{ left: 100, top: 100, width: 70, height: 50 }}
          onClick={() => onSelectRoom("공1401")}
        />
      </div>
    </div>
  );
}