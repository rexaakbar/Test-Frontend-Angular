export interface Employee {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  basicSalary: number;
  status: string;
  group: string;
  description: string;
}

export interface SearchParams {
  username: string;
  namaLengkap: string;
  group: string;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}