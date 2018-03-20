(function(global){
	if(typeof Draw == 'undefined'){
		console.error("no drawing tools, please include in AS.js");
		return;
	}
	function Resistor(){
		
	}
	function Transistor(){
		
	}
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
		this.airResistance = -1; // if > 0, air interacts
		this.wireLength = -1; // if > 0, wires have resistence and interact
		this.components = [];
		this.deltaTime = 1; // in secs
		if(sapce) this.tool = new Draw();
		else this.tool = null;
	}
	Circuit.prototype.update = function(first_argument) {
	};
	global.Circuit = Circuit;
})(this);