import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }
  
  ngOnInit(): void {

    let pop_ups:Array<any>=[{
    type: 'Feature',
    properties: {
        description:'<strong>Titulo 1</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
        },
    geometry: {
        'type': 'Point',
        'coordinates': [-76.534, 3.410]
        },
    },{
    type: 'Feature',
    properties: {
        description: '<strong>Titulo 3</strong><p>Head to Lounge Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a> 8:00-11:00 p.m. $10 general admission.</p>',
        },
    geometry: {
        type: 'Point',
        coordinates: [-76.540, 3.479]
        }
    },{
    type: 'Feature',
    properties: {
        description: '<strong>Titulo 3</strong><p>Head to Lounge Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a> 8:00-11:00 p.m. $10 general admission.</p>',
        },
    geometry: {
        type: 'Point',
        coordinates: [-76.512, 3.392]
        }
}];

    let map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoibWF0aXVoIiwiYSI6ImNrdndpaXZyMjFoZDkyb3FmOXVicnQ5YmQifQ.xiy73zgXtAgTdPzI0L903g',
      container: 'maap',
      style: 'mapbox://styles/matiuh/ckw6m6alp014i15rz8441kwb6',
      center: [-76.512, 3.429],  
      zoom: 11.09
    });

    // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/
    map.on('load', () => {
      map.addSource('places', {
      // This GeoJSON contains features that include an "icon"
      // property. The value of the "icon" property corresponds
      // to an image in the Mapbox Streets style's sprite.
      'type': 'geojson',
      'data': {
      'type': 'FeatureCollection',
      'features': pop_ups,
      }});

      map.loadImage(
        'assets/point.png',
        function(error:any, image:any){
        if (error) throw error;
         
        // Add the image to the map style.
        map.addImage('pointer', image);

        // Add a layer showing the places.
        map.addLayer({
          'id': 'places',
          'type': 'symbol',
          'source': 'places',
          'layout': {
            'icon-size': 0.03,
            'icon-image': 'pointer',
            'icon-allow-overlap': true,
          }
        });
        })
        
      // Center the map on the coordinates of any clicked circle from the 'circle' layer.
      map.on('click', 'places', (e:any) => {
        map.flyTo({
        center: e.features[0].geometry.coordinates
        });
      });
      
      // Create a popup, but don't add it to the map yet.
      const pop_up = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.on('click', 'places', (e:any) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
         
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
         
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        // Populate the popup and set its coordinates
        // based on the feature found.
        pop_up.setLngLat(coordinates).setHTML(description).addTo(map);
        
        });
       
    });
  }
}
