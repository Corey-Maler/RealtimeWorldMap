import { Vector3 } from 'three';
import { Earth, Planet } from './Earth';

export class GeoPoint extends Vector3 {
  public readonly h: number;
  public readonly lat: number;
  public readonly long: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  static planetRadius = 6731000;//: Planet | undefined;
  constructor(x: Vector3);
  constructor(x: number, y: number, z: number);
  constructor(x: number | Vector3, y?: number, z?: number) {
	let _x: number = 0;
	let _y: number = 0;
	let _z: number = 0;
    if (x instanceof Vector3) {
      super(x.x, x.y, x.z);
	  _x = x.x;
	  _y = x.y;
	  _z = x.z;
    } else {
      super(x, y, z);
	   _x = x;
	   _y = y!;
	   _z = z!;
    }

	this.x = _x;
	this.y = _y;
	this.z = _z;

    const r = this.length();
    this.h = r - GeoPoint.planetRadius;
    this.lat = -Math.asin(-_y / r);
    this.long = -Math.atan2(_x, -_z);
    //this.long = - Math.asin(x / (r * Math.cos(-this.lat)));
  }

  public asVector() {
	return new Vector3(this.x, this.y, this.z);
  }

  static fromV(v: Vector3) {
    return new GeoPoint(v.x, v.y, v.z);
  }

  static fromLLd(long: number, lat: number, _h: number) {
    return GeoPoint.fromLL(
      (long * Math.PI) / 180,
      (lat * Math.PI) / 180,
      _h,
    );
  }

  static fromLL(long: number, lat: number, h: number = 0) {
    const R = GeoPoint.planetRadius;
    const r = R + h;
    /*
		const res = new Geo(
			r * Math.cos(lat) * Math.cos(long),
			r * Math.cos(lat) * Math.sin(long),
			r * Math.sin(lat)
		);
		*/

    const res = new GeoPoint(
      r * Math.cos(-lat) * Math.sin(-long),
      -r * Math.sin(-lat),
      -r * Math.cos(-lat) * Math.cos(-long)
    );

    return res;
  }

  addLL(brng: number, dis: number) {
    const R = GeoPoint.planetRadius;

    //const y = r * Math.sin(course);
    //const x = r * Math.cos(course);

    //const lg = this.long + y / R;
    //const lt = this.lat + x / (R * (2 * Math.cos(this.long) - Math.cos(lg)));

    const lt1 = this.lat;
    const lg1 = this.long;

    const lt2 = Math.asin(
      Math.sin(lt1) * Math.cos(dis / R) +
        Math.cos(lt1) * Math.sin(dis / R) * Math.cos(brng)
    );

    const lg2 =
      lg1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(dis / R) * Math.cos(lt1),
        Math.cos(dis / R) - Math.sin(lt1) * Math.sin(lt2)
      );

    return GeoPoint.fromLL(lt2, lg2, this.h);
  }
}

export default GeoPoint;
