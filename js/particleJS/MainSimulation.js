/*
 * Stellt den einstiegspunkt der partilesimulation dar. wird von htmlGuiHandler.js aufgerufen.
 * Die update methode aktualisiert alle enthaltenen partikelsysteme. 
 * Verwendet eine instanz der klasse Particlesystemcreator fuer die erstellung von partikelnsystemen. 
 */
function MainSimulation(_particleSystemToShow, _mode, _onFinishCallBack){
	var that = this;
	var onFinishCallBack = _onFinishCallBack;
	var $divContainer;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var mouseX = 0, mouseY = 0;
	var width = window.innerWidth * 0.8;
	var height = window.innerHeight * 0.97;
	var ratio = width/height;
	var camPosXStart = 480, camPosYStart = 150,camPosZStart = 500, camLookX = 0,camLookY = 0 ,camLookZ = 0;
	var scene, renderer,camera, $divContainer, myHelper, myGui, world;
	var activeParticleSystems = new MyArray,activeUpdateInfos, inactiveParticleSystems = new MyArray, inactiveUpdateInfos = new MyArray;
	this.sky = null;
	this.axisCube = null;
	this.showLocalForceMeshes = true;
	this.listOfMeshesFromLocalForces = [];
	var planeSize = 1000;
	var loadedTextures = null;
	this.planeTexture;
	var psCreator = null;
	var simulationInfo;
	// variabeln fur testing
	var particleSystemToShow = _particleSystemToShow;
	var mode = _mode;
	var isRunning = true;// gibt an ob die partikel berechnet werden.
	var timeToTestPerformance = 30000;//30 sec
	var frameCounter = 0;// anzahl an gerenderten Frames
	var timerID = null;
	var totalNumberOfMaxParticles = 0;
	var threeJSCamcontroller;
	
	this.handleAxisHelperUpdate = function (value){
		if(value){
			scene.add(that.axisCube);
		}else{
			scene.remove(that.axisCube);
		}
	}

	/*
	 * prieft ob ein inaktives ps wieder ueber die gui aktiviert wurde
	 */
	this.checkInactivePs = function(){
		for(var i=0; i<inactiveParticleSystems.length;i++){
			var inactivePs = inactiveParticleSystems[i];
			if(inactivePs.isAlive){
				inactivePs.handleReActivation();
				inactiveParticleSystems.removeItemAt(i);
				activeParticleSystems.push(inactivePs);
				i = i-1;
			}
		}
	}

	/*
	 * wird aufgerufen wenn localforces angezeigt werden sollen oder nicht.
	 */
	this.handleShowLocalForces = function(value){
		for(var i=0; i<that.listOfMeshesFromLocalForces.length; i++){
			var meshOfForce = that.listOfMeshesFromLocalForces[i];
			if(value){
				scene.add(meshOfForce);
			}else{
				scene.remove(meshOfForce);
			}
		}
	}

	/*
	 * Wird aufgerufen wenn HelperPs erfolgreich die texturen laden konnte.
	 * ruft init auf und initialisiert damit die partikelsystem erstrellung.
	 */
	this.onMyHelperReady_success = function(){
		loadedTextures = myHelper.getLoadedTexture(); 

        init();


		
		$('#dvLoading').fadeOut(250, function(){
			console.log("max Particles: " + psCreator.totalNumberOfMaxParticles);
			update();	
		});	
	}
	
	/*
	 * Wird ausgerufen wenn HelperPs nicht erfolgreich die texturen laden konnte.
	 */
	this.onMyHelperReady_failure = function(){
		alert("Error while loading images");
	}	

	/*
	 * Startet HelperPs  damit diese instanz die texturen laden kann
	 */
	function preInit(){
		myHelper = new HelperPs(2, that.onMyHelperReady_success, that.onMyHelperReady_failure);
	}

	preInit();
	
	/*
	 * initialisiert die anwendung:
	 * - konfiguriert die kamera und die steuerung der kamera per maus und tastatur
	 * - laesst die gui mit einem GUIBuilder-Objekt erstellen
	 * - erstellt wen webGLrenderer
	 * - erstellt das world-objekt
	 * - ruft initParticlesystems zum erstellen der ps
	 */
	function init(){
		//webglrenderer erstellen
		$divContainer = $('#mainDiv');
		renderer = getRenderer();
		$divContainer.append( renderer.domElement );
		
		//hauptscenen-obejekt erstellen
		scene = new THREE.Scene();
        var plane = new THREE.PlaneGeometry(planeSize,planeSize);
        //var quad = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({color: 0X222222, map: loadedTextures.plane, transparent: true}));
        loadedTextures.plane.repeat.set( 10, 10);
        var quad = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({color: 0X444444, map: loadedTextures.plane, transparent: true}));
        //quad.rotation.x = 0 * Math.PI / 180;
        scene.add(quad);


		//kamera erstellen
		camera = new THREE.PerspectiveCamera(45, ratio, 1, 3000);
		camera.position.set(camPosXStart,camPosYStart,camPosZStart);
		
		//kamerasteuerung erstellen		
		threeJSCamcontroller = new THREE.FlyControls( camera, renderer.domElement );
		threeJSCamcontroller.movementSpeed = 0.9;
		threeJSCamcontroller.rollSpeed = 0.004;
		threeJSCamcontroller.autoForward = false;
		threeJSCamcontroller.dragToLook = true;
		camera.lookAt(new THREE.Vector3(camLookX,camLookY,camLookZ));
		world = initWorldObject(myHelper);
		
		var SimulationInfo = function(){
			this.simulationIsRunning = true;
			this.isDoingPerformanceTest = mode == "performanceTest";
		}
		simulationInfo = new SimulationInfo();
		psCreator = new ParticleSystemCreator(renderer,scene, camera,world, loadedTextures, simulationInfo);
		that.handleShowLocalForces(that.showLocalForceMeshes);

		initParticlesystems();//partikelsysteme erstellen

		//gui erstellen
		myGui = new GuiBuilder(camera,camPosXStart,camPosYStart,camPosZStart, camLookX,camLookY,camLookZ, activeUpdateInfos, world, that, mode, simulationInfo, activeParticleSystems);
		
		that.axisCube = myHelper.getAxisCube(5000, 0.001,0,0,0);
		that.handleAxisHelperUpdate(false);// axiscube soll per default nicht sichtbar sein. 

		//handle resize
		window.addEventListener('resize', onResizeHandler, false);

        that.sky = myHelper.createSkybox();
        scene.add(that.sky);

        quad.rotation.x = -90 * Math.PI / 180;

        world.update();
        if(world.deltaT > 0.5){
            console.log("changed deltat");
            world.deltaT = 1/60;
        }

	}

	/*
	 * erstellt partikelsysteme mit einem particlesystemcreator-objekt anhand des strings
	 */
	function initParticlesystems(){
		psCreator.addPsFromString(particleSystemToShow, activeParticleSystems);
	}

	/*
	 * erstellt das world-objekt und fuegt lokalekraefte hinzu. die letzten zwei haben koennen die 10fache masse erhalten.
	 */
	function initWorldObject(helper){
		var gravityVec = new THREE.Vector3(0,-9.81,0);
		var windVec = new THREE.Vector3(0,0,0);

		var localForces = [];
		for(var i=0; i<10; i++){
			var x = 0;//-410 + (i*90);;//-500 + (i*100);;
			var y = 10;
			var z = 400 - (i*80);//0;//-100 + (i*45);
			var posOfLocalForce = new THREE.Vector3(x,y,z);
			var mode = 0; // 0 = anziehend/pull, 1 = abstossend/push
			var mass = 0;
			
			var minDistance = 38;
			var maxMass = 1000000;
			var meshForForce = null; 
			if(i>=8){//extreme kraft
				meshForForce = maxMass *= 10;
				meshForForce = helper.getLocalForceSphere(30);
			}else{
				meshForForce = helper.getLocalForceSphere(15);
			}
			var localForce = new LocalForce(posOfLocalForce,mass, mode, meshForForce, maxMass,minDistance);
			localForces.push(localForce);
			that.listOfMeshesFromLocalForces.push(localForce.meshRepresentation);
		}
		

		var newWorld = new World(gravityVec, windVec, localForces, 1000);
		return newWorld;	
	}

	/*
	 * wird aufgherufen wenn das canvas-objekt in der groesse veraendert wird. also der user das fenster skaliert.
	 */
	function onResizeHandler(){
		width = window.innerWidth * 0.8;
		height = window.innerHeight * 0.97;
		renderer.setSize(width, height);
		ratio = width/ height;
		camera.aspect = ratio;
		camera.updateProjectionMatrix();
	}

	/*
	 * fuehrt die aktualisierung der enthaltenen partikelsysteme durch
	 */
	function update() {
	  if(!simulationInfo.simulationIsRunning){
		  // wenn berechnung abgebrochen wurde durch timer oder stop button stoppe simulation
		  if(timerID != null){
			  window.clearTimeout(timerID);
		  }
		  myGui.deleteSelf();
		  onFinishCallBack();//htmlgui rufen damit sie weis das anwendung beendet wurde
		  for(var i=0; i<activeParticleSystems.length; i++){
			  var partS = activeParticleSystems[i];
			  partS.freeMemory();
		  }
		  //renderer.deallocateObject(scene);
		  //renderer.deallocateRenderTarget(renderer);
		  return;
	  }
	  world.update();
	  
	  // loeasung fuer die das problem das bei der ersten ausfuehrung delta t ca 3 sec ist, weil dadurch die beschleuniging groß wird vold + a*deltaT.
	  // grund ist, dat gui die irgendwas laedt. kein ursache gefdunden was dat dort laedt
	  if(world.deltaT > 0.5){
		  console.log("changed deltat");
     	  world.deltaT = 1/60; 
	  }
	  
	  var isAnyPsShowingRTT = false;
	  
	  //aktiven ps aktualisieren. sollte ein ps deaktiviert worden sein wird es in die entsprechende liste verschoben.
	  for(var i=0; i<activeParticleSystems.length; i++){
	  	var ps = activeParticleSystems[i];
	  	if(!ps.isAlive){// ps is ist durch gui deaktiviert worden oder hat sich selber deaktiviert
	  		ps.handleDeactivation();
	  		activeParticleSystems.removeItemAt(i);
	  		inactiveParticleSystems.push(ps);
	  		i = i-1;
	  		continue;
	  	}
	  	ps.update();	
	  	if(!isAnyPsShowingRTT){// nur setzen wenn noch kein ps tex zeigt
	  		isAnyPsShowingRTT = ps.checkIfPsIsShowingRTT();	
	  	} 
	  }
	  
	  that.checkInactivePs(inactiveParticleSystems);
	  threeJSCamcontroller.update(50*world.deltaT);
	  myGui.update();
	  if(!isAnyPsShowingRTT)renderer.render(scene, camera);
	  
	  renderer.clearTarget( null, false, true );// behebt fehler in firefox. Sonst wurde der renderer dort nich gecleared  
	  frameCounter++;
      //aktiviert einen timer fuer performance messung. muss hier geschenen da der erst aufruf der methode update lange dauern kann
	  //was dazu fuehren kann, das bevor die initialisierung wriklich abgeschlossen ist, der timeout bereits ausgeloest wurde
	  // davor war der start in initParticlesystems
	  if(frameCounter == 25 && timerID == null && mode == "performanceTest"){
		timerID = window.setInterval(onTimerHandler, timeToTestPerformance);
		console.log("timer started");
		frameCounter = 0;
	  }
	  requestAnimationFrame(update);
	}

	/*
	 * erstellt den wbglrenderer. renderer verwendete anti-aliasing
	 */
	function getRenderer(){
		var renderSettings = function(){
			this.antialias = true;
			this.clearAlpha = 1;
			this.premultipliedAlpha = false;
		}

		var renderer_retval = new THREE.WebGLRenderer(new renderSettings());
		renderer_retval.setSize(width,height);
		renderer_retval.autoClear = false;// noetig damit nicht three js clear ruft. true fueherte dazu das nach jedem render befehl das zuvor generierte bild verworfen wird.  
		
		return renderer_retval;
	}
	
	/*
	 * wird aufgerufen wenn der 30 sec performancetest vorbei ist.
	 */
	function onTimerHandler(){
		var resultString = "Performance-Test done! \n Result for '" +_particleSystemToShow + "' : " + frameCounter + " Frames in " + (timeToTestPerformance/1000) + " seconds. \n Do you want to go back to the main-menu ?"; 
		threeJSCamcontroller.mouseStatus = 0;
		$('div[class*="apprise"]').remove();// falls gerade der text angezeigt wird, das rtt/emitsize/life nicht geandert werden kann. wenn dies nicht entfernt wird. kommt es zu darstellungsfehlern	
		apprise(resultString, {'verify':true}, onTextDoneCheckboxHandler);
		window.clearTimeout(timerID);
		// gegen fehler das nach anzeioge des textsimmer die kamera immer bewegt wird
	}
		
	/*
	 * handler der aufgerufen wird wenn der nutzer entschiedenhat ob er zurueck zum main menu will oder nicht
	 */	
	function onTextDoneCheckboxHandler(r){
		simulationInfo.isDoingPerformanceTest = false;// perfromancetest vorbei. emitsize, lifeteime,  emitsper call rtt-anzeige aktivieren
		simulationInfo.simulationIsRunning = !r;
		
	}
}