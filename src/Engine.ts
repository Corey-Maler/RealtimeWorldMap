import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Earth, Planet } from './Earth';

export type DevMode = 'd0' | 'd1' | 'd2';

export interface EngineOptions {
	planet?: Planet;
	devMode?: DevMode;
	clearColor?: THREE.ColorRepresentation;
}

export class Engine {
  private w: number;
  private h: number;
  private planet: Planet;
  /**
   * Due to float32 precision,
   * it is impossible to render Earth in whole scale
   * while also being able to render 10m objects.
   * 
   * To make it possible to "zoom" into small objects
   * And show planet on the background
   * Instead of operating in true scale,
   * Planed is scaled down and everything moved closer to center proportionally
   * That keeps illusion (and, also, correct scale) of having big planet in the background
   * of the small object in the foreground
   */
  private rate: number;

  private camera: THREE.Camera;
  private scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls | undefined;
  private light: THREE.PointLight | undefined;
  private ambientLight: THREE.AmbientLight | undefined;

  constructor(private DOM: HTMLElement, _options: EngineOptions) {

    const options = _options || {};
    this.DOM = DOM;
    this.planet = options.planet ??  new Earth(); // new SmallRedPlanet();
    // this.rate = 100000 / this.planet.radius;
	this.rate = 0.000001;


    this.w = DOM.offsetWidth;
    this.h = DOM.offsetHeight;

    this.render = this.render.bind(this);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true /* logarithmicDepthBuffer: true */,
    });
    this.renderer.setSize(this.w, this.h);
    this.DOM.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(options.clearColor ?? 0xf5f1f1, 1);
    this.renderer.autoClear = false;

    this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.01, 1000);
    this.camera.position.x = this.planet.radius * this.rate * 0.6;
    this.camera.position.y = this.planet.radius * this.rate * 1.4;
    this.camera.position.z = this.planet.radius * this.rate * 0.9;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.initControls();
    this.initPlanet();
    this.initLight();
  }

  initControls() {
	if (!this.renderer || !this.camera) {
		throw new Error('initControls: no renderer or camera');
	}
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 9;
    this.controls.maxDistance = 15;
    //this.controls.enableZoom = false;
    this.controls.enablePan = false;
  }

  initPlanet() {
    this.planet.mesh.scale.set(this.rate, this.rate, this.rate);

    this.scene.add(this.planet.mesh);
  }

  initLight() {
    this.light = new THREE.PointLight(0xffffff, 14000, 0);
    this.light.position.set(
      -2 * this.planet.radius * this.rate,
      10 * this.planet.radius * this.rate,
      5 * this.planet.radius * this.rate
    );
    this.scene.add(this.light);

    this.ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    this.scene.add(this.ambientLight);
  }

  render() {
    requestAnimationFrame(this.render);

    const renderer = this.renderer;
    renderer.clear();
	renderer.render(this.scene, this.camera);
  }


  start() {
    this.render();
  }
}
