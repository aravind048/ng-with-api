import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ButtonData } from './firstpage/firstpage.component';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://cms.bettorlogic.com/api/BetBuilder/GetFixtures?sports=1';

  private countriesUrl = 'assets/countries.csv';

  constructor(private http: HttpClient) { }

  getButtonData(): Observable<ButtonData[]> {
    return this.http.get<ButtonData[]>(this.apiUrl);
  }

  getCountries(): Observable<{ countryCode: string; countryName: string }[]> {
    return this.http.get(this.countriesUrl, { responseType: 'text' })
      .pipe(
        map((data: string) => {
          const lines = data.split('\n');
          return lines.map(line => {
            const [countryCode, countryName] = line.trim().split(',');
            return { countryCode, countryName };
          });
        })
      );
  }
  

  getFlagIconURL(countryCode: string): string {
    return `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
  
}

// export interface Country {
//   countryCode: string;
//   countryName: string;
// }
