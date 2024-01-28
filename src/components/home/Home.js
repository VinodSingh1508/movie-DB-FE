import Hero from '../hero/Hero';

const Home = ({movies, isUserLoggedIn}) => {
  return (
    <Hero movies = {movies} isUserLoggedIn={isUserLoggedIn}/>
  )
}

export default Home
