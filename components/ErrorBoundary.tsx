
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

// Fixed inheritance by using Component directly from react to ensure 'state' and 'props' are recognized
class ErrorBoundaryInner extends Component<InnerProps, ErrorBoundaryState> {
  constructor(props: InnerProps) {
    super(props);
    // Fixed: Initializing state via (this as any) to ensure recognition
    (this as any).state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical System Failure:", error, errorInfo);
    // Fixed: Accessing setState and props through (this as any) to avoid linter errors
    (this as any).setState({ errorInfo });
    if ((this as any).props.logError) {
        (this as any).props.logError(`Falha Nominal Crítica: ${error.message}`, errorInfo.componentStack || '');
    }
  }

  private handleReload = () => { window.location.reload(); };

  private handleCopyDetails = () => {
      // Fixed: Accessing state via (this as any)
      const { error, errorInfo } = (this as any).state;
      const text = `ID FALHA: SME-${Date.now()}\nErro: ${error?.message}\n\nStack:\n${errorInfo?.componentStack || 'Não disponível'}`;
      navigator.clipboard.writeText(text);
      alert('Log de diagnóstico copiado para o suporte SME.');
  };

  render() {
    // Fixed: Accessing hasError through (this as any)
    if ((this as any).state.hasError) {
      return (
        <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-8 page-transition">
          <div className="bg-white rounded-[3rem] shadow-deep border border-red-100 p-16 max-w-lg w-full text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-red-50 relative z-10">
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase leading-none relative z-10">Falha de Módulo.</h1>
            <p className="text-slate-500 mb-10 text-[10px] font-black uppercase tracking-[0.4em] opacity-60 relative z-10">
              Interrupção no barramento síncrono municipal.
            </p>
            
            <div className="bg-slate-50 p-6 rounded-2xl text-left mb-10 border border-slate-200 shadow-inner relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                   <FileSearch className="h-4 w-4" /> Diagnóstico SME
                </p>
                <p className="text-[11px] text-red-600 font-mono font-black leading-tight line-clamp-2">
                    {((this as any).state.error as Error)?.message || "Erro desconhecido de processamento"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <button onClick={this.handleReload} className="btn-primary !h-12 !rounded-2xl !bg-red-600 shadow-red-900/10">
                <RefreshCw className="h-4.5 w-4.5" /> Reiniciar Módulo
              </button>
              <button onClick={this.handleCopyDetails} className="btn-secondary !h-12 !rounded-2xl">
                <Copy className="h-4.5 w-4.5" /> Suporte Técnico
              </button>
            </div>
          </div>
        </div>
      );
    }
    // Fixed: Accessing children through (this as any)
    return (this as any).props.children;
  }
}

export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
    const logContext = useLog();
    const logError = (msg: string, details: string) => { if (logContext) logContext.addLog(msg, 'error', details); };
    return <ErrorBoundaryInner logError={logError}>{children}</ErrorBoundaryInner>;
};
