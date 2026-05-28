import React from "react";

export default function Floor2Map({ onSelectRoom }) {
  return (
    <div>
      <h2>2층 도면</h2>

      <div className="map-container">
        <img className="map-img" src="/floor2.png" alt="2층 도면" />

        <button
          className="room-hitbox"
          style={{ left: 120, top: 230, width: 70, height: 50 }}
          onClick={() => onSelectRoom("공1201")}
        />

        <button
          className="room-hitbox"
          style={{ left: 300, top: 230, width: 70, height: 50 }}
          onClick={() => onSelectRoom("공1202")}
        />
      </div>
    </div>
  );
}