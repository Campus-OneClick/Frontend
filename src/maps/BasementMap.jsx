import "../../styles/map.css";

export default function BasementMap({ onSelectRoom }) {
  return (
    <div>
      <h2>지하 1층</h2>

      <div className="map-container">
        <img className="map-img" src="/basement.png" alt="지하" />

        <button
          className="room-hitbox"
          style={{ left: 94, top: 220, width: 70, height: 50 }}
          onClick={() => onSelectRoom("공B101")}
        />
      </div>
    </div>
  );
}