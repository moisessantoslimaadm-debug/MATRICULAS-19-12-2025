import React, { Component, ErrorInfo, ReactNode } from 'react';
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

// Fix: Extending from Component (named import) instead of React.Component to ensure correct type resolution of base class properties like setState, props, and state
class ErrorBoundaryInner extends Component<InnerProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Fix: Using setState from the base Component class
    this.setState({ errorInfo });
    
    // Fix: Accessing logError from the inherited props
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
      const { error, errorInfo } = this.state;
      const text = `Erro: ${error?.message}\n\nStack Trace:\n${errorInfo?.componentStack || 'Não disponível'}`;
      navigator.clipboard.writeText(text);
      alert('Log de diagnóstico copiado.');
  };

  render() {
    // Fix: Accessing state from the base Component class
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] shadow-deep border border-red-100 p-12 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Falha de Módulo.</h1>
            <p className="text-slate-500 mb-8 text-sm font-medium">
              Ocorreu uma falha inesperada no processamento nominal de rede.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-xl text-left mb-8 overflow-hidden border border-slate-200">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                   <FileSearch className="h-3 w-3" /> Diagnóstico SME Itaberaba
                </p>
                <p className="text-[10px] text-slate-600 font-mono break-words line-clamp-2">
                    {this.state.error?.message || "Erro desconhecido"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={this.handleReload} className="btn-primary !h-10">
                <RefreshCw className="h-3.5 w-3.5" /> Reiniciar
              </button>
              <button onClick={this.handleCopyDetails} className="btn-secondary !h-10">
                <Copy className="h-3.5 w-3.5" /> Copiar Log
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
    const logContext = useLog();
    
    const logError = (msg: string, details: string) => {
        if (logContext) {
            logContext.addLog(msg, 'error', details);
        }
    };

    return <ErrorBoundaryInner logError={logError}>{children}</ErrorBoundaryInner>;
};