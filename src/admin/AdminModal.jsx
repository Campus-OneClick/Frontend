import { useState, useEffect } from "react";
import './AdminModal.css';

export default function AdminModal({ onClose, handleSave, editingItem, classrooms }) {
  const [formData, setFormData] = useState({
    subject: '', professor: '',
    day1: '', startTime1: '', endTime1: '', classroomId1: '',
    day2: '', startTime2: '', endTime2: '', classroomId2: '',
  });

  useEffect(() => {
    if (editingItem) {
      const s1 = editingItem.schedules?.[0] || {};
      const s2 = editingItem.schedules?.[1] || {};
      setFormData({
        subject: editingItem.subject || '',
        professor: editingItem.professor || '',
        day1: s1.day || '', startTime1: s1.startTime || '', endTime1: s1.endTime || '', classroomId1: s1.classroomId || '',
        day2: s2.day || '', startTime2: s2.startTime || '', endTime2: s2.endTime || '', classroomId2: s2.classroomId || '',
      });
    }
  }, [editingItem]);

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
    if (!formData.subject) return alert("과목명을 입력해주세요.");
    if (!formData.day1 || !formData.startTime1 || !formData.endTime1 || !formData.classroomId1)
      return alert("1교시 요일, 시작시간, 종료시간, 강의실을 모두 입력해주세요.");

    const schedules = [{
      day: formData.day1,
      startTime: formData.startTime1,
      endTime: formData.endTime1,
      classroomId: formData.classroomId1,
    }];

    if (formData.day2) {
      schedules.push({
        day: formData.day2,
        startTime: formData.startTime2,
        endTime: formData.endTime2,
        classroomId: formData.classroomId2,
      });
    }

    handleSave({ subject: formData.subject, professor: formData.professor, schedules });
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <div className="modal-row modal-title-row">
          <h2>{editingItem ? '강의 수정' : '새 강의 등록'}</h2>
        </div>

        <div className="modal-row">
          <input type="text" name="subject" placeholder="과목명"
            value={formData.subject} onChange={update('subject')}
            onKeyDown={(e) => handleKeyDown(e, 'professor')} />
        </div>

        <div className="modal-row">
          <input type="text" name="professor" placeholder="담당교수"
            value={formData.professor} onChange={update('professor')}
            onKeyDown={(e) => handleKeyDown(e, 'day1')} />
        </div>

        <div className="modal-row modal-row-4col">
          <input type="text" name="day1" placeholder="요일1 (예: 월요일)"
            value={formData.day1} onChange={update('day1')}
            onKeyDown={(e) => handleKeyDown(e, 'startTime1')} />
          <input type="time" name="startTime1"
            value={formData.startTime1} onChange={update('startTime1')}
            onKeyDown={(e) => handleKeyDown(e, 'endTime1')} />
          <input type="time" name="endTime1"
            value={formData.endTime1} onChange={update('endTime1')}
            onKeyDown={(e) => handleKeyDown(e, 'classroomId1')} />
          <select name="classroomId1" value={formData.classroomId1} onChange={update('classroomId1')}
            onKeyDown={(e) => handleKeyDown(e, 'day2')}>
            <option value="">강의실1</option>
            {classrooms.map(r => <option key={r.classroomId} value={r.classroomId}>{r.roomName}</option>)}
          </select>
        </div>

        <div className="modal-row modal-row-4col">
          <input type="text" name="day2" placeholder="요일2 (선택)"
            value={formData.day2} onChange={update('day2')}
            onKeyDown={(e) => handleKeyDown(e, 'startTime2')} />
          <input type="time" name="startTime2"
            value={formData.startTime2} onChange={update('startTime2')}
            onKeyDown={(e) => handleKeyDown(e, 'endTime2')} />
          <input type="time" name="endTime2"
            value={formData.endTime2} onChange={update('endTime2')}
            onKeyDown={(e) => handleKeyDown(e, 'classroomId2')} />
          <select name="classroomId2" value={formData.classroomId2} onChange={update('classroomId2')}
            onKeyDown={(e) => handleKeyDown(e, 'submit')}>
            <option value="">강의실2 (선택)</option>
            {classrooms.map(r => <option key={r.classroomId} value={r.classroomId}>{r.roomName}</option>)}
          </select>
        </div>

        <div className="modal-row modal-btns">
          <button className="save-btn" onClick={Accept}>저장</button>
          <button className="close-btn" onClick={onClose}>닫기</button>
        </div>

      </div>
    </div>
  );
}
