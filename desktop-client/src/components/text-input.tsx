import * as React from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface Props {
  handleChange?: (value: string) => void;
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
  }

  handleChange(html: string): void {
    if (this.props.handleChange && this.reactQuillRef !== null) {
      this.props.handleChange(this.reactQuillRef.getEditor().getText());
    }

    this.setState({ editorHtml: html });
  }

  render() {
    return (
      <ReactQuill
        ref={el => {
          this.reactQuillRef = el;
        }}
        onChange={this.handleChange}
        theme={"snow"}
        modules={{
          toolbar: false
        }}
      />
    );
  }
}

export default TextInput;
