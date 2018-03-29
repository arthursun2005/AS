function Complex(a, b, c){
	this.set(a,b,c);
	return this;
}
Object.assign(Complex.prototype, {
	set: function(a, b, c){
		if(a == undefined){
			this.re = 0, this.im = 0;
		}else if(b == undefined && a != undefined){
			if(typeof a == 'number'){
				this.re = a, this.im = 0;
			}else if(typeof a == 'string'){
				this.setFromString(a);
			}else if(a instanceof Complex){
				this.re = a.re, this.im = a.im;
			}
		}else if(c != undefined){
			this.setFromPolar(a, b);
		}else if(a != undefined && b != undefined){
			this.setFromRect(a, b);
		}
	},
	scale: function(s){
		this.re*=s;
		this.im*=s;
	},
	setFromPolar: function(r, a, p = new Complex()){
		this.re = Math.cos(a)*r+p.re;
		this.im = Math.sin(a)*r+p.im;
	},
	setFromRect: function(a, b){
		this.re = a, this.im = b;
	},
	setFromString: function(str){
		var arr = [{str: '', i: 0}], on = 0;
		for(var i=0;i<str.length;i++){
			var _i = str[i] == 'i' || str[i] == 'I', pm = str[i] == '-' || str[i] == '+', md = str[i] == '/' || str[i] == '*';
			if(!isNaN(str[i]) || str[i] == '.' || _i || (pm && (arr[on].str.length == 0 || str[i-1] == '/' || str[i-1] == '*')) || (md && arr[on].str.length != 0)){
				if(_i) arr[on].i++;
				else arr[on].str+=str[i];
			}else if(isNaN(str[i])){
				arr.push({str: '', i: 0});
				on++;
				if(pm || md) i--;
			}
		}
		var x = 0, y = 0;
		for (var i = arr.length - 1; i >= 0; i--) {
			if(arr[i].str == '-') arr[i].str = '-1';
			if(arr[i].str == '') arr[i].str = '1';
			var _1 = arr[i].i%4 == 0 ? 1 : -1;
			var _2 = arr[i].i%4 == 1 ? 1 : -1;
			if(arr[i].i%2 != 0) y+=eval(arr[i].str)*_2;
			else x+=eval(arr[i].str)*_1;
		}
		this.re = x;
		this.im = y;
	},
	angle: function(){
		var a = Math.atan2(this.im, this.re);
		if(a<0) a+=Math.PI*2;
		return a;
	},
	mag: function(){
		return Math.pow(this.re*this.re+this.im*this.im,1/2);
	},
	add: function(c, d){
		if(d != undefined){
			this.re+=c;
			this.im+=d;
		}else{
			this.re+=c.re;
			this.im+=c.im;
		}
		return this;
	},
	get: function(p){
		this.re = p.re, this.im = p.im;
	},
	sub: function(c, d){
		if(d != undefined){
			this.re-=c;
			this.im-=d;
		}else{
			this.re-=c.re;
			this.im-=c.im;
		}
		return this;
	},
	mul: function(c,d,e){
		var _c = this._clone();
		if(!(c instanceof Complex)){
			c = new Complex(c,d,e);
		}
		this.re = _c.re*c.re-_c.im*c.im;
		this.im = _c.re*c.im+_c.im*c.re;
		return this;
	},
	div: function(c,d,e){
		var _c = this._clone();
		if(!(c instanceof Complex)){
			c = new Complex(c,d,e);
		}
		_c.mul(c.inverse2());
		this.get(_c);
		return this;
	},
	pow: function(c, k){
		// z1^z2 = e^(z2*ln(z1))
		if(typeof c == 'number' && typeof k == 'number'){
			c = new Complex(c, k);
			k = arguments[2];
		}else if(typeof c == 'number'){
			c = new Complex(c, 0);
			k = 0;
		}
		var a = Complex.mul(c, this.ln(k));
		return (a.exp());
	},
	sqrt: function(){
		return this.pow(1/2);
	},
	_clone: function(){
		return new this.constructor(this.re, this.im);
	},
	rotate: function(a){
		var _a = this.angle(), m = this.mag();
		this.setFromPolar(m, _a+a);
		return this;
	},
	ln: function(k = 0){
		return new Complex(Math.log(this.mag()), this.angle()+2*Math.PI*k);
	},
	exp: function(){
		if(this.re == 0 && this.im == 0){
			return new Complex(1);
		}else if(this.im == 0){
			return new Complex(Math.exp(this.re));
		}else if(this.re == 0){
			return new Complex(1, this.im, 1);
		}else{
			var v1 = new Complex(Math.exp(this.re));
			var v2 = new Complex(1, this.im, 1);
			return Complex.mul(v1, v2);
		}
	},
	floor: function(){
		this.re = Math.floor(this.re);
		this.im = Math.floor(this.im);
		return this;
	},
	round: function(){
		this.re = Math.round(this.re);
		this.im = Math.round(this.im);
		return this;
	},
	ceil: function(){
		this.re = Math.ceil(this.re);
		this.im = Math.ceil(this.im);
		return this;
	},
	inverse: function(){
		return new Complex(1/this.re, 1/this.im);
	},
	inverse2: function(){
		var _c = this._clone();
		_c.mul(_c.conj());
		var r = _c.re;
		return this.conj().mul(1/r);
	},
	negate: function(){
		return new Complex(-this.re, -this.im);
	},
	conj: function(){
		return new Complex(this.re, -this.im);
	},
	toString: function(polarForm){
		if(polarForm != undefined){
			var m = this.mag(), a = this.angle();
			if(Math.abs(a-1) <= Complex.eps){
				var s = a>0 ? '' : '-';
				return m+'*e^'+s+'i';
			}
			return m+'*e^'+'('+a+'i)';
		}else{
			var r = '', a = this.re, b = this.im;
			if(a == 0 && b == 0) return 0;
			if(a!=0) r+=a;
			if(b!=0){
				if(b<0) r+='-';
				else if(a!=0) r+='+';
				if(Math.abs(b) != 1) r+=Math.abs(b);
				r+='i';
			}
			return r;
		}
	},
	equals: function(a){
		return Math.abs(this.re-a.re)<=Complex.eps && Math.abs(this.im-a.im)<=Complex.eps;
	},
	sin: function(){
		var _c = this._clone();
		var g = ((_c.mul('i')).exp()).sub((_c.mul('-i')).exp()).div('2i');
		return g;
	},
	cos: function(){
		var _c = this._clone();
		var g = ((_c.mul('i')).exp()).add((_c.mul('-i')).exp()).div('2');
		return g;
	},
	tan: function(){
		var _c = this._clone();
		var g = _c.sin().div(_c.cos());
		return g;
	},
	sinh: function(){
		var _c = this._clone();
		var g = _c.exp().sub(_c.negate().exp()).div('2');
		return g;
	},
	cosh: function(){
		var _c = this._clone();
		var g = _c.exp().add(_c.negate().exp()).div('2');
		return g;
	},
	tanh: function(){
		var _c = this._clone();
		var g = _c.sinh().div(_c.cosh());
		return g;
	}
});
Object.assign(Complex, {
	eps: 1e-16,
	add: function(){
		var sum = arguments[0]._clone();
		for(var i=1;i<arguments.length;i++){
			sum.add(arguments[i]);
		}
		return sum;
	},
	mul: function(){
		var product = arguments[0]._clone();
		for(var i=1;i<arguments.length;i++){
			product.mul(arguments[i]);
		}
		return product;
	},
	sub: function(a, b){
		var _a = a._clone();
		_a.sub(b);
		return a;
	},
	pow: function(){
		var a = arguments;
		var _a = a[0]._clone();
		if(typeof a[a.length-1] == 'number'){
			for(var i=1;i<arguments.length-1;i++){
				_a = _a.pow(a[i], a[a.length-1]);
			}
		}else{
			for(var i=1;i<arguments.length;i++){
				_a = _a.pow(a[i], 0);
			}
		}
		return _a;
	},
	pow2: function(){
		var a = arguments;
		if(typeof a[a.length-1] == 'number'){
			var _a = a[arguments.length-2]._clone();
			for(var i=arguments.length-3;i>=0;i--){
				_a = _a.pow(a[i], a[a.length-1]);
			}
		}else{
			var _a = a[arguments.length-1]._clone();
			for(var i=arguments.length-2;i>=0;i--){
				_a = _a.pow(a[i], 0);
			}
		}
		return _a;
	},
});