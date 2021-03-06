(function(global){
	//      Require Draw.js	 	//
	//							//
	//			SETUP			//
	//							//
	//	**********************	//
	global.Array.prototype._sort = function(changeObj){
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
	global.Array._sortLoop = function(f, obj, times){
		if(!obj) {return false;}
		if(times == undefined){times = 3;}
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
					if(!(py>=y || px>=x)) continue;
					for (var j = all[py][px].length - 1; j >= 0; j--) {
						var j0 = all[py][px][j];
						if(i == j0.id) continue;
						if(f){f({obj1: c, obj2: j0.obj, id1: i, id2: j0.id, all: all, arr: arr, minP: minP, maxD: maxD});}
					}
				}
			}
		}
	};
	global.Math.mag2 = function(x,y){
		return this.pow(x*x+y*y,1/2);
	};
	global.Math.mag = global.Math.mag2;
	global.Math.mag3 = function(x,y,z){
		return this.pow(x*x+y*y+z*z,1/2);
	};
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
	global.Math.isPrime = function(num){
		num = Math.floor(Math.abs(num));
		function ii(n){
			return (Math.round(n)-n == 0) ? true : false;
		}
		for(var i=2;i<=Math.sqrt(num);i++){
			if(ii(num/i)) return false;
		}
		if(!(typeof window.primes == 'undefined')){window._primes();}
		return true;
	};
	(function(gl){gl.p = [2]; gl._primes = function(){var p = gl.p; var l = Math.min(p.length, 3e3); for(var i=0;i<l+1e4-1;i++){var g = p[p.length-1]; g++; while(!Math.isPrime(g)){g++;} p.push(g); } function ii(n){return (Math.abs(Math.round(n)-n)<Math.dx) ? true : false; } gl.primes = p; function c(){gl.Math.isPrime = function(num){num = Math.floor(Math.abs(num)); if(Math.abs(num)<=1) return false; var n = Math.sqrt(num); for(var i=0;i<n;i++){if(n>p[p.length-1]){if(ii(num/i)) return false; }else{if(ii(num/p[i]) && num != p[i]) return false; } } return true; }; } c(); for(var i=0;i<l+9e4;i++){var g = p[p.length-1]; g++; while(!Math.isPrime(g)){g++;} p.push(g); } gl.primes = p; c(); }; })(global);
	function Timer(){
		var a = arguments;
		this.createByArray(a);
	}
	Timer.prototype = {
		create: function(){
			var a = arguments;
			if(a.length%2 != 0){
				console.warn('An odd number of arguments');
				return;
			}
			for (var i = a.length - 1; i >= 1; i-=2) {
				this._c(a[i-1], a[i]);
			}
		},
		createByArray: function(arr){
			if(arr.length%2 != 0){
				console.warn('An odd number of values');
				return;
			}
			for (var i = arr.length - 1; i >= 1; i-=2) {
				this._c(arr[i-1], arr[i]);
			}
		},
		_c: function(a,b){
			if(this[a]) this[a].d = b;
			else this[a] = {t: 1, d: b};
		},
		is: function(a){
			return this[a].t == 0;
		},
		update: function(){
			for(var key in this){
				this[key].t = (this[key].t+1)%this[key].d;
			}
		}
	};
	global.Timer = Timer;
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
	var Geometry = {}, Physics = {};
	Geometry.Graph = function(a,b,c,f){
		this.f = f;
	};
	Object.assign(Geometry.Graph.prototype, {
		draw: function(){
		}
	});
	/********************************************/
	//											//
	//					MAIN					//
	//					MAIN					//
	//											//
	/********************************************/
	var Point = global.Point;
	global.Clock = function(){
		this.time = 0; this.running = true; this.start = Date.now(); this.lastRecordTime = this.start; 
	}; 
	Object.assign(global.Clock.prototype, {
		set: function(start){this.time+=(this.time-start); this.start = start; }, 
		update: function(){if(this.running){this.time+=Date.now()-this.lastRecordTime;}this.lastRecordTime = Date.now(); }, 
		getDelta: function(){var dt = Date.now()-this.lastRecordTime;this.update();return dt;},
		reset: function(){this.set(Date.now()); }, 
		_clone: function(){var clock = new Clock(); clock.time = this.time, clock.lastRecordTime = this.lastRecordTime, clock.start = this.start, clock.running = this.running; return clock; } 
	});
	Point.prototype.in = function(obj){
		if(obj instanceof Geometry.Shape2){
			if(obj.ps.length<1){return false;}
			if(!obj.ps[0].equals(obj.ps[obj.ps.length-1])){
				for(var i=0;i<obj.ps.length-1;i++){
					var l = new Geometry.Line2(obj.ps[i], obj.ps[i+1]);
					if(l.in(this)){return true;}
				}
				return false;
			}
			var off = 1e8;
			var p = this._clone();
			var p2 = obj.most('down');
			p2.y+=off;
			p2.x+=off/2;
			var ll = new Geometry.Line2(p, p2);
			var hit = 0;
			for(var i=0;i<obj.ps.length-1;i++){
				var l = new Geometry.Line2(obj.ps[i], obj.ps[i+1]);
				if(l.in(ll)){hit++;}
			}
			return (hit+1)%2 == 0;
		}else if(obj instanceof Physics.Obj){
			return this.in(obj.shape);
		}else if(obj instanceof Geometry.Line2){
			return obj.getDataOnPoint(this).dist<1;
		}else if(obj instanceof Physics.Particle){
			return Point.sub(this, obj.p).mag()<obj.r+1;
		}else{
			return false;
		}
	};
	Geometry.Point2 = global.Point;
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
	Geometry.Line2 = function(a,b,c,d){
		this.c = new Color('#ffee00');
		this.data = {};
		this.set(a,b,c,d);
	};
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
		swap: function(){
			var p1 = this.p1._clone();
			this.p1.get(this.p2);
			this.p2.get(p1);
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
			tool.strokeWeight(1);
			tool.line(this.p1,this.p2);
			tool.pop();
		},
		_clone: function(){
			var l = new this.constructor();
			l.p1 = this.p1._clone();
			l.p2 = this.p2._clone();
			l.data = this.data;
			return l;
		},
		in: function(obj, _in_){
			if(obj instanceof Geometry.Line2){
				if(_in_ == undefined){_in_ = false;}
				var c2 = obj.center(), c1 = this.center();
				var d1 = Point.sub(c2, c1), d2 = obj.diff();
				var _o = obj._clone(), _t = this._clone();
				var c2 = _o.center(), c1 = _t.center();
				_o.rotate(-d2.angle());
				_t.rotate(-d2.angle());
				var _in = false;
				if((_t.p1.y<=_o.p1.y && _t.p2.y>=_o.p2.y) || (_t.p1.y>=_o.p1.y && _t.p2.y<=_o.p2.y)){
					if(_in_ || obj.in(this, true)){
						_in = true;
					}
				}
				return _in;
			}else if(obj instanceof Geometry.Shape){
				for(var i=0;i<obj.ps.length-1;i++){
					if(this.in(new Geometry.Line2(obj.ps[i], obj.ps[i+1]))){return true;}
				}
				if(this.p1.in(obj)){return true;}
				if(this.p2.in(obj)){return true;}
				return false;
			}else if(obj instanceof Physics.Obj){
				return this.in(obj.shape);
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
		this.data = {};
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
			var l = new this.constructor(this);
			l.data = this.data;
			return l;
		},
		rotate: function(angle, axis){
			this.p1.rotate(angle, axis);
			this.p2.rotate(angle, axis);
		},
		rotateAround: function(p, angle, axis){
			this.p1.rotateAround(p, angle, axis);
			this.p2.rotateAround(p, angle, axis);
		}
	});
	Geometry.createRectShape = function(a,b,c,d){
		if(a instanceof Point && b instanceof Point){
			return new Geometry.Shape2(
				a.x-b.x/2, a.y-b.y/2, 
				a.x+b.x/2, a.y-b.y/2, 
				a.x+b.x/2, a.y+b.y/2, 
				a.x-b.x/2, a.y+b.y/2, 
				a.x-b.x/2, a.y-b.y/2
			);
		}else if(typeof a == 'number' && typeof d == 'number'){
			return new Geometry.Shape2(
				a-c/2, b-d/2, 
				a+c/2, b-d/2, 
				a+c/2, b+d/2, 
				a-c/2, b+d/2, 
				a-c/2, b-d/2
			);
		}
	};
	Geometry.createLineShape = function(a,b,c,d,e){
		var t = 7;
		if(a instanceof Geometry.Line2){
			var p1 = a.p1._clone(), p2 = a.p2._clone();
			if(b == undefined){var r = t;}
			else{var r = b;}
		}else if(a instanceof Geometry.Point2 && b instanceof Geometry.Point2){
			var p1 = a._clone();
			var p2 = b._clone();
			var r = c != undefined ? c : t;
		}else{
			var p1 = new Geometry.Point2(a,b);
			var p2 = new Geometry.Point2(c,d);
			var r = e != undefined ? e : t;
		}
		var da = Math.PI/3, ps = [];
		var d = Point.sub(p2, p1), m = d.mag();
		var a = d.angle();
		for(var _a=Math.PI/2;_a<=Math.PI/2+Math.PI;_a+=da){
			ps.push(Point.polar(r,_a));
		}
		for(var _a=Math.PI/2+Math.PI;_a<=Math.PI/2+Math.PI*2;_a+=da){
			ps.push(Point.polar(r,_a,new Point(m, 0)));
		}
		ps.push(Point.polar(r, Math.PI/2));
		var shp = new Geometry.Shape2(ps);
		shp.rotate(d.angle());
		shp.add(p1);
		return shp;
	};
	Geometry.Shape2 = function(){
		var args = arguments;
		this.ps = [];
		this.data = {};
		this._set(args);
		this.c = new Color('#dd88ff');
		this.coreectIn2d = true;
	};
	Object.assign(Geometry.Shape2.prototype, {
		closed: function(){
			return this.ps[this.ps.length-1].equals(this.ps[0]);
		},
		_clone: function(){
			var s = new this.constructor(this);
			s.data = this.data;
			return s;
		},
		set: function(){
			var a = arguments;
			for(var i=0;i<a.length;i++){
				if(a[i] instanceof Point){
					this.ps.push(a[i]._clone());
				}else if(a[i] instanceof Geometry.Shape2){
					this.get(a[i]);
				}else if(typeof a[i] == 'number' && typeof a[i+1] == 'number'){
					this.ps.push(new Point(a[i], a[i+1]));
					i++;
				}else if(Array.isArray(a[i])){
					this._set(a[i]);
				}
			}
		},
		get: function(shape2){
			for (var i = shape2.ps.length - 1; i >= 0; i--) {
				this.ps[i] = shape2.ps[i]._clone();
			}
		},
		_ps: function(){
			var ps = [];
			for (var i = this.ps.length - 1; i >= 0; i--) {
				ps[i] = this.ps[i]._clone();
			}
			return ps;
		},
		longestLine: function(){
			if(this.ps.length<2){return null;}
			var l = new Geometry.Line2(this.ps[0], this.ps[1]);
			for(var i=1;i<this.ps.length-1;i++){
				var ll = (new Geometry.Line2(this.ps[i], this.ps[i+1]));
				if(ll.mag()>l.mag()){l = ll._clone();}
			}
			return l;
		},
		_set: function(a){
			function isA(a){
				return typeof a != 'undefined' && typeof a.length == 'number' && a.length>=0;
			}
			for(var i=0;i<a.length;i++){
				if(a[i] instanceof Point){
					this.ps.push(a[i]._clone());
				}else if(a[i] instanceof Geometry.Shape2){
					this.get(a[i]);
				}else if(typeof a[i] == 'number' && typeof a[i+1] == 'number'){
					this.ps.push(new Point(a[i], a[i+1]));
					i++;
				}else if(isA(a[i])){
					for(var j=0;j<a[i].length;j++){
						if(a[i][j] instanceof Point){
							this.ps.push(a[i][j]._clone());
						}else if(a[i][j] instanceof Geometry.Shape2){
							this.get(a[i][j]);
						}else if(typeof a[i][j] == 'number' && typeof a[i][j+1] == 'number'){
							this.ps.push(new Point(a[i][j], a[i][j+1]));
							j++;
						}else if(isA(a[i][j])){
							this._set(a[i][j]);
						}
					}
				}
			}
		},
		insertPoint: function(p, end){
			if(end == undefined){end = false;}
			if(!(p instanceof Geometry.Point2)){console.warn('Failed to insertPoint: first argument has to be an instance of Geometry.Point2');return;}
			if(end){this.ps.push(p);return;}
			var data = this.closestPointAround(p);
			var id = data.id;
			var ps = this._ps();
			this.ps[id] = p._clone();
			for(var i=id;i<ps.length;i++){
				this.ps[i+1] = (ps[i]._clone());
			}
		},
		_lines: function(){
			var ls = [];
			for(var i=0;i<this.ps.length-1;i++){
				ls.push(new Geometry.Line2(this.ps[i], this.ps[i+1]));
			}
			return ls;
		},
		closestPointAround: function(p){
			if(this.ps.length == 0){return null;}
			if(this.ps.length == 1){return this.ps[0]._clone();}
			var _p = this.ps[0]._clone(), m = Point.sub(this.ps[0], p).mag(), j = 0;
			for (var i = this.ps.length - 1; i >= 1; i--) {
				var _p1 = this.ps[i]._clone(), m1 = Point.sub(this.ps[i]._clone(), p).mag();
				if(m1<m){_p = _p1._clone(), m = m1;j=i;}
			}
			return {p: _p, id: j, dist: m};
		},
		in: function(obj){
			if(obj instanceof Geometry.Shape2){
				var l1 = this._lines(), l2 = obj._lines();
				for(var i=0;i<l1.length;i++){
					for(var j=i+1;j<l2.length;j++){
						if(l1[i].in(l2[j])){return true;}
					}
				}
				return false;
			}else{
				return obj.in(this);
			}
		},
		rotateAround: function(a, p){
			if(p == undefined){p = this.center();}
			for (var i = this.ps.length - 1; i >= 0; i--) {
				this.ps[i].sub(p);
				this.ps[i].rotate(a);
				this.ps[i].add(p);
			}
		},
		rotate: function(a){
			for (var i = this.ps.length - 1; i >= 0; i--) {
				this.ps[i].rotate(a);
			}
		},
		add: function(a,b){
			if(a instanceof Point){
				var c = a._clone();
			}else{
				var c = new Point(a,b);
			}
			for (var i = this.ps.length - 1; i >= 0; i--) {
				this.ps[i].add(c);
			}
		},
		sub: function(a,b){
			if(a instanceof Point){
				var c = a._clone();
			}else{
				var c = new Point(a,b);
			}
			for (var i = this.ps.length - 1; i >= 0; i--) {
				this.ps[i].sub(c);
			}
		},
		mul: function(a,b){
			if(a instanceof Point){
				var c = a._clone();
			}else{
				var c = new Point(a,b);
			}
			for (var i = this.ps.length - 1; i >= 0; i--) {
				this.ps[i].mul(c);
			}
		},
		scale: function(a,b){
			if(a instanceof Point){
				var c = a._clone();
			}else{
				var c = new Point(a,b);
			}
			for (var i = this.ps.length - 1; i >= 0; i--) {
				this.ps[i].scale(c);
			}
		},
		most: function(str){
			if(this.ps.length == 0){return null;}
			var p = this.ps[0]._clone();
			if(this.ps.length == 1){return p;}
			if(str == 'down'){
				for(var i=1;i<this.ps.length;i++){
					if(this.ps[i].y>p.y){p = this.ps[i]._clone();}
				}
			}else if(str == 'up'){
				for(var i=1;i<this.ps.length;i++){
					if(this.ps[i].y<p.y){p = this.ps[i]._clone();}
				}
			}else if(str == 'right'){
				for(var i=1;i<this.ps.length;i++){
					if(this.ps[i].x>p.x){p = this.ps[i]._clone();}
				}
			}else if(str == 'left'){
				for(var i=1;i<this.ps.length;i++){
					if(this.ps[i].x<p.x){p = this.ps[i]._clone();}
				}
			}
			return p;
		},
		area: function(){
			/* Gauss's area formula */
			if(this.coreectIn2d && this.closed()){
				var a = 0;
				for(var i=0;i<this.ps.length;i++){
					var j = (i+1)%this.ps.length;
					a+=this.ps[i].x*this.ps[j].y-this.ps[i].y*this.ps[j].x;
				}
				return a/2;
			}else{
				var a = 0;
				for(var i=0;i<this.ps.length;i++){
					var j = (i+1)%this.ps.length;
					var l = new Geometry.Line2(this.ps[i], this.ps[j]);
					a+=l.mag();
				}
				return a;
			}
		},
		center: function(){
			if(!this.coreectIn2d || !this.closed()){
				var d = new Point();
				for(var i=0;i<this.ps.length;i++){
					var j = (i+1)%this.ps.length;
					var l = new Geometry.Line2(this.ps[i], this.ps[j]);
					var c = l.center();
					d.add(c.scale(l.mag()));
				}
				return d.scale(1/this.area());
			}
			var c = new Point(), area = this.area();
			for(var i=0;i<this.ps.length;i++){
				var j = (i+1)%this.ps.length;
				c.x+=(this.ps[i].x+this.ps[j].x)*(this.ps[i].x*this.ps[j].y-this.ps[i].y*this.ps[j].x);
				c.y+=(this.ps[i].y+this.ps[j].y)*(this.ps[i].x*this.ps[j].y-this.ps[i].y*this.ps[j].x);
			}
			c.x/=area*6, c.y/=area*6;
			return c;
		},
		stroke: function(a,b,c,d){
			this.c = global.toHexColor(a,b,c,d);
		},
		draw: function(tool, fill){
			if(tool == undefined){console.warn('No tool passed on');return;}
			tool.stroke(this.c);
			tool.strokeWeight(1);
			if(fill && this.ps[this.ps.length-1].equals(this.ps[0])){tool.fill(this.c);}
			else{tool.noFill();}
			tool.beginShape();
			for(var i=0;i<this.ps.length;i++){
				tool.vertex(this.ps[i]);
			}
			tool.endShape();
		}
	});
	function cc(d){
		var o = {
			elestic: 0,
			tensileA: 0,
			tensileB: 0,
			repulsion: 1.5,
			w0: -128, 
			w1: 2.3, 
			u: 0.6, 
			powder: 0, 
			mixColors: false, 
			pressure: 0.15
		};
		for(var k in d){if(k in o){o[k] = d[k];}}
		return o;
	}
	Physics.ParticleGroup = function(){
		this.cc = cc();
		this.data = {};
	};
	Object.assign(Physics.ParticleGroup, {
	});
	Physics.Particle = function(x,y,g){
		this.p = new Point(x,y);
		this.v = new Point();
		this.c = new Color(120,120,250,255);
		this.r = 5.6;
		this.w = 0;
		this.density = 1;
		this.data = {};
		this.fixed = false;
		this.s = new Point();
		this.group = g;
	};
	Object.assign(Physics.Particle.prototype, {
		constrainVel: function(max){
			if(this.v.mag()>max){
				this.v.set(Point.scale(this.v.normalized(), max));
			}
		},
		mixColors: function(b, dt){
			if(dt == undefined){dt = 1;}
			var d = Point.sub(b.p, this.p);
			var a1 = d.angle();
			var a2 = this.v.angle();
			var a3 = b.v.angle();
			var u = Math.abs(this.v.mag()*Math.cos(a1-a2))+Math.abs(b.v.mag()*Math.cos(a1-a3));
			this.c.mix(b.c, dt*u/(u+1.5e3));
		},
		fill: function(a,b,c,d){
			this.c.set(a,b,c,d);
		},
		getArea: function(){
			return Math.PI*this.r*this.r;
		},
		getMass: function(){
			return this.density*this.getArea();
		},
		setMass: function(mass){
			this.density = mass/this.getArea();
		},
		applyForce: function(f, scl){
			if(this.fixed){return;}
			if(scl == undefined){scl = 1;}
			var m = this.getMass();
			this.v.add(Point.scale(f, scl/m));
		},
		_clone: function(){
			var p = new Physics.Particle();
			p.r = this.r;
			p.w = this.w;
			p.data = this.data;
			p.fixed = this.fixed;
			p.group = this.group;
			p.density = this.density;
			p.c = this.c._clone();
			p.s = this.s._clone();
			p.p = this.p._clone();
			p.v = this.v._clone();
			return p;
		},
		update: function(dt){
			if(dt == undefined){dt = 1;}
			if(this.fixed){this.v.set(0,0);}
			this.p.add(Point.scale(this.v, dt));
		},
		draw: function(tool){
			if(tool == undefined){console.warn('No tool passed on');return;}
			if(this.r<4){
				this.c.a = 144;
				tool.noStroke();
				tool.fill(this.c);
				tool.ellipse(this.p.x,this.p.y,this.r,this.r);
			}else{
				this.c.a = 255;
				tool.noFill();
				tool.stroke(this.c);
				var p1 = Point.polar(this.r, 0, this.p);
				var p2 = Point.polar(this.r, Math.PI*2/3, this.p);
				var p3 = Point.polar(this.r,  Math.PI*4/3, this.p);
				tool.triangle(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
			}
		}
	});
	Physics.Obj = function(shape){
		this.data = {};
		this.shape = (shape instanceof Geometry.Shape2) ? shape._clone() : new Geometry.Shape2(arguments);
		this.attachments = [];
		this.v = new Geometry.Point2();
		this.av = 0;
		this.fixed = false;
		this.fillin = false;
		this.density = 1;
	};
	Object.assign(Physics.Obj.prototype, {
		constrainVel: function(max){
			if(this.v.mag()>max){
				this.v.set(Point.scale(this.v.normalized(), max));
			}
		},
		center: function(){
			return this.shape.center();
		},
		getArea: function(){
			return this.shape.area();
		},
		getMass: function(){
			return this.getArea()*this.density;
		},
		setMass: function(mass){
			this.density = mass/this.getArea();
		},
		update: function(dt){
			if(dt == undefined){dt = 1;}
			if(this.fixed){this.v.set(0,0);}
			this.shape.add(Point.scale(this.v, dt));
			this.shape.rotateAround(this.av*dt);
		},
		draw: function(tool){
			this.shape.draw(tool, this.fillin);
		},
		_clone: function(){
			var o = new this.constructor(this);
			o.data = this.data;
			return o;
		},
		rotateAround: function(a, p){
			this.shape.rotateAround(a, p);
		},
		rotate: function(a){
			this.shape.rotate(a);
		},
		getVelAt: function(p){
			var d = Point.sub(this.shape.center(), p);
			var m = d.mag();
			return [this.v._clone(), (Point.polar(m*this.av, d.angle()+Math.PI/2))];
		},
		applyForce: function(f, p, scl){
			if(this.fixed){return;}
			if(scl == undefined){scl = 1;}
			var _f = f._clone(), c = this.center();
			_f.scale(scl);
			var d = Point.sub(p, c), a = d.angle();
			var n = d.normalized();
			_f.changeAxis(a);
			var m1 = _f.x, m2 = _f.y;
			var mass = this.getMass();
			this.v.add(Point.scale(n, m1/mass));
			this.av+=-m2/mass/180;
		}
	});
	Object.assign(Physics.Obj, {
		attach: function(type, obj1, obj2){
		}
	});
	Physics.World2 = function(){
		this.data = {};
		this.ps = [];
		this.os = [];
		this.fr = 0;
		this.dt = 1;
		this.scl = 1;
		this.cc = cc();
		this.pfr = 0.997;
		this.gravity = new Geometry.Point2();
		this.m = new Geometry.Point2();
		if(global.center != undefined){this.c = global.center._clone();}
		else{this.center = new Point2();}
		this.cutOffs = {};
	};
	Object.assign(Physics.World2.prototype, {
		_ps: function(){
			var ps = [];
			for (var i = this.ps.length - 1; i >= 0; i--) {
				ps[i] = this.ps[i]._clone();
			}
			return ps;
		},
		getPs: function(ps){
			for (var i = ps.length - 1; i >= 0; i--) {
				this.ps[i] = ps[i]._clone();
			}
		},
		update: function(){
			this.solve();
			for (var i = this.ps.length - 1; i >= 0; i--) {
				if(this.pfr){this.ps[i].v.scale(this.pfr);}
				this.ps[i].v.add(Point.scale(this.gravity, this.dt));
				this.ps[i].update(this.dt);
				this.ps[i].w = 0;
				this.ps[i].s = new Point();
			}
			for (var i = this.os.length - 1; i >= 0; i--) {
				this.os[i].v.add(Point.scale(this.gravity, this.dt));
				this.os[i].update(this.dt);
			}
		},
		draw: function(tool){
			if(tool == undefined){console.log('No tool');return;}
			tool.translate(this.m);
			tool.translate(this.c);
			tool.scale(this.scl);
			for (var i = this.ps.length - 1; i >= 0; i--) {
				for(var k in this.cutOffs){
					if(k == 'down'){
						if(this.ps[i].p.y-this.ps[i].r>this.cutOffs[k]){this.ps.splice(i,1);break;}
					}else if(k == 'up'){
						if(this.ps[i].p.y+this.ps[i].r<this.cutOffs[k]){this.ps.splice(i,1);break;}
					}else if(k == 'left'){
						if(this.ps[i].p.x+this.ps[i].r<this.cutOffs[k]){this.ps.splice(i,1);break;}
					}else if(k == 'right'){
						if(this.ps[i].p.y-this.ps[i].r>this.cutOffs[k]){this.ps.splice(i,1);break;}
					}
				}
				if(this.ps[i]){this.ps[i].draw(tool);}
			}
			for (var i = this.os.length - 1; i >= 0; i--) {
				this.os[i].draw(tool);
			}
			tool.pop();
		},
		addParticles: function(){
			for (var i = 0; i < arguments.length; i++) {
				this.ps.push(arguments[i]._clone());
			}
		},
		addGroup: function(g){
		},
		addObj: function(obj){
			this.os.push(obj);
		},
		solve: function(){
			if(this.ps.length<1 && this.os.length < 1){return;}
			var ps = this._ps();
			var sp = ps._sort();
			var me = this;
			function _fp1(data){
				var dp = Point.sub(me.ps[data.id2].p, me.ps[data.id1].p);
				var n = dp.normalized();
				var m = dp.mag(), D = data.obj1.r+data.obj2.r;
				if(m<D){
					var w = 1-m/D;
					data.obj1.w+=w;
					data.obj2.w+=w;
					var v = (1-w)*w;
					data.obj1.s.add(Point.scale(n, v));
					data.obj2.s.sub(Point.scale(n, v));
				}
			}
			function _fp2(data){
				// https://docs.google.com/presentation/d/1fEAb4-lSyqxlVGNPog3G1LZ7UgtvxfRAwR0dwd19G4g/edit#slide=id.g343a5269c_00
				var dp = Point.sub(me.ps[data.id2].p, me.ps[data.id1].p);
				var dv = Point.sub(me.ps[data.id2].v, me.ps[data.id1].v);
				var n = dp.normalized();
				var m = dp.mag(), D = data.obj1.r+data.obj2.r;
				if(m<D){
					var w = 1-m/D, gg = null;
					var sg = (data.obj1.group == data.obj2.group) && data.obj1.group != null;
					if(sg){gg = data.obj1.group;}
					var w0 = sg == true ? gg.cc.w0 : me.cc.w0;
					var pressure = sg == true ? gg.cc.pressure : me.cc.pressure;
					var repulsion = sg == true ? gg.cc.repulsion : me.cc.repulsion;
					var mixColors = sg == true ? gg.cc.mixColors : me.cc.mixColors;
					var u = sg == true ? gg.cc.u : me.cc.u;
					if(me.cc.powder>0 || (sg && gg.cc.powder>0)){
						var powder = sg == true ? gg.cc.powder : me.cc.powder;
						var w1 = sg == true ? gg.cc.w1 : me.cc.w1;
						var tf = Math.max(0, w-w1)*w1*me.dt*powder;
					}else{
						var h1 = Math.max(0, (data.obj1.w-w0)*pressure);
						var h2 = Math.max(0, (data.obj2.w-w0)*pressure);
						var tf = (h1+h2)*repulsion*w*me.dt;
					}
					data.obj1.applyForce(n, -tf);
					data.obj2.applyForce(n, tf);
					var vf = u*me.dt;
					data.obj1.applyForce(dv, vf)
					data.obj2.applyForce(dv, -vf)
					if(mixColors){data.obj1.mixColors(data.obj2, me.dt);}
					var ta = sg == true ? gg.cc.tensileA : me.cc.tensileA;
					var tb = sg == true ? gg.cc.tensileB : me.cc.tensileB;
					var A = ta * (data.obj2.w+data.obj1.w - 2*w0);
					var B = tb * (Point.sub(data.obj2.s, data.obj1.s).dot(n));
					var tvf = -me.dt*(A+B);
					data.obj1.applyForce(n, -tvf)
					data.obj2.applyForce(n, tvf)
				}
			}
			Array._sortLoop(_fp1, sp);
			Array._sortLoop(_fp2, sp);
			if(this.os.length < 1){this.getPs(ps);return;}
			// disintegrate
			var lines = [];
			for (var i = this.os.length - 1; i >= 0; i--) {
				for (var j =  0; j < this.os[i].shape.ps.length - 1; j++) {
					var l = new Geometry.Line2(this.os[i].shape.ps[j], this.os[i].shape.ps[j+1]);
					l.p = l.center(), l.r = l.mag()/2, l.obj = this.os[i];
					l.p1.obj = l, l.p2.obj = l;
					lines.push(l);
				}
			}
			if(this.ps.length>0){
				for (var i = lines.length - 1; i >= 0; i--) {
					var l = lines[i], maxD = sp.maxD, all = sp.all, minP = sp.minP;
					var times = Math.ceil(l.r/maxD)*2, p = 'p';
					if(times%2 == 0){
						// is even
						var a = times/2-1;
						var b = times/2;
					}else{
						// is odd
						var a = Math.floor(times/2);
						var b = a;
					}
					if(times%2 == 0){
						var y = Math.floor((l[p].y-minP.y-maxD/2)/maxD);
						var x = Math.floor((l[p].x-minP.x-maxD/2)/maxD);
					}else{
						var y = Math.floor((l[p].y-minP.y)/maxD);
						var x = Math.floor((l[p].x-minP.x)/maxD);
					}
					for(var py=y-a;py<=y+b;py++){
						if(!all[py]) continue;
						for(var px=x-a;px<=x+b;px++){
							if(!all[py][px]) continue;
							for (var j = all[py][px].length - 1; j >= 0; j--) {
								var j0 = all[py][px][j];
								var p2 = j0.obj;
								var _p2 = me.ps[j0.id];
								var _p = _p2.p;
								var data = l.getDataOnPoint(_p);
								var vm = (_p2.v.mag());
								if(data.dist>p2.r+vm) continue;
								var vv = l.obj.getVelAt(_p);
								var vd = Point.sub(vv[0], _p2.v);
								var d = Point.sub(data.p, _p);
								var n = d.normalized();
								var gg = (p2.group != null) ? p2.group : me;
								var w = 1-data.dist/(p2.r+vm);
								var h1 = Math.max(0, (p2.w-gg.cc.w0)*gg.cc.pressure);
								var vT = vm*Math.abs(Math.sin(_p2.v.angle()-l.angle()));
								var s = Math.pow(w, 2)*gg.cc.repulsion*h1*69;
								p2.applyForce(n, -s*me.dt);
								p2.applyForce(vd, gg.cc.u*me.dt);
								l.obj.applyForce(vd, data.p, -gg.cc.u*me.dt);
								l.obj.applyForce(n, data.p, s*me.dt);
							}
						}
					}
				}
			}
			this.getPs(ps);
			var op = lines._sort();
			function _fo1(data){
				var l1 = data.obj1, l2 = data.obj2;
				var obj1 = l1.obj, obj2 = l2.obj;
				if(obj1 != obj2){
					var points = [l1.p1, l1.p2, l2.p1, l2.p2];
					var lines = [l1, l2];
					for(var ip=0;ip<points.length;ip++){
						for(var il=0;il<lines.length;il++){
							if(points[ip].obj == lines[il]){continue;}
							var d = lines[il].getDataOnPoint(points[ip]);
							var l = lines[il], p = points[ip];
							var obj1 = l.obj, obj2 = p.obj.obj;
							var md = 3;
							if(d.dist<md){
								var dd = Point.sub(p, obj2.center());
								var a1 = l.angle(), a2 = dd.angle();
								var v1 = obj1.getVelAt(p), v2 = obj2.getVelAt(p);
								var depth = 1-d.dist/md;
								var wd = Math.pow(depth, 5);
								var ddd = md-d.dist;
								var m2 = dd.mag();
								var mass1 = obj1.getMass(), mass2 = obj2.getMass();
								var n = Point.sub(d.p, p).normalized();
								var vln = Point.sub(v2[0], v1[0]).dot(n);
								if(vln > 0){return;}
								var j = -4*vln*ddd;
								j /= 1/mass1 + 1/mass2;
								obj1.v.sub(Point.scale(n, 1 / mass1 * j));
  								obj2.v.add(Point.scale(n, 1 / mass2 * j));
  								var pers = 0.6, slop = 0.01;
  								var scl = Math.max(0, ddd-slop)/(1/mass1 + 1/mass2)*pers;
  								if(!obj1.fixed) obj1.shape.sub(Point.scale(n, 1 / mass1 * scl));
  								if(!obj2.fixed) obj2.shape.add(Point.scale(n, 1 / mass2 * scl));
								//obj1.applyForce(n, d.p, -j);
								//obj2.applyForce(n, p, j);
								return;
								var mass = obj1.getMass()+obj2.getMass();
								var ref = v1[0];
								var scl = mass*wd*me.dt*Math.abs(Math.sin(ref.angle()-a2));
								obj1.applyForce(ref, d.p, -scl);
								obj2.applyForce(ref, p, scl);

								var ref = v2[0];
								scl = mass*wd*me.dt*Math.abs(Math.cos(ref.angle()-a1));
								obj1.applyForce(ref, d.p, scl);
								obj2.applyForce(ref, p, -scl);
								//
								var ref = v1[1];
								scl = 4*-mass*wd*me.dt*Math.abs(Math.sin(ref.angle()-a2));
								obj1.applyForce(ref, d.p, -scl);
								obj2.applyForce(ref, p, scl);

								var ref = v2[1];
								scl = 4*-mass*wd*me.dt*Math.abs(Math.cos(ref.angle()-a1));
								obj1.applyForce(ref, d.p, scl);
								obj2.applyForce(ref, p, -scl);								
							}
						}
					}
				}
			}
			Array._sortLoop(_fo1, op);
		}
	});
	global.Geometry = Geometry, global.Physics = Physics;
})(this);