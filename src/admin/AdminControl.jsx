import './AdminMain.css';

// 🌟 onDeleteSelected를 추가로 받아옵니다.
export default function AdminControl({ handleText, AddSchedule, onDeleteSelected }){

  return(
    <div>
      <div className="admin-header">
        <div className="search-group">
          <input 
            type="text" 
            placeholder="과목명 또는 강의실 검색" 
            className="search-input" 
            onChange={handleText} 
          />
          <button className="search-btn">검색</button>
        </div>
        <div className="action-group">
          <button className="reg-btn" onClick={AddSchedule}>등록</button>
          {/* 🌟 상단 삭제 버튼에 일괄 삭제 함수 연결 */}
          <button className="del-btn" onClick={onDeleteSelected}>삭제</button>
        </div>
      </div>
    </div>
  );
}