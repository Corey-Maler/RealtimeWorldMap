require('./mirror');
require('./waterShader');

const debug = require('debug');
window.debug = debug;
const g = require('./geodesic');
const Planet = require('./Earth');

const EMAP = require('./EMAP');

g.planet = Planet;


const tools = require('./tools');
window.tools = tools;

window.THREE = require('three');

const Body = require('./body');
Body.Planet = Planet;

const d = debug('app');


const DOM = document.getElementById('Content');

const eMAP = new EMAP(DOM, {devMode: 'd1'});

eMAP.start();

const sheep1 = new Body({
	pos: 0.1,
	model: 'shipLowPoly.json',
	sizeX: 10000000,
	name: 'Victorya',
	props: ['speed: 86 mp/h', 'course: 312N'],
	path: [
		g.fromLLd(-130, 80, 30000),
		g.fromLLd(-140, 80, 30000),
		g.fromLLd(-150, 60, 50000),
		g.fromLLd(-140, 30, 50000),
		g.fromLLd(-80, -10, 50000)
	]
});

window.sheep1 = sheep1;
sheep1.showModel();

eMAP.addObject(sheep1);

window.eMAP = eMAP;