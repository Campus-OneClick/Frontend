import { useState, useEffect } from "react";
import './AdminModal.css';

//  editingItem을 props에 추가로 받아옵니다.
export default function AdminModal({ onClose, handleSave, editingItem }) {

  const [formData, setFormData] = useState({
    name: '',
    professor: '',
    day1: '', day2: '',
    time1: '', time2: '',
    room1: '', room2: '',
  });

  // 수정 모드(editingItem이 있을 때)라면 모달이 열릴 때 기존 데이터를 폼에 채워줍니다.
  useEffect(() => {
    if (editingItem) {
      const s1 = editingItem.schedules?.[0] || {};
      const s2 = editingItem.schedules?.[1] || {};

      setFormData({
        name: editingItem.name || '',
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

  // 💡 엔터키 조작 로직 추가
  function handleKeyDown(e, nextFieldName) {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 눌렀을 때 폼이 멋대로 제출되는 것 방지
      
      if (nextFieldName === 'submit') {
        // 마지막 칸(room2)에서 엔터를 치면 등록 실행!
        Accept();
      } else {
        // 그 외의 칸에서는 지정된 다음 input 창으로 포커스 이동
        const nextInput = document.querySelector(`input[name="${nextFieldName}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  }

  function Accept() {
    const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]) ~ (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    // 2. 시간1 검사
    if (!timePattern.test(formData.time1)) {
      alert("시간1 형식이 올바르지 않습니다. (예: 09:00 ~ 10:15)");
      return; // 여기서 함수 종료 (저장 안 됨)
    }
    // 3. 시간2가 입력되어 있다면 검사
    if (formData.time2 && formData.time2.trim() !== "" && !timePattern.test(formData.time2)) {
      alert("시간2 형식이 올바르지 않습니다. (예: 10:30 ~ 11:45)");
      return; // 여기서 함수 종료 (저장 안 됨)
    }

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
      name: formData.name,
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
        <h2>{editingItem ? '강의 수정' : '새 강의 등록'}</h2>
        <div className="input-group">
          
          <input type="text" name="name" placeholder="과목명" value={formData.name} onChange={handleChange} 
            onKeyDown={(e) => handleKeyDown(e, 'professor')} 
          />
          <input type="text" name="professor" placeholder="담당교수" value={formData.professor} onChange={handleChange} 
            onKeyDown={(e) => handleKeyDown(e, 'day1')} 
          />

          <div className="modal-text">1개만 작성해도 된다면 xx2는 빈칸으로 작성</div>

          <div className="input-row">
            <input type="text" name="day1" placeholder="요일1" value={formData.day1} onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, 'day2')} 
            />
            <input type="text" name="day2" placeholder="요일2" value={formData.day2} onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, 'time1')} 
            />
          </div>

          <div className="input-row">
            <input type="text" name="time1" placeholder="시간1 (00:00 ~ 00:00)" value={formData.time1} onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, 'time2')} 
            />
            <input type="text" name="time2" placeholder="시간2 (00:00 ~ 00:00)" value={formData.time2} onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, 'room1')} 
            />
          </div>

          <div className="input-row">
            <input type="text" name="room1" placeholder="강의실1" value={formData.room1} onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, 'room2')} 
            />
            <input type="text" name="room2" placeholder="강의실2" value={formData.room2} onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, 'submit')} 
            />
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