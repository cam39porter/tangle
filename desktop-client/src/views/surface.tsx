import * as React from "react";

import TextInputSurface from "../components/text-input-surface";

export interface Props {}
export interface SurfaceState {}

class Surface extends React.Component<Props, SurfaceState> {
  render() {
    return (
      <div className={``}>
        <TextInputSurface />
      </div>
    );
  }
}

export default Surface;
