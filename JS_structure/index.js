const image_urls = ["Dice-1.png", "Dice-2.png", "Dice-3.png", "Dice-4.png", "Dice-5.png", "Dice-6.png"];
const file_pointer = "Images/"

var randomNumber1 = Math.floor(Math.random() * 5);
document.querySelector("#dice1").setAttribute("src",file_pointer+image_urls[randomNumber1]);
var randomNumber2 = Math.floor(Math.random() * 5);
document.querySelector("#dice2").setAttribute("src",file_pointer+image_urls[randomNumber2]);
if(randomNumber2>randomNumber1){
    document.querySelector("#principal_tittle").textContent = "Player 2 wins"
}else if(randomNumber2<randomNumber1){
    document.querySelector("#principal_tittle").textContent = "Player 1 wins"
}else{
    document.querySelector("#principal_tittle").textContent = "Draw"
}

//if(document.){
//}