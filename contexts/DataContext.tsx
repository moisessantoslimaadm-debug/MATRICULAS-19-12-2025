import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, RegistryStudent, Professional, Project } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENT_REGISTRY, MOCK_PROFESSIONALS, MOCK_PROJECTS } from '../constants';
import { useToast } from './ToastContext';
import { db } from '../services/db';
import { supabase } from '../services/supabaseClient';

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
  addSchool: (school: School) => Promise<void>;
  updateSchool: (school: School) => Promise<void>; 
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

  // Carrega dados do Supabase ou cai no cache do Dexie
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Sincronização Síncrona Nominal: Tenta buscar do Supabase primeiro
      const [
        { data: supabaseSchools }, 
        { data: supabaseStudents },
        { data: supabaseProfs },
        { data: supabaseProjects }
      ] = await Promise.all([
        supabase.from('schools').select('*'),
        supabase.from('students').select('*'),
        supabase.from('professionals').select('*'),
        supabase.from('projects').select('*')
      ]);

      // Atualiza Cache Local se houver dados na nuvem
      if (supabaseSchools && supabaseSchools.length > 0) {
        await db.schools.clear();
        await db.schools.bulkAdd(supabaseSchools);
      } else if (await db.schools.count() === 0) {
        await db.schools.bulkAdd(MOCK_SCHOOLS);
      }

      if (supabaseStudents && supabaseStudents.length > 0) {
        await db.students.clear();
        await db.students.bulkAdd(supabaseStudents);
      } else if (await db.students.count() === 0) {
        await db.students.bulkAdd(MOCK_STUDENT_REGISTRY);
      }

      if (supabaseProfs && supabaseProfs.length > 0) {
        await db.professionals.clear();
        await db.professionals.bulkAdd(supabaseProfs);
      } else if (await db.professionals.count() === 0) {
        await db.professionals.bulkAdd(MOCK_PROFESSIONALS);
      }

      if (supabaseProjects && supabaseProjects.length > 0) {
        await db.projects.clear();
        await db.projects.bulkAdd(supabaseProjects);
      } else if (await db.projects.count() === 0) {
        await db.projects.bulkAdd(MOCK_PROJECTS);
      }

      // Seta estados finais
      setSchools(await db.schools.toArray());
      setStudents(await db.students.toArray());
      setProfessionals(await db.professionals.toArray());
      setProjects(await db.projects.toArray());
      setIsOffline(false);

    } catch (error) {
      console.warn("Offline Mode Active:", error);
      setIsOffline(true);
      // Carrega o que tem no Dexie
      setSchools(await db.schools.toArray());
      setStudents(await db.students.toArray());
      setProfessionals(await db.professionals.toArray());
      setProjects(await db.projects.toArray());
    } finally {
      // Performance Boost: Remoção de delay artificial
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getNearestSchool = (lat: number, lng: number) => {
    // FIX: Filtra escolas válidas (com coordenadas numéricas) antes de calcular
    const validSchools = schools.filter(s => s && typeof s.lat === 'number' && typeof s.lng === 'number');
    
    if (validSchools.length === 0) return null;
    
    let nearest = validSchools[0];
    let minDistance = calculateDistance(lat, lng, nearest.lat, nearest.lng);
    
    validSchools.forEach(school => {
      const dist = calculateDistance(lat, lng, school.lat, school.lng);
      if (dist < minDistance) { minDistance = dist; nearest = school; }
    });
    return { school: nearest, distance: minDistance };
  };

  const addSchool = async (school: School) => {
    try {
      await db.schools.add(school);
      setSchools(prev => [...prev, school]);
      await supabase.from('schools').insert(school);
      addToast("Unidade escolar registrada com sucesso.", "success");
    } catch (error) {
      addToast("Erro ao registrar escola.", "error");
    }
  };

  const updateSchool = async (school: School) => {
    try {
      await db.schools.put(school);
      setSchools(prev => prev.map(s => s.id === school.id ? school : s));
      await supabase.from('schools').upsert(school);
      addToast("Dados da unidade atualizados.", "success");
    } catch (error) {
      addToast("Erro ao atualizar escola.", "error");
    }
  };

  const addStudent = async (student: RegistryStudent) => {
    try {
      // 1. Persiste no Local (Dexie)
      await db.students.add(student);
      setStudents(prev => [student, ...prev]);

      // 2. Persiste na Nuvem (Supabase)
      const { error } = await supabase.from('students').insert(student);
      if (error) console.error("Cloud Sync Delayed:", error);

      addToast("Matrícula transmitida ao barramento nominal.", "success");
    } catch (error) { addToast("Falha ao persistir pasta.", "error"); }
  };

  const updateStudent = async (student: RegistryStudent) => {
    try {
      await db.students.put(student);
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
      
      await supabase.from('students').upsert(student);
      addToast("Registro sincronizado.", "success");
    } catch (error) { addToast("Erro na atualização.", "error"); }
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    try {
      await (db as any).transaction('rw', [db.students], async () => {
        for (const s of updatedStudents) { 
          await db.students.put(s); 
        }
      });
      setStudents(await db.students.toArray());
      
      // Batch update no Supabase
      await supabase.from('students').upsert(updatedStudents);
    } catch (error) { 
      console.error("Batch update failed:", error);
      addToast("Falha no lote nominal.", "error"); 
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await db.students.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      await supabase.from('students').delete().eq('id', id);
      addToast("Registro removido.", "info");
    } catch (error) { addToast("Erro ao remover.", "error"); }
  };

  const addProfessional = async (prof: Professional) => {
    try {
      await db.professionals.add(prof);
      setProfessionals(prev => [prof, ...prev]);
      await supabase.from('professionals').insert(prof);
      addToast("Profissional cadastrado no barramento.", "success");
    } catch (error) { addToast("Erro no cadastro.", "error"); }
  };

  const updateProfessional = async (prof: Professional) => {
    try {
      await db.professionals.put(prof);
      setProfessionals(prev => prev.map(p => p.id === prof.id ? prof : p));
      await supabase.from('professionals').upsert(prof);
      addToast("Profissional atualizado em nuvem.", "success");
    } catch (error) { addToast("Falha ao atualizar.", "error"); }
  };

  const removeProfessional = async (id: string) => {
    try {
      await db.professionals.delete(id);
      setProfessionals(prev => prev.filter(p => p.id !== id));
      await supabase.from('professionals').delete().eq('id', id);
      addToast("Servidor desligado do sistema.", "info");
    } catch (error) { addToast("Falha ao remover.", "error"); }
  };

  const addProject = async (proj: Project) => {
    try {
      await db.projects.add(proj);
      setProjects(prev => [proj, ...prev]);
      await supabase.from('projects').insert(proj);
      addToast("Projeto municipal criado.", "success");
    } catch (error) { addToast("Erro ao criar projeto.", "error"); }
  };

  const updateProject = async (proj: Project) => {
    try {
      await db.projects.put(proj);
      setProjects(prev => prev.map(p => p.id === proj.id ? proj : p));
      await supabase.from('projects').upsert(proj);
      addToast("Projeto atualizado.", "success");
    } catch (error) { addToast("Falha no projeto.", "error"); }
  };

  const removeProject = async (id: string) => {
    try {
      await db.projects.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      await supabase.from('projects').delete().eq('id', id);
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
          await supabase.from('students').upsert(updated);
          
          const proj = await db.projects.get(projectId);
          if (proj) {
            const updatedProj = { ...proj, participantsCount: proj.participantsCount + 1 };
            await db.projects.put(updatedProj);
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProj : p));
            await supabase.from('projects').upsert(updatedProj);
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
      linkStudentToProject, getNearestSchool, addSchool, updateSchool, refreshData: loadData
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