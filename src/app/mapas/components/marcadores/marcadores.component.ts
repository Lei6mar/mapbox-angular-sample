import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { element } from 'protractor';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container{
      height: 100%;
      width: 100;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index:100;
    }
    li{
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-100.32142817717909, 25.67585623635041];

  //arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-100.32142817717909, 25.67585623635041],
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();


    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola mundo';

    // new mapboxgl.Marker(
    //   //  {element: markerHtml}
    // )
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);
  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker(
      {
        draggable: true,
        color
      }
    )
      .setLngLat(this.center)
      .addTo(this.mapa);
    this.marcadores.push({color, marker: nuevoMarcador});
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    })

  }

  irMarcador(marcador: mapboxgl.LngLat) { 
    this.mapa.flyTo({
      center: marcador
    })

  }

  guardarMarcadoresLocalStorage(){
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach(m => {
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();
      lngLatArr.push({
        color: color,
        center: [lng, lat]
      })
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }
    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(element => {
      const newMarker = new mapboxgl.Marker({
        color: element.color,
        draggable: true
      }).setLngLat(element.center!).addTo(this.mapa);
      this.marcadores.push({
        marker: newMarker,
        color: element.color
      })


      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      })

    });
    
  }

  borrarMarcador(i: number){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }

}
