import React, { useState } from 'react';
import { request } from '../../../api';
import './AddFilmModal.css';

const AddFilmModal = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [origin, setOrigin] = useState('');
    const [poster, setPoster] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Number(duration) <= 0) {
            alert('Продолжительность фильма должна быть больше 0 минут!');
            return;
        }

        const body = new FormData();
        body.set('filmName', name);
        body.set('filmDuration', duration);
        body.set('filmDescription', description);
        body.set('filmOrigin', origin);
        body.set('filePoster', poster);

        request('film', 'POST', body).then(data => {
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
                    <h2 className="popup__title">Добавление фильма</h2>
                    <button className="popup__dismiss" onClick={onClose}>×</button>
                </div>
                <div className="popup__wrapper">
                    <form onSubmit={handleSubmit}>
                        <label className="conf-step__label conf-step__label-fullsize">
                            Название фильма
                            <input
                                className="conf-step__input"
                                type="text"
                                placeholder="Например, «Гражданин Кейн»"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="conf-step__label conf-step__label-fullsize">
                            Длительность фильма (мин)
                            <input
                                className="conf-step__input"
                                type="number"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                required
                                min="1"
                            />
                        </label>

                        <label className="conf-step__label conf-step__label-fullsize">
                            Описание
                            <textarea
                                className="conf-step__input"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </label>

                        <label className="conf-step__label conf-step__label-fullsize">
                            Страна
                            <input
                                className="conf-step__input"
                                type="text"
                                value={origin}
                                onChange={e => setOrigin(e.target.value)}
                                required
                            />
                        </label>

                        <label className="conf-step__label conf-step__label-fullsize">
                            Постер (PNG, до 3Мб)
                            <input
                                className="conf-step__input"
                                type="file"
                                accept="image/png"
                                onChange={e => setPoster(e.target.files[0])}
                                required
                            />
                        </label>

                        <div className="conf-step__buttons text-center">
                            <button type="submit" className="conf-step__button conf-step__button-accent">Добавить фильм</button>
                            <button type="button" className="conf-step__button conf-step__button-regular" onClick={onClose}>Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFilmModal;