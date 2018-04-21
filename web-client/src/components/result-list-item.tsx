// React
import * as React from "react";

// GraphQL
import {
  ArchiveCaptureMutation,
  ArchiveCaptureMutationVariables,
  EditCaptureMutation,
  EditCaptureMutationVariables
} from "../__generated__/types";
import { ArchiveCapture, EditCapture } from "../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components
import {
  Edit,
  MessageSquare,
  Trash,
  MoreVertical,
  Crosshair
} from "react-feather";
import TextInput from "../components/text-input";

// Config / Utils
import config from "../cfg";
import { isEqual } from "lodash";

const ICON_SIZE = 20;

interface Props {
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
  archiveCapture: MutationFunc<
    ArchiveCaptureMutation,
    ArchiveCaptureMutationVariables
  >;
  editCapture: MutationFunc<EditCaptureMutation, EditCaptureMutationVariables>;
}

interface State {
  isEditing: boolean;
  currentBody: string;
}

class ResultListItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleIsEditing = this.handleIsEditing.bind(this);
    this.handleStopEditing = this.handleStopEditing.bind(this);

    this.state = {
      isEditing: false,
      currentBody: props.body
    };
  }

  handleIsEditing() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  handleStopEditing() {
    if (this.state.isEditing) {
      if (!isEqual(this.state.currentBody, this.props.body)) {
        this.props
          .editCapture({
            variables: {
              id: this.props.id,
              body: this.state.currentBody
            }
          })
          .then(() => {
            this.props.handleRefetch(this.props.id);
          });
      }

      this.setState({
        isEditing: false
      });
    }
  }

  render() {
    return (
      <div
        className={`bg-white bb b--light-gray dark-gray ${this.props.isFocus &&
          `ba bw1 b--${this.props.accentColor}`}`}
      >
        <div
          className={`w-100 pa2 dt`}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          key={this.props.id}
        >
          <div className={`dt-row ma3 w-100`}>
            <div
              className={`dtc w-9 w-100 fl ma2 f6 overflow-hidden lh-copy ${
                this.state.isEditing ? "ba" : ""
              } b--${config.captureAccentColor}`}
              style={{
                maxHeight: this.props.maxHeight,
                maxWidth: "30em"
              }}
            >
              {this.state.isEditing ? (
                <TextInput
                  startingValue={this.props.body}
                  handleChange={(newBody: string) => {
                    this.setState({
                      currentBody: newBody
                    });
                  }}
                  handleEnterKey={() => {
                    this.handleStopEditing();
                  }}
                />
              ) : (
                <p>{this.state.currentBody}</p>
              )}
            </div>
            <div className={`dtc pv3 w-10 v-top tc`}>
              <div
                className={`pt1 h2 w-100 pointer ${this.props.baseColor}`}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  this.handleStopEditing();
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
            className={`dt w-100 tc pa3`}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
          >
            <div
              className={`dtc v-mid pointer`}
              onClick={() => {
                this.handleStopEditing();
                if (this.props.onClick) {
                  this.props.onClick();
                }
              }}
            >
              <Crosshair size={ICON_SIZE} />
            </div>
            <div className={`dtc v-mid pointer`}>
              <MessageSquare size={ICON_SIZE} />
            </div>
            <div
              className={`dtc v-mid pointer`}
              onClick={
                this.state.isEditing
                  ? this.handleStopEditing
                  : this.handleIsEditing
              }
            >
              <Edit size={ICON_SIZE} />
            </div>
            <div
              className={`dtc v-mid pointer`}
              onClick={() => {
                this.handleStopEditing();
                this.props
                  .archiveCapture({
                    variables: {
                      id: this.props.id
                    }
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

export default compose(
  graphql<ArchiveCaptureMutation, Props>(ArchiveCapture, {
    name: "archiveCapture"
  }),
  graphql<EditCaptureMutation, Props>(EditCapture, {
    name: "editCapture"
  })
)(ResultListItem);
