/*
 * Enthale funktionen die das MainSimulation-Objekt starten, wenn auf die BIlder in der HTML seite geklickt wird
 */
function HtmlGuiHandler(){
	
	var mainDiv = null;
	var supportsFloatTextures = null;
	function onclickHandler(e){
		if (! Detector.webgl){
			apprise("<b>Sorry</b>, <br><br> your browser does not support WebGL. <br>But you can watch a <b>video</b> of the application on <a target='_blank' href='http://www.youtube.com/watch?v=abh9Rj2HnC4&feature=youtu.be'> YouTube</a>");
		}else{
			if (supportsFloatTextures == null){
				supportsFloatTextures = checkFloatTestureExtension();
			}
			
			var valueOfNameAttribute = e.target.attributes["name"].value;
			
			if( !supportsFloatTextures){
				apprise("<b>Sorry</b>, <br><br> your hardware does not support 'OES_texture_float', which is required for the application. <br>But you can watch a <b>video</b> of the application on <a target='_blank' href='http://www.youtube.com/watch?v=abh9Rj2HnC4&feature=youtu.be'> YouTube</a>");
			}else{				
				if(containsSubstring(valueOfNameAttribute, "ask")){
					
					var questionString = "The loading process with more then one million particles can take more then one minute and may slow down your system! (depending on the hardware of your machine). Do you want to continue?"
					apprise(questionString, {'verify':true}, function(r){
						if(r){
							startPs(valueOfNameAttribute);
						}
					});
				}else{
					startPs(valueOfNameAttribute);
				}
			}
		}
	}
	
	function startPs(valueOfNameAttribute){
		mainDiv = $('div[name*="htmlMainDiv"]');
		mainDiv.fadeOut(500, function(){
			$('#dvLoading').show();
			if(containsSubstring(valueOfNameAttribute, "demo")){
				var indexOf = valueOfNameAttribute.lastIndexOf("-");
				var psToStart = valueOfNameAttribute.substring(indexOf+1);
				var sim = new MainSimulation(psToStart, "", simulationFinishCallBack);//snow2_GPU performanceTest
			}else if(containsSubstring(valueOfNameAttribute, "test")){
				var indexOf = valueOfNameAttribute.indexOf("_");
				var psToStart = valueOfNameAttribute.substring(indexOf+1);
				var sim = new MainSimulation(psToStart, "performanceTest", simulationFinishCallBack);//snow2_GPU performanceTest
			}
				
		});	
	}
	
	function simulationFinishCallBack(){
		$('div[name*="webGLDiv"]').empty();
		$('div[id*="stats"]').remove();	
		mainDiv.fadeIn(500, function(){
			
		});
	}
	init();
	
	function init(){
		String.prototype.endsWith = function(suffix) {
		    return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
		$('img[name*="startingImage-"]').click(onclickHandler);
		$('img[name*="startingImage-"]').hover(function() {
			 $(this).css('cursor','pointer');
			 }, function() {
			 $(this).css('cursor','auto');
			});

	}
	
	function containsSubstring(mainString, substringToFind){
		return mainString.indexOf(substringToFind) !==-1;
	}
	
	function checkFloatTestureExtension(){
		var webGlRenderer = new THREE.WebGLRenderer();
		return webGlRenderer.getContext().getExtension("OES_texture_float");
	}
}