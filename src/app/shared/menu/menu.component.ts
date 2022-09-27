import { Component, OnInit } from '@angular/core';

interface MenuItem {
  ruta: string;
  nombre: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
      li{
        cursor: pointer;
      }
    `
  ]
})
export class MenuComponent {
  menuItems: MenuItem[] = [
    {
      ruta: '/mapas/fullscreen',
      nombre: 'fullscreen'
    },
    {
      ruta: '/mapas/zoom-range',
      nombre: 'zoom Range'
    },
    {
      ruta: '/mapas/marcadores',
      nombre: 'marcadores'
    },
    {
      ruta: '/mapas/propiedades',
      nombre: 'propiedades'
    },
  ]
}
