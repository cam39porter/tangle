import * as React from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface Props {
  handleChange?: (value: string) => void;
  handleEnterKeyUp?: () => void;
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
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    // alert(nextProps);
  }

  handleChange(html: string): void {
    if (this.props.handleChange && this.reactQuillRef !== null) {
      this.props.handleChange(this.reactQuillRef.getEditor().getText());
    }

    this.setState({ editorHtml: html });
  }

  handleKeyUp(e: React.KeyboardEvent<KeyUsage>) {
    if (e.key === "Enter") {
      if (this.props.handleEnterKeyUp) {
        this.props.handleEnterKeyUp();
        if (this.reactQuillRef !== null) {
          this.reactQuillRef.getEditor().setText("");
        }
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
        onKeyDown={this.handleKeyUp}
      />
    );
  }
}

export default TextInput;
