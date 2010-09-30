(function() {
  var initialize = function() {
    var strokes = [];
    var currentStroke = [];
    var docWidth = window.innerWidth;
    var docHeight = window.innerHeight;
    var canvas = document.createElement('canvas');
    canvas.id = 'doobify-paintlayer';
    canvas.width = docWidth;
    canvas.height = docHeight;
    canvas.style.width = docWidth + "px";
    canvas.style.height = docHeight + "px";
    canvas.style.backgroundColor = "rgba(20,20,20,0.2)";
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 10;
    document.getElementsByTagName('body')[0].appendChild(canvas);      

    var menu = document.createElement('div');
    menu.id = 'doobify-menulayer';
    menu.style.position = "absolute";
    menu.style.right = "20px";
    menu.style.top = "20px";
    menu.style.width = "120px";
    menu.style.zIndex = 11;
    //menu.style.background = "#fff";
    document.getElementsByTagName('body')[0].appendChild(menu);      
    menu.innerHTML = [
      "<ul style='font-size:2em;list-style-type:none;margin:0;padding:5px;border:1px solid black;-webkit-border-radius:5px;background:#fff;-webkit-box-shadow:rgba(0,0,0,0.5) 2px 2px 5px'>",
      "<li>Klowand 0.5</li>",
      "<li><a href='#' id='doobify-delete'>Clear</a></li>",
      "<li><a href='#' id='doobify-off'>Switch Off</a></li>",
      "<li><a href='#' id='doobify-red' style='color:red'>Green</a></li>",
      "<li><a href='#' id='doobify-green' style='color:green'>Orange</a></li>",
      "<li><a href='#' id='doobify-blue' style='color:blue'>Yellow</a></li>",
      "<li><a href='#' id='doobify-yellow' style='color:yellow'>Red</a></li>",
      "<li><a href='#' id='doobify-orange' style='color:orange'>Blue</a></li>",
      "<li><a href='#' id='doobify-censor' style='color:black;background-color:black'>Blue</a></li>",
      "<li><a href='#' id='doobify-redraw' >Redraw</a></li>",
      "</ul>"
    ].join("\n");
  
  
    var context = canvas.getContext('2d');
    context.strokeStyle = "#F80";
    context.lineWidth = 5;
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1.0;

    var penDown = false;
    var penX = 0;
    var penY = 0;

 
    var pendown = function(e) {
      e.preventDefault();        
      penDown = true;
      penX = e.clientX;// - offset.left;
      penY = e.clientY;// - offset.top;
      currentStroke = [[penX, penY]];
    };

    var penup = function(e) {
      e.preventDefault();
      penDown = false;
      strokes.push({style: context.strokeStyle, moves: currentStroke});
      store();
    };

    var redraw = function() {
      context.clearRect(0,0,canvas.width, canvas.height);
      var strokeLen = strokes.length;
      for(var i=0;i<strokeLen;i++) {
        var stroke = strokes[i];
        context.strokeStyle = stroke.style;
        var moveLen = stroke.moves.length;
        for(var m=1;m<moveLen;m++) {
          context.beginPath();
          context.moveTo(stroke.moves[m-1][0], stroke.moves[m-1][1]);
          context.lineTo(stroke.moves[m][0], stroke.moves[m][1]);
          context.stroke();
        }
      }
    };

    var stroke = function(x,y) {
      var context = canvas.getContext('2d');
      context.beginPath();
      context.moveTo(penX, penY);
      context.lineTo(x, y);
      penX = x;
      penY = y;
      currentStroke.push([x,y]);
      context.stroke();       
    };
    var store = function() {
      var strokeLen = strokes.length;
      var allStrokes = [];
      for(var s=0;s<strokeLen;s++) {
        var stroke = strokes[s];
        var stringMoves = [];
        var moveLen = stroke.moves.length;
        for(var m=0;m<moveLen;m++) {
          var move = stroke.moves[m];
          stringMoves.push(move.join(","));
        }
        allStrokes.push(stroke.style + ":" + stringMoves.join(";"));
      }
      var string = allStrokes.join("|");
      console.log(string.length);
      console.log("strokes");
      console.log(strokes.length);
      window.localStorage.setItem('doobify.strokes|' + location.href, string);
      
    };
    var load = function() {      
      strokes = [];
      var string = window.localStorage.getItem('doobify.strokes|' + location.href);
      console.log(string);
      if (string && string.match(/|/)) {
        var allStrokes = string.split("|");
        for(var s=0;s < allStrokes.length;s++) {
          var styleAndMoves = allStrokes[s].split(":");
          var stroke = {style: styleAndMoves[0]};
          var allMoves = styleAndMoves[1].split(";");
          var moves = [];
          for(var m=0;m < allMoves.length; m++) {
            var move = allMoves[m].split(",");
            move[0] = parseInt(move[0],10);
            move[1] = parseInt(move[1],10);
            moves.push(move);
          }
          stroke.moves = moves;
          strokes.push(stroke);
        }
      }
    };
    var mousemove = function(e) {
      e.preventDefault();
      if (penDown) {
        var newPenX = e.clientX; // e.pageX - offset.left;
        var newPenY = e.clientY; // e.pageY - offset.top;
      }        
      stroke(newPenX, newPenY);
    };
    var touchmove = function(e) {
      e.preventDefault();
      if (penDown) {          
        var newPenX = e.touches[0].pageX; // e.pageX - offset.left;
        var newPenY = e.touches[0].pageY; // e.pageY - offset.top;
      }        
      console.log("move");
      console.log(newPenX);
      console.log(newPenY);
      stroke(newPenX, newPenY);
    };
    canvas.addEventListener('touchstart', pendown);
    canvas.addEventListener('touchmove', touchmove);
    canvas.addEventListener('touchend', penup);
    canvas.addEventListener('mousedown', pendown);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mouseup', penup);
    
    // wiring event listeners
    document.getElementById('doobify-delete').addEventListener('click',function() {
      console.log("DEL");
      context.clearRect(0,0,canvas.width, canvas.height);
      return false;
    });
    document.getElementById('doobify-red').addEventListener('click',function() {
      context.strokeStyle = 'red';
    });
    document.getElementById('doobify-green').addEventListener('click',function() {
      context.strokeStyle = 'green';
    });
    document.getElementById('doobify-blue').addEventListener('click',function() {
      context.strokeStyle = 'blue';
    });
    document.getElementById('doobify-yellow').addEventListener('click',function() {
      context.strokeStyle = 'yellow';
    });
    document.getElementById('doobify-orange').addEventListener('click',function() {
      context.strokeStyle = 'orange';
    });
    document.getElementById('doobify-censor').addEventListener('click',function() {
      context.strokeStyle = 'black';
    });
    document.getElementById('doobify-redraw').addEventListener('click',function() {
      redraw();
    });

    document.getElementById('doobify-off').addEventListener('click',function() {
      if (canvas.style.display != 'none') {
        canvas.style.display = "none";
        document.getElementById('doobify-off').innerHTML = 'Switch On';
      } else {
        canvas.style.display = "block";
        document.getElementById('doobify-off').innerHTML = 'Switch Off';
      }
      console.log("OFF");
      
      return false;
    });
    load();
    console.log(strokes);
    console.log(localStorage.length);
    if (strokes.length > 0) {
      redraw();
    }
    
    
  };
  initialize();
})();