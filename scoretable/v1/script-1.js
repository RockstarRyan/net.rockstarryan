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
				var form = document.createElement("FORM");
					form.action = 'javascript:closePopUp("'+id+'")';
					form.method = 'POST';
					if (inputs != undefined || inputs != null) {
						var table = document.createElement("TABLE");
						for (var i = 0; i < inputs.length; i++) {
							var tr = document.createElement("TR");
							for (var i2 = 0; i2 < inputs[i].length; i2++) {
								tr.innerHTML += '<td>'+inputs[i][i2]+'</td>';
							}
							table.appendChild(tr);
						}
						form.appendChild(table);
					}
					var submit = document.createElement("INPUT");
						submit.type = 'submit';
						submit.id = 'pop-up-submit-button';
						submit.name = 'submit';
						submit.value = submit_values;
					form.appendChild(submit);
					form.appendChild(document.createElement("BR"));
				pop_up.appendChild(form);
			} else if (type == 'confirm') {
				for (var i = 0; i < submit_values.length; i++) {
					pop_up.innerHTML += submit_values[i];
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
		var submit_value = 'Close';
		var add = [[['',''],['','']],' checked'];
		if (typeof(Storage) !== undefined) {
			add[0][parseInt(sessionStorage.themeNumber)-1] = [' selected',' (current theme)'];
			if (sessionStorage.sounds == 'false') {add[1] = '';}
			// selectedIndex = parseInt(sessionStorage.diceLabels)-1;
		}
		var inputs = [
			[ '<label for="setting-theme">Theme</label>', '<select class="pop-up-focus" id="setting-theme" onchange="changeTheme(this.value)"><option value="1"'+add[0][0][0]+'>Classic'+add[0][0][1]+'</option><option value="2"'+add[0][1][0]+'>Modern'+add[0][1][1]+'</option></select>'],
			[ '<label for="setting-sounds">Sounds</label>', '<input id="setting-sounds" type="checkbox"'+add[1]+' onclick="muteAudio(this.checked)">']
			// ['<label for="setting-dice-labels">Dice Labels</label>','<select class="pop-up-focus" id="setting-dice-labels" onchange="changeDiceLabels(this.value)"><option value="1">Dots</option><option value="2">Numbers</option></select>']
		];
		openPopUp(id,h1,desc,type,submit_value,inputs);
	} else if (location == 'create-new-game') {
		var h1 = 'New Game Settings';
		var desc = '<em>Changes are automatically saved</em>';
		var type = 'alert';
		var submit_value = 'Create Game';
		var add = [[['',''],['','']],' checked'];

		// Define inputs (game settings)
		var select_game =

		var inputs = [
			[ '<label for="setting-theme">Theme</label>', '<select class="pop-up-focus" id="setting-theme" onchange="changeTheme(this.value)"><option value="1"'+add[0][0][0]+'>Classic'+add[0][0][1]+'</option><option value="2"'+add[0][1][0]+'>Modern'+add[0][1][1]+'</option></select>'],
			[ '<label for="setting-sounds">Sounds</label>', '<input id="setting-sounds" type="checkbox"'+add[1]+' onclick="muteAudio(this.checked)">']
			// ['<label for="setting-dice-labels">Dice Labels</label>','<select class="pop-up-focus" id="setting-dice-labels" onchange="changeDiceLabels(this.value)"><option value="1">Dots</option><option value="2">Numbers</option></select>']
		];
		openPopUp(id,h1,desc,type,submit_value,inputs);
	} else if (location == 'confirm-new-game') {
		var h1 = 'Delete Existing Game';
		var desc = 'Are you sure you want to delete your existing game?';
		var type = 'confirm';
		var submit_values = [
			'<button class="button pop-up-focus" id="" onclick="popUp_Confirm(\'ok\',\''+location+'\')">New Game</button>',
			'<button class="button" id="" onclick="popUp_Confirm(\'cancel\',\''+location+'\')">Cancel</button>'
		];
		openPopUp(id,h1,desc,type,submit_values);
	}
}
function popUp_Confirm(clicked,location) {
	if (clicked == 'ok') {
		if (location == 'confirm-new-game') {
			closePopUp('pop-up-'+location);
			openPopUpShortcut('create-new-game');
		}
	} else {
		closePopUp('pop-up-'+location);
	}
}
function isPopUpActive() {
	if (document.getElementsByClassName('pop-up-container').length == 0) {return false;}
	else {return true;}
}
