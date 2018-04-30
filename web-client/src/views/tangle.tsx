// React
import * as React from "react";

// Components
import Button from "../components/button";
import BulkImport from "../components/bulk-import";

// Firebase
import { firebaseAuth } from "../utils";

interface Props {}

interface State {}

class Tangle extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <div className={`fixed top-2 left-2`}>
          <Button
            accentColor={"accent"}
            title={"sign out"}
            onClick={() => {
              localStorage.removeItem("idToken");
              firebaseAuth().signOut();
            }}
          />
        </div>
        <div className={`fixed bottom-2 left-2`}>
          <BulkImport />
        </div>
      </div>
    );
  }
}

export default Tangle;
