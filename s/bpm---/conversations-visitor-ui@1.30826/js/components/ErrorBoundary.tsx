import { Component } from 'react';
import { NavMarker } from 'react-rhumb';
import { buildError } from 'conversations-error-reporting/error-reporting/builders/buildError';
import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { jsx as _jsx } from "react/jsx-runtime";
export default class ErrorBoundary extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      hasError: false
    };
    this.reset = () => {
      this.setState({
        hasError: false
      });
    };
  }
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
  componentDidCatch(error, info) {
    const message = ['Component caught', this.props.errorLoggingTitle, error.message].join(': ');
    const componentError = buildError(message, {
      name: 'ComponentError',
      componentStack: info.componentStack
    });
    reportError({
      error: componentError,
      fingerprint: ['{{ default }}', 'ComponentError'],
      tags: {
        componentDidCatch: true
      }
    });
  }
  render() {
    const {
      children,
      renderError
    } = this.props;
    const {
      hasError
    } = this.state;
    if (hasError && !renderError) return /*#__PURE__*/_jsx(NavMarker, {
      name: "GENERIC_ERROR"
    });
    if (hasError && renderError) {
      return renderError({
        reset: this.reset
      });
    }
    return children;
  }
}
ErrorBoundary.displayName = 'ErrorBoundary';