/*
 * enthaelt funktionen zum erstellen der rtt start texturen. ebenfalls existiert eine funktion zum erstellen der 
 * texturkoordinaten
 */
function TextureHelperPs(_renderer){
		if(_renderer == null || _renderer == undefined){
			throw("Ubergebener renderer in TextureHelperPs war null oder undefined");
		}
		var that = this;// noetig falls auf das eigentliche this in einer privaten methode zugeriffen werden soll. Stichwort: this= window-objekt
		this.renderer = _renderer;

		var gl = that.renderer.getContext();
		if(gl == null || gl == undefined){
			throw ("gl-Object was null! (TextureHelperPs, function: createTextureFromData)");
		}else if (!gl.getExtension("OES_texture_float")) {
		  throw("Requires OES_texture_float extension");
		}
	
	/*
	 * erstellt die eigentliche textur unterverwendung der unter data angebenen werte. Groesse der textur wird durch width und height angegeben.
	 */	
	function createTextureFromData (width, height, data) {
		if(width == null || width == undefined){
			throw ("Parameter width war null oder undefined!(TextureHelperPs, function: createTextureFromData)");
		}else if(height == null || height == undefined){
			throw ("Parameter height war null oder undefined!(TextureHelperPs, function: createTextureFromData)");
		}else if(data == null || data == undefined){
			throw ("Parameter data war null oder undefined!(TextureHelperPs, function: createTextureFromData)");
		}else if(data.length == 0){
			throw ("Parameter data (Array) hatte keinen inhalt(length=0)! (TextureHelperPs, function: createTextureFromData)");
		}

		var texture = new THREE.Texture();
		texture.needsUpdate = false;
		texture.__webglTexture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, texture.__webglTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, new Float32Array(data));
		texture.__webglInit = false;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null)

		return texture;
}
		
	/*
	 * erstellt eine textur bei der jede komponente eines pixel einen zufallswert zwischen 0 und 1 hat
	 */	
	this.generateRandomTexture = function (numParticles){
		var totalNumParticles = numParticles * numParticles;
		var texData = [];

		  for (var k = 0; k < totalNumParticles; k++) {
		  	var r, g, b, a;
		  	while(true){
				r = Math.random();
				if(r > 0)break;
		  	}

		  	while(true){
				g = Math.random();
				if(g > 0)break;
		  	}

		  	while(true){
				b = Math.random();
				if(b > 0)break;
		  	}

		    texData.push(r,g,b,1);
		  }
		  return createTextureFromData(numParticles, numParticles, texData);
	}

	/*
	 * erstellt die positions-start-textur mit geeigneten werten
	 */	
	this.generateTexturePos = function (numParticles) {
	  var totalNumParticles = numParticles * numParticles;
	  var totalEntries = totalNumParticles;
	  var texData = [];// new Array(totalEntries);

	  for (var i = 0; i < totalEntries; i++) {
	      texData.push(999,999,999,1.0);
	  }
	  return createTextureFromData(numParticles, numParticles, texData);
	}
	
	/*
	 * erstellt die geschwindigkeits-start-textur mit geeigneten werten
	 */	
	this.generateTextureVel = function(numParticles){
		var totalNumParticles = numParticles * numParticles;
		var texData = [];
		for(i=0; i<totalNumParticles; i++){
			texData.push(999,999,999,1);
		}
		return createTextureFromData(numParticles, numParticles, texData);
	}		

	/*
	 * erstellt die lifetime-start-textur mit geeigneten werten
	 */	
	this.generateTextureLifetime = function (numParticles){	
		var totalNumParticles = numParticles * numParticles;
		var texData = [];
		var isFirstBirth = 1.0;
		var life = -1;// alle partikel tot. wird ausgelesen in den shadern
		var startLife = 0;// unwichtig...
		for(i=0; i<totalNumParticles; i++){
			texData.push(life,isFirstBirth,startLife,1);
		}
		return createTextureFromData(numParticles, numParticles, texData);
	}		

	/*
	 * Erstellt texturkoordianten damit in den VS auf die exakten daten eines partikels zugreifen kann.
	 */
	this.createTextureCoordinates = function (numParticles){
	  var textureCords = [], d = 1 / numParticles;

	  for (var y = 0; y < 1; y += d) {
	      for (var x = 0 ; x < 1; x += d) {
			  textureCords.push(new THREE.Vector2(x, y));
	      }
	  }

	  return textureCords;
	}	
}