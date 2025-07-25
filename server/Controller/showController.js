import axios from "axios";
import Movie from "../model/movie.js";
import Show from "../model/Shows.js";
import { inngest } from "../inngest/index.js";

//----------------------------------------Api to get now playing movie----------------------
export const getNowPlayingMovies = async(req,res)=>{
    
    try {
      const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
            headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
        })
        const movies = data.results;
        res.json({success:true,movies:movies})
    }
     catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})

        
    }
}

//-------------------------------Api to add new Show to db--------------------------------------------------------------

export const addshow = async(req,res)=>{
    try {
        
        const{movieId,showInput,showPrice} =req.body;

        let movie = await Movie.findById(movieId)

        if(!movie){
            //Fetch movie detail from TMDB API

            const[movieDetailsResponse,movieCreditResponse]= await Promise.all([
                axios.get (`https://api.themoviedb.org/3/movie/${movieId}`,{
                     headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}}),

                     axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{  //cast Data
                     headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}}),
                     
            ])

            const movieApiData = movieDetailsResponse.data;
            const movieCreditData = movieCreditResponse.data;


            const movieDetails={
                _id:movieId,
                title:movieApiData.title,
                overview:movieApiData.overview,
                poster_path:movieApiData.poster_path,
                backdrop_path:movieApiData.backdrop_path,
                genres:movieApiData.genres,
                casts:movieCreditData.cast,
                release_date:movieApiData.release_date,
                original_language:movieApiData.original_language,
                tagline:movieApiData.tagline||"",
                vote_average:movieApiData.vote_average,
                runtime:movieApiData.runtime,
            }

            //Add movie to Database

            movie= await Movie.create(movieDetails)
        }


        const showToCreate = [];
        showInput.forEach(show=>{
            const showDate =show.date;
            show.time.forEach((time)=>{
                const datetimeString = `${showDate}T${time}`
                showToCreate.push({
                    movie:movieId,
                    showDateTime: new Date(datetimeString),
                    showPrice:Number(showPrice),
                    occupiedSeats:{}
                })
            })
        })

        if(showToCreate.length>0){
            await Show.insertMany(showToCreate);
        }


        //trigger inngest event

        await inngest.send({
          name:"app/show.added",
          data:{movieTitle:movie.title}
        })
        
        res.json({success:true, message:'Show Added Succesfully'})
    } catch (error) {
         console.log(error);
        res.json({success:false,message:error.message})
    }
}

//_____________________________________API to get all show from database____________________

export const getShows = async(req,res)=>{
    try {
        const shows= await Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime:1})
         console.log(shows);
    

          // Filter unique shows by movie._id
    // const uniqueShowMap = new Map();

    // for (const show of shows) {
    //   const movieId = show.movie?._id?.toString();
    //   if (movieId && !uniqueShowMap.has(movieId)) {
    //     uniqueShowMap.set(movieId, show);
    //   }
    // }

    // const uniqueShows = Array.from(uniqueShowMap.values());

    res.json({ success: true, shows});
        
    } catch (error) {
            console.log(error);
        res.json({success:false,message:error.message})
    }
}

//_____________________________________API to get singel show from database____________________

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    // 1. Fetch upcoming shows for the given movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() }
    });

    // 2. Get movie details
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // 3. Group shows by date
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id
      });
    });

    // 4. Send structured response
    res.json({ success: true, movie, dateTime });

  } catch (error) {
    console.error("❌ Error in getShow:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
