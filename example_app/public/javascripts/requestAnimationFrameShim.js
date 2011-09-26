if(typeof webkitRequestAnimationFrame !== "undefined"){
    window.requestAnimationFrame = webkitRequestAnimationFrame;
}
else if(typeof mozRequestAnimationFrame !== "undefined") {
    window.requestAnimationFrame = mozRequestAnimationFrame;
}
else if(typeof msRequestAnimationFrame !== "undefined") {
    window.requestAnimationFrame = msRequestAnimationFrame;
}
else if(typeof window.requestAnimationFrame === "undefined"){
    window.requestAnimationFrame = function(animationStep){
        setTimeout(animationStep, 30);  
    };
}
