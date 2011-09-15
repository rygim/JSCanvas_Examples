var bindPresentationActions = function(backLocation, actions, nextLocation){
    
    var index = 0;
    
    $(document).bind('keyup', function(event){
        if (event.which === 37 && index === 0 && backLocation !== undefined){
            window.location = backLocation + "?goback=true";
        }
        else if (event.which === 37 && index === 0 && backLocation === undefined){
            return;
        }
        else if (event.which === 37){
            actions[index-1].undo();
            index--;
        }
        else if (event.which === 39 && (index == actions.length || actions.length == 0)){
            window.location = nextLocation;
        }
        else if (event.which === 39){
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

var newAction = function(todo, undo){
    var action = {
        todo: todo,
        undo: undo
    }
    
    return action;
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