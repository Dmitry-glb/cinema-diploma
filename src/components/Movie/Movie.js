import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Movie.css';

const Movie = ({ film, halls, seances, selectedDay }) => {
    const navigate = useNavigate();

    const filmSeances = seances.filter(seance =>
        seance.seance_filmid === film.id &&
        halls.some(hall => hall.id === seance.seance_hallid && hall.hall_open === 1)
    );

    if (filmSeances.length === 0) return null;

    const seancesByHall = {};
    halls.forEach(hall => {
        if (hall.hall_open === 0) return;
        const hallSeances = filmSeances.filter(s => s.seance_hallid === hall.id);
        if (hallSeances.length > 0) {
            seancesByHall[hall.hall_name] = hallSeances.sort((a, b) => a.seance_time.localeCompare(b.seance_time));
        }
    });

    const checkIsPast = (seanceTime) => {
        const today = new Date();
        const selectedDate = new Date(selectedDay);
        const isToday = today.getDate() === selectedDate.getDate() &&
            today.getMonth() === selectedDate.getMonth() &&
            today.getFullYear() === selectedDate.getFullYear();
        if (!isToday) return false;
        const [hours, minutes] = seanceTime.split(':').map(Number);
        const seanceDate = new Date();
        seanceDate.setHours(hours, minutes, 0, 0);
        return seanceDate < today;
    };

    const handleSeanceClick = (seance) => {
        navigate(`/hall/${seance.id}`, { state: { seance, film, selectedDate: selectedDay } });
    };

    return (
        <section className="movie">
            <div className="movie__poster">
                <img className="movie__poster-image" alt={film.film_name} src={film.film_poster} />
            </div>

            <div className="movie__description">
                <div className="movie__header">
                    <h2 className="movie__title">{film.film_name}</h2>
                    <p className="movie__synopsis">{film.film_description}</p>
                    <p className="movie__data">
                        <span className="movie__data-duration">{film.film_duration} мин.</span>
                        <span className="movie__data-origin">{film.film_origin}</span>
                    </p>
                </div>

                <div className="movie__seances-list">
                    {Object.keys(seancesByHall).map(hallName => (
                        <div className="movie-seances__hall" key={hallName}>
                            <h3 className="movie-seances__hall-title">{hallName}</h3>
                            <ul className="movie-seances__list">
                                {seancesByHall[hallName].map(seance => {
                                    const isPast = checkIsPast(seance.seance_time);
                                    return (
                                        <li className="movie-seances__time-block" key={seance.id}>
                                            <button
                                                className={`movie-seances__time ${isPast ? 'movie-seances__time_disabled' : ''}`}
                                                onClick={() => !isPast && handleSeanceClick(seance)}
                                                disabled={isPast}
                                            >
                                                {seance.seance_time}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Movie;