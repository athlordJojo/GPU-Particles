/*
 * Kapselt die daten die die Emitter eines partikelsystems definieren. Speichert die jeweiligen daten in listen. zugrif und zuweisung
 * zu einem emitter erfolgt ueber den index. Enthaelt:
 * 
 * numberOfEmitters: anzahl an emittern (einziges element dieses Obekts was keine liste ist.
 * Listen: 
 * Position
 * lifetime: durchschnittliche lifetime der emittierten partikel
 * startvelocities: die durchschnittliche richtung in die der emiter die partikel ausstoesst.
 * startBaseSize: groesse des quadrats des generationshapes
 * isVolume: ob das generationshape des emiters ein volumen ist.
 * volumeHeight: hohe des volumens 
 */
function EmitterData(_numberOfEmitters, _emitterPositions,  _startLifeTime, _startBaseSize, _startVelcities, _startParticlesEmit, _numberOfParticlesPerEmitter_GPU, _numberOfParticles, _adjustStartVel, _adjustStartVelVector, _isVolume, _volumeForEmitter){	
	this.numberOfEmitters = _numberOfEmitters;
	this.emitterPositions = _emitterPositions;
	this.startLifeTime = _startLifeTime;
	this.startBaseSize = _startBaseSize;
	this.startVelcities = _startVelcities;
	this.startParticlesEmit = _startParticlesEmit;
	this.numberOfParticlesPerEmitter = _numberOfParticlesPerEmitter_GPU;// only for gpu emitter
	this.numberOfParticles = _numberOfParticles;// only for cpu
	this.adjustStartVel = _adjustStartVel;
	this.isVolume = _isVolume;
	this.volumeHeight = _volumeForEmitter;
	
	if(this.emitterPositions.length != this.numberOfEmitters){
		throw("invalid emitterdata size: emitterPositions");
	}else if(this.startLifeTime.length != this.numberOfEmitters){
		throw("invalid emitterdata size: startLifeTime");
	}else if(this.startBaseSize.length != this.numberOfEmitters){
		throw("invalid emitterdata size: startBaseSize");
	}else if(this.startVelcities.length != this.numberOfEmitters){
		throw("invalid emitterdata size: startVelcities");
	}else if(this.startParticlesEmit.length != this.numberOfEmitters){
		throw("invalid emitterdata size: startParticlesEmit");
	}else if(this.numberOfParticlesPerEmitter.length != this.numberOfEmitters){
		throw("invalid emitterdata size: numberOfParticlesPerEmitter");
	}else if(this.numberOfParticles.length != this.numberOfEmitters){
		throw("invalid emitterdata size: numberOfParticles");
	}else if(this.adjustStartVel.length != this.numberOfEmitters){
		throw("invalid emitterdata size: adjustStartVel");
	}else if(this.isVolume.length != this.numberOfEmitters){
		throw("invalid emitterdata size: isVolume");
	}else if(this.volumeHeight.length != this.numberOfEmitters){
		throw("invalid emitterdata size: volumeHeight");
	}
	
	// wert gibt an wie stark der zufall auf die eingestellte start velocity wirken soll.
	this.adjustStartVelVector = _adjustStartVelVector; 
	
	this.getAdjustStartVelStrength_X = function(){
		return adjustStartVelStrength_X;
	}
	
	this.getAdjustStartVelStrength_Y = function(){
		return adjustStartVelStrength_Y;
	}
	
	this.getAdjustStartVelStrength_Z = function(){
		return adjustStartVelStrength_Z;
	}
	
	this.setToVolumeEmitter = function(_isVolume, _volumeForEmitter){
		if(_volumeForEmitter == undefined || _volumeForEmitter == null){
			throw("illegal _volumeForEmitter. was undefinded or null!");
		}else if(_volumeForEmitter <0.0){
			throw(" _volumeForEmitterwas less then 0!");
		}
		
		this.isVolume = _isVolume;
		this.volumeHeight = _volumeForEmitter;
		
	}
};