import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";
import classnames from "classnames";
import styles from "./styles.css";

import PlaceholderImage from "SharedStyles/placeholder.jpg";
import Button from "Components/Button";
import RichEditor from "Components/RichEditor";
import ReplyBox from "../ReplyBox";

class Opinion extends Component {
  state = {
    isReplying: false,
  };

  //用户是否给二级评论点赞过
  userFavoritedOpinion(userId, opinionFavorites) {
    let favorited = false;
    for (let i = 0; i < opinionFavorites.length; i++) {
      if (opinionFavorites[i] === userId) favorited = true;
    }
    return favorited;
  }

  //创建二级评论
  handleReplySubmit = () => {
    const {
      postOpinion,
      subOpinionContent,
      currentUserId, //当前回复人的id
      userId, //回复的opinion的发布者id
      forumId,
      discussionId,
      discussionSlug,
      opinionId,
      depth,
    } = this.props;

    //创建一个opnion需要的信息
    const opinion = {
      forum_id: forumId,
      discussion_id: discussionId,
      user_id: currentUserId,
      content: subOpinionContent,
      parent_id: opinionId,
      parent_user_id: userId,
      depth,
    };

    postOpinion(opinion, discussionSlug);
    this.setState((prevState) => ({
      isReplying: !prevState.isReplying,
    }));
  };

  render() {
    const {
      opinionId,
      userAvatar,
      userName,
      userGitHandler,
      opDate,
      opContent,
      userId, //发表opinion的人的id
      //当前浏览用户能否删除评论
      currentUserId, //当前浏览者的id
      currentUserRole, //当前浏览者的角色
      deleteAction, //删除评论的action
      deletingOpinion, //是否正在删除评论
      //点赞
      favoriteCount, //当前评论点赞数
      toggleOpinionFavoriteAction, //点赞评论的action
      userFavorited, //当前用户是否点赞该评论
      toggleingOpinionFavorite, //切换点赞状态
      //多级回复
      posting,
      subOpinions, //存放多级回复的数组，由容器组件传值
      updateSubOpinionContentAction,
      parentUser,
    } = this.props;

    let dateDisplay = moment(opDate);
    dateDisplay = dateDisplay.from(moment());

    const allowDelete = userId === currentUserId || currentUserRole === "admin";

    let favCount = "";
    if (toggleingOpinionFavorite) favCount = "Toggling Favorite...";
    else if (userFavorited) favCount = `Favorited (${favoriteCount})`;
    else if (favoriteCount === 0) favCount = "Make favorite";
    else if (favoriteCount === 1) favCount = "1 favorite";
    else favCount = `${favoriteCount} favorites`;

    let isReplying = this.state.isReplying;

    return (
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <img className={styles.avatar} src={userAvatar} />
          <div className={styles.userInfo}>
            <Link to={`/user/${userGitHandler}`} className={styles.name}>
              {userName || userGitHandler}
            </Link>
            {/* <a
              href={`https://www.github.com/${userGitHandler}`}
              target="_blank"
              className={styles.gitHandler}
            >
              <i className={classnames("fa fa-github-alt", styles.gitIcon)}></i>
              <span>{userGitHandler}</span>
            </a> */}
            {this.props.discussionId !== this.props.parentId && (
              <span>
                &nbsp;&nbsp; replies to&nbsp;&nbsp;
                <Link
                  to={`/user/${parentUser.username}`}
                  className={styles.name}
                >
                  {parentUser.username}
                </Link>
              </span>
            )}
          </div>
          <div className={styles.dateInfo}>{dateDisplay}</div>
          {allowDelete && (
            <Button
              className={styles.deleteButton}
              noUppercase
              onClick={() => {
                deleteAction(opinionId);
              }}
            >
              <i className={classnames("fa fa-trash", styles.trashIcon)}></i>
              <span>Delete</span>
            </Button>
          )}
          {/* <Button noUppercase>Quote</Button> */}
        </div>
        <div className={styles.opContent}>
          <RichEditor readOnly value={opContent} />
        </div>
        {/* 点赞 */}
        {
          <Button
            className={styles.favoriteButton}
            noUppercase
            onClick={() => {
              !toggleingOpinionFavorite &&
                toggleOpinionFavoriteAction(opinionId);
            }}
          >
            <i
              className={classnames(
                `fa fa-${userFavorited ? "heart" : "heart-o"}`
              )}
            ></i>
            <span>{favCount}</span>
          </Button>
        }
        {/* 二级回复 */}
        {/*   按钮 */}
        <Button
          className={styles.favoriteButton}
          noUppercase
          onClick={() => {
            this.setState((prevState) => ({
              isReplying: !prevState.isReplying,
            }));
          }}
        >
          <span>{isReplying ? "Cancel Reply" : "Reply"}</span>
        </Button>

        {isReplying && (
          <ReplyBox
            type="newOpinion"
            posting={posting}
            onSubmit={this.handleReplySubmit}
            onChange={(content) => {
              updateSubOpinionContentAction(content);
            }}
          />
        )}

        {/*   列表 可能要重新写一个子评论的组件 */}
        {subOpinions &&
          subOpinions.map((opinion) => {
            //check if user favorated the opinion
            const opinionUserFavorited = this.userFavoritedOpinion(
              currentUserId,
              opinion.opinionFavorites
            );

            return (
              <div
                key={opinion._id}
                style={{ marginLeft: 20, marginRight: 20 }}
              >
                <Opinion
                  key={opinion._id}
                  opinionId={opinion._id}
                  userAvatar={opinion.user.avatarUrl}
                  userName={opinion.user.name}
                  userGitHandler={opinion.user.username}
                  opDate={opinion.date}
                  opContent={opinion.content}
                  userId={opinion.user_id}
                  // 点赞
                  favoriteCount={opinion.opinionFavorites.length}
                  toggleOpinionFavoriteAction={toggleOpinionFavoriteAction}
                  userFavorited={opinionUserFavorited}
                  // 回复
                  forumId={this.props.forumId}
                  discussionId={this.props.discussionId}
                  discussionSlug={this.props.discussionSlug}
                  depth={this.props.depth}
                  postOpinion={this.props.postOpinion}
                  posting={this.posting}
                  subOpinionContent={this.props.subOpinionContent}
                  updateSubOpinionContentAction={updateSubOpinionContentAction}
                  parentId={opinion.parent_id}
                  parentUser={opinion.parent_user}
                  // 删除该评论
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  deleteAction={deleteAction}
                  deletingOpinion={deletingOpinion}
                />
              </div>
            );
          })}

        {deletingOpinion === opinionId && (
          <div className={styles.deletingOpinion}>Deleting Opinion ...</div>
        )}
      </div>
    );
  }
}

Opinion.defaultProps = {
  opinionId: "12345",
  userAvatar: PlaceholderImage,
  userName: "User name",
  userGitHandler: "github",
  opDate: "a day ago",
  opContent:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  userId: "12345",
  currentUserId: "12345",
  currentUserRole: "user",
  deleteAction: () => {},
  deletingOpinion: null,
  favoriteCount: 0,
  toggleOpinionFavoriteAction: () => {},
  userFavorited: false,
  toggleingOpinionFavorite: false,
  parentUser: {}, //评论回复的评论的发布者
  parentId: "", //该评论回复的评论的opinionId
  subOpinions: [], //多级评论数组
  posting: false,
  postOpnion: () => {},
  forumId: "",
  discussionId: "",
  discussionSlug: "",
  depth: 0,
  subOpinionContent: "",
  updateSubOpinionContentAction: () => {},
};

Opinion.propTypes = {
  opinionId: React.PropTypes.string,
  userAvatar: React.PropTypes.string,
  userName: React.PropTypes.string,
  userGitHandler: React.PropTypes.string,
  opDate: React.PropTypes.any,
  opContent: React.PropTypes.string,
  userId: React.PropTypes.string,
  currentUserId: React.PropTypes.string,
  currentUserRole: React.PropTypes.string,
  deleteAction: React.PropTypes.func,
  deletingOpinion: React.PropTypes.any,
  favoriteCount: React.PropTypes.number,
  toggleOpinionFavoriteAction: React.PropTypes.func,
  userFavorited: React.PropTypes.bool,
  toggleingOpinionFavorite: React.PropTypes.bool,
  parentId: React.PropTypes.string,
  parentUser: React.PropTypes.object,
  subOpinions: React.PropTypes.array,
  posting: React.PropTypes.bool,
  postOpinion: React.PropTypes.func,
  forumId: React.PropTypes.string,
  discussionId: React.PropTypes.string,
  discussionSlug: React.PropTypes.string,
  depth: React.PropTypes.number,
  subOpinionContent: React.PropTypes.string,
  updateSubOpinionContentAction: React.PropTypes.func,
};

export default Opinion;
