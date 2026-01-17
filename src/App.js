import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Movie from './components/Movie/Movie';
import Hall from './components/Hall/Hall';
import Payment from './components/Payment/Payment';
import Ticket from './components/Ticket/Ticket';
import Login from './components/Admin/Login/Login';
import Admin from './components/Admin/Admin';

import { getDays } from './utils';
import { request } from './api';

const ClientMain = () => {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startOffset, setStartOffset] = useState(0);
  const [films, setFilms] = useState([]);
  const [seances, setSeances] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const daysData = getDays(startOffset);
    setDays(daysData);
    if (!selectedDay && daysData.length > 0) {
      setSelectedDay(daysData[0].timestamp);
    }
  }, [startOffset]);

  useEffect(() => {
    request('alldata')
      .then(data => {
        if (data.result) {
          setFilms(data.result.films);
          setSeances(data.result.seances);
          setHalls(data.result.halls);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleNextDays = () => {
    setStartOffset(prev => prev + 1);
    if (selectedDay) {
      const nextDate = new Date(selectedDay);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);
      setSelectedDay(nextDate.getTime());
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Загрузка...</div>;

  return (
    <>
      <div className="wrapper">
        <Navigation
          days={days}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onNextDays={handleNextDays}
        />
      </div>
      <main className="client-content">
        <div className="wrapper">
          {films.map(film => (
            <Movie
              key={film.id}
              film={film}
              halls={halls}
              seances={seances}
              selectedDay={selectedDay}
            />
          ))}
        </div>
      </main>
    </>
  );
};

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuth');
    if (authStatus === 'true') {
      setIsAuth(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuth(true);
  };

  return (
    <HashRouter>
      <Header />

      <Routes>
        <Route
          path="/admin/*"
          element={isAuth ? <Admin /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={isAuth ? <Navigate to="/admin" replace /> : <Login onLogin={handleLogin} />}
        />

        <Route path="/" element={<ClientMain />} />

        <Route path="/hall/:id" element={
          <div className="wrapper" style={{ paddingTop: '20px' }}>
            <Hall />
          </div>
        } />

        <Route path="/payment" element={<Payment />} />
        <Route path="/ticket" element={<Ticket />} />
      </Routes>
    </HashRouter>
  );
}

export default App;