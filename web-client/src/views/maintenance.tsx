// React
import * as React from "react";

interface Props {}

interface State {}

class Maintenance extends React.Component<Props, State> {
  render() {
    return (
      <div className={`dt vh-100 w-100 bg-near-white sans-serif`}>
        <div className={`dtc v-mid`}>
          <div className={`center measure pa4 bg-white br4 shadow-1 tc`}>
            <div>
              <img
                src="https://storage.googleapis.com/usetangle-static-assets/logo.png"
                className={`pa2 bb bw2 b--accent`}
                style={{
                  maxHeight: "5em"
                }}
              />
            </div>
            <div className={`pa4 tl`}>
              <h3 className={`tc`}>Oops, Tangle is resting.</h3>
              <p>
                We are currently giving Tangle a rest to make a quick update.
              </p>
              <p>We should be back online in no time!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Maintenance;
