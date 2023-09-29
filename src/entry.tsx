import THREE from 'three';
import { Mirror } from './mirror';
import "./waterShader";
import debug from 'debug';

import * as tools from './tools';
import g from './geodesic';
import { Earth as Planet } from './Earth';

import ShipLowPoly from './shipLowPoly.json';

import { EMAP } from './EMAP';

// import { Body } from './body';	

console.log('ship', ShipLowPoly);

g.planet = Planet ;

(window as any).debug = debug;
(window as any).tools = tools;

// Body.Planet = Planet;

const d = debug('app');


const DOM = document.getElementById('Content');

const eMAP = new EMAP(DOM, {devMode: 'd1'});

eMAP.start();

// const ship1 = new Body({
// 	pos: 0.3,
// 	// modelJsonPath: 'shipLowPoly.json',
// 	modelJson: ShipLowPoly,
// 	sizeX: 10000,
// 	name: 'Victorya',
// 	props: ['speed: 86 mp/h', 'course: 312N'],
// 	path: [
// 		g.fromLLd(-130, 89.99, 30000),
// 		g.fromLLd(-140, 80, 30000),
// 		g.fromLLd(-150, 60, 50000),
// 		g.fromLLd(-140, 30, 50000),
// 		g.fromLLd(-80, -10, 50000)
// 	]
// });

// ship1.showModel();

// eMAP.addObject(ship1);

export const Entry = () => {
	return <div>world</div>
}