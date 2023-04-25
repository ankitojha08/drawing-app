let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tools = document.querySelectorAll(".tool");
let fillColor = document.querySelector("#fill-color");
let sizeSlider = document.getElementById('size-slider');
let colorBtns = document.querySelectorAll('.colors .option');
let colorPicker = document.querySelector('#color-picker');
let clearCanvas = document.querySelector(".clear-canvas");
let undo = document.querySelector('#undoBtn'),
    redo = document.querySelector('#redoBtn');

let tool = 'brush',
    painting = false,
    prevMouseY, prevMouseX,
    snapshot, currColour = "black",
    brushWidth = 5,
    selectedColor = "#000";

let undoArray = [];
let redoArray = [];

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});


const drawBrush = (e) => {
    ctx.strokeStyle = tool === "eraser" ? "#fff" : selectedColor;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = brushWidth;
    ctx.stroke();
}

const drawRect = (e) => {
    if (!fillColor.checked)
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.pow(Math.pow((e.offsetX - prevMouseX), 2) + Math.pow((e.offsetY - prevMouseY), 2), 0.5);
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTri = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    // ctx.lineTo(prevMouseX, prevMouseY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const draw = (e) => {

    if (!painting) return;
    ctx.putImageData(snapshot, 0, 0);
    switch (tool) {
        case "eraser":
            drawBrush(e);
            break;
        case "rectangle":
            drawRect(e);
            break;
        case "triangle":
            drawTri(e);
            break;
        case "circle":
            drawCircle(e);
            break;
        default:
            drawBrush(e);
    }


}

const beginPaint = (e) => {
    painting = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.fillStyle = selectedColor;
    ctx.strokeStyle = selectedColor;
    ctx.beginPath();
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const stopPaint = () => {
    painting = false;
    ctx.beginPath();
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", beginPaint);
canvas.addEventListener("mouseup", stopPaint);

//selecting tools
tools.forEach(btn => {
    btn.addEventListener("click", () => {
        tool = btn.id;
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add("active");
    })
})

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add("selected");

        selectedColor = btn.getAttribute("value");
    })
})

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    selectedColor = colorPicker.value;
})


const saveState = () => {
    let state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoArray.push(state);
}
canvas.addEventListener("mouseup", saveState);

undo.addEventListener("click", () => {
    let currState = undoArray[undoArray.length - 1];
    undoArray.pop();
    redoArray.push(currState);
    if (undoArray.length > 0) {
        ctx.putImageData(undoArray[undoArray.length - 1], 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBackground();
    }
});

redo.addEventListener("click", () => {
    if (redoArray.length === 0) return;
    let currState = redoArray.pop();
    undoArray.push(currState);
    ctx.putImageData(currState, 0, 0);
});



sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);