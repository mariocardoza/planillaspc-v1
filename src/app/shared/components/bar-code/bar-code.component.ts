import { Component, OnInit, Input } from '@angular/core';
import JsBarcode from 'jsbarcode';
@Component({
  selector: 'app-bar-code',
  templateUrl: './bar-code.component.html',
  styleUrls: ['./bar-code.component.scss']
})
export class BarCodeComponent implements OnInit {
  @Input() barcode: string;
  constructor() { }

  ngOnInit(): void {
    JsBarcode('#barcode', this.barcode, {
      format: 'CODE128C', // default
      width: 2.3,
      // displayValue: false,
      text:  this.barcode,
      font: 'monospace',
      fontOptions: 'bold',
      lineColor: 'black',
      fontSize: 16,
      // textAlign: 'right',
      // textPosition: 'top',
    });
    
  }

}
