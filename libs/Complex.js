function Complex(a, b, c){
	this.set(a,b,c);
}
Object.assign(Complex.prototype, {
	set: function(a, b, c){
		if(!b && a){
			if(typeof a == 'number'){
				this.re = a, this.im = 0;
			}else if(typeof a == 'string'){
				this.setFromString(a);
			}else if(a instanceof Complex){
				this.re = a.re, this.im = a.im;
			}
		}else if(c){
			this.setFromPolar(a, b);
		}else if(a && b){
			this.setFromRect(a, b);
		}
		if(arguments.length == 0){
			this.re = 0, this.im = 0;
		}
	},
	scale: function(s){
		this.re*=s;
		this.im*=s;
	},
	setFromPolar: function(r, a){
		this.re = Math.cos(a)*r;
		this.im = Math.sin(a)*r;
	},
	setFromRect: function(a, b){
		this.re = a, this.im = b;
	},
	setFromString: function(str){
		var x, y, a = false, n, end = str.length;
		for(var i=0;i<str.length;i++){
			if(isNaN(Number(str[i])) && a){
				n = i;
				break;
			}
			if(!isNaN(Number(str[i]))){
				a = true;
			}
		}
		x = eval(str.substring(0, n));
		if(str[str.length-1] == 'i') end--;
		y = eval(str.substring(n, end));
		this.re = x, this.im = y;
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
		if(d){
			this.re+=c;
			this.im+=d;
		}else{
			this.re+=c.re;
			this.im+=c.im;
		}
	},
	sub: function(c, d){
		if(d){
			this.re-=c;
			this.im-=d;
		}else{
			this.re-=c.re;
			this.im-=c.im;
		}
	},
	mul: function(c){
		var _c = this.clone();
		this.re = _c.re*c.re-_c.im*c.im;
		this.im = _c.re*c.im+_c.im*c.re;
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
	clone: function(){
		return new this.constructor(this.re, this.im);
	},
	rotate: function(a){
		var _a = this.angle(), m = this.mag();
		this.setFromPolar(m, _a+a);
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
	},
	round: function(){
		this.re = Math.round(this.re);
		this.im = Math.round(this.im);
	},
	ceil: function(){
		this.re = Math.ceil(this.re);
		this.im = Math.ceil(this.im);
	},
	inverse: function(){
		return new Complex(1/this.re, 1/this.im);
	},
	negate: function(){
		return new Complex(-this.re, -this.im);
	},
	conj: function(){
		return new Complex(this.re, -this.im);
	},
	toString: function(polarForm){
		if(polarForm){
			var m = this.mag(), a = this.angle();
			return m+' '+a;
		}else{
			var r = '', a = this.re, b = this.im;
			if(a == 0 && b == 0){
				return 0;
			}
			if(a!=0) r+=a;
			if(b!=0){
				if(b<0) r+='-';
				else if(a!=0) r+='+';
				r+=Math.abs(b);
				r+='i';
			}
			return r;
		}
	},
	equals: function(a){
		if(this.re == a.re && this.im == a.im) return true;
		else return false;
	}
});
Object.assign(Complex, {
	add: function(){
		var sum = arguments[0].clone();
		for(var i=1;i<arguments.length;i++){
			sum.add(arguments[i]);
		}
		return sum;
	},
	mul: function(){
		var product = arguments[0].clone();
		for(var i=1;i<arguments.length;i++){
			product.mul(arguments[i]);
		}
		return product;
	},
	sub: function(a, b){
		var _a = a.clone();
		_a.sub(b);
		return a;
	},
	pow: function(){
		var a = arguments;
		var _a = a[0].clone();
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
			var _a = a[arguments.length-2].clone();
			for(var i=arguments.length-3;i>=0;i--){
				_a = _a.pow(a[i], a[a.length-1]);
			}
		}else{
			var _a = a[arguments.length-1].clone();
			for(var i=arguments.length-2;i>=0;i--){
				_a = _a.pow(a[i], 0);
			}
		}
		return _a;
	},
});
const Z = Complex;