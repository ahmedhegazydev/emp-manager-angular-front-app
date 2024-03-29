import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'EmployeeManagerAp';

  public employees: Employee[] = [];
  public editEmployee  ?: Employee ;
  public deleteEmployee   ?: Employee ;

  constructor(private employeeService: EmployeeService){

    // this.editEmployee = new  Employee()
    // this.deleteEmployee = new  Employee()

  }

  ngOnInit() {

        this.getEmployees();

  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    window.document.getElementById('add-employee-form')!.click();
    // const myMaybeNullElement = window.document.getElementById("add-employee-form'")
    // if (myMaybeNullElement === null) {
    //   alert('oops');
    // } else {
    //   // since you've done the nullable check
    //   // TS won't complain from this point on
    //   //myMaybeNullElement.nodeName // <- no error
    //   myMaybeNullElement.click()
    // }
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee ?: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId ?: number | null): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee ?: Employee | null, mode ?: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    // alert('oops');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
      // alert('add');
    }
    if (mode === 'edit') {
      this.editEmployee = employee ?? new Employee();
      button.setAttribute('data-target', '#updateEmployeeModal');
      // alert('edit');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee ?? new Employee();
      button.setAttribute('data-target', '#deleteEmployeeModal');
      // alert('delete');
    }
    if (container === null) {
      // alert('oops');
    } else {
      // since you've done the nullable check
      // TS won't complain from this point on
      // container.nodeName // <- no error
      container.appendChild(button);
      // alert('oops');
    }
    button.click();
  }

}
