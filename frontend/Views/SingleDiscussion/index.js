import _ from "lodash";
import React, { Component } from "react";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import classnames from "classnames";

import {
  getDiscussion,
  toggleFavorite,
  updateOpinionContent,
  postOpinion,
  deletePost,
  deletedDiscussionRedirect,
  deleteOpinion,
  toggleOpinionFavorite,
} from "./actions";

import Discussion from "Components/SingleDiscussion/Discussion";
import ReplyBox from "Components/SingleDiscussion/ReplyBox";
import Opinion from "Components/SingleDiscussion/Opinion";

import styles from "./styles.css";
import appLayout from "SharedStyles/appLayout.css";

class SingleDiscussion extends Component {
  constructor(props) {
    super(props);
    this.state = { opinionContent: "" };
  }

  componentDidMount() {
    //查看这是哪一个论坛（forum）的哪一个帖子（discussion）
    const { forum, discussion } = this.props.params;

    //获取该论坛的数据
    this.props.getDiscussion(discussion);
  }

  componentDidUpdate() {
    const { deletedDiscussion, deletedDiscussionRedirect } = this.props;

    const { forum } = this.props.params;

    // check if the discussion is deleted and redirect the user
    if (deletedDiscussion) {
      browserHistory.push(`/${forum}`);
      setTimeout(() => {
        deletedDiscussionRedirect();
      }, 100);
    }
  }

  componentWillUnmount() {
    // remove any existing opinion texts
    this.props.updateOpinionContent(null);
  }

  userFavoritedDiscussion(userId, favorites) {
    let favorited = false;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i] === userId) favorited = true;
    }
    return favorited;
  }

  //用户是否给回复点赞过
  userFavoritedOpinion(userId, opinionFavorites) {
    let favorited = false;
    for (let i = 0; i < opinionFavorites.length; i++) {
      if (opinionFavorites[i] === userId) favorited = true;
    }
    return favorited;
  }

  handleReplySubmit() {
    const {
      forums,
      postOpinion,
      discussion,
      opinionContent,
      userId,
    } = this.props;

    const discussion_slug = this.props.params.discussion;
    const forumSlug = this.props.params.forum;
    const forumId = _.find(forums, { forum_slug: forumSlug })._id;

    postOpinion(
      {
        forum_id: forumId,
        discussion_id: discussion._id,
        user_id: userId,
        content: opinionContent,
      },
      discussion_slug
    );
  }

  deleteDiscussion() {
    const { discussion } = this.props.params;
    const { deletePost } = this.props;
    deletePost(discussion);
  }

  deleteOpinion(opinionId) {
    const { discussion } = this.props.params;
    const { deleteOpinion } = this.props;
    deleteOpinion(opinionId, discussion);
  }

  render() {
    const {
      userAuthenticated,
      fetchingDiscussion,
      discussion,
      toggleFavorite,
      toggleingFavorite,
      updateOpinionContent,
      postingOpinion,
      opinionError,
      deletingOpinion,
      deletingDiscussion,
      error,
      toggleingOpinionFavorite,
      toggleOpinionFavorite, //这里的toggleOpinionFavorite来自于dispatch
    } = this.props;

    if (error) {
      return <div className={styles.errorMsg}>{error}</div>;
    }

    // return loading status if discussion is not fetched yet
    if (fetchingDiscussion) {
      return (
        <div className={styles.loadingWrapper}>Loading discussion ...</div>
      );
    }

    const { _id, content, date, favorites, title, tags, opinions } = discussion;

    const { avatarUrl, name, username } = discussion.user;

    //有很多个opinion,不是判断一个opinion的opinionFavorites,而是全部的
    //所以不应该在discussion里判断,而是在opinion组件里

    // check if logged in user is owner of the discussion
    let allowDelete = false;
    if (
      discussion.user._id === this.props.userId ||
      this.props.userRole === "admin"
    )
      allowDelete = true;

    // check if user favorated the discussion
    const userFavorited = this.userFavoritedDiscussion(
      this.props.userId,
      favorites
    );

    return (
      <div className={appLayout.constraintWidth}>
        <Helmet>
          <title>{`${title} | ReForum`}</title>
        </Helmet>

        <Discussion
          id={_id}
          userAvatar={avatarUrl}
          userName={name}
          userGitHandler={username}
          discTitle={title}
          discDate={date}
          discContent={content}
          tags={tags}
          favoriteCount={favorites.length}
          favoriteAction={toggleFavorite}
          userFavorited={userFavorited}
          toggleingFavorite={toggleingFavorite}
          allowDelete={allowDelete}
          deletingDiscussion={deletingDiscussion}
          deleteAction={this.deleteDiscussion.bind(this)}
        />

        {opinionError && <div className={styles.errorMsg}>{opinionError}</div>}

        {!userAuthenticated && (
          <div className={styles.signInMsg}>
            Please sign in to post a reply.
          </div>
        )}
        {userAuthenticated && (
          <ReplyBox
            posting={postingOpinion}
            onSubmit={this.handleReplySubmit.bind(this)}
            onChange={(content) => {
              updateOpinionContent(content);
            }}
          />
        )}

        {opinions &&
          opinions.map((opinion) => {
            const { opinionFavorites } = opinion;

            //check if user favorated the opinion
            const opinionUserFavorited = this.userFavoritedOpinion(
              this.props.userId,
              opinionFavorites
            );

            return (
              <Opinion
                key={opinion._id}
                opinionId={opinion._id}
                userAvatar={opinion.user.avatarUrl}
                userName={opinion.user.name}
                userGitHandler={opinion.user.username}
                opDate={opinion.date}
                opContent={opinion.content}
                userId={opinion.user_id}
                currentUserId={this.props.userId}
                currentUserRole={this.props.userRole}
                deleteAction={this.deleteOpinion.bind(this)}
                deletingOpinion={deletingOpinion}
                favoriteCount={opinionFavorites.length}
                favoriteAction={toggleOpinionFavorite}
                userFavorited={opinionUserFavorited}
                toggleingOpinionFavorite={toggleingOpinionFavorite}
              />
            );
          })}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      forums: state.app.forums,
      userAuthenticated: state.user.authenticated,
      userId: state.user._id,
      userRole: state.user.role,
      fetchingDiscussion: state.discussion.fetchingDiscussion,
      toggleingFavorite: state.discussion.toggleingFavorite,
      deletingDiscussion: state.discussion.deletingDiscussion,
      deletedDiscussion: state.discussion.deletedDiscussion,
      opinionContent: state.discussion.opinionContent,
      postingOpinion: state.discussion.postingOpinion,
      opinionError: state.discussion.opinionError,
      deletingOpinion: state.discussion.deletingOpinion,
      discussion: state.discussion.discussion,
      error: state.discussion.error,
      toggleingOpinionFavorite: state.discussion.toggleingOpinionFavorite,
    };
  },
  (dispatch) => {
    return {
      getDiscussion: (discussionSlug) => {
        dispatch(getDiscussion(discussionSlug));
      },
      toggleFavorite: (discussionId) => {
        dispatch(toggleFavorite(discussionId));
      },
      toggleOpinionFavorite: (opinionId) => {
        //下面的toggleOpinionFavorite来自于 action
        dispatch(toggleOpinionFavorite(opinionId));
      },
      updateOpinionContent: (content) => {
        dispatch(updateOpinionContent(content));
      },
      postOpinion: (opinion, discussionSlug) => {
        dispatch(postOpinion(opinion, discussionSlug));
      },
      deletePost: (discussionSlug) => {
        dispatch(deletePost(discussionSlug));
      },
      deletedDiscussionRedirect: () => {
        dispatch(deletedDiscussionRedirect());
      },
      deleteOpinion: (opinionId, discussionSlug) => {
        dispatch(deleteOpinion(opinionId, discussionSlug));
      },
    };
  }
)(SingleDiscussion);
