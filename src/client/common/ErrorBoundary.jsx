/* eslint-disable react/destructuring-assignment */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <>
          <h3>Runtime error</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
            <br />
            {this.state.errorInfo.componentStack}
          </div>
        </>
      );
    }
    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

export default ErrorBoundary;
