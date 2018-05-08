// React
import * as React from "react";

// Quill
import ReactQuill from "react-quill";
require("react-quill/dist/quill.bubble.css");

// Random
import { assign } from "lodash";

interface Props {
  handleChange?: (value: string) => void;
  handleEnterKey?: () => void;
  updateClearValue?: (newClearValue: boolean) => void;
  clearValue?: boolean;
  startingValue?: string;
  placeholder?: string;
}

interface State {
  editorHtml: string;
  modules: Object;
}

class InputText extends React.Component<Props, State> {
  // reference to quill element
  reactQuillRef: ReactQuill | null = null;

  constructor(props: Props) {
    super(props);

    let modules: Object = {
      toolbar: false
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

export default InputText;
