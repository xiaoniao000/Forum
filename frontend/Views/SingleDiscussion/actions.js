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
  UPDATE_SUB_OPINION_CONTENT,
  POSTING_OPINION_START,
  POSTING_OPINION_SUCCESS,
  POSTING_OPINION_FAILURE,
  DELETE_DISC_START,
  DELETE_DISC_SUCCESS,
  DELETE_DISC_REDIRECT,
  DELETE_DISC_FAILURE,
  DELETE_OPINION_START,
  DELETE_OPINION_SUCCESS,
  DELETE_OPINION_FAILURE,
} from "./constants";

import {
  fetchSingleDiscussion,
  fetchOpinions,
  toggleFavoriteApi,
  toggleOpinionFavoriteApi,
  postOpinionApi,
  deletePostApi,
  deleteOpinionApi,
} from "./api";

/**
 * get the discussion from server
 * @param  {String} discussionSlug
 * @return {action}
 */
export const getDiscussion = (discussionSlug) => {
  return (dispatch, getState) => {
    dispatch({ type: FETCHING_SINGLE_DISC_START });
    fetchSingleDiscussion(discussionSlug).then(
      (data) => {
        if (data.data)
          dispatch({ type: FETCHING_SINGLE_DISC_SUCCESS, payload: data.data });
        else dispatch({ type: FETCHING_SINGLE_DISC_FAILURE });
      },
      (error) => dispatch({ type: FETCHING_SINGLE_DISC_FAILURE })
    );
  };
};

/**
 * toggle favorite status of the discussion
 * @param  {ObjectId} discussionId
 * @return {action}
 */
export const toggleFavorite = (discussionId) => {
  return (dispatch, getState) => {
    dispatch({ type: TOGGLE_FAVORITE_START });

    toggleFavoriteApi(discussionId).then(
      (data) => {
        if (data.data._id) {
          dispatch({ type: TOGGLE_FAVORITE_SUCCESS });
          dispatch({ type: FETCHING_SINGLE_DISC_SUCCESS, payload: data.data });
        } else dispatch({ type: TOGGLE_FAVORITE_FAILURE });
      },
      (error) => dispatch({ type: TOGGLE_FAVORITE_FAILURE })
    );
  };
};

/**
 * toggle favorite status of the opinion
 * @param  {ObjectId} opinionId
 * @return {action}
 */
export const toggleOpinionFavorite = (opinionId) => {
  return (dispatch, getState) => {
    dispatch({ type: TOGGLE_OPINION_FAVORITE_START });

    toggleOpinionFavoriteApi(opinionId).then(
      (data) => {
        // console.log("data---------", data);
        if (data.data._id) {
          // console.log("data.data._id---------", data.data._id);
          dispatch({ type: TOGGLE_OPINION_FAVORITE_SUCCESS }); //这个用来更改toggle的状态
          dispatch({ type: FETCHING_SINGLE_DISC_SUCCESS, payload: data.data }); //这个用来修改别的数据
        } else dispatch({ type: TOGGLE_OPINION_FAVORITE_FAILURE });
      },
      (error) => dispatch({ type: TOGGLE_OPINION_FAVORITE_FAILURE })
    );
  };
};

/**
 * toggle opinionIsReplying status of the opinion
 * @return {action}
 */
export const toggleOpinionIsReplying = () => {
  console.log(1);
  return { type: TOGGLE_OPINION_IS_REPLYING };
};

/**
 * update opinion content in redux state (controlled input)
 * @param  {Object} value
 * @return {action}
 */
export const updateOpinionContent = (value) => {
  return {
    type: UPDATE_OPINION_CONTENT,
    payload: value,
  };
};

/**
 * update subOpinion content in redux state (controlled input)
 * @param  {Object} value
 * @return {action}
 */
export const updateSubOpinionContent = (value) => {
  return {
    type: UPDATE_SUB_OPINION_CONTENT,
    payload: value,
  };
};

/**
 * post an opinion
 * @param  {Object} opinion
 * @param  {String} discussionSlug
 * @return {action}
 */
export const postOpinion = (opinion, discussionSlug) => {
  // console.log("postOpinion--------", discussionSlug);
  return (dispatch, getState) => {
    // dispatch to show the posting message
    dispatch({ type: POSTING_OPINION_START });

    // validate the opinion
    if (!opinion.content || opinion.content.length < 20) {
      dispatch({
        type: POSTING_OPINION_FAILURE,
        payload:
          "Please provide a bit more info in your opinion....at least 20 characters.",
      });
    } else {
      // call the api to post the opinion
      postOpinionApi(opinion).then(
        (data) => {
          if (data.data._id) {
            // fetch the discussion to refresh the opinion list
            // 因为store中，没有state.opinion,只有state.discussion，所以只能通过重新获取讨论的数据来rerender
            fetchSingleDiscussion(discussionSlug)
              .then((data) => {
                // console.log("fetchSingleDiscussion--------", data);
                dispatch({
                  type: FETCHING_SINGLE_DISC_SUCCESS,
                  payload: data.data,
                });
                dispatch({ type: POSTING_OPINION_SUCCESS });
                //之前把处理错误的函数写在then里面，这样不好
              })
              .catch((error) =>
                dispatch({ type: FETCHING_SINGLE_DISC_FAILURE })
              );
          } else dispatch({ type: POSTING_OPINION_FAILURE });
        },
        (error) => dispatch({ type: POSTING_OPINION_FAILURE })
      );
    }
  };
};

/**
 * delete the discussion post
 * @param  {String} discussionSlug
 * @return {action}
 */
export const deletePost = (discussionSlug) => {
  return (dispatch, getState) => {
    dispatch({ type: DELETE_DISC_START });
    deletePostApi(discussionSlug).then(
      (data) => {
        if (data.data.deleted) {
          dispatch({ type: DELETE_DISC_SUCCESS });
        } else {
          dispatch({ type: DELETE_DISC_FAILURE });
        }
      },
      (error) => dispatch({ type: DELETE_DISC_FAILURE })
    );
  };
};

/**
 * after a successfull deletion of a discussion
 * the user should be redirected to the home page
 * @return {action}
 */
export const deletedDiscussionRedirect = () => {
  return (dispatch, getState) => {
    dispatch({ type: DELETE_DISC_REDIRECT });
  };
};

/**
 * delete an opinion
 * @param  {ObjectId} opinionId
 * @param  {String} discussionSlug
 * @return {action}
 */
export const deleteOpinion = (opinionId, discussionSlug) => {
  return (dispatch, getState) => {
    // show the loading message
    dispatch({ type: DELETE_OPINION_START, payload: opinionId });

    // call the api
    deleteOpinionApi(opinionId).then(
      (data) => {
        if (data.data.deleted) {
          // fetch the discussion again to refresh the opinions
          fetchSingleDiscussion(discussionSlug).then(
            (data) => {
              dispatch({ type: DELETE_OPINION_SUCCESS });
              dispatch({
                type: FETCHING_SINGLE_DISC_SUCCESS,
                payload: data.data,
              });
            },
            (error) => dispatch({ type: FETCHING_SINGLE_DISC_FAILURE })
          );
        } else {
          dispatch({ type: DELETE_OPINION_FAILURE });
        }
      },
      (error) => dispatch({ type: DELETE_OPINION_FAILURE })
    );
  };
};
