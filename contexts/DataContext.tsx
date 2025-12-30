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
  // Validação robusta de coordenadas antes do cálculo matemático
  const isValid = (n: number, limit: number) => 
    typeof n === 'number' && !isNaN(n) && isFinite(n) && Math.abs(n) <= limit;

  if (!isValid(lat1, 90) || !isValid(lat2, 90)) {
    console.warn(`[GeoCalc] Latitudes inválidas: ${lat1}, ${lat2}`);
    return Infinity;
  }
  if (!isValid(lng1, 180) || !isValid(lng2, 180)) {
    console.warn(`[GeoCalc] Longitudes inválidas: ${lng1}, ${lng2}`);
    return Infinity;
  }

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

  // Carrega dados: Estratégia "Cache-First" para Zero Latency
  const loadData = async () => {
    try {
      // 1. Carregamento Imediato do Cache Local (Dexie)
      const localSchools = await db.schools.toArray();
      const localStudents = await db.students.toArray();
      const localProfs = await db.professionals.toArray();
      const localProjects = await db.projects.toArray();

      // Se houver dados locais, exibe imediatamente e remove loading
      if (localSchools.length > 0 || localStudents.length > 0) {
        setSchools(localSchools.length > 0 ? localSchools : MOCK_SCHOOLS);
        setStudents(localStudents.length > 0 ? localStudents : MOCK_STUDENT_REGISTRY);
        setProfessionals(localProfs.length > 0 ? localProfs : MOCK_PROFESSIONALS);
        setProjects(localProjects.length > 0 ? localProjects : MOCK_PROJECTS);
        setIsLoading(false); // UI Interativa instantaneamente
      }

      // 2. Sincronização em Background (Cloud Sync)
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

      // Atualiza Cache Local e Estado se houver dados novos da nuvem
      if (supabaseSchools && supabaseSchools.length > 0) {
        await db.schools.clear();
        await db.schools.bulkAdd(supabaseSchools);
        setSchools(supabaseSchools);
      } else if (localSchools.length === 0) {
        await db.schools.bulkAdd(MOCK_SCHOOLS);
        setSchools(MOCK_SCHOOLS);
      }

      if (supabaseStudents && supabaseStudents.length > 0) {
        await db.students.clear();
        await db.students.bulkAdd(supabaseStudents);
        setStudents(supabaseStudents);
      } else if (localStudents.length === 0) {
        await db.students.bulkAdd(MOCK_STUDENT_REGISTRY);
        setStudents(MOCK_STUDENT_REGISTRY);
      }

      if (supabaseProfs && supabaseProfs.length > 0) {
        await db.professionals.clear();
        await db.professionals.bulkAdd(supabaseProfs);
        setProfessionals(supabaseProfs);
      } else if (localProfs.length === 0) {
        await db.professionals.bulkAdd(MOCK_PROFESSIONALS);
        setProfessionals(MOCK_PROFESSIONALS);
      }

      if (supabaseProjects && supabaseProjects.length > 0) {
        await db.projects.clear();
        await db.projects.bulkAdd(supabaseProjects);
        setProjects(supabaseProjects);
      } else if (localProjects.length === 0) {
        await db.projects.bulkAdd(MOCK_PROJECTS);
        setProjects(MOCK_PROJECTS);
      }

      setIsOffline(false);

    } catch (error) {
      console.warn("Modo Offline Ativo - Usando dados locais.");
      setIsOffline(true);
      if (isLoading) {
         setSchools(await db.schools.toArray());
         setStudents(await db.students.toArray());
         setProfessionals(await db.professionals.toArray());
         setProjects(await db.projects.toArray());
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getNearestSchool = (lat: number, lng: number) => {
    // Validação robusta de coordenadas de origem antes do cálculo
    if (
        lat === null || lat === undefined || isNaN(lat) || Math.abs(lat) > 90 ||
        lng === null || lng === undefined || isNaN(lng) || Math.abs(lng) > 180
    ) {
        return null;
    }

    const validSchools = schools.filter(s => 
        s && 
        typeof s === 'object' &&
        typeof s.lat === 'number' && !isNaN(s.lat) && isFinite(s.lat) && Math.abs(s.lat) <= 90 &&
        typeof s.lng === 'number' && !isNaN(s.lng) && isFinite(s.lng) && Math.abs(s.lng) <= 180
    );
    
    if (validSchools.length === 0) return null;
    
    let nearest = validSchools[0];
    let minDistance = calculateDistance(lat, lng, nearest.lat, nearest.lng);
    
    validSchools.forEach(school => {
      const dist = calculateDistance(lat, lng, school.lat, school.lng);
      if (dist < minDistance) { minDistance = dist; nearest = school; }
    });
    return { school: nearest, distance: minDistance };
  };

  // --- OPTIMISTIC MUTATIONS (ZERO LATENCY) ---
  // A UI é atualizada instantaneamente. A sincronização com o Supabase ocorre em background.

  const addSchool = async (school: School) => {
    // 1. Local & State (Instant)
    await db.schools.add(school);
    setSchools(prev => [...prev, school]);
    addToast("Unidade escolar registrada localmente.", "success");

    // 2. Background Sync
    supabase.from('schools').insert(school).then(({ error }) => {
        if (error) console.error("Background Sync Error (Add School):", error);
    });
  };

  const updateSchool = async (school: School) => {
    await db.schools.put(school);
    setSchools(prev => prev.map(s => s.id === school.id ? school : s));
    addToast("Dados da unidade atualizados.", "success");

    supabase.from('schools').upsert(school).then(({ error }) => {
        if (error) console.error("Background Sync Error (Update School):", error);
    });
  };

  const addStudent = async (student: RegistryStudent) => {
    await db.students.add(student);
    setStudents(prev => [student, ...prev]);
    addToast("Matrícula transmitida ao barramento nominal.", "success");

    supabase.from('students').insert(student).then(({ error }) => {
        if (error) console.error("Background Sync Error (Add Student):", error);
    });
  };

  const updateStudent = async (student: RegistryStudent) => {
    await db.students.put(student);
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    addToast("Registro sincronizado.", "success");

    supabase.from('students').upsert(student).then(({ error }) => {
        if (error) console.error("Background Sync Error (Update Student):", error);
    });
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    await (db as any).transaction('rw', [db.students], async () => {
      for (const s of updatedStudents) { 
        await db.students.put(s); 
      }
    });
    // Atualiza estado local recarregando do Dexie para garantir consistência
    setStudents(await db.students.toArray());
    addToast("Lote nominal processado.", "success");

    supabase.from('students').upsert(updatedStudents).then(({ error }) => {
        if (error) console.error("Background Sync Error (Batch Update):", error);
    });
  };

  const removeStudent = async (id: string) => {
    await db.students.delete(id);
    setStudents(prev => prev.filter(s => s.id !== id));
    addToast("Registro removido.", "info");

    supabase.from('students').delete().eq('id', id).then(({ error }) => {
        if (error) console.error("Background Sync Error (Remove Student):", error);
    });
  };

  const addProfessional = async (prof: Professional) => {
    await db.professionals.add(prof);
    setProfessionals(prev => [prof, ...prev]);
    addToast("Profissional cadastrado.", "success");

    supabase.from('professionals').insert(prof).then(({ error }) => {
        if (error) console.error("Background Sync Error (Add Prof):", error);
    });
  };

  const updateProfessional = async (prof: Professional) => {
    await db.professionals.put(prof);
    setProfessionals(prev => prev.map(p => p.id === prof.id ? prof : p));
    addToast("Profissional atualizado.", "success");

    supabase.from('professionals').upsert(prof).then(({ error }) => {
        if (error) console.error("Background Sync Error (Update Prof):", error);
    });
  };

  const removeProfessional = async (id: string) => {
    await db.professionals.delete(id);
    setProfessionals(prev => prev.filter(p => p.id !== id));
    addToast("Servidor desligado do sistema.", "info");

    supabase.from('professionals').delete().eq('id', id).then(({ error }) => {
        if (error) console.error("Background Sync Error (Remove Prof):", error);
    });
  };

  const addProject = async (proj: Project) => {
    await db.projects.add(proj);
    setProjects(prev => [proj, ...prev]);
    addToast("Projeto municipal criado.", "success");

    supabase.from('projects').insert(proj).then(({ error }) => {
        if (error) console.error("Background Sync Error (Add Project):", error);
    });
  };

  const updateProject = async (proj: Project) => {
    await db.projects.put(proj);
    setProjects(prev => prev.map(p => p.id === proj.id ? proj : p));
    addToast("Projeto atualizado.", "success");

    supabase.from('projects').upsert(proj).then(({ error }) => {
        if (error) console.error("Background Sync Error (Update Project):", error);
    });
  };

  const removeProject = async (id: string) => {
    await db.projects.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    addToast("Projeto arquivado.", "info");

    supabase.from('projects').delete().eq('id', id).then(({ error }) => {
        if (error) console.error("Background Sync Error (Remove Project):", error);
    });
  };

  const linkStudentToProject = async (studentId: string, projectId: string) => {
    const student = await db.students.get(studentId);
    if (student) {
      const list = student.projects || [];
      if (!list.includes(projectId)) {
        const updated = { ...student, projects: [...list, projectId] };
        
        // Optimistic update
        await db.students.put(updated);
        setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
        
        // Update local project count optimistically too if needed, but keeping it simple for now
        const proj = await db.projects.get(projectId);
        if (proj) {
            const updatedProj = { ...proj, participantsCount: proj.participantsCount + 1 };
            await db.projects.put(updatedProj);
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProj : p));
            // Background sync project
            supabase.from('projects').upsert(updatedProj).then();
        }

        addToast("Vínculo de projeto concluído.", "success");
        
        // Background Sync Student
        supabase.from('students').upsert(updated).then(({ error }) => {
            if (error) console.error("Background Sync Error (Link Project):", error);
        });
      } else { 
          addToast("Aluno já participa deste projeto.", "info"); 
      }
    }
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