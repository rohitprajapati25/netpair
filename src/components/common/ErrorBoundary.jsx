import React from 'react';
import { RiAlertLine, RiRefreshLine, RiArrowLeftLine } from 'react-icons/ri';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console in dev
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isDev = import.meta.env.DEV;
    const msg   = this.state.error?.message || 'An unexpected error occurred';

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-8 text-center">

          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <RiAlertLine size={32} className="text-red-500" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-500 text-sm mb-6">
            An unexpected error occurred. You can try refreshing the page or go back.
          </p>

          {/* Error message in dev */}
          {isDev && msg && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-black text-red-600 uppercase tracking-wider mb-1">Error</p>
              <p className="text-xs font-mono text-red-700 break-all">{msg}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { this.handleReset(); window.history.back(); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
            >
              <RiArrowLeftLine size={16} /> Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md"
            >
              <RiRefreshLine size={16} /> Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
