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

    ErrorsUtils.errorHandler.report(
      error ? error.message : "Render error",
      errorInfo
    );
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Help>
          <div>
            <div className={`pa2`}>Oh no. We messed up.</div>
            <div className={`pa2`}>
              We have logged the error and will do our best to fix it ASAP.
            </div>
          </div>
        </Help>
      );
    }

    return this.props.children;
  }
}

// Export
export default ErrorBoundary;
