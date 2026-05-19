import { useState, useEffect } from "react";
import './AdminModal.css';

// 🌟 editingItem을 props에 추가로 받아옵니다.
export default function AdminModal({ onClose, handleSave, editingItem }) {

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    section: '',
    professor: '',
    day1: '', day2: '',
    time1: '', time2: '',
    room1: '', room2: '',
  });

  // 🌟 수정 모드(editingItem이 있을 때)라면 모달이 열릴 때 기존 데이터를 폼에 채워줍니다.
  useEffect(() => {
    if (editingItem) {
      const s1 = editingItem.schedules?.[0] || {};
      const s2 = editingItem.schedules?.[1] || {};

      setFormData({
        code: editingItem.code || '',
        name: editingItem.name || '',
        section: editingItem.section || '',
        professor: editingItem.professor || '',
        day1: s1.day || editingItem.day || '',
        time1: s1.time || editingItem.time || '',
        room1: s1.room || editingItem.room || '',
        day2: s2.day || '',
        time2: s2.time || '',
        room2: s2.room || '',
      });
    }
  }, [editingItem]);

  function Accept() {
    const schedules = [
      { day: formData.day1, time: formData.time1, room: formData.room1 }
    ];

    if (formData.day2 && formData.day2.trim() !== "") {
      schedules.push({
        day: formData.day2,
        time: formData.time2,
        room: formData.room2
      });
    }

    const finalData = {
      code: formData.code,
      name: formData.name,
      section: formData.section,
      professor: formData.professor, // 교수 데이터도 패킹에 포함
      schedules: schedules 
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
        {/* 🌟 현재 모드에 따라 제목을 유연하게 변경합니다. */}
        <h2>{editingItem ? '강의 수정' : '새 강의 등록'}</h2>
        <div className="input-group">
          {/* 🌟 value 속성을 연결하여 상태값(formData)이 인풋창에 표시되도록 설정합니다. */}
          <input type="text" name="code" placeholder="과목코드" value={formData.code} onChange={handleChange} />
          <input type="text" name="section" placeholder="분반" value={formData.section} onChange={handleChange} />
          <input type="text" name="name" placeholder="과목명" value={formData.name} onChange={handleChange} />
          <input type="text" name="professor" placeholder="담당교수" value={formData.professor} onChange={handleChange} />

          <div className="modal-text">1개만 작성해도 된다면 xx2는 빈칸으로 작성</div>

          <div className="input-row">
            <input type="text" name="day1" placeholder="요일1" value={formData.day1} onChange={handleChange} />
            <input type="text" name="day2" placeholder="요일2" value={formData.day2} onChange={handleChange} />
          </div>

          <div className="input-row">
            <input type="text" name="time1" placeholder="시간1 (00:00 ~ 00:00)" value={formData.time1} onChange={handleChange} />
            <input type="text" name="time2" placeholder="시간2 (00:00 ~ 00:00)" value={formData.time2} onChange={handleChange} />
          </div>

          <div className="input-row">
            <input type="text" name="room1" placeholder="강의실1" value={formData.room1} onChange={handleChange} />
            <input type="text" name="room2" placeholder="강의실2" value={formData.room2} onChange={handleChange} />
          </div>
        </div>
        <div className="modal-btns">
          {/* 🌟 현재 모드에 따라 버튼 텍스트를 변경합니다. */}
          <button className="save-btn" onClick={Accept}>{editingItem ? '수정' : '등록'}</button>
          <button className="close-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}