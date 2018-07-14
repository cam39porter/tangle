// React
import * as React from "react";

// GraphQL
import {
  editSessionMutation as editSessionResponse,
  editSessionMutationVariables
} from "../../__generated__/types";
import { editSession } from "../../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components

// Utils
import "draft-js/dist/Draft.css";
import { debounce, Cancelable } from "lodash";
import { ApolloUtils, AnalyticsUtils, ErrorsUtils } from "../../utils/index";

const TIME_TO_SAVE = 500; // ms

interface Props {
  editSession: MutationFunc<editSessionResponse, editSessionMutationVariables>;
  sessionId: string;
  startingTitle?: string;
}

interface State {
  text: string;
}

class HeaderSession extends React.Component<Props, State> {
  saveEdit: ((text: string) => void) & Cancelable | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      text: props.startingTitle || ""
    };

    this.saveEdit = debounce((text: string) => {
      props
        .editSession({
          variables: {
            sessionId: props.sessionId,
            title: text
          },
          update: ApolloUtils.editSessionUpdate(props.sessionId, text)
        })
        .catch(err => {
          ErrorsUtils.errorHandler.report(err.message, err.stack);
        });
    }, TIME_TO_SAVE);
  }

  handleOnChange = e => {
    const newText = e.target.value;

    // Content has changed
    if (newText !== this.state.text) {
      this.saveEdit && this.saveEdit(newText);
    }

    this.setState({
      text: e.target.value
    });
  };

  render() {
    return (
      <div className={``}>
        <input
          value={this.state.text}
          className={`flex-grow pa3 f3 fw3 accent w-100`}
          onChange={this.handleOnChange}
          onBlur={() => {
            const endingTitle = this.state.text;
            if (this.props.startingTitle !== endingTitle) {
              AnalyticsUtils.trackEvent({
                category: AnalyticsUtils.Categories.Session,
                action: AnalyticsUtils.Actions.EditSessionTitle,
                label: this.props.sessionId
              });
            }
          }}
          placeholder={`Title`}
        />
      </div>
    );
  }
}

const withEditSession = graphql<editSessionResponse, Props>(editSession, {
  name: "editSession",
  alias: "withEditSession"
});

const ListSessionTitleWithData = compose(withEditSession)(HeaderSession);

export default ListSessionTitleWithData;
