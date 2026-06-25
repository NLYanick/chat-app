import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return ( 
        <div className="text-red-600 min-h-screen flex flex-col items-center justify-center text-center gap-8">
          <h1 className='text-3xl font-bold'>Something went wrong!</h1>
          <pre className='text-lg'>{this.state.error.toString()}</pre>
          <a href="/" className='underline text-white py-2 hover:text-blue-600'>Go back to Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}
