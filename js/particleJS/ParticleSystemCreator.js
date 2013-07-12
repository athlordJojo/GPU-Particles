/*
 * Instanzen erstellen abhaengig von einem string das jeweilige partikelsystem objekt. ebenfalls konfiguriert es das ps und passt das world objekt an. 
 */
function ParticleSystemCreator(_renderer,_scene, _camera, _world, _loadedTextures, _simInfo){
	var that = this;
	var renderer = _renderer;
	var scene = _scene;
	var camera = _camera;
	this.totalNumberOfMaxParticles = 0;
	var loadedTextures = _loadedTextures;
	var world = _world;
	var simInfo = _simInfo;
	
	this.addPsFromString = function(particleSystemToShow, activeParticleSystems){
		
		if(particleSystemToShow.startsWith("demo")){
			 /*
			 * demo zweig. zb feuer und schnee oder baelle und sparks
			 * hinzufuegen zu der liste der aktiven ps
			 * activeParticleSystems.push(createFirePsPerformanceTest(false));
			 */
			
			if(containsSubstring(particleSystemToShow,"demo01")){
				activeParticleSystems.push(this.createBouncyBallPsDemo1(true, 128));
			}else if (containsSubstring(particleSystemToShow,"demo02")){
				world.localForces[1].mass = 1000000;
				world.localForces[1].position.x = 300;
				world.localForces[1].position.y = 0;
				world.localForces[1].position.z = -240;
				world.localForces[1].minDistance = 60;
				world.localForces[1].attractionMode = 1;
				
				world.localForces[9].mass = 10000000;
				world.localForces[9].position.x = 80;
				world.localForces[9].position.y = 204;
				world.localForces[9].position.z = 80;
				world.localForces[9].minDistance = 400;
				activeParticleSystems.push(this.createFlyingPointsDemo2(true, 2,[128,128]));
			}else if(containsSubstring(particleSystemToShow,"demo03")){
				activeParticleSystems.push(this.createSnowPsPerformanceTest(true, 1,[128]));
				activeParticleSystems.push(this.createBouncyBallPsDemo3(true, 128));
			}else if(containsSubstring(particleSystemToShow,"demo04")){
				world.wind.x = 300;
				activeParticleSystems.push(this.createFirePsDemo4(true, 128));
			}else if(containsSubstring(particleSystemToShow,"demo05")){
				world.localForces[1].mass = 200000;
				world.localForces[1].position.x = 170;
				world.localForces[1].position.y = 10;
				world.localForces[1].position.z = 15;
				world.localForces[1].attractionMode = 1;
				activeParticleSystems.push(this.createSparkPsDemo5(true, 2,[128,128]));
			}else if(containsSubstring(particleSystemToShow,"demo06")){
				world.localForces[1].mass = 1000000;
				world.localForces[1].position.x = 0;
				world.localForces[1].position.y = 40;
				world.localForces[1].position.z = 230;
				world.localForces[1].attractionMode = 1;
				activeParticleSystems.push(this.createFirePsDemo6(true, 128));
			}
			else if(containsSubstring(particleSystemToShow,"demo07")){
				activeParticleSystems.push(this.createFirePsDemo7(true, 256));
				activeParticleSystems.push(this.createSmokePs(true, 256));
				activeParticleSystems.push(this.createSnowPsPerformanceTest(true, 1,[512]));
			}else if(containsSubstring(particleSystemToShow,"demo08")){
				activeParticleSystems.push(this.createFirePsDemo8(true, 256));
				activeParticleSystems.push(this.createSnowPsPerformanceTest(true, 1,[512]));
				world.localForces[1].mass = 1000000;
				world.localForces[1].position.x = 129;
				world.localForces[1].position.y = 57;
				world.localForces[1].position.z = 265;
				
				world.localForces[2].mass = 1000000;
				world.localForces[2].position.x = 122;
				world.localForces[2].position.y = 36;
				world.localForces[2].position.z = 300;
				
				world.localForces[3].mass = 1000000;
				world.localForces[3].position.x = 179;
				world.localForces[3].position.y = 150;
				world.localForces[3].position.z = 265;
				
				world.localForces[4].mass = 1000000;
				world.localForces[4].position.x = 200;
				world.localForces[4].position.y = 200;
				world.localForces[4].position.z = 200;
			}else if(containsSubstring(particleSystemToShow,"demo09")){
				world.wind.x = -50;
				activeParticleSystems.push(this.createSnowPsPerformanceTest(true, 1,[512]));
				activeParticleSystems.push(this.createWhiteSmokeDemo9(true, 2,[256, 256]));
			}else if(containsSubstring(particleSystemToShow,"demo10")){
				activeParticleSystems.push(this.createSparksPsDemo10(true, 256));
				activeParticleSystems.push(this.createSnowPsPerformanceTest(true, 1,[512]));
				world.wind.x = 90;
				world.wind.y = -50;
			}else if(containsSubstring(particleSystemToShow,"demo11")){
				activeParticleSystems.push(this.createFogPs(true, 128));
				world.wind.x = 100;
				world.wind.z = -100;
			}
			else if(containsSubstring(particleSystemToShow,"demo12")){
				activeParticleSystems.push(this.createFirePsDemo12(true, 256));
				activeParticleSystems.push(this.createSmokePs(true, 256));
				activeParticleSystems.push(this.createSnowPsPerformanceTest(true, 1,[256]));
				activeParticleSystems.push(this.createSparkPsPerformanceTest(true, 2, [256, 256]));
				activeParticleSystems.push(this.createBouncyBallPsDemo12(true, 256));
				activeParticleSystems.push(this.createFogPsDemo12(true, 128));
				activeParticleSystems.push(this.createFlyingPointsPs(true, 2,[256,256]));
				activeParticleSystems.push(this.createWhiteSmokeDemo9(true, 2,[128, 128]));
			}else{
				throw("Unknown demo to create: " + particleSystemToShow);
			}
		}else{//performance tests
			numberOfParticles_array = getArrayForEmitterParticles(particleSystemToShow);
			var useGpu = containsSubstring(particleSystemToShow, "GPU");
			if(containsSubstring(particleSystemToShow, "snow")){
				activeParticleSystems.push(this.createSnowPsPerformanceTest(useGpu, 2, numberOfParticles_array));	
			}else if(containsSubstring(particleSystemToShow, "fire")){
				activeParticleSystems.push(this.createFirePsPerformanceTest(useGpu, 2, numberOfParticles_array));
			}else if(containsSubstring(particleSystemToShow, "sparks")){
				activeParticleSystems.push(this.createSparkPsPerformanceTest(useGpu, 2, numberOfParticles_array));
			}else if(containsSubstring(particleSystemToShow, "balls")){
				activeParticleSystems.push(this.createBouncyBallPsPerformanceTest(useGpu, 2, numberOfParticles_array));
			}else if(containsSubstring(particleSystemToShow, "points")){
				world.localForces[1].mass = 1000000;
				world.localForces[1].position.x = -300;
				world.localForces[1].position.y = 10;
				world.localForces[1].position.z = 0;
				world.localForces[1].attractionMode = 1;
				
				world.localForces[2].mass = 1000000;
				world.localForces[2].position.x = 300;
				world.localForces[2].position.y = 10;
				world.localForces[2].position.z = 0;
				world.localForces[2].attractionMode = 1;
				
				world.localForces[3].mass = 1000000;
				world.localForces[3].position.x = 0;
				world.localForces[3].position.y = 10;
				world.localForces[3].position.z = 300;
				world.localForces[3].attractionMode = 1;
				
				world.localForces[4].mass = 1000000;
				world.localForces[4].position.x = 0;
				world.localForces[4].position.y = 10;
				world.localForces[4].position.z = -300;
				world.localForces[4].attractionMode = 1;
				
				world.localForces[9].mass = 10000000;
				world.localForces[9].position.x = 0;
				world.localForces[9].position.y = 180;
				world.localForces[9].position.z = 0;
				world.localForces[9].minDistance = 400;
				activeParticleSystems.push(this.createFlyingPointsPs(useGpu, 2, numberOfParticles_array));
			}else if(containsSubstring(particleSystemToShow, "whitesmoke")){
				activeParticleSystems.push(this.createWhiteSmokePsPerformanceTest(useGpu, 2, numberOfParticles_array));
			}else{
				throw("Unknown argument for: particleSystemToShow:" + particleSystemToShow);
			}
		}	
	}
	
	
	/*
	 * Funktion erstellt schwarzen rauch
	 */
	this.createSmokePs = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;//0.9;//notAdjustedPointsize +  0.5 * notAdjustedPointsize*r_r;
		var pointSizeRandomElement = 5.0;
		var frictionCoeffictiont = 0.003;
		var mass = 15;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.NormalBlending;//THREE.NormalBlending; // THREE.SubtractiveBlending
		var visualisationType = new VisualizationType("smoke", depthtest, blending,pointSizeFixed,pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 1;
		var emitterPositions = [new THREE.Vector3(50,5,-250)];
		var startLifeTime = [2.83];
		var startBaseSize = [100];
		var startVelcities = [new THREE.Vector3(20,5,5)];
		var startParticlesEmit = [0.8];
		var numberOfParticlesPerEmitter = [numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		var adjustStartVel = [1];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(2,10,2)];
		var isVolumeEmitter = [0];//kein volumen
		var volumeForEmitter = [0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, 
						  numberOfParticlesPerEmitter, numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter,volumeForEmitter);
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Smoke (Gpu PS)",renderer,scene, camera,  world, particleSystemData, simInfo);
			console.log("created gpu smoke ps");
		}else{
			ps = new ParticlesystemCpu("Smoke (Cpu PS)",renderer,scene, camera, world, particleSystemData, simInfo);
			console.log("created cpu smoke ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		return ps;
	}	

	/*
	 * Funktion erstellt feuer fuer demo 6
	 */
	this.createFirePsDemo6 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;//0.9;//notAdjustedPointsize +  0.5 * notAdjustedPointsize*r_r;
		var pointSizeRandomElement = 5.0;
		//var frictionCoeffictiont = 0.08;
		var frictionCoeffictiont = 0.008;
		var mass = 15;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;
		var visualisationType = new VisualizationType("fire", depthtest, blending,pointSizeFixed,pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 2;
		var emitterPositions = [new THREE.Vector3(95,5,240),new THREE.Vector3(290,5,150) ];
		var startLifeTime = [1,4.8];
		var startBaseSize = [5, 5];
		var startVelcities = [new THREE.Vector3(-150,90,-8), new THREE.Vector3(0,0,0)];
		var startParticlesEmit = [1, 1];
		var numberOfParticlesPerEmitter = [numberOfP, numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		console.log(numberOfParticles);
		var adjustStartVel = [1, 1];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(2.5,5,2.5), new THREE.Vector3(2.5,5,2.5)];
		var isVolumeEmitter = [1,1];//kein volumen
		var volumeForEmitter = [5,5];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit,
						  numberOfParticlesPerEmitter, numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fire (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fire ps");
		}else{
			ps = new ParticlesystemCpu("Fire (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fire ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}	
	
	/*
	 * Funktion erstellt feuer fuer demo 7
	 */
	this.createFirePsDemo7 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;//0.9;//notAdjustedPointsize +  0.5 * notAdjustedPointsize*r_r;
		var pointSizeRandomElement = 5.0;
		//var frictionCoeffictiont = 0.08;
		var frictionCoeffictiont = 0.008;
		var mass = 15;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;
		var visualisationType = new VisualizationType("fire", depthtest, blending,pointSizeFixed,pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 4;
		var emitterPositions = [new THREE.Vector3(50,0,-250),new THREE.Vector3(180,47,150),new THREE.Vector3(105,30,260),new THREE.Vector3(386,85,131) ];
		var startLifeTime = [1.6,2, 1.6, 2.16];
		var startBaseSize = [110, 5, 90, 5];
		var startVelcities = [new THREE.Vector3(20,5,5), new THREE.Vector3(103,-44,-19), new THREE.Vector3(-12,5,-8), new THREE.Vector3(-88,-74,0)];
		var startParticlesEmit = [1, 1,1,1];
		var numberOfParticlesPerEmitter = [numberOfP, numberOfP/2,numberOfP*2,numberOfP/2];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		console.log(numberOfParticles);
		var adjustStartVel = [1, 1,1 ,1 ];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(2.5,5,2.5), new THREE.Vector3(2.5,5,2.5), new THREE.Vector3(5,50,5), new THREE.Vector3(2.5,5,2.5)];
		var isVolumeEmitter = [0, 1,1,1];
		var volumeForEmitter = [0, 5,30,10];

		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, 
						  startParticlesEmit, numberOfParticlesPerEmitter, numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fire (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fire ps");
		}else{
			ps = new ParticlesystemCpu("Fire (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fire ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}
	
	
	/*
	 * Funktion erstellt feuer fuer demo 4
	 */
	this.createFirePsDemo4 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;//0.9;//notAdjustedPointsize +  0.5 * notAdjustedPointsize*r_r;
		var pointSizeRandomElement = 5.0;
		//var frictionCoeffictiont = 0.08;
		var frictionCoeffictiont = 0.008;
		var mass = 15;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;
		var visualisationType = new VisualizationType("fire", depthtest, blending,pointSizeFixed,pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 2;
		var emitterPositions = [new THREE.Vector3(110,12,120),new THREE.Vector3(-120,0,150) ];
		var startLifeTime = [1.6,2];
		var startBaseSize = [70, 20];
		var startVelcities = [new THREE.Vector3(20,5,5), new THREE.Vector3(-12,32,-8)];
		var startParticlesEmit = [1, 1];
		var numberOfParticlesPerEmitter = [numberOfP, numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		console.log(numberOfParticles);
		var adjustStartVel = [1, 1];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(2.5,5,2.5), new THREE.Vector3(2.5,5,2.5)];
		var isVolumeEmitter = [1,0];
		var volumeForEmitter = [12,0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter,
						  numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter, isVolumeEmitter, volumeForEmitter);
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fire (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fire ps");
		}else{
			ps = new ParticlesystemCpu("Fire (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fire ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}
	
	/*
	 * Funktion erstellt feuer fuer demo 8
	 */
	this.createFirePsDemo8 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;//0.9;//notAdjustedPointsize +  0.5 * notAdjustedPointsize*r_r;
		var pointSizeRandomElement = 5.0;
		//var frictionCoeffictiont = 0.08;
		var frictionCoeffictiont = 0.008;
		var mass = 15;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;
		var visualisationType = new VisualizationType("fire", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 1;
		var emitterPositions = [new THREE.Vector3(100,0,100)];
		var startLifeTime = [1.6];
		var startBaseSize = [47];
		var startVelcities = [new THREE.Vector3(20,5,5)];
		var startParticlesEmit = [1];
		var numberOfParticlesPerEmitter = [numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		console.log(numberOfParticles);
		var adjustStartVel = [1 ];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(2.5,5,2.5)];
		var isVolumeEmitter = [0];
		var volumeForEmitter = [0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
						  numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fire (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fire ps");
		}else{
			ps = new ParticlesystemCpu("Fire (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fire ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}	

	/*
	 * Funktion erstellt feuer fuer demo 12
	 */
	this.createFirePsDemo12 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;//0.9;//notAdjustedPointsize +  0.5 * notAdjustedPointsize*r_r;
		var pointSizeRandomElement = 5.0;
		//var frictionCoeffictiont = 0.08;
		var frictionCoeffictiont = 0.008;
		var mass = 15;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;
		var visualisationType = new VisualizationType("fire", depthtest, blending,pointSizeFixed, pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 2;
		var emitterPositions = [new THREE.Vector3(50,0,-250),new THREE.Vector3(250,0,150) ];
		var startLifeTime = [1.6,2];
		var startBaseSize = [110, 20];
		var startVelcities = [new THREE.Vector3(20,5,5), new THREE.Vector3(-12,32,-8)];
		var startParticlesEmit = [0.25, 0.25];
		var numberOfParticlesPerEmitter = [numberOfP, numberOfP/2];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		console.log(numberOfParticles);
		var adjustStartVel = [1, 1];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(2.5,5,2.5),new THREE.Vector3(2.5,5,2.5)];
		var isVolumeEmitter = [0,0];
		var volumeForEmitter = [0,0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
						  numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);

		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fire (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fire ps");
		}else{
			ps = new ParticlesystemCpu("Fire (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fire ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}	
	
	/*
	 * Funktion erstellt feuer fuer den performancetest. konfiguriert 3 lokal forces
	 */
	this.createFirePsPerformanceTest = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		
		world.localForces[1].mass = 1000000;
		world.localForces[1].position.x = -57;
		world.localForces[1].position.y = 172;
		world.localForces[1].position.z = -14;
		
		world.localForces[2].mass = 1000000;
		world.localForces[2].position.x = 215;
		world.localForces[2].position.y = 60;
		world.localForces[2].position.z = -40;
		world.localForces[2].attractionMode = 1;
		world.localForces[2].minDistance = 130;
		
		
		world.localForces[9].mass = 10000000;
		world.localForces[9].position.x = -35;
		world.localForces[9].position.y = 150;
		world.localForces[9].position.z = 90;
		world.localForces[9].minDistance = 400;
		var pointSizeFixed = 0.5;//0.9;//notAdjustedPointsize +  0.5 * notAdjustedPointsize*r_r;
		var pointSizeRandomElement = 5.0;
		//var frictionCoeffictiont = 0.08;
		var frictionCoeffictiont = 0.008;
		var mass = 15;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;//THREE.NormalBlending;//THREE.AdditiveBlending;
		var visualisationType = new VisualizationType("fire", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		
		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			if(i==0){
				emitterPositions.push(new THREE.Vector3(-50,50,-250));
				startLifeTime.push(1.6);
				startBaseSize.push(400);
				startVelcities.push(new THREE.Vector3(20,5,5));
			}else{
				emitterPositions.push(new THREE.Vector3(-30,0,150));
				startLifeTime.push(2);
				startBaseSize.push(25);
				startVelcities.push(new THREE.Vector3(-12,32,-8));
			}
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(2.5,5,2.5));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);// eigentlich egal wenn kein volumen...
		}

		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
							numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fire (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fire ps");
		}else{
			ps = new ParticlesystemCpu("Fire (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fire ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}
	
	/*
	 * Funktion erstellt ball performancetest. setzt emitter oberhalb der plane. 
	 */
	this.createBouncyBallPsPerformanceTest = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		var pointSizeFixed = 0.5;
		var pointSizeRandomElement = 2.5;
		var frictionCoeffictiont = 0.0005;
		var mass = 500.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.NormalBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;
		var visualisationType = new VisualizationType("bouncyBall", depthtest, blending,pointSizeFixed,pointSizeRandomElement);
		visualisationType.setRttPrecalls(1200);
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			emitterPositions.push(new THREE.Vector3(-350,150,-350));
			startLifeTime.push(20);
			startBaseSize.push(700);
			startVelcities.push(new THREE.Vector3(0,0,0));
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(12,20,12));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);// eigentlich egal wenn kein volumen...
		}
		
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
				           numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Ball (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu ball ps");
		}else{
			ps = new ParticlesystemCpu("Ball (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu ball ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;;
		return ps;
	}	
	
	/*
	 * Funktion erstellt ball 3 demo. emitter wirft die baelle auf die plane.  Es wird ein Emitter verwendet.
	 */
	this.createBouncyBallPsDemo3 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;
		var pointSizeRandomElement = 2.5;
		var frictionCoeffictiont = 0.0005;
		var mass = 500.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.NormalBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;
		var visualisationType = new VisualizationType("bouncyBall", depthtest, blending,pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(1200);
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 1;
		var emitterPositions = [new THREE.Vector3(360,90,0)];
		var startLifeTime = [20.0];
		var startBaseSize = [20];
		var startVelcities = [new THREE.Vector3(-60,0,0)];
		var startParticlesEmit = [1];
		var numberOfParticlesPerEmitter = [numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [1];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(35,38,35)];
		var isVolumeEmitter = [0];
		var volumeForEmitter = [0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
						  numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Ball (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu ball ps");
		}else{
			ps = new ParticlesystemCpu("Ball (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu ball ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;;
		return ps;
	}		
	
	/*
	 * Funktion erstellt ball 1 demo. emitter wirft die baelle wie eine fontaene nach oben. Es werden 2 Emitter verwendet.
	 */
	this.createBouncyBallPsDemo1 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;
		var pointSizeRandomElement = 2.5;
		var frictionCoeffictiont = 0.0005;
		var mass = 500.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.NormalBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;
		var visualisationType = new VisualizationType("bouncyBall", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(1200);
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 2;
		var emitterPositions = [new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)];
		var startLifeTime = [20.0,20];
		var startBaseSize = [20,20];
		var startVelcities = [new THREE.Vector3(0,30,0), new THREE.Vector3(0,30,0)];
		var startParticlesEmit = [1,1];
		var numberOfParticlesPerEmitter = [numberOfP, numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [1,1];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(18,38,18), new THREE.Vector3(18,38,18)];
		var isVolumeEmitter = [0,0];
		var volumeForEmitter = [0,0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
						   numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Ball (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu ball ps");
		}else{
			ps = new ParticlesystemCpu("Ball (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu ball ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;;
		return ps;
	}		

	/*
	 * Funktion erstellt ball 12 demo. Es werden 2 Emitter verwendet.
	 */
	this.createBouncyBallPsDemo12 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.5;
		var pointSizeRandomElement = 2.5;
		var frictionCoeffictiont = 0.001;
		var mass = 500.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.NormalBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;
		var visualisationType = new VisualizationType("bouncyBall", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(1200);
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 2;
		var emitterPositions = [new THREE.Vector3(50,0,100), new THREE.Vector3(-250,90,160)];
		var startLifeTime = [20.0, 20];
		var startBaseSize = [20, 50];
		var startVelcities = [new THREE.Vector3(0,10,0), new THREE.Vector3(0,0,0)];
		var startParticlesEmit = [0.2, 0.2];
		var numberOfParticlesPerEmitter = [numberOfP,numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [1, 1];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(35,38,35), new THREE.Vector3(35,38,35)];
		var isVolumeEmitter = [0,0];
		var volumeForEmitter = [0,0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
						  numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);

		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Ball (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu ball ps");
		}else{
			ps = new ParticlesystemCpu("Ball (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu ball ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;;
		return ps;
	}		
	
	/*
	 * Funktion erstellt smog 12 demo. Es wird 1 Emitter verwendet.
	 */
	this.createFogPsDemo12 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 10;
		var pointSizeRandomElement = 15;
		var frictionCoeffictiont = 0.3;
		var mass = 1;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;//AdditiveBlending;
		var visualisationType = new VisualizationType("fog", depthtest, blending, pointSizeFixed,pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 1;
		var emitterPositions = [new THREE.Vector3(200,0,300)];
		var startLifeTime = [16.6];
		var startBaseSize = [50];
		var startVelcities = [new THREE.Vector3(0,5,0)];
		var startParticlesEmit = [0.1];
		var numberOfParticlesPerEmitter = [numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		var adjustStartVel = [1];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(0,0,0)];
		var isVolumeEmitter = [0];
		var volumeForEmitter = [0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
				numberOfParticles, adjustStartVel, adjustStartVelVectors,isVolumeEmitter, volumeForEmitter);
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fog (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fog ps");
		}else{
			ps = new ParticlesystemCpu("Fog (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fog ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		return ps;
	}		
		
	/*
	 * Funktion erstellt smog 11 demo. Es werden 2 Emitter verwendet.
	 */
	this.createFogPs = function (gpuVersion, numberOfP){
		var pointSizeFixed = 10;
		var pointSizeRandomElement = 15;
		var frictionCoeffictiont = 0.15;
		var mass = 5;
		var particleSystemData;
		var depthtest = false;
		var blending = THREE.AdditiveBlending;//AdditiveBlending;
		var visualisationType = new VisualizationType("fog", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(1000);
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 2;
		var emitterPositions = [new THREE.Vector3(-400,0,-400), new THREE.Vector3(-500,0,-500)];
		var startLifeTime = [12,12];
		var startBaseSize = [1000,1000];
		var startVelcities = [new THREE.Vector3(0,5,0),new THREE.Vector3(0,5,0)];
		var startParticlesEmit = [1.0, 1];
		var numberOfParticlesPerEmitter = [numberOfP, numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// only for cpu		
		var adjustStartVel = [1,1];// ob die start vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)];
		var isVolumeEmitter = [0,0];
		var volumeForEmitter = [0,0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
						  numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Fog (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu fog ps");
		}else{
			ps = new ParticlesystemCpu("Fog (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu fog ps");
		}
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		return ps;
	}		
	
	
	/*
	 * Funktion erstellt den snow performance test.
	 */
	this.createSnowPsPerformanceTest = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		//daten fuer particlesystemdata
		var pointSizeFixed = 0.05;
		var pointSizeRandomElement = 0.75;
		var frictionCoeffictiont = 0.035;
		var mass = 5;
		var depthtest = false;
		var blending = THREE.NormalBlending;
		var visualisationType = new VisualizationType("snow", depthtest, blending, pointSizeFixed,pointSizeRandomElement );
		visualisationType.setRttPrecalls(550);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			emitterPositions.push(new THREE.Vector3(-500,270,-500));
			startLifeTime.push(23);
			startBaseSize.push(1000);
			startVelcities.push(new THREE.Vector3(0,-5,0));
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(0);
			adjustStartVelVectors.push(new THREE.Vector3(0,0,0));
			isVolumeEmitter.push(1);//volumen
			volumeForEmitter.push(200);
		}
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, 
						  startParticlesEmit, numberOfParticlesPerEmitter, numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Snow (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu snow ps");
		}else{
			ps = new ParticlesystemCpu("Snow (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu snow ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}	
	
	
	
	/*
	 * Funktion erstellt sparks 10 demo. Es werden 4 Emitter verwendet.
	 */
	this.createSparksPsDemo10 = function (gpuVersion, numberOfP){
		var pointSizeFixed = 0.05;
		var pointSizeRandomElement = 1.65;
		var frictionCoeffictiont = 0.008;
		var mass = 7.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.AdditiveBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;
		var visualisationType = new VisualizationType("sparks", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = 4;
		var emitterPositions = [new THREE.Vector3(-155,20,160), new THREE.Vector3(130,70,0), new THREE.Vector3(330,0,100), new THREE.Vector3(-100,90,-100)];
		var startLifeTime = [1.6, 2.83, 2.16,4.16];
		var startBaseSize = [220, 1, 1., 0.8];
		var startVelcities = [new THREE.Vector3(0,25,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0,25,0), new THREE.Vector3(0,20,0)];
		var startParticlesEmit = [1, 0.5, 0.5, 0.5];
		var numberOfParticlesPerEmitter = [numberOfP, numberOfP, numberOfP,numberOfP];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;//myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [1, 1,1,1];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [new THREE.Vector3(7,10,7), new THREE.Vector3(7,10,7), new THREE.Vector3(7,10,7), new THREE.Vector3(7,10,7)];
		var isVolumeEmitter = [1,0,0,0];
		var volumeForEmitter = [20,0,0,0];
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
							numberOfParticles, adjustStartVel,adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Sparkler (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu sparkler ps");
		}else{
			ps = new ParticlesystemCpu("Sparkler (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu sparkler ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}			

	/*
	 * Funktion erstellt sparks 5 demo.
	 */
	this.createSparkPsDemo5 = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		var pointSizeFixed = 0.05;
		var pointSizeRandomElement = 1.65;
		var frictionCoeffictiont = 0.008;
		var mass = 7.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.AdditiveBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;
		var visualisationType = new VisualizationType("sparks", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(1000);
		
		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			if(i==0){
				emitterPositions.push(new THREE.Vector3(-50,47,10));
				startLifeTime.push(10);
				startBaseSize.push(20);
				startVelcities.push(new THREE.Vector3(150,-11,0));
			}else{
				emitterPositions.push(new THREE.Vector3(300,70,0));
				startLifeTime.push(3);
				startBaseSize.push(1);
				startVelcities.push( new THREE.Vector3(-100,-44,0));
			}
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(5,10,5));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);
		}
		
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
							numberOfParticles, adjustStartVel, adjustStartVelVectors,isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Sparkler (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu sparkler ps");
		}else{
			ps = new ParticlesystemCpu("Sparkler (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu sparkler ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}	

	/*
	 * Funktion erstellt den sparks performance test.
	 */
	this.createSparkPsPerformanceTest = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		var pointSizeFixed = 0.05;
		var pointSizeRandomElement = 1.65;
		var frictionCoeffictiont = 0.008;
		var mass = 7.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.AdditiveBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;
		var visualisationType = new VisualizationType("sparks", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(500);
		
		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			if(i==0){
				emitterPositions.push(new THREE.Vector3(-180,0,-10));
				startLifeTime.push(1.6);
				startBaseSize.push(300);
				startVelcities.push(new THREE.Vector3(0,20,0));
			}else{
				emitterPositions.push(new THREE.Vector3(300,70,0));
				startLifeTime.push(2.83);
				startBaseSize.push(1);
				startVelcities.push( new THREE.Vector3(0,0,0));
			}
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(5,10,5));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);
		}
		
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
						  numberOfParticles, adjustStartVel, adjustStartVelVectors,isVolumeEmitter, volumeForEmitter);

		var isGravityDown = true;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Sparkler (Gpu PS)",renderer,scene, camera,  world, particleSystemData,simInfo);
			console.log("created gpu sparkler ps");
		}else{
			ps = new ParticlesystemCpu("Sparkler (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu sparkler ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}		

	/*
	 * Funktion erstellt den  rote punkte demo 2. 
	 */
	this.createFlyingPointsDemo2 = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		var pointSizeFixed = 0.01;
		var pointSizeRandomElement = 0;
		var frictionCoeffictiont = 0.03;
		var mass = 1.0;
		var particleSystemData;
		var depthtest = true;
		var blending =  THREE.AdditiveBlending;// THREE.NormalBlending;
		var visualisationType = new VisualizationType("points", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(500);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			if(i==0){
				emitterPositions.push(new THREE.Vector3(190,0,-360));
				startBaseSize.push(190);
			}else{
				emitterPositions.push(new THREE.Vector3(80,0,80));
				startBaseSize.push(190);				
			}
			startLifeTime.push(5);
			startVelcities.push(new THREE.Vector3(0,0,0));
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(0,0,0));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);
		}

		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, 
							numberOfParticlesPerEmitter, numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Points (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu points ps");
		}else{
			ps = new ParticlesystemCpu("Points (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu points ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}	
	
	/*
	 * Funktion erstellt den  rote punkte performance test. 
	 */
	this.createFlyingPointsPs = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		var pointSizeFixed = 0.01;
		var pointSizeRandomElement = 0;
		var frictionCoeffictiont = 0.03;
		var mass = 1.0;
		var particleSystemData;
		var depthtest = true;
		var blending =  THREE.AdditiveBlending;// THREE.NormalBlending;
		var visualisationType = new VisualizationType("points", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(500);
		
		//werte die für alle emitter data objekte verwendet werden
		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			emitterPositions.push(new THREE.Vector3(-500,0,-500));
			startLifeTime.push(5);
			startBaseSize.push(1000);
			startVelcities.push(new THREE.Vector3(0,0,0));
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(0,0,0));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);
		}

		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
							numberOfParticles, adjustStartVel, adjustStartVelVectors,isVolumeEmitter,volumeForEmitter);
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Points (Gpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created gpu points ps");
		}else{
			ps = new ParticlesystemCpu("Points (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu points ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}

	
	/*
	 * Funktion erstellt den  weisen rauch demo 9.
	 */
	this.createWhiteSmokeDemo9 = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		var pointSizeFixed = 2.0;
		var pointSizeRandomElement = 10;
		var frictionCoeffictiont = 0.02;
		var mass = 7.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.AdditiveBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;//THREE.NormalBlending; // THREE.SubtractiveBlending
		var visualisationType = new VisualizationType("whiteSmoke", depthtest, blending, pointSizeFixed, pointSizeRandomElement);
		visualisationType.setRttPrecalls(1200);

		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			if(i==0){
				emitterPositions.push(new THREE.Vector3(93,0,176));
				startLifeTime.push(2.5);
				startBaseSize.push(110);
				startVelcities.push(new THREE.Vector3(70,35,45));
				startParticlesEmit.push(1);
			}else{
				emitterPositions.push(new THREE.Vector3(270,0,-230));
				startLifeTime.push(13);
				startBaseSize.push(40);
				startVelcities.push( new THREE.Vector3(0,0,0));
				startParticlesEmit.push(1);
			}
			
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(10,10,10));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);
		}
		
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
							numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Whitesmoke (Gpu PS)",renderer,scene, camera,  world, particleSystemData,simInfo);
			console.log("created gpu Whitesmoke ps");
		}else{
			ps = new ParticlesystemCpu("Whitesmoker (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu Whitesmoke ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}		
	
	
	/*
	 * Funktion erstellt den  weisen rauch performance test. Konfiguriert den wind. 
	 */
	this.createWhiteSmokePsPerformanceTest = function (gpuVersion, numberOf_Emitters, numberOfParticles_arr){
		world.localForces[9].mass = 2900000;
		world.localForces[9].position.x = 60;
		world.localForces[9].position.y = 190;
		world.localForces[9].position.z = 60;
		world.localForces[9].minDistance = 400;
		
		var pointSizeFixed = 2.0;
		var pointSizeRandomElement = 10;
		var frictionCoeffictiont = 0.02;
		var mass = 7.0;
		var particleSystemData;
		var depthtest = false;
		var blending =  THREE.AdditiveBlending;//THREE.AdditiveBlending;//THREE.NormalBlending;//THREE.NormalBlending; // THREE.SubtractiveBlending
		var visualisationType = new VisualizationType("whiteSmoke", depthtest, blending, pointSizeFixed,pointSizeRandomElement);
		visualisationType.setRttPrecalls(1000);

		var numberOfEmitters = numberOf_Emitters;
		var emitterPositions = [];
		var startLifeTime = [];
		var startBaseSize = [];
		var startVelcities = [];
		var startParticlesEmit = [];
		var numberOfParticlesPerEmitter = [];// only for gpu emitter
		var numberOfParticles = numberOfParticlesPerEmitter;// myHelper.calculateSumForCpuEmitter(numberOfParticlesPerEmitter);// only for cpu		
		var adjustStartVel = [];// ob die satrt vels angepasst werden sollen. wenn 1 dann wird auf die start vel ein zufalls wert draufaddiert
		var adjustStartVelVectors = [];
		var isVolumeEmitter = [];
		var volumeForEmitter = [];
		for(var i=0; i<numberOfEmitters; i++){
			if(i==0){
				emitterPositions.push(new THREE.Vector3(-180,0,-10));
				startLifeTime.push(5);
				startBaseSize.push(100);
				startVelcities.push(new THREE.Vector3(70,35,45));
			}else{
				emitterPositions.push(new THREE.Vector3(300,0,0));
				startLifeTime.push(10);
				startBaseSize.push(40);
				startVelcities.push(new THREE.Vector3(-70,35,45));
			}
			startParticlesEmit.push(1);
			numberOfParticlesPerEmitter.push(numberOfParticles_arr[i]);
			adjustStartVel.push(1);
			adjustStartVelVectors.push(new THREE.Vector3(10,10,10));
			isVolumeEmitter.push(0);//kein volumen
			volumeForEmitter.push(0);
		}
		
		var emitterData = new EmitterData(numberOfEmitters, emitterPositions, startLifeTime, startBaseSize, startVelcities, startParticlesEmit, numberOfParticlesPerEmitter, 
							numberOfParticles, adjustStartVel, adjustStartVelVectors, isVolumeEmitter, volumeForEmitter);
		
		var isGravityDown = false;
		var particleSystemData = new ParticlesystemData(mass, isGravityDown, frictionCoeffictiont,  visualisationType, loadedTextures, emitterData);
		
		var ps = null;
		if(gpuVersion){
			ps = new ParticlesystemGpu("Whitesmoke (Gpu PS)",renderer,scene, camera,  world, particleSystemData,simInfo);
			console.log("created gpu Whitesmoke ps");
		}else{
			ps = new ParticlesystemCpu("Whitesmoker (Cpu PS)",renderer,scene, camera, world, particleSystemData,simInfo);
			console.log("created cpu Whitesmoke ps");
		}
		
		var maxNumberOfParticle = calculateSumOfParticles(numberOfParticlesPerEmitter);
		console.log("Max particles of " + ps.particlesystemname + " : " + maxNumberOfParticle);
		// maximale anzahlan p die von diesem ps generiert werden koennen auf geamtsumme draufaddieren
		that.totalNumberOfMaxParticles += maxNumberOfParticle;
		
		return ps;
	}			
	
	//erstellt ein array mit der anzahl an partikeln pro emitter fuer performancetests durch auswertung des Strings.
	function getArrayForEmitterParticles(s){
		if(containsSubstring(s, "GPU")){
			if(containsSubstring(s, "1")){
				return [128,128];
				//return [16,16];
			}else if(containsSubstring(s, "2")){
				return[256,256];
			}else if(containsSubstring(s, "3")){
				return[256,512];
			}else if(containsSubstring(s, "4")){
				return [512,512];
			}else if(containsSubstring(s, "5")){
				return[1024,512];
			}else if(containsSubstring(s, "6")){
				return[1024,1024];
			}
		}else if(containsSubstring(s, "CPU")){
			if(containsSubstring(s, "1")){
				return [32,32];
			}else if(containsSubstring(s, "2")){
				return[64,64];
			}else if(containsSubstring(s, "3")){
				return[128,128];
				//return[128,16];
			}
		}
	}
	
	function containsSubstring(mainString, substringToFind){
		return mainString.indexOf(substringToFind) !==-1;
	}
	
	/*
	 * Berechnet die gesamt anzahl an partikeln 
	 */
	function calculateSumOfParticles (arrayOfGPUValues){
		var sumOfTotalParticles = 0;
		for(var i =0; i<arrayOfGPUValues.length; i++){
			sumOfTotalParticles += Math.pow(arrayOfGPUValues[i], 2);
		}
		
		return sumOfTotalParticles;
	}
}