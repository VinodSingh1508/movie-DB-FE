import { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import './Review.css';
import React from 'react'

const Reviews = ({ getMovieData, movie, reviews, setReviews, isUserLoggedIn }) => {

    const revText = useRef();
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

    const addReview = async (e) => {
        e.preventDefault();

        const rev = revText.current;
        JSON.parse(Cookies.get('user'))?.name
        const userId = JSON.parse(Cookies.get('user'))?.email;
        const userName = JSON.parse(Cookies.get('user'))?.name;

        try {
            const response = await api.post("/api/v1/reviews", { reviewBody: rev.value, imdbId: movieId, user: userId });

            const updatedReviews = [...reviews, { body: rev.value, user: { name: userName } }];

            rev.value = "";

            setReviews(updatedReviews);
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <Container>
            <Row>
                <Col><h3>Reviews</h3></Col>
            </Row>
            <Row className="mt-2">
                <Col className='movie-card'>
                    <img src={movie?.poster} alt={movie?.title} />
                    {isUserLoggedIn && movie && <div className='watchlist-container' onClick={() => handleWatchlistClick(movie.imdbId)}>
                        {userWatchlist.includes(movie.imdbId) && <FontAwesomeIcon className="watchlist-icon" icon={solidHeart} />}
                        {!userWatchlist.includes(movie.imdbId) && <FontAwesomeIcon className="watchlist-icon" icon={regularHeart} />}
                    </div>}
                </Col>
                <Col>
                    {isUserLoggedIn &&
                        <>
                            <Row>
                                <Col>
                                    <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review?" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <hr />
                                </Col>
                            </Row>
                        </>
                    }
                    {
                        reviews && reviews.length > 0 ? (
                            reviews?.map((r) => {
                                return (
                                    <>
                                        <Row>
                                            <Col xs={12} md={8} lg={9} className='reviewContent'>{r?.body}</Col>
                                            <Col xs={12} md={4} lg={3} className='reviewBy'>{r?.user?.name}</Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <hr />
                                            </Col>
                                        </Row>
                                    </>
                                )
                            })
                        ) : (
                            <div>
                                No reviews available.
                            </div>
                        )
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                </Col>
            </Row>
        </Container>
    )
}

export default Reviews
