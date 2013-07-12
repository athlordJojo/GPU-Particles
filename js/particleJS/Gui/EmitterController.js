function EmitterController(_emitter, _simulationInfo, _emitter_Settings){
	var that = this;
	this.emitter = _emitter;
	var simulationInfo = _simulationInfo;
	var emitter_Settings = _emitter_Settings;
	this.onPositionChangeX = function(value){
		that.emitter.positionOfEmitter.x = value;
	}

	this.onPositionChangeY = function(value){
		that.emitter.positionOfEmitter.y = value;
	}

	this.onPositionChangeZ = function(value){
		that.emitter.positionOfEmitter.z = value;
	}

	this.onEmitSizeChange = function(value){
		if(simulationInfo.isDoingPerformanceTest && !($('div[class*="apprise"]').length > 0) ){// zweite bedingung: nur apprise-textbox anzeigen wenn noch keine angezeigt wird
			//$('div[class*="apprise"]').remove();// falls gerade der text angezeigt wird, das rtt/emitsize/life nicht geandert werden kann. wenn dies nicht entfernt wird. kommt es zu darstellungsfehlern
			apprise("You can change this value if the performance test is done");
			
		}
//		
		if(simulationInfo.isDoingPerformanceTest){
			value = that.emitter.baseEmitterSize;
			emitter_Settings.Size = value;
		}
		
		that.emitter.baseEmitterSize = value;
//		if(simulationInfo.isDoingPerformanceTest){
//			texSettings[that.rttSceneInfo.name] = false;
//		}else{
//			texSettings[that.rttSceneInfo.name] = value;
//		}
//		
//		that.rttSceneInfo.showToScreen = texSettings[that.rttSceneInfo.name];
		
	}

	this.onStartVelChangeX = function(value){
		that.emitter.baseVelocity.x = value;
	}	

	this.onStartVelChangeX = function(value){
		that.emitter.baseVelocity.x = value;
	}	

	this.onStartVelChangeY = function(value){
		that.emitter.baseVelocity.y = value;
	}	

	this.onStartVelChangeZ = function(value){
		that.emitter.baseVelocity.z = value;
	}	

	this.onLifetimeChange = function(value){
		if(simulationInfo.isDoingPerformanceTest && !($('div[class*="apprise"]').length > 0) ){// zweite bedingung: nur apprise-textbox anzeigen wenn noch keine angezeigt wird
			apprise("You can change this value if the performance test is done");
		}
		
		if(simulationInfo.isDoingPerformanceTest){
			value = that.emitter.baseLifeTime;
			emitter_Settings.Particle_Lifetime = value;
		}
		that.emitter.baseLifeTime = value;
	}	
	
	this.onEmitPerCallChange = function(value){
		if(simulationInfo.isDoingPerformanceTest && !($('div[class*="apprise"]').length > 0) ){// zweite bedingung: nur apprise-textbox anzeigen wenn noch keine angezeigt wird
			apprise("You can change this value if the performance test is done");
		}
		
		if(simulationInfo.isDoingPerformanceTest){
			value = that.emitter.numberOfParticlesToEmit;
			emitter_Settings.emitsPerCall = value;
		}
		that.emitter.numberOfParticlesToEmit = value;
	}
	
	
}