import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookmark,
  bookmarkOutline,
  chatbubbleOutline,
  chatbubblesOutline,
  heartOutline,
  logOutOutline,
  logoGoogle,
  sendOutline,
} from 'ionicons/icons';
import { SocialStore } from './store/social.store';

@Component({
    selector: 'app-root',
    imports: [IonApp, IonRouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly store = inject(SocialStore);

  constructor() {
    addIcons({
      bookmark,
      bookmarkOutline,
      chatbubbleOutline,
      chatbubblesOutline,
      heartOutline,
      logOutOutline,
      logoGoogle,
      sendOutline,
    });
  }

  ngOnInit(): void {
    this.store.hydrate();
  }
}
