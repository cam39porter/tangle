// React
import * as React from "react";

// GraphQL
import { ArchiveCaptureMutation as Response } from "../__generated__/types";
import { ArchiveCapture as MUTATION } from "../queries";
import { graphql, ChildProps } from "react-apollo";

// Components
import {
  Edit,
  MessageSquare,
  Trash,
  MoreVertical,
  Share2
} from "react-feather";

// Config / Utils

const ICON_SIZE = 20;

interface Props extends ChildProps<{}, Response> {
  id: string;
  body: string;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  accentColor: string;
  baseColor: string;
  textColor?: string;
  isFocus: boolean;
  maxHeight?: string;
  showActionBar: boolean;
  onShowActionBarChange: (id: string) => void;
  handleRefetch: (id: string) => void;
}

interface State {}

class ResultListItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div
          className={`bg-${this.props.baseColor || "white"} w-100 pa2 ${
            this.props.showActionBar ? "" : "bb b--light-gray"
          } dt pointer bg-animate-ns hover-bg-near-white-ns ${this.props
            .textColor || "dark-gray"}  ${this.props.isFocus &&
            `bg-${this.props.accentColor}`}`}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          onClick={this.props.onClick}
          key={this.props.id}
        >
          <div className={`dt-row ma3 w-100`}>
            <p
              className={`dtc w-9 fl ma3 f6 overflow-hidden lh-copy`}
              style={{
                maxHeight: this.props.maxHeight
              }}
            >
              {this.props.body}
            </p>
            <div className={`dtc pv3 w-10 v-top tc`}>
              <div
                className={`pt1 h2 w-100`}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();

                  this.props.onShowActionBarChange(this.props.id);
                }}
              >
                <MoreVertical />
              </div>
            </div>
          </div>
        </div>
        {this.props.showActionBar ? (
          <div
            className={`dt w-100 tc pa3 bg-${this.props.baseColor ||
              "white"} bb b--light-gray ${
              this.props.baseColor === "white" ? "dark-gray" : "white"
            }`}
          >
            <div className={`dtc v-mid pointer`}>
              <MessageSquare size={ICON_SIZE} />
            </div>
            <div className={`dtc v-mid pointer`}>
              <Share2 size={ICON_SIZE} />
            </div>
            <div className={`dtc v-mid pointer`}>
              <Edit size={ICON_SIZE} />
            </div>
            <div
              className={`dtc v-mid pointer`}
              onClick={() => {
                if (!this.props.mutate) {
                  return;
                }

                this.props
                  .mutate({
                    // strip new lines from the value entered
                    variables: { id: this.props.id }
                  })
                  .then(() => {
                    this.props.handleRefetch(this.props.id);
                  });
              }}
            >
              <Trash size={ICON_SIZE} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default graphql<Response, Props>(MUTATION)(ResultListItem);
