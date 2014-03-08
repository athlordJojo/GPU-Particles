/*
 * Kapselt die daten bezugliche der grafischen darstellung eines partikelsystems. wird als objekt in particlesystemdata verwendet
 */
function VisualizationType(_name, _depthTest, _blendingMode, _pointSizeFixedElement, _pointSizeRandomElement) {
    var that = this;
    var rttPrecalls = 200;

    if (_name == null || _name == undefined) {
        throw("Name for visualizationType was undefined or null!");
    } else if (!(typeof(_name) === 'string') || (_name instanceof String)) {
        throw("Type of name was not string");
    } else if (_pointSizeFixedElement < 0) {
        throw("_pointSizeFixedElement can not be less then zero");
    } else if (_pointSizeRandomElement < 0) {
        throw("_pointSizeRandomElement can not be less then zero");
    }

    this.getTypeAsNumberForUniforms = function () {
        if (this.name == "smoke") {
            return 1;
        } else if (this.name == "snow") {
            return 2;
        } else if (this.name == "fire") {
            return 3;
        } else if (this.name == "points") {
            return 4;
        } else if (this.name == "bouncyBall") {
            return 5;
        } else if (this.name == "waterfountain") {
            return 6;
        } else if (this.name == "sparks") {
            return 7;
        } else if (this.name == "fog") {
            return 8;
        } else if (this.name == "whiteSmoke") {
            return 9;
        }
        else {
            throw("Unknown type for VisualizationType!");
        }
    };

    if (_depthTest == null || _depthTest == undefined) {
        throw("_depthTest was null or undefined");
    }

    if (_blendingMode == undefined || _blendingMode == null) {
        throw("blendingMode was null or undefined");
    }
    this.blendingMode = _blendingMode;
    this.name = _name;
    this.pointSizeFixedElement = _pointSizeFixedElement;
    this.pointSizeRandomElement = _pointSizeRandomElement;
    this.depthTest = _depthTest;
    this.colorAdjustable = false;

    this.setColorAdjustable = function(value){
        that.colorAdjustable = value;
    }

    this.setRttPrecalls = function (v) {
        if (!(typeof(_name) === 'string') || (_name instanceof String)) {
            throw("wrong type for rtt precalls");
        }
        if (v > 0) {
            rttPrecalls = v;
        } else {
            throw("rtt precalls must be greater then zero");
        }
    }

    this.getRttPrecalls = function () {
        return rttPrecalls;
    }

}