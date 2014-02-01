// some variables that we gonna use in this demo  
var initId = 0;  
var player = function(){  
	this.object = [];
	this.object[0] = null;  
	this.object[1] = null;
    this.canJump = false;  
};  
var world;  
var ctx;  
var canvasWidth;  
var canvasHeight;  
var keys = [];  
  
// HTML5 onLoad event  
Event.observe(window, 'load', function() {  
    world = createWorld(); // box2DWorld   
    ctx = $('game').getContext('2d'); // 2  
    var canvasElm = $('game');  
    canvasWidth = parseInt(canvasElm.width);  
    canvasHeight = parseInt(canvasElm.height);  
    initGame(); // 3  
    step(); // 4  
      
// 5  
    window.addEventListener('keydown',handleKeyDown,true);   
    window.addEventListener('keyup',handleKeyUp,true);  
});  

function initGame(){  
    // create 2 big platforms     
    createBox(world, 3, 230, 60, 180, true, 'ground');  
    createBox(world, 560, 360, 50, 50, true, 'ground');  
      
    // create small platforms  
    for (var i = 0; i < 5; i++){  
        createBox(world, 150+(80*i), 360, 5, 40+(i*15), true, 'ground');      
    }  
	
    // create player ball 1
	var ballSd = new b2CircleDef();  
	ballSd.density = 0.1;  
	ballSd.radius = 12;  
	ballSd.restitution = 0.5;  
	ballSd.friction = 1;  
	ballSd.userData = 'player';  
	var ballBd = new b2BodyDef();  
	ballBd.linearDamping = .03;  
	ballBd.allowSleep = false;  
	ballBd.AddShape(ballSd);  
	ballBd.position.Set(20,0);  
	player.object = world.CreateBody(ballBd);  
	
	// create player ball 2
    var ballSd2 = new b2CircleDef();  
    ballSd2.density = 0.1;  
    ballSd2.radius = 12;  
    ballSd2.restitution = 0.5;  
    ballSd2.friction = 1;  
    ballSd2.userData = 'player';  
    var ballBd2 = new b2BodyDef();  
    ballBd2.linearDamping = .03;  
    ballBd2.allowSleep = false;  
    ballBd2.AddShape(ballSd2);  
    ballBd2.position.Set(50,0);  
    player.object2 = world.CreateBody(ballBd2);  
}   
 
function createBox(world, x, y, width, height, fixed, userData) { 
    if (typeof(fixed) == 'undefined') fixed = true;  
    //1  
var boxSd = new b2BoxDef();  
    if (!fixed) boxSd.density = 1.0;  
    //2  
    boxSd.userData = userData;  
    //3  
    boxSd.extents.Set(width, height);  
  
    //4  
    var boxBd = new b2BodyDef();  
    boxBd.AddShape(boxSd);  
    //5  
    boxBd.position.Set(x,y);  
    //6  
    return world.CreateBody(boxBd)  
}  

function step() {  
      
    var stepping = false;  
    var timeStep = 1.0/60;  
    var iteration = 1;  
      
	if (player.object.GetCenterPosition().y > canvasHeight){  
		player.object.SetCenterPosition(new b2Vec2(20,0),0)  
	}     
	else if (player.object.GetCenterPosition().x > canvasWidth-50){  
		showWin();  
		return;   
	} 
	//2222
	if (player.object2.GetCenterPosition().y > canvasHeight){  
		player.object2.SetCenterPosition(new b2Vec2(20,0),0)  
    }     
	else if (player.object2.GetCenterPosition().x > canvasWidth-50){  
		showWin();  
		return;   
	} 
	
	handleInteractions();  
	// 1  
    world.Step(timeStep, iteration);  
    // 2  
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);  
    drawWorld(world, ctx);  
    // 3  
    setTimeout('step()', 10);  
}  

function handleKeyDown(evt){  
    keys[evt.keyCode] = true;  
}  
function handleKeyUp(evt){  
    keys[evt.keyCode] = false;  
}  
  
// disable vertical scrolling from arrows :)  
//document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}  

function handleInteractions(){  
    // up arrow  
    // 1  
    var collision = world.m_contactList;  
    player.canJump = false;  
    if (collision != null){  
        if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){  
            if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){  
                var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());  
                var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());  
                if (playerObj.y < groundObj.y){  
                    player.canJump = true;  
                }  
            }  
        }  
    }  
    // 2  
    var vel = player.object.GetLinearVelocity();  
    // 3  
    if (keys[87]){  //up
        vel.y = -150;     
    }  
	else if(keys[83]){  //down
        vel.y = 150;     
    }  
      
    // 4  
    // left/right arrows  
    if (keys[65]){  
        vel.x = -60;  
    }  
    else if (keys[68]){  
        vel.x = 60;  
    }  
    // 5  
    player.object.SetLinearVelocity(vel);
	
	var vel = player.object.GetLinearVelocity(); 

	// 2  
    var vel2 = player.object2.GetLinearVelocity(); 	
    // 3  
    if (keys[38] || keys[79]){  //up
        vel2.y = -150;     
    }  
	else if(keys[40] || keys[76]){  //down
        vel2.y = 150;     
    }  
      
    // 4  
    // left/right arrows  
    if (keys[37] || keys[75]){  
        vel2.x = -60;  
    }  
    else if (keys[39] || keys[59]){  
        vel2.x = 60;  
    }  
    // 5  
    player.object2.SetLinearVelocity(vel2);
}  

function showWin(){  
    ctx.fillStyle    = '#000';  
    ctx.font         = '30px verdana';  
    ctx.textBaseline = 'top';  
    ctx.fillText('Balls!', 30, 0);  
    ctx.fillText('thank you, andersonferminiano.com', 30, 30);  
    ctx.fillText('@andferminiano', 30, 60);   
}  