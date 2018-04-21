document.body.style.fontSize = "21px";
document.body.style.fontFamily = "monospace";
function createCanvas(id, w = window.innerWidth, h = window.innerHeight, sl){
	if(arguments.length == 2){
		w = window.innerWidth*arguments[1];
		h = window.innerHeight*arguments[1];
	}
	var ele = document.createElement("canvas");
	var t = window.innerHeight-h;
	ele.style = sl || "text-align: center;border: dashed 1px #000000;margin-top: "+t/2+"px";
	ele.width = w, ele.height = h;
	ele.id = id;
	document.body.appendChild(ele);
	ele.style.cursor = 'crosshair';
	return ele;
}
Math.eps = 1e-16;
Math.roundToZero = function(n){return n>0 ? this.floor(n) : this.ceil(n); }
Math.roundAwayZero = function(n){return n>0 ? this.ceil(n) : this.floor(n);}
Math.isInt = function(n){return (this.round(Number(n)) == Number(n));};
Math.change = function(num,a,b){
	var n1 = parseFloat(num,a);
	return n1.toString(b);
};
function constrain(value, min, max){
	if(value<=min){return min;}
	if(value>=max){return max;}
	else{return value;}
}
Array.prototype._clone = function(){
	var arr = [];
	for(var i=0;i<this.length;i++){var o = this[i]; if(typeof o == 'object'){if(Array.isArray(o)){arr[i] = o._clone(); }else{arr[i] = o.clone(); } }else{arr[i] = this[i]; } } return arr; 
};
Object.prototype.clone = function(){
	var obj = {}, me = this;
	for(var key in me){
		var o = me[key];
		if(typeof o == 'object'){
			if(Array.isArray(o)){obj[key] = o._clone(); }
			else{obj[key] = o.clone(); } 
		}else{obj[key] = this[key]; } 
	} 
	return obj;
};
function Color(a,b,c,d){return this.set(a,b,c,d);}
Object.assign(Color.prototype, {
	get: function(a){
		return this._set(a.r, a.g, a.b, a.a);
	},
	set: function(a,b,c,d){
		if(a == undefined){
			return this._set(0,0,0,255);
		}else if(b == undefined){
			if(a instanceof Color){
				return this.get(a);
			}else if(typeof a == 'number'){
				return this._set(a,a,a,255);
			}else if(typeof a == 'string'){
				return this.setFromString(a);
			}else if(typeof a == 'object'){
				return this.setFromObj(a);
			}
		}else if(c == undefined){
			return this._set(a,a,a,b);
		}else if(d == undefined){
			return this._set(a,b,c,255);
		}else if(d != undefined){
			return this._set(a,b,c,d);
		}
	},
	_set: function(a,b,c,d){
		this.r = a, this.g = b, this.b = c, this.a = d;
		return this;
	},
	setFromString: function(str){
		if(str[0] == '#'){str = str.substring(1,str.length);}
		this.r = Number('0x'+str.substring(0,2));
		this.g = Number('0x'+str.substring(2,4));
		this.b = Number('0x'+str.substring(4,6));
		if(str.length>6){this.a = Number('0x'+str.substring(0,2));}
		else{this.a = 255;}
		this._c();
		return this;
	},
	setFromObj: function(obj){
		this.r = obj.r;
		this.g = obj.g;
		this.b = obj.b;
		this.a = obj.a;
		this._c();
		return this;
	},
	getCssString: function(){
		function t0(n){n = Math.round(Math.abs(n)); var a0 = Math.change(n,10,16); if(n<16){a0 = "0"+a0;} return a0; }
		return "#"+t0(this.r)+t0(this.g)+t0(this.b)+t0(this.a);
	},
	getValue: function(){
		function t0(n){n = Math.round(Math.abs(n)); var a0 = Math.change(n,10,16); if(n<16){a0 = "0"+a0;} return a0; }
		return Number('0x'+t0(this.r)+t0(this.g)+t0(this.b)+t0(this.a));
	},
	getObj: function(){
		return {
			r: this.r, 
			g: this.g, 
			b: this.b, 
			a: this.a
		};
	},
	_clone: function(){
		return new this.constructor(this);
	},
	lerp: function(c, u){
		this.r+=(c.r-this.r)*u;
		this.g+=(c.g-this.g)*u;
		this.b+=(c.b-this.b)*u;
		this.a+=(c.a-this.a)*u;
		this._c();
		return this;
	},
	_c: function(){
		this.r = constrain(this.r, 0, 255);
		this.g = constrain(this.g, 0, 255);
		this.b = constrain(this.b, 0, 255);
		this.a = constrain(this.a, 0, 255);
	},
	add: function(a,b,c,d){
		var _c = new Color(a,b,c,d);
		this.r+=_c.r;
		this.g+=_c.g;
		this.b+=_c.b;
		this.a+=_c.a;
		this._c();
		return this;
	},
	sub: function(a,b,c,d){
		var _c = new Color(a,b,c,d);
		this.r-=_c.r;
		this.g-=_c.g;
		this.b-=_c.b;
		this.a-=_c.a;
		this._c();
		return this;
	},
	scale: function(scl){
		this.r*=scl;
		this.g*=scl;
		this.b*=scl;
		this.a*=scl;
		this._c();
		return this;
	},
	mix: function(b, u){
		var _this = this._clone();
		this.lerp(b, u);
		b.lerp(_this, u);
	}
});
Object.assign(Color, {
	random: function(a){
		if(a){return new Color(randomFloat(0,255), randomFloat(0,255), randomFloat(0,255), randomFloat(0,255));}
		else{return new Color(randomFloat(0,255), randomFloat(0,255), randomFloat(0,255), 255);}
	}
});
function map(value, l1, h1, l2, h2) {return l2+(h2-l2)*(value-l1)/(h1-l1);}
function dist(x1,y1,x2,y2){
	if(arguments.length == 2){
		return Math.sqrt(Math.pow(y1.x-x1.x,2)+Math.pow(y1.y-x1.y,2));
	}
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function randomFloat(a, b){
	return a+Math.random()*(b-a);
}
function Point(x,y){
	this.data = {};
	return this.set(x,y);
}
Object.assign(Point.prototype, {
	set: function(x,y){
		if(y == undefined && x instanceof Point){
			this.x = x.x;
			this.y = x.y;
		}else{
			this.x = x || 0;
			this.y = y || 0;
		}
		return this;
	},
	_clone: function(){
		var p = new Point();
		p.x = this.x, p.y = this.y;
		p.data = this.data;
		return p;
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
		this.x = this.x*v.x+this.x*v.y;
		this.y = this.y*v.x+this.y*v.y;
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
		var m = this.mag();
		this.x/=m;
		this.y/=m;
		return this;
	},
	normalized: function(){
		var v = this._clone(), m = this.mag();
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
		this.x+=(v.x-this.x)*a;
		this.y+=(v.y-this.y)*a;
		return this;
	},
	equals: function(v){
		return Math.abs(v.x-this.x)<Math.eps && Math.abs(v.y-this.y)<Math.eps;
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
			var p = x._clone();
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
				if(this.mag()>a){this.x = n.x, this.y = n.y;}
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
	},
	get: function(p){
		this.x = p.x, this.y = p.y;
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
		var _a = a._clone();
		_a.scale(s);
		return _a;
	},
	mult: function(a,b){
		var a = a._clone();
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
		var b = a._clone();
		return b.normalize();
	},
	angle: function(v){
		return v.angle();
	},
	equals: function(a,b){
		return a.equals(b);
	},
	floor: function(a){
		return a._clone().floor();
	},
	round: function(a){
		return a._clone().round();
	},
	ceil: function(a){
		return a._clone().ceil();
	},
	inverse: function(a){
		return new Point(1/a.x,1/a.y);
	},
	minus: function(a){
		return new Point(-a.x,-a.y);
	},
	polar: function(r,a,p){
		if(p == undefined){p = new Point();}
		return new Point(Math.cos(a)*r+p.x,Math.sin(a)*r+p.y);
	},
	random: function(a,b,c,d){
		var p = new Point();
		p.random(a,b,c,d);
		return p;
	}
});
function Draw(space){
	this.space = space;
	this.fillColor = new Color(255);
	this.strokeColor = new Color();
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
		this.strokeColor.set(r,g,b,a);
	},
	fill: function(r,g,b,a){
		this._fill = true;
		this.fillColor.set(r,g,b,a);
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
		for(var i=0;i<this.tas.length;i++){
			if(this.tas[i].type == 'translate'){
				this.d0.translate(this.tas[i].x, this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d0.rotate(this.tas[i].a);
			}else if(this.tas[i].type == 'scale'){
				this.d0.scale(this.tas[i].x, this.tas[i].y);
			}
		}
	},
	f1: function(){
		for(var i=this.tas.length-1;i>=0;i--){
			if(this.tas[i].type == 'translate'){
				this.d0.translate(-this.tas[i].x, -this.tas[i].y);
			}else if(this.tas[i].type == 'rotate'){
				this.d0.rotate(-this.tas[i].a);
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
		this.d.strokeStyle = this.strokeColor.getCssString();
		if(arguments.length == 2 && x1 instanceof Point && y1 instanceof Point){
			d.moveTo(x1.x,x1.y);
			d.lineTo(y1.x,y1.y);
		}else{
			d.moveTo(x1,y1);
			d.lineTo(x2,y2);
		}
		if(this._stroke){d.stroke();}
		this.f0();
	},
	rect: function(x,y,w,h,r){
		if(!r){
			this.d.beginPath();
			this.s0();
			this.d.strokeStyle = this.strokeColor.getCssString();
			this.d.fillStyle = this.fillColor.getCssString();
			if(this.rectAlign == "center") this.d.translate(-w/2,-h/2);
			this.d.rect(x,y,w,h);
			if(this.rectAlign == "center") this.d.translate(w/2,h/2);
			if(this._stroke){this.d.stroke();}
			if(this._fill){this.d.fill();}
			this.f0();
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
			this.d.fillStyle = this.fillColor.getCssString();
			this.d.strokeStyle = this.strokeColor.getCssString();
			if(this._stroke){this.d.stroke();}
			if(this._fill){this.d.fill();}
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
		this.d.fillStyle = this.fillColor.getCssString();
		this.d.strokeStyle = this.strokeColor.getCssString();
		if(this._stroke){this.d.stroke();}
		if(this._fill){this.d.fill();}
		this.f0();
	},
	triangle: function(x1,y1,x2,y2,x3,y3){
		this.d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor.getCssString();
		this.d.fillStyle = this.fillColor.getCssString();
		this.d.moveTo(x1,y1); this.d.lineTo(x2,y2);
		this.d.moveTo(x2,y2); this.d.lineTo(x3,y3);
		this.d.moveTo(x3,y3); this.d.lineTo(x1,y1);
		if(this._stroke){this.d.stroke();}
		if(this._fill){this.d.fill();}
		this.f0();
	},
	quad: function(x1,y1,x2,y2,x3,y3,x4,y4){
		this.d.beginPath();
		this.s0();
		this.d.lineWidth = this.lineWidth;
		this.d.strokeStyle = this.strokeColor.getCssString();
		this.d.fillStyle = this.fillColor.getCssString();
		this.d.moveTo(x1,y1); this.d.lineTo(x2,y2);
		this.d.moveTo(x2,y2); this.d.lineTo(x3,y3);
		this.d.moveTo(x3,y3); this.d.lineTo(x4,y4);
		this.d.moveTo(x4,y4); this.d.lineTo(x1,y1);
		if(this._stroke){this.d.stroke();}
		if(this._fill){this.d.fill();}
		this.f0();
	},
	text: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.fillStyle = this.fillColor.getCssString();
		this.d.textAlign = this._textAlign;
		this.d.font = this._textSize+"px "+this._font;
		if(arguments.length == 2){this.d.fillText(t, x.x, x.y);}
		else{this.d.fillText(t, x, y);}
		if(this._fill){this.d.fill();}
		this.f0();
	},
	strokeText: function(t,x,y){
		this.d.beginPath();
		this.s0();
		this.d.strokeStyle = this.strokeColor.getCssString();
		this.d.textAlign = this._textAlign;
		this.d.font = this._textSize+"px "+this._font;
		if(arguments.length == 2){
			this.d.fillText(t, x.x, x.y);
		}else{
			this.d.strokeText(t, x, y);
		}
		if(this._stroke){this.d.stroke();}
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
			this.d0.lineTo(x,y);
		}else{
			this.d0.moveTo(x,y);
			this.d1 = true;
		}
	},
	endShape: function(){
		this.d0.lineWidth = this.lineWidth;
		this.d0.strokeStyle = this.strokeColor.getCssString();
		this.d0.fillStyle = this.fillColor.getCssString();
		if(this._stroke){this.d0.stroke();}
		if(this._fill){this.d0.fill();}
		this.f1();
	}
});
function Button(x,y,w,h,t,f){
	this.p = new Point(x, y);
	this.d = new Point(w, h);
	this.v = new Point();
	this.t = t || 'new Button';
	this.f = f;
	this.a = 1;
	this.ac = 0;
	this.c = new Color(20,220,210);
	window.addEventListener('mousedown', this.f, false);
}
Button.prototype = {
	in: function(x,y){
		if(x instanceof Point){
			var _p = x._clone();
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
		window.removeEventListener('mousedown', this.f, false);
		this.f = f;
		window.addEventListener('mousedown', f, false);
	},
	update: function(){
		this.p.add(this.v);
		this.a+=this.ac;
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
	},
	run: function(tool){
		this.update();
		this.draw(tool);
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
	var me = this;
	function run(event){
	}
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
		var center = new Point(ww/2, hh/2);
		var mouse = new Point(center);
		var timer = new Timer();
		var g = [
			'space', 
			'ww', 
			'hh', 
			'tool', 
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