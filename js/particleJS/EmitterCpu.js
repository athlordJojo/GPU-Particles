/*
 * Konkrete Implementierung von AbstractEmitter. 
 * Verwendet ParticleCPU-Objekte. Und fuehrt dadurch die Berechnung auf der CPU durch.
 */
function EmitterCpu(_name, _emitterData, _i, _renderer, _scene, _world, _particleSystemData){
	AbstractEmitter.call(this, _name, _emitterData.emitterPositions[_i], _emitterData.startParticlesEmit[_i], _emitterData.startLifeTime[_i],  _emitterData.startBaseSize[_i], _emitterData.startVelcities[_i], null, _scene, _world,  _emitterData.isVolume[_i], _emitterData.volumeHeight[_i]);
	var that = this; 
	console.log("initiliasing CPU-Emitter: " + that.name );
	var emitterData = _emitterData;
	var numberOfParticlesForThisEmitter = _emitterData.numberOfParticles[_i]*_emitterData.numberOfParticles[_i]; 
	this.usedParticles = new Array();
	this.unusedParticles = new Array();
	var maxToEmit = this.unusedParticles.length; 
	var renderer = _renderer;
	var textureHelper = new TextureHelperPs(renderer);
	var lifeDrain = 1;
	var particleSystemData = _particleSystemData;
	var textures = particleSystemData.textures;
	var visualizationType = particleSystemData.visualizationType;
	var pointSizeFixedElement = visualizationType.pointSizeFixedElement;
	var pointSizerandomElement = visualizationType.pointSizeRandomElement;
	var visualizationTypeAsNumber;
	var adjustStartVelVector = _emitterData.adjustStartVelVector[_i];
	var isSnowParticleSystem;
	
	// initialisierung starten
	init();
	
	function init(){
		visualizationTypeAsNumber = visualizationType.getTypeAsNumberForUniforms();
		isSnowParticleSystem = visualizationTypeAsNumber==2; 
		that.threeParticleSystem = initThreePS();// three particlesystem initialisieren
	}
	
	/*
	 * erstellt und konfiguriert das Three.particlesystem
	 */
	function initThreePS(){
		var particles = new THREE.Geometry();
		for(var i=0; i<numberOfParticlesForThisEmitter; i++){
			var threeParticle = new THREE.Vector3(9999,9999,9999);
			var velvec = new THREE.Vector3(0,0,0);
			var particleObject = new ParticleCpu(lifeDrain, that.world, threeParticle, velvec, particleSystemData);
			that.unusedParticles.push(particleObject);
			particles.vertices.push(threeParticle);
		}
		maxToEmit = that.unusedParticles.length; 
		
		var particleSystem = new THREE.ParticleSystem(particles, createMaterial(emitterData.numberOfParticles[_i]));	
		that.scene.add(particleSystem);
		return particleSystem;
	}
	
	/*
	 * Erstellt das Material welches fuer dier grafische Darstellung der CPU-Partikel verwendet wird.
	 */
	function createMaterial(particlesOfE){
		var attributes_Shader_Particles = {
		      aPoints: { type: 'v2', value: textureHelper.createTextureCoordinates(particlesOfE) }
		};
		
		var uniforms = {
		  tSmokeAlpha:   { type: "t", value: textures.cloudAlpha },
		  tSmokeColor:   { type: "t", value: textures.cloudColor },
	      tFire1:   { type: "t", value: textures.fire1},
	      tFire2:   { type: "t", value: textures.fire2},
	      tFire3:   { type: "t", value: textures.fire3},
	      tFire4:   { type: "t", value: textures.fire4},
		  tSnow:   { type: "t", value: textures.snow },
		  tball:   { type: "t", value: textures.ball},
		  tstar:   { type: "t", value: textures.star},
		  tRandom: { type: "t", value:createRandomTexture(particlesOfE)},
	      pointsize_fixed: { type: "f", value:pointSizeFixedElement},
	      pointsize_randomElement: { type: "f", value:pointSizerandomElement},
		  isGpuDoingSim: { type: "i", value:0 },
		  visualizationType: { type: "i", value:visualizationTypeAsNumber }
	  };	  
	
	  var materialToScreen = new THREE.ShaderMaterial({
		  uniforms:       uniforms,
		  attributes:     attributes_Shader_Particles,
		  vertexShader:   $('#vertexshaderToScreen').text(),
		  fragmentShader: $('#fragmentshaderToScreen').text(),
	
		  blending:       visualizationType.blendingMode,
		  depthTest:      visualizationType.depthTest,
		  transparent:    true
	      });
	  
	  return materialToScreen;
	}
	
	/*
	 * erstellt die noise textur
	 */
	function createRandomTexture(numParticles){
		var randomData = textureHelper.generateRandomTexture(numParticles);
		var rtTextureRandom = new THREE.WebGLRenderTarget(numParticles, numParticles, {wrapS:THREE.RepeatWrapping,wrapT:THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat,type:THREE.FloatType });

		var materialRandom = new THREE.ShaderMaterial({
		uniforms: {
		tDiffuse: { type: "t", value:randomData }
		},
		vertexShader: $('#vertexShader').text(),
		fragmentShader: $('#copyFragmentShader').text()
		});
		
		var plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
		var quad = new THREE.Mesh(plane, materialRandom);
		quad.position.z = -100;
		var sceneRTTRandom = new THREE.Scene();
		sceneRTTRandom.add(quad);
		var cameraRTT = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000);
		renderer.render(sceneRTTRandom, cameraRTT,rtTextureRandom, false);		
		return rtTextureRandom;
	}
	
	function updateParticles(){
		var p;
		for(var i=0; i<that.usedParticles.length;i++){
			p = that.usedParticles[i];
			p.update();
			if(p.isDead){
				that.usedParticles.splice(i, 1);
				i--;
				that.unusedParticles.push(p);
				p.threeParticle.x = 9999;
				p.threeParticle.y = 9999;
				p.threeParticle.z = 9999;
			}
		}
		that.threeParticleSystem.geometry.verticesNeedUpdate = true;		
	}
	
	this.emit = function (){
		updateParticles();
		var halfBaseLifeTime = this.baseLifeTime/4;//noetig da es sich durch gui geanert haben koennte
		// jeder cpu emitter darf max den xten anzahl an p aemittern. bsp: 2 emitter gibt es, insgesamt 1000 p und es sollen 0.2 von beiden emitiert werden --> 
		// 0.2 * (1000/2) = 100
		var pToEmit = this.numberOfParticlesToEmit * (maxToEmit/30)	;
		//console.log(pToEmit);
		for(var i=0; i<pToEmit; i++){
			if(that.unusedParticles.length == 0){
				//console.log("Kann keine weiteren Partikel erzeugen. Keine freien partikel");
				break;
			}
			var particleObject = that.unusedParticles.pop();
			//console.log(this.positionOfEmitter.x);
			var threeParticle = particleObject.threeParticle;// ist ein vector3
			
			// neuem partikel position geben 
			threeParticle.x = that.positionOfEmitter.x + Math.random() * that.baseEmitterSize;
			if(that.isVolume){
				threeParticle.y = that.volumeHeight* Math.random();
			}else{
				threeParticle.y = that.positionOfEmitter.y;
			}
			threeParticle.z = that.positionOfEmitter.z + Math.random() * that.baseEmitterSize;

			// neuem partikel lifetime uebergeben 
			var newLife = Math.random()*this.baseLifeTime + this.baseLifeTime;
			
			particleObject.startLife = newLife;

			//start geschwindigkeit geben
			particleObject.velocityVector.x = this.baseVelocity.x + (-1*adjustStartVelVector.x ) + 2*adjustStartVelVector.x*Math.random();// x direction
			particleObject.velocityVector.y = this.baseVelocity.y + (-1*adjustStartVelVector.y ) + 2*adjustStartVelVector.y*Math.random();
			particleObject.velocityVector.z = this.baseVelocity.z + (-1*adjustStartVelVector.z ) + 2*adjustStartVelVector.z*Math.random();//this.baseVelocity.z;// z direction

			particleObject.reInit();
			that.usedParticles.push(particleObject);
		}
	}
	
	console.log("initiliasing CPU-Emitter: " + that.name + ", done");
}