

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
const timer = ms => new Promise(res => setTimeout(res, ms))
// the percentage of canvas space that each graph takes up
var visualSize = .7
var valArray = [1,2,3]
var scalar = getScaleFactor(valArray)
var newOrigin = [1,2]
var graphColor = "#000000"
var graphWeight = 2
var showAxis = true 
var axisColor = "#000000"
var axisWeight = 1
var showGrid = true
var gridColor = "#6A6C6E"
var gridWeight = 1
var showBackground = false
var backgroundColor = "#FFFFFF"
var animate = false
var iterations = getNumberofIterations(valArray)




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

async function drawGraph(iterations){
    drawer.translate(center[0],center[1])
    let currentPos = newOrigin 
    for (let j=0; j<iterations;j++){
        for(let i=0; i<valArray.length;i++){
            drawer.beginPath()
            drawer.moveTo(currentPos[0],currentPos[1])
            let index = (i + j*valArray.length) % 4
            currentPos[canDirectArray[index][0]] += canDirectArray[index][1]*valArray[i] *scalar
            drawer.lineTo(currentPos[0],currentPos[1])
            drawer.strokeStyle = graphColor
            drawer.lineWidth = graphWeight
            drawer.lineCap = "round";
            drawer.closePath()
            drawer.stroke()
            if (animate){
                await timer(500);
            }
        }

    }

}



function drawAxis(){
    gridDrawer.strokeStyle = axisColor
    gridDrawer.lineWidth = axisWeight
    gridDrawer.beginPath()
    gridDrawer.moveTo(0,newOrigin[1]+center[1])
    gridDrawer.lineTo(canvas.height,newOrigin[1]+center[1])
    gridDrawer.moveTo(newOrigin[0]+center[0],0)
    gridDrawer.lineTo(newOrigin[0]+center[0],canvas.width)
    gridDrawer.stroke()
    gridDrawer.closePath()
}

function drawGrid(){
    
    gridDrawer.beginPath();

    for (x = newOrigin[0]+center[0]; x <= canvas.width+center[0]; x += scalar) {
        gridDrawer.moveTo(x, 0);
        gridDrawer.lineTo(x, canvas.height);
    }

    for (x = newOrigin[0]+center[0]; x >= 0; x -= scalar) {
        gridDrawer.moveTo(x, 0);
        gridDrawer.lineTo(x, canvas.height);
    }

    for (y = newOrigin[1]+center[1]; y <= canvas.height+center[1]; y += scalar) {
        gridDrawer.moveTo(0, y);
        gridDrawer.lineTo(canvas.width, y);
    }
    for (y = newOrigin[1]+center[1]; y >= 0; y -= scalar) {
        gridDrawer.moveTo(0, y);
        gridDrawer.lineTo(canvas.width, y);
    }

  gridDrawer.strokeStyle = gridColor
  gridDrawer.lineWidth = gridWeight
  gridDrawer.stroke();
  gridDrawer.closePath();
}

function handleGraph(){
    let graphCenter = getCenterPoint(valArray)
    newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    drawer.setTransform(1, 0, 0, 1, 0, 0);
    drawer.clearRect(0, 0, canvas.width, canvas.height);
    drawGraph(iterations)

    
}
 function handleLower(){
    gridDrawer.setTransform(1, 0, 0, 1, 0, 0);
    gridDrawer.clearRect(0, 0, canvas.width, canvas.height);
    if (showGrid){
        drawGrid() 
     }
     if(showAxis){
      drawAxis()   
     }
 }

 function handleInput(){
    let valString = document.getElementById("value-string").value;
    valArray = getValArray(valString)
    scalar = getScaleFactor(valArray)
    let graphCenter = getCenterPoint(valArray)
    newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    handleLower()
    handleGraph()

 }

function handleBackground(){
    if (showBackground){
        grid.style.backgroundColor=backgroundColor
        
    } else{
        grid.style.removeProperty('background-color')
        
    }
}

// init button 
const intitButton = document.querySelector("#init")
intitButton.addEventListener('click', handleInput)

// colapsable settings buttons 
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

// buttons and functions for graph color weight and size 
const graphPicker = document.querySelector("#graph-color");
graphPicker.addEventListener("input", (event)=>{
    graphColor = event.target.value;
    if(animate){
        animate = false
        handleGraph()
        animate = true
    } else {
        handleGraph()
    }
}, false)
graphPicker.addEventListener("change", (event)=>{
    graphColor = event.target.value;
    if(animate){
        handleGraph()
    }
})
const graphRange = document.querySelector("#graph-weight");
graphRange.addEventListener("input", (event)=>{
    graphWeight = event.target.value
    if(animate){
        animate = false
        handleGraph()
        animate = true 
    } else {
        handleGraph()
    }
    
}, false)
graphRange.addEventListener("change", (event)=>{
    graphWeight = event.target.value
    if (animate){
        handleGraph()
    }
}, false)

graphRange.addEventListener

const graphSize = document.querySelector("#visual-size");
graphSize.addEventListener("input", (event)=>{
    visualSize = event.target.value/100
        scalar = getScaleFactor(valArray)
        let graphCenter = getCenterPoint(valArray)
        newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    if (animate){
        animate = false 
        handleLower()
        handleGraph()
        animate = true
    } else {
        handleLower()
        handleGraph()
    }
    
}, false)

graphSize.addEventListener("change", (event)=>{
    visualSize = event.target.value/100
    scalar = getScaleFactor(valArray)
    let graphCenter = getCenterPoint(valArray)
    newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    if (animate){
        handleLower()
        handleGraph()
    }
})

// buttons and functions for axis, grid and background

const axisPicker=document.querySelector("#axis-color")
const axisRange=document.querySelector("#axis-weight")

const buttonAxis = document.querySelector('#axis')
buttonAxis.addEventListener("click", ()=>{
    showAxis = !showAxis
    if(showAxis){
        buttonAxis.classList.remove("button-off")
    } else {
        buttonAxis.classList.add("button-off")
    }
    axisPicker.disabled = !axisPicker.disabled
    axisRange.disabled = !axisRange.disabled
    handleLower()
})

axisPicker.addEventListener('input',(event)=>{
    axisColor = event.target.value;
    handleLower()
})

axisRange.addEventListener('input',(event)=>{
    axisWeight = event.target.value
    handleLower()
})


const gridPicker=document.querySelector("#grid-color")
const gridRange=document.querySelector("#grid-weight")

const buttonGrid = document.querySelector('#grid')
buttonGrid.addEventListener("click", ()=>{
    showGrid = !showGrid
    if(showGrid){
        buttonGrid.classList.remove("button-off")
    } else {
        buttonGrid.classList.add("button-off")
    }
    gridPicker.disabled = !gridPicker.disabled
    gridRange.disabled = !gridRange.disabled
    handleLower()
})

gridPicker.addEventListener('input',(event)=>{
    gridColor = event.target.value;
    handleLower()
})

gridRange.addEventListener('input',(event)=>{
    gridWeight = event.target.value
    handleLower()
})

const backgroundPicker=document.querySelector("#background-color")

const buttonBackground = document.querySelector('#background')
buttonBackground.addEventListener("click", ()=>{
    showBackground = !showBackground
    if(showBackground){
        buttonBackground.classList.remove("button-off")
    } else {
        buttonBackground.classList.add("button-off")
    }
    backgroundPicker.disabled = !backgroundPicker.disabled
    
    handleBackground()
})

backgroundPicker.addEventListener('input',(event)=>{
    backgroundColor = event.target.value;
    handleBackground()
})

// buttons and functions for draw + animations 

const iterationDraw = document.querySelector('#draw-one')
iterationDraw.addEventListener('click', ()=>{
    animate = false 
    iterations = 1
    iterationDraw.classList.add("selected")
    iteratioinAnimate.classList.remove("selected")
    drawAll.classList.remove("selected")
    animateAll.classList.remove("selected")
    let graphCenter = getCenterPoint(valArray)
    newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    handleGraph()
})

const iteratioinAnimate = document.querySelector('#animate-one')
iteratioinAnimate.addEventListener('click',()=>{
    animate = true 
    iterations = 1
    iterationDraw.classList.remove("selected")
    iteratioinAnimate.classList.add("selected")
    drawAll.classList.remove("selected")
    animateAll.classList.remove("selected")
    let graphCenter = getCenterPoint(valArray)
    newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    handleGraph()
})
const drawAll = document.querySelector('#draw-all')
drawAll.addEventListener('click',()=>{
    animate = false
    iterations = getNumberofIterations(valArray)
    iterationDraw.classList.remove("selected")
    iteratioinAnimate.classList.remove("selected")
    drawAll.classList.add("selected")
    animateAll.classList.remove("selected")
    handleGraph()
})
const animateAll = document.querySelector('#animate-all')
animateAll.addEventListener('click',()=>{
    animate = true
    iterations = getNumberofIterations(valArray)
    iterationDraw.classList.remove("selected")
    iteratioinAnimate.classList.remove("selected")
    drawAll.classList.remove("selected")
    animateAll.classList.add("selected")
    handleGraph()
})