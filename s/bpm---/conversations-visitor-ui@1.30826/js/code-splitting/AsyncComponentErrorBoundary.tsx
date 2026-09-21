import { Component } from 'react';
class AsyncComponentErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  constructor(props) {
    super(props);
    this.handleRetry = () => {
      this.setState({
        error: false
      });
    };
    this.explicitlySetError = error => {
      this.setState({
        error
      });
    };
    this.state = {
      error: null
    };
  }
  render() {
    if (this.state.error) {
      return this.props.renderError(this.handleRetry);
    }
    return this.props.children;
  }
}
AsyncComponentErrorBoundary.displayName = 'AsyncComponentErrorBoundary';
export default AsyncComponentErrorBoundary;