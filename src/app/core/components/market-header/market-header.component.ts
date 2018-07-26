import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'eb-market-header',
  templateUrl: './market-header.component.html',
  styleUrls: ['./market-header.component.scss']
})
export class MarketHeaderComponent {
  public buyId: string;
}
