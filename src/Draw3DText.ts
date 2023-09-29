import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import FontJson from './assets/font.json';

let __font = null;
export const fontLoaded = new Promise(function(resolve, reject) {
	const loader = new FontLoader();
	__font = loader.parse(FontJson)
	resolve(__font);
});

function scaleWidth(w) {
	const width = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
	this.scale.x = this.scale.y = this.scale.z = w / width;
}

function scaleHeight(h) {
	// FIXME: problem is if string doesn't have a down line (like in letter p or q, for example: "course") -- calculates incorrect size
	const height = 24;//this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;
	this.scale.x = this.scale.y = this.scale.z = h / height;
}

function actualW() {
	const width = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
	return width * this.scale.x;
}

function actualH() {
	const height = this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;
	return height * this.scale.y;
}

export function fontDraw(text, color = 0x000000) {
	if (!__font) { throw new Error('Draw text before font loaded'); }

	const material = new THREE.MultiMaterial( [
					new THREE.MeshPhongMaterial( { color: color, shading: THREE.FlatShading } ), // front
					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
				] );

	const textGeo = new THREE.TextGeometry( text, {
					font: __font,
					size: 24,
					height: 1,
					curveSegments: 4,
					bevelEnabled: false,
					material: 0,
					extrudeMaterial: 0
				});


	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	/*if ( ! bevelEnabled ) {
					var triangleAreaHeuristics = 0.1 * ( height * size );
					for ( var i = 0; i < textGeo.faces.length; i ++ ) {
						var face = textGeo.faces[ i ];
						if ( face.materialIndex == 1 ) {
							for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
								face.vertexNormals[ j ].z = 0;
								face.vertexNormals[ j ].normalize();
							}
							var va = textGeo.vertices[ face.a ];
							var vb = textGeo.vertices[ face.b ];
							var vc = textGeo.vertices[ face.c ];
							var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
							if ( s > triangleAreaHeuristics ) {
								for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
									face.vertexNormals[ j ].copy( face.normal );
								}
							}
						}
					}
				}
				*/

	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	console.log('######### max.x  min.x max.y min.y', textGeo.boundingBox.max.x, textGeo.boundingBox.min.x, textGeo.boundingBox.max.y, textGeo.boundingBox.min.y);
	const textMesh1 = new THREE.Mesh( textGeo, material );
	//textMesh1.computeBoundingBox();
	textMesh1.scaleWidth = scaleWidth.bind(textMesh1);
	textMesh1.scaleHeight = scaleHeight.bind(textMesh1);
	textMesh1.actualH = actualH.bind(textMesh1);
	textMesh1.actualW = actualW.bind(textMesh1);

	return textMesh1;
}
