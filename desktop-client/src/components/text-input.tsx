import * as React from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface Props {
  handleChange?: (value: string) => void;
  handleEnterKeyDown?: () => void;
  clearValue?: boolean;
  updateClearValue?: (newClearValue: boolean) => void;
}

export interface TextInputState {
  editorHtml: string;
  mountedEditor: boolean;
}

class TextInput extends React.Component<Props, TextInputState> {
  reactQuillRef: ReactQuill | null = null;
  modules: Object;

  constructor(props: Props) {
    super(props);

    this.state = { editorHtml: "", mountedEditor: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.clearValue) {
      this.handleClearValue();
    }
  }

  handleClearValue() {
    if (this.reactQuillRef !== null) {
      this.reactQuillRef.getEditor().setText("");
    }
    if (this.props.updateClearValue) {
      this.props.updateClearValue(false);
    }
  }

  handleChange(html: string): void {
    if (this.props.handleChange && this.reactQuillRef !== null) {
      this.props.handleChange(this.reactQuillRef.getEditor().getText());
    }

    this.setState({ editorHtml: html });
  }

  handleKeyDown(e: React.KeyboardEvent<KeyUsage>) {
    if (e.key === "Enter") {
      if (this.props.handleEnterKeyDown) {
        this.props.handleEnterKeyDown();
      }
    }
  }

  render() {
    return (
      <ReactQuill
        ref={el => {
          this.reactQuillRef = el;
        }}
        theme={"snow"}
        modules={{
          toolbar: false
        }}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

export default TextInput;
