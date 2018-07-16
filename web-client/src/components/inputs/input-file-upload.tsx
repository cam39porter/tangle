// React
import * as React from "react";

// Components
import ButtonImport from "../buttons/button-import";
import { RestClientUtils } from "../../utils";

// Types
interface Props {}

interface State {}

// Class
class InputFileUpload extends React.Component<Props, State> {
  inputRef: HTMLInputElement | null = null;

  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div className={`flex`}>
        <div
          className={`ph2 dim`}
          onClick={() => {
            if (
              !(
                this.inputRef &&
                this.inputRef.files &&
                this.inputRef.files.length > 0
              )
            ) {
              return;
            }
            RestClientUtils.uploadFiles(this.inputRef.files);
            this.inputRef.value = "";
          }}
        >
          <ButtonImport />
        </div>
        <form>
          <input
            ref={e => {
              this.inputRef = e;
            }}
            className={`ph2 f7`}
            type="file"
            multiple={true}
            accept=".html"
          />
        </form>
      </div>
    );
  }
}

// Export
export default InputFileUpload;
