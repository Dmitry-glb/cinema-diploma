import React, { useState, useEffect } from 'react';
import { request } from '../../../api';
import './ConfigHall.css';

const ConfigHall = ({ halls, onUpdate }) => {
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [rowCount, setRowCount] = useState('');
    const [placeCount, setPlaceCount] = useState('');
    const [config, setConfig] = useState([]);

    useEffect(() => {
        if (halls.length > 0 && !selectedHallId) {
            setSelectedHallId(halls[0].id);
        }
    }, [halls, selectedHallId]);

    useEffect(() => {
        const hall = halls.find(h => h.id === selectedHallId);
        if (hall) {
            setRowCount(hall.hall_rows);
            setPlaceCount(hall.hall_places);
            setConfig(hall.hall_config || []);
        }
    }, [selectedHallId, halls]);

    const updateConfigSize = (rows, places) => {
        const newConfig = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < places; j++) {
                if (config[i] && config[i][j]) {
                    row.push(config[i][j]);
                } else {
                    row.push('standart');
                }
            }
            newConfig.push(row);
        }
        setConfig(newConfig);
    };

    const handleSizeChange = (e) => {
        const { name, value } = e.target;
        const val = Number(value);

        if (name === 'rowCount') {
            setRowCount(val);
            updateConfigSize(val, placeCount);
        } else {
            setPlaceCount(val);
            updateConfigSize(rowCount, val);
        }
    };

    const handleSeatClick = (rowIndex, placeIndex) => {
        const newConfig = [...config];
        const currentRow = [...newConfig[rowIndex]];
        const currentType = currentRow[placeIndex];

        let nextType;
        if (currentType === 'standart') nextType = 'vip';
        else if (currentType === 'vip') nextType = 'disabled';
        else nextType = 'standart';

        currentRow[placeIndex] = nextType;
        newConfig[rowIndex] = currentRow;
        setConfig(newConfig);
    };

    const handleSave = () => {
        const body = new FormData();
        body.set('rowCount', rowCount);
        body.set('placeCount', placeCount);
        body.set('config', JSON.stringify(config));

        request(`hall/${selectedHallId}`, 'POST', body).then(data => {
            if (data.result) {
                alert('Конфигурация зала сохранена');
                onUpdate();
            }
        });
    };

    const handleCancel = () => {
        const hall = halls.find(h => h.id === selectedHallId);
        if (hall) {
            setRowCount(hall.hall_rows);
            setPlaceCount(hall.hall_places);
            setConfig(hall.hall_config || []);
        }
    };

    return (
        <div className="conf-step__wrapper">
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>

            <ul className="conf-step__selectors-box">
                {halls.map(hall => (
                    <li key={hall.id}>
                        <input
                            type="radio"
                            className="conf-step__radio"
                            name="config-hall"
                            value={hall.id}
                            checked={selectedHallId === hall.id}
                            onChange={() => setSelectedHallId(hall.id)}
                            id={`config-hall-${hall.id}`}
                        />
                        <label
                            className="conf-step__selector"
                            htmlFor={`config-hall-${hall.id}`}
                        >
                            {hall.hall_name}
                        </label>
                    </li>
                ))}
            </ul>

            <p className="conf-step__paragraph">Укажите количество рядов и мест в ряду:</p>

            <div className="conf-step__legend">
                <label className="conf-step__label">
                    Рядов, шт
                    <input
                        type="number"
                        className="conf-step__input"
                        name="rowCount"
                        value={rowCount}
                        onChange={handleSizeChange}
                        min="1"
                    />
                </label>
                <span className="multiplier">x</span>
                <label className="conf-step__label">
                    Мест, шт
                    <input
                        type="number"
                        className="conf-step__input"
                        name="placeCount"
                        value={placeCount}
                        onChange={handleSizeChange}
                        min="1"
                    />
                </label>
            </div>

            <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>

            <div className="conf-step__legend">
                <div className="conf-step__chair conf-step__chair_standart"></div> — обычные кресла
                <div className="conf-step__chair conf-step__chair_vip"></div> — VIP кресла
                <div className="conf-step__chair conf-step__chair_disabled"></div> — заблокированные (нет кресла)
            </div>
            <p className="conf-step__paragraph" style={{ fontSize: '12px', color: '#848484', marginTop: 0 }}>
                Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
            </p>

            <div className="conf-step__hall">
                <div className="conf-step__hall-wrapper">
                    <div className="conf-step__screen">Э К Р А Н</div>
                    {config.map((row, i) => (
                        <div key={i} className="conf-step__row">
                            {row.map((type, j) => (
                                <div
                                    key={j}
                                    className={`conf-step__chair conf-step__chair_${type}`}
                                    onClick={() => handleSeatClick(i, j)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="conf-step__buttons">
                <button className="conf-step__button-regular" onClick={handleCancel}>Отмена</button>
                <button className="conf-step__button-accent" onClick={handleSave}>Сохранить</button>
            </div>
        </div>
    );
};

export default ConfigHall;