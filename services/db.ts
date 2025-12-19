import Dexie, { Table } from 'dexie';
import { School, RegistryStudent } from '../types';

// Fixed: Changed to default import of Dexie to ensure class inheritance works correctly and 'version' property is available
class EducaDatabase extends Dexie {
  schools!: Table<School>;
  students!: Table<RegistryStudent>;

  constructor() {
    super('EducaMunicipioDB');
    
    // Schema definition using the version method provided by the Dexie base class
    this.version(1).stores({
      schools: 'id, inep, name, address',
      students: 'id, enrollmentId, name, cpf, school, status, className' 
    });
  }
}

export const db = new EducaDatabase();