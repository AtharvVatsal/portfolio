import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-notebook-bg text-ink-primary flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h1 className="font-display text-2xl mb-3">Something Went Wrong</h1>
            <p className="text-ink-muted text-sm mb-6 font-mono">
              // unexpected error encountered
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 border border-notebook-border text-ink-secondary hover:text-ink-primary hover:border-blueprint transition-all duration-300 text-sm font-mono"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2.5 bg-blueprint text-white hover:bg-blueprint/90 transition-all duration-300 text-sm font-mono"
              >
                <Home size={14} />
                Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
