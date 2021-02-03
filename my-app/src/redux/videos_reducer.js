import {videosAPI} from "../api/api";

const SET_VIDEOS_DATA = 'videos/SET_LOG_DATA';
const SET_CURRENT_VIDEO_DATA = 'videos/SET_CURRENT_VIDEO_DATA'
const SET_VIDEO_EDITOR_DATA = 'videos/SET_VIDEO_EDITOR_DATA'
const SET_CURRENT_VIDEO_EDITOR_DATA = 'video/SET_CURRENT_VIDEO_EDITOR_DATA'


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
    },
    videoEditor: {
        editorData: {
            duration: 10
        },
        currentVideo: {
            videoName: "ВИДЕО",
            videoURL: "",
            videoType: ""
        },
        videos: [
            {
                videoName: "ВИДЕО",
                videoURL: "",
                videoType: "",
                duration: 10
            }
        ]
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


        case SET_VIDEO_EDITOR_DATA:

            return {
                ...state,
                videoEditor: {
                    ...state.videoEditor,
                    videos: action.videosData,
                    editorData: {...state.videoEditor.editorData, duration: action.videosData.map(v => v.duration).reduce((sum, current) => sum + current, 0)},
                    currentVideo: action.videosData[action.videosData.length - 1]
                },
            }

        case SET_CURRENT_VIDEO_EDITOR_DATA:

            return {
                ...state,
                videoEditor: {
                    ...state.videoEditor,
                    currentVideo: action.currentVideo
                }
            };


        default:
            return state;
    }
};

export const setVideosDataAC = (videosData) => ({type: SET_VIDEOS_DATA, videosData});
export const setCurrentVideoDataAC = (currentVideo) => ({type: SET_CURRENT_VIDEO_DATA, currentVideo});
export const setVideoEditorDataAC = (videosData) => ({type: SET_VIDEO_EDITOR_DATA, videosData});
export const setCurrentVideoEditorDataAC = (currentVideo) => ({type: SET_CURRENT_VIDEO_EDITOR_DATA, currentVideo});


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

export const getVideoEditor = (gameNumber) => async (dispatch) => {
    let response = await videosAPI.getVideoEditor(gameNumber);
    if (response.resultCode !== 10) {
        dispatch(setVideoEditorDataAC(response));
    }
};


export default videosReducer;