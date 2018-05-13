import { Component, Input, HostListener, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import _ from 'lodash';
import { slideIn } from '../animations';
import { AnimationPlayer, AnimationBuilder } from '@angular/animations';
import { Observable, Scheduler, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'full-screen',
  templateUrl: './fullScreen.component.html',
  styleUrls: ['./fullScreen.component.scss'],
  animations: [
    slideIn
  ]
})
export class FullScreenComponent implements OnInit, AfterViewInit {

  @ViewChild('holder', { read: ElementRef}) holder: ElementRef;
  @ViewChild('sliding', { read: ElementRef}) sliding: ElementRef;
  @HostListener('window:keyup', ['$event'])
  check(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 27:
        this.fullScreen.emit();
        break;
      default:
        console.log('other keys');
        break;
    }
  }

  @Input() data: string;
  @Output() fullScreen = new EventEmitter();
  
  left = 0;
  frame$: Subscription;
  slideValue: string;
  param = {
    start: null,
    end: null,
    time: null
  };

  ngOnInit() {
    this.left = -window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = [].concat.apply([], changes['data'].currentValue);
    console.log(changes['data'].previousValue, changes['data'].currentValue);
  }

  changeTrigger() {
    this.slideValue = this.slideValue === 'start' ? 'end' : 'start';
  }

  ngAfterViewInit() {
    this.param.start = this.holder.nativeElement.offsetWidth + 'px';
    this.param.end = this.sliding.nativeElement.offsetWidth + 'px';
    this.param.time = '5s';

    let lerp = (start, end) => {
      console.log(start, end);
      if (start < -this.sliding.nativeElement.offsetWidth)
        return window.innerWidth;
      return start - 1;
    }

    // let interval$ = Observable.interval(1500);
    this.frame$ = Observable.interval(0, Scheduler.animationFrame)
      // .throttleTime(1000)
      .scan(lerp, window.innerWidth - 1)
      .subscribe(left => {
        console.log(left);
        this.left = left;
      });
      // .withLatestFrom(interval$, (frame, interval) => interval)
  }

  ngOnDestroy() {
    this.frame$.unsubscribe();
  }

  log(event) {
    console.log(event);
  }

}
