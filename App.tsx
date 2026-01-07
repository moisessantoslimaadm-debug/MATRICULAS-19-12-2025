import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from './router';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import { LogProvider } from './contexts/LogContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { ChatAssistant } from './components/ChatAssistant';
import { LogViewer } from './components/LogViewer';
import { Loader2 } from 'lucide-react';
import { UserRole } from './types';

// --- LAZY LOADING (Code Splitting) ---
// Otimiza o carregamento inicial baixando as páginas apenas quando necessário
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const SchoolList = React.lazy(() => import('./pages/SchoolList').then(m => ({ default: m.SchoolList })));
const Registration = React.lazy(() => import('./pages/Registration').then(m => ({ default: m.Registration })));
const Status = React.lazy(() => import('./pages/Status').then(m => ({ default: m.Status })));
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const AdminData = React.lazy(() => import('./pages/AdminData').then(m => ({ default: m.AdminData })));
const Reports = React.lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const PerformanceIndicators = React.lazy(() => import('./pages/PerformanceIndicators').then(m => ({ default: m.PerformanceIndicators })));
const StudentMonitoring = React.lazy(() => import('./pages/StudentMonitoring').then(m => ({ default: m.StudentMonitoring })));
const ExternalApp = React.lazy(() => import('./pages/ExternalApp').then(m => ({ default: m.ExternalApp })));
const TeacherJournal = React.lazy(() => import('./pages/TeacherJournal').then(m => ({ default: m.TeacherJournal })));
const TeacherHistory = React.lazy(() => import('./pages/TeacherHistory').then(m => ({ default: m.TeacherHistory })));
const MapAnalysis = React.lazy(() => import('./pages/MapAnalysis').then(m => ({ default: m.MapAnalysis })));
const AdminSchoolsManagement = React.lazy(() => import('./pages/AdminSchoolsManagement').then(m => ({ default: m.AdminSchoolsManagement })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const LoadingFallback = () => (
  <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-50 gap-4">
    <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Carregando Módulo...</span>
  </div>
);

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- AUTO REDIRECT (Sessão Persistente) ---
  useEffect(() => {
    const role = sessionStorage.getItem('user_role') as UserRole;
    const userDataStr = sessionStorage.getItem('user_data');
    
    // Se existe sessão e o usuário está na Home ou Login, redireciona para o painel correto
    if (role && (location.pathname === '/' || location.pathname === '/login')) {
      if (role === UserRole.TEACHER) {
        navigate('/journal');
      } else if (role === UserRole.STUDENT && userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            navigate(`/student/monitoring?id=${userData.id}`);
        } catch (e) {
            navigate('/status');
        }
      } else {
        // Admin, Diretor ou padrão
        navigate('/dashboard');
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 relative">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schools" element={<SchoolList />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/status" element={<Status />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/data" element={<AdminData />} />
            <Route path="/admin/map" element={<MapAnalysis />} />
            <Route path="/admin/escolas" element={<AdminSchoolsManagement />} />
            <Route path="/admin/profissionais" element={<AdminSchoolsManagement />} />
            <Route path="/admin/projetos" element={<AdminSchoolsManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/performance" element={<PerformanceIndicators />} />
            <Route path="/student/monitoring" element={<StudentMonitoring />} />
            <Route path="/external" element={<ExternalApp />} />
            <Route path="/journal" element={<TeacherJournal />} />
            <Route path="/journal/history" element={<TeacherHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <ChatAssistant />
      <LogViewer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LogProvider>
      <ToastProvider>
        <DataProvider>
          <HashRouter>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </HashRouter>
        </DataProvider>
      </ToastProvider>
    </LogProvider>
  );
};

export default App;