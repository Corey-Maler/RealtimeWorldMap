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

		this.initHelpers();
	}

	initRender() {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.w, this.h);
		this.DOM.appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0xf5f1f1, 1);

		this.camera = new THREE.PerspectiveCamera( 75, this.w / this.h, 0.1, 1000 );
		this.camera.position.x = this.Planet.radius * this.rate * 0.6;
		this.camera.position.y = this.Planet.radius * this.rate * 1.4;
		this.camera.position.z = this.Planet.radius * this.rate * 0.9;
		//this.camera.lookAt(new THREE.Vector3(0, this.Planet.radius * this.rate * 1, 0));
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		//this.controls.enableZoom = false;
		//this.controls.enablePan = false;
	}

	initPlanet() {
		this.planet = new this.Planet;
		this.planet.mesh.scale.set(this.rate, this.rate, this.rate);

		//this.scene.add(this.planet.mesh);
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

	initHelpers() {
		const axisHelper = new THREE.AxisHelper( this.Planet.radius * this.rate * 1.2 );
		this.scene.add( axisHelper );

		const fakeCamera = new THREE.PerspectiveCamera( 75, this.w / this.h, 1, 10000 );
		this.fakeCamera = fakeCamera;

		const ch = new THREE.CameraHelper(fakeCamera);
		this.scene.add(ch);
		this.ch = ch;

		this.scene.add(fakeCamera);
	}

	_arrow(p, h) {
		var origin = new THREE.Vector3( 0, 0, 0 );
		var length = p.length();

		var arrowHelper = new THREE.ArrowHelper(p.clone().normalize(), origin, length, h );
		this.scene.add( arrowHelper );
	}

	lookNear(body) {
		const p = body.getNearCameraPosition();
		d('cam pos', p);
		
		this.fakeCamera.position.copy(p);

		const da = body.getPosition().multiplyScalar(this.rate);

		
		this._arrow(p, 0x00ff00);

		const lPos = g.fromLL(p.long, p.lat, p.h + 1000);
		this._arrow(lPos, 0x000000);
		this.fakeCamera.up.copy(lPos);

				this.fakeCamera.lookAt(da);

		this._arrow(da, 0xff0000);

		this.ch.update();
	}
}

module.exports = EMAP;