var frontPage = function(){        
    var tossedItems = [], sizeMultiplier = 1, numTossedItems = 20, images = [],  drawIntroText = false, ay = 50,
    imageSrc = ["/images/chris_dagostino.png", 
        "/images/nic-logo.png", 
        "/images/jeff_borst.png",
        "/images/scott_leberknight.png",
        "/images/chris_rohr.png",
        "/images/dave_singley.png"];
    for(var i = imageSrc.length; i--; ){
        var newImg = new Image();
        newImg.src = imageSrc[i];
        images.push(newImg);
    }
        
    var expensiveFunction = function(){
        for(var i = 100; i--;){ 
            console.log("");
        } 
    };
    
    var drawBg = function(ctx){
        var cg = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        cg.addColorStop(0, '#00BFFF');
        cg.addColorStop(0.7,'#00BFFF');
        cg.addColorStop(0.9, 'white');
        cg.addColorStop(0.9, '#55dd00');
        cg.addColorStop(1, 'white');
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);     
    };
    
    var height = 0, width = 0;
    
    var setCanvasToPageWidth = function($canvas, sizeMult){
        var canvasHeight = window.innerHeight * sizeMult,
        canvasWidth = window.innerWidth * sizeMult;
        if(height !== canvasHeight || width !== canvasWidth){
            $canvas.attr("height", window.innerHeight * sizeMult);
            $canvas.attr("width", window.innerWidth * sizeMult);
        }
    };    
    
    var drawTossedItems = function(tossedItems, ctx){
        for(var i = tossedItems.length; i--; ){
            var itemWidth = tossedItems[i].image.width,
            itemHeight= tossedItems[i].image.height;
            ctx.save();
            ctx.translate(tossedItems[i].x, tossedItems[i].y);
            ctx.rotate(tossedItems[i].rotation);
            ctx.drawImage(tossedItems[i].image, -itemWidth / 2, -itemHeight / 2);
            ctx.restore();
        }
        
        if (drawIntroText){
            ctx.fillStyle = "yellow";
            ctx.font = "40pt Calibri bold";
            var text = "5 Tips for Optimizing Canvas Applications",
            subtitleText = "-Ryan Gimmy",
            titleWidth = ctx.canvas.width - ctx.measureText(text).width,
            subtitleWidth = ctx.canvas.width - ctx.measureText(subtitleText).width;
            ctx.fillText(text, titleWidth / 2, ctx.canvas.height / 2);
            ctx.font = "35pt Calibri";
            ctx.fillText(subtitleText, 3 * subtitleWidth / 4, ctx.canvas.height / 2 + 50);
        }
    };
    
    var eraseTossedItems = function(tossedItems, ctx){
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
    };
    
    var updateTossedItems = function(elapsedTime, tossedItems, ctx){
        var normalizedTime = 1 / (elapsedTime || 1);
        for(var i = tossedItems.length; i--; ){
            tossedItems[i].vy += ay * normalizedTime;
            tossedItems[i].x += tossedItems[i].vx * normalizedTime;
            tossedItems[i].y += tossedItems[i].vy * normalizedTime;
            tossedItems[i].rotation += tossedItems[i].rotationSpeed;
        }
    };
    
    var removeAndChangeTossedItems = function(tossedItems, ctx){
        for(var i = tossedItems.length; i--; ){
            if(tossedItems[i].y > ctx.canvas.height){
                delete tossedItems[i];
                tossedItems[i] = newTossedItem(ctx);
            } 
        }
    };
    
    
    var newTossedItem = function(ctx){	
        return {
            x: ctx.canvas.width / 8 * Math.random(),
            y: ctx.canvas.height,
            rotation: Math.sin(Math.PI * 2 * Math.random()),
            rotationSpeed: Math.PI / 32,
            vx: Math.random() * ctx.canvas.width / 8,
            vy:  - ctx.canvas.height * Math.random() / 3,
            image: images[Math.round((imageSrc.length - 1) * Math.random())]
        };
    };

    return {
        drawWithLongBackground: function($canvas, ctx){
            expensiveFunction();
            this.draw($canvas, ctx);
        },
        drawNoBackground: function(ctx){
            drawTossedItems(tossedItems, ctx);
        },
        draw: function($canvas, ctx){
            drawBg(ctx);    
            this.drawNoBackground(ctx); 
        },
        updateNoInterpolation: function(ctx){  
            removeAndChangeTossedItems(tossedItems, ctx);
        },
        update: function(elapsedTime, ctx, bgCtx, cloudCtx){
            this.interpolate(elapsedTime, ctx, bgCtx, cloudCtx);
            this.updateNoInterpolation(ctx);
        },
        interpolate: function(elapsedTime, ctx, bgCtx, cloudCtx){
            bgCtx = bgCtx || ctx;
            cloudCtx = cloudCtx || ctx;
            updateTossedItems(elapsedTime, tossedItems, ctx);  
        },
        init: function(isIntro, sizeMult, ctx){
            sizeMultiplier = sizeMult;
            ay = sizeMultiplier * 50;
            drawIntroText = isIntro;
            for(var i = numTossedItems; i--; ){
                tossedItems.push(newTossedItem(ctx));	
            }
        },
        longDrawBackground: function(ctx){ 
            expensiveFunction();
            drawBg(ctx, true);
        },
        longUpdateWithInterpolation: function(elapsedTime, ctx, bgCtx, cloudCtx){
            expensiveFunction();
            this.update(elapsedTime, ctx, bgCtx, cloudCtx);
        },
        longUpdateNoInterpolation: function(elapsedTime, ctx, bgCtx, cloudCtx){
            expensiveFunction();
            this.updateNoInterpolation(ctx);
        },
        drawNoBackgroundWithErasing: function(ctx){
            eraseTossedItems(tossedItems, ctx);
            this.drawNoBackground(ctx);
        }
    };
}();