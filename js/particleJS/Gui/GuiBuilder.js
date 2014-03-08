/*
 * Erstellt die Gui fuer die anwendung und instanziiert die Controller-klassen
 */
function GuiBuilder(camera_, camPosXStart, camPosYStart, camPosZStart, camLookX, camLookY, camLookZ, updateInfos, world, _mainSim, _mode, _simulationInfo, _activeParticleSystems) {
    var that = this;
    var mode = _mode;

    if (camera_ == null || camera_ == undefined) {
        throw("Keine Kamera an GuiPs uebergeben");
    } else if (world == null || world == undefined) {
        throw("Kein World-Objekt uebergeben");
    }

    if (!(camera_ instanceof THREE.Camera)) {
        throw("Camera-Objekt ist vom falschen typ");
    } else if (!(world instanceof World)) {
        throw("World-Objekt ist vom falschen typ");
    }
    else if (!(_mainSim instanceof MainSimulation)) {
        throw("MainSimulation-Objekt ist vom falschen typ");
    }
    //Ende Parameterpruefung...

    var camera = camera_;
    var mainSim = _mainSim;
    var stats, cameraSettings;
    var datGui;
    var simulationInfo = _simulationInfo;
    var activeParticleSystems = _activeParticleSystems;

    initStats();
    initDat();

    function initDat() {
        datGui = new dat.GUI();
        addCameraFolder();
        addWorldFolder();
        addParticleSystemFolder();
        //addDebugFolder();
        addStoppSimulationButton();
    }

    function addStoppSimulationButton() {
        var StopData = function () {
            this.Stop = function () {
                simulationInfo.simulationIsRunning = false
            }
        };
        datGui.add(new StopData(), "Stop");
    }

    function addCameraFolder() {
        var cameraSettingsObject = function () {
            this.camx = camera.position.x;
            this.camy = camera.position.y;
            this.camz = camera.position.z;
            this.camLookAtX = camLookX;
            this.camLookAtY = camLookY;
            this.camLookAtZ = camLookZ;
        };
        cameraSettings = new cameraSettingsObject();
        var camController = new CameraController(cameraSettings, camera, camPosXStart, camPosYStart, camPosZStart, camLookX, camLookY, camLookZ);
        var cameraFolder = datGui.addFolder("Camera-Settings");
        var properties = cameraFolder.addFolder("Additional Properties");
        //Die kamera positionen anzeigen und an die entsprechenden controller hanlder anmelden.
        var posLimit = 500;

        var camXController = properties.add(cameraSettings, 'camx', -posLimit, posLimit).listen();
        camXController.onChange(camController.onDAT_CamXChange);

        var camYController = properties.add(cameraSettings, 'camy', -posLimit, posLimit).listen();
        camYController.onChange(camController.onDAT_CamYChange);

        var camZController = properties.add(cameraSettings, 'camz', -posLimit, posLimit).listen();
        camZController.onChange(camController.onDAT_CamZChange);

        //Die look at position der Kamera anzeigen und Handler anmelden
        var lookLimit = 250;
        var camLookAtXController = properties.add(cameraSettings, 'camLookAtX', -lookLimit, lookLimit).listen();
        camLookAtXController.onChange(camController.onDAT_CamLookXChange);

        var camLookAtYController = properties.add(cameraSettings, 'camLookAtY', -lookLimit, lookLimit).listen();
        camLookAtYController.onChange(camController.onDAT_CamLookYChange);

        var camLookAtZController = properties.add(cameraSettings, 'camLookAtZ', -lookLimit, lookLimit).listen();
        camLookAtZController.onChange(camController.onDAT_CamLookZChange);

        var predefinedCamerasSettings = function () {
            this.onCamHandler_start = camController.onCamHandler_start;
            this.onCamHandler_near_1 = camController.onCamHandler_near_1;
            this.onCamHandler_near_2 = camController.onCamHandler_near_2;
            this.onCamHandler_far_1 = camController.onCamHandler_far_1;
            this.onCamHandler_far_2 = camController.onCamHandler_far_2;
            this.onCamHandler_x_plus = camController.onCamHandler_x_plus;
            this.onCamHandler_x_minus = camController.onCamHandler_x_minus;
            this.onCamHandler_z_plus = camController.onCamHandler_z_plus;
            this.onCamHandler_z_minus = camController.onCamHandler_z_minus;
            this.onCamHandler_y_plus = camController.onCamHandler_y_plus;
            this.onCamHandler_y_minus = camController.onCamHandler_y_minus;
        }

        var predefCamSettings = new predefinedCamerasSettings();
        cameraFolder.add(predefCamSettings, 'onCamHandler_start').name('Cam: Start');
        cameraFolder.add(predefCamSettings, 'onCamHandler_near_1').name('Cam: Near 1');
        cameraFolder.add(predefCamSettings, 'onCamHandler_near_2').name('Cam: Near 2');
        cameraFolder.add(predefCamSettings, 'onCamHandler_far_1').name('Cam: Far 1');
        cameraFolder.add(predefCamSettings, 'onCamHandler_far_2').name('Cam: Far 2');
        cameraFolder.add(predefCamSettings, 'onCamHandler_x_plus').name('Cam: + X-Axis');
        cameraFolder.add(predefCamSettings, 'onCamHandler_x_minus').name('Cam: - X-Axis');
        cameraFolder.add(predefCamSettings, 'onCamHandler_z_plus').name('Cam: + Z-Axis');
        cameraFolder.add(predefCamSettings, 'onCamHandler_z_minus').name('Cam: - Z-Axis');
        cameraFolder.add(predefCamSettings, 'onCamHandler_y_plus').name('Cam: + Y-Axis');
        cameraFolder.add(predefCamSettings, 'onCamHandler_y_minus').name('Cam: - Y-Axis');
    }


    function addParticleSystemFolder() {
        var allParticleFolder = datGui.addFolder("Particlesystems");
        for (var i = 0; i < activeParticleSystems.length; i++) {
            var ps = activeParticleSystems[i];
            var visualizationTypeOfPs = ps.visualizationType
            //var upInfo = updateInfos[i];
            var name_ps = ps.particlesystemname;
            //var texturesOfPs = upInfo.textureNames;
            var emitterEntriesOfPs = ps.emitters;
            var thisParticlesystemFolder = allParticleFolder.addFolder(name_ps);

            //removeKnopf einbauen

            var particleGuiSettings = function () {
                this.Active = ps.isAlive;
                this.Pause = ps.isPause;
            };
            var psGuiSettings = new particleGuiSettings();
            var psController = new ParticlesystemController(name_ps, ps, simulationInfo, psGuiSettings);
            thisParticlesystemFolder.add(psGuiSettings, "Active").listen().onChange(psController.onDeactivate);
            thisParticlesystemFolder.add(psGuiSettings, "Pause").listen().onChange(psController.onPause);

            if (emitterEntriesOfPs.length > 0) {
                var emittersFolder = thisParticlesystemFolder.addFolder("Emitters");

                var emitterPosLimit = 500;
                var emitSizeLimit = 800;
                var emitVelocityLimit = 150;
                var lifetimeLimit = 30;
                var emitsPerCallLimit = 1;

                for (var j = 0; j < emitterEntriesOfPs.length; j++) {
                    var e = emitterEntriesOfPs[j];
                    var isGpuEmitter = e instanceof EmitterGpu;
                    var emitterFolder = emittersFolder.addFolder(e.name);
                    if (isGpuEmitter) {
                        var textureFolder = emitterFolder.addFolder("Textures");
                        var rttScenes = e.getRttScenes();
                        for (var l = 0; l < rttScenes.length; l++) {
                            var rttScene = rttScenes[l];
                            var texSettings = {};
                            texSettings[rttScene.name] = rttScene.showToScreen;
                            var handlerObject = new TextureController(rttScene, simulationInfo, texSettings);
                            textureFolder.add(texSettings, rttScene.name).listen().onChange(handlerObject.showRttTexture);
                        }

                        if (visualizationTypeOfPs.colorAdjustable) {
                            var colorSettings = {
                                color: [1.0, 1.0, 1.0, 1.0]
                            };


                            emitterFolder.addColor(colorSettings, "color").onChange(function(newValue){
                                if ((typeof(newValue) === 'string') || (newValue instanceof String)) {
                                    console.log("AHH");
                                    colorSettings.color = [1,1,1];
                                }

                                console.log(newValue);
                                e.color = [(newValue[0]/ 255), newValue[1]/ 255, newValue[2]/ 255];

                            });
                        }

                    }

                    var positionFolder = emitterFolder.addFolder("Position");
                    var startVelocityFolder = emitterFolder.addFolder("Start Velocities");

                    var emitter_Settings = {
                        emitterX: e.positionOfEmitter.x,
                        emitterY: e.positionOfEmitter.y,
                        emitterZ: e.positionOfEmitter.z,
                        emitterVelX: e.baseVelocity.x,
                        emitterVelY: e.baseVelocity.y,
                        emitterVelZ: e.baseVelocity.z,
                        Size: e.baseEmitterSize,
                        Particle_Lifetime: e.baseLifeTime,
                        emitsPerCall: e.numberOfParticlesToEmit
                    };
                    var onEmitterHandler = new EmitterController(e, simulationInfo, emitter_Settings);// kuememrt sich um anederungen in der gui die einen emitter darstellen

                    // eintrag fuer emitgroesse erstellen
                    emitterFolder.add(emitter_Settings, 'Size', 1, emitSizeLimit).listen().onChange(onEmitterHandler.onEmitSizeChange);

                    // eintrag fuer lifetime
                    emitterFolder.add(emitter_Settings, 'Particle_Lifetime', 1, lifetimeLimit).listen().onChange(onEmitterHandler.onLifetimeChange);

                    // eintrag fuer emiter staerke
                    emitterFolder.add(emitter_Settings, 'emitsPerCall', 0, emitsPerCallLimit).listen().onChange(onEmitterHandler.onEmitPerCallChange);
                    // position-eintrage fuer jeden emitter erzeugen
                    positionFolder.add(emitter_Settings, 'emitterX', -emitterPosLimit, emitterPosLimit).listen().onChange(onEmitterHandler.onPositionChangeX);
                    positionFolder.add(emitter_Settings, 'emitterY', 0, emitterPosLimit).listen().onChange(onEmitterHandler.onPositionChangeY);
                    positionFolder.add(emitter_Settings, 'emitterZ', -emitterPosLimit, emitterPosLimit).listen().onChange(onEmitterHandler.onPositionChangeZ);

                    startVelocityFolder.add(emitter_Settings, 'emitterVelX', -emitVelocityLimit, emitVelocityLimit).listen().onChange(onEmitterHandler.onStartVelChangeX);
                    startVelocityFolder.add(emitter_Settings, 'emitterVelY', -emitVelocityLimit, emitVelocityLimit).listen().onChange(onEmitterHandler.onStartVelChangeY);
                    startVelocityFolder.add(emitter_Settings, 'emitterVelZ', -emitVelocityLimit, emitVelocityLimit).listen().onChange(onEmitterHandler.onStartVelChangeZ);
                }
            }
        }
    }

    function addWorldFolder() {
        var worldFolder = datGui.addFolder("World");
        var forcesFolder = worldFolder.addFolder("Forces");
        var globalForcesFolder = forcesFolder.addFolder("Global Forces");
        var localForcesFolder = forcesFolder.addFolder("Local Forces");
        var gravityFolder = globalForcesFolder.addFolder("Gravity");
        var windFolder = globalForcesFolder.addFolder("Wind");

        var GlobalForceSettings = function () {
            this.gravityX = world.gravity.x;
            this.gravityY = world.gravity.y;
            this.gravityZ = world.gravity.z;
            this.windX = world.wind.x;
            this.windY = world.wind.y;
            this.windZ = world.wind.z;
        }
        var globalForceSettings = new GlobalForceSettings;
        var handlerObject = new GlobalforceController(world);
        var gravityLimit = 15;
        gravityFolder.add(globalForceSettings, 'gravityX', -gravityLimit, gravityLimit).onChange(handlerObject.handleGravityXChange);
        gravityFolder.add(globalForceSettings, 'gravityY', -gravityLimit, gravityLimit).onChange(handlerObject.handleGravityYChange);
        gravityFolder.add(globalForceSettings, 'gravityZ', -gravityLimit, gravityLimit).onChange(handlerObject.handleGravityZChange);

        var windLimit = 300;
        windFolder.add(globalForceSettings, 'windX', -windLimit, windLimit).onChange(handlerObject.handleWindXChange);
        windFolder.add(globalForceSettings, 'windY', -windLimit, windLimit).onChange(handlerObject.handleWindYChange);
        windFolder.add(globalForceSettings, 'windZ', -windLimit, windLimit).onChange(handlerObject.handleWindZChange);

        // init localforces folder
        var ShowMeshesOfLocalForcesSettings = function () {
            this.Show = mainSim.showLocalForceMeshes;
        };

        localForcesFolder.add(new ShowMeshesOfLocalForcesSettings(), "Show").onChange(mainSim.handleShowLocalForces);
        var localForcePosLimit = 300;
        var massLimit = 10000000;
        var minDistanceLimit = 400;
        for (var i = 0; i < world.localForces.length; i++) {
            var localForce = world.localForces[i];
            var posOfForce = localForce.position;
            var massOfForce = localForce.mass;
            var mindistanceOfForce = localForce.minDistance;
            var numberOfLocalForce = i + 1;
            massLimit = localForce.maxMass;
            var nameForLocalForce = massLimit > 1000000 ? "Local Force " + numberOfLocalForce.toString() + " (Extreme)" : "Local Force " + numberOfLocalForce.toString();
            var folderForThisForce = localForcesFolder.addFolder(nameForLocalForce);

            // 0 = anziehend/pull, 1 = abstossend/push
            var localForceSetting = {
                localX: posOfForce.x,
                localY: posOfForce.y,
                localZ: posOfForce.z,
                mass: massOfForce,
                minDistance: mindistanceOfForce,
                pull: localForce.attractionMode == 0,
                push: localForce.attractionMode == 1,

            };
            var localForceHandler = new LocalforceController(localForce, localForceSetting);

            folderForThisForce.add(localForceSetting, "localX", -localForcePosLimit, localForcePosLimit).onChange(localForceHandler.onPositionChangeX);
            folderForThisForce.add(localForceSetting, "localY", 0, localForcePosLimit).onChange(localForceHandler.onPositionChangeY);
            folderForThisForce.add(localForceSetting, "localZ", -localForcePosLimit, localForcePosLimit).onChange(localForceHandler.onPositionChangeZ);
            folderForThisForce.add(localForceSetting, "mass", 0, massLimit).onChange(localForceHandler.onMassChange);
            folderForThisForce.add(localForceSetting, "minDistance", 0, minDistanceLimit).onChange(localForceHandler.onMinDistanceChange);
            folderForThisForce.add(localForceSetting, "pull").listen().onChange(localForceHandler.onPullChange);
            folderForThisForce.add(localForceSetting, "push").listen().onChange(localForceHandler.onPushChange);

        }
    }

    function addDebugFolder() {
        var debugFolder = datGui.addFolder("Debug");
        var debugSettings = function () {
            this.showAxisCube = false;
        }

        var debugSettings = new debugSettings();
        debugFolder.add(debugSettings, "showAxisCube").onChange(mainSim.handleAxisHelperUpdate);
    }


    function initStats() {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }

    this.update = function () {
        stats.update();
        updateCameraSettings();
    };

    function updateCameraSettings() {
        cameraSettings.camx = camera.position.x;// dat gui updaten
        cameraSettings.camy = camera.position.y;// dat gui updaten
        cameraSettings.camz = camera.position.z;// dat gui updaten
    }

    this.deleteSelf = function () {
        //var parent =DAT.GUI.autoPlaceContainer;
        datGui.domElement.parentElement.removeChild(datGui.domElement)
    }
}