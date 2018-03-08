import * as React from "react";

import { Redirect } from "react-router-dom";

import NavigationBar from "../components/navigation-bar";
import TextInput from "../components/text-input";
import Button from "../components/button";

import config from "../cfg";

import * as _ from "lodash";

export interface Props {}

export interface SurfaceState {
  value: string;
  showResults: boolean;
}

class Surface extends React.Component<Props, SurfaceState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: "",
      showResults: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSurface = this.handleSurface.bind(this);
  }

  handleChange(value: string): void {
    this.setState({
      value: _.trim(value)
    });
  }

  handleSurface() {
    const surface = this.state.value;
    if (surface === "") {
      return;
    }
    this.setState({
      showResults: true
    });
  }

  render() {
    return (
      <div className={`w-100 vh-100`}>
        {/* Navigation Bar */}
        <div className={`clip-s z-max`}>
          <NavigationBar />
        </div>

        {/* Text Bar */}
        <div className={`pa3 w-100 vh-100 vh-50-ns center dt measure-narrow`}>
          <div className={`dtc asf v-btm bb b--${config.surfaceAccentColor}`}>
            <TextInput
              handleChange={this.handleChange}
              handleEnterKey={this.handleSurface}
              placeholder={"What are you looking for..."}
            />
          </div>
        </div>

        {/* Surface Button */}
        <div className={`tc pa3 clip-s`}>
          <Button
            title="surface"
            onClick={this.handleSurface}
            accentColor={config.surfaceAccentColor}
          />
        </div>

        {/* If Show Results then redirect to SurfaceResults view */}
        {this.state.showResults ? (
          <Redirect
            exact={true}
            push={true}
            to={`/surface/${this.state.value}`}
          />
        ) : null}
      </div>
    );
  }
}

export default Surface;
