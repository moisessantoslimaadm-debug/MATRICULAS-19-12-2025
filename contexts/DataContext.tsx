
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, RegistryStudent, Professional, Project } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENT_REGISTRY, MOCK_PROFESSIONALS, MOCK_PROJECTS } from '../constants';
import { useToast } from './ToastContext';
import { db } from '../services/db';

interface DataContextType {
  schools: School[];
  students: RegistryStudent[];
  professionals: Professional[];
  projects: Project[];
  isLoading: boolean;
  isOffline: boolean;
  addStudent: (student: RegistryStudent) => Promise<void>;
  updateStudent: (student: RegistryStudent) => Promise<void>;
  updateStudents: (updatedStudents: RegistryStudent[]) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  addProfessional: (prof: Professional) => Promise<void>;
  updateProfessional: (prof: Professional) => Promise<void>;
  removeProfessional: (id: string) => Promise<void>;
  addProject: (proj: Project) => Promise<void>;
  updateProject: (proj: Project) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  linkStudentToProject: (studentId: string, projectId: string) => Promise<void>;
  getNearestSchool: (lat: number, lng: number) => { school: School; distance: number } | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (await db.schools.count() === 0) await db.schools.bulkAdd(MOCK_SCHOOLS);
      setSchools(await db.schools.toArray());

      if (await db.students.count() === 0) await db.students.bulkAdd(MOCK_STUDENT_REGISTRY);
      setStudents(await db.students.toArray());

      if (await db.professionals.count() === 0) await db.professionals.bulkAdd(MOCK_PROFESSIONALS);
      setProfessionals(await db.professionals.toArray());

      if (await db.projects.count() === 0) await db.projects.bulkAdd(MOCK_PROJECTS);
      setProjects(await db.projects.toArray());

      setIsOffline(false);
    } catch (error) {
      console.error("Critical DB Failure:", error);
      setIsOffline(true);
      addToast("Erro no sincronismo nominal local.", "error");
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getNearestSchool = (lat: number, lng: number) => {
    if (schools.length === 0) return null;
    let nearest = schools[0];
    let minDistance = calculateDistance(lat, lng, nearest.lat, nearest.lng);
    schools.forEach(school => {
      const dist = calculateDistance(lat, lng, school.lat, school.lng);
      if (dist < minDistance) { minDistance = dist; nearest = school; }
    });
    return { school: nearest, distance: minDistance };
  };

  const addStudent = async (student: RegistryStudent) => {
    try {
      await db.students.add(student);
      setStudents(prev => [student, ...prev]);
      addToast("Matrícula transmitida com sucesso.", "success");
    } catch (error) { addToast("Falha ao persistir dossiê.", "error"); }
  };

  const updateStudent = async (student: RegistryStudent) => {
    try {
      await db.students.put(student);
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
      addToast("Registro atualizado.", "success");
    } catch (error) { addToast("Erro na atualização.", "error"); }
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    try {
      // Fixed: Casting db to any to access transaction method which is inherited from Dexie
      await (db as any).transaction('rw', [db.students], async () => {
        for (const s of updatedStudents) { 
          await db.students.put(s); 
        }
      });
      setStudents(await db.students.toArray());
    } catch (error) { 
      console.error("Batch update failed:", error);
      addToast("Falha no lote nominal.", "error"); 
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await db.students.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      addToast("Registro removido.", "info");
    } catch (error) { addToast("Erro ao remover.", "error"); }
  };

  const addProfessional = async (prof: Professional) => {
    try {
      await db.professionals.add(prof);
      setProfessionals(prev => [prof, ...prev]);
      addToast("Profissional cadastrado.", "success");
    } catch (error) { addToast("Erro no cadastro.", "error"); }
  };

  const updateProfessional = async (prof: Professional) => {
    try {
      await db.professionals.put(prof);
      setProfessionals(prev => prev.map(p => p.id === prof.id ? prof : p));
      addToast("Profissional atualizado.", "success");
    } catch (error) { addToast("Falha ao atualizar.", "error"); }
  };

  const removeProfessional = async (id: string) => {
    try {
      await db.professionals.delete(id);
      setProfessionals(prev => prev.filter(p => p.id !== id));
      addToast("Profissional desligado do sistema.", "info");
    } catch (error) { addToast("Falha ao remover.", "error"); }
  };

  const addProject = async (proj: Project) => {
    try {
      await db.projects.add(proj);
      setProjects(prev => [proj, ...prev]);
      addToast("Projeto municipal criado.", "success");
    } catch (error) { addToast("Erro ao criar projeto.", "error"); }
  };

  const updateProject = async (proj: Project) => {
    try {
      await db.projects.put(proj);
      setProjects(prev => prev.map(p => p.id === proj.id ? proj : p));
      addToast("Projeto atualizado.", "success");
    } catch (error) { addToast("Falha no projeto.", "error"); }
  };

  const removeProject = async (id: string) => {
    try {
      await db.projects.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      addToast("Projeto arquivado.", "info");
    } catch (error) { addToast("Erro ao arquivar.", "error"); }
  };

  const linkStudentToProject = async (studentId: string, projectId: string) => {
    try {
      const student = await db.students.get(studentId);
      if (student) {
        const list = student.projects || [];
        if (!list.includes(projectId)) {
          const updated = { ...student, projects: [...list, projectId] };
          await db.students.put(updated);
          setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
          
          const proj = await db.projects.get(projectId);
          if (proj) {
            const updatedProj = { ...proj, participantsCount: proj.participantsCount + 1 };
            await db.projects.put(updatedProj);
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProj : p));
          }
          addToast("Vínculo de projeto concluído.", "success");
        } else { addToast("Aluno já participa deste projeto.", "info"); }
      }
    } catch (error) { addToast("Erro no vínculo.", "error"); }
  };

  return (
    <DataContext.Provider value={{ 
      schools, students, professionals, projects, isLoading, isOffline,
      addStudent, updateStudent, updateStudents, removeStudent,
      addProfessional, updateProfessional, removeProfessional,
      addProject, updateProject, removeProject,
      linkStudentToProject, getNearestSchool, refreshData: loadData
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
