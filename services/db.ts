
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { School, RegistryStudent, Professional, Project } from '../types';

export class EducaDatabase extends Dexie {
  schools!: Table<School>;
  students!: Table<RegistryStudent>;
  professionals!: Table<Professional>;
  projects!: Table<Project>;

  constructor() {
    super('EducaMunicipioDB');
    
    // Configuração do barramento de dados v12 para auditoria nominal e resiliência síncrona
    // Fix: Using this.version which is available on Dexie class instances when extending correctly
    this.version(12).stores({
      schools: 'id, inep, name, address',
      students: 'id, enrollmentId, inepId, name, cpf, school, status, specialNeeds, transportRequest, classCode',
      professionals: 'id, name, cpf, schoolId, status',
      projects: 'id, name, category, status'
    });
  }
}

export const db = new EducaDatabase();
