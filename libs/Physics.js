(function(global){
	//   Need Draw.js to draw 	//
	//							//
	//			SETUP			//
	//							//
	//	**********************	//
	Array.prototype._clone = function(){
		var arr = [];
		for(var i=0;i<this.length;i++){
			var o = this[i];
			if(typeof o == 'object'){
				if(Array.isArray(o)){
					arr[i] = o._clone();
				}else{
					arr[i] = o.clone();
				}
			}else{
				arr[i] = this[i];
			}
		}
		return arr;
	};
	Object.prototype.clone = function(){
		var obj = {}, me = this;
		for(var key in me){
			var o = me[i];
			if(typeof o == 'object'){
				if(Array.isArray(o)){
					arr[i] = o._clone();
				}else{
					arr[i] = o.clone();
				}
			}else{
				obj[key] = this[key];
			}
		}
		return obj;
	};
	Array.prototype._sort = function(changeObj){
		// using my method to decrease time complexity
		var arr = this;
		if(arr.length<1) return null;
		var r = 'r', p = 'p';
		for(var key in changeObj){
			switch(key){
				case 'p': p = changeObj[key];
				break;
				case 'r': r = changeObj[key];
				break;
			}
		}
		var all = [];
		var maxD = arr[0][r]*2;
		var minP = arr[0][p]._clone();
		for (var i = arr.length - 1; i >= 1; i--) {
			var c = arr[i];
			if(c[r]>maxD/2) maxD = c[r]*2;
			if(c[p].x<minP.x) minP.x = c[p].x;
			if(c[p].y<minP.y) minP.y = c[p].y;
		}
		for (var i = arr.length - 1; i >= 0; i--) {
			var c = arr[i];
			var y = Math.floor((c[p].y-minP.y)/maxD);
			var x = Math.floor((c[p].x-minP.x)/maxD);
			if(!all[y]) all[y] = [];
			if(!all[y][x]) all[y][x] = [];
			all[y][x].push({obj: c, id: i});
		}
		return {all: all, minP: minP, maxD: maxD, arr: arr, p: p};
	};
	Array._sortLoop = function(f, obj, times = 3){
		if(!obj) return false;
		var all = obj.all, minP = obj.minP, maxD = obj.maxD, arr = obj.arr, p = obj.p;
		times = Math.round(times);
		if(times%2 == 0){
			// is even
			var a = times/2-1;
			var b = times/2;
		}else{
			// is odd
			var a = Math.floor(times/2);
			var b = a;
		}
		for (var i = arr.length - 1; i >= 0; i--) {
			var c = arr[i];
			if(times%2 == 0){
				var y = Math.floor((c[p].y-minP.y-maxD/2)/maxD);
				var x = Math.floor((c[p].x-minP.x-maxD/2)/maxD);
			}else{
				var y = Math.floor((c[p].y-minP.y)/maxD);
				var x = Math.floor((c[p].x-minP.x)/maxD);
			}
			for(var py=y-a;py<=y+b;py++){
				if(!all[py]) continue;
				for(var px=x-a;px<=x+b;px++){
					if(!all[py][px]) continue;
					if(y>py && x>px) continue;
					for (var j = all[py][px].length - 1; j >= 0; j--) {
						var j0 = all[py][px][j];
						if(i == j0.id) continue;
						if(f) f({obj1: c, obj2: j0.obj, id1: i, id2: j0.id, all: all, arr: arr, minP: minP, maxD: maxD});
					}
				}
			}
		}
	};
	Math.dx = 1e-6;
	Math.integral = function(f,a,b){
		var sum = 0;
		for(var i=a;i<b;i+=this.dx) sum+=this.dx*f(i);
		return sum;
	};
	Math.mag = function(x,y){
		return this.pow(x*x+y*y,1/2);
	};
	Math.sum = function(a,b,e) {
		var num = 0;
		for(var i=a;i<b;i++){num+=eval(e);}
		return num;
	};
	Math.isPrime = function(num){
		num = Math.floor(Math.abs(num));
		function ii(n){
			return (Math.round(n)-n == 0) ? true : false;
		}
		for(var i=2;i<=Math.sqrt(num);i++){
			if(ii(num/i)) return false;
		}
		return true;
	};
	(function(gl){
		gl._primes = function(){var p = [2]; for(var i=0;i<1e4-1;i++){var g = p[p.length-1]; g++; while(!Math.isPrime(g)){g++;} p.push(g); } function ii(n){return (Math.abs(Math.round(n)-n)<Math.dx) ? true : false; } gl.primes = p; function c(){gl.Math.isPrime = function(num){num = Math.floor(Math.abs(num)); if(Math.abs(num)<=1) return false; var n = Math.sqrt(num); for(var i=0;i<n;i++){if(n>p[p.length-1]){if(ii(num/i)) return false; }else{if(ii(num/p[i]) && num != p[i]) return false; } } return true; }; } c(); for(var i=0;i<9e4;i++){var g = p[p.length-1]; g++; while(!Math.isPrime(g)){g++;} p.push(g); } gl.primes = p; c(); }; 
	})(global);
	global.primeFactor = function(n){
		var i = 2;
		var factors = [];
		while(n>1){
			if(Math.isInt(n/i)){
				factors.push(i);
				n/=i;
			}else{
				i++;
				while(!Math.isPrime(i)) i++;
			}
		}
		return factors;
	};
	Math.roundToZero = function(n){
		return n>0 ? this.floor(n) : this.ceil(n); 
	}
	Math.roundAwayZero = function(n){
		return n>0 ? this.ceil(n) : this.floor(n);
	}
	Math.isInt = function(n){return (this.round(Number(n)) == Number(n));};
	Math.change = function(num,a,b){
		var n1 = parseInt(num,a);
		return n1.toString(b);
	};
	global.toHexColor = function(r,g,b,a = 255){
		var _a = arguments;
		if(r == undefined){
			return '#000000';
		}else if(g == undefined && r != undefined){
			if(typeof r == 'string'){
				return r;
			}else if(typeof r == 'number'){
				g = r;
				b = r;
				a = 255;
			}
		}else if(g != undefined && b == undefined && typeof _a[0] == 'number'&& typeof _a[1] == 'number'){
			var _g = g;
			g = r;
			b = r;
			a = _g;
		}
		r = constrain(r,0,255);
		g = constrain(g,0,255);
		b = constrain(b,0,255);
		a = constrain(a,0,255);
		function t0(n){
			var a0 = Math.change(n,10,16);
			if(n<16) a0 = "0"+a0;
			return a0;
		}
		return "#"+t0(r)+t0(g)+t0(b)+t0(a);
	};
	global.mixColors = function(a, b, k){
		function toObj(str){
			str = str.substring(1,str.length);
			r = Math.change(str.substring(0,2), 16, 10);
			g = Math.change(str.substring(2,4), 16, 10);
			_b = Math.change(str.substring(4,6), 16, 10);
			if(str.length<7){
				a = 255;
			}else{
				a = Math.change(str.substring(6,8), 16, 10);
			}
			return {r: Number(r),g: Number(g),b: Number(_b),a: Number(a)};
		}
		var o1 = toObj(a), o2 = toObj(b);
		var diff = {
			r: o2.r-o1.r, 
			g: o2.g-o1.g, 
			b: o2.b-o1.b, 
			a: o2.a-o1.a, 
		};
		o1.r+=Math.roundAwayZero(diff.r*k), o1.g+=Math.roundAwayZero(diff.g*k), o1.b+=Math.roundAwayZero(diff.b*k), o1.a+=Math.roundAwayZero(diff.a*k);
		o2.r-=Math.roundAwayZero(diff.r*k), o2.g-=Math.roundAwayZero(diff.g*k), o2.b-=Math.roundAwayZero(diff.b*k), o2.a-=Math.roundAwayZero(diff.a*k);
		a3 = toHexColor(o1.r,o1.g,o1.b,o1.a);
		b3 = toHexColor(o2.r,o2.g,o2.b,o2.a);
		return {a:a3,b:b3};
	};
	global.hexToNumber = function(str){
		if(str.length<9) str[7] = 'f', str[8] = 'f';
		return [str.substring(1,3), str.substring(3,5), str.substring(5,7), str.substring(7,9)];
	};
	global.constrain = function(value, min, max){
		if(value<=min) return min;
		if(value>=max) return max;
		else return value;
	};
	global.map = function(value, l1, h1, l2, h2) {
		return l2+(h2-l2)*(value-l1)/(h1-l1);
	};
	global.dist2 = function(x1,y1,x2,y2){
		if(x1 instanceof Point && y1 == undefined){
			return Math.sqrt(Math.pow(x1.x,2)+Math.pow(x1.y,2));
		}
		if(arguments.length == 2){
			return Math.sqrt(Math.pow(y1.x-x1.x,2)+Math.pow(y1.y-x1.y,2));
		}
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	};
	global.dist = global.dist2;
	global.dist3 = function(x1,y1,z1,x2,y2,z2){
		if(x1 instanceof Geometry.Point3 && y1 == undefined){
			return Math.sqrt(Math.pow(x1.x,2)+Math.pow(x1.y,2)+Math.pow(x1.z,2));
		}
		if(arguments.length == 2 && x1 instanceof Geometry.Point3){
			return Math.sqrt(Math.pow(y1.x-x1.x,2)+Math.pow(y1.y-x1.y,2)+Math.pow(y1.z-z1.z,2));
		}
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)+Math.pow(z2-z1,2));
	};
	global.randomFloat = function(a, b){
		return a+Math.random()*(b-a);
	};
	var Geometry = {}, Physics = {};
	Geometry.Graph = function(a,b,c,f){
		this.f = f;
	};
	Object.assign(Geometry.Graph.prototype, {
		draw: function(){
		}
	});
	global.Eq = function(a,b){
		if(a == undefined){
			return new Function('x', 'return 0');
		}else if(b == undefined){
			return new Function('x', 'return '+a);
		}else{
			console.log(Array.isArray(arguments));
			var _a = arguments._clone();
			_a.splice(a.length-1,1);
			var f = new Function(_a, 'return '+arguments[arguments.length-1]);
			return f;
		}
	};
	if(typeof global.Point == 'undefined'){
		global.Point = function(x,y){
			if(!y && x instanceof Point){this.x = x.x; this.y = x.y; }else{this.x = x || 0; this.y = y || 0; } return this; };
		Object.assign(Point, {add: function(){var p = new Point(); for(var i=0;i<arguments.length;i++){p.add(arguments[i]);} return p; }, sub: function(a,b){return new Point(a.x-b.x,a.y-b.y); }, scale: function(a,s){var a = a._clone(); a.scale(s); return a; }, mult: function(a,b){var a = a._clone(); a.mult(b); return a; }, dot: function(a,b){return a.dot(b); }, cross: function(a,b){return a.cross(b); }, mag: function(a){return a.mag(); }, normalize: function(a){var b = a._clone(); return b.normalize(); }, angle: function(v){return v.angle(); }, equals: function(a,b){return a.equals(b); }, floor: function(a){return a._clone().floor(); }, round: function(a){return a._clone().round(); }, ceil: function(a){return a._clone().ceil(); }, inverse: function(a){return new Point(1/a.x,1/a.y); }, minus: function(a){return new Point(-a.x,-a.y); }, polar: function(r,a){return new Point(Math.cos(a)*r,Math.sin(a)*r); }, random: function(a,b,c,d){var p = new Point(); p.random(a,b,c,d); return p; } }); Object.assign(global.Point.prototype, {set: function(x,y){if(!y && x instanceof Point){this.x = x.x; this.y = x.y; }else{this.x = x || 0; this.y = y || 0; } return this; }, _clone: function(){return new this.constructor(this.x,this.y); }, scale: function(s){this.x*=s; this.y*=s; return this; }, scale0: function(s){return Point.scale(this, s); }, inverse: function(){return new Point(1/this.x,1/this.y); }, minus: function(){return new Point(-this.x,-this.y); }, dot: function(v){return this.x*v.x+this.y*v.y; }, mul: function(v){this.x = this.x*v.x+this.y*v.y, this.y = this.x*v.y+this.y*v.x; return this; }, add: function(v,w){if(w){this.x+=v; this.y+=w; }else{this.x+=v.x; this.y+=v.y; } return this; }, sub: function(v,w){if(w){this.x-=v; this.y-=w; }else{this.x-=v.x; this.y-=v.y; } return this; }, cross: function(v){return this.x*v.y-this.y*v.x; }, floor: function(){this.x = Math.floor(this.x); this.y = Math.floor(this.y); return this; }, round: function(){this.x = Math.round(this.x); this.y = Math.round(this.y); return this; }, ceil: function(){this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); return this; }, mag: function(){return Math.mag(this.x,this.y); }, roundToZero: function(){this.x = (this.x<0) ? Math.ceil(this.x) : Math.floor(this.x); this.y = (this.y<0) ? Math.ceil(this.y) : Math.floor(this.y); return this; }, normalize: function(){this.x/=this.mag(); this.y/=this.mag(); return this; }, normalized: function(){var v = this._clone(), m = this.mag(); v.x/=m; v.y/=m; return v; }, angle: function(){var a = Math.atan2(this.y,this.x); if(a<0) a+=2*Math.PI; return a; }, lerp: function(v,a){this.x = (v.x-this.x)*a; this.y = (v.y-this.y)*a; return this; }, equals: function(v){return ((v.x == this.x) && (v.y == this.y)); }, rotate: function(a){var a0 = this.angle()+a; var m = this.mag(); this.x = Math.cos(a0)*m; this.y = Math.sin(a0)*m; return this; }, rotateAround: function(x,y,a){if(a == undefined && x instanceof Point){var p = x._clone(); a = y; this.sub(p); this.rotate(a); this.add(p); }else{var p = new Point(x,y); this.sub(p); this.rotate(a); this.add(p); } }, changeAxis: function(angle){var m = this.mag(); var a0 = angle-this.angle(); this.set(Point.polar(m, a0)); return this; }, isZero: function(){return this.x == 0 && this.y == 0; }, random: function(a,b,c,d){if(c == undefined){if(a == undefined){this.x = randomFloat(-1,1); this.y = randomFloat(-1,1); return; } if(b == undefined){this.x = randomFloat(-a,a); this.y = randomFloat(-a,a); return; } this.x = randomFloat(a,b); this.y = randomFloat(a,b); return; }else{this.x = randomFloat(a,b); this.y = randomFloat(c,d); return; } }, get: function(p){this.x = p.x, this.y = p.y;}, constrain: function(a,b,c,d){if(c == undefined){if(a == undefined){this.x = constrain(this.x,-1,1); this.y = constrain(this.y,-1,1); return; } if(b == undefined){a = Math.abs(a); var n = this.normalized().scale(a); if(this.mag()>a) this.x = n.x, this.y = n.y; return; } this.x = constrain(this.x,a,b); this.y = constrain(this.y,a,b); return; }else{this.x = constrain(this.x,a,b); this.y = constrain(this.y,c,d); return; } } });
	}
	Point.prototype.in = function(obj){
		if(obj instanceof Geometry.Shape){
		}else if(obj instanceof Physics.Obj){
		}else if(obj instanceof Physics.Particle){
		}
	};
	Geometry.Point2 = global.Point;
	global.Clock = function(){this.time = 0; this.running = true; this.start = Date.now(); this.lastRecordTime = this.start; }; Object.assign(global.Clock.prototype, {set: function(start){this.time+=(this.time-start); this.start = start; }, update: function(){if(this.running) this.time+=Date.now()-this.lastRecordTime; this.lastRecordTime = Date.now(); }, reset: function(){this.set(Date.now()); }, _clone: function(){var clock = new Clock(); clock.time = this.time, clock.lastRecordTime = this.lastRecordTime, clock.start = this.start, clock.running = this.running; return clock; } });
	/********************************************/
	//					MAIN					//
	//					MAIN					//
	//					MAIN					//
	//					MAIN					//
	/********************************************/
	Geometry.Point3 = function(a,b,d){return this.set(a,b,d);};
	Object.assign(Geometry.Point3.prototype, {
		get: function(p){
			this.x = p.x, this.y = p.y, this.z = p.z;
		},
		set: function(a,b,c){
			if(a instanceof Geometry.Point3){
				this.get(a);
			}else{
				this.x = x || 0, this.y = y || 0, this.z = z || 0;
			}
			return this;
		},
		add: function(a,b,c){
			if(a instanceof Geometry.Point3){
				this.x+=a.x, this.y+=a.y, this.z+=a.z;
			}else{
				this.x+=a, this.y+=b, this.z+=c;
			}
			return this;
		},
		mul: function(v){
			if(typeof v == 'number'){return;}
			var _p = this._clone();
			this.x = _c.x*v.x+_c.x*v.y+_c.x*v.z;
			this.y = _c.y*v.x+_c.y*v.y+_c.y*v.z;
			this.z = _c.z*v.x+_c.z*v.y+_c.z*v.z;
			return this;
		},
		scale: function(a,b,c){
			if(typeof c == 'number'){
				this.x*=a, this.y*=b, this.z*=c;
			}else if(a instanceof Geometry.Point3){
				this.x*=a.x, this.y*=a.y, this.z*=a.z;
			}else if(typeof a == 'number'){
				this.x*=a, this.y*=a, this.z*=a;
			}
			return this;
		},
		sub: function(a,b,c){
			if(a instanceof Geometry.Point3){
				this.x-=a.x, this.y-=a.y, this.z-=a.z;
			}else{
				this.x-=a, this.y-=b, this.z-=c;
			}
			return this;
		},
		_clone: function(){
			return new this.constructor(this);
		},
		mag: function(){
			return dist3(this);
		},
		rotate: function(angle, axis){
			if(axis == undefined){axis = 'z';}
			var m = this.mag(), a;
			if(axis == 'x'){
				a = Math.atan2(this.y, this.z);
				this.z = Math.cos(a+angle)*m;
				this.y = Math.sin(a+angle)*m;
			}else if(axis == 'y'){
				a = Math.atan2(this.z, this.x);
				this.x = Math.cos(a+angle)*m;
				this.z = Math.sin(a+angle)*m;
			}else if(axis == 'z'){
				a = Math.atan2(this.y, this.x);
				this.x = Math.cos(a+angle)*m;
				this.y = Math.sin(a+angle)*m;
			}
			return this;
		},
		angle: function(axis){
			if(axis == undefined){axis = 'z';}
			if(axis == 'x'){
				return Math.atan2(this.y, this.z);
			}else if(axis == 'y'){
				return Math.atan2(this.z, this.x);
			}else if(axis == 'z'){
				return Math.atan2(this.y, this.x);
			}
		},
		rotateAround: function(p, angle, axis){
			if(axis == undefined){axis = 'z';}
			var m = this.mag(), a;
			if(!(p instanceof Geometry.Point2) && !(p instanceof Geometry.Point3)){console.log('Geometry.Point3.rotateAround failed: First argument has to be an instance of Geometry.Point3 or Geometry.Point2');return;}
			if(p instanceof Geometry.Point2){
				if(axis == 'x'){
					p = new Geometry.Point3(0,p.y,p.x);
				}else if(axis == 'y'){
					p = new Geometry.Point3(p.x,0,p.y);
				}else if(axis == 'z'){
					p = new Geometry.Point3(p.x,p.y,0)
				}
			}
			if(axis == 'x'){
				a = Math.atan2(this.y, this.z);
				this.z-=p.z, this.y-=p.y;
				this.z = Math.cos(a+angle)*m;
				this.y = Math.sin(a+angle)*m;
				this.z+=p.z, this.y+=p.y;
			}else if(axis == 'y'){
				a = Math.atan2(this.z, this.x);
				this.x-=p.x, this.z-=p.z;
				this.x = Math.cos(a+angle)*m;
				this.z = Math.sin(a+angle)*m;
				this.x+=p.x, this.z+=p.z;
			}else if(axis == 'z'){
				a = Math.atan2(this.y, this.x);
				this.x-=p.x, this.y-=p.y;
				this.x = Math.cos(a+angle)*m;
				this.y = Math.sin(a+angle)*m;
				this.x+=p.x, this.y+=p.y;
			}
			return this;
		}
	});
	Geometry.Line2 = function(a,b,c,d){this.c = '#ffee00';this.set(a,b,c,d);};
	Object.assign(Geometry.Line2.prototype, {
		set: function(a,b,c,d){
			if(a == undefined){
				this.p1 = new Geometry.Point2();
				this.p2 = new Geometry.Point2();
			}else if(b == undefined){
				if(a instanceof Geometry.Line2){
					this.get(a);
				}
			}else if(c == undefined){
				if(a instanceof Geometry.Point2 && b instanceof Geometry.Point2){
					this.p1 = a._clone(), this.p2 = b._clone();
				}
			}else if(d == undefined){
				if(a instanceof Geometry.Point2){
					this.p1 = a._clone(), this.p2 = new Geometry.Point2(b,c);
				}else if(c instanceof Geometry.Point2){
					this.p2 = c._clone(), this.p1 = new Geometry.Point2(a,b);
				}
			}else{
				this.p1 = new Geometry.Point2(a,b);
				this.p2 = new Geometry.Point2(c,d);
			}
		},
		get: function(line){
			this.p1 = line.p1._clone();
			this.p2 = line.p2._clone();
		},
		stroke: function(a,b,c,d){
			this.c = toHexColor(a,b,c,d);
		},
		diff: function(){
			return Point.sub(this.p2,this.p1);
		},
		draw: function(tool){
			if(tool == undefined){console.log('no tool passed on');return;}
			tool.stroke(this.c);
			tool.line(this.p1,this.p2);
			tool.pop();
		},
		_clone: function(){
			return new this.constructor(this);
		},
		in: function(obj, _in_){
			if(_in_ == undefined){_in_ = false;}
			if(obj instanceof Geometry.Line2){
				var c2 = obj.center(), c1 = this.center();
				var d1 = Point.sub(c2, c1), d2 = obj.diff();
				var _o = obj._clone(), _t = this._clone();
				var c2 = _o.center(), c1 = _t.center();
				_o.rotate(-d2.angle());
				_t.rotate(-d2.angle());
				var _in = false;
				if((_t.p1.y<_o.p1.y && _t.p2.y>_o.p2.y) || (_t.p1.y>_o.p1.y && _t.p2.y<_o.p2.y)){
					if(_in_ || obj.in(this, true)){
						_in = true;
					}
				}
				return _in;
			}else if(obj instanceof Geometry.Shape){
			}else if(obj instanceof Physics.Obj){
			}else{
				return obj.in(this);
			}
		},
		angle: function(){
			return this.diff().angle();
		},
		mag: function(){
			return dist(this.p1,this.p2);
		},
		center: function(){
			var p = Point.add(this.p1,this.p2);
			return Point.scale(p,1/2);
		},
		rotate: function(a){
			this.p2.rotate(a); this.p1.rotate(a);
		},
		rotateAround: function(a, p){
			if(p == undefined){p = this.center();}
			this.p2.sub(p); this.p1.sub(p);
			this.p2.rotate(a); this.p1.rotate(a);
			this.p2.add(p); this.p1.add(p);
		},
		getDataOnPoint: function(p){
			var data = {};
			var m = this.mag();
			var _p = p._clone(), a = this.angle()+Math.PI/2, c = this.center();
			_p.sub(c);
			_p.changeAxis(a);
			_p.x = _p.x, _p.y = Math.abs(_p.y);
			if(_p.y>m/2){
				var cp = Point.sub(this.p1, p).mag()>Point.sub(this.p2, p).mag() ? this.p2 : this.p1;
				data.dist = Point.sub(cp, p).mag();
				data.p = cp._clone();
			}else{
				data.dist = _p.x;
				var n = new Point(0, -_p.x);
				n.rotate(a-Math.PI/2);
				n.add(p);
				data.p = n;
			}
			data.dist = Math.abs(data.dist);
			return data;
		}
	});
	Geometry.Line3 = function(a,b,c,d,e,f){
		this.set(a,b,c,d,e,f);
	};
	Object.assign(Geometry.Line3.prototype, {
		set: function(a,b,c,d,e,f){
			if(a instanceof Geometry.Line3){
				this.get(a);
			}else if(b instanceof Geometry.Point3){
				this.p1 = a._clone();
				this.p2 = b._clone();
			}else if(typeof f == 'number'){
				this.p1 = Geometry.Point3(a,b,c);
				this.p2 = Geometry.Point3(d,e,f);
			}
		},
		get: function(line3){
			this.p1 = line3.p1._clone();
			this.p2 = line3.p2._clone();
		},
		_clone: function(){
			return new this.constructor(this);
		},
		rotate: function(angle, axis){
			this.p1.rotate(angle, axis);
			this.p2.rotate(angle, axis);
		},
		rotateAround: function(p, angle, axis){
		},
	});
	Geometry.Shape2 = function(){
		this.ps = [];
	};
	Object.assign(Geometry.Shape2.prototype, {
		insertPoint: function(p, end = false){
			if(!(p instanceof Geometry.Point2)){console.log('Failed to insertPoint: first argument has to be an instance of Geometry.Point2');return;}
			if(end){this.ps.push(p);}
		},
		_lines: function(){
			var ls = [];
			for(var i=0;i<this.ps.length;i++){
			}
			return ls;
		},
		in: function(p){
		},
		area: function(){
		},
		center: function(){
		}
	});
	Physics.ParticleGroup = function(){
	};
	Object.assign(Physics.ParticleGroup.prototype, {
	});
	Physics.Particle = function(x,y){
		this.p = new Point(x,y);
		this.v = new Point();
		this.c = toHexColor(120,120,180);
	};
	Object.assign(Physics.Particle.prototype, {
		fiil: function(a,b,c,d){
			this.c = toHexColor(a,b,c,d);
		},
		_clone: function(){
			var p = new Physics.Particle();
			return p;
		},
		update: function(){
			this.p.add(this.v);
		},
		draw: function(tool){
			if(tool == undefined){console.log('No tool passed on');return;}
			tool.translate(this.p);
			tool.noStroke();
			tool.fill(this.c);
			tool.pop();
		}
	});
	Physics.Obj = function(){
		this.shape = shape || new Shape2();
	};
	Object.assign(Physics.Obj.prototype, {
	});
	Object.assign(Physics.Obj, {
		attach: function(a,b,c){
		}
	});
	Physics.World2 = function(){
	};
	Object.assign(Physics.World2.prototype, {
	});
	global.Geometry = Geometry, Physics = Physics;
	global.initPhysics = function(){
		var world2 = new World2();
		var clock = new Clock();
	};
	global.updatePhysics = function(){
	};
})(this);