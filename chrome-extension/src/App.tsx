import React, { Component } from "react";
import "./app.css";
import * as fetch from "isomorphic-fetch";
import config from "./config/index";
import { assign } from "lodash";

export interface IProps {
  article: {
    url: string;
    title?: string;
    content?: string;
    byline?: string;
    length?: number;
  };
  idToken: string;
}

interface IState {
  comment: string;
  pageSaveSuccess: boolean | null;
}

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      comment: "",
      pageSaveSuccess: null
    };
  }

  render() {
    const { comment, pageSaveSuccess } = this.state;
    const { article, idToken } = this.props;
    let { url, title = "", content = "", byline = "", length = 0 } = article;
    title = title === null ? "" : title;
    content = content === null ? "" : content;
    byline = byline === null ? "" : byline;
    length = length === null ? 0 : length;

    return (
      <div className={`fixed top-1 right-1 z-max pa3 bg-white shadow-1 br2 w5`}>
        {pageSaveSuccess !== null ? (
          pageSaveSuccess ? (
            <div className={`tc`}>
              Page saved to <span className={`bb b--accent`}>Tangle!</span>
            </div>
          ) : (
            <div className={`f6 light-red`}>
              <p>There was an error saving.</p>
              <p>Refresh to try again.</p>
            </div>
          )
        ) : (
          <React.Fragment>
            <div className={`pb3 tc`}>
              Add page to <span className={`bb b--accent`}>Tangle!</span>
            </div>
            <div className={`flex-column h4`}>
              <textarea
                className={`flex-grow pa2 w-100 dark-gray br2 f7`}
                style={{
                  resize: "none"
                }}
                placeholder={"Write an optional comment..."}
                value={comment}
                onChange={e => {
                  this.setState({
                    comment: e.target.value
                  });
                }}
              />
              <div className={`tc pt3`}>
                <span
                  className={`bg-accent white pa2 br4 f7 f3 dim pointer`}
                  onClick={() => {
                    fetch(config.endpoint + "/capturedLinks", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`
                      },
                      body: JSON.stringify({
                        url,
                        title,
                        content,
                        byline,
                        length,
                        comment
                      })
                    })
                      .then(res => {
                        if (res.status < 300) {
                          this.setState({
                            pageSaveSuccess: true
                          });
                        } else {
                          throw new Error("Request failed");
                        }
                      })
                      .catch(() => {
                        this.setState({
                          pageSaveSuccess: false
                        });
                      });
                  }}
                >
                  Add Page
                </span>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
