import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";
import classnames from "classnames";
import styles from "./styles.css";

import PlaceholderImage from "SharedStyles/placeholder.jpg";
import Button from "Components/Button";
import RichEditor from "Components/RichEditor";

class Opinion extends Component {
  render() {
    const {
      opinionId,
      userAvatar,
      userName,
      userGitHandler,
      opDate,
      opContent,
      userId,
      currentUserId,
      currentUserRole,
      deleteAction,
      deletingOpinion,

      favoriteCount,
      favoriteAction,
      userFavorited,
      toggleingFavorite,
    } = this.props;

    let dateDisplay = moment(opDate);
    dateDisplay = dateDisplay.from(moment());

    const allowDelete = userId === currentUserId || currentUserRole === "admin";

    let favCount = "";
    if (toggleingFavorite) favCount = "Toggling Favorite...";
    else if (userFavorited) favCount = `Favorited (${favoriteCount})`;
    else if (favoriteCount === 0) favCount = "Make favorite";
    else if (favoriteCount === 1) favCount = "1 favorite";
    else favCount = `${favoriteCount} favorites`;

    return (
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <img className={styles.avatar} src={userAvatar} />
          <div className={styles.userInfo}>
            <Link to={`/user/${userGitHandler}`} className={styles.name}>
              {userName || userGitHandler}
            </Link>
            <a
              href={`https://www.github.com/${userGitHandler}`}
              target="_blank"
              className={styles.gitHandler}
            >
              <i className={classnames("fa fa-github-alt", styles.gitIcon)}></i>
              <span>{userGitHandler}</span>
            </a>
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
          <RichEditor readOnly value={opContent} isOpinion={true} />
        </div>

        {/* 点赞 */}
        {
          <Button
            className={styles.favoriteButton}
            noUppercase
            onClick={() => {
              !toggleingFavorite && favoriteAction(opinionId);
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
        {}

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
  favoriteAction: () => {},
  userFavorited: false,
  toggleingFavorite: false,
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
  favoriteAction: React.PropTypes.func,
  userFavorited: React.PropTypes.bool,
  toggleingFavorite: React.PropTypes.bool,
};

export default Opinion;
