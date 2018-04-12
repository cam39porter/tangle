// React
import * as React from "react";

// Components
import Button from "../components/button";

// Firebase
import { firebaseAuth } from "../utils";

// Config
import config from "../cfg";

interface Props {}

interface State {}

class Tangle extends React.Component<Props, State> {
  render() {
    return (
      <div className={`vh-100 w-100 relative`}>
        <div className={`absolute bottom-2 right-2`}>
          <Button
            accentColor={config.tangleAccentColor}
            title="sign out"
            onClick={() => {
              localStorage.removeItem("idToken");
              firebaseAuth().signOut();
            }}
          />
        </div>
      </div>
    );
  }
}

export default Tangle;
