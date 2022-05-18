import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke,
  ApexLegend,
  ApexResponsive
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  responsive:ApexResponsive | ApexResponsive[];
  legend:ApexLegend;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart") chart2: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  @Output() openTabTipe = new EventEmitter();
  mainData:any = {
    "high_alert":60,
    "medium_alert":45,
    "low_alert":20,
    "category1":80,
    "category2":55,
    "category3":28,
  }
  constructor() { 
    //Threats Chart Options//
    this.chartOptions = {
      series: [this.mainData.high_alert, this.mainData.medium_alert, this.mainData.low_alert],
      chart: {
        height: 500,
        type: "radialBar"
      },
    
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          //endAngle: 270,
          hollow: {
            margin: 5,
            size: '68%',
           background: 'transparent',
           image: undefined
          },
          track: {
            show: false,
          },
        
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        },
        
        
      },
     
      labels: ["High alert", "Medium alert","Low alert"],
      colors: ["#C62828", "#FF5722", "#FFC107"],
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'round',
        width: 4
      },
      legend: {
        show: true,
        floating: true,
        fontSize: "18px",
        position: "left",
        offsetX: 200,
        offsetY: 180,
        fontWeight:600,
        labels: {
          useSeriesColors: true
        },
        markers: {
          width:0,

      },
        formatter: function(seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
 
    
    };
//Categories Chart Options//
    this.chartOptions2 = {
      
      series: [this.mainData.category1, this.mainData.category2, this.mainData.category3],
      chart: {
        height: 500,
        type: "radialBar"
      },
    
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          //endAngle: 270,
          hollow: {
            margin: 5,
            size: '68%',
           background: 'transparent',
    
          },
          track: {
            show: false,
          },
     
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        },
        
        
      },
     
      labels: ["Categori-1", "Categori-2","Categori-3"],
      colors: ["#1E88E5", "#00ACC1", "#7CB342"],
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'round',
        width: 4
      },
      legend: {
        show: true,
        floating: true,
        fontSize: "18px",
        position: "left",
        offsetX: 200,
        offsetY: 180,
        fontWeight:600,
        labels: {
          useSeriesColors: true
        },
        markers: {
          width:0,

      },
        formatter: function(seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 0
        }
      },
 
    
    };
  }

  ngOnInit(): void {
  }

showDataInTab(tabTipe:string){
  this.openTabTipe.emit(tabTipe);
}
}
