import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent {
  isSubmitted = false;
  surveyData = {
    age: '',
    gender: '',
    education: '',
    sector: '',
    neighborhood: '',
    residenceDuration: '',
    mainTransport: '',
    trafficIssues: '',
    timeInTraffic: '',
    parkingEase: '',
    cityCenterParkingEase: '',
    illegalParking: '',
    undergroundParking: '',
    biggestTrafficProblem: '',
    trafficImprovements: '',
    bikeLanesSatisfaction: '',
    bikeLaneSafety: '',
    cleanlinessPublicTransport: '',
    publicTransportSufficiency: '',
    metroStationsNumber: '',
    preferBikeIfBetterInfrastructure: '',
    bikeImprovements: '',
    neighborhoodSatisfaction: '',
    legalConstruction: '',
    sidewalkSpace: '',
    sunCoveredAreas: '',
    benchesAvailability: '',
    illegalParkingMeasures: '',
    otherIssues: '',
    additionalExperience: '',
  };
  
  errorMessage = '';

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    this.isSubmitted = true;

    this.http.post('http://localhost:3000/api/get-responses', this.surveyData).subscribe({
      next: () => {
        console.log('Survey submitted successfully.');
        this.errorMessage = '';
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred.';
        console.error('Survey submission failed:', error);
        this.isSubmitted = false;
      }
    });

    console.log('Form submitted!', this.surveyData);
  }

  resetForm(): void {
    this.surveyData = {
      age: '',
      gender: '',
      education: '',
      sector: '',
      neighborhood: '',
      residenceDuration: '',
      mainTransport: '',
      trafficIssues: '',
      timeInTraffic: '',
      parkingEase: '',
      cityCenterParkingEase: '',
      illegalParking: '',
      undergroundParking: '',
      biggestTrafficProblem: '',
      trafficImprovements: '',
      bikeLanesSatisfaction: '',
      bikeLaneSafety: '',
      cleanlinessPublicTransport: '',
      publicTransportSufficiency: '',
      metroStationsNumber: '',
      preferBikeIfBetterInfrastructure: '',
      bikeImprovements: '',
      neighborhoodSatisfaction: '',
      legalConstruction: '',
      sidewalkSpace: '',
      sunCoveredAreas: '',
      benchesAvailability: '',
      illegalParkingMeasures: '',
      otherIssues: '',
      additionalExperience: '',
    };
    this.isSubmitted = true;
  }
}
