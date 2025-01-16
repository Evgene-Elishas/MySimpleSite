import { isRunning, onlystop} from './field_engine.js'; 



let Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => { o[k] = v[i]; return o }, {}));
let Rule = Struct('neighbourhood', 'b', 's', 'isActive');

export let rules;
export let active_rules_count;
export let modify_rule_index;
export let rulesList_ID;

export function initRules(rulesList_id){
	rules = [Rule(Moore_no_borders, [3], [2, 3], true),
			 Rule(Neumann, [2], [1, 2, 3], false),
			 Rule(Moore, [3, 4], [4, 5, 6], false)];
	active_rules_count = 0;
	modify_rule_index = -1;
	rulesList_ID = rulesList_id;
	updateRulesList(rulesList_ID);
}



// добавить передачу isRunning по ссылке
// проверить отработку draggable и размеры создаваемых элементов в мобильной версии
// глобальнось active_rules_count...
export function updateRulesList(rulesList_ID) {
    const rulesList = document.getElementById(rulesList_ID);
    rulesList.innerHTML = '';
    //let active_rules_count = 0;
	active_rules_count = 0;

    rules.forEach((rule, index) => {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';
		ruleItem.draggable = true;
        if (!rule.isActive) ruleItem.classList.add('disabled'); else active_rules_count++;

        ruleItem.innerHTML = `Правило ${index + 1}: ${rule.neighbourhood.name} B${rule.b.join('')}S${rule.s.join('')}
            <div class="button-container">
                <button onclick="editRule(${index})">Редактировать</button>
                <button onclick="toggleRule(${index})">${rule.isActive ? 'Отключить' : 'Включить'}</button>
                <button onclick="deleteRule(${index})">Удалить</button>
            </div>`;
			
        ruleItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            ruleItem.classList.add('dragging');
        });

        ruleItem.addEventListener('dragend', () => {
            ruleItem.classList.remove('dragging');
        });

        ruleItem.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        ruleItem.addEventListener('drop', (e) => {
            e.preventDefault();
            let draggedIndex = e.dataTransfer.getData('text/plain');
            if (draggedIndex !== index) {
                let draggedRule = rules.splice(draggedIndex, 1)[0];
                rules.splice(index, 0, draggedRule);
                updateRulesList(rulesList_ID);
            }
        });
        
        rulesList.appendChild(ruleItem);
    });

	console.log(`Список правил изменён. Активных: ${active_rules_count}`);
	if (!active_rules_count && isRunning){
		onlystop();
		document.getElementById("startstop").innerText = "Старт";
	}
}


// поработать над глобальностью переменной modify_rule_index
// ну и передача всех параметров
export function editRule(index) {
    modify_rule_index = index;
	let rule = rules[index];
	document.getElementById("modal").style.display = "flex";
    document.getElementById("modalNeighbourhood").value = rule.neighbourhood.name;
    document.getElementById("modalB").value = rule.b.join(',');
    document.getElementById("modalS").value = rule.s.join(',');
}
window.editRule = editRule;

export function toggleRule(index) {
    rules[index].isActive = !rules[index].isActive;
    updateRulesList(rulesList_ID);
}
window.toggleRule = toggleRule;
export function deleteRule(index) {
    rules.splice(index, 1);
    updateRulesList(rulesList_ID);
}
window.deleteRule = deleteRule;

// насколько корректно модальное окно будет орабатывать в мобильной версии??
// нужно вообще уточнить в каких версиях (начиная с каких) каких браузеров поддердиваются и корректно работают все команды в моей программе

function Moore(Cells, width, height, x, y){
	let res = 0;
	if (x>0){
		if (y > 0) if (Cells[x-1][y-1]) res++;
		if (Cells[x-1][y]) res++;
		if (Cells[x-1][y+1]) res++;
	}
	if (x<height - 1){
		if (y > 0)if (Cells[x+1][y-1]) res++;
		if (Cells[x+1][y]) res++;
		if (y < width - 1)if (Cells[x+1][y+1]) res++;
	}
	if (y < width - 1)if (Cells[x][y+1]) res++;
	if (y > 0) if (Cells[x][y-1]) res++;
	return res;
}	
window.Moore = Moore;


function Moore_no_borders(Cells, width, height, x, y){
	let res = 0;
	if (Cells[mod(x-1,width)][mod(y-1,height)]) res++;
	if (Cells[mod(x-1,width)][y]) res++;
	if (Cells[mod(x-1,width)][mod(y+1,height)]) res++;
	if (Cells[mod(x+1,width)][mod(y-1,height)]) res++;
	if (Cells[mod(x+1,width)][y]) res++;
	if (Cells[mod(x+1,width)][mod(y+1,height)]) res++;
	if (Cells[x][mod(y+1,height)]) res++;
	if (Cells[x][mod(y-1,height)]) res++;
	return res;
}	
window.Moore_no_borders = Moore_no_borders;

function Neumann(Cells, width, height, x, y){
	let res = 0;
	if (x>0) if (Cells[x-1][y]) res++;
	if (x<height - 1) if (Cells[x+1][y]) res++;
	if (y < width - 1)if (Cells[x][y+1]) res++;
	if (y > 0) if (Cells[x][y-1]) res++;
	return res;
}
window.Neumann = Neumann;


function mod(a,b){
	let res = a%b;
	return (res >= 0)? res : res + b;
}


export function setmodify_rule_index(x) {modify_rule_index = x;}
export function	addRule(neighbourhood, b, s){ 
	rules.push(Rule(window[neighbourhood], b, s,true)); 
}
export function	rewriteRule(index, neighbourhood, b, s){ 
	rules[index] = Rule(window[neighbourhood], b, s,true);
}
