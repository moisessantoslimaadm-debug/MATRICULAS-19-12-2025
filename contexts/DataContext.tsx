
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, RegistryStudent } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENT_REGISTRY } from '../constants';
import { useToast } from './ToastContext';

interface DataContextType {
  schools: School[];
  students: RegistryStudent[];
  isLoading: boolean;
  isOffline: boolean;
  addStudent: (student: RegistryStudent) => Promise<void>;
  updateStudents: (updatedStudents: RegistryStudent[]) => Promise<void>;
  refreshData: () => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulação de carregamento de DB local/Supabase
      const savedStudents = localStorage.getItem('sme_students');
      setSchools(MOCK_SCHOOLS);
      setStudents(savedStudents ? JSON.parse(savedStudents) : MOCK_STUDENT_REGISTRY);
      setIsOffline(false);
    } catch (error) {
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addStudent = async (student: RegistryStudent) => {
    const existingIdx = students.findIndex(s => s.cpf === student.cpf);
    let newList;
    if (existingIdx > -1) {
      newList = [...students];
      newList[existingIdx] = { ...newList[existingIdx], ...student };
      addToast("Registro nominal atualizado (Deduplicado).", "info");
    } else {
      newList = [student, ...students];
      addToast("Novo aluno inserido na base.", "success");
    }
    setStudents(newList);
    localStorage.setItem('sme_students', JSON.stringify(newList));
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    setStudents(updatedStudents);
    localStorage.setItem('sme_students', JSON.stringify(updatedStudents));
  };

  const removeStudent = async (id: string) => {
    const newList = students.filter(s => s.id !== id);
    setStudents(newList);
    localStorage.setItem('sme_students', JSON.stringify(newList));
    addToast("Registro removido da base.", "info");
  };

  return (
    <DataContext.Provider value={{ 
      schools, students, isLoading, isOffline,
      addStudent, updateStudents, refreshData: loadData, removeStudent
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
