import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-backend-output',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backend-output.component.html',
  styleUrl: './backend-output.component.scss'
})
export class BackendOutputComponent implements OnInit {
  responses: any[] = [];
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchResponses();
  }

  fetchResponses(): void {
    this.http.get('http://localhost:3000/api/get-responses').subscribe({
      next: (response: any) => {
        console.log('Fetched survey responses:', response);
        this.responses = response.data;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred while fetching responses.';
        console.error('Error fetching responses:', error);
      },
    });
  }
}