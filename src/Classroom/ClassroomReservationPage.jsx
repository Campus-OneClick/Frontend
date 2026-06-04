import React, { useState } from "react";
import Floor2Map from "./Floor2Map";
import ClassroomModal from "./ClassroomModal";
import EmptyClassroomSearch from "./EmptyClassroomSearch";

export default function ClassroomReservationPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div>
      <h1>2층 강의실 예약 시스템</h1>

      <EmptyClassroomSearch />

      <Floor2Map onSelectRoom={setSelectedRoom} />

      {selectedRoom && (
        <ClassroomModal
          roomId={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}