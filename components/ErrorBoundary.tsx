import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Copy, ShieldAlert, FileSearch } from 'lucide-react';
import { useLog } from '../contexts/LogContext';

interface InnerProps {
  children?: ReactNode;
  logError?: (message: string, details: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Fixed: Using React.Component explicitly ensures that props and state are properly recognized by the TypeScript compiler
class ErrorBoundaryInner extends React.Component<InnerProps, ErrorBoundaryState> {
  constructor(props: InnerProps) {
    super(props);
    // Initialize state properly within the constructor
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  // Handle errors from child components and update state
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    
    if (this.props.logError) {
        this.props.logError(
            `Erro Crítico SME: ${error.message}`, 
            errorInfo.componentStack || ''
        );
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyDetails = () => {
      // Accessing state safely after inheritance fix
      const { error, errorInfo } = this.state;
      const text = `Erro: ${error?.message}\n\nStack Trace:\n${errorInfo?.componentStack || 'Não disponível'}`;
      navigator.clipboard.writeText(text);
      alert('Log de diagnóstico copiado.');
  };

  render() {
    // Checking state for error boundary display
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-red-100 p-16 max-w-xl w-full text-center">
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl">
              <ShieldAlert className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Falha de Módulo.</h1>
            <p className="text-slate-500 mb-10 text-lg font-medium">
              Ocorreu uma falha inesperada no processamento nominal.
            </p>
            
            <div className="bg-slate-50 p-6 rounded-2xl text-left mb-10 overflow-hidden border border-slate-200">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <FileSearch className="h-3.5 w-3.5" /> Diagnóstico SME
                </p>
                <p className="text-xs text-slate-600 font-mono break-words line-clamp-2">
                    {this.state.error?.message || "Erro desconhecido"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={this.handleReload} className="btn-primary !bg-slate-900">
                <RefreshCw className="h-4 w-4" /> Reiniciar
              </button>
              <button onClick={this.handleCopyDetails} className="btn-secondary">
                <Copy className="h-4 w-4" /> Copiar Log
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Returning children if no error occurred
    return this.props.children;
  }
}

// Functional wrapper to inject context hooks into the ErrorBoundaryInner class component
export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
    const logContext = useLog();
    
    const logError = (msg: string, details: string) => {
        if (logContext) {
            logContext.addLog(msg, 'error', details);
        }
    };

    return <ErrorBoundaryInner logError={logError}>{children}</ErrorBoundaryInner>;
};