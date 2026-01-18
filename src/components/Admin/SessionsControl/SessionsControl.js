import React, { useState } from 'react';
import { request } from '../../../api';
import { timeToMinutes } from '../../../utils';
import AddFilmModal from '../AddFilmModal/AddFilmModal';
import AddSeanceModal from '../AddSeanceModal/AddSeanceModal';
import './SessionsControl.css';

const SessionsControl = ({ halls, films, seances, onUpdate }) => {
    const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);
    const [isSeanceModalOpen, setIsSeanceModalOpen] = useState(false);

    const [selectedHallId, setSelectedHallId] = useState(null);
    const [selectedFilmId, setSelectedFilmId] = useState(null);
    const [draggedFilmId, setDraggedFilmId] = useState(null);
    const [draggedSeanceId, setDraggedSeanceId] = useState(null);

    const handleDeleteFilm = (id) => {
        if (window.confirm('Удалить фильм и все его сеансы?')) {
            request(`film/${id}`, 'DELETE').then(data => {
                if (data.result) onUpdate();
            });
        }
    };

    const handleDragStartFilm = (e, filmId) => {
        setDraggedFilmId(filmId);
        setDraggedSeanceId(null);
        e.dataTransfer.effectAllowed = 'copy';
        e.target.style.opacity = '0.5';
    };

    const handleDragEndFilm = (e) => {
        e.target.style.opacity = '1';
    };

    const handleDragStartSeance = (e, seanceId) => {
        setDraggedSeanceId(seanceId);
        setDraggedFilmId(null);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropTimeline = (e, hallId) => {
        e.preventDefault();
        if (draggedFilmId) {
            setSelectedHallId(hallId);
            setSelectedFilmId(draggedFilmId);
            setIsSeanceModalOpen(true);
        }
    };

    const handleDropTrash = (e) => {
        e.preventDefault();
        if (draggedSeanceId) {
            if (window.confirm("Удалить сеанс?")) {
                request(`seance/${draggedSeanceId}`, 'DELETE').then(data => {
                    if (data.result) onUpdate();
                });
            }
        }
    };

    const handleSave = () => {
        alert('Сетка сеансов сохранена!');
        onUpdate();
    };

    const bgColors = ['#CAE5CD', '#BDE0FB', '#D1C4E9', '#FFF9C4', '#FFCCBC'];

    return (
        <div className="conf-step__wrapper">
            <p className="conf-step__paragraph">
                <button className="conf-step__button conf-step__button-accent" onClick={() => setIsFilmModalOpen(true)}>
                    ДОБАВИТЬ ФИЛЬМ
                </button>
            </p>

            <div className="conf-step__movies">
                {films.map((film, index) => (
                    <div
                        key={film.id}
                        className="conf-step__movie"
                        draggable
                        onDragStart={(e) => handleDragStartFilm(e, film.id)}
                        onDragEnd={handleDragEndFilm}
                        style={{ backgroundColor: bgColors[index % bgColors.length] }}
                    >
                        <img src={film.film_poster} alt="poster" className="conf-step__movie-poster" />
                        <div className="conf-step__movie-info">
                            <div className="conf-step__movie-title">{film.film_name}</div>
                            <div className="conf-step__movie-duration">{film.film_duration} минут</div>
                        </div>
                        <button className="conf-step__button-trash delete-film-btn" onClick={() => handleDeleteFilm(film.id)}>
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="conf-step__seances">
                {halls.map(hall => (
                    <div key={hall.id} className="conf-step__seances-hall">
                        <h3 className="conf-step__seances-title">{hall.hall_name}</h3>
                        <div className="conf-step__seances-timeline-wrapper">
                            <div
                                className="conf-step__seances-timeline"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropTimeline(e, hall.id)}
                            >
                                {seances
                                    .filter(s => s.seance_hallid === hall.id)
                                    .map(s => {
                                        const film = films.find(f => f.id === s.seance_filmid);
                                        if (!film) return null;

                                        const startMin = timeToMinutes(s.seance_time);
                                        const widthPercent = (film.film_duration / 1440) * 100;
                                        const leftPercent = (startMin / 1440) * 100;
                                        const filmIndex = films.findIndex(f => f.id === film.id);
                                        const bgColor = bgColors[filmIndex % bgColors.length];

                                        return (
                                            <div
                                                key={s.id}
                                                className="conf-step__seances-movie"
                                                draggable
                                                onDragStart={(e) => handleDragStartSeance(e, s.id)}
                                                style={{
                                                    width: `${widthPercent}%`,
                                                    left: `${leftPercent}%`,
                                                    backgroundColor: bgColor
                                                }}
                                                title={`${film.film_name}\nНачало: ${s.seance_time}`}
                                            >
                                                <p className="conf-step__seances-movie-title">{film.film_name}</p>
                                                <p className="conf-step__seances-movie-start">{s.seance_time}</p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="conf-step__buttons">
                <button className="conf-step__button-regular" onClick={() => window.location.reload()}>Отмена</button>
                <button className="conf-step__button-accent" onClick={handleSave}>Сохранить</button>
            </div>

            {draggedSeanceId && (
                <div
                    className="conf-step__trash-zone"
                    onDragOver={handleDragOver}
                    onDrop={handleDropTrash}
                >
                    🗑 Удалить сеанс
                </div>
            )}

            {isFilmModalOpen && <AddFilmModal onClose={() => setIsFilmModalOpen(false)} onSuccess={onUpdate} />}
            {isSeanceModalOpen && (
                <AddSeanceModal
                    halls={halls}
                    films={films}
                    seances={seances}
                    initialHallId={selectedHallId}
                    initialFilmId={selectedFilmId}
                    onClose={() => setIsSeanceModalOpen(false)}
                    onSuccess={onUpdate}
                />
            )}
        </div>
    );
};

export default SessionsControl;