import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Site} from'../site';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';//faCircleArrowLeft
@Component({
  selector: 'app-main-tab',
  templateUrl: './main-tab.component.html',
  styleUrls: ['./main-tab.component.scss']
})
export class MainTabComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  @Output() clickIndex = new EventEmitter();
  @Input() websites:Site[];
  @Output() openDashboard = new EventEmitter();
  faCircleArrowLeft=faCircleArrowLeft;
  // websites: Site[] = [
  //   { title:"Test1",comments:"Test test test",date:"1111111",url:"url",advices:[]},
  //   { title:"Test2",comments:"Test test test",date:"1111111",url:"url",advices:[]},
  //   { title:"Test3",comments:"Test test test",date:"1111111",url:"url",advices:[]},
  //   { title:"Test4",comments:"Test test test",date:"1111111",url:"url",advices:[]}];

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  constructor() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
   }

  ngOnInit(): void {
    this.dtTrigger.next(0);
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
    }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  moreInfo(index:any){
    console.log(index);
    this.clickIndex.emit(index);
  }
  backToDash(){
    this.openDashboard.emit(true);
  }
}
