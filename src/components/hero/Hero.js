import './Hero.css';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

import { Link, useNavigate } from "react-router-dom";
//import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import { Form, Button } from 'react-bootstrap';
import api from '../../api/axiosConfig';


const Hero = ({ movies, isUserLoggedIn }) => {

    const navigate = useNavigate();
    const [autoplay, setAutoplay] = useState(false);
    const [userWatchlist, setUserWatchlist] = useState([]);
    useEffect(() => {
        const initializeUserWatchlist = () => {
            if (isUserLoggedIn) {
                const cookieWatchlist = JSON.parse(Cookies.get('user'))?.watchlist || [];
                setUserWatchlist(cookieWatchlist);
            }
            else {
                setUserWatchlist([]);
            }
        };

        initializeUserWatchlist();
    }, [isUserLoggedIn]);

    function goTo(to, movieId) {
        navigate(`/${to}/${movieId}`);
    }

    const handleWatchlistClick = (movieId) => {
        let user = JSON.parse(Cookies.get('user'));
        const watchlisted = user?.watchlist?.includes(movieId);

        api.post('/api/v1/users/watchlist', {
            user: user.email,
            imdbId: movieId,
            operation: watchlisted ? 'REMOVE' : 'ADD'
        })
            .then(function (response) {
                if (watchlisted) {
                    const index = user.watchlist.indexOf(movieId);
                    user.watchlist.splice(index, 1);
                } else {
                    user.watchlist.push(movieId);
                }
                Cookies.set('user', JSON.stringify(user));
                setUserWatchlist(user.watchlist);
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    return (
        <div className='movie-carousel-container'>
            <Carousel autoPlay={autoplay} interval={6000}>
                {
                    movies?.map((movie) => {
                        return (
                            <Paper key={movie.imdbId}>
                                <div className='movie-card-container'>
                                    <div className="movie-card" style={{ "--img": `url(${movie.backdrops[0]})` }}>
                                        <Form.Check
                                            type="switch"
                                            id="autoplay"
                                            label="Autoplay"
                                            className="autoplay-switch"
                                            disabled={false}
                                            checked={autoplay}
                                            onChange={(event) => event.target.checked?setAutoplay(true):setAutoplay(false)}
                                        />
                                        <div className="movie-detail">

                                            <div className="movie-poster">
                                                <Link to={`/Info/${movie.imdbId}`}>
                                                    <img className='poster-image' src={movie.poster} alt="" />
                                                </Link>
                                                {isUserLoggedIn && <div className='watchlist-container' onClick={() => handleWatchlistClick(movie.imdbId)}>
                                                    {userWatchlist.includes(movie.imdbId) && <FontAwesomeIcon className="watchlist-icon" icon={solidHeart} />}
                                                    {!userWatchlist.includes(movie.imdbId) && <FontAwesomeIcon className="watchlist-icon" icon={regularHeart} />}
                                                </div>}
                                            </div>

                                            <div className="movie-title">
                                                <Link to={`/Info/${movie.imdbId}`}><h1>{movie.title}</h1></Link>
                                            </div>
                                            <div className="movie-buttons-container">
                                                <Link to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                                                    <div className="play-button-icon-container">
                                                        <FontAwesomeIcon className="play-button-icon"
                                                            icon={faCirclePlay}
                                                        />
                                                    </div>
                                                </Link>
                                                <div className="movie-review-button-container">
                                                    <Button variant="info" onClick={() => goTo('Reviews', movie.imdbId)} >Reviews</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        )
                    })
                }
            </Carousel>
        </div>
    )
}

export default Hero
