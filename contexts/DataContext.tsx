import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, RegistryStudent } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENT_REGISTRY } from '../constants';
import { useToast } from './ToastContext';
import { db } from '../services/db';

interface DataContextType {
  schools: School[];
  students: RegistryStudent[];
  isLoading: boolean;
  isOffline: boolean;
  addStudent: (student: RegistryStudent) => Promise<void>;
  updateStudent: (student: RegistryStudent) => Promise<void>;
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
      // Sincroniza escolas (estáticas para este exemplo, mas poderiam vir de API)
      await db.schools.bulkPut(MOCK_SCHOOLS);
      const allSchools = await db.schools.toArray();
      setSchools(allSchools);

      // Carrega estudantes do IndexedDB
      let allStudents = await db.students.toArray();
      
      // Se for a primeira vez, popula com os mocks
      if (allStudents.length === 0) {
        await db.students.bulkAdd(MOCK_STUDENT_REGISTRY);
        allStudents = await db.students.toArray();
      }
      
      setStudents(allStudents.sort((a, b) => b.name.localeCompare(a.name)));
      setIsOffline(false);
    } catch (error) {
      console.error("Erro ao carregar DB:", error);
      setIsOffline(true);
      addToast("Erro ao conectar com o banco de dados local.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addStudent = async (student: RegistryStudent) => {
    try {
      await db.students.add(student);
      setStudents(prev => [student, ...prev]);
      addToast("Matrícula registrada com sucesso.", "success");
    } catch (error) {
      addToast("Erro ao salvar matrícula.", "error");
    }
  };

  const updateStudent = async (student: RegistryStudent) => {
    try {
      await db.students.put(student);
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    } catch (error) {
      addToast("Erro ao atualizar registro.", "error");
    }
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    try {
      await db.students.clear();
      await db.students.bulkAdd(updatedStudents);
      setStudents(updatedStudents);
    } catch (error) {
      addToast("Erro ao sincronizar base.", "error");
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await db.students.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      addToast("Registro removido.", "info");
    } catch (error) {
      addToast("Erro ao remover registro.", "error");
    }
  };

  return (
    <DataContext.Provider value={{ 
      schools, students, isLoading, isOffline,
      addStudent, updateStudent, updateStudents, refreshData: loadData, removeStudent
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