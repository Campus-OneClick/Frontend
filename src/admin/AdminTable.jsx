export default function AdminTable({ 
  filteredSchedule, 
  onEdit, 
  onDelete, 
  selectedCodes, 
  onSelectToggle, 
  onSelectAll 
}) {

  const isAllSelected = filteredSchedule.length > 0 && 
    filteredSchedule.every(sch => selectedCodes.includes(sch.scheduleId));

  return (
    <div>
      <div className='admin-outline'>
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
          <div className='title-outline' key={sch.scheduleId}>
            <input 
              type="checkbox" 
              checked={selectedCodes.includes(sch.scheduleId)}
              onChange={() => onSelectToggle(sch.scheduleId)}
            />
            
            <div>{sch.subject}</div>
            <div className='ouline-text'>{sch.professor || '-'}</div>

            <div>
              {sch.day} ({sch.startTime} ~ {sch.endTime}) / {sch.classroomEntity?.roomName || '-'}
            </div>
            
            <div>
              <button className="edit-btn" onClick={() => onEdit(sch)}>수정</button>
              <button className='del-btn' onClick={() => onDelete(sch)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
