import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-playlist").post(createPlaylist);
router.route("/user-playlists/:userId").get(getUserPlaylists);
router.route("/playlist-by-id/:playlistID").get(getPlaylistById);
router.route("/add-video-to-playlist/:playlistId/:videoId").patch(addVideoToPlaylist);
router.route("/remove-video-from-playlist/:playlistId/:videoId").patch(removeVideoFromPlaylist);
router.route("/delete-playlist/:playlistId").delete(deletePlaylist);
router.route("/update-playlist/:playlistId").patch(updatePlaylist);

export default router