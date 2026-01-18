import React, { useState } from 'react';
import { request } from '../../../api';
import AddHallModal from '../AddHallModal/AddHallModal';
import './HallsControl.css';

const HallsControl = ({ halls, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены? Удаление зала приведет к удалению всех сеансов в нем!')) {
            request(`hall/${id}`, 'DELETE').then(data => {
                if (data.result) {
                    onUpdate();
                }
            });
        }
    };

    return (
        <div className="conf-step__wrapper">
            <p className="conf-step__paragraph">Доступные залы:</p>

            <ul className="conf-step__list">
                {halls.map(hall => (
                    <li key={hall.id}>
                        <span className="conf-step__list-text">{hall.hall_name}</span>
                        <button
                            className="conf-step__button-trash"
                            onClick={() => handleDelete(hall.id)}
                        >
                        </button>
                    </li>
                ))}
            </ul>

            <button
                className="conf-step__button-accent"
                onClick={() => setIsModalOpen(true)}
            >
                Создать зал
            </button>

            {isModalOpen && (
                <AddHallModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={onUpdate}
                />
            )}
        </div>
    );
};

export default HallsControl;