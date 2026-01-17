import React, { useState, useEffect } from 'react';
import { request } from '../../../api';
import './PricesControl.css';

const PricesControl = ({ halls, onUpdate }) => {
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [priceStandart, setPriceStandart] = useState('');
    const [priceVip, setPriceVip] = useState('');

    useEffect(() => {
        if (halls.length > 0 && !selectedHallId) {
            setSelectedHallId(halls[0].id);
        }
    }, [halls, selectedHallId]);

    useEffect(() => {
        const hall = halls.find(h => h.id === selectedHallId);
        if (hall) {
            setPriceStandart(hall.hall_price_standart || 0);
            setPriceVip(hall.hall_price_vip || 0);
        }
    }, [selectedHallId, halls]);

    const handleSave = () => {
        const body = new FormData();
        body.set('priceStandart', priceStandart);
        body.set('priceVip', priceVip);

        request(`price/${selectedHallId}`, 'POST', body).then(data => {
            if (data.result) {
                alert('Цены успешно сохранены');
                onUpdate();
            }
        });
    };

    const handleCancel = () => {
        const hall = halls.find(h => h.id === selectedHallId);
        if (hall) {
            setPriceStandart(hall.hall_price_standart || 0);
            setPriceVip(hall.hall_price_vip || 0);
        }
    };

    if (halls.length === 0) return <p className="conf-step__paragraph">Нет доступных залов</p>;

    return (
        <div className="conf-step__wrapper">
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>

            <ul className="conf-step__selectors-box">
                {halls.map(hall => (
                    <li key={hall.id}>
                        <input
                            type="radio"
                            className="conf-step__radio"
                            name="prices-hall"
                            value={hall.id}
                            checked={selectedHallId === hall.id}
                            onChange={() => setSelectedHallId(hall.id)}
                            id={`price-hall-${hall.id}`}
                        />
                        <label
                            className="conf-step__selector"
                            htmlFor={`price-hall-${hall.id}`}
                        >
                            {hall.hall_name}
                        </label>
                    </li>
                ))}
            </ul>

            <p className="conf-step__paragraph">Установите цены для типов кресел:</p>

            <div className="conf-step__legend">
                <div className="conf-step__label">
                    <span>Цена, рублей</span>
                    <input
                        type="number"
                        className="conf-step__input"
                        value={priceStandart}
                        onChange={(e) => setPriceStandart(e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div className="conf-step__hint">
                    за <span className="conf-step__chair conf-step__chair_standart"></span> обычные кресла
                </div>
            </div>

            <div className="conf-step__legend">
                <div className="conf-step__label">
                    <span>Цена, рублей</span>
                    <input
                        type="number"
                        className="conf-step__input"
                        value={priceVip}
                        onChange={(e) => setPriceVip(e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div className="conf-step__hint">
                    за <span className="conf-step__chair conf-step__chair_vip"></span> VIP кресла
                </div>
            </div>

            <div className="conf-step__buttons">
                <button
                    className="conf-step__button-regular"
                    onClick={handleCancel}
                >
                    Отмена
                </button>
                <button
                    className="conf-step__button-accent"
                    onClick={handleSave}
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default PricesControl;