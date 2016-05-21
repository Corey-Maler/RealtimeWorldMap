const debug = require('debug');
window.debug = debug;
const g = require('./geodesic');
const Planet = require('./Earth');
const makeTextSprite = require('./tools').makeTextSprite;

g.planet = Planet;

const tools = require('./tools');
window.tools = tools;

const d = debug('app');

d('Hello world');

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE)

const w = 800;
const h = 650;

const EarthRadius = Planet.radius;
const rate = 10 / EarthRadius;
Planet.rate = rate;


var clock = new THREE.Clock();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, w / h, 1, 10000 );
camera.position.y = EarthRadius * rate * 1;
camera.position.z = EarthRadius * rate * 2;
camera.lookAt(new THREE.Vector3(0, EarthRadius * rate * 0.5, 0));

scene.add(camera);

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(w, h);
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0xf5f1f1, 1);

// temporarry
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;
controls.enablePan = false;

const planet = new Planet;
planet.mesh.scale.set(rate, rate, rate);

scene.add(planet.mesh);


/*
const object = new THREE.AxisHelper( EarthRadius * rate * 1.2 );
				object.position.set( 0, 0, 0 );
				scene.add( object );
*/

// in theory -- it's alwayes behind object
var geometry5 = new THREE.SphereGeometry(10, 22, 22 );
var material5 = new THREE.MeshStandardMaterial( { color: 0x005500, specular: 0x0, shininess: 50 } );
var cube5 = new THREE.Mesh( geometry5, material5 );
cube5.position.z = -10 * rate * EarthRadius;
cube5.position.x = -5 * rate * EarthRadius;
cube5.position.y = 5 * rate * EarthRadius;
camera.add( cube5 );

const g2_pos = g.fromLLd(0, 40, 100);
d('>>>', g2_pos.lat / Math.PI * 180, g2_pos.long / Math.PI * 180);
var geometry1 = new THREE.BoxGeometry(1000 * rate, 1000 * rate, 1000 * rate);
var material1 = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x0, shininess: 50 } );
var cube1 = new THREE.Mesh( geometry1, material1 );
cube1.position.setX(g2_pos.x);
cube1.position.setY(g2_pos.y);
cube1.position.setZ(g2_pos.z);
scene.add( cube1 );

window.sheep = cube1;


var light = new THREE.PointLight( 0xffffff, 0.1, 0 );
light.position.set( -10, 10, 5 );
scene.add( light );

/*
var light1 = new THREE.PointLight( 0x888888, 0.1, 0 );
light1.position.set( 10, -10, 5 );
scene.add( light1 );
*/

var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add(ambientLight);


const LookNear = function(obj) {
 
  const gg = g2_pos.addLL(Math.PI * 8 / 4 , 10000);

  camera.position.x = gg.x;
  camera.position.z = gg.z;
  camera.position.y = gg.y;


  camera.up = obj.position;
  camera.lookAt(obj.position);
};


//LookNear(cube1);

window.LookNear = LookNear;

let aeee = 0;

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );


	//cube.rotation.x += 0.0001;

  /*
  aeee += 0.01;
  const gg = g2_pos.addLL(aeee, 10000);

  camera.position.x = gg.x;
  camera.position.z = gg.z;
  camera.position.y = gg.y;

  camera.up = cube1.position;
  camera.lookAt(cube1.position);
  /* */
}
render();