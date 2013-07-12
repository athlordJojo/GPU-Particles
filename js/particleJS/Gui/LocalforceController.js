function LocalforceController(_localForce, _settings){
	var that = this;
	var settings = _settings;
	this.localForce = _localForce;

	this.onPositionChangeX = function(value){
		that.localForce.position.x = value;
	}

	this.onPositionChangeY = function(value){
		that.localForce.position.y = value;
	}

	this.onPositionChangeZ = function(value){
		that.localForce.position.z = value;
	}


	this.onMassChange = function(value){
		that.localForce.mass = value;
	}

	this.onPullChange = function(value){
			that.localForce.attractionMode = 0;
			settings.push = false;
			settings.pull = true;
	}


	this.onPushChange = function(value){
			that.localForce.attractionMode = 1;
			settings.push = true;
			settings.pull = false;
	}
	
	this.onMinDistanceChange = function(value){
		that.localForce.minDistance = value;
	}
}