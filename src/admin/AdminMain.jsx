import React, { useState } from 'react';
import AdminControl from './AdminControl';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import './AdminMain.css';

const dummy_ad = [
  {
    id: '1', code: '11111', name: '리액트 프로그래밍', professor: '홍길동', section: '01',
    schedules: [
      { "day": "월", "time": "01:00 ~ 02:15", "room": "공1201" },
      { "day": "수", "time": "03:00 ~ 04:15", "room": "공1201" }
    ]
  },
  {
    id: '2', code: '11112', name: '운영체제', section: '02', day: '화', time: '02:30 ~ 03:45', room: '공1105'
  }
];

export default function AdminMain() {
  const [text, setText] = useState("");
  const [schedule, setSchedule] = useState(dummy_ad);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 🌟 새롭게 추가: 체크된 항목들의 강좌번호(code)를 기억하는 배열
  const [selectedCodes, setSelectedCodes] = useState([]); 

  function handleText(e) {
    setText(e.target.value);
  }

  function AddSchedule() {
    setEditingItem(null); 
    setIsModalOpen(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function handleSave(newData) {
    if (newData.code === "" || newData.name === "" || newData.section === "") {
      alert("빈칸을 모두 채워주세요!");
      return;
    }
    if (editingItem) {
      setSchedule(schedule.map(item => item.code === editingItem.code ? { ...item, ...newData } : item));
      alert('수정되었습니다.');
    } else {
      setSchedule([...schedule, newData]);
      alert('등록했습니다.');
    }
    setIsModalOpen(false);
    setEditingItem(null); 
  }

  // 🌟 [추가] 개별 삭제 (행에 있는 삭제 버튼)
  function handleDelete(code) {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setSchedule(schedule.filter(item => item.code !== code));
      // 만약 체크되어 있던 항목을 개별 삭제했다면 체크 목록에서도 빼줌
      setSelectedCodes(selectedCodes.filter(c => c !== code)); 
    }
  }

  // 🌟 [추가] 일괄 삭제 (상단에 있는 삭제 버튼)
  function handleDeleteSelected() {
    if (selectedCodes.length === 0) {
      alert("삭제할 항목을 먼저 선택해주세요.");
      return;
    }
    if (window.confirm(`선택한 ${selectedCodes.length}개의 항목을 삭제하시겠습니까?`)) {
      setSchedule(schedule.filter(item => !selectedCodes.includes(item.code)));
      setSelectedCodes([]); // 삭제 후 체크 목록 초기화
    }
  }

  // 🌟 [추가] 개별 체크박스 토글
  function handleSelectToggle(code) {
    if (selectedCodes.includes(code)) {
      setSelectedCodes(selectedCodes.filter(c => c !== code)); // 이미 있으면 빼기
    } else {
      setSelectedCodes([...selectedCodes, code]); // 없으면 넣기
    }
  }

  // 검색 필터링 로직
  const filteredSchedule = schedule.filter((item) => {
    return (
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.code.toLowerCase().includes(text.toLowerCase())
    );
  }).sort((a, b) => b.code.localeCompare(a.code));

  // 🌟 [추가] 전체 선택 체크박스 (검색된 결과만 모두 선택)
  function handleSelectAll(isChecked) {
    if (isChecked) {
      setSelectedCodes(filteredSchedule.map(item => item.code));
    } else {
      setSelectedCodes([]);
    }
  }

  return (
    <div className="admin-main">
      <div>
        {/* 🌟 일괄 삭제 함수를 Control에 전달 */}
        <AdminControl 
          handleText={handleText} 
          AddSchedule={AddSchedule} 
          onDeleteSelected={handleDeleteSelected} 
        />
      </div>
      <div className="admin-list-container">
        {/* 🌟 개별 삭제, 체크 관련 상태/함수를 Table에 전달 */}
        <AdminTable 
          filteredSchedule={filteredSchedule} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          selectedCodes={selectedCodes}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
        />
      </div>
      <div>
        {isModalOpen && (
          <AdminModal
            onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
            handleSave={handleSave}
            editingItem={editingItem}
          />
        )}
      </div>
    </div>
  );
}