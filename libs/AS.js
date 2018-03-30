/*****************************
	Author: Arthur Sun
	Use: -----
	* * * * * *
	- modules -
/*****************************/
document.body.style.fontSize = "21px";
document.body.style.fontFamily = "monospace";
function createCanvas(id, w = window.innerWidth, h = window.innerHeight, sl){
	if(arguments.length == 2){
		w = window.innerWidth*arguments[1];
		h = window.innerHeight*arguments[1];
	}
	var ele = document.createElement("canvas");
	var t = window.innerHeight-h;
	ele.style = sl || "border: dashed 1px #000000;margin-top: "+t/2+"px";
	ele.width = w, ele.height = h;
	ele.id = id;
	document.body.appendChild(ele);
	ele.style.cursor = 'crosshair';
	return ele;
}
function Eq(){
	var a = arguments;
	if(a.length == 0){
		return new Function('x', 'return x');
	}else if(a.length == 1){
		return new Function('x', 'return '+a[0]);
	}
}
function isArray(obj){
	if(typeof obj == "object" && (obj.length || typeof obj.push == "function")){
		return true;
	}else{
		return false;
	}
}
Array.prototype.clone = function(){
	var arr = [];
	for(var i=0;i<this.length;i++){
		var o = this[i];
		if(typeof o == 'object'){
			arr[i] = o.clone();
		}else{
			arr[i] = this[i];
		}
	}
	return arr;
};
Object.prototype.clone = function(){
	var obj = {}, me = this;
	for(var key in me){
		if(typeof this[key] == 'object'){
			obj[key] = this[key].clone();
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
	gl._primes = function(){
		var p = [2];
		for(var i=0;i<1e4-1;i++){
			var g = p[p.length-1];
			g++;
			while(!Math.isPrime(g)){g++;}
			p.push(g);
		}
		function ii(n){
			return (Math.abs(Math.round(n)-n)<Math.dx) ? true : false;
		}
		gl.primes = p;
		function c(){
			gl.Math.isPrime = function(num){
				num = Math.floor(Math.abs(num));
				if(Math.abs(num)<=1) return false;
				var n = Math.sqrt(num);
				for(var i=0;i<n;i++){
					if(n>p[p.length-1]){
						if(ii(num/i)) return false;
					}else{
						if(ii(num/p[i]) && num != p[i]) return false;
					}
				}
				return true;
			};
		}
		c();
		for(var i=0;i<9e4;i++){
			var g = p[p.length-1];
			g++;
			while(!Math.isPrime(g)){g++;}
			p.push(g);
		}
		gl.primes = p;
		c();
	};
})(this);
function primeFactor(n){
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
}
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
function toHexColor(r,g,b,a = 255){
	var _a = arguments;
	if(g == undefined && r != undefined){
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
}
function mixColors(a, b, k){
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
}
function hexToNumber(str){
	if(str.length<9) str[7] = 'f', str[8] = 'f';
	return [str.substring(1,3), str.substring(3,5), str.substring(5,7), str.substring(7,9)];
}
function constrain(value, min, max){
	if(value<=min) return min;
	if(value>=max) return max;
	else return value;
}
function map(value, l1, h1, l2, h2) {
	return l2+(h2-l2)*(value-l1)/(h1-l1);
}
function dist(x1,y1,x2,y2){
	if(arguments.length == 2){
		return Math.sqrt(Math.pow(y1.x-x1.x,2)+Math.pow(y1.y-x1.y,2));
	}
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function randomFloat(a, b){
	return a+Math.random()*(b-a);
}
function Clock(){
	this.time = 0;
	this.running = true;
	this.start = Date.now();
	this.lastRecordTime = this.start;
}
Object.assign(Clock.prototype, {
	set: function(start){
		this.time+=(this.time-start);
		this.start = start;
	},
	update: function(){
		if(this.running) this.time+=Date.now()-this.lastRecordTime;
		this.lastRecordTime = Date.now();
	},
	reset: function(){
		this.set(Date.now());
	},
	_clone: function(){
		var clock = new Clock();
		clock.time = this.time, 
		clock.lastRecordTime = this.lastRecordTime, 
		clock.start = this.start, 
		clock.running = this.running;
		return clock;
	}
});
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
function Point(x,y){
	if(!y && x instanceof Point){
		this.x = x.x;
		this.y = x.y;
	}else{
		this.x = x || 0;
		this.y = y || 0;
	}
	return this;
}
Object.assign(Point.prototype, {
	set: function(x,y){
		if(!y && x instanceof Point){
			this.x = x.x;
			this.y = x.y;
		}else{
			this.x = x || 0;
			this.y = y || 0;
		}
		return this;
	},
	copy: function(){
		return new this.constructor(this.x,this.y);
	},
	scale: function(s){
		this.x*=s;
		this.y*=s;
		return this;
	},
	scale0: function(s){
		return Point.scale(this, s);
	},
	inverse: function(){
		return new Point(1/this.x,1/this.y);
	},
	minus: function(){
		return new Point(-this.x,-this.y);
	},
	dot: function(v){
		return this.x*v.x+this.y*v.y;
	},
	mul: function(v){
		this.x = this.x*v.x+this.y*v.y,
		this.y = this.x*v.y+this.y*v.x;
		return this;
	},
	add: function(v,w){
		if(w){
			this.x+=v;
			this.y+=w;
		}else{
			this.x+=v.x;
			this.y+=v.y;
		}
		return this;
	},
	sub: function(v,w){
		if(w){
			this.x-=v;
			this.y-=w;
		}else{
			this.x-=v.x;
			this.y-=v.y;
		}
		return this;
	},
	cross: function(v){
		return this.x*v.y-this.y*v.x;
	},
	floor: function(){
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},
	round: function(){
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},
	ceil: function(){
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	},
	mag: function(){
		return Math.mag(this.x,this.y);
	},
	roundToZero: function(){
		this.x = (this.x<0) ? Math.ceil(this.x) : Math.floor(this.x);
		this.y = (this.y<0) ? Math.ceil(this.y) : Math.floor(this.y);
		return this;
	},
	normalize: function(){
		this.x/=this.mag();
		this.y/=this.mag();
		return this;
	},
	normalized: function(){
		var v = this.copy(), m = this.mag();
		v.x/=m;
		v.y/=m;
		return v;
	},
	angle: function(){
		var a = Math.atan2(this.y,this.x);
		if(a<0) a+=2*Math.PI;
		return a;
	},
	lerp: function(v,a){
		this.x = (v.x-this.x)*a;
		this.y = (v.y-this.y)*a;
		return this;
	},
	equals: function(v){
		return ((v.x == this.x) && (v.y == this.y));
	},
	rotate: function(a){
		var a0 = this.angle()+a;
		var m = this.mag();
		this.x = Math.cos(a0)*m;
		this.y = Math.sin(a0)*m;
		return this;
	},
	rotateAround: function(x,y,a){
		if(a == undefined && x instanceof Point){
			var p = x.copy();
			a = y;
			this.sub(p);
			this.rotate(a);
			this.add(p);
		}else{
			var p = new Point(x,y);
			this.sub(p);
			this.rotate(a);
			this.add(p);
		}
	},
	changeAxis: function(angle){
		var m = this.mag();
		var a0 = angle-this.angle();
		this.set(Point.polar(m, a0));
		return this;
	},
	isZero: function(){
		return this.x == 0 && this.y == 0;
	},
	random: function(a,b,c,d){
		if(c == undefined){
			if(a == undefined){
				this.x = randomFloat(-1,1);
				this.y = randomFloat(-1,1);
				return;
			}
			if(b == undefined){
				this.x = randomFloat(-a,a);
				this.y = randomFloat(-a,a);
				return;
			}
			this.x = randomFloat(a,b);
			this.y = randomFloat(a,b);
			return;
		}else{
			this.x = randomFloat(a,b);
			this.y = randomFloat(c,d);
			return;
		}
	},
	constrain: function(a,b,c,d){
		if(c == undefined){
			if(a == undefined){
				this.x = constrain(this.x,-1,1);
				this.y = constrain(this.y,-1,1);
				return;
			}
			if(b == undefined){
				a = Math.abs(a);
				var n = this.normalized().scale(a);
				if(this.mag()>a) this.x = n.x, this.y = n.y;
				return;
			}
			this.x = constrain(this.x,a,b);
			this.y = constrain(this.y,a,b);
			return;
		}else{
			this.x = constrain(this.x,a,b);
			this.y = constrain(this.y,c,d);
			return;
		}
	}
});
Object.assign(Point, {
	add: function(){
		var p = new Point();
		for(var i=0;i<arguments.length;i++){p.add(arguments[i]);}
		return p;
	},
	sub: function(a,b){
		return new Point(a.x-b.x,a.y-b.y);
	},
	scale: function(a,s){
		var a = a.copy();
		a.scale(s);
		return a;
	},
	mult: function(a,b){
		var a = a.copy();
		a.mult(b);
		return a;
	},
	dot: function(a,b){
		return a.dot(b);
	},
	cross: function(a,b){
		return a.cross(b);
	},
	mag: function(a){
		return a.mag();
	},
	normalize: function(a){
		var b = a.copy();
		return b.normalize();
	},
	angle: function(v){
		return v.angle();
	},
	equals: function(a,b){
		return a.equals(b);
	},
	floor: function(a){
		return a.copy().floor();
	},
	round: function(a){
		return a.copy().round();
	},
	ceil: function(a){
		return a.copy().ceil();
	},
	inverse: function(a){
		return new Point(1/a.x,1/a.y);
	},
	minus: function(a){
		return new Point(-a.x,-a.y);
	},
	polar: function(r,a){
		return new Point(Math.cos(a)*r,Math.sin(a)*r);
	},
	random: function(a,b,c,d){
		var p = new Point();
		p.random(a,b,c,d);
		return p;
	}
});
function Draw(space){
	this.space = space;
	this.fillColor = "#ffffffff";
	this.strokeColor = "#000000ff";
	this.lineWidth = 1;

	this._fill = true;
	this._stroke = true;
	this._textSize = 21;
	this._font = "monospace";
	this._textAlign = "center";

	this.tas = [];
	this.rectAlign = "corner";
	this.d = this.space.getContext("2d");
	this.d0 = this.space.getContext("2d");
	this.d1 = false;
}
Object.assign(Draw.prototype, {
	noStroke: function(){
		this._stroke = false;
	},
	noFill: function(){
		this._fill = false;
	},
	strokeWeight: function(w){
		this.lineWidth = w;
	},
	rectMode: function(m){
		this.rectAlign = m;
	},
	textAlign: function(a){
		this._textAlign = a;
	},
	textSize: function(s){
		this._textSize = s;
	},
	font: function(f){
		this._font = f;
	},
	stroke: function(r,g,b,a){
		this._stroke = true;
		this.strokeColor = toHexColor(r, g, b, a);
	},
	fill: function(r,g,b,a){
		this._fill = true;
		this.fillColor = toHexColor(r, g, b, a);
	},
	strokeSetA: function(obj){
		function t0(n){
			var a0 = Math.change(n,10,16);
			if(n<16) a0 = "0"+a0;
			return a0;
		}
		if(typeof obj == 'string'){
			this.strokeColor[7] = obj[0] || "f";
			this.strokeColor[8] = obj[1] || "f";
		}else if(typeof obj == 'number'){
			obj = constrain(obj, 0, 255);
			var str = t0(obj);
			this.strokeColor[7] = str[0];
			this.strokeColor[8] = str[1];
		}else{
			console.log('What did you enter?');
		}
	},
	fillSetA: function(){
		// copy of this.strokeSetA()
		function t0(n){
			var a0 = Math.change(n,10,16);
			if(n<16) a0 = "0"+a0;
			return a0;
		}
		if(typeof obj == 'string'){
			this.fillColor[7] = obj[0] || "f";
			this.fillColor[8] = obj[1] || "f";
		}else if(typeof obj == 'number'){
			obj = constrain(obj, 0, 255);
			var str = t0(obj);
			this.fillColor[7] = str[0];
			this.fillColor[8] = str[1];
		}else{
			console.log('What did you enter?');
		}
	},
	translate: function(x,y){
		if(!y && x instanceof Point){
			var _x = x.x;
			var _y = x.y;
		}else{
			var _x = x, _y = y;
		}
		var obj = {type: 'translate', x: _x, y: _y};
		var o1 = this.tas[this.tas.length-1];
		if(o1 && o1.type == 'translate' && o1.x == -obj.x && o1.y == -obj.y){
			this.tas.splice(this.tas.length-1, 1);
			return;
		}
		this.tas.push(obj);
	},
	rotate: function(a){
		var obj = {type: 'rotate', a: a};
		var o1 = this.tas[this.tas.length-1];
		if(o1 && o1.type == 'rotate' && o1.a == -obj.a){
			this.tas.splice(this.tas.length-1, 1);
			return;
		}
		this.tas.push(obj);
	},
	scale: function(x,y){
		if(y == undefined){
			y = x;
		}
		var obj = {type: 'scale', x: x, y: y};
		var o1 = this.tas[this.tas.length-1];
		if(o1 && o1.type == 'scale' && o1.x == 1/obj.x && o1.y == 1/obj.y){
			this.tas.splice(this.tas.length-1, 1);
			return;
		}
		this.tas.push(obj);
	},
	pop: function(){
		this.tas = [];
	},
	s0: function(){
		for(var i=0;i<this.tas.length;i++){
			if(this.tas[i].type == 'translate'){
				this.d.translate(this.tas[i].x, this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d.rotate(this.tas[i].a);
			}else if(this.tas[i].type == 'scale'){
				this.d.scale(this.tas[i].x, this.tas[i].y);
			}
		}
	},
	f0: function(){
		for(var i=this.tas.length-1;i>=0;i--){
			if(this.tas[i].type == 'translate'){
				this.d.translate(-this.tas[i].x, -this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d.rotate(-this.tas[i].a);
			}else if(this.tas[i].type == 'scale'){
				this.d.scale(1/this.tas[i].x, 1/this.tas[i].y);
			}
		}

	},
	s1: function(){
		for(var i=this.tas.length-1;i>=0;i--){
			if(this.tas[i].type == 'translate'){
				this.d0.translate(-this.tas[i].x, -this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d0.rotate(-this.tas.a);
			}else if(this.tas[i].type == 'scale'){
				this.d0.scale(1/this.tas[i].x, 1/this.tas[i].y);
			}
		}
	},
	f1: function(){
		for(var i=this.tas.length-1;i>=0;i--){
			if(this.tas[i].type == 'translate'){
				this.d0.translate(-this.tas[i].x, -this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d0.rotate(-this.tas.a);
			}else if(this.tas[i].type == 'scale'){
				this.d0.scale(1/this.tas[i].x, 1/this.tas[i].y);
			}
		}
	},
	line: function(x1,y1,x2,y2){
		d = this.space.getContext("2d");
		d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor;
		if(arguments.length == 2 && x1 instanceof Point && y1 instanceof Point){
			d.moveTo(x1.x,x1.y);
			d.lineTo(y1.x,y1.y);
		}else{
			d.moveTo(x1,y1);
			d.lineTo(x2,y2);
		}
		if(this._stroke) d.stroke();
		this.f0();
	},
	rect: function(x,y,w,h,r){
		if(!r){
			if(!this._fill && this._stroke){
				this.d.beginPath();
				this.s0();
				this.d.strokeStyle = this.strokeColor;
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.d.rect(x,y,w,h);
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
				this.d.stroke();
				this.f0();
			}
			if(!this._stroke && this._fill){
				this.d.beginPath();
				this.s0();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.d.fillStyle = this.fillColor;
				this.d.fillRect(x,y,w,h);
				this.d.stroke();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
				this.f0();
			}
			if(this._stroke && this._fill){
				this.d.beginPath();
				this.s0();
				if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
				this.d.fillStyle = this.fillColor;
				this.d.strokeStyle = this.strokeColor;
				this.d.rect(x,y,w,h);
				this.d.fillRect(x,y,w,h);
				this.d.stroke();
				this.d.fill();
				if(this.rectAlign == "center") this.d.translate(w/2,h/2);
				this.f0();
			}
		}else if(r){
			this.d.beginPath();
			this.s0();
			if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
			this.d.moveTo(x+r, y);
			this.d.lineTo(x+w-r, y);
			this.d.quadraticCurveTo(x+w, y, x+w, y+r);
			this.d.lineTo(x+w, y+h-r);
			this.d.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
			this.d.lineTo(x+r,y+h);
			this.d.quadraticCurveTo(x, y+h, x, y+h-r);
			this.d.lineTo(x, y+r);
			this.d.quadraticCurveTo(x,y,x+r,y);
			this.d.lineWidth = this.lineWidth;
			this.d.fillStyle = this.fillColor;
			this.d.strokeStyle = this.strokeColor;
			if(this._stroke) this.d.stroke();
			if(this._fill) this.d.fill();
			if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			this.f0();
		}
	},
	ellipse: function(x, y, w, h, a = 0, b = 2*Math.PI){
		this.d.beginPath();
		this.s0();
		this.d.ellipseMode = 'center';
		this.d.ellipse(x,y,w,h,0,a,b);
		this.d.lineWidth = this.lineWidth;
		this.d.fillStyle = this.fillColor;
		this.d.strokeStyle = this.strokeColor;
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	triangle: function(x1,y1,x2,y2,x3,y3){
		this.d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor;
		this.d.fillStyle = this.fillColor;
		this.d.moveTo(x1,y1); this.d.lineTo(x2,y2);
		this.d.moveTo(x2,y2); this.d.lineTo(x3,y3);
		this.d.moveTo(x3,y3); this.d.lineTo(x1,y1);
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	quad: function(x1,y1,x2,y2,x3,y3,x4,y4){
		this.d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor;
		this.d.fillStyle = this.fillColor;
		this.d.moveTo(x1,y1); this.d.lineTo(x2,y2);
		this.d.moveTo(x2,y2); this.d.lineTo(x3,y3);
		this.d.moveTo(x3,y3); this.d.lineTo(x4,y4);
		this.d.moveTo(x4,y4); this.d.lineTo(x1,y1);
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	text: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.fillStyle = this.fillColor;
		this.d.textAlign = this._textAlign;
		this.d.font = this._textSize+"px "+this._font;
		if(arguments.length == 2){
			this.d.fillText(t, x.x, x.y);
		}else{
			this.d.fillText(t, x, y);
		}
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f0();
	},
	strokeText: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.strokeStyle = this.strokeColor;
		this.d.textAlign = this._textAlign;
		this.d.font = this._textSize+"px "+this._font;
		if(arguments.length == 2){
			this.d.fillText(t, x.x, x.y);
		}else{
			this.d.strokeText(t, x, y);
		}
		if(this._stroke) this.d.stroke();
		this.f0();
	},
	beginShape: function(){
		this.d0.beginPath();
		this.s1();
		this.d1 = false;
	},
	vertex: function(x,y){
		if(!y && x instanceof Point){
			var _x = x;
			var y = _x.y;
			var x = _x.x;
		}
		if(this.d1){
			this.d0.moveTo(this.last.x,this.last.y);
			this.d0.lineTo(x,y);
			this.last = new Point(x,y);
		}else{
			this.d0.moveTo(x,y);
			this.d1 = true;
			this.last = new Point(x,y);
		}
	},
	endShape: function(){
		this.d0.lineWidth = this.lineWidth;
		this.d0.strokeStyle = this.strokeColor;
		this.d0.fillStyle = this.fillColor;
		if(this._stroke) this.d.stroke();
		if(this._fill) this.d.fill();
		this.f1();
		this.d1 = false;
	}
});
var Geometry = {};
var Physics = {};
Object.assign(Geometry, {
	pointsOfRect: function(x,y,w,h){
		if(!w && !h && x instanceof Point && y instanceof Point){
			var _x = x.copy(), _y = y.copy();
			x = _x.x; y = _x.y;
			w = _y.x; h = _y.y;
		}
		var points = [];
		points[0] = new Point(x-w/2,y-h/2);
		points[1] = new Point(x+w/2,y-h/2);
		points[3] = new Point(x-w/2,y+h/2);
		points[2] = new Point(x+w/2,y+h/2);
		return points;
	},
	pointsOnLine: function(x1,y1,x2,y2,s = 1){
		var points = [];
		var p1 = new Point(x1,y1), p2 = new Point(x2,y2);
		var d = Point.sub(p2,p1), m = d.mag(), a = d.angle();
		for(var i=0;i<=m;i+=s){
			points.push(Point.add(Point.polar(i, a), p1));
		}
		return points;
	},
	pointsOnCircle: function(x,y,r,_s = 0,_f = 2*Math.PI,d = 1){
		var points = [];
		var a = d/r;
		for(var _a = _s; _a<_f;_a+=a){
			points.push(new Point(Math.cos(_a)*r+x,Math.sin(_a)*r+y));
		}
		return points;
	},
	pointsOnFunction: function(f,a,b,dx = 1){
		var points = [];
		for(var i=a;i<b;i+=dx){
			points.push(new Point(i,f(i)));
		}
		return points;
	},
	Graph: function(){},
	Line: function(){},
	Shape: function(){}
});
Geometry.Graph = function(x,y,f){
	if(typeof x == "object"){
		this.origin = x.copy();
		this.f = y;
	}else{
		this.origin = new Point(x,y);
		this.f = f;
	}
	this.isComplexPlane = false;
	this.drawNumbers = true;
	this.numberScale = 1/40;
	this.rotation = 0;
	this.numbersColor = "#007700";
	this.font = "monospace";
	this.drawGridLines = true;
	this.gridLinesWeight = 1;
	this.gridLinesColor = "#00000055";
	this.graphLineColor = "#ff00ff";
	this.normal = false;
	this._background = null;
	this.axisData = {
		x: {
			scale: 1,
			color: "#ff0000",
			draw: true,
			spacing: 40,
			start: -300,
			end: 300,
			weight: 1
		},
		y: {
			scale: 1,
			color: "#0000ff",
			draw: true,
			spacing: 40,
			start: -300,
			end: 300,
			weight: 1
		}
	};
	this.dx = 2.5;
};
Object.assign(Geometry.Graph.prototype, {
	background: function(r,g,b,a){
		this._background = toHexColor(r, g, b, a);
	},
	graph: function(d){
		var ad = this.axisData;
		d.translate(this.origin);
		d.rotate(this.rotation);
		d.scale(ad.x.scale,ad.y.scale);
		d.beginShape();
		d.noFill();
		d.stroke(this.graphLineColor);
		for(var x=ad.x.start;x<ad.x.end;x+=this.dx){
			var v = x*this.numberScale;
			var y = this.f(v)/this.numberScale;
			if(this.normal) y*=-1;
			d.vertex(v/this.numberScale,y);
		}
		d.endShape();
		d.scale(1/ad.x.scale,1/ad.y.scale);
		d.rotate(-this.rotation);
		d.translate(this.origin.minus());
	},
	draw: function(d){
		if(this.isComplexPlane) this.normal = true;
		var ad = this.axisData;
		d.translate(this.origin);
		d.rotate(this.rotation);
		d.scale(ad.x.scale,ad.y.scale);
		if(this._background){
			d.noStroke();
			d.fill(this._background);
			d.rect(ad.x.start,ad.y.start,ad.x.end-ad.x.start,ad.y.end-ad.y.start);
		}
		if(ad.x.draw){
			d.strokeWeight(ad.x.weight);
			d.stroke(ad.x.color);
			d.line(ad.x.start,0,ad.x.end,0);
		}
		if(ad.y.draw){
			d.strokeWeight(ad.y.weight);
			d.stroke(ad.y.color);
			d.line(0,ad.y.start,0,ad.y.end);
		}
		if(this.drawNumbers){
			var size;
			d.fill(this.numbersColor);
			d.font(this.font);
			d.textAlign("center");
			var c0 = 22, c1 = 1.75;
			for(var i=0;i<ad.x.end;i+=ad.x.spacing){
				var value = (i*this.numberScale).toFixed(2);
				value*=1;
				size = ad.x.spacing/(Math.pow(value.toString().length,1/2)*c1);
				d.textSize(size);
				var pos = new Point(i, 15);
				if(i == 0) pos.x-=10;
				d.text(value,pos);
			}
			for(var i=-ad.x.spacing;i>ad.x.start;i-=ad.x.spacing){
				var value = (i*this.numberScale).toFixed(2);
				value*=1;
				size = ad.x.spacing/(Math.pow(value.toString().length,1/2)*c1);
				d.textSize(size);
				var pos = new Point(i, 15);
				d.text(value,pos);
			}
			for(var i=ad.y.spacing;i<ad.y.end;i+=ad.y.spacing){
				var pos = new Point(-15,i);
				var value = (i*this.numberScale).toFixed(2);
				if(this.normal) value*=-1;
				size = ad.y.spacing/(Math.pow(value.toString().length,1/2)*c1);
				if(this.isComplexPlane) value+="i";
				d.textSize(size);
				d.text(value,pos);
			}
			for(var i=-ad.y.spacing;i>ad.y.start;i-=ad.y.spacing){
				var pos = new Point(-15,i);
				var value = (i*this.numberScale).toFixed(2);
				if(this.normal) value*=-1;
				size = ad.y.spacing/(Math.pow(value.toString().length,1/2)*c1);
				if(this.isComplexPlane) value+="i";
				d.textSize(size);
				d.text(value,pos);
			}
		}
		if(this.drawGridLines){
			d.stroke(this.gridLinesColor);
			for(var i=ad.x.spacing;i<ad.x.end;i+=ad.x.spacing){
				d.line(i,ad.y.start,i,ad.y.end);
			}
			for(var i=-ad.x.spacing;i>ad.x.start;i-=ad.x.spacing){
				d.line(i,ad.y.start,i,ad.y.end);
			}
			for(var i=ad.y.spacing;i<ad.y.end;i+=ad.y.spacing){
				d.line(ad.x.start,i,ad.x.end,i);
			}
			for(var i=-ad.y.spacing;i>ad.y.start;i-=ad.y.spacing){
				d.line(ad.x.start,i,ad.x.end,i);
			}
		}
		d.pop();
		this.graph(d);
	},
	int: function(a,b){
		var start, finish;
		var al = arguments.length;
		if(al == 0){
			start = this.axisData.x.start;
			finish = this.axisData.y.finish;
		}else if(al == 1){
			start = -a;
			finish = a;
		}else if(al == 2){
			start = a;
			finish = b;
		}
		return Math.integral(this.f,start,finish);
	},
	average: function(a,b){
		var start, finish;
		var al = arguments.length;
		if(al == 0){
			start = this.axisData.x.start;
			finish = this.axisData.y.finish;
		}else if(al == 1){
			start = -a;
			finish = a;
		}else if(al == 2){
			start = a;
			finish = b;
		}
		return this.int(start,finish)/(finish-start);
	}
});
Geometry.Line = function(){
	var a = arguments;
	if(a.length == 2){
		this.p1 = a[0].copy();
		this.p2 = a[1].copy();
	}else if(a.length == 4){
		this.p1 = new Point(a[0],a[1]);
		this.p2 = new Point(a[2],a[3]);
	}
	if(a.length == 1 || a.length == 3 || a.length > 4){
		throw new Error('Not understood for construction of Geometry.Line()');
	}
};
Object.assign(Geometry.Line.prototype, {
	angle: function(){
		return Point.sub(this.p2,this.p1).angle();
	},
	length: function(){
		return dist(this.p1,this.p2);
	},
	draw: function(d){
		d.strokeWeight(1);
		d.stroke(255,0,255);
		d.line(this.p1,this.p2);
	},
	center: function(){
		var p = Point.add(this.p1,this.p2);
		return Point.scale(p,1/2);
	},
	rotate: function(a){
		p2.rotate(a); p1.rotate(a);
	},
	copy: function(){
		return new this.constructor(this.p1,this.p2);
	},
	rotateAroundCenter: function(a){
		var c = this.center();
		this.p2.sub(c); this.p1.sub(c);
		this.p2.rotate(a); this.p1.rotate(a);
		this.p2.add(c); this.p1.add(c);
	},
	rotateAroundp1: function(a){
		this.p2.sub(this.p1);
		this.p2.rotate(a);
		this.p2.add(this.p1);
	},
	rotateAroundp2: function(a){
		this.p2.sub(this.p1);
		this.p2.rotate(a);
		this.p2.add(this.p1);
	},
	rotateAroundp: function(p, a){
		this.p2.sub(p); this.p1.sub(p);
		this.p2.rotate(a); this.p1.rotate(a);
		this.p2.add(p); this.p1.add(p);
	},
	getDataOnPoint: function(p){
		var data = {};
		var l = this.length();
		var _p = p.copy(), a = this.angle()+Math.PI/2, c = this.center();
		_p.sub(c);
		_p.changeAxis(a);
		_p.x = _p.x, _p.y = Math.abs(_p.y);
		if(_p.y>l/2){
			var cp = this.closestPointAround(p)
			data.dist = Point.sub(cp, p).mag();
			data.p = cp.copy();
		}else{
			data.dist = _p.x;
			var n = new Point(0, -_p.x);
			n.rotate(a-Math.PI/2);
			n.add(p);
			data.p = n;
		}
		data.dist = Math.abs(data.dist);
		return data;
	},
	closestPointAround: function(p){
		return dist(p,this.p1)>dist(p,this.p2) ? this.p2.copy() : this.p1.copy();
	}
});
Geometry.Shape = function(){
	this.points = [];
	if(arguments.length>0){
		if(isArray(arguments[0])){
			for(var i=0;i<arguments[0].length;i++){
				this.points.push(arguments[0][i].copy());
			}
		}else if(arguments[0] instanceof Point){
			for(var i=0;i<arguments.length;i++){
				this.points.push(arguments[i].copy());
			}
		}else{
			for(var i=0;i<arguments.length-1;i+=2){
				this.points.push(new Point(arguments[i],arguments[i+1]));
			}
		}
	}
	this.c = '#56a1e4';
};
Object.assign(Geometry.Shape.prototype, {
	_points: function(){
		var ps = [];
		for(var i=0;i<this.points.length;i++){
			ps[i] = this.points[i].copy();
		}
		return ps;
	},
	addPoint: function(p, index){
		if(typeof p == 'number' && typeof index == 'number'){
			var _p = p, _i = index;
			p = new Point(_p, _i);
			index = undefined;
		}
		// inserting after
		if(!index) index = this.closestPointAround(p).id;
		index = constrain(index, 0, this.points.length);
		var ps = this._points();
		var _p = p.copy();
		this.points[index+1] = _p;
		for(var i=index+2;i<this.points.length-1;i++){
			this.points[i] = ps[i+1].copy();
		}
	},
	draw: function(d){
		d.strokeWeight(1.5);
		d.stroke(this.c);
		if(!d){
			console.warn("Geometry.Shape.draw: no parameter");
			return;
		}
		d.beginShape();
		for(var i=0;i<this.points.length+1;i++){
			var p = this.points[i%this.points.length];
			d.vertex(p);
		}
		d.endShape();
	},
	getCenter: function(){
		if(this.points.length == 0){
			console.warn("(There is no points) Geometry.Shape.getCenter(): The center will be Infinity if there is no points");
		}
		var sum = new Point();
		for(var i=0;i<this.points.length;i++){
			var a = (i == this.points.length-1) ? 0 : (i+1);
			var p1 = this.points[i], p2 = this.points[a];
			sum.add(Point.scale(Point.add(p1,p2),1/2*Point.sub(p1,p2).mag()));
		}
		return Point.scale(sum, 1/this.getLength());
	},
	getLength: function(){
		var sum = 0;
		for(var i=0;i<this.points.length;i++){
			var a = i == this.points.length-1 ? 0 : (i+1);
			var p1 = this.points[i], p2 = this.points[a];
			sum+=Point.sub(p2,p1).mag();
		}
		return sum;
	},
	getArea: function(){
		var sum = 0, p0 = this.points[0];
		for(var i=1;i<this.points.length-1;i++){
			var p1 = this.points[i], p2 = this.points[i+1];
			var a = dist(p1, p2), b = dist(p2,p0), c = dist(p0, p1);
			var s = (a+b+c)/2;
			sum+=Math.pow(s*(s-a)*(s-b)*(s-c), 1/2);
		}
		return sum;
	},
	rect: function(x,y,w,h){
		this.points = Geometry.pointsOfRect(x,y,w,h);
	},
	circle: function(x,y,r,a,b,d = 5){
		this.points = Geometry.pointsOnCircle(x,y,r,a,b,d);
	},
	line: function(x1,y1,x2,y2,r = 5){
		this.points = [];
		var m = dist(x1,y1,x2,y2), d = r/2, a = Point.sub(new Point(x2,y2),new Point(x1,y1)).angle();
		var c1 = Geometry.pointsOnCircle(x1,y1,r,Math.PI/2,Math.PI/2+Math.PI,d);
		var c2 = Geometry.pointsOnCircle(x1+m,y1,r,-Math.PI/2,Math.PI/2,d);
		for(var i=0;i<c1.length;i++){
			this.points.push(c1[i]);
		}
		this.points.push(new Point(x1+m,y1-r));
		for(var i=0;i<c2.length;i++){
			this.points.push(c2[i]);
		}
		this.points.push(new Point(x1,y1+r));
		this.sub(x1,y1);
		this.rotate(a);
		this.add(x1,y1);
	},
	sub: function(p){
		if(arguments.length == 2) var p = new Point(arguments[0],arguments[1]);
		for (var i = this.points.length - 1; i >= 0; i--) {
			this.points[i].sub(p);
		}
	},
	add: function(p){
		if(arguments.length == 2) var p = new Point(arguments[0],arguments[1]);
		for (var i = this.points.length - 1; i >= 0; i--) {
			this.points[i].add(p);
		}
	},
	rotate: function(a, p){
		if(p == undefined) p = new Point();
		for (var i = this.points.length - 1; i >= 0; i--) {
			this.points[i].sub(p);
			this.points[i].rotate(a);
			this.points[i].add(p);
		}
	},
	scale: function(s){
		for (var i = this.points.length - 1; i >= 0; i--) {
			this.points[i].scale(s);
		}
	},
	closestPointAround: function(p){
		var c = this.points[0].copy();
		var _i = 0;
		for(var i=1;i<this.points.length;i++){
			if(Point.sub(c,p).mag()>Point.sub(this.points[i],p).mag()){
				c = this.points[i].copy();
				_i = i;
			}
		}
		return {obj: c, id: _i};
	},
	inShape: function(p){
		var hit = 0;
		for(var i=0;i<this.points.length;i++){
			var l = new Geometry.Line(this.points[i], this.points[(i+1)%this.points.length]);
			var a = Math.PI/2-Point.sub(p, l.center()).angle();
			l.rotateAroundp(p, a);
			var x1 = Math.min(l.p1.x, l.p2.x), x2 = Math.max(l.p1.x, l.p2.x);
			if(p.x<l.p1.x-1 || p.x>l.p2.x+1) return false;
		}
		return true;
	}
});
Object.assign(Physics, {
	Particle: function(){},
	ParticleGroup: function(){},
	ParticleSystem: function(){},
	Obj: function(){}
});
Physics.Particle = function(x,y){
	this.p = new Point(x,y);
	this.v = new Point();
	this.m = 8;
	this.clock = new Clock();
	this.timer = new Timer();
	this.lifeTime = -1;
	this.group = null;
	this.r = null;
	this.weight = 0;
	this.s = 0; // sums of normalized vectors
	this.pressure = 0;
};
Physics.Particle.prototype.color = function(r,g,b,a){
	this.c = toHexColor(r, g, b, a);
};
Physics.Particle.prototype.applyForce = function(f){
	this.v.add(Point.scale(f, 1/this.mass));
};
Physics.Particle.prototype.draw = function(){
	console.warn('Use Physics.ParticleGroup.prototype.draw or Physics.ParticleSystem.prototype.draw instead');
};
Physics.Particle.prototype.update = function(){
	if(this.group.fixed) this.v = new Point();
	this.p.add(this.v);
	this.clock.update()
};
Physics.Particle.prototype.copy = function(){
	var p = new this.constructor(this.p.x,this.p.y);
	for(var key in this){
		p[key] = this[key];
	}
	p.p = this.p.copy();
	p.v = this.v.copy();
	return p;
};
Physics.ParticleGroup = function(){
	this.forces = {
		pressure: 0.2,
		repulsion: 1,
		viscous: 0.2,
		// if the numbers are 0, this group of particles isn't that type
		elastic: 0,
		tensileA: 0,
		tensileB: 0,
		powder: 0
	};
	this.data = [];
	this.fixed = false;
	this.system = null;
	this.mixColor = false;
	this.w1 = 0.9;
	this.w0 = 0.7;
	this.rs = 2;

	this.start = null;
	this.end = null;
	this.c = [0,0,180,200];
};
Object.assign(Physics.ParticleGroup.prototype, {
	addParticle: function(p){
		this.ps.push(p);
		p.r = this.rs;
		p.group = this;
		this.data.push(p.copy());
		if(this.system){
			this.system.split();
			this.system.getMaxRadius();
		}
	},
	draw: function(d){
		d.noStroke();
		for (var i = this.ps.length - 1; i >= 0; i--) {
			var p = this.ps[i];
			d.fill(this.c[0],this.c[1],this.c[2],this.c[3]);
			p.r = this.rs;
			d.translate(p.p);
			d.ellipse(0,0,this.rs,this.rs);
			d.pop();
		}
	},
	calw1: function(weight){
		return Math.max(0,weight-this.w1);
	},
	calw0: function(weights){
		return Math.max(0,this.forces.pressure*(weights-this.w0));
	},
	reset: function(){
		for(var i=0;i<this.ps.length;i++){
			this.ps[i].weight = 0;
			this.ps[i].s = 0;
			this.ps[i].pressure = 0;
		}
	}
});
Physics.ParticleSystem = function(){
	this.w0 = 0.7;
	this.GroupLists = [];
	this.maxRadius = null;
	this.all = [];
	this.ps = [];
	this.forces = {
		viscous: 0.2,
		pressure: 0.25,
		repulsion: 0.85
	};
};
Object.assign(Physics.ParticleSystem.prototype, {
	split: function(){
		this.ps = [];
		for (var i = this.GroupLists.length - 1; i >= 0; i--) {
			var g = this.GroupLists[i];
			for (var j = 0; j<g.ps.length; j++){
				//g.ps[j].GroupListId = j;
				//g.ps[j].SystemListId = i;
				this.ps.push(g.ps[j]);
			}
		}
	},
	_ps: function(){
		var arr = [];
		for (var i = this.ps.length - 1; i >= 0; i--) arr[i] = this.ps[i].copy();
		return arr;
	},
	getMaxRadius: function(){
		this.maxRadius = (this.GroupLists.sort(function(a,b){b.rs-a.rs})[0]).rs;
	},
	addGroup: function(g){
		g.system = this;
		this.GroupLists.push(g);
		this.split();
		this.getMaxRadius();
	},
	sort: function(){
		this.all = [];
		var all = this.all;
		var ps = this.ps;
		var maxD = this.maxRadius*2;
		var minP = ps[0].p.copy();
		for (var i = ps.length - 1; i >= 1; i--) {
			if(ps[i].p.x<minP.x) minP.x = ps[i].p.x;
			if(ps[i].p.y<minP.y) minP.y = ps[i].p.y;
		}
		for (var i = ps.length - 1; i >= 0; i--) {
			var p = ps[i];
			var x = Math.floor((p.p.x-minP.x)/maxD),
				y = Math.floor((p.p.y-minP.y)/maxD);
			if(!all[y]) all[y] = [];
			if(!all[y][x]) all[y][x] = [];
			all[y][x].push({obj: p, id: i});
		}
		this.minP = minP;
	},
	solve: function(){
		var obj, p2, D, d, n, m;
		var all = this.all, minP = this.minP;
		var ps = this.ps;
		var maxD = this.maxRadius*2;
		var cop = this._ps();
		// suming up the weight
		for (var i = ps.length - 1; i >= 0; i--) {
			var p1 = ps[i];
			var fx = Math.floor((p1.p.x-minP.x-maxD/2)/maxD);
			var fy = Math.floor((p1.p.y-minP.y-maxD/2)/maxD);
			for(var y=fy;y<=fy+1;y++){
			if(!all[y]) continue;
			for(var x=fx;x<=fx+1;x++){
			if(!all[y][x] || (y == fy && x == fx)) continue;
				for (var j = all[y][x].length - 1; j >= 0; j--) {
					obj = all[y][x][j];
					p2 = obj.obj;
					D = p1.r+p2.r;
					d = Point.sub(p2.p,p1.p);
					m = d.mag();
					if(m<D){
						var weight = 1-m/D;
						p1.weight+=weight;
						p2.weight+=weight;
					}
				}
			}}
		}
		for (var i = ps.length - 1; i >= 0; i--) {
			// sumed weight into pressure
			ps[i].pressure = this.cal(ps[i].weight);
		}
		/**
			* interactions between particles
			* methods came from: 
			* https://docs.google.com/presentation/d/1fEAb4-lSyqxlVGNPog3G1LZ7UgtvxfRAwR0dwd19G4g/edit#slide=id.g386b90fa9_028
			* normal pressure for 2 particles of different group
		**/
		for (var i = ps.length - 1; i >= 0; i--) {
			var p1 = ps[i];
			var fx = Math.floor((p1.p.x-minP.x-maxD/2)/maxD);
			var fy = Math.floor((p1.p.y-minP.y-maxD/2)/maxD);
			for(var y=fy;y<=fy+1;y++){
			if(!all[y]) continue;
			for(var x=fx;x<=fx+1;x++){
			if(!all[y][x] || (y == fy && x == fx)) continue;
				for (var j = all[y][x].length - 1; j >= 0; j--) {
					obj = all[y][x][j];
					p2 = obj.obj;
					D = p1.r+p2.r;
					d = Point.sub(p2.p,p1.p);
					m = d.mag();
					if(m<D){
						var w = 1-m/D;
						n = Point.normalize(d);
						var velocityDif = Point.sub(p2.v, p1.v);
						if(p1.group != p2.group){
							var repulsionForce = this.forces.repulsion*(p1.pressure+p2.pressure)*0.5;
							var viscousForce = this.forces.viscous;
							cop[i].applyForce(Point.scale(n, -repulsionForce));
							cop[obj.id].applyForce(Point.scale(n, repulsionForce));
							cop[i].applyForce(Point.scale(n, viscousForce));
							cop[obj.id].applyForce(Point.scale(n, -viscousForce));
							if(p1.group.mixColor && p2.group.mixColor){}
						}else{
							var g = p1.group || p2.group;
							var pre = {
								p1: g.calw0(p1.weight),
								p2: g.calw0(p2.weight)
							};
							// viscous
							var viscousForce = g.forces.viscous;
							cop[i].applyForce(Point.scale(n, viscousForce));
							cop[obj.id].applyForce(Point.scale(n, -viscousForce));
							if(g.forces.powder == 0){
								var repulsionForce = g.forces.repulsion*(pre.p1+pre.p2)*0.5;
							}else{
								var repulsionForce = g.forces.powder*g.calw1(w);
							}
							cop[i].applyForce(Point.scale(n, -repulsionForce));
							cop[obj.id].applyForce(Point.scale(n, repulsionForce));
						}
					}
					if(m<2*D && (p1.group == p2.group) && p1.group.forces.elastic>0){
						var g = p1.group || p2.group;
						var copies = {
							p1: g.data[p1.GroupListId],
							p2: g.data[p2.GroupListId]
						};
						var initDist = dist(copies.p1.p,copies.p2.p);
						var power = p1.group.forces.elastic*(m-initDist);
						cop[i].applyForce(Point.scale(n, power));
						cop[obj.id].applyForce(Point.scale(n, -power));
					}
				}
			}}
		}
		for (var i = cop.length - 1; i >= 0; i--) {
			var p = this.ps[i];
			p = cop[i].copy();
		}
	},
	update: function(){
		for (var i = this.ps.length - 1; i >= 0; i--) {
			this.ps[i].update();
		}
	},
	draw: function(d){
		for (var i = this.GroupLists.length - 1; i >= 0; i--) {
			this.GroupLists[i].draw(d);
		}
	},
	cal: function(weights){
		return Math.max(0,this.forces.pressure*(weights-this.w0));
	},
	interactWithLine: function(line){
		var p;
		for(var i=0;i<this.ps.length;i++){
			p = this.ps[i];
			var data = line.getDataOnPoint(p.p);
			if(data.dist<p.r){
				var a = Point.sub(data.p, p.p).angle(), l = 1-data.dist/p.r;
				var n = Point.polar(1, a);
				if(p.group.powder){
					p.applyForce(Point.scale(n, p.group.calw1(l)*p.group.forces.repulsion));
				}else{
					p.applyForce(Point.scale(n, p.group.calw0(l)*p.pressure*p.group.forces.repulsion));
				}
			}
		}
	},
	interactWithObj: function(obj){
		var pts = obj.getRealShape().points;
		for(var i=0;i<pts.length;i++){
			var l = new Geometry.Line(pts[i], pts[(i+1)%pts.length]);
			this.interactWithLine(l);
		}
	},
	addv: function(p){
		for (var i = this.ps.length - 1; i >= 0; i--) {
			this.ps[i].v.add(p);
		}
	}
});
Physics.Obj = function(shape){
	this.shape = shape || new Geometry.Shape();
	this.v = new Point();
	this.angle = 0;
	this.scale = 1;
	this.spin = 0; // angular velocity in radians per time unit
	this.density = 1;
	this.surfaceFriction = 1/2;
	this.fixed = false;
	this.c = "#008800";
	this.timer = new Clock();
	this._color = '#ff0000ff';
};
Object.assign(Physics.Obj.prototype, {
	color: function(r,g,b,a){
		this._color = toHexColor(r, g, b, a);
	},
	addPoint: function(p, index){
		this.shape.addPoint(p, index);
	},
	getRealShape: function(){
		var ps = [];
		var c = this.getCenter();
		for(var i=0;i<this.shape.points.length;i++){
			ps[i] = new Point();
			ps[i].add(c);
			ps[i].scale(this.scale);
			ps[i].rotate(this.angle);
			ps[i].sub(c);
			ps[i].add(this.shape.points[i]);
		}
		var newShape = new Geometry.Shape(ps);
		return newShape;
	},
	_longestPointFromCenter: function(){
		var c = this.getCenter();
		var p = this.shape.points[0].copy();
		for(var i=1;i<this.shape.points.length;i++){
			if(Point.sub(c,p).mag()<Point.sub(c,this.shape.points[i]).mag()){
				p = this.shape.points[i].copy();
			}
		}
		return p;
	},
	applyForce: function(p,fv){
		if(this.shape.points.length == 0){
			console.warn("Cannot applyForce: no points in shape, add a point to shape");
			return;
		}
		var c = this.getCenter();
		var R = Point.sub(c, this._longestPointFromCenter()).mag();
		var m = this.getMass(this.density);
		var F = fv.copy();
		var d = Point.sub(p,c);
		var r = d.mag();
		var a = d.angle();
		F.changeAxis(a);
		this.v.add(Point.scale(Point.polar(F.x, a), 1/m));
		var l1 = map(r,0,R,1,0)*F.y, l2 = (1-l1)*F.y;
		this.v.add(Point.scale(Point.polar(F.y, a-Math.PI/2), 1/m*l1));
		this.spin-=l2/m;
	},
	update: function(){
		if(this.fixed){
			this.v = new Point();
			this.spin = 0;
		}
		this.shape.add(this.v);
		this.angle+=this.spin;
		this.timer.update();
	},
	getCenter: function(){
		return this.shape.getCenter();
	},
	getMass: function(density){
		return density*this.shape.getLength();
	},
	interactWithObj: function(obj){
		var s1 = obj.getRealShape(), s2 = this.getRealShape();
		for (var j = s1.points.length - 1; j >= 0; j--) {
			var p = s1.points[j];
			for (var i = s2.points.length - 1; i >= 0; i--) {
				var l = new Geometry.Line(s2.points[i], s2.points[(i+1)%s2.points.length]);
				var data = l.getDataOnPoint(p);
				var mr = 10;
				if(data.dist<mr){
					console.log('hit');
					var _p = data.p;
					function cal(obj, p){
						var f = obj.v.copy(), c = obj.getCenter(), a = Point.sub(c, p).angle();
						f.add(Point.polar(obj.spin, a+Math.PI/2));
						f.scale(100);
						return f;
					}
					var a = cal(this, p), b = cal(obj, _p);
					this.applyForce(p, a);
					obj.applyForce(_p, b);
				}
			}
		}
	},
	draw: function(d){
		var cm = this.getCenter();
		// spins around the center
		d.noFill();
		d.stroke(this._color);
		this.shape.sub(cm);
		d.translate(cm);
		d.rotate(this.angle);
		d.scale(this.scale);
		this.shape.draw(d);
		d.pop();
		this.shape.add(cm);
	}
});
Physics.Obj.attach = function(a,b,c){
};
function PhysicsWorld(space){
	this.particleSystem = new Physics.ParticleSystem();
	this.objs = [];
	this.gravity = 1/100;
	this.tool = new Draw(space);
	this.clock = new Clock();
	this.timer = new Timer();
	this.pause = false;
	this.init();
}
Object.assign(PhysicsWorld.prototype, {
	init: function(){
	},
	addObj: function(obj){
		this.objs.push(obj);
	},
	addElasticGroup: function(){
	},
	addParticle: function(){
	},
	addViscousParticle: function(){
	},
	addTensileParticle: function(){
	},
	addPowderParticle: function(){
	},
	addRope: function(){
	},
	solve: function(){
	},
	update: function(){
		for (var i = this.objs.length - 1; i >= 0; i--) {
			this.objs[i].v.y+=this.gravity;
			this.objs[i].update();
		}
		this.clock.update();
	},
	draw: function(d){
		for (var i = this.objs.length - 1; i >= 0; i--) {
			this.objs[i].draw(d);
		}
	},
	run: function(){
		this.interactions();
		this.update();
		if(this.tool) this.draw(this.tool);
	}
});
function Button(x,y,w,h,t,f){
	this.p = new Point(x, y);
	this.d = new Point(w, h);
	this.v = new Point();
	this.t = t || '1*1 = 1';
	this.f = f;
	this.a = 1;
	this.c = '#00ddeeff';
	window.addEventListener('onmousedown', f, false);
}
Button.prototype = {
	in: function(x,y){
		if(x instanceof Point){
			var _p = x.copy();
		}else{
			var _p = new Point(x,y);
		}
		_p.rotateAround(this.p, -this.a);
		return _p.x>this.p.x-this.d.x/2 && 
			_p.x<this.p.x+this.d.x/2 && 
			_p.y>this.p.y-this.d.y/2 &&
			_p.y<this.p.y+this.d.y/2;
	},
	change: function(f){
		window.removeEventListener('onmousedown', this.f, false);
		this.f = f;
		window.addEventListener('onmousedown', f, false);
	},
	update: function(){
		this.p.add(this.v);
	},
	draw: function(tool){
		tool.fill(this.c);
		tool.stroke(0);
		tool.rectMode('center');
		tool.translate(this.p);
		tool.rotate(this.a);
		tool.rect(0,0,this.d.x,this.d.y,6);
		tool.fill(0);
		var s = this.d.x*this.t.length*1/20>this.d.y ? this.d.y/this.t.length*7 : this.d.x/5.5;
		tool.textSize(s*0.9);
		tool.text(this.t,0,this.d.x/20);
		tool.pop();
	}
};
function SlideShow(space, tool){
	if(arguments.length<2){
		throw new Error('Need 2 parameters for constructing a SlideShow,  but '+arguments.length+' is present');
	}
	this.slides = [];
	this.page = 0;
	this.move = function(){
		this.page++;
	};
	this.running = false;
	this.finished = false;
	this.tool = tool;
	var move = this.move, running = this.running;
	function run(event){
	}
	space.addEventListener('mousedown', frun, false);
	space.addEventListener('keydown', frun, false);

	this.transStyles = [];
}
SlideShow.transitionsStyles = {
	fade: function(){
	},
	squares: function(){
	},
	shuffle: function(){
	},
	zoom: function(){
	},
};
Object.assign(SlideShow.prototype, {
	draw: function(index){
		this.slides[index](this.tool);
	},
	run: function(){
		this.running = true;
		this.draw(this.page);
	}
});




(function(global){
	global.initSpace = function(){
		var a = arguments;
		var space = createCanvas();
		const ww = space.width, hh = space.height;
		var tool = new Draw(space);
		var world = new PhysicsWorld(space);
		var clock = new Clock();
		var center = new Point(ww/2, hh/2);
		var mouse = new Point(center);
		var timer = new Timer();
		var g = [
			'space', 
			'ww', 
			'hh', 
			'tool', 
			'clock', 
			'world', 
			'center', 
			'mouse', 
			'timer',
		];
		for(var i=0;i<g.length;i++){
			global[g[i]] = eval(g[i]);
		}
		function f(e){
			mouse.set(e.offsetX, e.offsetY);
		}
		space.addEventListener('mousemove', f, false);
	};
	global.pointMouse = function(){
		tool.noStroke();
		tool.fill(255,144,0);
		tool.ellipse(mouse.x,mouse.y,2.5,2.5);
	};
	global.pauseButton = function(varName = 'pause'){
		global[varName] = false;
		var butt = document.createElement('button');
		butt.onclick = function(e){
			global[varName] = !global[varName];
		};
		butt.innerHTML = 'Pause';
		butt.style.textAlign = 'center';
		document.body.appendChild(butt);
	};
	global.background = function(a,b,c,d){
		tool.noStroke();
		tool.fill(a,b,c,d);
		tool.rectMode('');
		tool.rect(0,0,ww,hh);
	};
	global.key = function(){
		global.keys = {};
		function f1(e){
			keys[e.key] = true;
		}
		function f2(e){
			keys[e.key] = false;
		}
		window.addEventListener('keydown', f1, false);
		window.addEventListener('keyup', f2, false);
	};
})(this);