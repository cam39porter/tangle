// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// Components
import { RestClientUtils, ErrorsUtils } from "../../utils";

// Types
interface Props extends RouteComponentProps<{}> {}

interface State {
  files: FileList | null;
  errorUploading: boolean | null;
  isProcessing: boolean;
}

// Class
class InputFileUpload extends React.Component<Props, State> {
  inputRef: HTMLInputElement | null = null;

  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      files: null,
      errorUploading: null,
      isProcessing: false
    };
  }

  handleOnChange = () => {
    if (
      !(this.inputRef && this.inputRef.files && this.inputRef.files.length > 0)
    ) {
      this.setState({
        files: null
      });
      return;
    }

    this.setState({
      files: this.inputRef.files
    });
  };

  render() {
    const { files, errorUploading, isProcessing } = this.state;

    return (
      <div className={``}>
        <div className={`tc`}>
          <form>
            <input
              ref={e => {
                this.inputRef = e;
              }}
              className={`pa2 pb4 f7`}
              type="file"
              multiple={true}
              accept=".html"
              onChange={this.handleOnChange}
            />
          </form>
          {!files ? null : !isProcessing ? (
            <span
              className={`pa2 br4 bg-accent near-white pointer dim`}
              style={{
                userSelect: "none"
              }}
              onClick={() => {
                if (!files) {
                  return;
                }
                this.setState({
                  isProcessing: true
                });
                RestClientUtils.uploadFiles(files)
                  .then(() => {
                    if (!this.inputRef) {
                      return;
                    }
                    this.inputRef.value = "";
                    this.setState({
                      files: null,
                      errorUploading: false,
                      isProcessing: false
                    });
                  })
                  .catch(error => {
                    this.setState({
                      errorUploading: true,
                      isProcessing: false
                    });
                    ErrorsUtils.errorHandler.report(error.message, error.stack);
                  });
              }}
            >
              Import
            </span>
          ) : (
            <span
              className={`pa2 bg-gray near-white br4`}
              style={{
                userSelect: "none"
              }}
            >
              Processing
            </span>
          )}
        </div>
        <div className={`f6 dark-gray`}>
          {errorUploading === null ? null : errorUploading ? (
            <div className={`light-red`}>
              <p>We ran into some trouble importing your notes.</p>
              <p>
                Make sure that you are importing <code>HTML</code> exported from
                Evernote.
              </p>
            </div>
          ) : (
            <div className={`tc`}>
              <p>Your notes were successfully imported</p>
              <div className={`pa2`}>
                <span
                  className={`pa2 bg-accent near-white br4 pointer dim`}
                  style={{
                    userSelect: "none"
                  }}
                  onClick={() => {
                    this.props.history.push("/");
                  }}
                >
                  Home
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Export
export default withRouter(InputFileUpload);
