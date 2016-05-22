const THREE = require('three');

module.exports = {
	toRad: function(deg) {
		return deg * Math.PI / 180;
	},

	makeTextSprite: makeTextSprite
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
