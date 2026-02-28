import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className='text-3xl font-bold'>Something went wrong!</h1>
        <pre className='mt-8 text-lg'>{this.state.error.toString()}</pre>
      </div>;
    }
    return this.props.children;
  }
}
