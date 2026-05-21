import React, { useEffect, useState } from 'react';
import httpClient from '../api/httpClient';
import AdminControl from './AdminControl';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import './AdminMain.css';

export default function AdminMain() {
  const [text, setText] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadSchedules();
  }, []);

  async function loadSchedules() {
    try {
      const res = await httpClient.get('/schedules');
      setSchedules(res.data || []);
    } catch (error) {
      console.error('시간표 정보를 불러오지 못했습니다.', error);
    }
  }

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

  async function handleSave(newData) {
    if (!newData.classroomId || !newData.subject || !newData.day || !newData.startTime || !newData.endTime) {
      alert('필수 항목을 모두 채워주세요!');
      return;
    }

    try {
      if (editingItem) {
        await httpClient.put(`/schedules/${editingItem.scheduleId}`, newData);
        alert('수정되었습니다.');
      } else {
        await httpClient.post('/schedules', newData);
        alert('등록했습니다.');
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await loadSchedules();
    } catch (error) {
      alert(error.response?.data?.message || '저장에 실패했습니다.');
      console.error(error);
    }
  }

  async function handleDelete(scheduleId) {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await httpClient.delete(`/schedules/${scheduleId}`);
        setSelectedIds(selectedIds.filter((id) => id !== scheduleId));
        await loadSchedules();
      } catch (error) {
        alert(error.response?.data?.message || '삭제에 실패했습니다.');
        console.error(error);
      }
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      alert("삭제할 항목을 먼저 선택해주세요.");
      return;
    }
    if (window.confirm(`선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      try {
        await Promise.all(selectedIds.map((scheduleId) => httpClient.delete(`/schedules/${scheduleId}`)));
        setSelectedIds([]);
        await loadSchedules();
      } catch (error) {
        alert(error.response?.data?.message || '삭제에 실패했습니다.');
        console.error(error);
      }
    }
  }

  function handleSelectToggle(scheduleId) {
    if (selectedIds.includes(scheduleId)) {
      setSelectedIds(selectedIds.filter((id) => id !== scheduleId));
    } else {
      setSelectedIds([...selectedIds, scheduleId]);
    }
  }

  const filteredSchedules = schedules.filter((item) => {
    const classroomId = item.classroomEntity?.classroomId || item.classroomId || '';
    return (
      (item.subject || '').toLowerCase().includes(text.toLowerCase()) ||
      classroomId.toLowerCase().includes(text.toLowerCase()) ||
      (item.professor || '').toLowerCase().includes(text.toLowerCase())
    );
  }).sort((a, b) => b.scheduleId - a.scheduleId);

  function handleSelectAll(isChecked) {
    if (isChecked) {
      setSelectedIds(filteredSchedules.map(item => item.scheduleId));
    } else {
      setSelectedIds([]);
    }
  }

  return (
    <div className="admin-main">
      <div>
        <AdminControl 
          handleText={handleText} 
          AddSchedule={AddSchedule} 
          onDeleteSelected={handleDeleteSelected} 
        />
      </div>
      <div className="admin-list-container">
        <AdminTable 
          filteredSchedules={filteredSchedules} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          selectedIds={selectedIds}
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