// React
import * as React from "react";

// Components
import InputFileUpload from "../components/inputs/input-file-upload";
import DataUsage from "../components/help/data-usage";

// Types
interface Props {}

interface State {}

// Class
class Import extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div className={`vh-100 w-100 overflow-auto`}>
        <div className={`pa4 measure-wide center dark-gray lh-copy`}>
          <div className={`f4 pv4`}>Import from Evernote</div>
          <div className={`f6`}>
            <ol>
              <li>
                Export your Evernote note or notebook as <code>HTML</code>
              </li>
              <br />
              <li>
                Click "Choose Files" below and select the exported{" "}
                <code>.html</code> files from the previous step.
              </li>
            </ol>
          </div>
          <div className={`pv2`}>
            <DataUsage />
          </div>
          <InputFileUpload />
        </div>
      </div>
    );
  }
}

// Export
export default Import;
