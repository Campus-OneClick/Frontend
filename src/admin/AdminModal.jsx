import { useState, useEffect } from "react";
import httpClient from "../api/httpClient";
import './AdminModal.css';

export default function AdminModal({ onClose, handleSave, editingItem }) {

  const [formData, setFormData] = useState({
    classroomId: '',
    subject: '',
    professor: '',
    day: '',
    startTime: '',
    endTime: '',
  });
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const res = await httpClient.get('/classrooms');
        setClassrooms(res.data || []);
      } catch (error) {
        console.error('강의실 목록을 불러오지 못했습니다.', error);
      }
    };

    loadClassrooms();

    if (editingItem) {
      const classroomId = editingItem.classroomEntity?.classroomId || editingItem.classroomId || '';

      setFormData({
        classroomId,
        subject: editingItem.subject || '',
        professor: editingItem.professor || '',
        day: editingItem.day || '',
        startTime: editingItem.startTime || '',
        endTime: editingItem.endTime || '',
      });
    } else {
      setFormData({
        classroomId: '',
        subject: '',
        professor: '',
        day: '',
        startTime: '',
        endTime: '',
      });
    }
  }, [editingItem]);

  function Accept() {
    const finalData = {
      classroomId: formData.classroomId,
      subject: formData.subject,
      professor: formData.professor,
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    handleSave(finalData);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingItem ? '시간표 수정' : '새 시간표 등록'}</h2>
        <div className="input-group">
          <select name="classroomId" value={formData.classroomId} onChange={handleChange}>
            <option value="">강의실 선택</option>
            {classrooms.map((room) => (
              <option key={room.classroomId} value={room.classroomId}>
                {room.classroomId} - {room.roomName}
              </option>
            ))}
          </select>
          <input type="text" name="subject" placeholder="과목명" value={formData.subject} onChange={handleChange} />
          <input type="text" name="professor" placeholder="담당교수" value={formData.professor} onChange={handleChange} />

          <div className="input-row">
            <select name="day" value={formData.day} onChange={handleChange}>
              <option value="">요일 선택</option>
              <option value="MON">월</option>
              <option value="TUE">화</option>
              <option value="WED">수</option>
              <option value="THU">목</option>
              <option value="FRI">금</option>
            </select>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          </div>
        </div>
        <div className="modal-btns">
          <button className="save-btn" onClick={Accept}>{editingItem ? '수정' : '등록'}</button>
          <button className="close-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}