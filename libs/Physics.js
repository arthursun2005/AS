(function(global){
	Array.prototype._clone = function(){
		var arr = [];
		for(var i=0;i<this.length;i++){
			var o = this[i];
			if(typeof o == 'object'){
				if(Array.isArray(o)) arr[i] = o._clone();
				else arr[i] = o.clone();
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
				if(Array.isArray(o)) arr[i] = o._clone();
				else arr[i] = o.clone();
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
})(this);