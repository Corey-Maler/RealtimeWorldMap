const Three = require('three');
const Vector3 = Three.Vector3;
const d = require('debug')('app');
//const Planet = require('./Earth');


class Geo extends Vector3 {
	constructor(x, y, z) {
		if (x instanceof Vector3) {
			super(x.x, x.y, x.z);
		} else {
			super(x, y, z);
		} 
		//d('custom vector');

		const r = this.length();
		this.h = r - Geo.planet.radius; 
		this.lat = - Math.asin(- y / r);
		this.long = -Math.atan2(x, -z);
		//this.long = - Math.asin(x / (r * Math.cos(-this.lat)));

	}

	static fromLLd(long, lat, _h) {
		return Geo.fromLL(long * Math.PI / 180, lat * Math.PI / 180, _h);
	}

	static fromLL(long, lat, _h) {
		const R = Geo.planet.radius;
		const h = _h || 0; 
		const r = (R + h);
		/*
		const res = new Geo(
			r * Math.cos(lat) * Math.cos(long),
			r * Math.cos(lat) * Math.sin(long),
			r * Math.sin(lat)
		);
		*/

		const res = new Geo(
			r * Math.cos(- lat) * Math.sin(- long),
			- r * Math.sin(- lat),
			- r * Math.cos(- lat) * Math.cos(- long)
		);

		return res;
	}

	addLL(brng, dis) {

		const R = Geo.planet.radius;
		

		//const y = r * Math.sin(course);
		//const x = r * Math.cos(course);

		//const lg = this.long + y / R;
		//const lt = this.lat + x / (R * (2 * Math.cos(this.long) - Math.cos(lg)));

		const lt1 = this.lat;
		const lg1 = this.long;

		const lt2 = Math.asin(Math.sin(lt1) * Math.cos(dis/R) 
			+ Math.cos(lt1) * Math.sin(dis/R) * Math.cos(brng));

		const lg2 = lg1 + Math.atan2(
			Math.sin(brng) * Math.sin(dis/R) * Math.cos(lt1),
			Math.cos(dis/R) - Math.sin(lt1) * Math.sin(lt2));

		/*
		d('>>>', this.long, this.lat);
		d('<<<', lt2, lg2);
		/* */
		return new Geo.fromLL(lt2, lg2, this.h);
	}
}

module.exports = Geo;