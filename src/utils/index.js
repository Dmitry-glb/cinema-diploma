export const getDays = (startOffset = 0) => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + startOffset + i);

        const dayOfWeek = day.toLocaleString('ru-RU', { weekday: 'short' });

        const isToday = (day.getDate() === new Date().getDate()) &&
            (day.getMonth() === new Date().getMonth());

        days.push({
            date: day,
            dayOfWeek: isToday ? 'Сегодня' : `${dayOfWeek},`,
            dayNumber: isToday ? `${dayOfWeek}, ${day.getDate()}` : day.getDate(),
            isWeekend: dayOfWeek === 'сб' || dayOfWeek === 'вс',
            timestamp: day.setHours(0, 0, 0, 0)
        });
    }
    return days;
};

export const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};