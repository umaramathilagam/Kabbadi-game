var player1, player1animation, player2, player2animation,score1,score2;
var rand, gameState, plr1score, plr2score, database,position1, position2, reset;
function preload(){
    player1animation = loadAnimation("assests/player1a.png", "assests/player1b.png","assests/player1a.png");
    player2animation = loadAnimation("assests/player2a.png", "assests/player2b.png","assests/player2a.png");
}

function setup(){
    database = firebase.database();
    createCanvas(800,800);

    //reset = createButton('Reset');
    //reset.position(400, 100);
    player1 = createSprite(200,400,10,10);
    player1.addAnimation("plyer1",player1animation);
    player1.scale = 0.4;
    player2 = createSprite(600,400,10,10);
    player2.addAnimation("plyer2",player2animation);
    player2.scale = 0.4;
    

    player2.rotation = 180;
    var plr1position = database.ref('player1/position');
    plr1position.on("value",readPosition1,showError);

    var plr2position = database.ref('player2/position');
    plr2position.on("value",readPosition2,showError);
    

    gameState = database.ref('gameState/');
    gameState.on("value",readgamestate,showError);

    plr1score = database.ref('player1Score/');
    plr1score.on("value",readplr1score,showError);

    plr2score = database.ref('player2Score/');
    plr2score.on("value",readplr2score,showError);
}

function draw(){

    background(0);

    drawnet();
    drawline1();
    drawline3();
    if(gameState === 0){
        textSize(30);
        fill ("red");
        text ("Press Space to start Toss", 200,100)
        if(keyDown("space")){
            
            
            rand = Math.round(random(1,2));
            if(rand === 1){
                
                database.ref('/').update({
                    'gameState': 1
                })
                alert("RED RIDE");
            }
            if(rand === 2){
                
                database.ref('/').update({
                    'gameState': 2
                })
                alert("YELLOW RIDE");
            }

            database.ref('player1/position').update({
                'x': 200,
                'y': 400
            })
            database.ref('player2/position').update({
                'x': 600,
                'y': 400
            })
        }
    }
    
    
   
    if(gameState === 1){
        
        if(keyDown(LEFT_ARROW)){
            writePositionplayer1(-3,0);
          }
          else if(keyDown(RIGHT_ARROW)){
            writePositionplayer1(3,0);
          }
          else if(keyDown(UP_ARROW)){
            writePositionplayer1(0,-3);
          }
          else if(keyDown(DOWN_ARROW)){
            writePositionplayer1(0,+3);
          }
          else if(keyDown("w")){
            writePositionplayer2(0,-3);
          }
          else if(keyDown("s")){
            writePositionplayer2(0,+3);
          }

          if(player1.x>650){
            database.ref('/').update({
                'player1Score': plr1score - 5,
                'player2Score': plr2score + 5,
                'gameState': 0
            })

            alert("Red wins");
            textSize(30);
            fill ("red");
            text ("Press Space to start Toss", 200,100)
        }
  
        if(player1.isTouching(player2)){
          database.ref('/').update({
              'player1Score': plr1score + 5,
              'player2Score': plr2score - 5,
          })
        }

        //clear();
       // game.play();
      }
      if(gameState === 2){
        
        if(keyDown("w")){
            writePositionplayer2(-3,0);
          }
          else if(keyDown("s")){
            writePositionplayer2(3,0);
          }
          else if(keyDown("a")){
            writePositionplayer2(0,-3);
          }
          else if(keyDown("d")){
            writePositionplayer2(0,+3);
          }
          else if(keyDown(UP_ARROW)){
            writePositionplayer1(0,-3);
          }
          else if(keyDown(DOWN_ARROW)){
            writePositionplayer1(0,+3);
          }

          if(player2.x<150){
            database.ref('/').update({
                'player1Score': plr1score + 5,
                'player2Score': plr2score - 5,
                'gameState': 0
            })
            alert("Yellow wins")
            textSize(30);
            fill ("red");
            text ("Press Space to start Toss", 200,100)
        }
  
        if(player2.isTouching(player1)){
          database.ref('/').update({
              'player1Score': plr1score - 5,
              'player2Score': plr2score + 5,
          })
        }

        //clear();
       // game.play();
      }

      
    drawSprites();
}

function writePositionplayer1(x,y){
    database.ref('player1/position').set({
      'x': position1.x + x ,
      'y': position1.y + y
    })
  }

  function writePositionplayer2(x,y){
    database.ref('player2/position').set({
      'x': position2.x + x ,
      'y': position2.y + y
    })
  }

  function readPosition1(data){
     position1 = data.val();
    console.log(position1.x);
    player1.x = position1.x;
    player1.y = position1.y;
  }

  function readPosition2(data){
     position2 = data.val();
    console.log(position2.x);
    player2.x = position2.x;
    player2.y = position2.y;
  }

  function readgamestate(data){
    var state = data.val();
    //console.log(position.x);
    gameState = state;
  }

  function readplr1score(data){
       score1 = data.val();
      plr1score = score1;
  }
  function readplr2score(data){
     score2 = data.val();
    plr2score = score2;
}
  
  function showError(){
    console.log("Error in writing to the database");
  }

  function drawnet(){
      for(var i = 0 ; i <800; i = i+20){
          stroke ("white");
          line(400, i, 400, i+10);
      }
  }

  function drawline1(){
    for(var i = 0 ; i <800; i = i+20){
        stroke ("red");
        line(650, i, 650, i+10);
    }
}

function drawline3(){
    for(var i = 0 ; i <800; i = i+20){
        stroke ("yellow");
        line(150, i, 150, i+10);
    }
}