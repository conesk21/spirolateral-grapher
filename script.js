
//directional array is right, up, down, even idexes affect x (the 0th element of the coordinate), odd affect y (the 1st element of the coordinate)
const directArray = [[0,1], [1,1], [0,-1], [1,-1]]
const center = [410,410]

var canvas = document.querySelector('canvas');

function getIterationEnd(array){
    currentPos = [0,0]
    for(let i=0; i<array.length;i++){
        let index = i % 4
        currentPos[directArray[index][0]] += directArray[index][1]*array[i]
    }
    return currentPos
}

function getCenterPoint(array){
    let firstIterEnd = getIterationEnd(array)
    let x = 0 
    let y = 0
        if(array.length %4 ===1){
            x = firstIterEnd[0]-firstIterEnd[1]
            y = firstIterEnd[1]+firstIterEnd[0]
      
        } else if (array.length%4===3){
            x = firstIterEnd[0]+firstIterEnd[1]
            y = firstIterEnd[1]-firstIterEnd[0]
      
        } else if (array.length%4===2){
            x = firstIterEnd[0]
            y = firstIterEnd[1]
        
        } else {
            let extremes = getCorners(array,4)
            x = extremes[0][0] + extremes[1][0]
            y = extremes[0][1] + extremes[1][1]

        }
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

function getBoundingBoxSize(array){
    let height = 0 
    let width = 0
    let extremes = getCorners(array,4)
    width = Math.abs(extremes[0][0]-extremes[1][0])
    height = Math.abs(extremes[0][1]-extremes[1][1])
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

function drawGraph(array){
    var drawer = canvas.getContext("2d")
    drawer.moveTo(center[0],center[1])
    drawer.fillStyle= "rgba(0,0,0,0)"
    let currentPos = center
    for (let j=0; j<getNumberofIterations(array.length);j++){
        for(let i=0; i<array.length;i++){
            let index = (i + j*array.length) % 4
            currentPos[directArray[index][0]] += directArray[index][1]*array[i] *40
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




