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
	mult: function(c){
		var _c = this.clone();
		this.re = _c.re*c.re-_c.im*c.im;
		this.im = _c.re*c.im+_c.im*c.re;
	},
	pow: function(c, k){
		// z1^z2 = e^(z2*ln(z1))
		var a = Complex.mult(c, this.ln(k));
		this.set(a.exp());
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
			return Complex.mult(v1, v2);
		}
	}
});
Object.assign(Complex, {
	add: function(){
		var sum = new Complex();
		for(var i=0;i<arguments.length;i++){
			sum.add(arguments[i]);
		}
		return sum;
	},
	mult: function(){
		var product = arguments[0].clone();
		for(var i=1;i<arguments.length;i++){
			product.mult(arguments[i]);
		}
		return product;
	},
	sub: function(a, b){
		var _a = a.clone();
		_a.sub(b);
		return a;
	},
	pow: function(a, b, k){
		var _a = a.clone();
		_a.pow(b, k);
		return _a;
	},
});