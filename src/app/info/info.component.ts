import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Site} from'../site';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';//faCircleArrowLeft
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() websites:Site[];
  @Input() selectedIndex:number;
  selectesInfo:Site;
  @Output() openTab = new EventEmitter();
  faCircleArrowLeft=faCircleArrowLeft;
  constructor() { 
    
  }

  ngOnInit(): void {
    if(this.websites !== undefined){
        this.selectesInfo=this.websites[this.selectedIndex];
        console.log(this.selectesInfo);
    }
  }
  backToTab(){
    this.openTab.emit(true);
  }
}
