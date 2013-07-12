/*
 * Abstrakte Klasse die die gemeinsamen attribute eines Partikelsystems kapselt. 
 * Enthaelt 7 konkrete und 1 abstrakte methoden .
 */
function AbstractParticlesystem(_particlesystemname, _renderer, _scene, _camera, _world, _simInfo){
	var that = this;
	
	if(_particlesystemname == null || _particlesystemname == undefined){
		throw("_particlesystemname was null or undefined");
	}else if(_renderer == null || _renderer == undefined){
		throw("_renderer was null or undefined");
	}else if(_scene == null || _scene == undefined){
		throw("_scene was null or undefined");
	}else if(_camera == null || _camera == undefined){
		throw("_camera was null or undefined");
	}else if(_world == null || _world == undefined){
		throw("_world was null or undefined");
	}else if (_simInfo == null || _simInfo == undefined){
		throw("_simInfo was null or undefined");
	}

	this.simInfo = _simInfo;
	this.world = _world;
	this.renderer = _renderer;
	this.scene = _scene;
	this.camera = _camera;
	this.particlesystemname = _particlesystemname;
	//rtt-camera erzeugen. benetigen alle ps. wird verwendet um attribute von partikel zu rendern
	this.cameraRTT = cameraRTT = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000);
	cameraRTT.z = 100;
	this.isAlive = true;
	this.isPause = false;
	this.isShowingRTT = false;
	var textureHelper = new TextureHelperPs(that.renderer);
	this.textures = new Array();// zum entkoppeln von der gui und den ps. gui schreibt nur in die entries
	
	this.emitters = [];
	this.emitterEntries = [];// zum entkoppeln von der gui und den ps. gui schreibt nur in die entries

	this.registerEmitter = function(_emitter){
		this.emitters.push(_emitter);
	}

	/*
	 * Abstrakte funktion die uberschrieben werden muss. Funktion wird von der konkreten klasse zum erstellen von partikeln verwendet.
	 */
	this.update = function(){
		throw("AbstractParticlesystem update methode gerufen!");
	}

	this.getParticlesystemname = function (){
		if(that.particlesystemname == null || that.particlesystemname == undefined){
			throw("particlesystem-name war null oder undefined");
		}

		return that.particlesystemname;
	}


	this.checkIfPsIsShowingRTT = function(){
		if(that.simInfo.isDoingPerformanceTest)return;
		
		that.isShowingRTT = false;
		for(var i=0; i<that.emitters.length; i++){
			var e = that.emitters[i];
			if(e instanceof EmitterGpu){
				var sceneEntriesOfEmitter = e.getRttScenes();
				for(var k=0; k<sceneEntriesOfEmitter.length; k++){
					var sceneEntryOfEmitter = sceneEntriesOfEmitter[k];
					if(sceneEntryOfEmitter.showToScreen){
						that.renderer.render(sceneEntryOfEmitter.scene,that.cameraRTT);
						that.isShowingRTT = true;
					}
				}				
			}

		}
		return that.isShowingRTT;
	}

	/*
	 * deaktiviert das partikelsystem
	 */
	this.handleDeactivation = function(){
		that.isAlive = false;
		for(var i=0; i<that.emitters.length; i++){
			var e = that.emitters[i];
			var psOfEmitter = e.threeParticleSystem; // hierbei handelt es sich um das mesh, also die vertices
			that.scene.remove(psOfEmitter);
		}
		console.log("Ps: " + that.particlesystemname + " wurde deaktiviert ");	
	}

	/*
	 * aktiviert das partikelsystem
	 */
	this.handleReActivation = function (){
		that.isAlive = true;
		for(var i=0; i<that.emitters.length; i++){
			var e = that.emitters[i];
			var psOfEmitter = e.threeParticleSystem; // hierbei handelt es sich um das mesh, also die vertices
			that.scene.add(psOfEmitter);
		}
		console.log("Ps: " + that.particlesystemname + " wurde reaktiviert ");	
	}
	
	this.freeMemory = function(){
		throw("AbstractParticlesystem freeMemory methode gerufen!");
	}

}