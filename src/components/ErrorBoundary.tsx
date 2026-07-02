import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6" dir="rtl">
          <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-8 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">&#9888;</span>
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-3">حدث خطأ غير متوقع</h2>
            <p className="text-slate-400 mb-4 text-sm leading-relaxed">
              عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
            </p>
            <details className="text-right bg-slate-900/50 rounded-lg p-3 mb-4">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300">تفاصيل الخطأ</summary>
              <pre className="mt-2 text-xs text-red-300 overflow-auto max-h-32 whitespace-pre-wrap" dir="ltr">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </details>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/login';
              }}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg transition-colors font-medium"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
