// React
import * as React from "react";
import { uploadFile } from "../utils/rest-client";

class BulkImport extends React.Component<object, object> {
  handleUpload(event: React.FormEvent<EventTarget>) {
    const target = event.target as HTMLInputElement;
    const data = new FormData();
    let files = target.files;
    if (files !== null) {
      data.append("file", files[0]);
    }
    data.append("filename", "note");
    uploadFile(data);
  }

  render() {
    return <input className={``} type="file" onChange={this.handleUpload} />;
  }
}

export default BulkImport;
