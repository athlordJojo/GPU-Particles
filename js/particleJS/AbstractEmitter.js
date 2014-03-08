/*
 * Abstrakte Klasse die die gemeinsamen attribute kapselt und eine abstrakte methode enthaelt.
 */
function AbstractEmitter(_name, _positionOfEmitter, _numberOfParticlesToEmit, _baseLifeTime, _baseEmitterSize, _baseVelocity, _threeParticleSystem, _scene, _world, _isVolume, _volumeHeight, _color){
	this.name = _name;
	this.positionOfEmitter = _positionOfEmitter;
	this.numberOfParticlesToEmit = _numberOfParticlesToEmit;
	this.baseEmitterSize = _baseEmitterSize;
	this.baseLifeTime = _baseLifeTime;
	this.baseVelocity = _baseVelocity;
	this.threeParticleSystem = _threeParticleSystem;
	this.scene = _scene;
	this.world = _world;
	this.isVolume = _isVolume;
	this.volumeHeight = _volumeHeight;
    this.color = _color;

	this.emit = function (){
		throw("Emit of abstract Emitter called");
	}
}