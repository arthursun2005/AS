/**
	* Complex numbers
	* new Complex(2) = 2+0i
	* new Complex(2,23) = 2+23i
	* new Complex(20,2,true) = 20*e^(2i)
	* new Complex('69i') = 69i
	* new Complex('-3.78i') = -3.78i
	* new Complex('2-I') = 2-i
	* new Complex('2/23-7*9I') = 2/23-63i
**/
function Complex(a, b, c){
	if(!this.set){
		throw new Error('use the new operator');
		return;
	}
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
			if(!isNaN(str[i]) || str[i] == '.' || _i || (pm && (arr[on].str.length == 0 || str[i-1] == '/' || str[i-1] == '*')) || (md && arr[on].str.length != 0 && str[i-1] != 'i')){
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
		return a;
	},
	mag: function(){
		return Math.pow(this.re*this.re+this.im*this.im,1/2);
	},
	add: function(a,b,c,d){
		var f = this;
		if(a instanceof Complex){
			var _c = a._clone();
			if(b) f = this._clone();
		}else{
			var _c = new Complex(a,b,c);
			if(d) f = this._clone();
		}
		f.re+=_c.re;
		f.im+=_c.im;
		return f;
	},
	get: function(p){
		this.re = p.re, this.im = p.im;
	},
	sub: function(a,b,c,d){
		var f = this;
		if(a instanceof Complex){
			var _c = a._clone();
			if(d) f = this._clone();
		}else{
			var _c = new Complex(a,b,c);
			if(d) f = this._clone();
		}
		f.re-=_c.re;
		f.im-=_c.im;
		return f;
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
	div: function(a,b,c){
		var _c = this._clone();
		if(a instanceof Complex){
			var d = a._clone();
		}else{
			var d = new Complex(a,b,c);
		}
		_c.mul(d.inverse());
		this.get(_c);
		return this;
	},
	pow: function(a, b, c){
		/* z1^z2 = e^(z2*ln(z1)) */
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return (_c.mul(this.ln())).exp();
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
		var _c = this._clone();
		return new Complex(Math.log(_c.mag()), _c.angle()+2*Math.PI*k);
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
		if(polarForm){
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
	},
	isPrime: function(){
		if(this.re == 0 && this.im == 0) return false;
		else if(this.im == 0){
			return Math.isPrime(this.re) && (this.re-3)%4<Complex.eps;
		}else if(this.re == 0){
			return Math.isPrime(this.im) && (this.im-3)%4<Complex.eps;
		}else{
			return Math.isPrime(this.im*this.im+this.re*this.re);
		}
	},
	zeta: function(n = 1e6){
		var sum = new Complex(), _c = this._clone();
		for(var i=1;i<=n;i++){
			var _n = new Complex(i);
			var c = Complex.div(_n, Complex.add(_n, 1).pow(_c)).sub(Complex.sub(_n, _c).div(_n.pow(_c)));
			sum.add(c);
		}
		return sum.div(_c.sub(1));
	}
});
Object.assign(Complex, {
	eps: 1e-16, 
	add: function(){
		if(typeof arguments[0] == 'number') var sum = new Complex(arguments[0]);
		else var sum = arguments[0]._clone();
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
		return _a;
	},
	pow: function(){
		var a = arguments;
		var _a = a[0]._clone();
		for(var i=1;i<arguments.length;i++){
			_a = _a.pow(a[i]);
		}
		return _a;
	},
	pow2: function(){
		var a = arguments;
		var _a = a[arguments.length-1]._clone();
		for(var i=arguments.length-2;i>=0;i--){
			_a = _a[i].pow(_a);
		}
		return _a;
	},
	polar: function(r,a,p = new Complex()){
		var c = new Complex();
		c.re = Math.cos(a)*r+p.re;
		c.im = Math.sin(a)*r+p.im;
		return c;
	},
	isPrime: function(a,b,c){
		if(a instanceof Complex){
			return a.isPrime();
		}else{
			var _c = new Complex(a,b,c);
			return _c.isPrime();
		}
	},
	div: function(a,b){
		var _a = a._clone();
		return _a.div(b);
	},
	Re: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.re;
	},
	Im: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.im;
	},
	sin: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.sin();
	},
	cos: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.cos();
	},
	tan: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.tan();
	},
	sinh: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.sinh();
	},
	cosh: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.cosh();
	},
	tanh: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.tanh();
	},
	ln: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.ln();
	},
	log: function(num, base){
		if(!(num instanceof Complex)){
			num = new Complex(num);
		}
		if(!(base instanceof Complex)){
			base = new Complex(base);
		}
		return num.ln().div(base.ln());
	},
	exp: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.exp();
	},
	zeta: function(a,b,c){
		if(a instanceof Complex){
			var _c = a._clone();
		}else{
			var _c = new Complex(a,b,c);
		}
		return _c.zeta();
	}
});
function gamma(a,b,c){
}
Complex.S = Complex.zeta;
function z_(a,b,c){return new Complex(a,b,c);}
/*
Complex.eval = function(str){
	if(typeof str == 'number') {
		return str;
	}
	var arr = [{
		'num': '', 
		'coefficients': []
	}];
	var on = 0;
	function as(n){return n == '+' || n == '-';}
	function md(n){return n == '*' || n == '/';}
	function isVar(n){
		return (!(n in Complex) && !as(n) && !md(n)) && !isNumber(n);
	}
	function isNumber(n){
		if(n == '') return false;
		return !isNaN(Number(n)) || n == 'i';
	}
	function noNumber(n){
		for(var i=0;i<n.length;i++){
			if(isNumber(n[i])) return false;
		}
		return true;
	}
	for(var j=0;j<str.length;j++){
		var ri = str[j];
		console.log(ri);
		if(isNumber(ri) || noNumber(arr[on].num) || isVar(ri) || md(ri)){
			if(ri == '-'){
				arr[on].coefficients.push(-1);
			}else if(isNumber(ri) || md(ri)){
				if(ri == 'i'){
					if(j != 0 && isNumber(str[j-1])){
						arr[on].num+='*';
					}
				}
				arr[on].num+=(ri);
			}else if(isVar(ri)){
				arr[on].coefficients.push(ri);
			}
		}else{
			on++;
			arr.push({'num': '', 'coefficients': []});
		}
	}
	var vs = [];
	var answer = '';
	console.log(arr);
	for(var j=0;j<arr.length;j++){
		var o = arr[j];
		console.log(o.num);
		//o.num = z_(o.num);
		o.c = false;
		o.s = [];
		for(var p=0;p<o.coefficients.length;p++){
			var cc = o.coefficients[p];
			if(cc == -1){
				o.num.mul(-1);
			}else if(!(cc in o.s)){
				o.s.push({v: cc, i: 1});
				o.c = true;
			}else if(cc in o.s){
				o.s[cc].i++;
				o.c = true;
			}
		}
		if(o.c){
			vs.push({s: o.s, n: o.num});
		}
	}
	for(var j=0;j<arr.length;j++){
		var o = arr[j];
		if(!o.c){
			answer+=o.num.toString()+' ';
		}
	}
	for(var j=0;j<vs.length;j++){
		var o = vs[j];
		var v = '';
		for(var p=0;p<o.s.length;p++){
			v+=o.s[p].v;
			if(o.s[p].i != 1) v+='^'+o.s[p].i;
		}
		console.log(o);
		answer+=o.n.toString()+v;
	}
	return answer;
};
*/