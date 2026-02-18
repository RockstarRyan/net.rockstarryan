var main = document.getElementById('app-container');

function createGame() {
	if (typeof(Storage) !== undefined) {
		if (!(localStorage.themeNumber==1 || localStorage.themeNumber==2)) {localStorage.themeNumber = 2;}
		changeSetting('theme',localStorage.themeNumber,false);
		if (!(localStorage.sounds=='true' || localStorage.sounds=='false')) {localStorage.sounds = true;}
		if (!(localStorage.logVisibility=='flex' || localStorage.logVisibility=='none')) {localStorage.logVisibility = 'flex';}
	} else {
		document.write('Your browser does not support HTML5 Web Storage.');
	}

	var game_cont = document.createElement("SECTION");
	game_cont.className = 'game-container';
	var game = document.createElement("SECTION"); {
		game.id = 'game-yahtzee';
		game.className = 'game';
		for (var num = 1; num <= 5; num++) {
			var die_cont = document.createElement("DIV");
				die_cont.className = 'die-container';
				die_cont.innerHTML = "<div id='die-"+num+"' class='die die-blank enabled' onclick='disableDie(\"die-"+num+"\")'></div><input id='die-"+num+"-box' class='die-checkbox' name='die-"+num+"-box' type='checkbox' disabled='true' onclick='disableDie(\"die-"+num+"\")'>";
			game.appendChild(die_cont);
		}
	}
	game_cont.appendChild(game);
	for (var num = 1; num <= 2; num++) {
		var id = 'upper'; if (num == 2) {id = 'lower';}
		var table = document.createElement("TABLE");
		table.className = 'table table-hcol table-frow';
		table.id = 'table-'+id;
		var caption = document.createElement("CAPTION"); {
			var title = id.substring(0,1).toUpperCase()+id.substring(1);
			caption.innerHTML = title+' House';
		}
		table.appendChild(caption);
		var thead = document.createElement("THEAD"); {
			var tr = document.createElement("TR");
			tr.innerHTML += '<th>Category</th>';
			tr.innerHTML += '<th>Score</th>';
			tr.innerHTML += '<th>Use?</th>';
			thead.appendChild(tr);
		}
		table.appendChild(thead);
		var tbody = document.createElement("TBODY"); {
			var count = 6; if (num == 2) {count = 7;}
			for (var row = 1; row <= count; row++) {
				var tr = document.createElement("TR");
				if (num == 1) {
					switch (row) {
						case 1: tr.innerHTML += '<td>Ones</td>'; break;
						case 2: tr.innerHTML += '<td>Twos</td>'; break;
						case 3: tr.innerHTML += '<td>Threes</td>'; break;
						case 4: tr.innerHTML += '<td>Fours</td>'; break;
						case 5: tr.innerHTML += '<td>Fives</td>'; break;
						case 6: tr.innerHTML += '<td>Sixes</td>'; break;
					}
					tr.innerHTML += "<td id='upper-"+row+"s' class='table-scorecell enabled'></td>";
					tr.innerHTML += "<td class='table-cb-upper not-selected'><input id='"+id+"-"+row+"s-box' class='table-checkbox' type='checkbox' disabled='true' onclick='saveRoll(\""+id+"-"+row+"s\")'></td>";
				} else {
					var sub;
					switch (row) {
						case 1: tr.innerHTML += "<td>Three of a Kind</td>"; sub = 3; break;
						case 2: tr.innerHTML += "<td>Four of a Kind</td>"; sub = 4; break;
						case 3: tr.innerHTML += "<td>Full House</td>"; sub = 'fh'; break;
						case 4: tr.innerHTML += "<td>Small Straight</td>"; sub = 'sm'; break;
						case 5: tr.innerHTML += "<td>Large Straight</td>"; sub = 'lg'; break;
						case 6: tr.innerHTML += "<td>Five of a Kind</td>"; sub = 5; break;
						case 7: tr.innerHTML += "<td>Chance</td>"; sub = 'ch'; break;
					}
					tr.innerHTML += "<td id='lower-"+sub+"' class='table-scorecell enabled'></td>";
					tr.innerHTML += "<td class='table-cb-lower not-selected'><input id='"+id+"-"+sub+"-box' class='table-checkbox' type='checkbox' disabled='true' onclick='saveRoll(\""+id+"-"+sub+"\")'></td>";
				}
				tbody.appendChild(tr);
			}
		}
		table.appendChild(tbody);
		var tfoot = document.createElement("TFOOT"); {
			for (var row = 1; row <= 2; row++) {
				var tr = document.createElement("TR");
				var title; var sub;
				if (row == 1) {title = 'Bonus'; sub = 'bonus';}
				else {title = 'Total'; sub = 'total';}
				tr.innerHTML = "<td>"+title+"</td><td id='"+id+"-"+sub+"'>0</td><td></td>";
				if (num == 1 || row == 2) {tfoot.appendChild(tr);}
			}
		}
		table.appendChild(tfoot);
		game_cont.appendChild(table);
	}
	var table = document.createElement("TABLE"); {
		table.id = 'table-total';
		table.className = 'table table-onecell';
		var caption = document.createElement("CAPTION"); {
			caption.innerHTML = 'Total Score';
		}
		table.appendChild(caption);
		var tbody = document.createElement("TBODY"); {
			var tr = document.createElement("TR");
			tr.innerHTML = "<td id='total-score'>0</td>";
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		game_cont.appendChild(table);
	}
	var log = document.createElement("SECTION"); {
		log.className = 'log';
		log.id = 'log';
		log.style.display = localStorage.logVisibility;
		var caption = document.createElement("CAPTION"); {
			caption.innerHTML = 'Event Log';
		}
		//log.appendChild(caption);
		var div = document.createElement('DIV');
		div.id = 'log-content';
		log.appendChild(div);
		game_cont.appendChild(log);
	}
	main.appendChild(game_cont);
	addToLog("Welcome to Yahtzee!<br /><hr />");
}
createGame();

var isGameActive = true;
var total_score = [0,0,0]; // [upper,lower,total]
var bonus = 0;
var filled_in = [[false,false,false,false,false,false],[false,false,false,false,false,false,false]];
var filled_in_key = [['upper-1s','upper-2s','upper-3s','upper-4s','upper-5s','upper-6s'],['lower-3','lower-4','lower-fh','lower-sm','lower-lg','lower-5','lower-ch']];

var roll_count = 0;
var roll_counter = document.getElementById('roll-counter');

function rollDice() {
	if (isGameActive) {
		if (roll_count == 0 && getNumberOfFilledIn() == 0) {
			var boxes = document.getElementsByClassName('table-checkbox');
			for (var i = 0; i < boxes.length; i++) {
				boxes[i].disabled = false;
			}
			var dice = document.getElementsByClassName('die');
			for (var i = 0; i < dice.length; i++) {
				setClass(dice[i],2,'enabled');
			}
			var dice_boxes = document.getElementsByClassName('die-checkbox');
			for (var i = 0; i < dice_boxes.length; i++) {
				dice_boxes[i].disabled = false;
			}
		}
		if (roll_count == 0) {
			var cells = document.getElementsByClassName('table-scorecell');
			for (var i = 0; i < cells.length; i++) {
				if (cells[i].classList[1] != 'disabled') {
					document.getElementById(cells[i].id+'-box').disabled = false;
				}
			}
			var undo = document.getElementById('button-undo');
			undo.disabled = true;
			setClass(undo,1,'disabled');
		}
		var ranNumArray = [];
		for (var dieNumber = 1; dieNumber <= 5; dieNumber++) {
			var checkbox = document.getElementById('die-'+dieNumber+'-box');
			checkbox.disabled = false;
			var die = document.getElementById('die-'+dieNumber);
			if (checkbox.checked == false) {
				var randomNumber = Math.floor(Math.random()*6) + 1;
				ranNumArray[dieNumber-1] = randomNumber;
				setClass(die,1,'die-'+randomNumber);
			} else {
				ranNumArray[dieNumber-1] = parseInt(die.classList[1].substring(4,5));
			}
		}
		roll_count++;
		roll_counter.innerHTML = "Roll #: "+roll_count;
		var dice_roll = ' '; for (var i = 0; i < ranNumArray.length; i++) {dice_roll += ranNumArray[i] + ' ';}
		addToLog("Dice roll #"+roll_count+":"+dice_roll);
		if (roll_count == 3) {
			var button = document.getElementById('button-roll-dice');
			button.disabled = true;
			setClass(button,1,'disabled');
		} else {
			playAudio('roll');
		}
		updateHouses(ranNumArray);
	}
}
function updateHouses(ranNumArray) {
	var upper_house = [0,0,0,0,0,0,0]; // bonus,frequency_x6
	var lower_house = [0,0,0,0,0,0,0];
	var most_frequent = [0,0]; // number,frequency
	var second_most_frequent = [0,0]; // number,frequency

	// Cycle through array
	for (var index = 0; index < ranNumArray.length; index++) {
		for (var number = 1; number <= 6; number++) {
			if (ranNumArray[index] == number) {
				upper_house[number]++;
				lower_house[6] += number;
				if (upper_house[number] > most_frequent[1]) { // compares frequencies
					most_frequent = [number,upper_house[number]];
				} else if (upper_house[number] > second_most_frequent[1]) {
					second_most_frequent = [number,upper_house[number]];
				}
			}
		}
	}

	// Upper house operations
	for (var number = 0; number < upper_house.length; number++) {
		if (number == 0) {
			var sum = 0;
			for (var num = 1; num <= 6; num++) {sum += upper_house[num]*num;}
			if (sum >= 63) {upper_house[0] = 35;}
		} else {
			var cell = document.getElementById('upper-'+number+'s');
			if (getFilledIn('upper-'+number+'s') == false) {
				cell.innerHTML = upper_house[number] * number;
			}
		}
	}

	// Lower house operations
	var total = lower_house[6];
	var ch = document.getElementById('lower-ch'); { 	// Chance
		if (getFilledIn('lower-ch') == false) {
			ch.innerHTML = total;
		}
	}
	for (var num = 3; num <= 5; num++) { 				// 3/4/5 of a Kind
		var cell = document.getElementById('lower-'+num);
		if (getFilledIn('lower-'+num) == false) {
			if (most_frequent[1] >= num) {
				if (num == 5) {cell.innerHTML = 50;}
				else {cell.innerHTML = total;}
			} else {cell.innerHTML = 0;}
		} else if (num == 5 && most_frequent[1] >= num && getFilledIn('lower-5') == true) {
			cell.innerHTML = parseInt(cell.innerHTML) + 100;
			updateTotals('lower',100);
		}
	}
	var fh = document.getElementById('lower-fh'); {		// Full house
		if (getFilledIn('lower-fh') == false) {
			if (most_frequent[1]==3 && second_most_frequent[1]==2) {
				fh.innerHTML = 25;
			} else {
				fh.innerHTML = 0;
			}
		}
	}
	var sm = document.getElementById('lower-sm');
	var lg = document.getElementById('lower-lg'); {		// SM & LG Straight
		var sm_straight = false;
		var lg_straight = false;
		if (upper_house[3]>=1 && upper_house[4]>=1 && (upper_house[2]>=1 || upper_house[5]>=1)) {
			if (upper_house[2]>=1 && upper_house[5]>=1) {
				sm_straight = true;
				if (upper_house[1]==1 || upper_house[6]==1) {lg_straight = true;}
			} else if ((upper_house[1]>=1 && upper_house[2]>=1) || (upper_house[5]>=1 && upper_house[6]>=1)) {
				sm_straight = true;
			}
		}
		if (getFilledIn('lower-sm') == false) {
			if (sm_straight == true) {sm.innerHTML = 30;}
			else {sm.innerHTML = 0;}
		}

		if (getFilledIn('lower-lg') == false) {
			if (lg_straight == true) {lg.innerHTML = 40;}
			else {lg.innerHTML = 0;}
		}
	}
}
var last_filled = [];
function saveRoll(id) {
	playAudio('roll-saved');

	var box = document.getElementById(id+'-box');
	box.checked = true;

	var value = parseInt(document.getElementById(id).innerHTML);
	updateTotals(id.substring(0,5),value);

	var cell = document.getElementById(id);
	setClass(cell,1,'disabled');

	last_filled = [id,value,roll_count,[],[]];
	var dice = document.getElementsByClassName('die');
	for (var i = 0; i < dice.length; i++) {
		last_filled[3][i] = dice[i].classList[1];
	}

	var cells = document.getElementsByClassName('table-scorecell');
	for (var i = 0; i < cells.length; i++) {
		document.getElementById(cells[i].id+'-box').disabled = true;
		if (cells[i].classList[1] != 'disabled') {
			last_filled[4][i] = cells[i].innerHTML;
			cells[i].innerHTML = 0;
		}
	}

	roll_count = 0;
	roll_counter.innerHTML = "Roll #: "+roll_count;

	setFilledIn(id,true);
	clearDice();

	addToLog(id+" saved – "+value+" points<br /><hr />");

	if (getNumberOfFilledIn() == 13) {
		isGameActive = false;
		addToLog("Game finished. Score: "+total_score[2]);
		openPopUpShortcut("finish-game");
	} else {
		var button = document.getElementById('button-roll-dice');
		button.disabled = false;
		setClass(button,1,'enabled');

		var undo = document.getElementById('button-undo');
		undo.disabled = false;
		setClass(undo,1,'enabled');
	}
}
function undoSaveRoll() {
	var id = last_filled[0];
	setFilledIn(id,false);

	var value = last_filled[1];
	updateTotals(id.substring(0,5),-1*value);

	var roll_count = last_filled[2];
	roll_counter.innerHTML = "Roll #: "+roll_count;
	var button = document.getElementById('button-roll-dice');
	if (roll_count < 3) {
		button.disabled = false;
		setClass(button,1,'enabled');
	} else {
		button.disabled = true;
		setClass(button,1,'disabled');
	}

	var dice = document.getElementsByClassName('dice');
	for (var i = 0; i < dice.length; i++) {
		setClass(dice[i],1,last_filled[3][i]);
	}

	var box = document.getElementById(id+'-box');
	box.checked = false;
	box.disabled = false;

	var cells = document.getElementsByClassName('table-scorecell');
	for (var i = 0; i < cells.length; i++) {
		if (cells[i].classList[1] != 'disabled') {
			document.getElementById(cells[i].id+'-box').disabled = false;
			cells[i].innerHTML = last_filled[4][i];
		}
	}

	var cell = document.getElementById(id);
	setClass(cell,1,'enabled');

	var undo = document.getElementById('button-undo');
	undo.disabled = true;
	setClass(undo,1,'disabled');

	addToLog("Save has been undone");
	playAudio('pop');
}
function updateTotals(house,value) {
	// Upper/lower
	if (house == 'upper') {
		total_score[0] += value;
		if (total_score[0] >= 63 && bonus == 0) {
			bonus = 35;
			total_score[0] += bonus;
			total_score[2] += bonus;
		} else if (value < 0 && total_score[0] < 63 && bonus == 35) {
			total_score[0] -= bonus;
			total_score[2] -= bonus;
			bonus = 0;
		}
		document.getElementById('upper-bonus').innerHTML = bonus;
		document.getElementById('upper-total').innerHTML = total_score[0];
	} else {
		total_score[1] += value;
		document.getElementById('lower-total').innerHTML = total_score[1];
	}

	// Total
	total_score[2] += value;
	document.getElementById('total-score').innerHTML = total_score[2];
}

function setFilledIn(id,status) {
	for (var i1 = 0; i1 < filled_in_key.length; i1++) {
		for (var i2 = 0; i2 < filled_in_key[i1].length; i2++) {
			if (filled_in_key[i1][i2] == id) {
				filled_in[i1][i2] = status;
			}
		}
	}
}
function getFilledIn(id) {
	for (var i1 = 0; i1 < filled_in_key.length; i1++) {
		for (var i2 = 0; i2 < filled_in_key[i1].length; i2++) {
			if (filled_in_key[i1][i2] == id) {
				return filled_in[i1][i2];
			}
		}
	}
}
function getNumberOfFilledIn() {
	var count = 0;
	for (var i1 = 0; i1 < filled_in_key.length; i1++) {
		for (var i2 = 0; i2 < filled_in_key[i1].length; i2++) {
			if (filled_in[i1][i2] == true) {
				count++;
			}
		}
	}
	return count;
}

function clearDice() {
	for (var dieNumber = 1; dieNumber <= 5; dieNumber++) {
		var checkbox = document.getElementById('die-'+dieNumber+'-box');
		checkbox.checked = false;
		checkbox.disabled = true;
		var die = document.getElementById('die-'+dieNumber);
		die.className = 'die die-blank enabled';
	}
}
function clearCells() {
	var cells = document.getElementsByClassName('table-scorecell');
	for (var i = 0; i < cells.length; i++) {
		if (cells[i].className.includes("disabled")) {
			cells[i].innerHTML = '';
		}
	}
}
function disableDie(id) {
	var die = document.getElementById(id);
	var checkbox = document.getElementById(id+'-box');
	if (die.classList[1] == 'die-blank') { // Inactive
		playAudio('error');
	} else if (die.classList[2] == "disabled") { // Dis -> en
		playAudio('pop');
 		setClass(die,2,'enabled');
 		checkbox.checked = false;
 	} else { // En -> dis
		playAudio('pop');
		setClass(die,2,'disabled');
		checkbox.checked = true;
	}
}

function setClass(element,index,newClass) {
	var newClassArray = [];
	for (var i = 0; i < element.classList.length; i++) {
		if (i == index) {
			newClassArray[i] = newClass;
		} else {
			newClassArray[i] = element.classList[i];
		}
	}
	var newClassName = "";
	for (var i = 0; i < newClassArray.length; i++) {
		if (i != 0) {newClassName += " ";}
		newClassName += newClassArray[i];
	}
	element.className = newClassName;
}

function resetGame() {
	var cells = document.getElementsByClassName('table-scorecell');
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerHTML = '';
		setClass(cells[i],1,'enabled');
	}
	var boxes = document.getElementsByClassName('table-checkbox');
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].checked = false;
		boxes[i].disabled = true;
	}
	var dice = document.getElementsByClassName('die');
	for (var i = 0; i < dice.length; i++) {
		setClass(dice[i],1,'die-blank');
		setClass(dice[i],2,'enabled');
	}
	var dice_boxes = document.getElementsByClassName('die-checkbox');
	for (var i = 0; i < dice_boxes.length; i++) {
		dice_boxes[i].checked = false;
		dice_boxes[i].disabled = true;
	}
	var button = document.getElementById('button-roll-dice');
	button.disabled = false;
	setClass(button,1,'enabled');

	for (var i = 0; i < filled_in.length; i++) {
		for (var i2 = 0; i2 < filled_in[i].length; i2++) {
			filled_in[i][i2] = false;
		}
	}

	total_score = [0,0,0]; bonus = 0;
	roll_count = 0; roll_counter.innerHTML = "Roll #: 0";
	document.getElementById('upper-bonus').innerHTML = 0;
	document.getElementById('upper-total').innerHTML = 0;
	document.getElementById('lower-total').innerHTML = 0;
	document.getElementById('total-score').innerHTML = 0;

	addToLog('<br /><hr /> - - New Game - -');
	isGameActive = true;
}

function closePopUp(id) { document.getElementById(id).parentNode.removeChild(document.getElementById(id)); }
function openPopUp(id,heading,desc,type,submit_values,inputs) {
	var pop_up_cont = document.createElement("DIV");
		pop_up_cont.id = id;
		pop_up_cont.className = 'pop-up-container';
		var header = document.createElement("HEADER"); {
			var h1 = document.createElement("H1");
				h1.innerHTML = heading;
			header.appendChild(h1);
			var button = document.createElement("BUTTON");
				button.onclick = function() {closePopUp(id);};
				button.innerHTML = 'X';
			header.appendChild(button);
		}
		pop_up_cont.appendChild(header);
		var pop_up = document.createElement("DIV"); {
			pop_up.className = 'pop-up';
			var p = document.createElement("P");
				p.innerHTML = desc;
			if (desc != '') {pop_up.appendChild(p);}
			if (type == "alert") {
				if (inputs != undefined || inputs != null) {
					var table = document.createElement("TABLE");
					for (var i = 0; i < inputs.length; i++) {
						var tr = document.createElement("TR");
						for (var i2 = 0; i2 < inputs[i].length; i2++) {
							tr.innerHTML += '<td>'+inputs[i][i2]+'</td>';
						}
						table.appendChild(tr);
					}
					pop_up.appendChild(table);
				}
				pop_up.innerHTML += '<button class="button'+submit_values[0]+'" id="" onclick="closePopUp(\''+id+'\')">'+submit_values[1]+'</button>';
			} else if (type == 'confirm') {
				for (var i = 0; i < submit_values.length; i++) {
					var m = 'ok'; if (i == 1) {m = 'cancel';}
					pop_up.innerHTML += '<button class="button'+submit_values[i][0]+'" id="" onclick="popUp_Confirm(\''+submit_values[i][1]+'\',\''+id+'\')">'+submit_values[i][2]+'</button>';
				}
			}
		}
		pop_up_cont.appendChild(pop_up);
	main.appendChild(pop_up_cont);
	document.getElementsByClassName('pop-up-focus')[0].focus();
}
function openPopUpShortcut(location) {
	var id = 'pop-up-'+location;
	if (location == 'settings-menu') {
		var h1 = 'Settings';
		var desc = '<em>Changes are automatically saved</em>';
		var type = 'alert';
		var submit_value = ['','Close'];
		var add = [[['',''],['','']],' checked',' checked'];
		if (typeof(Storage) !== undefined) {
			add[0][parseInt(localStorage.themeNumber)-1] = [' selected',' (current theme)'];
			if (localStorage.sounds == 'false') {add[1] = '';}
			if (localStorage.logVisibility == 'none') {add[2] = '';}
		}
		var inputs = [
			['<label for="setting-theme">Theme</label>', '<select class="pop-up-focus" id="setting-theme" onchange="changeSetting(\'theme\',this.value,true)"><option value="1"'+add[0][0][0]+'>Classic'+add[0][0][1]+'</option><option value="2"'+add[0][1][0]+'>Modern'+add[0][1][1]+'</option></select>'],
			['<label for="setting-sounds">Sounds</label>', '<input id="setting-sounds" type="checkbox"'+add[1]+' onclick="changeSetting(\'sounds\',this.checked,true)">'],
			['<label for="setting-log">Log</label>', '<input id="setting-log" type="checkbox"'+add[2]+' onclick="changeSetting(\'logVisibility\',this.checked,true)"><button onclick="clearLog()">Clear Log</button>']
			// ['<label for="setting-dice-labels">Dice Labels</label>','<select class="pop-up-focus" id="setting-dice-labels" onchange="changeDiceLabels(this.value)"><option value="1">Dots</option><option value="2">Numbers</option></select>']
		];
		openPopUp(id,h1,desc,type,submit_value,inputs);
	} else if (location == 'finish-game') {
		var h1 = 'Congratulations!';
		var desc = 'Your final score is '+total_score[2]+'.';
		var type = 'confirm';
		var submit_values = [
			[' pop-up-focus','ok','New Game'],
			['','cancel','Close']
		];
		openPopUp(id,h1,desc,type,submit_values);
	} else if (location == 'confirm-new-game') {
		var h1 = 'Clear Existing Game';
		var desc = 'Are you sure you want to clear your existing game?';
		var type = 'confirm';
		var submit_values = [
			[' pop-up-focus','ok','Create New Game'],
			['','cancel','Cancel']
		];
		openPopUp(id,h1,desc,type,submit_values);
	}
}
function popUp_Confirm(clicked,id) {
	if (clicked == 'ok') {
		if (id == 'pop-up-confirm-new-game') {
			resetGame();
		} else if (id == 'pop-up-finish-game') {
			resetGame();
		}
	}
	closePopUp(id);
}
function isPopUpActive() {
	if (document.getElementsByClassName('pop-up-container').length == 0) {return false;}
	else {return true;}
}

document.addEventListener('keydown', function(){openKeyboardShortcut(event);});
var selected_house = '';
function openKeyboardShortcut(eventA) {
	if (!isPopUpActive()) {
		var key_pressed = eventA.key;
		var ctrl_pressed = eventA.ctrlKey;
		var cmd_pressed = eventA.metaKey;
		var alt_opt_pressed = eventA.altKey;
		// console.log(key_pressed,alt_opt_pressed);
		switch (key_pressed) {
			case ' ': case 'r': case '`': if (roll_count < 3 && isGameActive == true) {rollDice();} else {playAudio('error');} break;
			case '7': if (selected_house != 'lower') {break;}
			case '6': if (selected_house != 'lower' && selected_house != 'upper') {break;}
			case '1': case '2': case '3': case '4': case '5': {
				if (selected_house=='upper' || selected_house=='lower') {
					var id = filled_in_key[1][parseInt(key_pressed)-1];
					if (selected_house == 'upper') {id = filled_in_key[0][parseInt(key_pressed)-1];}
					if (getFilledIn(id) == false) {
						setSelectedHouse('');
						saveRoll(id);
					}
				} else {
					disableDie('die-'+key_pressed);
				}
				break;
			}
			case 'u': case 'ArrowUp': if (roll_count > 0) {setSelectedHouse('upper'); playAudio('pop');} else {playAudio('error');} break;
			case 'l': case 'ArrowDown': if (roll_count > 0) {setSelectedHouse('lower'); playAudio('pop');} else {playAudio('error');} break;
			case 'n': if (ctrl_pressed == true) {openPopUpShortcut("confirm-new-game");} else {playAudio('error');} break;
			case 's': if (ctrl_pressed == true) {openPopUpShortcut("settings-menu");} else {playAudio('error');} break;
			case 'm': if (ctrl_pressed == true) {changeSetting('sounds','',true);} else {playAudio('error');} break;
			case 'Control': case 'Alt': case 'Meta': break;
			default: playAudio('error'); break;
		}
	}
}
function setSelectedHouse(house_in) {
	if (selected_house != house_in) {
		selected_house = house_in;
		var houses = ['upper','lower'];
		for (var h = 0; h < houses.length; h++) {
			var house = houses[h];
			var selected = 'not-selected';
			if (house_in == house) {selected = 'selected';}
			var cells = document.getElementsByClassName('table-cb-'+house);
			for (var i = 0; i < cells.length; i++) {
				if (document.getElementById(filled_in_key[h][i]+'-box').disabled == false) {
					setClass(cells[i],1,selected);
					if (selected == 'selected') {
						cells[i].innerHTML = (i+1)+' '+cells[i].innerHTML;
					} else if (cells[i].innerHTML.substring(0,1) != '<') {
						cells[i].innerHTML = cells[i].innerHTML.substring(2);
					}
					if (getFilledIn(filled_in_key[h][i]) == true) {
						document.getElementById(filled_in_key[h][i]+'-box').checked = true;
					}
				}
			}
		}
	}
}

function addToLog(message) {
	var log = document.getElementById('log');
	var content = document.getElementById('log-content');
	var full_message = "<p>"+message+"</p>";
	content.innerHTML += full_message;
	for (var index_hr = 0; index_hr < message.length; index_hr++) {
		var m = message.substring(index_hr);
		if (m.indexOf('<hr />') >= 0) {
			log.scrollTop += 29;
			index_hr += 5;
		}
	}
	for (var index_br = 0; index_br < message.length; index_br++) {
		var m = message.substring(index_br);
		if (m.indexOf('<br />') >= 0) {
			log.scrollTop += 24;
			index_br += 5;
		}
	}
	log.scrollTop += 100;
}
function clearLog() {
	var content = document.getElementById('log-content');
	content.innerHTML = '';
	addToLog("Log cleared at "+getCurrentTime(24)+"<hr>")
}

function getCurrentTime(format) {
	var d = new Date();
	var h = d.getHours();
	if (format==12 && h<12) {h -= 12;}
	var m = d.getMinutes();
	return h+":"+m;
}

function playAudio(audio_name) {
	var audio = document.getElementById('audio_'+audio_name);
	audio.currentTime = 0;
	if (typeof(Storage) !== undefined) {
		if (localStorage.sounds=='true' || localStorage.sounds==true) {
			audio.play();
		}
	}
}

function changeSetting(setting,value,playSound) {
	if (typeof(Storage) !== undefined) {
		if (playSound == true) {playAudio('pop');}
		if (setting == 'theme') {
			localStorage.themeNumber = value;
			var links = document.getElementsByTagName('LINK');
			for (var i = 0; i < links.length; i++) {
				if (links[i].href.includes("style.css")) {
					// Do nothing
				} else if (links[i].href.includes("theme-"+value+".css")) {
					links[i].disabled = false;
					document.getElementById('img-settings').src = 'images/theme'+value+'-settings.svg';
				} else {
					links[i].disabled = true;
				}
			}
		} else if (setting == 'sounds') {
			switch (localStorage.sounds) {
				case true: case "true": localStorage.sounds = 'false'; break;
				case false: case "false": localStorage.sounds = 'true'; break;
			}
			playAudio('pop');
		} else if (setting == 'logVisibility') {
			if (value == true) {
				localStorage.logVisibility = 'flex';
				document.getElementById('log').style.display = 'flex';
			} else {
				localStorage.logVisibility = 'none';
				document.getElementById('log').style.display = 'none';
			}
		}
	}
}
