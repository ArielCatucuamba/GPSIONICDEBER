import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { NgIf } from "@angular/common";
import { Geolocation } from "@capacitor/geolocation";
import { Browser } from '@capacitor/browser'; // Agrega esta línea

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, NgIf],
})
export class HomePage {
  latitude: number | null = null;
  longitude: number | null = null;

  constructor() { }

  async getCurrentLocation() {

    try {
      const coordinates = await Geolocation.getCurrentPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;


      // Abrir Google Maps en la ubicación actual
      const url = `geo:${this.latitude},${this.longitude}?q=${this.latitude},${this.longitude}`;
      window.open(url, '_system');// Usa Capacitor Browser para máxima compatibilidad
    } catch (error) {
      console.error("No se puede obtener la ubicacion", error)
    }
  }
}