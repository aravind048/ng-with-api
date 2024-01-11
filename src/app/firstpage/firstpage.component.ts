import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';


export interface MatchData {
  date: string;
  country: string;
  leagueName: string;
  countryCode: string;
  matches: {
    team1: string;
    matchTime: string;
    team2: string;
  }[];
}

export interface ButtonData {
  label: string;
  date: string;
  count: number;
  isTableVisible: boolean;
  isButtonClicked: boolean;
  sup: string;
  tableData: MatchData[];
}


@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.scss']
})

export class FirstpageComponent implements OnInit, AfterViewInit {

  isRedButton1: boolean = false;
  isRedButton2: boolean = false;
  isRedButton3: boolean = false;
  isRedButton4: boolean = false;
  isRedButton5: boolean = false;
  isRedButton6: boolean = false;
  isRedButton7: boolean = false;

  sports: number;


  buttonData: ButtonData[] = [];
  visibleButtons: ButtonData[] = [];  // To hold the currently visible buttons
  private containerWidth: number = 0;  // To store the width of the button container
  private buttonsPerView = 7;  // 

  countries: any[] = [];



  constructor(private router: Router,
    private apiService: ApiService,
    private elementRef: ElementRef,) {
    this.sports = 0;

  }

  setSports(sport: string) {
    if (sport === 'Football') {
      this.sports = 1;
    } else {
      this.sports = 0;
    }
  }

  navigateToSecondPage() {
    this.router.navigate(['/bet-builder']);
  }

  ngOnInit() {
    this.apiService.getButtonData().subscribe((data: any[]) => {
      this.generateDateLabelsFromApi(data);
    });

    this.apiService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  getFlagIconURL(countryCode: string): string {
    return this.apiService.getFlagIconURL(countryCode);
  }

  onImageError(event: Event, countryData: any) {
    console.error('Failed to load flag for country:', countryData);
  }
  


  generateDateLabelsFromApi(apiData: any[]) {
    const dateDataMap: Map<string, Map<string, any[]>> = new Map<string, Map<string, any[]>>();

    for (let i = 0; i < apiData.length; i++) {
      const response = apiData[i];
      const matchDate = new Date(response.MatchDate);
      const formattedDate = this.formatDate(matchDate);

      // Convert MatchTime to local time
      const matchTimeParts = response.MatchTime.split(':');
      const matchTimeUTC = new Date();
      matchTimeUTC.setUTCHours(parseInt(matchTimeParts[0], 10));
      matchTimeUTC.setUTCMinutes(parseInt(matchTimeParts[1], 10));

      // Populate the table data based on the API response
      const rowData = {
        country: response.Country,
        leagueName: response.LeagueName,
        team1: response.Team1Name,
        // Display hours and minutes in local time
        matchTime: matchTimeUTC.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        team2: response.Team2Name,
        countryCode: response.CountryCode 
      };

      if (!dateDataMap.has(formattedDate)) {
        dateDataMap.set(formattedDate, new Map<string, any[]>());
      }

      const countryDataMap = dateDataMap.get(formattedDate);
      if (countryDataMap) {
        if (!countryDataMap.has(response.Country)) {
          countryDataMap.set(response.Country, []);
        }

        countryDataMap.get(response.Country)?.push(rowData);
      }
    }

    // Generate button data based on the date and country data
    dateDataMap.forEach((countryData, date) => {
      const tableData: any[] = [];
      countryData.forEach((matches, country) => {
        tableData.push({ country, leagueName: matches[0].leagueName, matches });
      });

      const buttonData: ButtonData = {
        label: this.getDayOfWeek(new Date(date).getDay()),
        date,
        count: tableData.length,
        isTableVisible: false,
        isButtonClicked: false,
        sup: this.getSuperscript(tableData.length),
        tableData
      };

      this.buttonData.push(buttonData);
    });
  }

  private formatDate(date: Date): string {
    const day = date.toLocaleString('en-us', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('en-us', { month: 'short' });
    const daySup = this.getSuperscript(dayOfMonth);

    return `${day} <br> ${dayOfMonth}<sup>${daySup}</sup> ${month}`;
  }


  private getDayOfWeek(day: number): string {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek[day];
  }

  private getSuperscript(n: number): string {
    if (n >= 11 && n <= 13) {
      return 'th';
    }
    const remainder = n % 10;
    console.log(remainder)

    if (remainder === 1) {
      return 'st';
    } else if (remainder === 2) {
      return 'nd';
    } else if (remainder === 3) {
      return 'rd';
    } else {
      return 'th';
    }
  }



  ngAfterViewInit() {
    this.containerWidth = this.elementRef.nativeElement.querySelector('#buttonContainer').offsetWidth;
    this.updateVisibleButtons();
  }
  toggleTable(index: number) {
    const button: ButtonData = this.buttonData[index];

    // If the button is already selected, deselect it
    if (button.isButtonClicked) {
      button.isTableVisible = false;
      button.isButtonClicked = false;
    } else {
      // Deselect any previously selected button
      this.buttonData.forEach((btn, i) => {
        if (i !== index) {
          btn.isTableVisible = false;
          btn.isButtonClicked = false;
        }
      });

      // Toggle the visibility of the clicked button
      button.isTableVisible = !button.isTableVisible;
      button.isButtonClicked = !button.isButtonClicked;
    }
  }



  private updateVisibleButtons() {
    if (this.containerWidth && this.buttonData.length > 0) {
      const numButtons = Math.min(this.buttonsPerView, this.buttonData.length);
      this.visibleButtons = this.buttonData.slice(0, numButtons);
    }
  }

}
