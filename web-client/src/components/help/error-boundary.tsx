// React
import * as React from "react";

// Components
import Help from "./help";

// Utils
import { ErrorsUtils } from "../../utils";

// Types
interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: object | null;
}

// Class
class ErrorBoundary extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error | null, errorInfo: object) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    ErrorsUtils.errorHandler.report(error);
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Help>
          <div className={`flex flex-wrap`}>
            <div className={`pa2`}>Oh no. We messed up.</div>
            <details className={`pa2`} style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo["componentStack"]}
            </details>
          </div>
        </Help>
      );
    }

    return this.props.children;
  }
}

// Export
export default ErrorBoundary;
