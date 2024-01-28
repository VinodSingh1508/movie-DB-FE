import './App.css';
import api from './api/axiosConfig';
import {useState, useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import Info from './components/info/Info';
import NotFound from './components/notFound/NotFound';
import Watchlist from './components/watchlist/Watchlist';
import Cookies from 'js-cookie';

function App() {

  const [movies, setMovies] = useState();
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const getMovies = async () =>{
    
    try
    {

      const response = await api.get("/api/v1/movies");

      setMovies(response.data);

    } 
    catch(err)
    {
      console.log(err);
    }
  }

  const getMovieData = async (movieId) => {
     
    try 
    {
        const response = await api.get(`/api/v1/movies/${movieId}`);

        const singleMovie = response.data;

        setMovie(singleMovie);

        setReviews(singleMovie.reviews);
        

    } 
    catch (error) 
    {
      console.error(error);
    }

  }

  const getWatchListedMovies=()=>{
    if(movies && Cookies.get('user')){
      const cookieWatchlist = JSON.parse(Cookies.get('user'))?.watchlist || [];
      return movies.filter(movie => cookieWatchlist.includes(movie.imdbId));
    }else return [];
  }

  useEffect(() => {
    getMovies();
  },[])

  return (
    <div className="App">
      <Header isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />
      <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Home movies={movies} isUserLoggedIn={isUserLoggedIn}/>} ></Route>
            <Route path="/Watchlist" element={<Watchlist watchListedMovies={getWatchListedMovies} isUserLoggedIn={isUserLoggedIn} />}></Route>
            <Route path="/Trailer/:ytTrailerId" element={<Trailer/>}></Route>
            <Route path="/Reviews/:movieId" element ={<Reviews getMovieData = {getMovieData} movie={movie} reviews ={reviews} setReviews = {setReviews} isUserLoggedIn={isUserLoggedIn}/>}></Route>
            <Route path="/Info/:movieId" element ={<Info getMovieData = {getMovieData} movie={movie} isUserLoggedIn={isUserLoggedIn} />}></Route>
            <Route path="*" element = {<NotFound/>}></Route>
          </Route>
      </Routes>

    </div>
  );
}

export default App;
