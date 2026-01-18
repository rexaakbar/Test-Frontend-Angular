import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, SearchParams, SortParams } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];
  private searchParamsSubject = new BehaviorSubject<SearchParams>({ username: '', group: '', namaLengkap: '' });
  public searchParams$ = this.searchParamsSubject.asObservable();

  constructor() {
    this.generateDummyData();
  }

  private generateDummyData(): void {
    const groups = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT Support', 'Product', 'Design', 'Customer Service'];
    const statuses = ['Aktif', 'Tidak Aktif', 'Cuti'];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'William', 'Anna', 'Richard', 'Emma', 'Thomas'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Taylor'];

    this.employees = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      username: `${firstNames[i % firstNames.length]}${lastNames[i % lastNames.length]}${i + 1}`,
      firstName: firstNames[i % firstNames.length],
      lastName: lastNames[i % lastNames.length],
      email: `${firstNames[i % firstNames.length]}${lastNames[i % lastNames.length]}${i + 1}@testfeangular.com`,
      birthDate: new Date(1970 + (i % 40), i % 12, (i % 28) + 1).toISOString().split('T')[0],
      basicSalary: 5000000 + (i * 100000),
      status: statuses[i % statuses.length],
      group: groups[i % groups.length],
      description: new Date(2000 + (i % 40), i % 12, (i % 28) + 1).toISOString().split('T')[0]
    }));
  }

  getEmployees(): Employee[] {
    return this.employees;
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  addEmployee(employee: Employee): void {
    const newId = Math.max(...this.employees.map(e => e.id || 0)) + 1;
    this.employees.push({ ...employee, id: newId });
  }

  filterEmployees(searchParams: SearchParams): Employee[] {
    
    return this.employees.filter(emp => {
      const cariUsername = emp.username.toLowerCase().includes(searchParams.username.toLowerCase());
      const cariNamaLengkap = (emp.firstName.toLowerCase() + emp.lastName.toLowerCase()).includes(searchParams.namaLengkap.toLowerCase());
      const cariGrup = emp.group.toLowerCase().includes(searchParams.group.toLowerCase());

      return cariUsername && cariNamaLengkap && cariGrup;
    });
  }

  sortEmployees(employees: Employee[], sortParams: SortParams): Employee[] {
    return [...employees].sort((a, b) => {
      const aVal = a[sortParams.field as keyof Employee];
      const bVal = b[sortParams.field as keyof Employee];

      if (aVal === undefined || bVal === undefined) return 0;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortParams.direction === 'asc' ? comparison : -comparison;
    });
  }

  setSearchParams(params: SearchParams): void {
    this.searchParamsSubject.next(params);
  }

  getSearchParams(): SearchParams {
    return this.searchParamsSubject.value;
  }

  getGroups(): string[] {
    return ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT Support', 'Product', 'Design', 'Customer Service'];
  }

  getStatuses(): string[] {
    return ['Aktif', 'Tidak Aktif', 'Cuti'];
  }
}