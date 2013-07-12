function GlobalforceController(world){
	
	this.handleGravityXChange = function(value){
		world.gravity.x = value;
	}

	this.handleGravityYChange = function(value){
		world.gravity.y = value;
	}

	this.handleGravityZChange = function(value){
		world.gravity.z = value;
	}


	this.handleWindXChange = function(value){
		world.wind.x = value;
	}

	this.handleWindYChange = function(value){
		world.wind.y = value;
	}

	this.handleWindZChange = function(value){
		world.wind.z = value;
	}
}