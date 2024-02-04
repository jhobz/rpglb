import { Component, Input, OnInit } from '@angular/core'
import { SpeedrunEvent } from '../speedrun-event.service'

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input() srEvent: SpeedrunEvent

  constructor() { }

  ngOnInit() {
  }

}
