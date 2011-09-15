var drawBackground = function(ctx){
	var cg = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
	cg.addColorStop(0, '#00BFFF');
	cg.addColorStop(0.7,'#00BFFF');
	cg.addColorStop(0.9, 'white');
	cg.addColorStop(0.9, '#55dd00');
	cg.addColorStop(1, 'white');
	ctx.fillStyle = cg;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

var setCanvasToPageWidth = function($canvas, dimensionData){
        if (window.innerHeight != dimensionData.height ||
            window.innerWidth != dimensionData.width){
            
            dimensionData.height = window.innerHeight;
            dimensionData.width = window.innerWidth;
    
            $canvas.attr("height", window.innerHeight);
            $canvas.attr("width", window.innerWidth);
        }
};

var cloud = function(ctx, init){
	var x = init ? Math.random() * ctx.canvas.width : 0,
		y = Math.random() * ctx.canvas.height * 0.9,
		vx = Math.random() * 10;
	
	return {x:x, y:y, vx:vx};
};

var initClouds = function(clouds, ctx){
	var numClouds = 10;
	
	for (var i = 0; i < numClouds; i++){
		clouds.push(cloud(ctx, true));
	}
};

var updateClouds = function(clouds, ctx){
	for (var i = 0; i < clouds.length; i++){
		clouds[i].x += clouds[i].vx;
		
		if (clouds[i].x > ctx.canvas.width){
			delete clouds[i];
			clouds[i] = cloud(ctx, false);
		}
	}
};

var drawClouds = function(clouds, ctx){
	ctx.fillStyle = '#4dd2ff';
	for (var i = 0; i < clouds.length; i++){
		ctx.beginPath();
		ctx.arc(clouds[i].x, clouds[i].y, 30, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}
};

var drawTossedItems = function(tossedItems, ctx){
	for(var i = 0; i < tossedItems.length; i++){
		var itemWidth = tossedItems[i].image.width,
			itemHeight= tossedItems[i].image.height;
		ctx.drawImage(tossedItems[i].image, tossedItems[i].x - itemWidth / 2, tossedItems[i].y - itemHeight / 2);
	}
};

var updateTossedItems = function(tossedItems, ctx){
	for(var i = 0; i < tossedItems.length; i++){
		tossedItems[i].vy += tossedItems[i].ay;
		tossedItems[i].x += tossedItems[i].vx;
		tossedItems[i].y += tossedItems[i].vy;
                tossedItems[i].rotation += tossedItems[i].rotationSpeed;
		
		if(tossedItems[i].y > ctx.canvas.width + 50){
			delete tossedItems[i].y;
			tossedItems[i] = newTossedItem(ctx);
		}
	}
};

var newTossedItem = function(ctx){
        var numItems = 2;
	var itemNum = Math.ceil(Math.random() * numItems),
		x = ctx.canvas.width / 4 * Math.random(),
		y = ctx.canvas.height,
		rotation = Math.sin(Math.PI * 2 * Math.random()),
		rotationSpeed = Math.PI / 32,
		vx = Math.random() * 10 + 3,
		vy = -10 * Math.random() - 10;
	
	var item = {
		x:x,
		y:y,
		rotation: rotation,
		rotationSpeed: rotationSpeed,
		vx: vx,
		vy: vy,
		ay: .2,
		image: new Image()
	};
	
	if (itemNum % numItems == 0){
		item.image.src = "/images/chris_dagostino.png";
	}
	else if (itemNum % numItems == 1){
		item.image.src = "/images/nic-logo.png";
	}	
	
	return item;
};

var drawText = function($canvas, ctx){
    var image = new Image();
    image.src = "/images/front-page-text.png";
    var imageX = Math.max((window.innerWidth - image.width) / 2, 0);
    var imageY = Math.max((window.innerHeight - image.height) / 2, 0);
    ctx.drawImage(image, imageX, imageY);
};

var drawFpsData = function(data, ctx){
    ctx.fillStyle = "yellow";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("FPS: " + data.fps, 5, 25);
    ctx.fillText("Avg. update time: " + data.averageUpdateTime, 5, 45);
    ctx.fillText("Avg. draw time: " + data.averageDrawTime, 5, 65);
    var totalTime = data.averageDrawTime + data.averageUpdateTime;
    var possibleFps = 1000 / totalTime;
    ctx.fillText("Avg. total time: " + totalTime, 5, 85);
    ctx.fillText("Ideal FPS: " + possibleFps, 5, 105);
};

var canvasDimensionData = function(){
  var dimData = {
      height: 0,
      width: 0 
  };
  
  return dimData;
};

var frontPage = function($canvas, showFpsData){
        var profiler = fpsProfiler();
	var ctx = $canvas[0].getContext("2d");
        var dimensionData = canvasDimensionData();
	setCanvasToPageWidth($canvas, dimensionData);
	
	var clouds = [],
		tossedItems = [],
		numItems = 10;
	
	for(var i = 0; i < numItems; i++){
		tossedItems.push(newTossedItem(ctx));	
	}
	
	initClouds(clouds, ctx);
	
	var draw = function(){
            drawBackground(ctx);
            drawClouds(clouds, ctx);
            drawTossedItems(tossedItems, ctx);
            drawText($canvas, ctx);
            if (showFpsData()){
                drawFpsData(data, ctx);
            }
            profiler.defaultDraw(ctx);
	};
	
	var update = function(){
            setCanvasToPageWidth($canvas, dimensionData);
            updateClouds(clouds, ctx);
            updateTossedItems(tossedItems, ctx);
	};

        profiler.start();
        
	setInterval(function(){
                profiler.beginUpdate();
		update();
                profiler.endUpdate();
                profiler.beginDraw();
		draw();
                profiler.endDraw();
	}, 16);
};