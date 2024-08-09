var position = 2;
var nextNumber;
var toCom = [];
var nexToCom =[];
var nexToComFall =[];
var toFall = [];
generateNumber();
var ready = true;
var score = 0;
var colorList = [
    [[40, 70, 75],[147, 22, 33]],
    [[21, 21, 21],[166, 61, 64]],
    [[54, 33, 62],[72, 169, 166]],
    [[82, 65, 76],[108, 154, 139]],
    [[27, 6, 94],[255, 71, 218]],
    [[234, 99, 140],[255, 217, 218]],
    [[132, 0, 50],[0, 38, 66]],
    [[86, 54, 53],[82, 170, 94]],
    [[222, 13, 146],[39, 40, 56]],
    [[239, 118, 122],[35, 240, 199]]
];
var rand = Math.floor(Math.random()*colorList.length);
updateNext()

$("html").on( "keyup", function(event) {
    nextPosition(event.which);
} );
$("html").on( "mouseup" , function(event) {
    if($(".next").offset().left< event.pageX&&$(".next").offset().left+100> event.pageX){
    nextPosition(3);}
} );

function nextPosition(which){
    //console.log(which);
    switch(which){
        case 68:
            if(position!=4)
                pressRight()
            break;
        case 39:
            if(position!=4)
                pressRight()
            break;
        case 65:
            if(position != 0)
                pressLeft(); 
            break;
        case 37:
            if(position != 0)
                pressLeft();
            break;
        case 83:
            drop();
            break;
        case 40:
            drop();
            break;
        case 3:
            drop();
            break;
        case 13:
            drop();
            break;
    }
}
$(document).mousemove(async function(event){
    var blockwidth = 105;
    if ($(window).width() < 600) {
        blockwidth = 75;
     }

    position = (Math.floor((event.pageX - $(".gameArea").offset().left)/blockwidth))
    if (position<0)position= 0;
    if(position>4)position=4;
    updateNext();

    /*if($(".next").offset().left+105< event.pageX &&position!=4){
    document.querySelectorAll(".held div")[position].classList.add("right");
    }
    if($(".next").offset().left-5> event.pageX &&position!=0){
    document.querySelectorAll(".held div")[position].classList.add("right");
    }*/
  });
function scoreCalcAdd(numb){
    if(numb===0)return;
    var sscore = 1;
    for(var i = 1; i<numb; i++){
        sscore *= 2;
    }
    scoreAdd(sscore);
}
function scoreAdd(amount){
    score += amount;
    var mag = (45* amount)/(amount+80);
    var ranDegree = (Math.random()*2*mag)-mag;
    $(".scoreDiv div").removeClass("boom")
    setTimeout(function () {
        document.querySelectorAll(".scoreDiv div")[0].classList.add("boom");
        $(".scoreDiv").css("transform",`rotate(${ranDegree}deg)`);
        $(".score").html(score);
        setTimeout(function () {
        $(".scoreDiv div").removeClass("boom")
        }, 1000);

    }, 15);

    //animation: aniBoom 0.3s cubic-bezier(0.41, 0.91, 0.01, 0.91) forwards;
}
function drop(){

    for(var i=6; i>=0; i--){
        if(document.querySelectorAll(".gameArea div")[i*5 + position].classList.contains("block"))
            continue;
        if (ready=== false)return;
        ready = false;
        updateNext()
        $(".held div").css("opacity", "0%");
        $(".held div").removeClass("new");
        document.querySelectorAll(".gameArea div")[i*5 + position].innerHTML = nextNumber;
        updateBlock(i*5 + position);
        document.querySelectorAll(".gameArea div")[i*5 + position].classList.add("drop")
        setTimeout(function () {
            $(".gameArea div").removeClass("drop");
    
        }, 200);
        toCom.push(i*5 + position)
        position = 2;
        generateNumber();

        comPhase();
        $(".held div").removeClass("next right left");
        $(".held div").css( "background-color", "" );

        break;
        
    }
}

function newNext(){
    console.log("  #  ")
    ready= true;
    updateNext()
    for(var i = 0; i<5;i++){
    document.querySelectorAll(".held div")[i].classList.add("new")
    }
    setTimeout(function () {
        $(".held div").removeClass("new");

    }, 300);
    $(".held div").css("opacity", "100%");

}

function comPhase() {

    if(toCom.length === 0){
        newNext()
        return;
    }
    while (toCom.length > 0) {
        const pose = toCom.pop(); 
        if(toCom.includes(pose))continue;
        if(document.querySelectorAll(".gameArea div")[pose].innerHTML=== "")continue;
        const val = recCom(pose, [])-1;
        if(val ==="fail")continue;
        console.log("--"+ pose +" - "+ document.querySelectorAll(".gameArea div")[pose].innerHTML)
        //console.log("val: "+ val);
        setTimeout(function () {
            for(var i = 0; i<val;i++){
                document.querySelectorAll(".gameArea div")[pose].innerHTML++
                console.log("~~"+ pose +" - "+ document.querySelectorAll(".gameArea div")[pose].innerHTML)
                updateBlock(pose)
                if(val>0){        
                    scoreCalcAdd(document.querySelectorAll(".gameArea div")[pose].innerHTML)
                    nexToCom.push(pose)

                }     
            }    
        }, 200);
           

    }

    setTimeout(function () {

    fallPhase();}, 320)
}



function fallPhase(){
    toFall.sort(function(a, b){return b - a});

    while(toFall.length>0) {
        fall(toFall.pop())
    };
    toCom = toCom.concat(nexToCom.reverse(),nexToComFall.reverse());
    nexToCom = [];
    nexToComFall = [];
    if(toCom.length===0){
        newNext();
        return;}
    setTimeout(function () {
        comPhase();}, 100)
}
function fall(pos){
    for(var i = pos; i>4; i -= 5){
        document.querySelectorAll(".gameArea div")[i].innerHTML=document.querySelectorAll(".gameArea div")[i-5].innerHTML;
        updateBlock(i);
        document.querySelectorAll(".gameArea div")[i].classList.add("drop")
        setTimeout(function () {
            $(".gameArea div").removeClass("drop");
    
        }, 200);
        nexToComFall.push(i);

    }
    document.querySelectorAll(".gameArea div")[i].innerHTML="";
    updateBlock(i);
}

function combine(pos){
    if(document.querySelectorAll(".gameArea div")[pos].innerHTML==="")return;
    if(toCom.findIndex((element) => element == pos)>-1)return;
    var value = document.querySelectorAll(".gameArea div")[pos].innerHTML;
    if(pos%5!=4&&value===document.querySelectorAll(".gameArea div")[pos+1].innerHTML){
        combineElectricBoogaloo(pos, pos+1, "cLeft")
    }
    if(pos%5!=0&&value===document.querySelectorAll(".gameArea div")[pos-1].innerHTML){
        combineElectricBoogaloo(pos, pos-1, "cRight")
    }
    if(pos<30&&value===document.querySelectorAll(".gameArea div")[pos+5].innerHTML){
        combineElectricBoogaloo(pos, pos+5, "cUp")
    }
    if(pos>4&&value===document.querySelectorAll(".gameArea div")[pos-5].innerHTML){
        combineElectricBoogaloo(pos, pos-5, "cDown")
    }
    setTimeout(function () {
        if(value<Math.floor(document.querySelectorAll(".gameArea div")[pos].innerHTML))
        scoreCalcAdd(Math.floor(document.querySelectorAll(".gameArea div")[pos].innerHTML)-1 );
    }, 300)
}

function recCom(pos, doneList){
    console.log("pos: "+ pos)
    var value = document.querySelectorAll(".gameArea div")[pos].innerHTML;
    if(toCom.findIndex((element) => element == pos)>-1){
        //console.log("oj")
        return "fail";}
    var worth = 1;

    doneList.push(pos)
    if(pos%5!=4&&!doneList.includes(pos+1)&&value===document.querySelectorAll(".gameArea div")[pos+1].innerHTML){
        const ans = recCom(pos+1, doneList);
        if (ans === "fail")return "fail";
        worth += ans;
        recComElectricBoogaloo(pos+1, "cLeft")
    }
    if(pos%5!=0&&!doneList.includes(pos-1)&&value===document.querySelectorAll(".gameArea div")[pos-1].innerHTML){
        const ans = recCom(pos-1, doneList);
        if (ans === "fail")return "fail";
        worth += ans;
        recComElectricBoogaloo(pos-1, "cRight")

    }
    if(pos<30&&!doneList.includes(pos+5)&&value===document.querySelectorAll(".gameArea div")[pos+5].innerHTML){
        const ans = recCom(pos+5, doneList);
        if (ans === "fail")return "fail";
        worth += ans;
        recComElectricBoogaloo(pos+5, "cUp")

    }
    if(pos>4&&!doneList.includes(pos-5)&&value===document.querySelectorAll(".gameArea div")[pos-5].innerHTML){
        const ans = recCom(pos-5, doneList);
        if (ans === "fail")return "fail";
        worth += ans;
        recComElectricBoogaloo(pos-5, "cDown")
    }
    return worth;
}
function recComElectricBoogaloo(pos2, cDirection){
    setTimeout(function () {
        document.querySelectorAll(".gameArea div")[pos2].classList.add(cDirection);
        setTimeout(function () {
            document.querySelectorAll(".gameArea div")[pos2].innerHTML= "";
            document.querySelectorAll(".gameArea div")[pos2].classList.remove(cDirection);
            updateBlock(pos2);
            toFall.push(pos2);
            return;
        }, 150);
    }, 150);
}

function combineElectricBoogaloo(pos, pos2, cDirection){
    if(toCom.findIndex((element) => element == pos2)>-1){
        var val =  document.querySelectorAll(".gameArea div")[pos].innerHTML;
        setTimeout(function () {
            console.log("a: "+ (Math.floor(document.querySelectorAll(".gameArea div")[pos].innerHTML) - Math.floor(val)))
            for(var i = 0; i<Math.floor(Math.floor(document.querySelectorAll(".gameArea div")[pos].innerHTML) - Math.floor(val)); i++){
            document.querySelectorAll(".gameArea div")[pos2].innerHTML ++  ;}
        }, 155);
        return;
    }
    nexToCom.push(pos);
    setTimeout(function () {
        document.querySelectorAll(".gameArea div")[pos].innerHTML++;
        document.querySelectorAll(".gameArea div")[pos2].classList.add(cDirection);
        updateBlock(pos)
        setTimeout(function () {
            document.querySelectorAll(".gameArea div")[pos2].innerHTML= "";
            document.querySelectorAll(".gameArea div")[pos2].classList.remove(cDirection);
            updateBlock(pos2);
            toFall.push(pos2);
            return;
        }, 150);
    }, 150);
}

function updateBlock(pos){
    document.querySelectorAll(".gameArea div")[pos].classList.remove("block");
    document.querySelectorAll(".gameArea div")[pos].style.backgroundColor = "";
    if(document.querySelectorAll(".gameArea div")[pos].innerHTML>0||false){
            document.querySelectorAll(".gameArea div")[pos].classList.add("block");
        document.querySelectorAll(".gameArea div")[pos].style.backgroundColor = makeColor(document.querySelectorAll(".gameArea div")[pos].innerHTML);

    }
    return;
}
function makeColor(value){
    var w2 = 1;
    for(var i = 1; i<value; i++){
        w2*=0.82;
    }
    var w1 = 1- w2;

    var color1 = colorList[rand][0]
    var color2 = colorList[rand][1]
    

    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];

    return 'rgb('+rgb.join()+')'
    //return "rgb(" + Math.floor(r1+(r2-r1)*x )+ "," + Math.floor(g1+(g2-g1)*x )+ "," + Math.floor(b1+(b2-b1)*x)+")";
}
function updateNext(){
    $(".held div").removeClass("next right left");
    document.querySelectorAll(".held div")[position].classList.add("next");
    $(".held div").css( "background-color", "" );
    $(".next").css( "background-color", makeColor(nextNumber) );
    $(".held div").html(nextNumber);
}

function pressLeft(){
    position--;
    updateNext();
    if(!document.querySelectorAll(".held div")[position].classList.contains("new"))
    document.querySelectorAll(".held div")[position].classList.add("left");
}
function pressRight(){
    position++;
    updateNext();
    if(!document.querySelectorAll(".held div")[position].classList.contains("new"))
    document.querySelectorAll(".held div")[position].classList.add("right");

}

var posi = 80
var id = null;
function myMoveLeft() {
    var id = null;
  posi = 80;
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (posi == 0) {
      clearInterval(id);
    } else {
      posi--;
      $( ".held" ).css("padding-right", Math.pow(3,pos/25))
    }
  }
}
function myMoveRight() {
    var id = null;
    posi = 80;
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (posi == 0) {
      clearInterval(id);
    } else {
      posi--;
      $( ".held" ).css("padding-left", Math.pow(3,pos/25))
    }
  }
}


function generateNumber(){
    var number = 1;
    while(number<100){
        if(Math.floor(Math.random()*2)){
            nextNumber = number;
            return;
        }
        number++;
    }
}