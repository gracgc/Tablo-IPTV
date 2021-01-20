import {videosAPI} from "../api/api";

const SET_VIDEOS_DATA = 'videos/SET_LOG_DATA';
const SET_CURRENT_VIDEO_DATA = 'videos/SET_CURRENT_VIDEO_DATA'


let initialState = {
    videos: [
        {
            videoName: "ВИДЕО",
            videoURL: "",
            videoType: ""
        }
    ],
    currentVideo: {
        videoName: "ВИДЕО",
        videoURL: "",
        videoType: ""
    }
};

const videosReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_VIDEOS_DATA:

            return {
                ...state,
                videos: action.videosData
            };

        case SET_CURRENT_VIDEO_DATA:

            return {
                ...state,
                currentVideo: action.currentVideo
            };

        default:
            return state;
    }
};

export const setVideosDataAC = (videosData) => ({type: SET_VIDEOS_DATA, videosData});
export const setCurrentVideoDataAC = (currentVideo) => ({type: SET_CURRENT_VIDEO_DATA, currentVideo});


export const getVideos = () => async (dispatch) => {
    let response = await videosAPI.getVideos();
    if (response.resultCode !== 10) {
        dispatch(setVideosDataAC(response));
    }
};

export const getCurrentVideo = () => async (dispatch) => {
    let response = await videosAPI.getCurrentVideo();
    if (response.resultCode !== 10) {
        dispatch(setCurrentVideoDataAC(response));
    }
};


export default videosReducer;