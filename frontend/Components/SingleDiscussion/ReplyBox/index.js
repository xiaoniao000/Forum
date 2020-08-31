import React, { Component } from "react";
import styles from "./styles.css";

import RichEditor from "Components/RichEditor";

class ReplyBox extends Component {
  render() {
    const { type, posting, onSubmit, onChange } = this.props;

    if (posting)
      return (
        <div className={styles.loadingWrapper}>Posting your opinion...</div>
      );

    return <RichEditor type={type} onSave={onSubmit} onChange={onChange} />;
  }
}

ReplyBox.defaultProps = {
  type: "newDiscussion",
  posting: false,
  onSubmit: () => {},
  onChange: (value) => {},
};

ReplyBox.propTypes = {
  type: React.PropTypes.string,
  posting: React.PropTypes.bool,
  onSubmit: React.PropTypes.func,
  onChange: React.PropTypes.func,
};

export default ReplyBox;
