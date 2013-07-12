function HelperPs(skyboxVersion, successImageLoadCallback, errorImageLoadCallback ){
	var that = this;
	//this.monitor = new THREE.LoadingMonitor();
	this.reflectionCube
	var geometryOflocalForceModel = null;

	if (typeof String.prototype.startsWith != 'function') {
		  // see below for better implementation!
		  String.prototype.startsWith = function (str){
		    return this.indexOf(str) == 0;
		  };
		}
	
	this.getAxisCube = function (axisSize, cubeSize, xpos, ypos, zpos){
	  var cube = new THREE.Mesh(new THREE.CubeGeometry( cubeSize, cubeSize, cubeSize ), new THREE.MeshNormalMaterial );
	  cube.position.x = xpos;
	  cube.position.y = ypos;
	  cube.position.z = zpos;
	  cube.add(new THREE.AxisHelper(axisSize));		
	  return cube;
	}


	this.createSkybox = function (){
		var shader = THREE.ShaderUtils.lib["cube"];
		shader.uniforms[ "tCube" ].value = this.reflectionCube;
		var material = new THREE.ShaderMaterial({
		    fragmentShader  : shader.fragmentShader,
		    vertexShader    : shader.vertexShader,
		    uniforms    : shader.uniforms,
		    side: THREE.BackSide,
		    depthWrite: false
		});		

		var skybox = new THREE.Mesh( new THREE.CubeGeometry( 1600, 1600, 1600), material);

		return skybox;
	}
	
	
	this.getLocalForceSphere = function(scaleFactor){
		
		/*
		 * erstellet das mesh aus einem geladenen model
		 */
//		var material = new THREE.MeshBasicMaterial({color: 0XFF0000});
//
//		var mesh = new THREE.Mesh( geometryOflocalForceModel, material );// erstelle mesh aus zuvor geladenen geometry
//		mesh.scale.set(5, 5, 5);*/
		
		var materialC = new THREE.SpriteMaterial( { map: magnetTextur, useScreenCoordinates: false, transparent: true} );
		var group = new THREE.Object3D();
		var sprite = new THREE.Sprite( materialC );
		sprite.scale.set(scaleFactor, scaleFactor, scaleFactor);
		//group.add( sprite );
		
		return sprite;
		
		//sprite.position.set( x, y, z );
		
		/*
		var plane = new THREE.PlaneGeometry(10,10); 
		var mesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: magnetTextur, transparent: true}));
		mesh.doubleSided = true;
		mesh.scale.set(2, 2, 2);
		mesh.rotation.z = 180 * Math.PI / 180;
		return mesh;*/
	}

	var urlPrefix, urls;
	if(skyboxVersion == 1){
		urlPrefix = "./img/skybox/CloudyLightRays";
		var f = urlPrefix + "/CloudyLightRays";
		var resolution = 1024;
		var back = f + "Back" + resolution + ".png";
		var front = f + "Front" + resolution + ".png";
		var up = f + "Up" + resolution + ".png";
		var down = f + "Down" + resolution + ".png";
		var left = f + "Left" + resolution + ".png";
		var right = f + "Right" + resolution + ".png";
	}else if(skyboxVersion == 2){
		urlPrefix = "./img/skybox/FullMoon";
		var f = urlPrefix + "/FullMoon";
		var resolution = 1024;
		var back = f + "Back" + resolution + ".png";
		var front = f + "Front" + resolution + ".png";
		var up = f + "Up" + resolution + ".png";
		var down = f + "Down" + resolution + ".png";
		var left = f + "Left" + resolution + ".png";
		var right = f + "Right" + resolution + ".png";
	}else if(skyboxVersion == 3){
		urlPrefix = "./img/skybox/DarkStormy";
		var f = urlPrefix + "/DarkStormy";
		var resolution = 1024;
		var back = f + "Back" + resolution + ".png";
		var front = f + "Front" + resolution + ".png";
		var up = f + "Up" + resolution + ".png";
		var down = f + "Down" + resolution + ".png";
		var left = f + "Left" + resolution + ".png";
		var right = f + "Right" + resolution + ".png";
	}else if(skyboxVersion == 4){
		urlPrefix = "./img/skybox/SunSet";
		var f = urlPrefix + "/SunSet";
		var resolution = 2048;
		var back = f + "Back" + resolution + ".png";
		var front = f + "Front" + resolution + ".png";
		var up = f + "Up" + resolution + ".png";
		var down = f + "Down" + resolution + ".png";
		var left = f + "Left" + resolution + ".png";
		var right = f + "Right" + resolution + ".png";
	}else if(skyboxVersion == 5){
		urlPrefix = "./img/skybox/ThickCloudsWater";
		var f = urlPrefix + "/ThickCloudsWater";
		var resolution = 2048;
		var back = f + "Back" + resolution + ".png";
		var front = f + "Front" + resolution + ".png";
		var up = f + "Up" + resolution + ".png";
		var down = f + "Down" + resolution + ".png";
		var left = f + "Left" + resolution + ".png";
		var right = f + "Right" + resolution + ".png";
	}else if(skyboxVersion == 6){
		urlPrefix = "./img/skybox/TropicalSunnyDay";
		var f = urlPrefix + "/TropicalSunnyDay";
		var resolution = 2048;
		var back = f + "Back" + resolution + ".png";
		var front = f + "Front" + resolution + ".png";
		var up = f + "Up" + resolution + ".png";
		var down = f + "Down" + resolution + ".png";
		var left = f + "Left" + resolution + ".png";
		var right = f + "Right" + resolution + ".png";
	}else {
		throw ("Unbekannte skyboxVersion angegeben");
	}
	urls = [ left, right, up, down, front, back];
	this.reflectionCube = THREE.ImageUtils.loadTextureCube( urls, undefined, loadMagnetTextur, imagesLoadedError );
	var planeTexture;
	var snowTexture_loaded;
	var cloudAlpha_loaded;
	var cloudColor_loaded;
	var fireTexture1, fireTexture2,fireTexture3,fireTexture4, ballTextur, starTexture, magnetTextur;
	
	function loadMagnetTextur(){
		magnetTextur = THREE.ImageUtils.loadTexture( "./img/magnet.png", undefined, loadSnowTexture, imagesLoadedError );
	}
	
	/*
	 * Laedt ein model. wird zur zeit nicht verwendet. getestet mit blender model
	 */
	function loadLoacalForceMesh(){
//		var radius = 5,
//		    segments = 16,
//		    rings = 16;
//		var mat = new THREE.MeshBasicMaterial({color: 0XFF0000});
//		var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), mat);
		var loader = new THREE.JSONLoader();
		loader.load("./img/model.js", handleLoadedLocalforceGeometry);
	}
	
	/*
	 * Laedt ein model. wird zur zeit nicht verwendet. getestet mit blender model
	 */
	function handleLoadedLocalforceGeometry( geometry ) {
		//geometry.materials[0][0].shading = THREE.FlatShading;
		//geometry.materials[0][0].morphTargets = true;
		geometryOflocalForceModel = geometry;
		loadSnowTexture();
		//scene.addObject( mesh );
	}	
	
	
	function loadSnowTexture(){
		snowTexture_loaded = THREE.ImageUtils.loadTexture( "./img/snow.png", undefined, loadCloudColorTexture, imagesLoadedError );
	}

	function loadCloudColorTexture(){
		cloudColor_loaded = THREE.ImageUtils.loadTexture( "./img/smoke_color.png", undefined, loadCloudAlphaTexture, imagesLoadedError );
	}
	
	
	function loadCloudAlphaTexture(){
		cloudAlpha_loaded = THREE.ImageUtils.loadTexture( "./img/smoke_alpha.png", undefined, loadFireTexture1, imagesLoadedError );
	}
	
	function loadFireTexture1(){
		fireTexture1 = THREE.ImageUtils.loadTexture( "./img/fire1.jpg", undefined, loadFireTexture2, imagesLoadedError );
	}
	
	function loadFireTexture2(){
		fireTexture2 = THREE.ImageUtils.loadTexture( "./img/fire2.jpg", undefined, loadFireTexture3, imagesLoadedError );
	}
	
	function loadFireTexture3(){
		fireTexture3 = THREE.ImageUtils.loadTexture( "./img/fire3.jpg", undefined, loadFireTexture4, imagesLoadedError );
	}
	
	function loadFireTexture4(){
		fireTexture4 = THREE.ImageUtils.loadTexture( "./img/fire4.jpg", undefined, loadBallTexture, imagesLoadedError );
	}
	
	
	function loadBallTexture(){
		ballTexture = THREE.ImageUtils.loadTexture( "./img/ball.png", undefined, loadStarTexture, imagesLoadedError );
	}
	
	function loadStarTexture(){
		starTexture = THREE.ImageUtils.loadTexture( "./img/starCross.png", undefined, skyboxImagesLoaded, imagesLoadedError );
	}
	
	function skyboxImagesLoaded(){		
		planeTexture = THREE.ImageUtils.loadTexture( "img/boden_1.png", undefined, allImagesLoaded, imagesLoadedError );
		planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
		planeTexture.repeat.set( 6, 6 );
	}

	function allImagesLoaded(){
		successImageLoadCallback();
	}

	

	function imagesLoadedError(){
		errorImageLoadCallback();
	}
	
	this.getLoadedTexture= function(){
		var retval = {
				plane:planeTexture,
				snow:snowTexture_loaded,
				cloudColor: cloudColor_loaded,
				cloudAlpha:cloudAlpha_loaded,
				fire1:fireTexture1,
				fire2:fireTexture2,
				fire3:fireTexture3,
				fire4:fireTexture4,
				ball:ballTexture,
				star:starTexture, 
				magnet:magnetTextur
		}
		
		return retval;
	}
	
	//berechnete de gesammten partikel die in den emitterdante fuer die gpu enthalten sind. 
	//grund ist, das die gpu variante pro emitter eine anzahl an partikeln verwaltet. 
	// die cpu hingegen hat einen pool wo alle partikel für alle emitter vorhanden sind
	this.calculateSumOfParticles  = function(arrayOfGPUValues){
		var sumOfTotalParticles = 0;
		for(var i =0; i<arrayOfGPUValues.length; i++){
			sumOfTotalParticles += Math.pow(arrayOfGPUValues[i], 2);
		}
		
		return sumOfTotalParticles;
	}
	
}


