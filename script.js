

//directional array is right, up, down, even idexes affect x (the 0th element of the coordinate), odd affect y (the 1st element of the coordinate)
const directArray = [[0,1], [1,1], [0,-1], [1,-1]]
const canDirectArray = [[0,1], [1,-1], [0,-1], [1,1]]
const center = [380,380]
const canvas = document.querySelector("#upperCanvas");
const grid = document.querySelector("#lowerCanvas")

function getIterationEnd(array){
    currentPos = [0,0]
    for(let i=0; i<array.length;i++){
        let index = i % 4
        currentPos[directArray[index][0]] += directArray[index][1]*array[i]
    }
    return currentPos
}

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

function drawGraph(array,scaleFactor){
    var drawer = canvas.getContext("2d")
    drawer.lineCap = "square"
    drawer.translate(center[0],center[1])
    let graphCenter = getCenterPoint(array)
    let currentPos = [-(graphCenter[0]*scaleFactor), (graphCenter[1]*scaleFactor)]
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

function handleGraph(){
    let valString = document.getElementById("value-string").value;
    valArray = getValArray(valString)
    drawGraph(valArray)
}


let test = grid.getContext("2d")
test.moveTo(0,380)
test.lineTo(760,380)
test.moveTo(380,0)
test.lineTo(380,760)
test.stroke()

drawGraph([1,3,2,4,5],40)

