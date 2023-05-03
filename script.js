

/*the directional array is right, up, left, down
even idexes affect x (the 0th element of the coordinate),
odd affect y (the 1st element of the coordinate)*/
const directArray = [[0,1], [1,1], [0,-1], [1,-1]]
/* because the canvas coordinates are not the same as cartesian, 
the directions have to be altered to appear on the canvas correctly*/
const canDirectArray = [[0,1], [1,-1], [0,-1], [1,1]]
const canvas = document.querySelector("#upperCanvas");
const drawer = canvas.getContext("2d")
const grid = document.querySelector("#lowerCanvas")
const gridDrawer = grid.getContext("2d")
const center = [canvas.width/2,canvas.height/2]
// the percentage of canvas space that each graph takes up
const visualSize = .7
var valArray = [1,2,3]
var scalar = getScaleFactor(valArray)
var axisColor = "#000000"
var gridColor = "#6A6C6E"
var backgroundColor = "#FFFFFF"



function getCenterPoint(array){
    let x = 0 
    let y = 0
    let extremes = getCorners(array,4)
    x = extremes[0][0] + extremes[1][0]
    y = extremes[0][1] + extremes[1][1]
    return [x/2, y/2]
    }


function getCorners(array,iterations){
    let topCorner = [0,0]
    let bottomCorner = [0,0]
    let currentPos=[0,0]
    for (let j = 0; j<iterations;j++){
        for(let i=0; i<array.length;i++){
            let index = (i +j*array.length)% 4
            currentPos[directArray[index][0]] += directArray[index][1]*array[i]

            if (currentPos[0] > topCorner[0]){
                topCorner[0] = currentPos[0]
            }
            if (currentPos[1] > topCorner[1]){
                topCorner[1] = currentPos[1]
            }
            if (currentPos[0] < bottomCorner[0]){
                bottomCorner[0] = currentPos[0]
            }
            if (currentPos[1] < bottomCorner[1]){
                bottomCorner[1] = currentPos[1]
            }
        }
    }
    return [bottomCorner,topCorner]

}

function getBoundingBoxSize(extremes){
    let width = Math.abs(extremes[0][0]-extremes[1][0])
    let height = Math.abs(extremes[0][1]-extremes[1][1])
    return Math.max(width,height)
}

function getScaleFactor(array){
    return (Math.min(canvas.height,canvas.width)*visualSize)/getBoundingBoxSize(getCorners(array,4))
}

function getNumberofIterations(number){
    if (number%4===2){
        return 2
    } else {
        return 4 
    }
}

function getValArray(string){
    cleanString = string.replace("/\s/g", '')
    valueArray = cleanString.split(',')
    valueArray = valueArray.map((x)=> parseInt(x))
    return valueArray
}

function drawGraph(newOrigin, array,scaleFactor){
   
    drawer.lineCap = "square"
    drawer.translate(center[0],center[1])
    let currentPos = newOrigin
     drawer.beginPath()
     drawer.moveTo(currentPos[0],currentPos[1])
    for (let j=0; j<getNumberofIterations(array.length);j++){
        for(let i=0; i<array.length;i++){
            let index = (i + j*array.length) % 4
            currentPos[canDirectArray[index][0]] += canDirectArray[index][1]*array[i] *scaleFactor
            drawer.lineTo(currentPos[0],currentPos[1])
            drawer.stroke()
        }

    }

}

function drawAxis(origin){
    gridDrawer.strokeStyle = axisColor
    gridDrawer.beginPath()
    gridDrawer.moveTo(0,origin[1]+center[1])
    gridDrawer.lineTo(canvas.height,origin[1]+center[1])
    gridDrawer.moveTo(origin[0]+center[0],0)
    gridDrawer.lineTo(origin[0]+center[0],canvas.width)
    gridDrawer.stroke()
    gridDrawer.closePath()
}

function drawGrid(origin,boxSize){
    
    gridDrawer.beginPath();

    for (x = origin[0]+center[0]; x <= canvas.width+center[0]; x += boxSize) {
        gridDrawer.moveTo(x, 0);
        gridDrawer.lineTo(x, canvas.height);
    }

    for (x = origin[0]+center[0]; x >= 0; x -= boxSize) {
        gridDrawer.moveTo(x, 0);
        gridDrawer.lineTo(x, canvas.height);
    }

    for (y = origin[1]+center[1]; y <= canvas.height+center[1]; y += boxSize) {
        gridDrawer.moveTo(0, y);
        gridDrawer.lineTo(canvas.width, y);
    }
    for (y = origin[1]+center[1]; y >= 0; y -= boxSize) {
        gridDrawer.moveTo(0, y);
        gridDrawer.lineTo(canvas.width, y);
    }

  gridDrawer.strokeStyle = gridColor
  gridDrawer.stroke();
  gridDrawer.closePath();
}

function handleGraph(){
    drawer.setTransform(1, 0, 0, 1, 0, 0);
    drawer.clearRect(0, 0, canvas.width, canvas.height);
    gridDrawer.setTransform(1, 0, 0, 1, 0, 0);
    gridDrawer.clearRect(0, 0, canvas.width, canvas.height);
    let valString = document.getElementById("value-string").value;
    valArray = getValArray(valString)
    scalar = getScaleFactor(valArray)
    let graphCenter = getCenterPoint(valArray)
    let translatedOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    drawAxis(translatedOrigin)
    drawGrid(translatedOrigin,scalar)
    drawGraph(translatedOrigin,valArray,scalar)
}

drawGrid([0,0],10)

const intitButton = document.querySelector("#init")
intitButton.addEventListener('click', handleGraph)

var collapsableButtons = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < collapsableButtons.length; i++) {
  collapsableButtons[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

