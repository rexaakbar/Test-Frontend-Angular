import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notification.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {
  employee: Employee = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    basicSalary: 0,
    status: 'Active',
    group: '',
    description: ''
  };

  groups: string[] = [];
  statuses: string[] = [];
  groupSearch: string = '';
  filteredGroups: string[] = [];
  showGroupDropdown: boolean = false;
  maxDate: string = '';

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    // Set max date to today
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.groups = this.employeeService.getGroups();
    this.statuses = this.employeeService.getStatuses();
    this.filteredGroups = this.groups;
  }

  cariGrup(): void {
    this.filteredGroups = this.groups.filter(group =>
      group.toLowerCase().includes(this.groupSearch.toLowerCase())
    );
    this.showGroupDropdown = this.groupSearch.length > 0;
  }

  pilihGrup(group: string): void {
    this.employee.group = group;
    this.groupSearch = group;
    this.showGroupDropdown = false;
  }

  cekEmail(): boolean {
    if (!this.employee.email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.employee.email);
  }

  cekTanggalLahir(): boolean {
    if (!this.employee.birthDate) return true;
    return new Date(this.employee.birthDate) <= new Date();
  }

  isFormValid(): boolean {
    return (
      this.employee.username.trim() !== '' &&
      this.employee.firstName.trim() !== '' &&
      this.employee.lastName.trim() !== '' &&
      this.employee.email.trim() !== '' &&
      this.cekEmail() &&
      this.employee.birthDate !== '' &&
      this.cekTanggalLahir() &&
      this.employee.basicSalary > 0 &&
      this.employee.status !== '' &&
      this.employee.group !== '' &&
      this.employee.description !== ''
    );
  }

  simpanKaryawan(): void {
    if (!this.isFormValid()) {
      this.notificationService.show('Isi semua kolom yang memiliki logo bintang!', 'error');
      return;
    }

    this.employeeService.addEmployee(this.employee);
    this.notificationService.show('Karyawan behasil ditambah!', 'success');
    this.router.navigate(['/employees']);
  }

  kembali(): void {
    this.router.navigate(['/employees']);
  }
}