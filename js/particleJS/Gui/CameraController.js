function CameraController(_settings, _camera, _camPosXStart, _camPosYStart, _camPosZStart, _camLookX, _camLookY,_camLookZ){
	var camera = _camera;
	var settings = _settings;
	var camPosXStart = _camPosXStart, camPosYStart = _camPosYStart,camPosZStart = _camPosZStart, camLookX = _camLookX,camLookY = _camLookY ,camLookZ = _camLookZ;
	
 	this.onCamHandler_start = function (){
		var newXPos = camPosXStart, newYPos = camPosYStart, newZPos = camPosZStart, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}

	this.onCamHandler_near_1 =  function (){
		var newXPos = 33, newYPos = 9, newZPos = 11, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}


	this.onCamHandler_near_2 = function (){
		var newXPos = 80, newYPos = 9, newZPos = 11, newXLook = 0, newYLook = 25, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}
	this.onCamHandler_far_1 = function (){
		var newXPos = 100, newYPos = 100, newZPos = 100, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}
	this.onCamHandler_far_2 =  function (){
		var newXPos = 386, newYPos = 122, newZPos = 400, newXLook = 0, newYLook = -61, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}

	this.onCamHandler_x_plus = function (){
		var newXPos = 600, newYPos = 10, newZPos = 0, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}


	this.onCamHandler_x_minus = function (){
		var newXPos = -600, newYPos = 10, newZPos = 0, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}

	this.onCamHandler_z_plus = function (){
		var newXPos = 0, newYPos = 10, newZPos = 600, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}

	this.onCamHandler_z_minus = function (){
		var newXPos = 0, newYPos = 10, newZPos = -600, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}

	this.onCamHandler_y_plus = function (){
		var newXPos = 0, newYPos = 600, newZPos = 0, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}

	this.onCamHandler_y_minus = function (){
		var newXPos = 0, newYPos = -600, newZPos = 0, newXLook = 0, newYLook = 0, newZLook = 0;
		updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook);
	}
	
	this.onDAT_CamXChange = function (value){
		camera.position.x = value;
		// muss ausgefuehrt werden damit die kamera bei einer positions aenderung auch wieder auf ihr ziel guckt
	    camera.lookAt(new THREE.Vector3(camLookX,camLookY,camLookZ));
	}

	this.onDAT_CamYChange =function (value){
		camera.position.y = value;
	    // muss ausgefuehrt werden damit die kamera bei einer positions aenderung auch wieder auf ihr ziel guckt
	    camera.lookAt(new THREE.Vector3(camLookX,camLookY,camLookZ));	
	}

	this.onDAT_CamZChange =function (value){
		camera.position.z = value;
	    // muss ausgefuehrt werden damit die kamera bei einer positions aenderung auch wieder auf ihr ziel guckt
	    camera.lookAt(new THREE.Vector3(camLookX,camLookY,camLookZ));	
	}


	this.onDAT_CamLookXChange =function (value){
		camLookX = value;
		camera.lookAt(new THREE.Vector3(camLookX,camLookY,camLookZ));
	}


	this.onDAT_CamLookYChange =function (value){
		camLookY = value;
		camera.lookAt(new THREE.Vector3(camLookX,camLookY,camLookZ));
	}

	this.onDAT_CamLookZChange =function (value){
		camLookZ = value;
		camera.lookAt(new THREE.Vector3(camLookX,camLookY,camLookZ));
	}
	
	function updateCam(newXPos, newYPos,newZPos, newXLook, newYLook, newZLook){
		camera.position.x = newXPos;
		camera.position.y = newYPos;
		camera.position.z = newZPos;
		settings.camx = camera.position.x;// dat gui updaten
		settings.camy = camera.position.y;// dat gui updaten
		settings.camz = camera.position.z;// dat gui updaten

		var v = new THREE.Vector3(newXLook,newYLook,newZLook);
		camera.lookAt(v);
		settings.camLookAtX = newXLook;
		settings.camLookAtY = newYLook;
		settings.camLookAtZ = newZLook;
	}
}