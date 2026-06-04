export default function AdminControl({ handleText, AddSchedule, onDeleteSelected, openRoomManager }){
  return(
    <div className="admin-header">
      <div className="search-group">
        <input type="text" placeholder="과목명 또는 교수 검색" className="search-input" onChange={handleText} />
      </div>
      <div className="action-group">
        <button className="room-btn" onClick={openRoomManager} style={{ backgroundColor: '#666', color: '#fff' }}>강의실 관리</button>
        <button className="reg-btn" onClick={AddSchedule}>시간표 등록</button>
        <button className="del-btn" onClick={onDeleteSelected}>일괄 삭제</button>
      </div>
    </div>
  );
}