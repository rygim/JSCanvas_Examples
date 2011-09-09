
var star = function(x, y, vy, color) {
	var star = {
		x: x,
		y: y, 
		vy: vy,
		color: color
	}
	
	return star;
};

var initStars = function(ctx, numStars){
	var stars = [];
	
	for (var i = 0; i < numStars; i++){
		var startX = Math.random() * ctx.canvas.width;
		var startY = Math.random() * ctx.canvas.height;
		var vy = Math.random() * 10;
		var color = Math.round(Math.random() * 255);
		
		stars.push(star(startX, startY, vy, color));
	}
	
	return stars;
}

var simpleStarfield = function($canvas, numStars){
	
	//Get the drawing context
	var ctx = $canvas[0].getContext("2d");
	
	//initialize the stars	
	var stars = initStars(ctx, numStars);

	var draw = function(){
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		for (var i = 0; i < stars.length; i++)
		{
			ctx.beginPath();
			ctx.fillStyle = "rgb(" + stars[i].color + ", " + stars[i].color + ", " + stars[i].color + ")";
			ctx.arc(stars[i].x, stars[i].y, 1, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		}
	};

	var update = function(){
		for (var i = 0; i < stars.length; i++){
			stars[i].y += stars[i].vy;
			
			if (stars[i].y > ctx.canvas.height){
				stars[i].y = 0;
			}
		}	
	};
	
	(function(numLoops){
		setInterval(function(){
			update();
			draw();
		}, 30);
	}).call(this);	
};





