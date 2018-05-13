import { Component } from '@angular/core';
// import { slideIn } from './animations';
import { DataCarrier } from './interface';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public data: Array<Array<DataCarrier>>;
  fullMode: boolean;

  slideValue = {
    value: 'start',
    params: {
      startX: '100px',
      endX: '0px',
      time: '1s'
    }
  };

  dataTransfer(info: Array<Array<DataCarrier>>) {
    this.data = info;
  }
}
