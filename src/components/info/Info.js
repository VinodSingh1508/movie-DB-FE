import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import api from '../../api/axiosConfig';
import './Info.css';

import React from 'react'

const Info = ({ getMovieData, movie, isUserLoggedIn }) => {
    let params = useParams();
    const movieId = params.movieId;

    useEffect(() => {
        getMovieData(movieId);
    }, [])

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
        <Container>
            <Row>
                <Col><h3>{movie?.title}</h3></Col>
            </Row>
            <Row className="mt-2">
                <Col className='movie-card'>
                    <img src={movie?.poster} alt={`${movie?.title}`} />
                    {isUserLoggedIn && movie && <div className='watchlist-container' onClick={() => handleWatchlistClick(movie.imdbId)}>
                        {userWatchlist.includes(movie.imdbId) && <FontAwesomeIcon className="watchlist-icon" icon={solidHeart} />}
                        {!userWatchlist.includes(movie.imdbId) && <FontAwesomeIcon className="watchlist-icon" icon={regularHeart} />}
                    </div>}
                </Col>
                <Col>
                    <Row>{movie?.plot}</Row>
                    <Row><Col><hr/></Col></Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col className='tableHeader'>Release Date:</Col>
                                <Col className='tableBody'>{movie?.releaseDate}</Col>
                            </Row>
                            <Row>
                                <Col className='tableHeader'>Genres:</Col>
                                <Col className='tableBody'>{movie?.genres?.join(', ')}</Col>
                            </Row>
                            <Row>
                                <Col className='tableHeader'>IMDB Rating:</Col>
                                <Col className='tableBody'>{movie?.imdbRating} / 10</Col>
                            </Row>
                            <Row>
                                <Col className='tableHeader'>Run Time:</Col>
                                <Col className='tableBody'>{movie?.runTime}</Col>
                            </Row>
                            <Row>
                                <Col className='tableHeader'>IMDB Link:</Col>
                                <Col className='tableBody'><a href={movie?.imdbLink} target="_blank" rel="noopener noreferrer">IMDB</a></Col>
                            </Row>
                            <Row>
                                <Col className='tableHeader'>Trailer Link:</Col>
                                <Col className='tableBody'>
                                    <Link to={`/Trailer/${movie?.trailerLink?.substring(movie?.trailerLink?.length - 11)}`}>Trailer</Link>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col className='tableHeader'>Director:</Col>
                                <Col className='tableBody'>{movie?.director}</Col>
                            </Row>
                            <Row>
                                <Col className='tableHeader'>Cast :</Col>
                                <Col className='tableBody'>{movie?.cast?.join(', ')}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

            </Row>
        </Container>
    )
}

export default Info
