import React, { Component } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import classnames from "classnames";
import styles from "./styles";

import Button from "Components/Button";
import BlockStyleControls from "./BlockStyleControls";
import InlineStyleControls from "./InlineStyleControls";

//富文本编辑器
class RichEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.focus = () => this.refs.editor.focus();
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onTab = this.onTab.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      const contentState = convertFromRaw(JSON.parse(value));
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState });
    }
  }

  onEditorStateChange(editorState) {
    const { onChange } = this.props;
    this.setState({ editorState });

    // trigger on change converting the ContentState to raw object
    onChange(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onEditorStateChange(newState);
      return true;
    }
    return false;
  }

  onTab(event) {
    const maxDepth = 4;
    this.onEditorStateChange(
      RichUtils.onTab(event, this.state.editorState, maxDepth)
    );
  }

  toggleBlockType(blockType) {
    this.onEditorStateChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType)
    );
  }

  toggleInlineStyle(inlineStyle) {
    this.onEditorStateChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  customBlockStyles(contentBlock) {
    const type = contentBlock.getType();
    if (type === "blockquote") return styles.editorBlockquoteStyle;
    if (type === "code-block") return styles.editorCodeStyle;
    if (type === "header-one") return styles.editorH1Style;
    if (type === "header-two") return styles.editorH2Style;
    if (type === "header-three") return styles.editorH3Style;
  }

  render() {
    // @type  类型是发帖还是回复
    const { type, onSave, readOnly } = this.props;

    // styling for inline styles
    const inlineStyleMap = {
      CODE: {
        color: "#e74c3c",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e8e8e8",
        fontFamily: "monospace",
        padding: "2px 5px",
        margin: "0px 5px",
      },
    };

    //根据type是发帖还是回复，决定发送按钮是Post Discussion还是Reply
    let saveButtonLabel = "";
    if (type === "newOpinion") saveButtonLabel = "Reply";
    if (type === "newDiscussion") saveButtonLabel = "Post Discussion";

    //根据type是发帖还是回复，决定placeholder的值
    let placeholder = "";
    if (type === "newOpinion") placeholder = "Your opinion...";
    if (type === "newDiscussion") placeholder = "Discussion summary...";

    return (
      <div
        className={classnames(
          styles.container,
          readOnly && styles.readOnlyContainer
        )}
      >
        {/* 富文本编辑器的编辑栏   BOLD ITALIC... */}
        {!readOnly && (
          <div className={styles.controlsContainer}>
            <InlineStyleControls
              type={type}
              editorState={this.state.editorState}
              onToggle={this.toggleInlineStyle}
            />

            <BlockStyleControls
              type={type}
              editorState={this.state.editorState}
              onToggle={this.toggleBlockType}
            />
          </div>
        )}

        {/* 输入框 */}
        <div
          className={classnames(
            styles.editorContainer,
            !readOnly && styles[type],
            readOnly && styles.readOnlyEditorContainer
          )}
          onClick={this.focus}
        >
          <Editor
            customStyleMap={inlineStyleMap}
            blockStyleFn={this.customBlockStyles}
            readOnly={readOnly}
            editorState={this.state.editorState}
            onChange={this.onEditorStateChange}
            placeholder={placeholder}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            ref="editor"
          />
        </div>

        {/* Reply按钮 */}
        {!readOnly && (
          <Button noUppercase style={{ alignSelf: "center" }} onClick={onSave}>
            {saveButtonLabel}
          </Button>
        )}
      </div>
    );
  }
}

RichEditor.defaultProps = {
  readOnly: false,
  value: null,
  type: "newDiscussion",
  onChange: () => {},
  onSave: () => {},
};

RichEditor.propTypes = {
  readOnly: React.PropTypes.bool,
  value: React.PropTypes.any, //评论的内容
  type: React.PropTypes.oneOf(["newDiscussion", "newOpinion"]),
  onChange: React.PropTypes.func,
  onSave: React.PropTypes.func,
};

export default RichEditor;
