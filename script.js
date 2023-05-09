

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
var center = [canvas.width/2,canvas.height/2]
const timer = ms => new Promise(res => setTimeout(res, ms))
// the percentage of canvas space that each graph takes up
var visualSize = .7
var valArray = [1,2,3]
var scalar = getScaleFactor(valArray)
var newOrigin = [1,2]
var colorSetting = "entire"
var graphColorArray = ["#000000"]
var graphColor = "#000000"
var graphWeight = 3
var graphPoints = true
var pointWeight = 2
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
var hasBeenClicked = false 




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

function getNumberofIterations(array){
    let disc = isClosed(array)
    if (disc>0){
        return disc
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

function isClosed(array){
    if (array.length% 4 === 2){
        return 2
    } else if (array.length%2==1){
        return 4 
    } else {
        let currentPos = [0,0]
            for(let i=0; i<array.length;i++){
                let index = i% 4
                currentPos[directArray[index][0]] += directArray[index][1]*array[i]
            }

        if (currentPos[0] === 0 & currentPos[1] ===0){
            return 1
        }
        return -1
        }
       

    }
function updateColorArray(){
    let colorArray = document.querySelectorAll(".color-array")
    let newColors = []
    for (let i=0; i<colorArray.length;i++){
        newColors[i] = colorArray[i].value
    }
    graphColorArray = newColors
}

function updateColorHolder(number){
    while(colorHolder.children.length > number){
        colorHolder.removeChild(colorHolder.lastElementChild)
    }
    while(colorHolder.children.length < number){
        let newColor = document.createElement('input')
        newColor.setAttribute("type","color")
        newColor.setAttribute("class","color-array")
        newColor.setAttribute("id",colorHolder.children.length.toString())
        colorHolder.appendChild(newColor)
    }
    
    updateColorArray()
}

function updateColorButtons(){
    const colorButtons = document.querySelectorAll(".color-array")
    colorButtons.forEach((item)=>{
        item.addEventListener('input', (event)=>{
            graphColorArray[parseInt(event.target.id)] = event.target.value
            handleGraph()
        
        })
    })

}

async function drawGraph(iterations){
    drawer.translate(center[0],center[1])
    let currentPos = newOrigin 
    if (colorSetting === "entire"){
        graphColor = graphColorArray[0]
    }
    for (let j=0; j<iterations;j++){
        if (colorSetting === "iteration"){
            graphColor = graphColorArray[j]
        }
        for(let i=0; i<valArray.length;i++){
            if (colorSetting=== "segment"){
                graphColor = graphColorArray[i]
            }
            if (graphPoints){
                drawer.beginPath()
                drawer.arc(currentPos[0],currentPos[1], pointWeight, 0, 2 * Math.PI);
                drawer.lineWidth = pointWeight
                drawer.strokeStyle = graphColor
                drawer.fillStyle = graphColor
                
                drawer.closePath()
                drawer.stroke()
                drawer.fill()
            }
            drawer.beginPath() 
            drawer.lineCap = "round"
            drawer.moveTo(currentPos[0],currentPos[1])
            let index = (i + j*valArray.length) % 4
            currentPos[canDirectArray[index][0]] += canDirectArray[index][1]*valArray[i] *scalar
            drawer.lineTo(currentPos[0],currentPos[1])
            drawer.strokeStyle = graphColor
            drawer.lineWidth = graphWeight
            drawer.closePath()
            drawer.stroke()
            
            
            if (animate){
                await timer(500);
            }
        }
        

    }
    if (graphPoints){
        drawer.beginPath()
        drawer.arc(currentPos[0],currentPos[1], pointWeight, 0, 2 * Math.PI);
        drawer.lineWidth = pointWeight
        drawer.strokeStyle = graphColor
        drawer.fillStyle = graphColor
        
        drawer.closePath()
        drawer.stroke()
        drawer.fill()
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
    center = [canvas.width/2,canvas.height/2]
    let valString = document.getElementById("value-string").value
    valArray = getValArray(valString)
    scalar = getScaleFactor(valArray)
    let graphCenter = getCenterPoint(valArray)
    iterations = getNumberofIterations(valArray)
    handleAttributes(graphCenter)
    newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
    if (colorSetting === "entire"){
       
        updateColorHolder(1)
        updateColorButtons()
        
    } else if(colorSetting === "iteration"){
        updateColorHolder(iterations)
        updateColorButtons()
    } else {
        updateColorHolder(valArray.length)
        updateColorButtons()
    }
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

function handleAttributes(center){
    let disc = isClosed(valArray)
    let valCopy = document.getElementById("val-copy")
    let closure = document.getElementById("closure")
    let boundingBox = document.getElementById("bb")
    let centerDisplay = document.getElementById("cent")
    
    valCopy.textContent= valArray.toString();
    if (disc >0){
        let size = getBoundingBoxSize(getCorners(valArray,iterations))
        boundingBox.textContent = size.toString() + " by " + size.toString()
        centerDisplay.textContent = "( " + center[0].toString() + " , " + center[1].toString() + " )"
        if (disc === 1){
            closure.textContent = "unexpectedly closed after " + disc.toString() + " iteration"
        } else {
            closure.textContent = "closed after " + disc.toString() + " iterations"
        }
    } else {
        closure.textContent = "unclosed"
        boundingBox.textContent = "nonexistant (infinitely large)"
        centerDisplay.textContent = "undetermined"
    }

}




function handleSave(){
    let downloadLink = document.createElement('a');
	downloadLink.setAttribute('download', valArray.toString()+'.png');
    var ctx1 = grid.getContext("2d");
    var ctx2 = canvas.getContext("2d");
    if(showBackground){
        ctx1.globalCompositeOperation = 'destination-over'
        ctx1.fillStyle = backgroundColor;
        ctx1.fillRect(0, 0, canvas.width, canvas.height);
        ctx1.globalCompositeOperation = 'source-over'
    }
    ctx1.drawImage(canvas, 0, 0);
    grid.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    })
    handleLower()
}

const input = document.getElementById("value-string")
input.addEventListener('input', (e) => {
    const isValid = e.target.checkValidity();
    intitButton.disabled = !isValid
  });

  input.addEventListener('change', (e) => {
    const isValid = e.target.reportValidity();
    e.target.setAttribute('aria-invalid', !isValid);
    intitButton.disabled = !isValid
  });

// init button 
const intitButton = document.querySelector("#init")
intitButton.addEventListener('click', handleInput)
document.addEventListener('keypress', (event)=>{
    if (event.key === "Enter") {
    const isValid = input.reportValidity();
    if(isValid){
        if (!hasBeenClicked){
            var disabledButtons = document.querySelectorAll(".dbc")
            disabledButtons.forEach((item)=>{
                item.disabled = false
            })
            hasBeenClicked = true
        }
     handleInput()
    }
}
});


// disables buttons before initial click 
var disabledButtons = document.querySelectorAll(".dbc")
            disabledButtons.forEach((item)=>{
                item.disabled = true
            })

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
const colorHolder = document.getElementById('color-holder')

const entireGraph = document.getElementById("color-graph")
entireGraph.addEventListener('click', (event)=>{
    colorSetting = "entire"
    updateColorHolder(1)
    updateColorButtons()
    entireGraph.classList.add("selected")
    byIteration.classList.remove("selected")
    bySegment.classList.remove("selected")
    handleGraph()

})

const byIteration = document.getElementById('color-iteration')
byIteration.addEventListener('click', (event)=>{
    colorSetting = "iteration"
    let numElements = getNumberofIterations(valArray)
    updateColorHolder(numElements)
    updateColorButtons()
    entireGraph.classList.remove("selected")
    byIteration.classList.add("selected")
    bySegment.classList.remove("selected")
    handleGraph()

})

const bySegment = document.getElementById('color-segment')
bySegment.addEventListener('click', (event)=>{
    colorSetting = "segment"
    updateColorHolder(valArray.length)
    updateColorButtons()
    entireGraph.classList.remove("selected")
    byIteration.classList.remove("selected")
    bySegment.classList.add("selected")
    handleGraph()
})





// buttons and functions for graph  weight and size 

const graphRange = document.querySelector("#graph-weight");
graphRange.addEventListener("input", (event)=>{
    graphWeight = event.target.value
    handleGraph()
    
    
}, false)



const graphSize = document.querySelector("#visual-size");
graphSize.addEventListener("input", (event)=>{
    visualSize = event.target.value/100
        scalar = getScaleFactor(valArray)
        let graphCenter = getCenterPoint(valArray)
        newOrigin = [-(graphCenter[0]*scalar), (graphCenter[1]*scalar)]
        handleLower()
        handleGraph()
    
    
}, false)

const buttonPoints = document.querySelector('#points')
buttonPoints.addEventListener("click", ()=>{
    graphPoints = !graphPoints
    if(graphPoints){
        buttonPoints.classList.remove("button-off")
    } else {
        buttonPoints.classList.add("button-off")
    }
    pointsRange.disabled = !pointsRange.disabled
    handleGraph()
})

const pointsRange = document.querySelector('#point-weight')
pointsRange.addEventListener('input',(event)=>{
    pointWeight = event.target.value
    handleGraph()
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

const saveImageButton = document.getElementById("img")
saveImageButton.addEventListener('click', handleSave)