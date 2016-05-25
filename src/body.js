const d 			= require('debug')('body');
const THREE 		= require('three');
const g 			= require('./geodesic');
const makeTextSprite = require('./tools').makeTextSprite;
const tools			= require('./tools');

class Body {
	constructor(props) {
		this.props = props;
		this._pos = props.pos;
		this.mesh = new THREE.Group();
	}

	set pos (val) {
		this._pos = val;
		const t = this.pathSpline.getPoint(val);
		const p = new g(t.x, t.y, t.z);

		this.dot.position.x = p.x;
		this.dot.position.y = p.y;
		this.dot.position.z = p.z;


		const lPos = g.fromLL(p.long, p.lat, 500000);

		this.spritey.position.x = lPos.x;
		this.spritey.position.y = lPos.y;
		this.spritey.position.z = lPos.z;
	}

	get pos() { return this._pos; }

	render() {
		this.renderPath();

		const t = this.pathSpline.getPoint(this._pos);
		d('spline', this._pos, this.pathSpline.getPoint(this._pos));

		const p = new g(t.x, t.y, t.z);
		d('render pos', p);


		const dotGeometry = new THREE.Geometry();
		dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
		const dotMaterial = new THREE.PointsMaterial( { size: 5, color: 0xff3333, sizeAttenuation: false } );
		const dot = new THREE.Points( dotGeometry, dotMaterial );
		dot.position.x = p.x;
		dot.position.y = p.y;
		dot.position.z = p.z;
		this.mesh.add(dot);
		this.dot = dot;

		const lPos = g.fromLL(p.long, p.lat, 500000);

		var spritey = makeTextSprite( 'sdf', 
			{
				color: "rgba(255, 0, 0, 1)",
				backgroundColor: {r:255, g:100, b:100, a:0.8} 
			}
		);
		
		spritey.position.x = lPos.x;
		spritey.position.y = lPos.y;
		spritey.position.z = lPos.z;
		const scaleRate = 0.002;
		spritey.scale.set(256 * Body.Planet.radius * scaleRate, 64 * Body.Planet.radius * scaleRate, 1)
		
		this.mesh.add(spritey);
		this.spritey = spritey;

		
	}

	renderPath() {
		const geometry = new THREE.Geometry();
		const n_sub = 3;
		const points = tools.interpolate(this.props.path);
		const spline = new THREE.Spline( points );
		this.pathSpline = spline;
		for (let i = 0; i < points.length * n_sub; i ++ ) {
			const index = i / ( points.length * n_sub );
			//d('index', index);
			const position = spline.getPoint( index );
			geometry.vertices[i] = new THREE.Vector3(position.x, position.y, position.z);
		}
		const material = new THREE.LineBasicMaterial( { color: 0x0066cc, opacity: 1, linewidth: 3/*, vertexColors: THREE.VertexColors */} );

		const line = new THREE.Line(geometry,  material);
		this.mesh.add(line);
	}
}

module.exports = Body;