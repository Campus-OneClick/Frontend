import './AdminTable.css'

export default function AdminTable({ 
  filteredSchedules, 
  onEdit, 
  onDelete, 
  selectedIds, 
  onSelectToggle, 
  onSelectAll 
}) {

  const isAllSelected = filteredSchedules.length > 0 && filteredSchedules.every((sch) => selectedIds.includes(sch.scheduleId));

  return (
    <div>
      <div className='admin-outline'>
        <input 
          type="checkbox" 
          checked={isAllSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
        <div className='ouline-text'>시간표 ID</div>
        <div className='ouline-text'>과목명</div>
        <div className='ouline-text'>담당교수</div>
        <div>강의시간(강의실)</div>
        <div className='ouline-text'>비고</div>
      </div>

      <div>
        {filteredSchedules && filteredSchedules.map((sch) => (
          <div className='title-outline' key={sch.scheduleId}>
            <input 
              type="checkbox" 
              checked={selectedIds.includes(sch.scheduleId)}
              onChange={() => onSelectToggle(sch.scheduleId)}
            />
            
            <div className='ouline-text'>{sch.scheduleId}</div>
            <div>{sch.subject}</div>
            <div className='ouline-text'>{sch.professor || '-'}</div>

            <div>
              {sch.day ? `${sch.day} (${sch.startTime} ~ ${sch.endTime}) / ${sch.classroomEntity?.classroomId || sch.classroomId || '-'}` : '-'}
            </div>

            <div>
              <button className="edit-btn" onClick={() => onEdit(sch)}>수정</button>
              <button className='del-btn' onClick={() => onDelete(sch.scheduleId)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}