import * as THREE from 'three';

import { makeTextSprite } from './tools';
import { GeoPoint } from './GeoPoint';

import world from 'earth-topojson/110m.json';
import * as topojson from 'topojson';

export abstract class Planet {
  public abstract get radius(): number;
  public mesh: THREE.Group = new THREE.Group();
  protected drawPlanet() {
	const geometry = new THREE.SphereGeometry(this.radius, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0.075,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = new THREE.Group();
    this.mesh.add(mesh);
  }
}

export class PointOfInterest {
  public readonly position: GeoPoint;
  constructor(
    public readonly lat: number,
    public readonly long: number,
    public readonly name: string
  ) {
    this.position = GeoPoint.fromLLd(long, lat, 10000);
  }
}

export class City extends PointOfInterest {
  public readonly poiType = 'city';
  constructor(lat: number, long: number, name: string) {
    super(lat, long, name);
  }
}

export class Earth extends Planet {
  private countryOutlineMaterial = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
  });
  public get radius(): number {
    return 6731000;
  }
  constructor() {
    super();

	this.drawPlanet();

    for (const city of Earth.cities) {
      this.drawPointOfInterest(city);
    }

    this.drawCountriesOutlines();
  }

  drawPointOfInterest(poi: PointOfInterest) {
    const dotGeometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([0, 0, 0]);
    dotGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );
    const dotMaterial = new THREE.PointsMaterial({
      size: 5,
      color: 0x333333,
      sizeAttenuation: false,
    });
    const dot = new THREE.Points(dotGeometry, dotMaterial);
    dot.position.x = poi.position.x;
    dot.position.y = poi.position.y;
    dot.position.z = poi.position.z;
    this.mesh.add(dot);

    const lPos = GeoPoint.fromLLd(poi.long, poi.lat, 200000);

    const cityNameSprite = makeTextSprite(poi.name, {
      fontsize: 14,
    });
    cityNameSprite.position.x = lPos.x;
    cityNameSprite.position.y = lPos.y;
    cityNameSprite.position.z = lPos.z;
    const scaleRate = 0.001;
    cityNameSprite.scale.set(
      256 * this.radius * scaleRate,
      64 * this.radius * scaleRate,
      1
    );
    this.mesh.add(cityNameSprite);
  }

  private drawCountriesOutlines() {
    // types are wrong, but it works
    // good enough for now, but must be adjusted in the future
    const TopoJsonCountriesData = topojson.feature(
      world as any,
      world.objects.countries as any
    ) as any;

    for (const country of TopoJsonCountriesData.features) {
      this.drawCountry(country);
    }
  }

  private addCountryGeometry(borderGeometry: Array<[number, number]>) {
    const points = borderGeometry.flatMap((p: [number, number]) => {
      const g = GeoPoint.fromLLd(p[0], p[1], 10000);
      return [g.x, g.y, g.z];
    });

    const modelGeometry = new THREE.BufferGeometry();

    modelGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(points), 3)
    );

    const borderOutline = new THREE.Line(
      modelGeometry,
      this.countryOutlineMaterial
    );
    this.mesh.add(borderOutline);
  }

  private drawCountry(country: any) {
    for (let i in country.geometry.coordinates) {
      if (country.geometry.type != 'Polygon') {
        for (const part of country.geometry.coordinates) {
          // not sure why API returns array with the only one object inside
          this.addCountryGeometry(part[0]);
        }
      } else {
        const geom = country.geometry.coordinates[i] as Array<[number, number]>;
        this.addCountryGeometry(geom);
      }
    }
  }

  static cities: PointOfInterest[] = [
    new City(59.32, 8.06, 'Stockholm'),
    new City(40.42, -74.0, 'New York'),
    new City(51.3, 0.0, 'London'),
    new City(35.41, 139.41, 'Tokyo'),
    new City(-34.6, -58.06, 'Buenos Aires'),
    new City(-33.55, 18.06, 'Cape Town'),
  ];
}
