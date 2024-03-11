import { Component, OnInit } from '@angular/core'
import { siBluesky, siDiscord, siInstagram, siTwitch, siX, siYoutube } from 'simple-icons'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  icons: {
    bluesky: string,
    discord: string,
    instagram: string,
    twitch: string,
    twitter: string,
    youtube: string,
  }

  constructor() { }

  ngOnInit() {
    this.icons = {
      bluesky: siBluesky.svg,
      discord: siDiscord.svg,
      instagram: siInstagram.svg,
      twitch: siTwitch.svg,
      twitter: siX.svg,
      youtube: siYoutube.svg
    }
  }

}
