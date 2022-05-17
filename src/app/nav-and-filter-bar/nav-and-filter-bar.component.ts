import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';//faCircleArrowLeft
@Component({
  selector: 'app-nav-and-filter-bar',
  templateUrl: './nav-and-filter-bar.component.html',
  styleUrls: ['./nav-and-filter-bar.component.scss']
})
export class NavAndFilterBarComponent implements OnInit {
  faCoffee = faCoffee;
  constructor() { }

  ngOnInit(): void {
  }

}
