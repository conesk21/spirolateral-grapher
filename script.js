
//directional array is right, up, down, even idexes affect x (the 0th element of the coordinate), odd affect y (the 1st element of the coordinate)
const directArray = [[0,1], [1,1], [0,-1], [1,-1]]
const nextArray = [1,2,3,0]
const center = [410,410]

var canvas = document.querySelector('canvas');


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


