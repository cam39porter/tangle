import * as React from "react";

import Button from "../components/button";

import { firebaseAuth } from "../utils";

import config from "../cfg";

interface Props {}

class Tangle extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100 relative`}>
        <div className={`absolute bottom-2 right-2`}>
          <Button
            accentColor={config.tangleAccentColor}
            title="sign out"
            onClick={() => {
              firebaseAuth().signOut();
            }}
          />
        </div>
      </div>
    );
  }
}

export default Tangle;
