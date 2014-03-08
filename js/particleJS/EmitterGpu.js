/*
 * Konkrete Implementierung von AbstractEmitter. 
 * Verwendet RTT fuer die positionen, lifetime und velocity. Fuehrt dadurch die Berechnung auf der GPU durch.
 */
function EmitterGpu(_name, _emitterData, _i, _renderer, _scene, _world, _particleSystemData) {
    AbstractEmitter.call(this, _name, _emitterData.emitterPositions[_i], _emitterData.startParticlesEmit[_i], _emitterData.startLifeTime[_i], _emitterData.startBaseSize[_i], _emitterData.startVelcities[_i], null, _scene, _world, _emitterData.isVolume[_i], _emitterData.volumeHeight[_i], _particleSystemData.visualizationType.color);
    var that = this;
    var numParticles = _emitterData.numberOfParticlesPerEmitter[_i];
    var totalNumParticles = numParticles * numParticles;
    var sceneRTTPos, sceneRTTNewPos, sceneRTTLifetime, sceneRTTNewLifetime, materialNewLife, materialNewPos;
    var sceneRTTVel, sceneRTTNewVel, materialNewVel;
    var randomData, generatedTextureLife, generatedTextureVel;
    var sceneRTTRandom, sceneRTTNewRandom, materialNewRandom;
    var rtTextureRandom, rtTexturePos, rtTextureVel, rtTextureLifetime;
    var visualizationType = _particleSystemData.visualizationType;
    var typeAsNumber = -1;
    var frictionCoefficent = _particleSystemData.frictionCoefficent;
    var isGravityDown = (_particleSystemData.isGravityDown) ? 1 : 0;
    this.renderer = _renderer;
    this.cameraRTT = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
    this.textureHelper = new TextureHelperPs(this.renderer);
    this.particleDrain = 1;
    var pointSizeFixedElement = visualizationType.pointSizeFixedElement;
    var pointSizerandomElement = visualizationType.pointSizeRandomElement;

    var listOfRenderedTex = [];
    var mass = _particleSystemData.mass;
    var useDepthTest = visualizationType.depthTest;
    var textures = _particleSystemData.textures;
    var normalOfPlane = _particleSystemData.planeNormal;
    var adjustStartVelVector = _emitterData.adjustStartVelVector[_i];

    this.freeMemory = function () {
        /*
         that.renderer.deallocateRenderTarget(rtTextureRandom);
         that.renderer.deallocateRenderTarget(rtTexturePos);
         that.renderer.deallocateRenderTarget(rtTextureVel);
         that.renderer.deallocateRenderTarget(rtTextureLifetime);

         that.renderer.deallocateTexture(randomData);
         that.renderer.deallocateTexture(generatedTextureLife);
         that.renderer.deallocateTexture(generatedTextureVel);
         console.log("Gpu-Emitter: freed memory");
         */
    };

    init();

    function init() {
        typeAsNumber = visualizationType.getTypeAsNumberForUniforms();
        console.log("initiliasing GPU-Emitter: " + that.name);
        initMaterialsAndRtt();

        that.threeParticleSystem = initThreePS();
        that.scene.add(that.threeParticleSystem);

        var vname = visualizationType.name;

        var oldDeltat = that.world.deltaT;
        that.world.deltaT = 1 / 60;
        console.log("Starting init of rtt on emitter: " + that.name);
        var numberOfPreRTTCalls = visualizationType.getRttPrecalls(); //200;
        console.log("changed rtt-pre-calls: " + numberOfPreRTTCalls);
        var savedStartEmit = new Number(that.numberOfParticlesToEmit);
        var delta = that.numberOfParticlesToEmit / numberOfPreRTTCalls;
        that.numberOfParticlesToEmit = 0;// langsam die ermit rate erhoehen

        // partikel intern aktualisieren, damit nicht ein grosser klotz sichtbar wird der runterffällt
        for (var i = 0; i < numberOfPreRTTCalls; i++) {
            that.numberOfParticlesToEmit += delta;// langsam die ermit rate erhoehen
            renderRenderTargets();
        }
        that.world.deltaT = oldDeltat;
        console.log("Init done of rtt on emitter: " + that.name);
        console.log("initiliasing GPU-Emitter: " + that.name + ", done");
    }

    function initMaterialsAndRtt() {
        // scenen fuer initaliserung der rtt
        sceneRTTPos = new THREE.Scene();
        sceneRTTLifetime = new THREE.Scene();
        sceneRTTVel = new THREE.Scene();
        sceneRTTRandom = new THREE.Scene();

        //scenen fuer jedes update

        sceneRTTNewPos = new THREE.Scene();
        sceneRTTNewLifetime = new THREE.Scene();
        sceneRTTNewVel = new THREE.Scene();
        sceneRTTNewRandom = new THREE.Scene();
        // generierung der Texturen und erstellung der rendertargets

        var plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

        //********BEGIN TEXTUR Random *************
        randomData = that.textureHelper.generateRandomTexture(numParticles);
        rtTextureRandom = new THREE.WebGLRenderTarget(numParticles, numParticles, {wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType });

        var materialRandom = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { type: "t", value: randomData }
            },
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#copyFragmentShader').text()
        });

        var quad = new THREE.Mesh(plane, materialRandom);
        quad.position.z = -100;
        sceneRTTRandom.add(quad);

        that.renderer.render(sceneRTTRandom, that.cameraRTT, rtTextureRandom, false);
        registerRttScene(sceneRTTRandom, "RandomTex");
        //********ENDE TEXTUR Random *************

        //********BEGIN TEXTUR LIFETIME *************
        generatedTextureLife = that.textureHelper.generateTextureLifetime(numParticles);
        rtTextureLifetime = new THREE.WebGLRenderTarget(numParticles, numParticles, {wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType });

        var materialLife = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { type: "t", value: generatedTextureLife }
            },
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#copyFragmentShader').text()
        });

        quad = new THREE.Mesh(plane, materialLife);
        quad.position.z = -100;
        sceneRTTLifetime.add(quad);
        that.renderer.render(sceneRTTLifetime, that.cameraRTT, rtTextureLifetime, false);

        materialNewLife = new THREE.ShaderMaterial({
            uniforms: {
                tLife: { type: "t", value: rtTextureLifetime },
                tRandom: { type: "t", value: rtTextureRandom },
                startLifetime: { type: "f", value: 0 },
                chanceOfBirth: { type: "f", value: 0 },
                deltaT: { type: "f", value: that.world.deltaT },
                drain: { type: "f", value: that.particleDrain },
                r: { type: "f", value: Math.random() },
                typePS: { type: "i", value: typeAsNumber }
            },
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#fragment_life').text()
        });

        quad = new THREE.Mesh(plane, materialNewLife);
        quad.position.z = -100;
        sceneRTTNewLifetime.add(quad);

        registerRttScene(sceneRTTNewLifetime, "LifetimeTex");
        //********ENDE TEXTUR LIFETIME *************

        //*********BEGIN TEXTUR Velocity**************
        generatedTextureVel = that.textureHelper.generateTextureVel(numParticles);
        rtTextureVel = new THREE.WebGLRenderTarget(numParticles, numParticles, {wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType });

        var materialVel = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { type: "t", value: generatedTextureVel }
            },
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#copyFragmentShader').text()
        });
        // texturen auf quad legen und diese rendern. grund: rendertarget erhalten so inhalt
        quad = new THREE.Mesh(plane, materialVel);
        quad.position.z = -100;
        sceneRTTVel.add(quad);
        that.renderer.render(sceneRTTVel, that.cameraRTT, rtTextureVel, false);


        materialNewVel = new THREE.ShaderMaterial({
            uniforms: {
                tVel: { type: "t", value: rtTextureVel },
                tPos: { type: "t", value: null },
                tLifeMass: { type: "t", value: rtTextureLifetime },
                tRandom: { type: "t", value: rtTextureRandom },
                localForcePositions: { type: "v3v", value: that.world.getLocalForcePositions() },
                localForceMasses: { type: "fv1", value: that.world.getLocalForceMasses() },
                localForceMinDistance: { type: "fv1", value: that.world.getLocalForceMinDistance() },
                localForceAttractionModes: { type: "fv1", value: that.world.getLocalForceAttractionModes() },
                planeMass: { type: "f", value: that.world.planeMass},
                startVel: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
                gravity: { type: "v3", value: that.world.gravity },
                wind: { type: "v3", value: that.world.wind },
                planeNormal: { type: "v3", value: normalOfPlane},
                deltaT: { type: "f", value: that.world.deltaT },
                r: { type: "f", value: Math.random() },
                typePS: { type: "i", value: typeAsNumber },
                adjustStartVel: { type: "i", value: _emitterData.adjustStartVel[_i] },
                adjustStartVelocitieVector: { type: "v3", value: adjustStartVelVector },
                gravityMode: { type: "i", value: isGravityDown },
                frictionCoeff: { type: "f", value: frictionCoefficent},
                massOfParticle: { type: "f", value: mass}
            },
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#fragment_vel').text()
        });


        quad = new THREE.Mesh(plane, materialNewVel);
        quad.position.z = -100;
        sceneRTTNewVel.add(quad);

        registerRttScene(sceneRTTNewVel, "VelocityTex");
        //*********ENDE TEXTUR Velocity**************

        //*********BEGINN TEXTUR POSITION**************
        var generatedTexturePos = that.textureHelper.generateTexturePos(numParticles);
        rtTexturePos = new THREE.WebGLRenderTarget(numParticles, numParticles, {wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType });

        var materialPos = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { type: "t", value: generatedTexturePos }
            },
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#copyFragmentShader').text()
        });

        // texturen auf qauds legen und diese rendern. grund: rendertargets erhalten so inhalt
        quad = new THREE.Mesh(plane, materialPos);
        quad.position.z = -100;
        sceneRTTPos.add(quad);
        that.renderer.render(sceneRTTPos, that.cameraRTT, rtTexturePos, false);

        // Dieses Material wird zur berechnung der neuen Positionen verwendet.
        // Es hat drei texturen:
        // tPos: die alten Positionen
        // tstartPos: die Startpositionen. wird verwendet wenn lifetime ==0 ist
        // tLife: textur welches die Lifetime erhaelt
        materialNewPos = new THREE.ShaderMaterial({
            uniforms: {
                tPos: { type: "t", value: rtTexturePos },
                tVel: { type: "t", value: rtTextureVel },
                tRandom: { type: "t", value: rtTextureRandom },
                emitterPos: { type: "v3", value: null },
                baseEmitterSize: { type: "f", value: null },
                tstartPos: { type: "t", value: generatedTexturePos },
                tLifeMass: { type: "t", value: rtTextureLifetime },
                deltaT: { type: "f", value: that.world.deltaT },
                r: { type: "f", value: Math.random() },
                isVolume: { type: "i", value: that.isVolume },
                volumeHeight: { type: "f", value: that.volumeHeight },
                visualizationType: { type: "i", value: typeAsNumber },
                typePS: { type: "i", value: typeAsNumber }
            },
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#fragment_pos').text()
        });

        quad = new THREE.Mesh(plane, materialNewPos);
        quad.position.z = -100;
        sceneRTTNewPos.add(quad);
        registerRttScene(sceneRTTNewPos, "PositionTex");
        //wichtig! kann erst hier gesetzt werden. sonst nimmt gsgl komische werte...
        materialNewVel.uniforms.tPos.value = rtTexturePos;
        //*********ENDE TEXTUR POSITION**************
    }


    function initThreePS() {
        var particles_geometry = new THREE.Geometry();
        for (var p = totalNumParticles; p >= 1; p--) {
            var particle = new THREE.Vector3();
            particles_geometry.vertices.push(particle);
        }

        var material = createMaterial();

        // create the particle system
        var threeparticleSystem = new THREE.ParticleSystem(particles_geometry, material);// enhalet die vertices bzw das mesh

        return threeparticleSystem;
    }


    function createMaterial() {
        // aPoints stellen verknuepfung zwischen den partikeln und den texturen dar. an "a-ter Stelle in textur X".
        var attributes = {
            aPoints: { type: 'v2', value: that.textureHelper.createTextureCoordinates(numParticles) }
        };

        var uniforms = {
            texture: { type: "t", value: rtTexturePos },
            tLifeMass: { type: "t", value: rtTextureLifetime },
            tRandom: { type: "t", value: rtTextureRandom },
            tSmokeAlpha: { type: "t", value: textures.cloudAlpha },
            tSmokeColor: { type: "t", value: textures.cloudColor },
            tSnow: { type: "t", value: textures.snow },
            tFire1: { type: "t", value: textures.fire1},
            tFire2: { type: "t", value: textures.fire2},
            tFire3: { type: "t", value: textures.fire3},
            tFire4: { type: "t", value: textures.fire4},
            tball: { type: "t", value: textures.ball},
            tstar: { type: "t", value: textures.star},
            visualizationType: { type: "i", value: typeAsNumber },
            isGpuDoingSim: { type: "i", value: 1 },
            pointsize_fixed: { type: "f", value: pointSizeFixedElement},
            pointsize_randomElement: { type: "f", value: pointSizerandomElement}
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            attributes: attributes,
            vertexShader: $('#vertexshaderToScreen').text(),
            fragmentShader: $('#fragmentshaderToScreen').text(),

            blending: visualizationType.blendingMode,
            depthTest: useDepthTest,
            transparent: true
        });

        return material;
    }

    function registerRttScene(_scene, scenename) {
        var sceneEntry = {
            name: scenename,
            scene: _scene,
            showToScreen: false
        };
        listOfRenderedTex.push(sceneEntry);
    }

    this.getRttScenes = function () {
        return listOfRenderedTex;
    };

    this.emit = function () {
        renderRenderTargets();
    };

    function renderRenderTargets() {
        updateUniforms();
        that.renderer.render(sceneRTTNewLifetime, that.cameraRTT, rtTextureLifetime, false);
        that.renderer.render(sceneRTTNewVel, that.cameraRTT, rtTextureVel, false);
        that.renderer.render(sceneRTTNewPos, that.cameraRTT, rtTexturePos, false);
    }

    this.checkShowRtt = function (updateInfo) {
        that.isShowingRtt = false;
        for (var i = 0; i < updateInfo.emitterEntries.length; i++) {
            var emitterEntry = updateInfo.emitterEntries[i];
            for (var k = 0; k < emitterEntry.rttScenes.length; k++) {
                var rttInfo = emitterEntry.rttScenes[k];
                if (rttInfo.showToScreen) {
                    that.renderer.render(rttInfo.scene, that.cameraRTT);
                    that.isShowingRtt = true;
                }
            }
        }
    };

    function updateUniforms() {
        materialNewLife.uniforms.r.value = Math.random();
        materialNewLife.uniforms.deltaT.value = that.world.deltaT;
        materialNewLife.uniforms.startLifetime.value = that.baseLifeTime;
        materialNewLife.uniforms.chanceOfBirth.value = that.numberOfParticlesToEmit;

        materialNewPos.uniforms.r.value = Math.random();
        materialNewPos.uniforms.deltaT.value = that.world.deltaT;
        materialNewPos.uniforms.emitterPos.value = that.positionOfEmitter;
        materialNewPos.uniforms.baseEmitterSize.value = that.baseEmitterSize;

        materialNewVel.uniforms.r.value = Math.random();
        materialNewVel.uniforms.gravity.value = that.world.gravity;
        materialNewVel.uniforms.wind.value = that.world.wind;
        materialNewVel.uniforms.startVel.value = that.baseVelocity;
        materialNewVel.uniforms.deltaT.value = that.world.deltaT;
        materialNewVel.uniforms.localForceMasses.value = that.world.getLocalForceMasses();
        materialNewVel.uniforms.localForcePositions.value = that.world.getLocalForcePositions();
        materialNewVel.uniforms.localForceAttractionModes.value = that.world.getLocalForceAttractionModes();
        materialNewVel.uniforms.localForceMinDistance.value = that.world.getLocalForceMinDistance();
    }
}