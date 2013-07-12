function TextureController(_rttSceneInfo, _simulationInfo, _texSettings){
	var that = this;
	this.rttSceneInfo = _rttSceneInfo;
	var simulationInfo = _simulationInfo;
	var texSettings = _texSettings;
	
	this.showRttTexture = function(value){
		if(simulationInfo.isDoingPerformanceTest && !($('div[class*="apprise"]').length > 0) ){// zweite bedingung: nur apprise-textbox anzeigen wenn noch keine angezeigt wird
			$('div[class*="apprise"]').remove();// falls gerade der text angezeigt wird, das rtt/emitsize/life nicht geandert werden kann. wenn dies nicht entfernt wird. kommt es zu darstellungsfehlern
			apprise("RTT-Textures can be activated if the performance-test is done");
		}
		
		if(simulationInfo.isDoingPerformanceTest){
			texSettings[that.rttSceneInfo.name] = false;
		}else{
			texSettings[that.rttSceneInfo.name] = value;
		}
		
		that.rttSceneInfo.showToScreen = texSettings[that.rttSceneInfo.name];	
	}
}