import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ToastController } from '@ionic/angular/standalone';
import { NgIf } from "@angular/common";
import { Geolocation } from "@capacitor/geolocation";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../environments/firebase-config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, NgIf],
})
export class HomePage {
  latitude: number | null = null;
  longitude: number | null = null;
  db: any;

  constructor(private toastController: ToastController) {
    // Inicializar Firebase solo una vez
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

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


      // Crear link de ubicación
      const link = `https://maps.google.com/?q=${this.latitude},${this.longitude}`;

      // Guardar en Firestore
      await addDoc(collection(this.db, 'ubicaciones'), {
        identificador: 'ariel-catucuamba',
        nombre: 'Ariel Catucuamba',
        link: link,
        lat: this.latitude,
        lng: this.longitude,
        fecha: new Date()
      });

      // Mostrar mensaje de éxito
      const toast = await this.toastController.create({
        message: '¡Coordenadas enviadas correctamente!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      // Abrir Google Maps en la ubicación actual
      const url = `geo:${this.latitude},${this.longitude}?q=${this.latitude},${this.longitude}`;
      window.open(url, '_system');// Usa Capacitor Browser para máxima compatibilidad
    } catch (error) {
      console.error("No se puede obtener la ubicacion o guardar en Firebase", error)
    }
  }
}