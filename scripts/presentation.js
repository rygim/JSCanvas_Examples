var newAction = function(todo, undo){
    var action = {
        todo: todo,
        undo: undo
    }
    
    return action;
};

var showHideAction = function($selector){
    return newAction(function(){
        $selector.removeClass("hidden");
    }, function(){
        $selector.addClass("hidden");
    });
};

var showHideAndGotoAction = function($selector, gotoStr, fromStr){
    var action1 = showHideAction($selector);
    return newAction(function(){
            action1.todo();
            window.location.href = gotoStr;
        },
        function(){
            action1.undo();
            window.location.href = fromStr;
        });    
};

var getUrlVars = function()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

var inputHasFocus = function(){
  return $("input:focus").length > 0 || $("canvas:focus").length > 0;  
};

var bindPresentationActions = function(backLocation, actions, nextLocation) {
    var index = 0;
    
    $(document).bind('keyup', function(event){
        if (inputHasFocus()){
            return;
        }
        
        var isNext = event.which === 37;
        var isBack = event.which === 39 || event.which === 32;
        
        if (isNext && index === 0 && backLocation !== undefined){
            window.location = backLocation + "?goback=true";
        }
        else if (isNext && index === 0 && backLocation === undefined){
            return;
        }
        else if (isNext){
            actions[index-1].undo();
            index--;
        }
        else if (isBack && (index == actions.length || actions.length == 0)){
            window.location = nextLocation;
        }
        else if (isBack){
            actions[index].todo();
            index++;
        }
    });    
    
    if (getUrlVars()["goback"] === "true"){
       for(index = 0; index < actions.length; index++){
           actions[index].todo();
       } 
    }
};
