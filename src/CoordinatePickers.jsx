import { useRef } from "react";

export default function CoordinatePicker() {
  const imgRef = useRef();

  const handleClick = (e) => {
    const rect = imgRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = ((x / rect.width) * 100).toFixed(1);
    const percentY = ((y / rect.height) * 100).toFixed(1);

    console.log(`left: ${percentX}%, top: ${percentY}%`);
    alert(`left: ${percentX}%, top: ${percentY}%`);
  };

  return (
    <img
      ref={imgRef}
      src="/floor2.png"
      alt="map"
      onClick={handleClick}
      style={{ width: "600px", cursor: "crosshair" }}
    />
  );
}