import React, { useState, useEffect } from 'react';
import { request } from '../../../api';
import './SalesControl.css';

const SalesControl = ({ halls, onUpdate }) => {
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [localStatus, setLocalStatus] = useState(null);

    useEffect(() => {
        if (halls.length > 0 && !selectedHallId) {
            setSelectedHallId(halls[0].id);
        }
    }, [halls, selectedHallId]);

    useEffect(() => {
        setLocalStatus(null);
    }, [selectedHallId]);

    const toggleSales = (openStatus) => {
        const hall = halls.find(h => h.id === selectedHallId);

        if (openStatus && (!hall.hall_config || hall.hall_config.length === 0)) {
            alert('Сначала сконфигурируйте зал (ряды и места)!');
            return;
        }

        const priceStandart = hall.hall_price_standart || 0;
        const priceVip = hall.hall_price_vip || 0;
        if (openStatus && priceStandart === 0 && priceVip === 0) {
            alert('Нельзя открыть продажи: не установлены цены!');
            return;
        }

        const body = new FormData();
        body.set('hallOpen', openStatus ? '1' : '0');

        setLocalStatus(openStatus);

        request(`open/${selectedHallId}`, 'POST', body)
            .then(data => {
                if (data.result) {
                    setTimeout(() => {
                        onUpdate();
                    }, 500);
                } else {
                    setLocalStatus(!openStatus);
                    alert('Ошибка сервера: ' + data.error);
                }
            })
            .catch(() => {
                setLocalStatus(!openStatus);
                alert('Ошибка сети');
            });
    };

    const selectedHall = halls.find(h => h.id === selectedHallId);
    if (!selectedHall) return null;
    const isHallOpenServer = Number(selectedHall.hall_open) === 1;
    const isOpen = localStatus !== null ? localStatus : isHallOpenServer;

    return (
        <div className="conf-step__wrapper">
            <p className="conf-step__paragraph">Выберите зал для настройки продаж:</p>
            <ul className="conf-step__selectors-box">
                {halls.map(hall => (
                    <li key={hall.id}>
                        <input
                            type="radio"
                            className="conf-step__radio"
                            name="sales-hall"
                            value={hall.id}
                            checked={selectedHallId === hall.id}
                            onChange={() => setSelectedHallId(hall.id)}
                        />
                        <span
                            className="conf-step__selector"
                            onClick={() => setSelectedHallId(hall.id)}
                        >
                            {hall.hall_name}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="sales-control__content">
                <p className="conf-step__paragraph">
                    {isOpen
                        ? <span className="sales-control__status sales-control__status_active">Продажи открыты</span>
                        : <span className="sales-control__status">Всё готово к открытию</span>
                    }
                </p>

                {isOpen ? (
                    <button
                        className="conf-step__button conf-step__button-accent"
                        style={{ backgroundColor: '#e74c3c' }}
                        onClick={() => toggleSales(false)}
                    >
                        Приостановить продажу билетов
                    </button>
                ) : (
                    <button
                        className="conf-step__button conf-step__button-accent"
                        onClick={() => toggleSales(true)}
                    >
                        Открыть продажу билетов
                    </button>
                )}
            </div>
        </div>
    );
};

export default SalesControl;