var frontPage = function(){
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
    
    var setCanvasToPageWidth = function($canvas, sizeMult){
        $canvas.attr("height", window.innerHeight * sizeMult);
        $canvas.attr("width", window.innerWidth * sizeMult);
    };    
    
    var drawTossedItems = function(tossedItems, ctx){
        for(var i = 0; i < tossedItems.length; i++){
            var itemWidth = tossedItems[i].image.width,
            itemHeight= tossedItems[i].image.height;
            
            ctx.save();
            ctx.translate(tossedItems[i].x, tossedItems[i].y);
            ctx.rotate(tossedItems[i].rotation);
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.arc(0,0,2, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.drawImage(tossedItems[i].image, -itemWidth / 2, -itemHeight / 2);
            ctx.restore();
        }
    };
    
    var updateTossedItems = function(elapsedTime, tossedItems, ctx){
        for(var i = 0; i < tossedItems.length; i++){
            tossedItems[i].vy += tossedItems[i].ay;
            tossedItems[i].x += tossedItems[i].vx * elapsedTime / 50;
            tossedItems[i].y += tossedItems[i].vy * elapsedTime / 50;
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
            ay: .1,
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
    
    var tossedItems = [],
    sizeMultiplier = 1,
    numItems = 40;

    return {
        draw: function($canvas, ctx, bgCtx, cloudCtx){
            bgCtx = bgCtx || ctx;
            cloudCtx = cloudCtx || ctx;
            setCanvasToPageWidth($canvas, sizeMultiplier);
            drawBackground(bgCtx);
            drawTossedItems(tossedItems, ctx);
        },
        update: function(elapsedTime, ctx, bgCtx, cloudCtx){  
            bgCtx = bgCtx || ctx;
            cloudCtx = cloudCtx || ctx;
            updateTossedItems(elapsedTime, tossedItems, ctx);
        },
        init: function(sizeMult, ctx, bgCtx, cloudCtx){
            bgCtx = bgCtx || ctx;
            cloudCtx = cloudCtx || ctx;
            sizeMultiplier = sizeMult;
            for(var i = 0; i < numItems; i++){
                tossedItems.push(newTossedItem(ctx));	
            }
        }
    };
}();