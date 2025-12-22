
import React from 'react';
import { HashRouter, Routes, Route } from './router';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import { LogProvider } from './contexts/LogContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { ChatAssistant } from './components/ChatAssistant';
import { LogViewer } from './components/LogViewer';

// Pages
import { Home } from './pages/Home';
import { SchoolList } from './pages/SchoolList';
import { Registration } from './pages/Registration';
import { Status } from './pages/Status';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdminData } from './pages/AdminData';
import { Reports } from './pages/Reports';
import { PerformanceIndicators } from './pages/PerformanceIndicators';
import { StudentMonitoring } from './pages/StudentMonitoring';
import { ExternalApp } from './pages/ExternalApp';
import { TeacherJournal } from './pages/TeacherJournal';
import { MapAnalysis } from './pages/MapAnalysis';
import { AdminSchoolsManagement } from './pages/AdminSchoolsManagement';
import { NotFound } from './pages/NotFound';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
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
          <Route path="/reports" element={<Reports />} />
          <Route path="/performance" element={<PerformanceIndicators />} />
          <Route path="/student/monitoring" element={<StudentMonitoring />} />
          <Route path="/external" element={<ExternalApp />} />
          <Route path="/journal" element={<TeacherJournal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
