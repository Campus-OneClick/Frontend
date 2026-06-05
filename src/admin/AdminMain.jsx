import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminControl from './AdminControl';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import ClassroomModal from './ClassroomModal';
import './AdminMain.css';

const API = process.env.REACT_APP_API_BASE_URL;

export default function AdminMain() {
  const [text, setText] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCodes, setSelectedCodes] = useState([]);

  // 시간표 목록 가져오기
  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`${API}/schedules`);
      setSchedule(response.data);
    } catch (error) {
      console.error("시간표 가져오기 실패:", error);
    }
  };

  // 강의실 목록 가져오기
  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(`${API}/classrooms`);
      setClassrooms(response.data);
    } catch (error) {
      console.error("강의실 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchClassrooms();
  }, []);

  // 시간표 저장 (등록 / 수정)
  // 백엔드가 schedules 배열을 받지 않고 단건 ScheduleEntity를 받으므로
  // 2교시가 있으면 두 번 요청을 보냄
  const handleSave = async (formData) => {
    try {
      const { subject, professor, schedules } = formData;

      if (editingItem) {
        // 수정: 첫 번째 스케줄만 수정 (단건 구조)
        const s = schedules[0];
        await axios.put(`${API}/schedules/${editingItem.scheduleId}`, {
          subject, professor,
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          classroomId: s.classroomId,
        });
      } else {
        // 등록: 교시별로 각각 POST
        for (const s of schedules) {
          await axios.post(`${API}/schedules`, {
            subject, professor,
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
            classroomId: s.classroomId,
          });
        }
      }

      fetchSchedule();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("시간표 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 시간표 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API}/schedules/${id}`);
        fetchSchedule();
        setSelectedCodes(selectedCodes.filter(c => c !== id));
      } catch (error) {
        console.error("시간표 삭제 실패:", error);
      }
    }
  };

  const filteredSchedule = schedule.filter(item =>
    (item.subject || '').toLowerCase().includes(text.toLowerCase()) ||
    (item.professor || '').toLowerCase().includes(text.toLowerCase())
  );

  return (
    <div className="admin-main">
      <AdminControl
        handleText={(e) => setText(e.target.value)}
        AddSchedule={() => { setEditingItem(null); setIsModalOpen(true); }}
        onDeleteSelected={() => {}}
        openRoomManager={() => setIsRoomModalOpen(true)}
      />
      <AdminTable
        filteredSchedule={filteredSchedule}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
        onDelete={(item) => handleDelete(item.scheduleId)}
        selectedCodes={selectedCodes}
        onSelectToggle={(id) => selectedCodes.includes(id)
          ? setSelectedCodes(selectedCodes.filter(c => c !== id))
          : setSelectedCodes([...selectedCodes, id])}
        onSelectAll={(isChecked) => isChecked
          ? setSelectedCodes(filteredSchedule.map(i => i.scheduleId))
          : setSelectedCodes([])}
      />
      {isModalOpen && (
        <AdminModal
          onClose={() => setIsModalOpen(false)}
          handleSave={handleSave}
          editingItem={editingItem}
          classrooms={classrooms}
        />
      )}
      {isRoomModalOpen && (
        <ClassroomModal
          classrooms={classrooms}
          onClose={() => setIsRoomModalOpen(false)}
          onRefresh={fetchClassrooms}
        />
      )}
    </div>
  );
}
