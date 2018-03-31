(function(global){
	// need Draw.js to draw
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
		var minP = arr[0][p].copy();
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
		if(arguments.length == 2){
			return Math.sqrt(Math.pow(y1.x-x1.x,2)+Math.pow(y1.y-x1.y,2));
		}
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	};
	global.dist3 = function(x1,y1,z1,x2,y2,z2){
		if(arguments.length == 2 && x1 instanceof Geometry.Point3){
			return Math.sqrt(Math.pow(y1.x-x1.x,2)+Math.pow(y1.y-x1.y,2)+Math.pow(y1.z-z1.z,2));
		}
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)+Math.pow(z2-z1,2));
	};
	global.randomFloat = function(a, b){
		return a+Math.random()*(b-a);
	};
	var Geometry = {}, Physics = {};
	if(typeof global.Point == 'undefined'){
		global.Point = function(x,y){
			if(!y && x instanceof Point){this.x = x.x; this.y = x.y; }else{this.x = x || 0; this.y = y || 0; } return this; };
		Object.assign(global.Point.prototype, {set: function(x,y){if(!y && x instanceof Point){this.x = x.x; this.y = x.y; }else{this.x = x || 0; this.y = y || 0; } return this; }, copy: function(){return new this.constructor(this.x,this.y); }, scale: function(s){this.x*=s; this.y*=s; return this; }, scale0: function(s){return Point.scale(this, s); }, inverse: function(){return new Point(1/this.x,1/this.y); }, minus: function(){return new Point(-this.x,-this.y); }, dot: function(v){return this.x*v.x+this.y*v.y; }, mul: function(v){this.x = this.x*v.x+this.y*v.y, this.y = this.x*v.y+this.y*v.x; return this; }, add: function(v,w){if(w){this.x+=v; this.y+=w; }else{this.x+=v.x; this.y+=v.y; } return this; }, sub: function(v,w){if(w){this.x-=v; this.y-=w; }else{this.x-=v.x; this.y-=v.y; } return this; }, cross: function(v){return this.x*v.y-this.y*v.x; }, floor: function(){this.x = Math.floor(this.x); this.y = Math.floor(this.y); return this; }, round: function(){this.x = Math.round(this.x); this.y = Math.round(this.y); return this; }, ceil: function(){this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); return this; }, mag: function(){return Math.mag(this.x,this.y); }, roundToZero: function(){this.x = (this.x<0) ? Math.ceil(this.x) : Math.floor(this.x); this.y = (this.y<0) ? Math.ceil(this.y) : Math.floor(this.y); return this; }, normalize: function(){this.x/=this.mag(); this.y/=this.mag(); return this; }, normalized: function(){var v = this.copy(), m = this.mag(); v.x/=m; v.y/=m; return v; }, angle: function(){var a = Math.atan2(this.y,this.x); if(a<0) a+=2*Math.PI; return a; }, lerp: function(v,a){this.x = (v.x-this.x)*a; this.y = (v.y-this.y)*a; return this; }, equals: function(v){return ((v.x == this.x) && (v.y == this.y)); }, rotate: function(a){var a0 = this.angle()+a; var m = this.mag(); this.x = Math.cos(a0)*m; this.y = Math.sin(a0)*m; return this; }, rotateAround: function(x,y,a){if(a == undefined && x instanceof Point){var p = x.copy(); a = y; this.sub(p); this.rotate(a); this.add(p); }else{var p = new Point(x,y); this.sub(p); this.rotate(a); this.add(p); } }, changeAxis: function(angle){var m = this.mag(); var a0 = angle-this.angle(); this.set(Point.polar(m, a0)); return this; }, isZero: function(){return this.x == 0 && this.y == 0; }, random: function(a,b,c,d){if(c == undefined){if(a == undefined){this.x = randomFloat(-1,1); this.y = randomFloat(-1,1); return; } if(b == undefined){this.x = randomFloat(-a,a); this.y = randomFloat(-a,a); return; } this.x = randomFloat(a,b); this.y = randomFloat(a,b); return; }else{this.x = randomFloat(a,b); this.y = randomFloat(c,d); return; } }, get: function(p){this.x = p.x, this.y = p.y;}, constrain: function(a,b,c,d){if(c == undefined){if(a == undefined){this.x = constrain(this.x,-1,1); this.y = constrain(this.y,-1,1); return; } if(b == undefined){a = Math.abs(a); var n = this.normalized().scale(a); if(this.mag()>a) this.x = n.x, this.y = n.y; return; } this.x = constrain(this.x,a,b); this.y = constrain(this.y,a,b); return; }else{this.x = constrain(this.x,a,b); this.y = constrain(this.y,c,d); return; } } }); 
	}
	Geometry.Point2 = global.Point;
	global.Clock = function(){this.time = 0; this.running = true; this.start = Date.now(); this.lastRecordTime = this.start; }; Object.assign(global.Clock.prototype, {set: function(start){this.time+=(this.time-start); this.start = start; }, update: function(){if(this.running) this.time+=Date.now()-this.lastRecordTime; this.lastRecordTime = Date.now(); }, reset: function(){this.set(Date.now()); }, _clone: function(){var clock = new Clock(); clock.time = this.time, clock.lastRecordTime = this.lastRecordTime, clock.start = this.start, clock.running = this.running; return clock; } });
	/********************************************/
	Geometry.Point3 = function(a,b,d){
		if(a instanceof Geometry.Point3){
			this.get(a);
		}else{
			this.x = a, this.y = b, this.z = d;
		}
	};
	Object.assign(Geometry.Point3.prototype, {
		get: function(p){
			this.x = p.x, this.y = p.y, this.z = p.z;
		},
		set: function(x,y,z){
			this.x = x, this.y = y, this.z = z;
		},
		add: function(a,b,c){
			if(a instanceof Geometry.Point3){
				this.x+=a.x, this.y+=a.y, this.z+=a.z;
			}else{
				this.x+=a, this.y+=b, this.z+=c;
			}
		},
		scale: function(a,b,c){
			if(typeof c == 'number'){
				this.x*=a, this.y*=b, this.z*=c;
			}else if(a instanceof Geometry.Point3){
				this.x*=a.x, this.y*=a.y, this.z*=a.z;
			}else if(typeof a == 'number'){
				this.x*=a, this.y*=a, this.z*=a;
			}
		},
		sub: function(a,b,c){
			if(a instanceof Geometry.Point3){
				this.x-=a.x, this.y-=a.y, this.z-=a.z;
			}else{
				this.x-=a, this.y-=b, this.z-=c;
			}
		},
		rotate: function(){}
	});
	Geometry.Line2 = function(a,b,c,d){
		if(a instanceof Point || a instanceof Geometry.Point2){
		}
	};
	Geometry.Line3 = function(a,b,c,d,e,f){
	};
	Geometry.Shape = function(){
	};
	Physics.ParticleGroup = function(){

	};
	Physics.Particle = function(){

	};
	Physics.Obj = function(){

	};
	Physics.World2 = function(){

	};
	global.Geometry = Geometry, Physics = Physics;
})(this);