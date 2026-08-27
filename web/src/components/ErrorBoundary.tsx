import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Phone, AlertTriangle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production we suppress deep stack traces from leaking to users
    if (process.env.NODE_ENV === 'development') {
      console.error('Uncaught error in React tree:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h1 className="text-xl font-bold text-slate-900">
              দুঃখিত, একটি সমস্যা হয়েছে।
            </h1>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              অনুগ্রহ করে পেইজটি রিফ্রেশ করে আবার চেষ্টা করুন। কোনো জরুরী সহায়তার জন্য আমাদের হটলাইনে যোগাযোগ করুন।
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>পেইজ রিফ্রেশ করুন (Reload)</span>
              </button>

              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-sky-600" />
                <span>সরাসরি কল: {BUSINESS_CONFIG.phone}</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
