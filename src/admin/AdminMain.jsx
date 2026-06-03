import React, { useState } from 'react';
import AdminControl from './AdminControl';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import ClassroomModal from './ClassroomModal'; // 신규: 강의실 관리 모달
import './AdminMain.css';

const dummy_ad = [
  { code: 'sch_1', name: '리액트 프로그래밍', professor: '홍길동', schedules: [{ day: "월", time: "01:00 ~ 02:15", room: "공1201" }, { day: "수", time: "03:00 ~ 04:15", room: "공1201" }] },
  { code: 'sch_2', name: '운영체제', professor: '김철수', schedules: [{ day: '화', time: '02:30 ~ 03:45', room: '공1105' }] }
];

const initialRooms = [
  { id: 'r1', name: '공1201' },
  { id: 'r2', name: '공1105' },
  { id: 'r3', name: '공1202' }
];

export default function AdminMain() {
  const [text, setText] = useState("");
  const [schedule, setSchedule] = useState(dummy_ad);
  const [classrooms, setClassrooms] = useState(initialRooms); // 강의실 데이터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false); // 강의실 관리 모달 상태
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCodes, setSelectedCodes] = useState([]);

  function handleSave(newData) {
    if (editingItem) {
      setSchedule(schedule.map(item => item.code === editingItem.code ? { ...item, ...newData, code: item.code } : item));
    } else {
      setSchedule([...schedule, { ...newData, code: `sch_${Date.now()}` }]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  }

  // 단일 항목 삭제
  function handleDelete(code) {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setSchedule(schedule.filter(item => item.code !== code));
      setSelectedCodes(selectedCodes.filter(c => c !== code));
    }
  }

  // 🌟 [추가] 선택된 항목 일괄 삭제 로직
  function handleDeleteSelected() {
    if (selectedCodes.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    if (window.confirm(`선택한 ${selectedCodes.length}개의 시간표를 정말 삭제하시겠습니까?`)) {
      // 선택된 code들을 제외한 아이템들만 남기기
      setSchedule(schedule.filter(item => !selectedCodes.includes(item.code)));
      // 삭제가 완료되었으므로 선택된 배열 초기화
      setSelectedCodes([]);
    }
  }

  const filteredSchedule = schedule.filter(item => 
    item.name.toLowerCase().includes(text.toLowerCase()) || 
    item.professor.toLowerCase().includes(text.toLowerCase())
  );

  return (
    <div className="admin-main">
      <AdminControl 
        handleText={(e) => setText(e.target.value)} 
        AddSchedule={() => { setEditingItem(null); setIsModalOpen(true); }} 
        onDeleteSelected={handleDeleteSelected} // 일괄 삭제 함수 전달
        openRoomManager={() => setIsRoomModalOpen(true)} // 강의실 관리 열기
      />
      <AdminTable 
        filteredSchedule={filteredSchedule} 
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }} 
        onDelete={handleDelete}
        selectedCodes={selectedCodes}
        onSelectToggle={(code) => selectedCodes.includes(code) ? setSelectedCodes(selectedCodes.filter(c => c !== code)) : setSelectedCodes([...selectedCodes, code])}
        onSelectAll={(isChecked) => isChecked ? setSelectedCodes(filteredSchedule.map(i => i.code)) : setSelectedCodes([])}
      />
      {isModalOpen && (
        <AdminModal 
          onClose={() => setIsModalOpen(false)} 
          handleSave={handleSave} 
          editingItem={editingItem} 
          classrooms={classrooms} // 강의실 목록 전달
        />
      )}
      {isRoomModalOpen && (
        <ClassroomModal 
          classrooms={classrooms} 
          setClassrooms={setClassrooms} 
          onClose={() => setIsRoomModalOpen(false)} 
        />
      )}
    </div>
  );
}