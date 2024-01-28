import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Container, Row, Col } from 'react-bootstrap';
import './Watchlist.css';
import { useNavigate } from 'react-router-dom';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../api/axiosConfig';

const Watchlist = ({ watchListedMovies, isUserLoggedIn }) => {
  const navigate = useNavigate();
  const [initialCheck, setInitialCheck] = useState(false);
  const [movies, setMovies] = useState(watchListedMovies());

  

  useEffect(() => {
    if (!initialCheck) {
      setInitialCheck(true);
      return;
    }

    if (!isUserLoggedIn) {
      navigate('/');
    }
  }, [isUserLoggedIn, navigate, initialCheck]);



  const handleWatchlistClick = (movieId) => {
    let user = JSON.parse(Cookies.get('user'));
    
    api.post('/api/v1/users/watchlist', {
        user: user.email,
        imdbId: movieId,
        operation: 'REMOVE'
    })
        .then(function (response) {
                const index = user.watchlist.indexOf(movieId);
                user.watchlist.splice(index, 1);
            
            Cookies.set('user', JSON.stringify(user));
            const newMovieList = movies.filter(movie => movie.imdbId != movieId);
            setMovies(newMovieList);
        })
        .catch(function (error) {
            console.error(error);
        });
};


  return (
    <Container>
      {movies.length > 0 ? (
        <Row>
          {movies.map(movie => (
            <Col key={movie.imdbId} xs={12} sm={6} md={4} lg={3}>
              <div className="movie-poster">
                <img className='poster-image' src={movie.poster} alt={movie.title} />
                <div className='watchlist-container' onClick={() => handleWatchlistClick(movie.imdbId)}>
                  <FontAwesomeIcon className="watchlist-icon" icon={solidHeart} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <div className='empty-watchlist'><p className="centered-text centered-content">Your watchlist is empty.</p></div>        
      )}
    </Container>
  );
};

export default Watchlist;
