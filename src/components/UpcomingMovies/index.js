import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import MovieItem from '../MovieItem'
import Pagination from '../Pagination'
import './index.css'

const UpcomingMovies = () => {
  const [upcomingMovies, setUpcomingMovies] = useState({})
  const [apiState, setApiState] = useState('INITIATE')
  const [currentPage, setCurrentPage] = useState(1)

  const getMoviesData = async page => {
    setApiState('LOADING')
    const apiKey = '4bcdbfc2185cce178974a7afc7da3415'
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const updatedData = {
        page: data.page,
        results: data.results.map(eachObj => ({
          adult: eachObj.adult,
          backdropPath: eachObj.backdrop_path,
          genreIds: eachObj.genre_ids,
          id: eachObj.id,
          originalLanguage: eachObj.original_language,
          originalTitle: eachObj.original_title,
          overview: eachObj.overview,
          popularity: eachObj.popularity,
          posterPath: `https://image.tmdb.org/t/p/w500${eachObj.poster_path}`,
          releaseDate: eachObj.release_date,
          title: eachObj.title,
          video: eachObj.video,
          voteAverage: eachObj.vote_average,
          voteCount: eachObj.vote_count,
        })),
        totalPages: data.total_pages,
        totalResults: data.total_results,
      }
      setUpcomingMovies(updatedData)
      setApiState('SUCCESS')
    } else {
      setApiState('FAILURE')
    }
  }

  useEffect(() => {
    getMoviesData(currentPage)
  }, [currentPage])

  const getLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#032541" />
    </div>
  )

  const getSuccessView = () => {
    const {results} = upcomingMovies
    // console.log(currentPage)
    return (
      <div className="row p-0 ms-0 me-0 mt-3">
        <ul className="topmovies-movies-ul">
          {results.map(eachMovie => (
            <MovieItem key={eachMovie.id} movie={eachMovie} />
          ))}
        </ul>
        <footer>
          <Pagination
            totalPages={upcomingMovies.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </footer>
      </div>
    )
  }

  const getFailureView = () => (
    <div className="failure-container">
      <h1>Something Went Wrong </h1>
      <button type="button" className="btn btn-primary" onClick={getMoviesData}>
        Retry
      </button>
    </div>
  )

  const getUpcomingPageResponse = () => {
    switch (apiState) {
      case 'LOADING':
        return getLoadingView()
      case 'SUCCESS':
        return getSuccessView()
      case 'FAILURE':
        return getFailureView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="topmovies-page-bg-container">
        {getUpcomingPageResponse()}
      </div>
    </>
  )
}

export default UpcomingMovies