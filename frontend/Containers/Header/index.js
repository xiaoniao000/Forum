import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import appLayout from "SharedStyles/appLayout";
import styles from "./styles";

// components for Header
import UserMenu from "Components/Header/UserMenu";
import Logo from "Components/Header/Logo";
import NavigationBar from "Components/Header/NavigationBar";
import PlaceholderImage from "SharedStyles/placeholder.jpg";

class Header extends Component {
  //渲染导航栏
  renderNavLinks() {
    const { forums } = this.props;

    if (forums) {
      return forums.map((forum) => {
        return {
          id: forum._id,
          name: forum.forum_name,
          link: `/${forum.forum_slug}`,
        };
      });
    }

    return null;
  }

  render() {
    const { authenticated, name, username, avatarUrl } = this.props.user;

    return (
      <div className={classnames(appLayout.constraintWidth)}>
        <div className={styles.headerTop}>
          <Logo />
          {/* 用户栏 */}
          <UserMenu
            signedIn={authenticated}
            userName={name || username}
            gitHandler={username}
            avatar={avatarUrl}
          />
        </div>
        {/* 导航栏 */}
        <NavigationBar navigationLinks={this.renderNavLinks()} />
      </div>
    );
  }
}

export default connect((state) => {
  return {
    user: state.user,
    forums: state.app.forums,
  };
})(Header);
