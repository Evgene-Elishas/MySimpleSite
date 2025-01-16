//import { ClearField, GenerateField, update, isRunning, Cells, sleep, frequency, initField } from './field_engine.js'; 
import { Cells,isRunning, startstop, frequency, setfrequency, sleep, setsleep, GenerateField, ClearField} from './field_engine.js'; 
import { rulesList_ID, addRule, rewriteRule, active_rules_count, modify_rule_index, setmodify_rule_index, updateRulesList } from './rules.js';
import {  DrawField } from './canvas.js';

export function setupUI(width, height, loop) { 
	// Обработчик для изменения частоты
	document.getElementById("frequency").oninput = function() {
		setfrequency(Number(this.value));
		document.getElementById("frequencyValue").innerText = frequency.toFixed(2); // Обновляем отображение
		//console.log(`Частота появления: ${frequency}`);
	};
	// Обработчик для изменения скорости
	document.getElementById("speed").oninput = function() {
		let speed = Number(this.value)
		setsleep(Math.floor(1000/ speed));
		document.getElementById("speedValue").innerText = speed; // Обновляем отображение
		//console.log(`Скорость симуляции: ${speed} обновлений в секунду`);
	};

	// Обработчик для паузу/воспроизведения симуляции
	document.getElementById("startstop").onclick = function() {
		if (!active_rules_count) return;
		startstop();//isRunning = !isRunning;
		console.log(`${(isRunning)? "Воспроизведение" : "Пауза"}`);
		if (isRunning){
			this.innerText = "Стоп";
			setTimeout(() => window.requestAnimationFrame(loop), sleep);
		}
		else this.innerText = "Старт";
	};


	// Обработчик для генерации поля
	document.getElementById("generate").onclick = function() {
		console.log(`Поле сгенерировано`);
		GenerateField(frequency,width, height);
		DrawField(width, height, Cells);
	};
	// Обработчик для очистки поля
	document.getElementById("clear").onclick = function() {
		console.log(`Поле очищено`);
		ClearField(width, height);
		DrawField(width, height, Cells);
	};

	// Обработчик для открытия модального окна
	document.getElementById("addRule").onclick = function() {
		document.getElementById("modal").style.display = "flex"; // Открытие модального окна
// опционально, возможно уберу в финальной версии
		document.getElementById("modalNeighbourhood").value = "Neumann";
		document.getElementById("modalB").value = "";
		document.getElementById("modalS").value = "";
	};

	// Обработчик для сохранения нового правила
	document.getElementById("saveRule").onclick = function() {
		let neighbourhood = document.getElementById("modalNeighbourhood").value;
		let b =  extractIntegers(document.getElementById("modalB").value)
		let s =  extractIntegers(document.getElementById("modalS").value)
		console.log(`B: [${b}] S: [${s}]`);
		if (neighbourhood && b.length && s.length) {
			console.log(`Добавлено правило: ${neighbourhood} B${b.join('')}S${s.join('')}`);
			if (modify_rule_index < 0) addRule(neighbourhood, b, s);
			else {
				rewriteRule(modify_rule_index, neighbourhood, b, s)
				setmodify_rule_index(-1);
			}

			updateRulesList(rulesList_ID);
			document.getElementById("modal").style.display = "none"; // Закрыть модальное окно
		}
	};


	// Обработчик для закрытия модального окна
	document.getElementById("closeModal").onclick = function() {
		document.getElementById("modal").style.display = "none";
		setmodify_rule_index(-1);
	};

}

function extractIntegers(inputString) {
    let regex = /\b\d+\b/g; // Регулярное выражение для поиска целых чисел (без учета знака)
    let matches = inputString.match(regex); // Находим все совпадения
	let numbersArray = matches ? Array.from(new Set(matches.map(Number))) : [];
    numbersArray.sort((a, b) => a - b); // Сортируем массив по возрастанию
    return numbersArray; // Преобразуем найденные строки в числа и создаем массив
}
