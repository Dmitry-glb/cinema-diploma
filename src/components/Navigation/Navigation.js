import React from 'react';
import './Navigation.css';

const Navigation = ({ days, selectedDay, onSelectDay, onNextDays }) => {
    return (
        <nav className="page-nav">
            {days.map((day) => {
                const isSelected = selectedDay === day.timestamp;

                return (
                    <div
                        key={day.timestamp}
                        className={`page-nav__day ${isSelected ? 'page-nav__day_chosen' : ''} ${day.isWeekend ? 'page-nav__day_weekend' : ''}`}
                        onClick={() => onSelectDay(day.timestamp)}
                    >
                        <span className="page-nav__day-week">{day.dayOfWeek}</span>
                        <span className="page-nav__day-number">{day.dayNumber}</span>
                    </div>
                );
            })}

            <div className="page-nav__day page-nav__day_next" onClick={onNextDays}>
                <span>&gt;</span>
            </div>
        </nav>
    );
};

export default Navigation;