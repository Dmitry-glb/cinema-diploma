import React, { useState, useEffect } from 'react';
import { request } from '../../api';
import './Admin.css';

import HallsControl from './HallsControl/HallsControl';
import ConfigHall from './ConfigHall/ConfigHall';
import PricesControl from './PricesControl/PricesControl';
import SessionsControl from './SessionsControl/SessionsControl';
import SalesControl from './SalesControl/SalesControl';

const Admin = () => {
    const [halls, setHalls] = useState([]);
    const [films, setFilms] = useState([]);
    const [seances, setSeances] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openSections, setOpenSections] = useState([]);

    const fetchData = () => {
        request('alldata').then(data => {
            if (data.result) {
                setHalls(data.result.halls);
                setFilms(data.result.films);
                setSeances(data.result.seances);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        document.body.classList.add('admin-body-bg');
        return () => {
            document.body.classList.remove('admin-body-bg');
        };
    }, []);

    const toggleSection = (sectionName) => {
        if (openSections.includes(sectionName)) {
            setOpenSections(openSections.filter(name => name !== sectionName));
        } else {
            setOpenSections([...openSections, sectionName]);
        }
    };

    const getHeaderClass = (sectionName) => {
        return openSections.includes(sectionName)
            ? "conf-step__header conf-step__header_opened"
            : "conf-step__header";
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuth');
        window.location.reload();
    };

    if (loading) return <div className="admin-page" style={{ color: 'white', textAlign: 'center' }}>Загрузка...</div>;

    return (
        <div className="admin-page">
            <div className="admin-wrapper">

                <section className="conf-step">
                    <div
                        className={getHeaderClass('halls')}
                        onClick={() => toggleSection('halls')}
                    >
                        <h2 className="conf-step__title">Управление залами</h2>
                        <div className="conf-step__arrow"></div>
                    </div>
                    {openSections.includes('halls') && (
                        <HallsControl halls={halls} onUpdate={fetchData} />
                    )}
                </section>

                <section className="conf-step">
                    <div
                        className={getHeaderClass('config')}
                        onClick={() => toggleSection('config')}
                    >
                        <h2 className="conf-step__title">Конфигурация залов</h2>
                        <div className="conf-step__arrow"></div>
                    </div>
                    {openSections.includes('config') && (
                        <ConfigHall halls={halls} onUpdate={fetchData} />
                    )}
                </section>

                <section className="conf-step">
                    <div
                        className={getHeaderClass('prices')}
                        onClick={() => toggleSection('prices')}
                    >
                        <h2 className="conf-step__title">Конфигурация цен</h2>
                        <div className="conf-step__arrow"></div>
                    </div>
                    {openSections.includes('prices') && (
                        <PricesControl halls={halls} onUpdate={fetchData} />
                    )}
                </section>

                <section className="conf-step">
                    <div
                        className={getHeaderClass('seances')}
                        onClick={() => toggleSection('seances')}
                    >
                        <h2 className="conf-step__title">Сетка сеансов</h2>
                        <div className="conf-step__arrow"></div>
                    </div>
                    {openSections.includes('seances') && (
                        <SessionsControl
                            halls={halls}
                            films={films}
                            seances={seances}
                            onUpdate={fetchData}
                        />
                    )}
                </section>

                <section className="conf-step">
                    <div
                        className={getHeaderClass('sales')}
                        onClick={() => toggleSection('sales')}
                    >
                        <h2 className="conf-step__title">Открыть продажи</h2>
                        <div className="conf-step__arrow"></div>
                    </div>
                    {openSections.includes('sales') && (
                        <SalesControl halls={halls} onUpdate={fetchData} />
                    )}
                </section>

            </div>
        </div>
    );
};

export default Admin;