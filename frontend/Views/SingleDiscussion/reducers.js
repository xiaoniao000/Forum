import {
  FETCHING_SINGLE_DISC_START,
  FETCHING_SINGLE_DISC_END,
  FETCHING_SINGLE_DISC_SUCCESS,
  FETCHING_SINGLE_DISC_FAILURE,
  TOGGLE_FAVORITE_START,
  TOGGLE_FAVORITE_SUCCESS,
  TOGGLE_FAVORITE_FAILURE,
  TOGGLE_OPINION_FAVORITE_START,
  TOGGLE_OPINION_FAVORITE_SUCCESS,
  TOGGLE_OPINION_FAVORITE_FAILURE,
  TOGGLE_OPINION_IS_REPLYING,
  UPDATE_OPINION_CONTENT,
  POSTING_OPINION_START,
  POSTING_OPINION_SUCCESS,
  POSTING_OPINION_FAILURE,
  UPDATE_SUB_OPINION_CONTENT,
  DELETE_DISC_START,
  DELETE_DISC_SUCCESS,
  DELETE_DISC_FAILURE,
  DELETE_DISC_REDIRECT,
  DELETE_OPINION_START,
  DELETE_OPINION_SUCCESS,
  DELETE_OPINION_FAILURE,
} from "./constants";

const initialState = {
  fetchingDiscussion: true,
  toggleingFavorite: false,
  postingOpinion: false,
  opinionIsReplying: false,
  opinionContent: null,
  subOpinionContent: null,
  opinionError: null,
  deletingDiscussion: false,
  deletedDiscussion: false,
  deletingOpinion: null,
  discussion: null,
  error: null,
};

export const singleDiscussionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_SINGLE_DISC_START:
      return Object.assign({}, state, {
        fetchingDiscussion: true,
      });

    case FETCHING_SINGLE_DISC_END:
      return Object.assign({}, state, {
        fetchingDiscussion: false,
      });

    case FETCHING_SINGLE_DISC_SUCCESS:
      return Object.assign({}, state, {
        discussion: action.payload,
        fetchingDiscussion: false,
        error: null,
      });

    case FETCHING_SINGLE_DISC_FAILURE:
      return Object.assign({}, state, {
        fetchingDiscussion: false,
        error: "Unable to fetch discussion. Please check out the url.",
      });

    case TOGGLE_FAVORITE_START:
      return Object.assign({}, state, {
        toggleingFavorite: true,
      });

    case TOGGLE_OPINION_FAVORITE_START:
      return Object.assign({}, state, {
        toggleingOpinionFavorite: true,
      });

    case TOGGLE_FAVORITE_SUCCESS:
    case TOGGLE_FAVORITE_FAILURE:
      return Object.assign({}, state, {
        toggleingFavorite: false,
      });

    case TOGGLE_OPINION_FAVORITE_SUCCESS:
    case TOGGLE_OPINION_FAVORITE_FAILURE:
      return Object.assign({}, state, {
        toggleingOpinionFavorite: false,
      });

    // case TOGGLE_OPINION_IS_REPLYING:
    //   // console.log(1);
    //   return Object.assign({}, state, {
    //     opinionIsReplying: true,
    //   });

    case UPDATE_OPINION_CONTENT:
      return Object.assign({}, state, {
        opinionContent: action.payload,
      });

    case POSTING_OPINION_START:
      return Object.assign({}, state, {
        postingOpinion: true,
        opinionError: null,
      });

    case POSTING_OPINION_SUCCESS:
      return Object.assign({}, state, {
        postingOpinion: false,
        opinionContent: null,
        opinionError: null,
      });

    case POSTING_OPINION_FAILURE:
      return Object.assign({}, state, {
        postingOpinion: false,
        opinionContent: null,
        opinionError: action.payload,
      });

    //!!!
    case UPDATE_SUB_OPINION_CONTENT:
      return Object.assign({}, state, {
        subOpinionContent: action.payload,
      });

    case DELETE_DISC_START:
      return Object.assign({}, state, {
        deletingDiscussion: true,
      });

    case DELETE_DISC_SUCCESS:
      return Object.assign({}, state, {
        deletingDiscussion: false,
        deletedDiscussion: true,
      });

    case DELETE_DISC_FAILURE:
      return Object.assign({}, state, {
        deletingDiscussion: false,
        deletedDiscussion: false,
      });

    case DELETE_DISC_REDIRECT:
      return Object.assign({}, state, {
        deletedDiscussion: false,
      });

    case DELETE_OPINION_START:
      return Object.assign({}, state, {
        deletingOpinion: action.payload,
      });

    case DELETE_OPINION_SUCCESS:
    case DELETE_OPINION_FAILURE:
      return Object.assign({}, state, {
        deletingOpinion: null,
      });

    default:
      return state;
  }
};
