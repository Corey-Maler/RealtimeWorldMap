const d 			= require('debug')('EMAP');
const THREE 		= require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const g 			= require('./geodesic');
const {makeTextSprite, interpolate} = require('./tools');

const fontDraw = require('./Draw3DText');

console.log('THREE.TextGeometry', THREE.TextGeometry);

class EMAP {
	constructor(DOM, _options) {

		fontDraw.loading.then(() => {

		});

		const options = _options || {};
		this.DOM = DOM;
		this.Planet = options.Planet || require('./Earth');
		this.rate = 100 / this.Planet.radius;
		this.objs = [];
		this.t = 0;

		this.devMode = options.devMode || 'd1';

		this.w = DOM.offsetWidth;
		this.h = DOM.offsetHeight;

		this._cameraPathT = null;
		this.__lookAtPathT = null
		this.__north = g.fromLLd(0, 90, 1000000);

		this.initRender();
		this.initControls();
		this.initPlanet();
		this.initLight();

		this.render = this.render.bind(this);

		this.initHelpers();
	}

	initRender() {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
		this.renderer.setSize(this.w, this.h);
		this.DOM.appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0xf5f1f1, 1);
		this.renderer.autoClear = false;

		this.center = new THREE.Vector3(0, 0, 0);
		this.__lookAt = this.center;
		this.__cameraUp = this.__north;

		this.camera = new THREE.PerspectiveCamera( 75, this.w / this.h, 0.1, 10000 );
		this.camera.position.x = this.Planet.radius * this.rate * 0.6;
		this.camera.position.y = this.Planet.radius * this.rate * 1.4;
		this.camera.position.z = this.Planet.radius * this.rate * 0.9;
		//this.camera.lookAt(new THREE.Vector3(0, this.Planet.radius * this.rate * 1, 0));
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);

		this._helpers = new THREE.Group();
		this.scene.add(this._helpers);
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		//this.controls.enableZoom = false;
		//this.controls.enablePan = false;
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

		this.update();

		this['render_' + this.devMode]();

	}

	render_d0() {
		this._helpers.visible = false;
		const renderer = this.renderer;
		renderer.clear();
		renderer.setViewport( 0, 0, this.w, this.h );
		this.renderer.render(this.scene, this.fakeCamera );
	}

	render_d1() {

		this._helpers.visible = true;
		const renderer = this.renderer;
		renderer.clear();
		renderer.setViewport( 0, 0, this.w, this.h );
		this.renderer.render(this.scene, this.camera );

		
		this._helpers.visible = false;
		renderer.setViewport(0, 0, this.w * 0.25, this.h * 0.25);
		renderer.render( this.scene, this.fakeCamera );
	}

	render_d2() {

		const renderer = this.renderer;
		renderer.clear();
		this._helpers.visible = false;
		renderer.setViewport(0, 0, this.w, this.h);
		renderer.render(this.scene, this.fakeCamera);

		this._helpers.visible = true;
		renderer.setViewport( 0, 0, this.w * 0.25, this.h * 0.25);
		this.renderer.render(this.scene, this.camera);		
	}

	update() {
		const t = 0;
		this.t += 0.01;
		//this.objs.forEach(obj => obj.update(t));

		const target = this.target || this.center;

		if (this._cameraPathT !== null) {
			const p = this._cameraPath.getPoint(this._cameraPathT);
			this.fakeCamera.position.copy(p);



			let tt = this._cameraPathT;

			tt += (1 - tt) / 50;

			this._cameraPathT = tt;
			
			if (this._cameraPathT > 0.9999999) {
				this._cameraPathT = null;
			}
		} else {
			if (this.target) {
				const p = target.getNearCameraPosition();
				
				this.fakeCamera.position.copy(p);

				const da = target.getPosition().multiplyScalar(this.rate);

				this.ch.update();
			}
		}

		if (this.__lookAtPathT !== null) {
			const da = this.__lookAtPath.getPoint(this.__lookAtPathT);
			const up = this.__cameraUpPath.getPoint(this.__lookAtPathT);

			//this.__lookAtPathT += 0.05;

			let tt = this.__lookAtPathT;
			tt += (1 - tt) / 10;

			this.__lookAtPathT = tt;

			this.__lookAt = da;
			this.__cameraUp = up;
			
			if (this.__lookAtPathT > 1.001) {
				this.__lookAtPathT = null;
			}
		}

		this.fakeCamera.up.copy(this.__cameraUp);
		this.fakeCamera.lookAt(this.__lookAt);	

		const dist = this.__lookAt.distanceTo(this.fakeCamera.position);


		this.fakeCamera.near = dist * 0.1;
		this.fakeCamera.far = dist * 1000;
		this.fakeCamera.updateProjectionMatrix();


	}

	start() {
		this.render();
	}

	addObject(obj) {
		// point
		obj.render(this);
		obj.mesh.scale.set(this.rate, this.rate, this.rate);
		this.objs.push(obj);
		this.scene.add(obj.mesh);
	}



	initHelpers() {
		const axisHelper = new THREE.AxisHelper( this.Planet.radius * this.rate * 1.2 );
		this._helpers.add( axisHelper );

		const fakeCamera = new THREE.PerspectiveCamera( 75, this.w / this.h, 1, 10000 );
		this.fakeCamera = fakeCamera;
		const cam = new g.fromLLd(30, 40, 100000);
		cam.multiplyScalar(this.rate);
		this.fakeCamera.position.copy(cam);

		const ch = new THREE.CameraHelper(fakeCamera);
		this._helpers.add(ch);
		this.ch = ch;

		this.scene.add(fakeCamera);
	}

	_arrow(p, h) {
		var origin = new THREE.Vector3( 0, 0, 0 );
		var length = p.length();

		var arrowHelper = new THREE.ArrowHelper(p.clone().normalize(), origin, length, h );
		this._helpers.add( arrowHelper );

		return arrowHelper;
	}

	_line(path, color = 0x666666) {
		const geometry = new THREE.Geometry();
		path.forEach(p =>
			geometry.vertices.push(p)
		)
		const material = new THREE.LineBasicMaterial( { color, opacity: 1, linewidth: 1} );

		const line = new THREE.Line(geometry,  material);
		this._helpers.add(line);
	}

	lookNear(body) {
		this.target = body;

		const p = body.getNearCameraPosition();
		d('cam pos', p);

		const da = body.getPosition().multiplyScalar(this.rate);

		this.controls.target.copy(da);

		console.log('DIST', Math.sqrt((p.x - da.x) * (p.x - da.x) + (p.y - da.y) * (p.y - da.y) + (p.z - da.z) * (p.z - da.z)));

		this._arrow(da, 0xff0000);

		const up = g.fromLL(p.long, p.lat, p.h + 1000);

		const PATH = interpolate([g.fromV(this.fakeCamera.position), p], this.rate);

		this._cameraPathT = 0;
		this._cameraPath = new THREE.SplineCurve3(PATH);

		this.__lookAtPath = new THREE.SplineCurve3([this.__lookAt, da]);
		this.__cameraUpPath = new THREE.SplineCurve3([this.__cameraUp, up]);
		this.__lookAtPathT = 0;

		/*
		
		this.fakeCamera.near = 0.001;
		this.fakeCamera.far = 100;
		this.fakeCamera.updateProjectionMatrix();
		*/
		

	}

	lookFar() {
		this.target = null;
		this._cameraPathT = 0;
		const moveTo = new g.fromLLd(-30, 40, 10000000);
		moveTo.multiplyScalar(this.rate)
		const PATH = interpolate([g.fromV(this.fakeCamera.position), g.fromV(moveTo)], this.rate);
		d('camera PATH', moveTo, PATH);
		this._line(PATH, 0x0000ff)
		this._cameraPath = new THREE.SplineCurve3(PATH);

		this.__lookAtPath = new THREE.SplineCurve3([this.__lookAt, this.center]);
		this.__cameraUpPath = new THREE.SplineCurve3([this.__cameraUp, this.__north]);
		this.__lookAtPathT = 0;

		this.fakeCamera.near = 1;
		this.fakeCamera.far = 10000;
		this.fakeCamera.updateProjectionMatrix();
	}
}

module.exports = EMAP;