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
            const formData = new FormData();
            formData.append("file", this.inputRef.files[0]);
            RestClientUtils.uploadFile(formData);
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
            accept=".html"
          />
        </form>
      </div>
    );
  }
}

// Export
export default InputFileUpload;
