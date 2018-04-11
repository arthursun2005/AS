(function(global){
	// require three.js
	var DL = {};
	DL.World = function(){
	};
	DL.Line = function(a,b){
	};
	DL.Block = function(x,y,z,dx,dy,dz,ax,ay,az){
	};
	DL.init = function() {
		const ww = window.innerWidth, hh = window.innerHeight;
		var container = document.querySelector('#container');
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(ww, hh);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		var camera = new THREE.PerspectiveCamera(75,ww/hh,1,1e10);
		var scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);
		var fog = new THREE.FogExp2(0xffffff,0);
		scene.fog = fog;
		scene.add(camera);
		container.appendChild(renderer.domElement);
		var light1 = new THREE.HemisphereLight( 0xffff99, 0xffffff, 2/3);
		scene.add(light1);
		var light2 = new THREE.PointLight(0xffffff,1/2,0);
		light2.position.set(100,200,-240);
		light2.castShadow = true;
		scene.add(light2);
		var tt = ['ww', 'hh', 'container', 'renderer','camera', 'scene', 'fog', 'light1', 'light2'];
		for(var i = 0;i<tt.length;i++){global[tt[i]] = eval(tt[i]);}
	};
	global.DL = DL;
})(this);