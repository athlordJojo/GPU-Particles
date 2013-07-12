/*
 * konkrete implementierung von AbstractParticlesystem. Benutzt intsanzen von EmitterCPU und 
 * fuehrt damit die partikelberechnungen auf der CPU aus
 */
function ParticlesystemCpu(_particleSystemName, _renderer, _scene, _camera, _world,  _particleSystemData, _simInfo){
	AbstractParticlesystem.call(this,_particleSystemName, _renderer, _scene, _camera, _world, _simInfo);
	var that = this;
	var particleSystemData = _particleSystemData;
	var pointSize = -1;
	var friction = -1;
	var visualizationType = _particleSystemData.visualizationType;
	var threePS = null;
	var emitterData = particleSystemData.emitterData;
	var totalNumberOfParticles = emitterData.numberOfParticles * emitterData.numberOfParticles;
	var lifeDrain = 1;
	var visualizationTypeAsNumber = -1;
	var isGravityDown =  particleSystemData.isGravityDown;
	var pMaterial;
	var massForParticles = 	particleSystemData.mass;
	var textures = particleSystemData.textures;
	this.textureHelper = new TextureHelperPs(that.renderer);
	var threeParticlesystems = [];
	
	//initialisierung starten
	init();
	
	function init(){
		initEmitters();
	}
	
	function initEmitters(){
		var numberOfEmitters = emitterData.numberOfEmitters;
		
		var startVelocities = emitterData.startVelcities;
		if(numberOfEmitters != startVelocities.length){
			throw("Number of Emitters and length of startVelocities array was not equal!");
		}
		
		var startBasesizes = emitterData.startBaseSize;
		if(numberOfEmitters != startBasesizes.length){
			throw("Number of Emitters and length of startBasesizes array was not equal!");
		}
		
		var startLifetimes = emitterData.startLifeTime;
		if(numberOfEmitters != startLifetimes.length){
			throw("Number of Emitters and length of startlifetimes array was not equal!");
		}
		
		var startParticlesToEmit = emitterData.startParticlesEmit;
		if(numberOfEmitters != startParticlesToEmit.length){
			throw("Number of Emitters and length of startParticlesToEmit array was not equal!");
		}else if (startParticlesToEmit > 1){
			throw("Particles to emit was greater then 1");
		}else if (startParticlesToEmit < 0){
			throw ("Particles to emit was less then 0");
		}
		
		var emitterPositions = emitterData.emitterPositions;
		if(numberOfEmitters != emitterPositions.length){
			throw("Number of Emitters and length of Position array was not equal!");
		}
		
		var adjustStartVelVectors = emitterData.adjustStartVelVector; 
		if(numberOfEmitters != adjustStartVelVectors.length){
			throw("Number of Emitters and length of adjustStartVelVectors array was not equal!");
		}
		
		for(var i=0; i<numberOfEmitters; i++ ){
			var emitter = new EmitterCpu("Emitter " + (i+1), emitterData, i, that.renderer, that.scene, that.world, particleSystemData);
			that.registerEmitter(emitter);
		}
	}
	
	
	this.update = function (){
		if(!this.isPause){
			updateEmitters();			
		}
	}
	
	
	function updateEmitters(){
		for(var i=0; i<that.emitters.length;i++){
			var e = that.emitters[i];
			e.emit();
		}
	}

	
	this.freeMemory = function(){

	}
	
}