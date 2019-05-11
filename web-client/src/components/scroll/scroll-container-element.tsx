// React
import * as React from "react";
// import PropTypes from "prop-types";

// Components
import { ScrollContainerContext } from "./scroll-container";

interface Props {
  name: string;
  children: React.ReactElement<Object>;
}

interface State {}

class ScrollContainerElement extends React.Component<Props, State> {
  static contextTypes = {
    // scroll: PropTypes.object
  };

  context: ScrollContainerContext;

  _element: React.ReactInstance;

  componentDidMount() {
    // this.context.scroll.register(this.props.name, this._element);
  }

  componentWillUnmount() {
    // this.context.scroll.unregister(this.props.name);
  }

  render() {
    return React.cloneElement(this.props.children, {
      ref: ref => (this._element = ref)
    });
  }
}

export default ScrollContainerElement;
