import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-bet-builder',
  templateUrl: './bet-builder.component.html',
  styleUrls: ['./bet-builder.component.scss']
})
export class BetBuilderComponent implements OnInit {

  source!: string;

  constructor(private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.source = params.get('source') ?? '';
      console.log(".......", this.source)
    });
  }

  selectedItem: string = '';
  selectedLeg: number = 0;
  betBuilderOdds: number = 0;


  items: string[] = ['Half time Result - Draw', 'Option 2', 'Option 3']; // Replace with your options
  legs: number[] = [1, 2, 3]; // Replace with your numeric leg options

  // Function to handle selection change
  onItemChange() {
    console.log('Selected item:', this.selectedItem);
  }
  // Function to handle leg selection change
  onLegChange() {
    console.log('Selected leg:', this.selectedLeg);
  }

  rows = [
    { col1: 'Brentfort have drawn the first half in 5 of their last 6 home games', col2: 'Half Time Result', col3: 'Draw' },
    { col1: 'There have been alteast 5 cards in all of the last 5 Newcastle games', col2: 'Match Bookings', col3: 'Over' },
    { col1: 'Ivan Toney has scored in his last 3 appearances', col2: 'Anytime Scorer', col3: 'Ivan Toney' },
    { col1: 'Brentfort have had fewer than 4 corners in 9 of their last 11 games', col2: 'Team corners', col3: 'Under' },
    { col1: 'Brentford have lost 7 of their last 8 games', col2: 'Match Outcome', col3: 'Away' }
  ];


  applyRedClass(text: string): any[] {
    // Split the text into segments of numbers and non-numbers
    const segments = text.split(/(\d+)/);

    // Apply 'red-text' class to numeric segments
    const styledSegments = segments.map(segment => {
      if (/^\d+$/.test(segment)) {
        return { text: segment, isNumeric: true };
      } else if (segment.toLowerCase() === 'all') {
        return { text: segment, isAll: true };
      }
      return { text: segment, isNumeric: false };
    });

    return styledSegments;
  }

}
