
var newStar = function(ctx, image) {
	var x = ctx.canvas.width / 2 - image.width / 2,
		y = ctx.canvas.height / 2 - image.height / 2,
		scale = 1,
		direction = Math.random() * Math.PI * 2,
		speed = Math.random() / 5;
	
	return { x:x, y:y, scale:scale, direction:direction, speed:speed };
};

var drawStars = function(stars, image, ctx) {
	ctx.fillStyle = "rgb(0,0,0)";
	for(var i = 0; i < stars.length; i++){
		ctx.fillRect(stars[i].lastX, stars[i].lastY, image.width, image.height);
	}
	
	for(var i = 0; i < stars.length; i++){
		ctx.drawImage(image, stars[i].x, stars[i].y);
	}
};

var updateStars = function(stars, ctx, image) {
	for (var i = 0; i < stars.length; i++){
		stars[i].lastX = stars[i].x;
		stars[i].lastY = stars[i].y;
		
		stars[i].y += Math.sin(stars[i].direction) * stars[i].speed;
		stars[i].x += Math.cos(stars[i].direction) * stars[i].speed;
		stars[i].speed += 0.04;
		stars[i].radius += 0.02;
		
		if (stars[i].y > ctx.canvas.height + image.height || 
			stars[i].x > ctx.canvas.width + image.width ||
			stars[i].y < 0 - image.height || 
			stars[i].x < 0 - image.width){
			delete stars[i];	
			stars[i] = newStar(ctx, image);
		}
	}
}

var simpleStarfield = function($canvas, numStars){

	var ctx = $canvas[0].getContext("2d"),
		stars = [],
		image = new Image();
	
	image.src = "images/chris_dagostino.png";
	
	var draw = function(){
		drawStars(stars, image, ctx);
	};

	var update = function(){
		if (stars.length < numStars){
			stars.push(newStar(ctx, image));
		}
		
		updateStars(stars, ctx, image);
	};

	var startCanvas = function(){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
		setInterval(function(){
			update();
			draw();
		}, 30);
	};
	
	image.onload = startCanvas;
};





