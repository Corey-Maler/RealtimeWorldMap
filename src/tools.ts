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

	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', '256');
	canvas.setAttribute('height', '64');
	var context = canvas.getContext('2d')!;
	context.font = `${fontsize}px ${fontface}`;
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
