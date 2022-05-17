import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Site } from '../app/site'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hackathon';
  hideTable: boolean = false;
  selectedIndex: number;
  websites: Site[] = []
  /*{ title: "Test1", comments: "Test test test", date: "1643985425", url: "my-url.com", advices: [] },
  { title: "Test2", comments: "Test test test", date: "1643985425", url: "my-url.com", advices: [] },
  { title: "Test3", comments: "Test test test", date: "1643985425", url: "my-url.com", advices: [] },
  { title: "Test4", comments: "Test test test", date: "1643985425", url: "my-url.com", advices: [] }];*/


  constructor(private http: HttpClient) {
    this.selectedIndex = 0;
    //this.websites = this.getAllRecords();
    this.initActiveRecoredss();
  }

  initActiveRecoredss() {
    console.log(`initActiveRecoredss: Entering`);
    this.getAllRecords().subscribe(records => {
      console.log(`get ${records.length} recoreds`);
      this.websites = records;//[JSON.parse(records)];
      setTimeout(() => {
        this.initActiveRecoredss();
      }, 10000);
    },
      error => {
        console.warn(`failed to initialize  (${error.toString()})`);
        setTimeout(() => {
          this.initActiveRecoredss();
        }, 30000);
      }
    )
  }

  selectIndex(index: number) {

    this.selectedIndex = index;
    this.hideTable = true;
  }
  openMainTab(event: boolean) {
    this.hideTable = !event;
  }

  getAllRecords(): Observable<Site[]> {
    console.log(`getAllRecords: Entering http://localhost:3007/techCare`);
    return this.http.get<Site[]>('http://localhost:3007/techCare');
  }
}
