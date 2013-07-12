/*
 * Stellt ein Partikel fuer die berechnung auf der cpu dar. Wird in EmitterCPU verwendet.
 * Objekte dieser Klassen können durch die Funktion updatePosition aktualisiert werden. Dabei werden alle drei 
 * Integrationschritte durchgefuehrt, also berechnung der kraft, der neuen beschleunigung, der neuen geschwindigkeit und abschliesend der postionsaenderung
 */
function ParticleCpu(_lifeDrain, _world, _threeParticle, _velVec, _particleSystemData){
	var that = this;
	this.startLife = NaN;
	this.lifeDrain = _lifeDrain;
	this.life = this.startLife;
	this.isDead = true;
	var world = _world;
	var friction = -1 * _particleSystemData.frictionCoefficent;

	this.threeParticle = _threeParticle;
	this.velocityVector = _velVec;

	var currentDeltaT = world.deltaT;
	var isGravityDown = _particleSystemData.isGravityDown;// 1= smoke, 2 = rain
	var mass = _particleSystemData.mass;
	
	this.update = function(){
		if(this.isDead)throw("Dead particle called to update");
		currentDeltaT = world.deltaT; 
		this.life -=  currentDeltaT * this.lifeDrain;
		this.isDead = this.life <= 0;
		
		if(!this.isDead){
			updatePosition();
		}
	}

	/*
	 * aktualisiert das Partikel
	 */
	function updatePosition(){
		// ***********************begin kraft berechnen***********************
		var acceleration = getCalculatedForce();
		acceleration.multiplyScalar(1/mass);	
	    //kraft in relation zur vergangene zeit
		// entspricht im vel-shader: vec3 a = force_added * (1.0/massOfParticle);
		acceleration.multiplyScalar(currentDeltaT);//a * deltaT
		// ***********************Ende kraft berechnen***********************
		
		// ***********************begin Geschwindigkeit berechnen***********************
		// Kraft auf beschleunigung wirken lassen
	    //Entsptricht vec3 newVol = velOld + a*deltaT; im velovityshader
		var newVel = that.velocityVector.clone();
		newVel.add(acceleration);
		
		//reibungskraft anwenden. kann erst berechnet werden, wenn die komplette geschwindigkeit berechnet ist. deshalb ausnahme des dlamreches prinzip
		var frictionForce = getFrictionForce(newVel);
		newVel.add(frictionForce);
		that.velocityVector = new THREE.Vector3(newVel.x, newVel.y, newVel.z);// wichtig! zwischenspeichern der berechneten velocity fuer neacxhste iteration		
		// ***********************ENDE Geschwindigkeit berechnen***********************
		
		// ***********************begin Position berechnen***********************
		var newVelWithoutDeltaT = newVel.clone(); 
		
		
		var oldPos = that.threeParticle.clone();
		var velWithDeltaT = newVelWithoutDeltaT.clone().multiplyScalar(currentDeltaT);
		var newPos = oldPos.clone().add(velWithDeltaT);
		if(oldPos.y < 0 && newPos.y < 0){
			newVel.multiplyScalar(0);
		}else{
			var dist =  newPos.dot(_particleSystemData.planeNormal);
			if(dist <= 0){
				//entspricht: newVelCopy =  newVel - (2.0 * pNormal * dot(pNormal, newVelCopy)) ;
				// also spiegelung an der ebenen normalen
				var newVelForDotCalc = _particleSystemData.planeNormal.clone();
				newVelForDotCalc.multiplyScalar(2);
				var newVelNorm = newVelWithoutDeltaT.clone();
				var dot = newVelNorm.dot(_particleSystemData.planeNormal);
				newVelForDotCalc.multiplyScalar(dot);
				
				var newVelCollision = newVelWithoutDeltaT.clone();
				newVelCollision.sub(newVelForDotCalc);
				newVelCollision.multiplyScalar((mass/world.planeMass));
				newVel = newVelCollision;
				that.velocityVector = new THREE.Vector3(newVel.x, newVel.y, newVel.z);// wichtig! zwischenspeichern der berechneten velocity fuer neacxhste iteration
			}			
		}
		
		newVel.multiplyScalar(currentDeltaT);// v*deltaT
		oldPos = that.threeParticle.clone();
		newPos = oldPos.add(newVel).clone();
		that.threeParticle.x = newPos.x;
		that.threeParticle.y = newPos.y;
		that.threeParticle.z = newPos.z;
		// ***********************ENDE Position berechnen***********************
	}

	/*
	 * berechnet die kraft die auf das partikel wirkt
	 */
	function getCalculatedForce(){
		// dalmbertsches prinzip
		//entspricht : vec3 force_added = wind.xyz + inverseGravity.xyz + attractionForce.xyz; im velocity shader
		var acceleration = new THREE.Vector3(0,0,0);
		acceleration.add(world.wind);
		var usedG = null;
		if(isGravityDown){
			usedG = world.gravity.clone();
		}else{
			usedG = new THREE.Vector3(world.gravity.x, -world.gravity.y, world.gravity.z);		
		}
		
		usedG.multiplyScalar(mass);
		acceleration.add(usedG);
		var attractionForce = getAttractionForce();
		acceleration.add(attractionForce);
		
		return acceleration;	
	}
	
	/*
	 * berechnte die reibungskraft
	 */
	function getFrictionForce(v){
		var copVec = v.clone();
		copVec.multiplyScalar(friction);
		copVec.multiplyScalar(currentDeltaT);
		return copVec;
	}
	
	
	
	/*
	 * berechnte die kraft der lokalen krafte
	 */
	function getAttractionForce() {
		var attractorsPos = world.getLocalForcePositions();
		var attractorMasses = world.getLocalForceMasses();
		var attractorModes = world.getLocalForceAttractionModes();
		var minDistances = world.getLocalForceMinDistance();
		
		var sumOfAttractionForces = new THREE.Vector3(0,0,0);
		for(var i=0; i<attractorsPos.length; i++){
			var massOfAttractor = attractorMasses[i];
			if(massOfAttractor == 0)continue;
			var posOfAttractor = attractorsPos[i];
			var attractionMode = attractorModes[i];
			var minDistanceOfAttractos = minDistances[i];
			
			var direction =  new THREE.Vector3(0,0,0);
			if(attractionMode == 0){
				direction.subVectors(posOfAttractor, that.threeParticle);// hin zum attractor
			}else if(attractionMode == 1){
				direction.subVectors(that.threeParticle, posOfAttractor);// weg vom attractor
			}
			
			var distance = direction.length();
			direction.normalize();
			
			if(distance < minDistanceOfAttractos){
				distance = minDistanceOfAttractos;
			}
			
			var force = (mass * massOfAttractor)/(distance*distance);
			var attractionForceVector = direction.multiplyScalar(force);
			sumOfAttractionForces.add(attractionForceVector);
		}
		return sumOfAttractionForces;
	}
	
	this.reInit= function(){
		this.isDead = false;
		this.life = this.startLife;
	}
}