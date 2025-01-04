function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function docheck(){
  if(document.getElementById("comment").style.color=="lightblue" || document.getElementById("comment").style.color=="lightgreen"){
    document.getElementById("comment").innerHTML = "";
    document.getElementById("input").value = "";
    start(lastmultiples);
  }
  else check(event.target.value);
}
document.getElementById("Stunden").onclick = ()=>{start(60)};
document.getElementById("Halbe").onclick = ()=>{start(30)};
document.getElementById("Viertel").onclick = ()=>{start(15)};
document.getElementById("Minuten").onclick = ()=>{start(1)};
document.getElementById("check").onclick = ()=>{docheck()};
document.getElementById("update").onclick = update;
document.getElementById("print").onclick = printit;
//prvents the page from scrolling when the input field is focused
document.getElementById("input").addEventListener("focus", function(event) {
  event.target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth", preventScroll: true });
});

document.getElementById("input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    docheck(); 
  }
});

document.getElementById("input").addEventListener("blur", function(event) {
    docheck();
});

var hours=1;
var minutes=1;

function check(input){
    try{
      let time = hours * 60 + minutes;
      let match=input.match(/(\d+)(:|\s+)(\d+)/);
      let inputtime = parseInt(match[1]%12) * 60 + parseInt(match[3]);

      if(inputtime == time) {
          document.getElementById("comment").innerHTML = "Richtig!";
          if(document.getElementById("comment").style.color=="pink") 
            document.getElementById("comment").style.color="lightblue";
          else
            document.getElementById("comment").style.color="lightgreen";
             
      } else {
          document.getElementById("comment").innerHTML = "Falsch!"; 
          document.getElementById("comment").style.color="pink";//lightblue
      }
    }catch(e){  
      document.getElementById("comment").innerHTML = "Format: 12:34";
      document.getElementById("comment").style.color="pink";//lightblue
    }
}

addEventListener("DOMContentLoaded", (event) => {document.getElementById("Minuten").click()});

function printit(){
    window.print();
}
function update(){
    navigator.serviceWorker.getRegistration().then(function(reg) {
    if (reg) {
      reg.unregister().then(function() { window.location.reload(true); });
    } else {
       window.location.reload(true);
    }
  });
}

function drawHand(ctx, hours,minutes){
  let hourangle = (hours % 12) * 30 + minutes / 2-90;
  let minuteangle = minutes * 6-90;

  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.moveTo(400, 400);
  ctx.lineTo(400 + 250 * Math.cos(hourangle * Math.PI / 180), 400 + 250 * Math.sin(hourangle * Math.PI / 180));
  //arrow at the end of the hour hand
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth=5;
  ctx.moveTo(400, 400);
  ctx.lineTo(400 + 350 * Math.cos(minuteangle * Math.PI / 180), 400 + 350 * Math.sin(minuteangle * Math.PI / 180));
  ctx.stroke();
}
let lastmultiples=1;
function start(multiples){
  lastmultiples=multiples;
   document.getElementById("comment").style.color="black";
    //setup a canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 800;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    //draw the clock
    ctx.beginPath();
    ctx.arc(400, 400, 390, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, 400, 0, 2 * Math.PI);
    ctx.stroke();
    //5 minute marks
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(400 + 380 * Math.cos(i * Math.PI / 6), 400 + 380 * Math.sin(i * Math.PI / 6), 10, 0, 2 * Math.PI);
        ctx.fill();
    }
    //1 minute marks
    for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(400 + 380 * Math.cos(i * Math.PI / 30), 400 + 380 * Math.sin(i * Math.PI / 30), 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    //put the numbers on the clock align them with the 5 minute marks
    //care needs to be taken to align the two digit numbers differently
    //to the one digit numbers
    ctx.font = "60px Arial";
    //draw test circle through numbers
    //ctx.beginPath();
    //ctx.arc(400, 400, 300, 0, 2 * Math.PI);
    //ctx.stroke();

    for (let i = 1; i <= 12; i++) {
       //get text width and height
        let text = ctx.measureText(i);
        let textwidth = text.width;
        let textheight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;

        //draw the text
        if (i < 7) {
            ctx.fillText(i, 400 + 300 * Math.cos((i - 3) * Math.PI / 6) - textwidth / 2, 400 + 300 * Math.sin((i - 3) * Math.PI / 6) + textheight / 2);
        } else if(i<10){
            ctx.fillText(i, 400 + 300 * Math.cos((i - 3) * Math.PI / 6) - textwidth/2, 400 + 300 * Math.sin((i - 3) * Math.PI / 6) + textheight / 2);
        }else {
            ctx.fillText(i, 400 + 300 * Math.cos((i - 3) * Math.PI / 6) - textwidth/2, 400 + 300 * Math.sin((i - 3) * Math.PI / 6) + textheight / 2);
        }
      }
    //draw the hands
    //let date = new Date();
    //random time
    hours = Math.floor(Math.random() * 12);
    minutes = Math.floor(Math.random() * 60);
    switch(multiples){
      case 60:
        minutes =0;
        break;
      case 30:
        minutes = Math.floor(minutes/30)*30;
        break;
      case 15:
        minutes = Math.floor(minutes/15)*15;
        break;
      case 1:
        break;
      default:
        break;
    }
    drawHand(ctx, hours, minutes);
}