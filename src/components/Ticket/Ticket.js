import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Ticket.css';

const Ticket = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { ticketResult, film, seance, hallData } = location.state || {};

    useEffect(() => {
        if (!ticketResult) {
            navigate('/');
        }
    }, [ticketResult, navigate]);

    if (!ticketResult) return null;

    const dateDate = new Date(ticketResult[0].ticket_date).toLocaleDateString('ru-RU');
    const seatsString = ticketResult.map(t => `${t.ticket_row} ряд ${t.ticket_place} место`).join(', ');

    const qrString = `
    Фильм: ${film.film_name}
    Зал: ${hallData.hall_name}
    Ряд/Место: ${seatsString}
    Дата: ${dateDate}
    Начало: ${seance.seance_time}
    Билет действителен строго на свой сеанс
  `.trim();

    return (
        <div className="ticket-page">
            <div className="ticket-card">
                <div className="ticket-card__header">
                    <h2 className="ticket-card__title">ЭЛЕКТРОННЫЙ БИЛЕТ</h2>
                </div>

                <div className="ticket-card__info-wrapper">
                    <div className="ticket-card__info">
                        <p className="ticket-card__row">
                            <span className="ticket-card__label">На фильм:</span>
                            <span className="ticket-card__value">{film.film_name}</span>
                        </p>
                        <p className="ticket-card__row">
                            <span className="ticket-card__label">Места:</span>
                            <span className="ticket-card__value">{seatsString}</span>
                        </p>
                        <p className="ticket-card__row">
                            <span className="ticket-card__label">В зале:</span>
                            <span className="ticket-card__value">{hallData.hall_name}</span>
                        </p>
                        <p className="ticket-card__row">
                            <span className="ticket-card__label">Начало сеанса:</span>
                            <span className="ticket-card__value">{seance.seance_time}</span>
                        </p>
                        <p className="ticket-card__row">
                            <span className="ticket-card__label">Дата:</span>
                            <span className="ticket-card__value">{dateDate}</span>
                        </p>
                    </div>

                    <div className="ticket-card__qr">
                        <QRCodeSVG value={qrString} size={150} />
                    </div>
                </div>

                <p className="ticket-card__hint">
                    Покажите QR-код нашему контролёру для подтверждения бронирования.
                </p>

                <p className="ticket-card__footer-text">
                    Приятного просмотра!
                </p>
            </div>
        </div>
    );
};

export default Ticket;