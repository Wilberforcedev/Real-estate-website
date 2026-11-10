import React from 'react';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
          <div className="max-w-md w-full rounded-3xl border border-[#E8E6E1] bg-white p-8 text-center shadow-sm">
            <h1 className="font-serif text-xl font-bold text-[#3E3C38]">Something went wrong</h1>
            <p className="mt-2 text-xs leading-relaxed text-[#8C8A85]">
              The page hit an unexpected error. Reloading usually fixes it — your saved properties stay on this device.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#5C6B4E] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#4A573F]"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
