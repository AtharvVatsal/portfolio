import React, { Component } from 'react';

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
      // Rendered outside the shell (the shell itself may be what failed), so
      // this view supplies its own main landmark. "Home" is a full page load:
      // a client-side route change would keep this boundary in its error state.
      return (
        <main id="main-content" tabIndex={-1} className="min-h-screen bg-notebook-bg text-ink-primary outline-none">
          <div className="archive-container pt-24 pb-24">
            <p className="meta-label !text-error">Error · unexpected</p>
            <h1 className="mt-5 font-editorial text-headline sm:text-display text-ink-primary">Something went wrong</h1>
            <p className="mt-4 max-w-xl text-body-sm text-ink-secondary">
              This page failed to render. Trying again often works; if it does not, start again from the archive.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex min-h-11 items-center gap-2 border border-accent px-5 text-small text-ink-primary transition-colors duration-200 hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Try again
              </button>
              <a
                href="/"
                className="inline-flex min-h-11 items-center gap-2 text-small text-ink-secondary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:text-ink-primary hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Return to the archive
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
