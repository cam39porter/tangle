// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// Components
import { RestClientUtils, ErrorsUtils } from "../../utils";
import { Check, X } from "react-feather";

// Types
interface Props extends RouteComponentProps<{}> {}

interface State {
  files: FileList | null;
  inProgress: boolean;
  isDone: boolean;
  filesUploaded: Array<{
    name: string;
    success: boolean;
    error: string | null;
  }>;
}

// Class
class InputFileUpload extends React.Component<Props, State> {
  inputRef: HTMLInputElement | null = null;

  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      inProgress: false,
      isDone: false,
      files: null,
      filesUploaded: []
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

  uploadFiles = (files: FileList) => {
    const uploadFileFuncs = Array.from(files).map(file => () => {
      const startingFilesUpload = this.state.filesUploaded;
      const index = startingFilesUpload.length;
      this.setState({
        filesUploaded: startingFilesUpload.concat({
          name: file.name,
          success: false,
          error: null
        })
      });
      return RestClientUtils.uploadFile(file)
        .then(() => {
          const successFilesUploaded = this.state.filesUploaded;
          successFilesUploaded[index] = {
            name: file.name,
            success: true,
            error: null
          };

          this.setState({
            filesUploaded: successFilesUploaded
          });
        })
        .catch(error => {
          const errorFilesUploaded = this.state.filesUploaded;
          errorFilesUploaded[index] = {
            name: file.name,
            success: false,
            error:
              "We failed to import the above file. Make sure this is an HTML export from Evernote. Feel free to try importing it again."
          };

          this.setState({
            filesUploaded: errorFilesUploaded
          });

          ErrorsUtils.errorHandler.report(error.message, error.stack);
        });
    });
    return RestClientUtils.promiseSerial(uploadFileFuncs);
  };

  render() {
    const { files, filesUploaded, inProgress, isDone } = this.state;
    const { history } = this.props;

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
          <span
            className={`pa2 br4 ${
              inProgress ? "bg-gray" : "bg-accent"
            } near-white pointer dim`}
            style={{
              userSelect: "none"
            }}
            onClick={() => {
              if (!(files && !inProgress)) {
                return;
              }

              this.setState(
                {
                  inProgress: true,
                  filesUploaded: [],
                  isDone: false
                },
                () => {
                  this.uploadFiles(files).finally(() => {
                    this.setState({
                      inProgress: false,
                      isDone: true
                    });
                  });

                  if (!this.inputRef) {
                    return;
                  }
                  this.inputRef.value = "";
                }
              );
            }}
          >
            {inProgress ? "Importing" : "Import"}
          </span>
        </div>
        <div className={`dt w-100 pv4 f6`}>
          {filesUploaded &&
            filesUploaded.map(fileProgress => {
              const { name, success, error } = fileProgress;
              return (
                <div key={name} className={`dt-row`}>
                  <div className={`flex pa2`}>
                    <div className={`pr2`}>
                      {success ? (
                        <div className={`light-green`}>
                          <Check />
                        </div>
                      ) : error ? (
                        <div className={`light-red`}>
                          <X />
                        </div>
                      ) : (
                        <div className={`gray f7`}>...</div>
                      )}
                    </div>
                    <div className={`code`}>{name}</div>
                  </div>
                  <div className={`pa2 light-red f7`}>{error}</div>
                </div>
              );
            })}
        </div>
        {isDone && (
          <div className={`f6`}>
            <p>
              The notes with a check next to them have been successfully
              imported.
            </p>
            <p>
              We are processing them now and will be accessible on your home
              screen momentarily.
            </p>
            <div className={`tc`}>
              <span
                className={`pa2 br4 bg-accent near-white pointer f5 dim`}
                style={{
                  userSelect: "none"
                }}
                onClick={() => {
                  history.push("/");
                }}
              >
                Home
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

// Export
export default withRouter(InputFileUpload);
