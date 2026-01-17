import React, { useState } from 'react';
import { request } from '../../../api';
import './AddHallModal.css';

const AddHallModal = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) return;

        const body = new FormData();
        body.set('hallName', name);

        request('hall', 'POST', body).then(data => {
            if (data.result) {
                onSuccess();
                onClose();
            } else {
                alert('Ошибка при создании зала');
            }
        });
    };

    return (
        <div className="popup active">
            <div className="popup__content">
                <div className="popup__header">
                    <h2 className="popup__title">Добавление зала</h2>
                    <button className="popup__dismiss" onClick={onClose}>×</button>
                </div>
                <div className="popup__wrapper">
                    <form onSubmit={handleSubmit}>
                        <label className="conf-step__label conf-step__label-fullsize">
                            Название зала
                            <input
                                className="conf-step__input"
                                type="text"
                                placeholder="Например, «Зал 1»"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </label>
                        <div className="conf-step__buttons text-center">
                            <button type="submit" className="conf-step__button-accent">
                                Добавить зал
                            </button>
                            <button type="button" className="conf-step__button-regular" onClick={onClose}>
                                Отменить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddHallModal;