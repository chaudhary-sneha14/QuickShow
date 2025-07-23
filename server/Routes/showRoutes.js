import express from 'express'
import { addshow, getNowPlayingMovies, getShow, getShows } from "../Controller/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing',protectAdmin,getNowPlayingMovies)
showRouter.post('/add',protectAdmin,addshow)
showRouter.get("/all",getShows)
showRouter.get("/:movieId",getShow)


export default showRouter