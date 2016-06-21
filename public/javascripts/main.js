var navHome, boardSize, menuIcon, sideNav, docBody, navGame, navInstructions, gameContainer, instructionsContainer,landingContainer;
menuIcon = document.getElementById('menu-icon');
sideNav = document.getElementById('side-nav');
docBody = document.getElementsByTagName('body');
navGame = document.getElementById('nav-game');
navHome = document.getElementById('nav-home');
navInstructions= document.getElementById('nav-instructions');
gameContainer = document.getElementById('game');
instructionsContainer= document.getElementById('instructions');
landingContainer= document.getElementById('landing');
boardSize = { x: 4, y:1};

menuIcon.addEventListener('click',function(e){
  e.preventDefault();
  if( sideNav.classList.contains('inactive')){
    sideNav.classList.remove('inactive');
    sideNav.classList.add('active');
  }else{
    sideNav.classList.add('inactive');
    sideNav.classList.remove('active');
  }
});

navInstructions.addEventListener('click',function(e){
  e.preventDefault();
  if( instructionsContainer.classList.contains('hidden')){
    document.querySelector('div.container.active').classList.add('hidden');
    document.querySelector('div.container.active').classList.remove('active');
    instructions.classList.add('active');
    instructions.classList.remove('hidden');
  }
});
navHome.addEventListener('click',function(e){
  e.preventDefault();
  if( landingContainer.classList.contains('hidden')){
    document.querySelector('div.container.active').classList.add('hidden');
    document.querySelector('div.container.active').classList.remove('active');
    landingContainer.classList.add('active');
    landingContainer.classList.remove('hidden');
  }
});
navGame.addEventListener('click',function(e){
  e.preventDefault();
  if( gameContainer.classList.contains('hidden')){
    document.querySelector('div.container.active').classList.add('hidden');
    document.querySelector('div.container.active').classList.remove('active');
    gameContainer.classList.add('active');
    gameContainer.classList.remove('hidden');
  }
});

function shuffle(arr) {
    var j, x, i;
    for (i = arr.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
  return arr
}

function init(){
 var cards = document.querySelectorAll('.card');
 var arrCards= Array.prototype.slice.call(cards, 0);
 var cardVals= ['a','a','b','b'];
 var v = shuffle(cardVals);
 for(i=0; i< cards; i++){
   arrCards[i] = v[i];
 cards[i].addEventListener('click',function(e){
     e.preventDefault();
     console.log(this);
     // cards[i].addClass('active');

   })
 }

}
init();

