import React, { useState } from 'react';
import { request } from '../../../api';
import { timeToMinutes } from '../../../utils';
import './AddSeanceModal.css';

const AddSeanceModal = ({ halls, films, seances, initialHallId, initialFilmId, onClose, onSuccess }) => {
    const [selectedHallId, setSelectedHallId] = useState(initialHallId || (halls[0] ? halls[0].id : ''));
    const [selectedFilmId, setSelectedFilmId] = useState(initialFilmId || (films[0] ? films[0].id : ''));
    const [time, setTime] = useState('00:00');

    const handleSubmit = (e) => {
        e.preventDefault();

        const hallId = Number(selectedHallId);
        const filmId = Number(selectedFilmId);
        const film = films.find(f => f.id === filmId);

        if (!film) return;

        const startMin = timeToMinutes(time);
        const endMin = startMin + film.film_duration;

        if (endMin > 1440) {
            alert('Ошибка: Сеанс заканчивается после 23:59. Выберите более раннее время.');
            return;
        }

        const hallSeances = seances.filter(s => s.seance_hallid === hallId);
        const hasOverlap = hallSeances.some(s => {
            const existingStart = timeToMinutes(s.seance_time);
            const existingFilm = films.find(f => f.id === s.seance_filmid);
            if (!existingFilm) return false;
            const existingEnd = existingStart + existingFilm.film_duration;
            return (startMin < existingEnd) && (endMin > existingStart);
        });

        if (hasOverlap) {
            alert('Ошибка: В этом зале уже есть сеанс в это время!');
            return;
        }

        const body = new FormData();
        body.set('seanceHallid', hallId);
        body.set('seanceFilmid', filmId);
        body.set('seanceTime', time);

        request('seance', 'POST', body).then(data => {
            if (data.result) {
                onSuccess();
                onClose();
            } else {
                alert('Ошибка: ' + data.error);
            }
        });
    };

    return (
        <div className="popup active">
            <div className="popup__content">
                <div className="popup__header">
                    <h2 className="popup__title">Добавление сеанса</h2>
                    <button className="popup__dismiss" onClick={onClose}>×</button>
                </div>
                <div className="popup__wrapper">
                    <form onSubmit={handleSubmit}>

                        <label className="conf-step__label conf-step__label-fullsize">
                            Название зала
                            <select
                                className="conf-step__input"
                                value={selectedHallId}
                                onChange={(e) => setSelectedHallId(e.target.value)}
                            >
                                {halls.map(h => (
                                    <option key={h.id} value={h.id}>{h.hall_name}</option>
                                ))}
                            </select>
                        </label>

                        <label className="conf-step__label conf-step__label-fullsize">
                            Название фильма
                            <select
                                className="conf-step__input"
                                value={selectedFilmId}
                                onChange={(e) => setSelectedFilmId(e.target.value)}
                            >
                                {films.map(f => (
                                    <option key={f.id} value={f.id}>{f.film_name}</option>
                                ))}
                            </select>
                        </label>

                        <label className="conf-step__label conf-step__label-fullsize">
                            Время начала
                            <input
                                className="conf-step__input"
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                required
                                onClick={(e) => {
                                    if (e.target.showPicker) e.target.showPicker();
                                }}
                            />
                        </label>

                        <div className="conf-step__buttons">
                            <button type="submit" className="conf-step__button-accent">Добавить</button>
                            <button type="button" className="conf-step__button-regular" onClick={onClose}>Отменить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSeanceModal;