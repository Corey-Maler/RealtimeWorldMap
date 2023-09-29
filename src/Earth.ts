import * as THREE from 'three';
import { CircleGeometry, LineDashedMaterial } from 'three';

// const THREE = require('three');
import { makeTextSprite, toRad } from './tools';
import g from './geodesic';

import world from 'earth-topojson/110m.json';
import * as topojson from 'topojson';

var countries = topojson.feature(world, world.objects.countries);

const countrs = countries.features;

//d('eath', countrs);

export class Earth {
  constructor() {
    const geometry = new THREE.SphereGeometry(Earth.radius, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0.075,
      ambientIntensity: 1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = new THREE.Group();
    this.mesh.add(mesh);

    this.drawGuides();

    for (let i in Earth.cities) {
      const a = Earth.cities[i];
      const city = {
        pos: g.fromLL(a.long, a.lat, 10000),
        name: a.name,
      };
      this.drawCity(city);
    }

    /*
		for (let i = -9; i < 10; i++) {
			this.drawCity({
				pos: g.fromLLd(20 * i, 20, 10000),
				//pos: g.fromLLd(0, 0, 10000),
				name: 'asd'
			});
	    }
	    */

    for (let i in countrs) {
      //if (countrs[i].properties.name == 'Russia')
      this.drawCountries(countrs[i]);
    }
  }

  drawGuides() {
    const radius = Earth.radius * 1.001,
      segments = 64,
      material = new LineDashedMaterial({
        color: 0xcfcfcf,
        linewidth: 2,
        dashSize: Earth.radius * 0.1,
        gapSize: Earth.radius * 0.01,
      }),
      geometry = new CircleGeometry(radius, segments, toRad(-100), toRad(350));

    // Remove center vertex
    // geometry.vertices.shift();

    const eqMesh = new THREE.Line(geometry, material);
    eqMesh.rotation.x = Math.PI / 2;

    // geometry.computeLineDistances();

    this.mesh.add(eqMesh);

    const geometryM = new THREE.CircleGeometry(
      radius,
      segments,
      toRad(-10),
      toRad(350)
    );
    const meredian = new THREE.Line(geometryM, material);
    this.mesh.add(meredian);

    const meredian180 = new THREE.Line(geometryM, material);
    this.mesh.add(meredian180);
    meredian180.rotation.y = Math.PI / 2;
  }

  drawCity(city) {
    return;
    const dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    const dotMaterial = new THREE.PointsMaterial({
      size: 5,
      color: 0x333333,
      sizeAttenuation: false,
    });
    const dot = new THREE.Points(dotGeometry, dotMaterial);
    dot.position.x = city.pos.x;
    dot.position.y = city.pos.y;
    dot.position.z = city.pos.z;
    this.mesh.add(dot);

    const lPos = g.fromLL(city.pos.long, city.pos.lat, 500000);

    var spritey = makeTextSprite(city.name, {
      fontsize: 24,
      borderColor: { r: 255, g: 0, b: 0, a: 1.0 },
      backgroundColor: { r: 255, g: 100, b: 100, a: 0.8 },
    });
    spritey.position.x = lPos.x;
    spritey.position.y = lPos.y;
    spritey.position.z = lPos.z;
    const scaleRate = 0.002;
    spritey.scale.set(
      256 * Earth.radius * scaleRate,
      64 * Earth.radius * scaleRate,
      1
    );
    this.mesh.add(spritey);
  }

  drawCountries(country) {
    //const geom = country.geometry.coordinates[0];
    //d('country', country);
    //console.log(country.properties.name)

    var material = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
    });

    for (let i in country.geometry.coordinates) {
      if (country.geometry.type != 'Polygon') {
        const geom = country.geometry.coordinates[i][0];
        const points = geom.map((p) => g.fromLLd(p[0], p[1], 10000));
        var geometry = new THREE.BufferGeometry();
        /*
		    	for (let j in geom) {
		    		const point = geom[j];
		    		geometry.vertices.push(g.fromLLd(point[0], point[1], 10000));
		    	}
				*/

        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array(points), 3)
        );

        var line = new THREE.Line(geometry, material);
        this.mesh.add(line);
      } else {
        const geom = country.geometry.coordinates[i];
        // var geometry = new THREE.Geometry();

        const points = geom.map((p) => g.fromLLd(p[0], p[1], 10000));
        var geometry = new THREE.BufferGeometry();
        // for (let j in geom) {
        //   const point = geom[j];
        //   geometry.vertices.push(g.fromLLd(point[0], point[1], 10000));
        // }

        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array(points), 3)
        );

        var line = new THREE.Line(geometry, material);
        this.mesh.add(line);
      }
    }
  }
}

Earth.radius = 6731000;

Earth.cities = [
  { lat: toRad(55, 45), long: toRad(37, 37), name: 'Moscow' },
  { lat: toRad(40, 42), long: toRad(-74, 0), name: 'New York' },
  { lat: toRad(51, 30), long: toRad(0, 0), name: 'London' },
  { lat: toRad(35, 41), long: toRad(139, 41), name: 'Tokyo' },
];
