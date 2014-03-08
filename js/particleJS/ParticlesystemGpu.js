/*
 * konkrete implementierung von AbstractParticlesystem. Benutzt intsanzen von EmitterGPU und 
 * fuehrt damit die partikelberechnungen auf der GPU aus
 */
function ParticlesystemGpu(_particleSystemName, _renderer, _scene, _camera, _world, _particleSystemData, _simInfo) {
    AbstractParticlesystem.call(this, _particleSystemName, _renderer, _scene, _camera, _world, _simInfo);
    var that = this;
    var particleSystemData = _particleSystemData;
    var emitterData = particleSystemData.emitterData;
    that.visualizationType = particleSystemData.visualizationType;
    var textures = particleSystemData.textures;
    var isGravityDown = particleSystemData.isGravityDown;
    var massForParticles = particleSystemData.mass;

    //initialisierung starten
    init();

    function init() {
        initEmitters();
    }


    function initEmitters() {
        var numberOfEmitters = emitterData.numberOfEmitters;
        var pointSize = particleSystemData.pointSize;
        var frictionCoefficent = particleSystemData.frictionCoefficent;

        var startVelocities = emitterData.startVelcities;
        if (numberOfEmitters != startVelocities.length) {
            throw("Number of Emitters and length of startVelocities array was not equal!");
        }

        var startBasesizes = emitterData.startBaseSize;
        if (numberOfEmitters != startBasesizes.length) {
            throw("Number of Emitters and length of startBasesizes array was not equal!");
        }

        var startLifetimes = emitterData.startLifeTime;
        if (numberOfEmitters != startLifetimes.length) {
            throw("Number of Emitters and length of startlifetimes array was not equal!");
        }

        var numberOfParticlesPerEmitter = emitterData.numberOfParticlesPerEmitter;
        if (numberOfEmitters != numberOfParticlesPerEmitter.length) {
            throw("Number of Emitters and length of numberOfParticlesPerEmitter array was not equal!");
        }

        var startParticlesToEmit = emitterData.startParticlesEmit;
        if (numberOfEmitters != startParticlesToEmit.length) {
            throw("Number of Emitters and length of startParticlesToEmit array was not equal!");
        } else if (startParticlesToEmit > 1) {
            throw("Particles to emit was greater then 1");
        } else if (startParticlesToEmit < 0) {
            throw ("Particles to emit was less then 0");
        }

        var emitterPositions = emitterData.emitterPositions;
        if (numberOfEmitters != emitterPositions.length) {
            throw("Number of Emitters and length of Position array was not equal!");
        }

        var adjustStartVel = emitterData.adjustStartVel;
        if (numberOfEmitters != adjustStartVel.length) {
            throw("Number of Emitters and length of adjustStartVel array was not equal!");
        }

        var adjustStartVelVectors = emitterData.adjustStartVelVector;
        if (numberOfEmitters != adjustStartVelVectors.length) {
            throw("Number of Emitters and length of adjustStartVelVectors array was not equal!");
        }

        for (var i = 0; i < numberOfEmitters; i++) {
            var emitter = new EmitterGpu("Emitter " + (i + 1), emitterData, i, that.renderer, that.scene, that.world, particleSystemData);
            that.registerEmitter(emitter);
        }

    }


    this.update = function () {
        if (!this.isPause) {
            this.updateEmitters();
        }
    }

    this.updateEmitters = function () {
        for (var i = 0; i < that.emitters.length; i++) {
            var emitter = that.emitters[i];
            emitter.emit();
        }
    }

    this.freeMemory = function () {
        for (var i = 0; i < that.emitters.length; i++) {
            var emitter = that.emitters[i];
            emitter.freeMemory();
        }
    }
}