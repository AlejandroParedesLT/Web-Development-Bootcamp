var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickPattern = [];

var started = false;
var levelGame = 0;

$(document).keypress(function() {
    if(!started){
        $('#level-title').text("Level "+levelGame);
        nextSequence();
        started=true;
    }
});

$(".btn").click(function(){

    var userChosenColour =  $(this).attr('id')
    userClickPattern.push(userChosenColour);
    
    playSound(userChosenColour);
    animatePress("#"+userChosenColour,"pressed");

    checkAnswer(userClickPattern.length-1);
});

function checkAnswer(currentLevel){
    if(gamePattern[currentLevel]===userClickPattern[currentLevel]){
        if(userClickPattern.length===gamePattern.length){
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    }else{
        playSound("wrong");
        animatePress("body","game-over");
        $('#level-title').text("Game over, press any key to continue");
        startOver();
    }
}

function nextSequence(){
    userClickPattern=[];
    levelGame++;
    $('#level-title').text("Level "+levelGame);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#"+randomChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

function playSound(name){
    var audio = new Audio("sounds/"+name+".mp3");
    audio.play();
}

function animatePress(currentColor,class_puts) {
    $(currentColor).addClass(class_puts);
    setTimeout(function () {
      $(currentColor).removeClass(class_puts);
    }, 200);
  }

function startOver(){
    levelGame=0;
    gamePattern = [];
    started = false;
}
