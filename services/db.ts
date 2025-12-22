// Fix: Use default import for Dexie to ensure correct type resolution for class methods inherited from Dexie
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { School, RegistryStudent } from '../types';

class EducaDatabase extends Dexie {
  schools!: Table<School>;
  students!: Table<RegistryStudent>;

  constructor() {
    super('EducaMunicipioDB');
    
    // Fix: The 'version' method is correctly resolved from the Dexie base class after fixing the import
    this.version(3).stores({
      schools: 'id, inep, name, address',
      students: 'id, enrollmentId, name, cpf, school, status, specialNeeds, transportRequest' 
    });
  }
}

export const db = new EducaDatabase();