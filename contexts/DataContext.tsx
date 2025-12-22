
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
      // 1. Schools Sync
      const schoolCount = await db.schools.count();
      if (schoolCount === 0) {
        await db.schools.bulkAdd(MOCK_SCHOOLS);
      }
      const allSchools = await db.schools.toArray();
      setSchools(allSchools);

      // 2. Students Sync
      let allStudents = await db.students.toArray();
      
      // Seed nominal se vazio
      if (allStudents.length === 0) {
        await db.students.bulkAdd(MOCK_STUDENT_REGISTRY);
        allStudents = await db.students.toArray();
      }
      
      setStudents(allStudents.sort((a, b) => a.name.localeCompare(b.name)));
      setIsOffline(false);
    } catch (error) {
      console.error("Critical DB Sync Failure:", error);
      setIsOffline(true);
      addToast("Interrupção no barramento nominal local.", "error");
    } finally {
      // Delay artificial para simular integridade de rede
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addStudent = async (student: RegistryStudent) => {
    try {
      await db.students.add(student);
      setStudents(prev => [student, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      addToast("Registro Nominal transmitido com sucesso.", "success");
    } catch (error) {
      addToast("Erro ao persistir dossiê nominal.", "error");
    }
  };

  const updateStudent = async (student: RegistryStudent) => {
    try {
      await db.students.put(student);
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    } catch (error) {
      addToast("Erro na atualização do registro.", "error");
    }
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    try {
      // Usando transaction para integridade nominal
      await db.transaction('rw', db.students, async () => {
        for (const s of updatedStudents) {
          await db.students.put(s);
        }
      });
      const all = await db.students.toArray();
      setStudents(all.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      addToast("Falha crítica no sincronismo de rede.", "error");
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await db.students.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      addToast("Dossiê nominal arquivado.", "info");
    } catch (error) {
      addToast("Erro ao remover registro da base.", "error");
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
