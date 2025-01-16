import { SwitchCond} from './field_engine.js'; 



// TODO: докинуть всем изменяемым параметрам максиму, минумум, дефодтное значчене В КОДЕ, с передачей в html
// TODO: при отрисовке очень маленьких клеток могут возникнуть проблемы
function div(val, by) {return Math.floor(val / by); }




let Position = function (X, Y) {
    this.X = X;
    this.Y = Y;
};
Position.prototype.equals = function(other) {
    return this.X === other.X && this.Y === other.Y;
};

let canvas;
let ctx;

let MinCellSize;
let MaxCellSize;
let CellSize;
let OffsetX; 
let OffsetY;
	
let LastMousePos, LastCellPos;
let LeftButtonDown = false;
let RightButtonDown = false;
// TODO: добавить возможность менять цвета
let live_color = '#4CAF50'; // "black"
let dead_color = '#B0BEC5'; // "white"

let border_color = "lightgray";

// TODO: добавить возможность изменить чувствительность
let scale = 1.1; // ScalePerWheelSector - WheelSensetivity

// TODO: учесть canvas.style.borderWidth (или сделать нудевым а сам канвас вложить в другой элемент, который будет иметь границы)
// TODO: добавить обработку изменения размера окна
/*function resizeCanvas() {
    canvas = document.getElementById('cnv');
    ctx = canvas.getContext('2d');
    let w = canvas.clientWidth; // Ширина в пикселях // window.innerWidth; 
    let h = canvas.clientHeight; // Высота в пикселях // window.innerHeight
	console.log(`canvas.width: ${w}, canvas.height: ${h}`);
	MinCellSize = Math.min(div(w, width), div(h, height));
	canvas.width = width * MinCellSize; // Устанавливаем ширину canvas
	canvas.height = height * MinCellSize;
	MaxCellSize = Math.min(canvas.width, canvas.height);
	CellSize = MinCellSize; //ZoomLevel
	console.log(CellSize);
    //DrawField(width, height, Cells); // Обновляем отрисовку
}
//window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); */


// ПОХОДУ ЕСЛИ В СТИЛЯХ ОТНОСИТЕЛЬНЫЕ РАЗМЕРЫ, ТО ТАКИМ СПОСОБОМ МЕНЯТЬ РАЗМЕРЫ БЕСПОЛЕЗНО

export function initCanvas(width, height, Cells, canvas_id) {
    canvas = document.getElementById(canvas_id);
	console.log(`canvas.width: ${canvas.clientWidth}, canvas.height: ${canvas.clientHeight}`);
    ctx = canvas.getContext("2d");
	MinCellSize = Math.min(div(canvas.clientWidth, width), div(canvas.clientHeight, height));
	canvas.width = width * MinCellSize; // Устанавливаем ширину canvas
	canvas.height = height * MinCellSize;
	console.log(`canvas.width: ${canvas.width}, canvas.height: ${canvas.height}`);
	MaxCellSize = Math.min(canvas.width, canvas.height);
	CellSize = MinCellSize; //ZoomLevel
	console.log(CellSize);
	OffsetX = 0;
	OffsetY = 0;
	
	LastMousePos, LastCellPos;
	LeftButtonDown = false;
	RightButtonDown = false;
	
/////////////////////////////////////////////////////////////////////////////////////////////
// TODO: а оно вообще срабатывает???
	/*canvas.addEventListener('click', (event) => {
		if (event.button === 0) {
			console.log('Клик левой');
			SwitchCond(MousePosToCellPos(GetMousePos(event)), width, height);
			DrawField(width, height, Cells);
		} else if (event.button === 2) {
			console.log('Клик правой');
// TODO: обработать контекстное меню
		}
	});*/

// отработка возможность перехода на другую вкладку, окно (обнуляем перемещения и нажатия мыши) //
	canvas.addEventListener('mouseenter', (event) => {
		LastMousePos = GetMousePos(event);
		//console.log('Мышь вошла в пределы элемента canvas');
	});

	canvas.addEventListener('mouseleave', (event) => {
		//console.log('Мышь покинула пределы элемента canvas');
		LeftButtonDown = false;
		RightButtonDown = false;
	});

	/*window.addEventListener('blur', (event) => {
		console.log('Элемент потерял фокус');
		LeftButtonDown = false;
		RightButtonDown = false;
	});*/

// TODO: проверить работает ли
	/*document.addEventListener('blur', (event) => {
		console.log('Элемент потерял фокус');
		LeftButtonDown = false;
		RightButtonDown = false;
	});*/

	/*document.addEventListener('visibilitychange', (event) => {
		if (document.visibilityState === 'visible') {
			console.log('Страница стала видимой');
		} else {
			console.log('Страница стала скрытой');
			LeftButtonDown = false;
			RightButtonDown = false;
		}
	});*/
/////////////////////////////////////////////////////////////////////////////////////////////
	canvas.addEventListener('mousedown', (event) => {
		LastMousePos = GetMousePos(event);
		//console.log(LastMousePos);
		if (event.button === 0) {
			LeftButtonDown = true;
			LastCellPos =  MousePosToCellPos(LastMousePos);
			SwitchCond(LastCellPos, width, height);
			DrawField(width, height, Cells);
			//console.log('Левая кнопка мыши зажата');
		} else if (event.button === 2) {
			RightButtonDown = true;
			//console.log('Правая кнопка мыши зажата');
		}
	});

	canvas.addEventListener('mouseup', (event) => {
	//document.addEventListener('mouseup', (event) => {
		if (event.button === 0) {
			//console.log('Левая кнопка мыши отпущена');
			LeftButtonDown = false;
		} else if (event.button === 2) {
			//console.log('Правая кнопка мыши отпущена');
			RightButtonDown = false;
		}
	});
	
	canvas.addEventListener('contextmenu', (event) => {
		event.preventDefault();
	});
/////////////////////////////////////////////////////////////////////////////////
	canvas.addEventListener('mousemove', (event) => {
		let CurrentMousePos = GetMousePos(event);
		
		if (LeftButtonDown === true){
			//console.log('Мышь сдвинута при надатой левой');
			let CurrentCellPos = MousePosToCellPos(CurrentMousePos);
			//if (!(CurrentCellPos === LastCellPos)){
			if (CurrentCellPos.X != LastCellPos.X || CurrentCellPos.Y != LastCellPos.Y){
				//console.log('Мышь сдвинута на другую клетку');
				LastCellPos = CurrentCellPos;
				SwitchCond(CurrentCellPos, width, height);
				DrawField(width, height, Cells);
			}
		}
		
		if (RightButtonDown === true){	
			OffsetX -= CurrentMousePos.X - LastMousePos.X;
			OffsetY -= CurrentMousePos.Y - LastMousePos.Y;
			OffsetX = minmax(0, OffsetX, width *CellSize - canvas.width );
			OffsetY = minmax(0, OffsetY, height*CellSize - canvas.height);
			DrawField(width, height, Cells);
		}
		
		LastMousePos = CurrentMousePos;
	});

	// Обработчик для колесика мыши
	canvas.addEventListener('wheel', (event) =>  {
		event.preventDefault();
		
		LastMousePos = GetMousePos(event);
		//LastCellPos =  MousePosToCellPos(LastMousePos);
		//console.log(`Изначальная клетка: ${LastCellPos.X}, ${LastCellPos.Y}`);
		
		//let ds = (event.deltaY > 0) ? -1 : 1;
		//let newCellSize = minmax(MinCellSize, CellSize + ds, MaxCellSize);
		let ds = (event.deltaY > 0) ? 1/1.4 : 1.4;
		let newCellSize = minmax(MinCellSize, Math.floor(CellSize*ds), MaxCellSize);
		OffsetX = Math.floor((OffsetX+LastMousePos.X)*newCellSize/CellSize) - LastMousePos.X;
		OffsetY = Math.floor((OffsetY+LastMousePos.Y)*newCellSize/CellSize) - LastMousePos.Y;
		CellSize = newCellSize;
		OffsetX = minmax(0, OffsetX, width *CellSize - canvas.width );
		OffsetY = minmax(0, OffsetY, height*CellSize - canvas.height);
		
		//LastCellPos =  MousePosToCellPos(LastMousePos);
		//console.log(`Изначальная клетка: ${LastCellPos.X}, ${LastCellPos.Y}`);
		DrawField(width, height, Cells);
	});
/////////////////////////////////////////////////////////////////////////////////////////

}

function MousePosToCellPos(MousePos){
	let x = Math.floor((MousePos.X + OffsetX) / CellSize);
	let y = Math.floor((MousePos.Y + OffsetY) / CellSize);
	//console.log(new Position(x,y));
	return new Position(x,y);
}

function CanvasPosToCellPos(canvasX,canvasY){
	let x = Math.floor((canvasX + OffsetX) / CellSize);
	let y = Math.floor((canvasY + OffsetY) / CellSize);
	return {X:x,Y:y};
}


function GetMousePos(event){
	let rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width; // Масштаб по X
    const scaleY = canvas.height / rect.height; // Масштаб по Y
	let x = (event.clientX - rect.left) * scaleX;
	let y = (event.clientY - rect.top) * scaleY;
	//console.log(new Position(x,y));
	return new Position(x,y);
}

function hexToRgb(hex) {
    // Удаляем символ '#' если он есть
    hex = hex.replace(/^#/, '');

    // Преобразуем в RGB
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255; // Получаем красный компонент
    let g = (bigint >> 8) & 255;  // Получаем зеленый компонент
    let b = bigint & 255;         // Получаем синий компонент

    return [r, g, b, 0]; // Возвращаем массив из трех чисел
}

// TODO: да, я просто отрисовываю всё поле, без оптимизаций на видимую область. не надо так
export function DrawField(width, height, Cells) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	let img = ctx.createImageData(canvas.width, canvas.height);
	let imgData = img.data;
	for (let canvasX = 0; canvasX < canvas.width; canvasX++) {
        for (let canvasY = 0; canvasY < canvas.height; canvasY++) {
			let AAA = CanvasPosToCellPos(canvasX,canvasY);
			let x = AAA.X, y = AAA.Y;
			//console.log(`x: ${x}, y: ${y}`);
			if (x >= 0 && x < width && y >= 0 && y < height){
				let index = (canvasY * canvas.width + canvasX) * 4;
				let Color = hexToRgb(Cells[x][y] ? live_color : dead_color);
				//console.log(Color);
				//imgData.data.splice(index, 4, ...Color);
				imgData[index] = Color[0];     // Red
				imgData[index + 1] = Color[1]; // Green
				imgData[index + 2] = Color[2]; // Blue
				imgData[index + 3] = 255;       // Alpha (полностью непрозрачный)
			}
        }
    }

	//console.log(`11img.data: ${imgData.length}`);
	ctx.putImageData(img, 0, 0);
}

function minmax(a,x,b){ return Math.min(Math.max(x, a), b); }
