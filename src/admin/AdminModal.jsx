import { useState, useEffect } from "react";
import './AdminModal.css';

export default function AdminModal({ onClose, handleSave, editingItem, classrooms }) {
  const [formData, setFormData] = useState({
    name: '', professor: '', day1: '', day2: '', time1: '', time2: '', room1: '', room2: '',
  });

  useEffect(() => {
    if (editingItem) {
      const s1 = editingItem.schedules?.[0] || {};
      const s2 = editingItem.schedules?.[1] || {};
      setFormData({
        name: editingItem.name || '', professor: editingItem.professor || '',
        day1: s1.day || '', time1: s1.time || '', room1: s1.room || '',
        day2: s2.day || '', time2: s2.time || '', room2: s2.room || '',
      });
    }
  }, [editingItem]);

  // 키보드 엔터 이동 로직
  const handleKeyDown = (e, nextField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField === 'submit') {
        Accept();
      } else {
        const nextInput = document.querySelector(`[name="${nextField}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const Accept = () => {
    if (!formData.name) return alert("과목명을 입력해주세요.");
    const schedules = [{ day: formData.day1, time: formData.time1, room: formData.room1 }];
    if (formData.day2) schedules.push({ day: formData.day2, time: formData.time2, room: formData.room2 });
    handleSave({ name: formData.name, professor: formData.professor, schedules });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingItem ? '강의 수정' : '새 강의 등록'}</h2>
        <div className="input-group">
          <input type="text" name="name" placeholder="과목명" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'professor')} />
          <input type="text" name="professor" placeholder="담당교수" value={formData.professor} onChange={(e) => setFormData({...formData, professor: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'day1')} />
          
          <div className="input-row">
            <input type="text" name="day1" placeholder="요일1" value={formData.day1} onChange={(e) => setFormData({...formData, day1: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'time1')} />
            <input type="text" name="time1" placeholder="시간1 (09:00 ~ 12:00)" value={formData.time1} onChange={(e) => setFormData({...formData, time1: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'room1')} />
            <select name="room1" value={formData.room1} onChange={(e) => setFormData({...formData, room1: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'day2')}>
              <option value="">강의실1 선택</option>
              {classrooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>

          <div className="input-row">
            <input type="text" name="day2" placeholder="요일2 (선택)" value={formData.day2} onChange={(e) => setFormData({...formData, day2: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'time2')} />
            <input type="text" name="time2" placeholder="시간2 (선택)" value={formData.time2} onChange={(e) => setFormData({...formData, time2: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'room2')} />
            <select name="room2" value={formData.room2} onChange={(e) => setFormData({...formData, room2: e.target.value})} onKeyDown={(e) => handleKeyDown(e, 'submit')}>
              <option value="">강의실2 선택</option>
              {classrooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-btns">
          <button className="save-btn" onClick={Accept}>등록</button>
          <button className="close-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}