import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notification.service';
import { Employee, SearchParams, SortParams } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  
  searchUsername: string = '';
  searchNamaLengkap: string = '';
  searchGrup: string = '';
  
  sortField: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  
  pageSizeOptions = [10, 25, 50, 100];

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employees = this.employeeService.getEmployees();
    
    // Restore previous search params if any
    const savedParams = this.employeeService.getSearchParams();
    this.searchUsername = savedParams.username;
    this.searchNamaLengkap = savedParams.namaLengkap;
    this.searchGrup = savedParams.group;
    
    this.applyFiltersAndSort();
  }

  onSearch(): void {
    this.currentPage = 1;
    const searchParams: SearchParams = {
      username: this.searchUsername,
      namaLengkap: this.searchNamaLengkap,
      group: this.searchGrup
    };
    this.employeeService.setSearchParams(searchParams);
    this.applyFiltersAndSort();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  private applyFiltersAndSort(): void {
    // Filter
    const searchParams: SearchParams = {
      username: this.searchUsername,
      namaLengkap: this.searchNamaLengkap,
      group: this.searchGrup
    };
    this.filteredEmployees = this.employeeService.filterEmployees(searchParams);
    
    // Sort
    const sortParams: SortParams = {
      field: this.sortField,
      direction: this.sortDirection
    };
    this.filteredEmployees = this.employeeService.sortEmployees(this.filteredEmployees, sortParams);
    
    // Update pagination
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }

  tambahKaryawan(): void {
    this.router.navigate(['/employees/add']);
  }

  onViewDetail(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  onEdit(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.notificationService.show(`Ubah karyawan : ${employee.username}`, 'warning');
  }

  onDelete(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.notificationService.show(`Hapus karyawan : ${employee.username}`, 'error');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}