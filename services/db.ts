
import { Dexie, type Table } from 'dexie';
import { School, RegistryStudent } from '../types';

// Properly extending Dexie using named import to ensure method visibility for versioning and stores.
class EducaDatabase extends Dexie {
  schools!: Table<School>;
  students!: Table<RegistryStudent>;

  constructor() {
    super('EducaMunicipioDB');
    
    // Fix: Using the correct named import for Dexie ensures 'version' is recognized as a method from the inherited class.
    this.version(4).stores({
      schools: 'id, inep, name, address',
      students: 'id, enrollmentId, inepId, name, cpf, school, status, specialNeeds, transportRequest, classCode' 
    });
  }
}

export const db = new EducaDatabase();
