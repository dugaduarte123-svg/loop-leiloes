import { Component } from 'react';
import NavMarker from '../NavMarker';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
class RhumbGlobalErrorBoundary extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  componentDidCatch(error, info) {
    var _info$componentStack;
    this.props.onError(error, {
      componentStack: (_info$componentStack = info.componentStack) !== null && _info$componentStack !== void 0 ? _info$componentStack : undefined
    });
  }
  render() {
    return this.state.error ? /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(NavMarker, {
        name: "RHUMB_GLOBAL_ERROR_BOUNDARY"
      }), this.props.ErrorComponent ? /*#__PURE__*/_jsx(this.props.ErrorComponent, {
        error: this.state.error
      }) : null]
    }) : this.props.children;
  }
}
export default RhumbGlobalErrorBoundary;