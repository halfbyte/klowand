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
      "</ul>"
    ].join("\n");
  
  
    var context = canvas.getContext('2d');
    context.strokeStyle = "#F80";
    context.lineWidth = 5;
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1.0;
    // context.beginPath();
    // context.moveTo(100,100);
    // context.lineTo(200,200);
    // context.stroke();
    console.log(context);
    console.log(canvas);

    var penDown = false;
    var penX = 0;
    var penY = 0;

    var mousedown = function(e) {
      e.preventDefault();        
      penDown = true;
      penX = e.clientX;// - offset.left;
      penY = e.clientY;// - offset.top;        
    };
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
          context.moveTo(stroke.moves[m-1][0], stroke.moves[m-1][0]);
          context.LineTo(stroke.moves[m-1][0], stroke.moves[m-1][0]);
        }
      }
    }

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
    
    
  };
  initialize();
})();