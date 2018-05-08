// React
import * as React from "react";

// Quill
import ReactQuill from "react-quill";
require("react-quill/dist/quill.bubble.css");

// Random
import { assign } from "lodash";

interface Props {
  handleEnterKey?: () => void;
  handleChange?: (text: string) => void;
  updateClearValue?: (newClearValue: boolean) => void;
  clearValue?: boolean;
  startingValue?: string;
  placeholder?: string;
  allowToolbar?: boolean;
}

interface State {
  text: string;
  editorHtml: string;
  modules: Object;
  shiftIsPressed: boolean;
}

class InputText extends React.Component<Props, State> {
  // reference to quill element
  reactQuillRef: ReactQuill | null = null;

  constructor(props: Props) {
    super(props);

    let modules: Object = {
      toolbar: props.allowToolbar
    };

    if (this.props.handleEnterKey) {
      modules = assign(modules, {
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
      text: "",
      editorHtml: "",
      modules,
      shiftIsPressed: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // focus on editor on load and register functionality
    if (this.reactQuillRef) {
      const editor = this.reactQuillRef.getEditor();
      editor.setText(this.props.startingValue || "");
      editor.focus();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    // clear value if directed by parent
    if (nextProps.clearValue) {
      this.handleClearValue();
    }
  }

  handleClearValue = () => {
    if (this.reactQuillRef !== null) {
      this.reactQuillRef.getEditor().setText("");
    }
    // inform parent that editor has been cleared
    if (this.props.updateClearValue) {
      this.props.updateClearValue(false);
    }
  };

  handleChange = (html: string): void => {
    if (this.reactQuillRef) {
      const editor = this.reactQuillRef.getEditor();
      const text = editor.getText();

      this.props.handleChange && this.props.handleChange(text);
      this.setState({ text: text, editorHtml: html });
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<KeyUsage>) => {
    if (e.key === "Shift") {
      this.setState({
        shiftIsPressed: true
      });
    }

    // Map the enter to key to anther action provided by parent
    if (e.key === "Enter") {
      if (this.props.handleEnterKey) {
        if (!this.state.shiftIsPressed) {
          this.props.handleEnterKey();
          if (this.reactQuillRef) {
            this.reactQuillRef.getEditor().setText("");
          }
        }
      }
    }
  };

  handleKeyUp = (e: React.KeyboardEvent<KeyUsage>) => {
    if (e.key === "Shift") {
      this.setState({
        shiftIsPressed: false
      });
    }
  };

  render() {
    return (
      <ReactQuill
        ref={el => {
          this.reactQuillRef = el;
        }}
        placeholder={this.props.placeholder ? this.props.placeholder : ""}
        theme={"bubble"}
        modules={this.state.modules}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onChange={this.handleChange}
      />
    );
  }
}

export default InputText;
