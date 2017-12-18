import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {IData} from './data.model';

import {timer} from 'rxjs/observable/timer';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: IData[]= [];
  public context;
  @ViewChild('myCanvas') myCanvas;
  myForm: FormGroup;
  private canvas;
  private sections;
  private Val_max;
  private Val_min;
  private yScale;
  private xScale;
  private dateError: boolean = true;

  constructor(private dataService: DataService,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      startDate: [],
      endDate: [],
    });
  }

  onsubmit() {

    if (this.myForm.get('startDate').value == null || this.myForm.get('endDate').value == null) {
          this.dateError = false;
    } else {
      this.dateError = true;
      var payload = {
        'startDate': this.myForm.get('startDate').value,
        'endDate': this.myForm.get('endDate').value
      };

      this.dataService.getdata(payload).subscribe(dataValues => this.data = dataValues);
    }
  }

  startStreaming(){
    if (this.myForm.get('startDate').value == null || this.myForm.get('endDate').value == null) {
      this.dateError = false;
    } else if(this.data) {
      this.drawChart();
      this.dateError = true;
    }

  }

  drawChart() {
    this.sections = 11;
    this.Val_max = this.data.length;
    this.Val_min = 1;
    const stepSize = 1;
    const columnSize = 50;
    const rowSize = 50;
    const margin = 3;
    const xAxis = [' ', '1', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'];
    this.canvas = this.myCanvas.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = '#0099ff';
    this.context.font = '20 pt Verdana';
    this.yScale = (this.canvas.height - columnSize - margin) / (this.Val_max - this.Val_min);
    this.xScale = (this.canvas.width - rowSize) / this.sections;
    this.context.strokeStyle = '#009933'; // color of grid lines

    this.context.beginPath();
    // print Parameters on X axis, and grid lines on the graph
    for (let i = 1; i <= this.sections; i++) {
      var x = i * this.xScale;
      this.context.fillText(xAxis[i], x, columnSize - margin - 20);
      this.context.moveTo(x, columnSize);
      this.context.lineTo(x, this.canvas.height - margin);
    }
    // print row header and draw horizontal grid lines
    var count = 0;
    for (let scale = this.Val_max; scale >= this.Val_min; scale = scale - stepSize) {
      let y = columnSize + (this.yScale * count * stepSize);
      let date = moment(this.data[scale - 1].date).format('MM-DD-YYYY');
      this.context.fillText(date, margin - 4, y + margin);
      this.context.moveTo(rowSize, y);
      this.context.lineTo(this.canvas.width, y);
      count++;
    }
    this.context.stroke();
    this.context.translate(rowSize, this.canvas.height + this.Val_min * this.yScale);
    this.context.scale(1, -1 * this.yScale);
    this.context.strokeStyle = '#FF0066';
    this.plotData(this.data);
  }

  plotData(dataSet) {
    var x;
    this.context.beginPath();
    x = ((dataSet[0].value) / 10) * 5;
    this.context.moveTo(x, 1);
    for (let i = 1; i < this.data.length; i++) {
      x = ((this.data[i].value) / 10) * 5;
      this.context.lineTo(x, i + 1);
    }
    this.context.stroke();
}




