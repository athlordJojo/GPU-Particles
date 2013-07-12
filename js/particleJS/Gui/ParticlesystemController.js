//wird benotigt um auf klicks zu reagieren die auf die checkboxen den pause-kmopf von einem ps ausgefuhert wurden.
//kapselt das ps udn texturename und ein handlerfunktion
function ParticlesystemController(_ps_name, _ps, _simulationInfo, _psGuiSettings){
	AbstractHandler.call(this, "OnPauseHandler",_ps_name, null);

	var that = this;
	var ps = _ps;
	var simulationInfo = _simulationInfo;
	var psGuiSettings = _psGuiSettings;
	this.onPause = function(value){
		if(simulationInfo.isDoingPerformanceTest && !($('div[class*="apprise"]').length > 0) ){// zweite bedingung: nur apprise-textbox anzeigen wenn noch keine angezeigt wird
			$('div[class*="apprise"]').remove();// falls gerade der text angezeigt wird, das rtt/emitsize/life nicht geandert werden kann. wenn dies nicht entfernt wird. kommt es zu darstellungsfehlern
			apprise("Particlesystem can be paused if the performance-test is done");
		}
		
		if(simulationInfo.isDoingPerformanceTest){
			ps.isPause = false;
		}else{
			ps.isPause = value;
		}
		
		psGuiSettings.Pause = ps.isPause;
	}
	
	this.onDeactivate = function(value){
		if(simulationInfo.isDoingPerformanceTest && !($('div[class*="apprise"]').length > 0) ){// zweite bedingung: nur apprise-textbox anzeigen wenn noch keine angezeigt wird
			$('div[class*="apprise"]').remove();// falls gerade der text angezeigt wird, das rtt/emitsize/life nicht geandert werden kann. wenn dies nicht entfernt wird. kommt es zu darstellungsfehlern
			apprise("Particlesystem can be deactivated if the performance-test is done");
		}
		if(simulationInfo.isDoingPerformanceTest){
			ps.isAlive = true;
		}else{
			ps.isAlive = value;
		}
		psGuiSettings.Active = ps.isAlive;
	}
}