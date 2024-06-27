import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent implements OnInit {
  title = 'todo';
  tasks: Task[] = [];
  newTask: Task = { _id: '', title: '', description: '', status: '' };
  isEditing = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Task[]>('http://localhost:5000/tasks') 
      .subscribe(tasks => {
        this.tasks = tasks;
      }, error => {
        console.error('Error fetching tasks:', error);
      });
  }

  public deleteTask(id: string) {
    const url = `http://localhost:5000/tasks/${id}`;
    this.http.delete(url).subscribe(
      (response: any) => {
        console.log('Task deleted successfully', response);
        this.tasks = this.tasks.filter(task => task._id !== id);
      },
      (error) => {
        console.error('Error deleting task', error);
      }
    );
  }

  public insertTask() {
    const url = 'http://localhost:5000/insert';
    this.http.post<Task>(url, this.newTask).subscribe(
      (response: Task) => {
        console.log('Task inserted successfully', response);
        this.tasks.push(response);
        this.newTask = { _id: '', title: '', description: '', status: '' }; 
      },
      (error) => {
        console.error('Error inserting task', error);
      }
    );
  }

  public saveUpdate() {
    const url = `http://localhost:5000/update/${this.newTask._id}`;
    this.http.put<Task>(url, this.newTask).subscribe(
      (response: Task) => {
        console.log('Task updated successfully', response);
        const index = this.tasks.findIndex(task => task._id === response._id);
        if (index !== -1) {
          this.tasks[index] = response;
        }
        this.newTask = { _id: '', title: '', description: '', status: '' };
        this.isEditing = false;
      },
      (error) => {
        console.error('Error updating task', error);
      }
    );
  }

  public editTask(task: Task) {
    this.newTask = { ...task };
    this.isEditing = true;
  }
}
