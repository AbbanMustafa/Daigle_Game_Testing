var Bagels = Bagels || {};

//calculate dimensions of the game so that 100% of screen is occupied

Bagels.getGameLandscapeDimensions = function(max_w,max_h){
  var w = window.innerWidth * window.devicePixelRatio;
  var h = window.innerHeight * window.devicePixelRatio;
  
  //get actual w
  var landW = Math.max(w,h);
  var landH = Math.min(w,h);
  
  //do we need to scale to fit width
  if(landW > max_w){
    var ratioW = max_w / landW;
    landW *= ratioW;
    landH *= ratioW;
  }
  
  //do we need to scale to fit height
  if(landH > max_h){
    var ratioH = max_h / landH;
    landW *= ratioH;
    landH *= ratioH;
  }
  
  return {
    w: landW,
    h: landH
  }
}