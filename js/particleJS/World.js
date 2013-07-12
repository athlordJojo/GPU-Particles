/*
 * kapselt die daten die die welt definieren. wind/gravitation. 
 * enhaelt eine liste mit den 10 local force objekten.
 */
function World(_gravity, _wind, _localForces, _planeMass){
	var that = this;
	this.localForces = _localForces;

	this.gravity = _gravity;//vector 3 objkt, was die Gravitation beschreibt
	this.wind = _wind;//vector 3 objekt, was den wind beschreibt

	this.currentTime = new Date().getTime();
	this.lastTime = this.currentTime;
	// zeitliche differenz zwischen update-aufrufen 
	this.deltaT = 0;
	
	this.planeMass = _planeMass;
	if(_planeMass == undefined || _planeMass == null){
		throw("planemass can not be undefined");
	}
	else if(_planeMass < 0){
		throw ("planemass can not be less then zero");
	}

	/* dies sind die listen die bei dei instanze der klasse EmitterGPU verwendet werden um die uniforms der
	* Shader zu aktualisieren. werden zurueckgegeben von den funktionen:
	* getLocalForcePositions
	* getLocalForceMasses
	* getLocalForceAttractionModes
	* getLocalForceMinDistance
	*/
	var pos = [];//enthaelt die positionen der lokalen krafte
	var masses = [];//enthaelt die massen der lokalen krafte
	var attractionModes = [];//enthaelt die modi der lokalen krafte
	var minDistances = [];//enthaelt die min-distances der lokalen krafte
	
	/*
	 * Aktualisiert das world objekt. dabei wird die jedesmal die zeitberechnet die seit dem letzten aufruf vergangen ist.
	 * Ebenfalls aktualisiert es die lokal-force lsiten.
	 */
	this.update = function(){
		this.currentTime = new Date().getTime();
		this.deltaT = (this.currentTime - this.lastTime)/1000;	
		this.lastTime = this.currentTime;
		updateLocalForcesAttributes();
	}

	this.toString = function(){
		return "Gravity: x = " + this.gravity.x + ", y = " + this.gravity.y + ", z = " 
		+ this.gravity.z + "\n" + "Wind: x = " + this.wind.x + ", y = " + this.wind.y + ", z = " + this.wind.z+"\n"
		+ "DeltaT = " + this.deltaT.toPrecision(2) + "\n";
	}

	/*
	 * liefert die positionen der lokalen kreafte als liste (fuer updateUniforms in EmitterGPU)
	 */
	this.getLocalForcePositions = function (){
		return pos;
	}

	/*
	 * liefert die massen der lokalen kreafte als liste (fuer updateUniforms in EmitterGPU)
	 */
	this.getLocalForceMasses = function (){
		return masses;
	}
	/*
	 * liefert die modi der lokalen kreafte als liste (fuer updateUniforms in EmitterGPU)
	 */
	this.getLocalForceAttractionModes = function (){
		return attractionModes;
	}
	
	/*
	 * liefert die mind-distanzen der lokalen kreafte als liste (fuer updateUniforms in EmitterGPU)
	 */
	this.getLocalForceMinDistance = function (){
		return minDistances;
	}

	/*
	 * aktualisiert die Listen 
	 */
	function updateLocalForcesAttributes(){
		pos.length = 0;
		masses.length = 0;
		attractionModes.length = 0;
		minDistances.length = 0;
		for(var i=0; i<that.localForces.length; i++){
			var force = that.localForces[i];
			pos.push(force.position);
			masses.push(force.mass);
			attractionModes.push(force.attractionMode);
			minDistances.push(force.minDistance);
		}
	}
	
	this.update();// erster initialer aufruf. damit currentime einen gueltigen wert hat

}