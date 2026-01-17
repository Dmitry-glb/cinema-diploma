import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { request } from '../../api';
import './Payment.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { film, seance, selectedDate, selectedPlaces, hallData, totalPrice } = location.state || {};

    if (!film || !seance || !selectedPlaces) {
        navigate('/');
        return null;
    }

    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString('ru-RU');

    const formatDateForApi = (timestamp) => {
        const d = new Date(timestamp);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleTicketBooking = () => {
        const body = new FormData();
        body.append('seanceId', seance.id);
        body.append('ticketDate', formatDateForApi(selectedDate));
        const ticketsData = selectedPlaces.map(p => ({
            row: p.row,
            place: p.place,
            coast: p.price
        }));
        body.append('tickets', JSON.stringify(ticketsData));

        request('ticket', 'POST', body)
            .then(data => {
                if (data.success) {
                    navigate('/ticket', {
                        state: {
                            ticketResult: data.result,
                            film,
                            seance,
                            hallData,
                            totalPrice
                        }
                    });
                } else {
                    alert('Ошибка бронирования: ' + data.error);
                }
            });
    };

    return (
        <div className="payment-page">
            <div className="payment-card">
                <h2 className="payment-card__header">Вы выбрали билеты:</h2>

                <div className="payment-card__info">
                    <p className="payment-card__row">
                        <span>Фильм:</span> {film.film_name}
                    </p>
                    <p className="payment-card__row">
                        <span>Места:</span> {selectedPlaces.map(p => `${p.row} ряд, ${p.place} место`).join('; ')}
                    </p>
                    <p className="payment-card__row">
                        <span>В зале:</span> {hallData.hall_name}
                    </p>
                    <p className="payment-card__row">
                        <span>Дата:</span> {formattedDate}
                    </p>
                    <p className="payment-card__row">
                        <span>Начало сеанса:</span> {seance.seance_time}
                    </p>

                    <p className="payment-card__cost">
                        Стоимость: <span className="payment-card__cost-price"><strong>{totalPrice}</strong></span> рублей
                    </p>
                </div>

                <button className="payment-card__btn" onClick={handleTicketBooking}>
                    Получить код бронирования
                </button>

                <p className="payment-card__hint">
                    После оплаты билет будет доступен в этом окне, а также придёт вам на почту.
                    Покажите QR-код нашему контролёру у входа в зал.
                </p>
            </div>
        </div>
    );
};

export default Payment;