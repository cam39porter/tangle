// React
import * as React from "react";
import { findDOMNode } from "react-dom";
// import PropTypes from "prop-types";

// Config / Utils
import scrollIntoView from "scroll-into-view";

interface Props {}

interface State {}

export interface ScrollContainerContext {
  scroll: {
    register: (name: string, ref: React.ReactInstance) => void;
    unregister: (name: string) => void;
  };
}

class ScrollContainer extends React.Component<Props, State> {
  static childContextTypes = {
    // scroll: PropTypes.object
  };

  elements = {};

  register = (name: string, ref: React.ReactInstance) => {
    this.elements[name] = ref;
  };

  unregister = (name: string) => {
    delete this.elements[name];
  };

  getChildContext(): ScrollContainerContext {
    return {
      scroll: {
        register: this.register,
        unregister: this.unregister
      }
    };
  }

  scrollTo = (name: string) => {
    const node = findDOMNode(this.elements[name]);
    scrollIntoView(node, {
      time: 500,
      align: {
        top: 0
      }
    });
  };

  render() {
    return React.Children.only(this.props.children);
  }
}

export default ScrollContainer;
