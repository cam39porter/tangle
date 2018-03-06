import * as React from "react";

import { Redirect } from "react-router-dom";

import TextInput from "../components/text-input";
import Button from "../components/button";

import config from "../cfg";

export interface Props {}

export interface SurfaceState {
  value: string;
  clearValue: boolean;
  showResults: boolean;
}

class Surface extends React.Component<Props, SurfaceState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: "",
      clearValue: false,
      showResults: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSurface = this.handleSurface.bind(this);
    this.updateClearValue = this.updateClearValue.bind(this);
  }

  updateClearValue(newClearValue: boolean) {
    this.setState({
      clearValue: newClearValue
    });
  }

  handleChange(value: string): void {
    this.setState({
      value
    });
  }

  handleSurface() {
    const capture = this.state.value.replace(/\n/g, "");
    this.setState({
      clearValue: true
    });
    if (capture === "") {
      return;
    }
    this.setState({
      showResults: true
    });
  }

  render() {
    return (
      <div>
        {/* Text Bar */}
        <div className={`pa3 w-100 vh-100 vh-50-ns center dt measure-narrow`}>
          <div className={`dtc asf v-btm bb b--${config.surfaceAccentColor}`}>
            <TextInput
              handleChange={this.handleChange}
              handleEnterKey={this.handleSurface}
              clearValue={this.state.clearValue}
              updateClearValue={this.updateClearValue}
              placeholder={"What are you looking for..."}
              accentColor={config.surfaceAccentColor}
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
