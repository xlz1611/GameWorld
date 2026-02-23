'use client'

import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="glow-card p-8 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                应用错误
              </h1>
              
              <p className="text-muted mb-6">
                应用遇到了意外错误。请刷新页面重试。
              </p>

              <button
                onClick={() => window.location.reload()}
                className="w-full download-btn flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>刷新页面</span>
              </button>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-muted cursor-pointer hover:text-brand transition-colors">
                    查看错误详情
                  </summary>
                  <pre className="mt-2 p-4 bg-[#0F172A] rounded-lg text-xs text-red-400 overflow-auto max-h-48">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
