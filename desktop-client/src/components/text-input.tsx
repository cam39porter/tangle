import * as React from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

import * as _ from "lodash";

export interface Props {
  handleChange?: (value: string) => void;
  handleEnterKey?: () => void;
  clearValue?: boolean;
  updateClearValue?: (newClearValue: boolean) => void;
  startingValue?: string;
  placeholder?: string;
}

export interface TextInputState {
  editorHtml: string;
  modules: Object;
}

class TextInput extends React.Component<Props, TextInputState> {
  // reference to quill element
  reactQuillRef: ReactQuill | null = null;

  constructor(props: Props) {
    super(props);

    let modules: Object = {
      toolbar: false
    };

    if (this.props.handleEnterKey) {
      modules = _.assign(modules, {
        keyboard: {
          bindings: {
            tab: false,
            handleEnter: {
              key: "Enter",
              handler: () => null
            }
          }
        }
      });
    }

    this.state = {
      editorHtml: "",
      modules
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // focus on editor on load and register functionality
    if (this.reactQuillRef) {
      const editor = this.reactQuillRef.getEditor();
      editor.focus();

      if (this.props.startingValue) {
        editor.setText(this.props.startingValue);
        editor.blur();
      }
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    // clear value if directed by parent
    if (nextProps.clearValue) {
      this.handleClearValue();
    }
  }

  handleClearValue() {
    if (this.reactQuillRef !== null) {
      this.reactQuillRef.getEditor().setText("");
    }
    // inform parent that editor has been cleared
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
    // Map the enter to key to anther action provided by parent
    if (e.key === "Enter") {
      if (this.props.handleEnterKey) {
        this.props.handleEnterKey();
      }
    }
  }
  render() {
    return (
      <ReactQuill
        ref={el => {
          this.reactQuillRef = el;
        }}
        placeholder={this.props.placeholder ? this.props.placeholder : ""}
        theme={"bubble"}
        modules={this.state.modules}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

export default TextInput;
