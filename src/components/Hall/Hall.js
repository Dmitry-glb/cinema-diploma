import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { request } from '../../api';
import './Hall.css';

const Hall = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { film, seance, selectedDate } = location.state || {};

    const [config, setConfig] = useState([]);
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hallData, setHallData] = useState(null);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (!seance || !selectedDate) {
            navigate('/');
        }

        const dateStr = formatDate(selectedDate);

        request(`hallconfig?seanceId=${id}&date=${dateStr}`)
            .then(data => {
                if (data.result) {
                    setConfig(data.result);
                }
            });

        request('alldata')
            .then(data => {
                if (data.result) {
                    const currentHall = data.result.halls.find(h => h.id === seance.seance_hallid);
                    setHallData(currentHall);
                }
                setLoading(false);
            });

    }, [id, selectedDate, seance, navigate]);

    const handleSeatClick = (rowIndex, placeIndex, type) => {
        if (type === 'disabled' || type === 'taken') return;

        const seatId = `${rowIndex}-${placeIndex}`;
        const isSelected = selectedPlaces.some(p => p.id === seatId);

        if (isSelected) {
            setSelectedPlaces(prev => prev.filter(p => p.id !== seatId));
        } else {
            const price = type === 'vip' ? hallData.hall_price_vip : hallData.hall_price_standart;
            setSelectedPlaces(prev => [...prev, {
                id: seatId,
                row: rowIndex + 1,
                place: placeIndex + 1,
                price: price,
                type: type
            }]);
        }
    };

    const handleBook = () => {
        navigate('/payment', {
            state: {
                film,
                seance,
                selectedDate,
                selectedPlaces,
                hallData,
                totalPrice: selectedPlaces.reduce((acc, p) => acc + p.price, 0)
            }
        });
    };

    if (loading || !hallData) {
        return <div className="hall-page__loading">Загрузка...</div>;
    }

    return (
        <div className="hall-page">
            <div className="hall-page__info">
                <h2 className="hall-page__title">{film.film_name}</h2>
                <p className="hall-page__details">
                    Начало сеанса: {seance.seance_time}, {hallData.hall_name}
                </p>
            </div>

            <div className="hall-config">
                <div className="hall-config__screen"></div>
                <div className="hall-config__places">
                    {config.map((row, rowIndex) => (
                        <div key={rowIndex} className="hall-config__row">
                            {row.map((type, placeIndex) => {
                                const seatId = `${rowIndex}-${placeIndex}`;
                                const isSelected = selectedPlaces.some(p => p.id === seatId);

                                return (
                                    <div
                                        key={placeIndex}
                                        className={`hall-config__seat hall-config__seat_${type} ${isSelected ? 'hall-config__seat_selected' : ''}`}
                                        onClick={() => handleSeatClick(rowIndex, placeIndex, type)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="hall-legend">
                <div className="hall-legend__item">
                    <div className="hall-config__seat hall-config__seat_standart"></div>
                    <span>Свободно ({hallData.hall_price_standart}₽)</span>
                </div>
                <div className="hall-legend__item">
                    <div className="hall-config__seat hall-config__seat_vip"></div>
                    <span>VIP ({hallData.hall_price_vip}₽)</span>
                </div>
                <div className="hall-legend__item">
                    <div className="hall-config__seat hall-config__seat_taken"></div>
                    <span>Занято</span>
                </div>
                <div className="hall-legend__item">
                    <div className="hall-config__seat hall-config__seat_selected"></div>
                    <span>Выбрано</span>
                </div>
            </div>

            {selectedPlaces.length > 0 && (
                <button className="hall-page__book-btn" onClick={handleBook}>
                    Забронировать
                </button>
            )}
        </div>
    );
};

export default Hall;