import './AdminTable.css'

// 삭제와 체크박스 관련 props를 모두 받아옵니다.
export default function AdminTable({ 
  filteredSchedule, 
  onEdit, 
  onDelete, 
  selectedCodes, 
  onSelectToggle, 
  onSelectAll 
}) {

  // 현재 필터링된 항목이 모두 체크되어 있는지 확인 (전체 선택 체크박스용)
  const isAllSelected = filteredSchedule.length > 0 && filteredSchedule.every(sch => selectedCodes.includes(sch.code));

  return (
    <div>
      <div className='admin-outline'>
        {/* 헤더의 전체 선택 체크박스 연결 */}
        <input 
          type="checkbox" 
          checked={isAllSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
        <div className='ouline-text'>과목명</div>
        <div className='ouline-text'>담당교수</div>
        <div>강의시간(강의실)</div>
        <div className='ouline-text'>비고</div>
      </div>

      <div>
        {filteredSchedule && filteredSchedule.map((sch) => (
          <div className='title-outline' key={sch.code}>
            {/* 각 행의 개별 체크박스 연결 */}
            <input 
              type="checkbox" 
              checked={selectedCodes.includes(sch.code)}
              onChange={() => onSelectToggle(sch.code)}
            />
            
            <div>{sch.name}</div>
            <div className='ouline-text'>{sch.professor || '-'}</div>

            <div>
              {sch.schedules ? (
                sch.schedules.map((s, idx) => (
                  <div key={idx}>{s.day} ({s.time}) / {s.room}</div>
                ))
              ) : (
                sch.day ? `${sch.day} (${sch.time}) / ${sch.room}` : '-'
              )}
            </div>

            <div>
              <button className="edit-btn" onClick={() => onEdit(sch)}>수정</button>
              {/* 개별 삭제 버튼에 삭제 함수 연결 */}
              <button className='del-btn' onClick={() => onDelete(sch.code)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}