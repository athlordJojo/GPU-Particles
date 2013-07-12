/*
 * Kapselt die daten bezuglich eines partikelsystems. zum beispiel ob die gravitation normal wirkt oder invers.
 * ebenfalls die reibung und eine referenz auf visualizationtype-objekts wird durch dieses obejekt gekapselt
 */
function ParticlesystemData(_mass, _isGravityDown,  _frictionCoefficent, _visualizationType, _textures, _emitterData){
	if(_mass == undefined){
		throw("_mass was undefinded");
	}else if(_mass <=0){
		throw("_mass can not be  less or equal zero");
	}else if(_textures == undefined || _textures == null){
		throw("_textures was null or undefined");
	}else if(_emitterData == null || _emitterData == undefined){
		throw("_emitterData was null or undefined");
	}else if(_isGravityDown == null || _isGravityDown == undefined){
		throw("_isGravityDown was null or undefined");
	}else if(_visualizationType == null || _visualizationType == undefined){
		throw("_visualizationType was null or undefined");
	}else if(!(_visualizationType instanceof VisualizationType)){
		throw("_visualizationType wrong type");
	}
	
	
	this.mass = _mass;

	this.isGravityDown = _isGravityDown;
	this.frictionCoefficent = _frictionCoefficent*60;// es wird ausgegangen das die angegebene reibung in einer sekunde (60 frames) wirken soll. deshalb die mult mit 60 
	this.visualizationType = _visualizationType;
	this.textures = _textures;
	var vectorOneOfPlane = new THREE.Vector3(1,0,0);
	var vectorTwoOfPlane = new THREE.Vector3(0,0,1);
	this.planeNormal = new THREE.Vector3(0,0,0).crossVectors(vectorOneOfPlane, vectorTwoOfPlane);
	this.planeNormal.multiplyScalar(-1);
	
	this.emitterData = _emitterData;
}