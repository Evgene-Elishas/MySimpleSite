import { rules } from './rules.js';
export let isRunning;
export let Cells; // Экспортируем переменную
let CellsNextStep;
export let sleep;
export let frequency;


export function initField(width, height){
	isRunning = false
	Cells = []; // Инициализация переменной
	CellsNextStep = [];
	
	for (let x = 0; x < width; x++) {
		Cells.push([]);
		CellsNextStep.push([]);
	}
	sleep = Math.floor(1000/ Number(document.getElementById("speed").value)); // Период обновления, мс
	frequency = Number(document.getElementById("frequency").value); // Частота генерации
	//console.log(sleep);
	//console.log(frequency);
		
	ClearField(width, height);
}

// Функция для очистки поля
export function GenerateField(frequency,width, height){
	for (let x = 0; x < width; x++) 
		for (let y = 0; y < height; y++) 
			Cells[x][y] = CellsNextStep[x][y] =  Math.random() < frequency;
}
export function ClearField(width, height) {
    for (let x = 0; x < width; x++) 
		for (let y = 0; y < height; y++) 
			Cells[x][y] = CellsNextStep[x][y] =  0;
};

/*function FunctionInjector(existingFunction) {
	return function(...args) {
		// Вызов существующей функции с передачей локальных переменных
		return existingFunction.apply(this, args);
	};
}*/

/*export function game_step(width, height) {
	if (typeof game_step.counter === 'undefined') game_step.counter = -1;
	do { game_step.counter = (game_step.counter + 1) % rules.length; } while (!rules[game_step.counter].isActive);
	let rule = rules[game_step.counter];
	
    for (let x = 0; x < width; x++) 
        for (let y = 0; y < height; y++) 
            CellsNextStep[x][y] = (Cells[x][y] ? rule.s : rule.b).includes(rule.neighbourhood(Cells, width, height, x,y));
	
	[Cells, CellsNextStep] = [CellsNextStep, Cells];
}*/ // новая версия вроде исправляет проблему что из canvas массив не меняется

export function game_step(width, height) {
	if (typeof game_step.counter === 'undefined') game_step.counter = -1;
	do { game_step.counter = (game_step.counter + 1) % rules.length; } while (!rules[game_step.counter].isActive);
	let rule = rules[game_step.counter];
	
    for (let x = 0; x < width; x++) 
        for (let y = 0; y < height; y++) 
            CellsNextStep[x][y] = (Cells[x][y] ? rule.s : rule.b).includes(rule.neighbourhood(Cells, width, height, x,y));
	for (let x = 0; x < width; x++) 
        for (let y = 0; y < height; y++)
			Cells[x][y] = CellsNextStep[x][y];
}

export function SwitchCond(CellPos, width, height){
	let x = CellPos.X;
	let y = CellPos.Y;
	//console.log(`SwitchCond: ${x}, ${y}`);
	if (x >= 0 && x < width && y >= 0 && y < height) { // Проверяем, что координаты находятся в пределах поля
		Cells[x][y] = !Cells[x][y]; // Переключаем состояние ячейки
	}
}


export function startstop() { isRunning = !isRunning; }
export function onlystop() { isRunning = false; }
export function setfrequency(x) {frequency = x;}
export function setsleep(x) {sleep = x;}
