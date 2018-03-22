(function(global){
	if(typeof Draw == 'undefined' || typeof PhysicsWorld == 'undefined'){
		console.error("include in AS.js");
		return;
	}
	const W = 156;
	function Resistor(x,y,size,value){
		this.p = new Point(x,y);
		this.value = value;
		this.a = 0;
		this.s = size || 1;
	}
	Resistor.prototype = {
		draw: function(tool){
			tool.translate(this.p);
			tool.stroke(W,W,W);
			tool.strokeWeight(5);
			tool.translate(this.p.minus());
		}
	};
	function Transistor(x,y,size,type){
		this.p = new Point(x,y);
		this.s = this.size || 1;
		if(type == 'npn' || type == 'pnp') this.type = type;
		else this.type = 'npn';
	}
	Transistor.prototype = {
		draw: function(tool){
			tool.translate(this.p);
			tool.stroke(W,W,W);
			tool.strokeWeight(5);
			tool.translate(this.p.minus());
		}
	};
	function PowerSource(){
	}
	function Wire(){
	}
	function Inductor(){
	}
	function Ground(){
	}
	function Capcitor(){
	}
	function Diode(){
	}
	function Circuit(space){
		this.scale = 1;
		this.components = [];
		this.wires = [];
		this.deltaTime = 1; // in milli secs
		if(sapce) this.tool = new Draw();
		else this.tool = null;
	}
	Circuit.prototype.update = function(first_argument) {
	};
	Circuit.prototype.draw = function(tool) {
	};
	Circuit.prototype.update = function(first_argument) {
	};
	global.Circuit = Circuit;
})(this);