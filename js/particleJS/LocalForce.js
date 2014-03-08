/*
 * Objekte dieser klassen, stellen eine lokale Kraft dar.
 * enthalten die attribute:
 * 
 * -position der lokalen kraft
 * -polygonnetz für die grafische darstellung
 * -aktuelle masse lokale kraft
 * -maximale masse dieser lokalen kraft
 * -Modus der lokalen kraft (anziehend/abstossend)
 * -minimale distanz die fuer die berechnung der kraft der lokalen kraft verwendet wird
 */
function LocalForce(_position, _mass, _attractionMode, _meshRepresentation, _maxMass, _minDistance) {

    if (_position == null || _position == undefined) {
        throw("Keine _position uebergeben");
    } else if (_mass == null || _mass == undefined) {
        throw("Kein _mass-Objekt uebergeben");
    } else if (_attractionMode == null || _attractionMode == undefined) {
        throw("Kein _attractionMode-Objekt uebergeben");
    } else if (_meshRepresentation == null || _meshRepresentation == undefined) {
        throw("Kein _attractionMode-Objekt uebergeben");
    } else if (_minDistance == null || _minDistance == undefined) {
        throw("Kein _minDistance-wert uebergeben");
    }

    if (!(_position instanceof THREE.Vector3)) {
        throw("_position-Objekt ist vom falschen typ");
    } else if (!(typeof _mass == "number")) {
        throw("_mass-Objekt ist vom falschen typ");
    } else if (!( typeof _attractionMode == "number")) {
        throw("updateInfos-Objekt ist vom falschen typ");
    } else if (!(_meshRepresentation instanceof THREE.Mesh)) {
        //throw("_meshRepresentation-Objekt ist vom falschen typ");
    } else if (!( typeof _minDistance == "number")) {
        throw("_minDistance ist vom falschen typ");
    }

    this.position = _position;//position der lokalen kraft
    this.meshRepresentation = _meshRepresentation;
    this.meshRepresentation.position = this.position;// polygonnetz für die grafische darstellung
    this.maxMass = _maxMass;//maximale masse dieser lokalen kraft
    this.mass = _mass;//aktuelle masse lokale kraft
    this.attractionMode = _attractionMode;// Modus der lokalen kraft. 0 = anziehend/pull, 1 = abstossend/push
    this.minDistance = _minDistance;// minimale distanz die fuer die berechnung der kraft der lokalen kraft verwendet wird
}