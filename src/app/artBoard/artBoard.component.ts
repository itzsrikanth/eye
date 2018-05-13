import {
  Component, Input, OnInit, Output, EventEmitter, Renderer2, ViewChild,
  ElementRef, HostListener, OnChanges, SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/throttleTime';

import { DataCarrier } from '../interface';

enum Keys {
  BACKSPACE = 8,
  ENTER = 13,
  SHIFT = 16,
  CTRL,
  ALT,
  PAUSE_BREAK,
  CAPS_LOCK,
  ESCAPE = 27,
  PAGE_UP = 33,
  PAGE_DOWN,
  END,
  HOME,
  LEFT,
  UP,
  RIGHT,
  DOWN,
  INSERT = 45,
  DELETE,
  ZERO = 48,
  ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE,
  A = 65,
  Z = 90,
  NUMBER_PAD_0 = 96,
  NUMBER_PAD_9 = 105,
  F1 = 112,
  F12 = 123,
  NUM_LOCK = 144,
  SCROLL_LOCK,
  SEMI_COLON = 186,
  EQUAL_TO,
  COMMA,
  DASH,
  PERIOD,
  FORWARD_SLASH,
  GRAVE_ACCENT,
  OPEN_BRACKET = 219,
  BACK_SLASH,
  CLOSE_BRACKET,
  SINGLE_QUOTE
};

@Component({
  selector: 'art-board',
  templateUrl: `./artBoard.component.html`,
  styleUrls: ['./artBoard.component.scss']
})
export class ArtBoardComponent implements OnInit {


  // @HostListener('window:keydown', ['$event'])
  // keyDown(event: KeyboardEvent) {
  //   console.log('keydown: ', event);
  // }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    // console.log(event);

    // allowing alphabets to be entered
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      this.renderer.insertBefore(
        this.currentLine, this.DOMMethods.createSpan(event.key), this.cursor
      );
    }

    switch (event.keyCode) {

      case Keys.BACKSPACE:     // backspace
        this.renderer.removeChild(this.currentLine, this.cursor.previousElementSibling);
        break;

      case Keys.ENTER:      // Enter key
        let nextElems: Array<HTMLSpanElement> = [];
        let elemHolder: HTMLSpanElement = <HTMLSpanElement>this.cursor.nextElementSibling;
        do {
          if (elemHolder) {
            nextElems.push(elemHolder);
            elemHolder.parentElement.removeChild(elemHolder);
          } else {
            console.log('no element');
          }
          elemHolder = <HTMLSpanElement>this.cursor.nextElementSibling;
        } while (elemHolder !== null);
        nextElems.unshift(this.cursor);
        this.currentLine.removeChild(this.cursor);
        console.log(nextElems);
        let tmpLine = this.DOMMethods.createDiv();
        if (!this.currentLine.nextElementSibling) {
          this.DOMMethods.appendToEditor(
            this.DOMMethods.appendToParent(
              tmpLine, this.cursor
            )
          );
          console.log('new line');
        } else {
          this.renderer.insertBefore(
            this.currentLine.parentElement,
            tmpLine,
            this.currentLine.nextElementSibling
          );
          console.log('in between');
        }
        this.currentLine = tmpLine;
        console.log(this.currentLine);
        nextElems.forEach(elem => this.currentLine.appendChild(elem));
        break;

      case Keys.LEFT:     // left arrow key
        let prev: HTMLSpanElement = <HTMLSpanElement>this.cursor.previousElementSibling;
        let prevLine: HTMLDivElement = <HTMLDivElement>this.currentLine.previousElementSibling;
        if (prev) {
          let parent = prev.parentElement;
          this.renderer.insertBefore(
            parent, this.cursor, prev
          );
        } else if (prevLine) {
          this.renderer.removeChild(this.currentLine, this.cursor);
          this.renderer.appendChild(prevLine, this.cursor);
          this.currentLine = prevLine;
        }
        break;

      case Keys.RIGHT:
        let next: HTMLSpanElement = <HTMLSpanElement>this.cursor.nextElementSibling;
        let nextLine: HTMLDivElement = <HTMLDivElement>this.currentLine.nextElementSibling;
        console.log(next);
        if (next) {
          let parent = next.parentElement;
          this.renderer.insertBefore(
            parent, this.cursor, next.nextElementSibling
          );
        } else if (nextLine) {
          this.renderer.removeChild(this.currentLine, this.cursor);
          console.log(nextLine.children[0], nextLine);
          this.renderer.insertBefore(
            nextLine, this.cursor, nextLine.children[0]
          );
          this.currentLine = nextLine;
        }
        break;
    }
  }


  @ViewChild('textEditor') editor: ElementRef;
  @Output() fullScreen = new EventEmitter();
  fonts: Array<number> = [];
  speed: Array<number> = [];
  selectedFont = 22;
  selectedSpeed = 30;
  data: Array<Array<DataCarrier>> = [];
  TEXT_PADDING = 16;
  currentLine: HTMLDivElement;
  cursor: HTMLSpanElement;
  // key: Keys;

  DOMMethods = {

    createDiv: (): HTMLDivElement => {
      let div = this.renderer.createElement('div');
      // this.renderer.setStyle(div, 'height', this.selectedFont + 16 + 'px');
      this.renderer.addClass(div, 'd-flex');
      this.renderer.addClass(div, 'justify-content-center');
      this.renderer.addClass(div, 'align-items-center');
      this.renderer.addClass(div, 'w-100');
      this.renderer.addClass(div, 'line');
      return div;
    },

    returnCursor: (): HTMLSpanElement => {
      let span = this.DOMMethods.createSpan();
      this.renderer.addClass(span, 'blinking');
      this.renderer.appendChild(span, this.renderer.createText('|'));
      this.renderer.setStyle(span, 'font-size', this.selectedFont + 'px');
      this.renderer.setStyle(span, 'line-height', this.selectedFont + this.TEXT_PADDING + 'px');
      return span;
    },

    createSpan: (child?: string): HTMLSpanElement => {
      let span = this.renderer.createElement('span');
      this.renderer.setStyle(span, 'height', this.selectedFont + this.TEXT_PADDING + 'px');
      if (child) {
        let text = this.renderer.createText(child);
        span.appendChild(text);
        this.renderer.setStyle(span, 'font-size', this.selectedFont + 'px');
        this.renderer.setStyle(span, 'line-height', this.selectedFont + this.TEXT_PADDING + 'px');
      }
      // to place cursor anywhere in text on click
      span.addEventListener('click', (event: MouseEvent) => {
        let target = <HTMLSpanElement>event.target;
        this.currentLine = <HTMLDivElement>target.parentElement;
        if (this.renderer.nextSibling) {
          this.renderer.insertBefore(
            this.currentLine, this.cursor, this.renderer.nextSibling(event.target)
          );
        } else {
          this.renderer.appendChild(
            this.currentLine, this.cursor
          );
        }
      })
      return span;
    },

    appendToEditor: (elem: HTMLElement) => {
      this.editor.nativeElement.appendChild(elem);
    },

    appendToParent: (parent: HTMLElement, child: Node): HTMLElement => {
      parent.appendChild(child);
      return parent;
    }

  };

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    new Array(10).fill(0).forEach((arrayElem, index) => {
      this.fonts.push(index + 20);
    });
    new Array(8).fill(0).forEach((arrayElem, index) => {
      this.speed.push(index * 5 + 20);
    });

    // Observable.fromEvent(window, 'keydown')
      // .throttleTime(300)
      // .subscribe(event => console.log.bind(console));

    this.currentLine = this.DOMMethods.createDiv();
    this.cursor = this.DOMMethods.returnCursor();
    this.DOMMethods.appendToEditor(
      this.DOMMethods.appendToParent(
        this.currentLine, this.cursor
      )
    );
  }

  fontSelect(value) {
    this.selectedFont = +value;
    this.cursor.style.height = this.selectedFont + this.TEXT_PADDING + 'px';
    this.cursor.style.fontSize = this.selectedFont + 'px';
  }

  mapData() {
    let gp: HTMLDivElement = this.editor.nativeElement;
    console.log(gp);
    let parents: HTMLCollection = gp.children;
    console.log(parents);
    let children: HTMLCollection;
    let span: HTMLSpanElement;
    for (let index = 0; index < parents.length; index++) {
      children = parents[index].children;
      this.data[index] = [];
      console.log('loop ', index, ' : ', children);
      for (let i = 0; i < children.length; i++) {
        span = <HTMLSpanElement>children[i];
        if (span.classList.contains('blinking')) {
          continue;
        }
        this.data[index][i] = {
          text: span.innerText,
          font: parseInt(span.style.fontSize)
        };
      }
    }
    console.log(this.data);
    this.fullScreen.emit(this.data);
  }


}
