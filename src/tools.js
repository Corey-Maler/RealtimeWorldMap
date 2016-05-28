const THREE = require('three');
const d = require('debug')('app');
const g = require('./geodesic');

module.exports = {
	toRad: function(deg) {
		return deg * Math.PI / 180;
	},

	makeTextSprite: makeTextSprite,
	interpolate: interpolate,
	km: km
}

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = 24;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	const color = parameters.hasOwnProperty('color') ?
    	parameters['color'] : 'rgba(0, 0, 0, 1.0)';

	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', 256);
	canvas.setAttribute('height', 64);
	var context = canvas.getContext('2d');
	context.font = "24px sans-serif";
	context.textAlign = 'center';
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	
	//roundRect(context, 0, 0, 256, 64, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = color; //"rgba(0, 0, 0, 1.0)";
	context.fillText( message, 128, 24);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial({map: texture});

	var sprite = new THREE.Sprite(spriteMaterial);
	//sprite.position.normalize();
	sprite.scale.set(256,64,1);
	return sprite;	
}
// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

function km(x) {
	return 1000 * x;
}

function interpolate(arr, rate = 1) {
	//d('interpolate', arr);
	let i = 0;
	const max = km(1000) * rate;
	const ls = arr.length;
	while (i < arr.length - 1) {
		const cur = arr[i]; 
		const next = arr[i + 1];

		// TODO: OMG, refactor this
		const dist = cur.distanceTo(next);
		if (dist > max) {
			//d('dist', dist, cur, next);
			//v0 + t * (v1 - v0);
			const t = max / dist;
			//d('>', t);
			const V = new THREE.Vector3();
			V.subVectors(next, cur);
			V.multiplyScalar(t);
			V.add(cur);
			const dd = new g(V.x, V.y, V.z);
			const h = cur.h + t * (next.h - cur.h);
			V.h = h;
			arr.splice(i + 1, 0, g.fromLL(dd.long, dd.lat, h));
			//arr.splice(i + 1, 0, V);
			//d('int h', h, dd, g.fromLL(dd.long, dd.lat, h))
		}

		i++;
		if (i > ls * 50) break;
	}

	d('int result', arr);
	return arr;
}
