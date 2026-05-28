import React from "react";

export default function Floor3Map({ onSelectRoom }) {
  return (
    <div>
      <h2>3층 도면</h2>

      <div className="map-container">
        <img className="map-img" src="/floor3.png" alt="3층 도면" />

        <button
          className="room-hitbox"
          style={{ left: 100, top: 200, width: 70, height: 50 }}
          onClick={() => onSelectRoom("공1301")}
        />
      </div>
    </div>
  );
}