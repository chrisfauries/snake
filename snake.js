var gameContainer = document.getElementById("game-container");
var allBlocksArray = [];

//Game Grid
gameGrid(30,30);

function gameGrid(height,width){
	for(i=0; i<height; i++){
		var gameLine = document.createElement("div");
		gameContainer.append(gameLine);
		gameContainer.children[i].classList.add("block-line");
		gameContainer.children[i].setAttribute("id","block-line-" +(i+1));
		for(j=0; j<width; j++){
			var blockLine = document.getElementById("block-line-" +(i+1));
			var gameBlock = document.createElement("div");
			blockLine.append(gameBlock);
			blockLine.children[j].classList.add("game-block");
			blockLine.children[j].setAttribute("id","block-number-" + (((i + 1) *100) + (j + 1)));
            document.getElementById("block-number-" + (((i + 1) *100) + (j + 1))).style.width = (1000 / width) + "px";
            document.getElementById("block-number-" + (((i + 1) *100) + (j + 1))).style.height = (1000 / height) + "px";
            allBlocksArray.push(((i + 1) *100) + (j + 1));
		}
	}
}

//Snake & Apple Start Position and Render

function Snake(lengthArr, currentDirection, bufferedDirection,speedValue) {

	this.lengthArr = lengthArr;

	this.currentDirection = currentDirection;
	this.bufferedDirection = bufferedDirection;
	this.speed;
	this.speedValue = speedValue;

	this.shading = () =>{
    for(i=0; i<this.lengthArr.length;i++){
        snakeSegment = document.getElementById("block-number-" + this.lengthArr[i]);
        snakeSegment.classList.add("snake");
    }
	}

	this.updateSpeed =() => {
    this.speedValue -= .015 * this.speedValue;
    clearInterval(this.speed);
    this.speed = setInterval(this.motion, this.speedValue);
	}

	this.motion = () => {
    this.directionChange();
    if(this.currentDirection == 'right'){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] +1);
        this.checkAndUpdate();
    }
    if(this.currentDirection == 'down'){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] +100);
        this.checkAndUpdate();
    }
    if(this.currentDirection == 'up'){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] -100);
        this.checkAndUpdate();
    }
    if(this.currentDirection == 'left'){
        this.lengthArr.push(this.lengthArr[this.lengthArr.length -1] -1);
        this.checkAndUpdate();
		}
    this.shading();
	}

	this.directionChange = () =>{
			switch(this.currentDirection){
					case 'left':
					case 'right':
							if(this.bufferedDirection === 'up' || this.bufferedDirection === 'down'){
									this.currentDirection = this.bufferedDirection;
									soundChangeDirection.play();
							}
							break;
					case 'up':
					case 'down':
							if(this.bufferedDirection === 'left' || this.bufferedDirection === 'right'){
									this.currentDirection = this.bufferedDirection;
									soundChangeDirection.play();
							}
							break;
			}
	}

	this.checkAndUpdate = () => {
    var testValid = document.getElementById("block-number-" + this.lengthArr[this.lengthArr.length -1]);
        if(testValid == null || testValid.classList.contains("snake")){
            gameOver.call(this);
        }else if(testValid.classList.contains("apple")){
            gameApple.location.classList.remove("apple");
						gameApple.location.classList.add("snake");
            gameApple.reassign();
						soundGrabApple.play();
						soundBackgoundMusic.sound.playbackRate = (soundBackgoundMusic.sound.playbackRate + .005).toFixed(4);
            this.updateSpeed();
            scoreUpdate.call(this);
        }else{
        var snakeSegment = document.getElementById("block-number-" + this.lengthArr[0]);
        snakeSegment.classList.remove("snake");
        this.lengthArr.shift();
        }
	}
}


function Apple(location) {
  this.location = document.getElementById('block-number-' + location);

	this.shade = () => {this.location.classList.add('apple')}

	this.reassign = () => {
    scramble();
    for(i=0; i<allBlocksArray.length;i++){
        var potentialNewApplePosition = document.getElementById("block-number-" + allBlocksArray[i]);
        if(potentialNewApplePosition.classList.contains("snake")){
            continue;
        }else{
            this.location = document.getElementById("block-number-" + allBlocksArray[i]);
            this.location.classList.add("apple");
            break;
        }
    }
		function scramble(){
    allBlocksArray.sort(function(a, b){
        return 0.5 - Math.random()});
		}
	}

}

var gameSnake = new Snake([2210,2211,2212,2213,2214,2215,2216,2217],'right','right', speedScreenSize());
var gameApple = new Apple(2020);

function speedScreenSize () {
	if(window.innerWidth < 1000) {
		return 250;
	} else {
		return 120;
	}
}

gameSnake.shading();

gameApple.shade();

//Key Input and Direction Change
window.addEventListener("keydown", function(e){
    key = e.which;
    switch(key){
        case 37:
            e.preventDefault();
            gameSnake.bufferedDirection = 'left';
            break;
        case 38:
            e.preventDefault();
            gameSnake.bufferedDirection = 'up';
            break;
        case 39:
            e.preventDefault();
            gameSnake.bufferedDirection = 'right';
            break;
        case 40:
            e.preventDefault();
            gameSnake.bufferedDirection = 'down';
            break;
    }
});

//Game Over
function gameOver(){
    clearInterval(this.speed);
		soundDeath.play();
		soundBackgoundMusic.stop();
    var finalScore;
    fetch('https://us-central1-snake-game-1bf7b.cloudfunctions.net/gameOver?userID=' + gameSessionID)
      .then(res => {
        return res.json();
      })
      .then(data =>{
        console.log('Final Score: ', data.score);
        finalScore = data.score;
        alert("Your Score was: " + finalScore + "\n press 'OK' to restart");
        setTimeout(function(){ location.reload(); },1000);
        return;
      });


}


//Points
var points = document.getElementById("points");
var lastTime = timeStamp();

function scoreUpdate(){
    fetch('https://us-central1-snake-game-1bf7b.cloudfunctions.net/scoreUpdate?userID=' + gameSessionID)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        points.innerHTML = data.newScore;
      });
}

function timeStamp(){
    var d = new Date();
    var n = d.getTime();
    return n;
}

var inpInt = document.getElementById("inpInt");
var btnSave = document.getElementById("btnSave");
var userInitials;


// Fetch and Build Leaderboard
fetch('https://us-central1-snake-game-1bf7b.cloudfunctions.net/top15scores')
  .then(res => res.json())
  .then(data => leaderboardBuild(data));

function leaderboardBuild(arr){
    var leaderboard = document.getElementById("leaderboard");
    for(i=0; i< arr.length; i++){
        var columnDiv = document.createElement("div");
        leaderboard.append(columnDiv);
        leaderboard.children[i].setAttribute("id","column-" + (i+1));
        for(j=0; j<arr[i].length; j++){
            var rowSpan = document.createElement("Span");
            var columnSet = document.getElementById("column-" + (i+1));
            columnSet.append(rowSpan);
            columnSet.children[j].setAttribute("id", "span" + (((i+1)*10) + (j+1)));
            var rowSet = document.getElementById("span" + (((i+1)*10) + (j+1)));
            rowSet.innerHTML = arr[i][j];
            rowSet.classList.add("score-block");
        }
    }
}

//Dialog Box Functions
function viewNoStart() {
	document.querySelector('#pop-up-bg').style.display = 'none';
	document.querySelector('#pop-up').style.display = 'none';
}

var gameSessionID;

function startGame() {
	var init = document.querySelector('#inpInt');
	if(init.value.length === 3) {
		document.querySelector('#pop-up-bg').style.animation= 'fadeOut 3s ease forwards';
		document.querySelector('#pop-up').style.display = 'none';
		userInitials = inpInt.value.toUpperCase();
    setTimeout(function(){gameSnake.speed = setInterval(gameSnake.motion, gameSnake.speedValue);},5000);
		countdown();
    fetch('https://us-central1-snake-game-1bf7b.cloudfunctions.net/newGameSession?init=' + userInitials)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        points.innerHTML = data.score;
        gameSessionID = data.userID;
      });
	}
}

function countdown() {
	var countdownTimer = document.querySelector('#countdown');
	countdownTimer.style.display = 'block';
	var count = 3;
	var counter = setInterval(function(){
								if(countdownTimer.innerHTML === 'Begin!') {
									countdownTimer.style.display = 'none';
									soundBackgoundMusic.play();
									clearInterval(counter);
								}else if(countdownTimer.innerHTML === '1') {
									soundCountdown.stop();
									countdownTimer.style.fontSize = '600px'
									countdownTimer.innerHTML = 'Begin!';
									soundCountdown.sound.currentTime = 0;
									soundCountdown.play();
								} else {
									soundCountdown.stop();
									countdownTimer.innerHTML = count;
									soundCountdown.sound.currentTime = 0;
									soundCountdown.play();
									count--;
								}
							}, 1000);
}


//Sound Effects

function Sound(src, loop, volume) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
	this.sound.loop = loop;
	this.sound.volume = volume;
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

var soundChangeDirection = new Sound('sound/changeDirection.wav', false, .3);
var soundGrabApple = new Sound('sound/grabApple.wav', false, .2);
var soundBackgoundMusic = new Sound('sound/background.mp3', true, .1);
var soundDeath = new Sound('sound/death.wav', false, .5);
var soundCountdown = new Sound('sound/countdown.mp3', false, .5);


//Mute Button

function mute() {
	var muteBtn = document.querySelector('#mute img');
	if(muteBtn.getAttribute('state') === 'unmuted') {
		soundChangeDirection.sound.muted = true;
		soundGrabApple.sound.muted = true;
		soundBackgoundMusic.sound.muted = true;
		soundDeath.sound.muted = true;
		soundCountdown.sound.muted = true;
		muteBtn.setAttribute('state', 'muted');
		muteBtn.setAttribute('src', 'img/noSound.png');
	} else {
		soundChangeDirection.sound.muted = false;
		soundGrabApple.sound.muted = false;
		soundBackgoundMusic.sound.muted = false;
		soundDeath.sound.muted = false;
		soundCountdown.sound.muted = false;
		muteBtn.setAttribute('state', 'unmuted');
		muteBtn.setAttribute('src', 'img/sound.png');
	}
}


//MobileControls - this feature doesn't work!!!!
var swipeZone = document;
swipedetect(swipeZone, function(swipedir){
	if(swipedir !== 'none') {
		gameSnake.bufferedDirection = swipedir;
	}
});


// credit: http://www.javascriptkit.com/javatutors/touchevents2.shtml
function swipedetect(el, callback){

    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
//        e.preventDefault()
    }, { passive: false })

    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, { passive: false })

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
//        e.preventDefault()
    }, { passive: false })
}
