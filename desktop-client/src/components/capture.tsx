import * as React from "react";
export interface Props {}
export interface CaptureState {
  value: string;
}
class Capture extends React.Component<Props, CaptureState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLTextAreaElement>): void {
    this.setState({ value: event.currentTarget.value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    alert("Check out your capture:" + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className={`mt7`}>
        {/* Capture and Surface Bar */}
        <form className={`pa4 black-80`} onSubmit={this.handleSubmit}>
          <div className={`pa2`}>
            {/* Capture and Surface Text Area */}
            <textarea
              id="comment"
              name="comment"
              className="db v-mid center shadow-hover border-box w-100 measure ba b--black-20 br2 mb2 f6"
              aria-describedby="comment-desc"
              value={this.state.value}
              onChange={this.handleChange}
            />
            {/* Capture and Surface Buttons */}
            <div className={`db f6 tc`}>
              <input
                type="submit"
                value="capture"
                className={`dib ma2 pa2 br2 b bg-light-gray gray`}
              />
              <input
                type="submit"
                value="surface"
                className={`dib ma2 pa2 br2 b bg-light-gray gray`}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Capture;
