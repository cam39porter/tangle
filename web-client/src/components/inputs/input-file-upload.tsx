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
  formRef: HTMLFormElement | null = null;

  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div className={`flex`}>
        <div
          className={`ph2 dim`}
          onClick={() => {
            if (!this.formRef) {
              return;
            }
            const formData = new FormData(this.formRef);
            RestClientUtils.uploadFile(formData);
          }}
        >
          <ButtonImport />
        </div>

        <form ref={e => (this.formRef = e)}>
          <input className={`ph2 f7`} type="file" accept=".html" />
        </form>
      </div>
    );
  }
}

// Export
export default InputFileUpload;
