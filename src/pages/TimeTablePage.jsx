import { useNavigate, useParams } from "react-router-dom";
import "./TimeTable.css";

export default function TimeTablePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const days = ["월", "화", "수", "목", "금"];
  const hours = Array.from({ length: 11 }, (_, i) => 9 + i); // 9~19

  // 클릭 시 API 호출
  const handleClick = async (day, hour) => {
    const dayMap = {
      "월": "MON",
      "화": "TUE",
      "수": "WED",
      "목": "THU",
      "금": "FRI",
    };

    const apiDay = dayMap[day];

    try {
      const res = await fetch(
        `/classrooms/empty?day=${apiDay}&time=${hour}:00`
      );

      const data = await res.json();

      // data = 빈 강의실 리스트라고 가정
      const isEmpty = data.includes(roomId);

      if (isEmpty) {
        alert("예약이 가능합니다.");
        // 여기서 예약 페이지로 이동 가능
        // navigate(`/reserve/${roomId}?day=${apiDay}&time=${hour}`);
      } else {
        alert("예약이 불가능합니다.");
      }

    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  return (
    <div className="tt_container">

      {/* 헤더 */}
      <div className="tt_header">
        <h2>강의실 {roomId} 시간표</h2>
        <button onClick={() => navigate("/")}>돌아가기</button>
      </div>

      {/* 그리드 */}
      <div className="tt_grid">

        {/* 좌상단 빈칸 */}
        <div className="tt_cell tt_head"></div>

        {/* 요일 */}
        {days.map((day) => (
          <div key={day} className="tt_cell tt_head">
            {day}
          </div>
        ))}

        {/* 시간표 */}
        {hours.map((hour) => (
          <div key={hour} className="tt_row">

            {/* 시간 */}
            <div className="tt_cell tt_time">{hour}:00</div>

            {/* 각 칸 */}
            {days.map((day) => (
              <div
                key={day + hour}
                className="tt_cell tt_block"
                onClick={() => handleClick(day, hour)}
              />
            ))}

          </div>
        ))}

      </div>
    </div>
  );
}