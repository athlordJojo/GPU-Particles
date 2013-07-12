/*
 * Array objekt, erweitert um die funktion removeItemAt
 */
MyArray.prototype = new Array;
function MyArray(){
	Array.call(this);

	this.removeItemAt = function(index) {
	  this.splice(index, 1);
	}
}