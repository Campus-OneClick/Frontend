// CongestionBar.jsx
import React from 'react';
import './CongestionBar.css';

export function CongestionBar({ total, reserved, title = '혼잡도' }) {
    const percent = Math.floor((reserved / total) * 100);

    let barColor = '#4CAF50';
    if (percent >= 41 && percent <= 70) barColor = '#FFC107';
    if (percent >= 71) barColor = '#F44336';

    return (
        <div className="status_card">
            <h3 className="card_title">{title}</h3>
            <div className="progress_container">
                <div
                    className="progress_fill"
                    style={{ width: `${percent}%`, backgroundColor: barColor }}
                />
            </div>
            <div className="status_txt_row">
                <span className="percent_text" style={{ color: barColor }}>{percent}%</span>
                <span className="count_text">{reserved} / {total}석</span>
            </div>
        </div>
    );
}
