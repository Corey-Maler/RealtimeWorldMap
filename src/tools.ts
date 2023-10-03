import * as THREE from 'three';

export interface MakeTextSpriteOptions {
	fontface?: string;
	fontsize?: number;
	color?: string;
}

export function makeTextSprite( message: string, parameters: MakeTextSpriteOptions = {} )
{
	const {
		fontface = 'Arial',
		fontsize = 24,
		color = 'rgba(0, 0, 0, 1.0)',
	} = parameters;
	// var fontface = parameters.hasOwnProperty("fontface") ? 
		// parameters["fontface"] : "Arial";
	
	// var fontsize = 24;
	
	// var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
	// 	parameters["borderThickness"] : 4;
	
	// var borderColor = parameters.hasOwnProperty("borderColor") ?
	// 	parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	// var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
	// 	parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	// const color = parameters.hasOwnProperty('color') ?
    // 	parameters['color'] : 'rgba(0, 0, 0, 1.0)';

	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', '256');
	canvas.setAttribute('height', '64');
	var context = canvas.getContext('2d')!;
	context.font = `${fontsize}px ${fontface}`;//"24px sans-serif";
	context.textAlign = 'center';
    
	context.fillStyle = color; 
	context.fillText( message, 128, 24);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial({map: texture});

	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(256,64,1);
	return sprite;	
}


export function km(x: number) {
	return 1000 * x;
}
