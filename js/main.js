import { initCanvas, DrawField } from './canvas.js';
import { ClearField, GenerateField, game_step, isRunning, Cells, sleep, frequency, initField } from './field_engine.js'; // Убедитесь, что initField импортируется
import { initRules, updateRulesList } from './rules.js';
import { setupUI } from './ui.js';
//import { saveState, loadState } from './storage.js';
//import { updateRulesList, toggleRule, deleteRule, editRule, addRule } from './rules.js';

let width = 90;
let height = 50;


export function loop() {
    if (!isRunning) return;
	//console.log(`Петля`);
	game_step(width, height);
	DrawField(width, height, Cells);
    setTimeout(() => window.requestAnimationFrame(loop), sleep);
}



window.onload = function() {
    initRules("rulesList");
    initField(width, height); // Теперь это должно работать
    initCanvas(width, height, Cells, "cnv");
    DrawField(width, height, Cells);
    setupUI(width, height, loop, "rulesList");
};
