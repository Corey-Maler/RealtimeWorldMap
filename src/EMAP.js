const d 			= require('debug')('EMAP');
const THREE 		= require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const g 			= require('./geodesic');
const makeTextSprite = require('./tools').makeTextSprite;

class EMAP {
	constructor(DOM, _options) {
		const options = _options || {};
		this.DOM = DOM;
		this.Planet = options.Planet || require('./Earth');
		this.rate = 10 / this.Planet.radius;

		this.w = DOM.offsetWidth;
		this.h = DOM.offsetHeight;

		this.initRender();
		this.initControls();
		this.initPlanet();
		this.initLight();

		this.render = this.render.bind(this);

		d(this);
	}

	initRender() {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.w, this.h);
		this.DOM.appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0xf5f1f1, 1);

		this.camera = new THREE.PerspectiveCamera( 75, this.w / this.h, 1, 10000 );
		this.camera.position.x = this.Planet.radius * this.rate * 0.6;
		this.camera.position.y = this.Planet.radius * this.rate * 1.4;
		this.camera.position.z = this.Planet.radius * this.rate * 0.9;
		this.camera.lookAt(new THREE.Vector3(0, this.Planet.radius * this.rate * 1, 0));
		this.scene.add(this.camera);
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableZoom = false;
		this.controls.enablePan = false;
	}

	initPlanet() {
		this.planet = new this.Planet;
		this.planet.mesh.scale.set(this.rate, this.rate, this.rate);

		this.scene.add(this.planet.mesh);
	}

	initLight() {
		this.light = new THREE.PointLight(0xffffff, 0.1, 0);
		this.light.position.set(-10, 10, 5);
		this.scene.add(this.light);


		this.ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
		this.scene.add(this.ambientLight);
	}

	render() {
		requestAnimationFrame(this.render);
		this.renderer.render(this.scene, this.camera );
	}

	start() {
		this.render();
	}


	addObject(obj) {
		// point
		obj.render();
		obj.mesh.scale.set(this.rate, this.rate, this.rate);
		this.scene.add(obj.mesh);
	}
}

module.exports = EMAP;