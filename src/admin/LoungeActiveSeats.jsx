import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL;

function formatRemaining(minutes) {
  if (minutes <= 0) return '만료';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

export default function LoungeActiveSeats() {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActive = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/seats/admin/active`);
      setSeats(res.data);
    } catch (e) {
      console.error('활성 좌석 조회 실패', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActive();
    const timer = setInterval(fetchActive, 30000);
    return () => clearInterval(timer);
  }, [fetchActive]);

  const handleForceRelease = async (lounge, seatId, studentId) => {
    if (!window.confirm(`${lounge === 'center' ? '중앙' : '사이드'} 라운지 ${seatId}번 좌석(${studentId})을 강제 해제하시겠습니까?`)) return;
    try {
      await axios.post(`${API}/seats/admin/force-release`, { lounge, seatId });
      alert('좌석이 강제 해제되었습니다.');
      fetchActive();
    } catch (e) {
      alert(e?.response?.data?.message || '강제 해제에 실패했습니다.');
    }
  };

  if (loading) return <div style={{ padding: '20px', color: '#888' }}>불러오는 중...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 12px' }}>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          현재 사용 중인 좌석: <strong>{seats.length}석</strong> &nbsp;(30초마다 자동 갱신)
        </span>
        <button
          onClick={fetchActive}
          style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#f9fafb', cursor: 'pointer' }}
        >
          새로고침
        </button>
      </div>

      {seats.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
          현재 사용 중인 좌석이 없습니다.
        </div>
      ) : (
        <div className="reservation-row header" style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1.5fr' }}>
          <div>라운지 / 좌석</div>
          <div>사용자</div>
          <div>시작 시간</div>
          <div>남은 시간</div>
          <div>관리</div>
        </div>
      )}

      {seats.map((seat) => (
        <div
          key={`${seat.lounge}-${seat.seatId}`}
          className="reservation-row"
          style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1.5fr' }}
        >
          <div className="col-user-room">
            <span className="user-name">{seat.lounge === 'center' ? '중앙 라운지' : '사이드 라운지'}</span>
            <span className="room-name">{seat.seatId}번 좌석</span>
          </div>

          <div className="col-user-room">
            <span className="user-name">{seat.studentId}</span>
            {seat.name && <span className="room-name">{seat.name}</span>}
          </div>

          <span style={{ fontSize: '13px', color: '#4b5563', alignSelf: 'center' }}>
            {seat.startTime ? seat.startTime.slice(11, 16) : '-'}
          </span>

          <span style={{
            fontWeight: '600', alignSelf: 'center',
            color: seat.remainingMinutes <= 30 ? '#dc2626' : '#15803d'
          }}>
            {formatRemaining(seat.remainingMinutes)}
          </span>

          <div className="col-actions">
            <button
              className="reject-btn"
              onClick={() => handleForceRelease(seat.lounge, seat.seatId, seat.studentId)}
            >
              강제 해제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
