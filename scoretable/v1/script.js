//********************************** Create game+"-screen" content *****************************************

function app_setup() {
	createPageLayout();
	initializeMasterScores();
	displayGameSettings();
	for (var i = 0; i < game_info.length; i++) {
		var game = game_info[i][getIndex("game")[0]][getIndex("game")[1]];
		if (getGameInfo(game,"isIST") == true) {createIncrementingScoretables(game);}
		else {createScoretables(game);}
	}
//	createScoretables("gen");
}

function displayGameSettings() {	// Displays settings for each game
	for (var i = 0; i < game_info.length; i++) {
		var game_index = getIndex("game");
		var game = game_info[i][game_index[0]][game_index[1]];

		// Gets screen
		var currentScreen = document.getElementById(game+"-screen");

		// Creates settings line
		var settings_line = document.createElement("DIV");
		settings_line.id = game+"-settingsline";
	   	settings_line.className = "settings-line";

		// Creates h4 for settings line
		var h4 = document.createElement("H4");
		h4.innerHTML = "Settings";
		settings_line.appendChild(h4);

		// Checks to see which settings are needed, then adds them
		var changeable_settings = game_info[i][getIndex("changeable_settings")[0]];
		for (var settingID = 0; settingID < changeable_settings.length; settingID++) {
			if (changeable_settings[settingID] == 1) {

				var setting_info = getSettingInfo(settingID+1);
				console.log(setting_info);

				// Creates container with class "setting"
				var setting = document.createElement("DIV");
				setting.className = "setting";

				// Creates label for setting
				var label = document.createElement("LABEL");
				label.innerHTML = setting_info[getIndexSettingsInfo("label")];
				console.log(setting_info,getIndexSettingsInfo("label"),setting_info[getIndexSettingsInfo("label")]);
				console.log(game,"label",label);
				setting.appendChild(label);

				console.log(game,setting_info[getIndexSettingsInfo("isInput")]);
				// Creates actual setting interface
				if (setting_info[getIndexSettingsInfo("isInput")] == true) {
					var value; var key; var id; var className; var onchange;
					id = setting_info[getIndexSettingsInfo("id")];
					key = setting_info[getIndexSettingsInfo("key")];
					value = getGameInfo(game,key);
					console.log(game,id,key,setting_info,value);
					onchange = "updateGameInfo('"+game+"','"+key+"',this.value,this.id)";

					setting.innerHTML += "<input id='"+game+"-"+id+"' class='"+id+"' type='text' placeholder='"+value+"' value='"+value+"' onchange=\""+onchange+"\">";

				} else if (setting_info[getIndexSettingsInfo("isInput")] == false) {
					var key; var id; var onclick; var innerHTML; var value;
					id = setting_info[getIndexSettingsInfo("id")];
					key = setting_info[getIndexSettingsInfo("key")];
					if (key == "clear") {value = "clear";}
					else {value = getGameInfo(game,key);}
					onclick = "updateGameInfo('"+game+"','"+key+"')";

					var startIndex = getIndexSettingsInfo("optionLabels");
					for (var index2 = startIndex; index2 < setting_info.length; index2++) {
						if (setting_info[index2][0] == value) {innerHTML = setting_info[index2][1];}
					}
					console.log(game,key,value,innerHTML);
					setting.innerHTML += "<button id='"+game+"-"+id+"' class='"+id+"' onclick=\""+onclick+"\">"+innerHTML+"</button>";
				}
				settings_line.appendChild(setting);
			}
		}
		currentScreen.appendChild(settings_line);

		// Create error message
		var errorMessage = document.createElement("P");
		errorMessage.id = "em-"+game+"table";
		errorMessage.className = "error-message";
		errorMessage.innerHTML = "<strong>!</strong> Please enter acceptable values for the settings above";
		currentScreen.appendChild(errorMessage);

		// Add new screen to <main>
		document.getElementById('app-container').appendChild(currentScreen);
	}
}

function createPageLayout() {		// Creates document layout
	// Get <main>
	var main = document.getElementById("app-container");
	main.innerHTML = "";

	// Create <nav> buttons
	var nav = document.createElement("NAV");
	for (var i = -1; i < game_info.length; i++) {
		var game; var innerHTML; var className = "";
		if (i == -1) {
			game = "home";
			innerHTML = "Home";
			className = " nb-active";
		} else {
			var game_index = getIndex("game");
			game = game_info[i][game_index[0]][game_index[1]];
			innerHTML = getGameInfo(game,"game-h2");
		}
		nav.innerHTML += "<button class='nav-button"+className+"' id='nb-"+game+"' onclick='changeScreen(\""+game+"-screen\",\"nb-"+game+"\")'>"+innerHTML+"</button>";
	}
	main.appendChild(nav);

	// Create game-screens
	for (var i = -1; i < game_info.length; i++) {
		var game; var innerHTML = ""; var className = "";
		if (i == -1) {
			game = "home";
			innerHTML = "<p style='margin-top:5px;'>STATUS: JavaScript is enabled.</p><h3>Please select a game from the list of available games</h3>";
			className = " screen-active"
		} else {
			var game_index = getIndex("game");
			game = game_info[i][game_index[0]][game_index[1]];
		}
		clearExisting(game,"screen");
		var newScreen = document.createElement("DIV");
		newScreen.id = game+"-screen";
		newScreen.className = "screen "+className;
		newScreen.innerHTML = innerHTML;
		main.appendChild(newScreen);
	}
}
function changeScreen(screenName, buttonName) { // Change screens & adjust nav buttons
	// Hide all screens
	var screens = document.getElementsByClassName('screen');
	for (var i = 0; i < screens.length; i++) {
		screens[i].className = "screen";
	}
	// Show corresponding screen
	document.getElementById(screenName).className += " screen-active";

	// Make all buttons the default color
	var buttons = document.getElementsByClassName('nav-button');
	for (var j = 0; j < buttons.length; j++) {
		buttons[j].className = "nav-button";
	}
	// Add special color to active "link"
	document.getElementById(buttonName).className += " nb-active";
}

// **************************** New games & retrieve old games *************************************
function newGame() {

}

// ************************* Creates scoretables & master_scores ***********************************
var master_scores = []; // Filled in with initializeMasterScores()
function initializeMasterScores() {
	for (var i = 0; i < game_info.length; i++) { // For each game (dimension 1)
		var game = [];
		var index2 = getIndex("numTables");
		for (var j = 0; j < game_info[i][index2[0]][index2[1]]; j++) { // For each table (sol has 3) (dimension 2)
			var table = [];
			var index3 = getIndex("numPlayers");
			for (var k = 0; k < game_info[i][index3[0]][index3[1]]; k++) { // For each player (dimension 3)
				var player = [];
				player[0] = "";
				var index4 = getIndex("numRounds");
				for (var l = 0; l < game_info[i][index4[0]][index4[1]]; l++) { // For each score & player name (dimension 4)
					player[l+1] = 0;
				}
				table[k] = player;
			}
			game[j] = table;
		}
		master_scores[i] = game;
	}
}
function updateMasterScores(game, no, player, index, newValue, id) { // where index=0 is playerName, others are round scores
	var gameIndex = returnGameIndex(game,"game");

	// Apply change based on round score or player name (index)
	if (index != 0) {			// Change to round score
		if (isNaN(parseInt(newValue))) {
			document.getElementById(id).value = master_scores[gameIndex][no-1][player-1][index];
			console.log("Invalid value. Reverted to previous value.",master_scores[gameIndex][no-1][player-1][index]);
		} else {
			newValue = parseInt(newValue);
			console.log(gameIndex, no-1, player-1, index, newValue);
			master_scores[gameIndex][no-1][player-1][index] = newValue;
		}
	} else if (index == 0) {	// Change to player name
		console.log(gameIndex, no, player, index, newValue);
		for (var tableNo = 1; tableNo <= getGameInfo(game,"numTables"); tableNo++) {
			master_scores[gameIndex][tableNo-1][player-1][index] = newValue;
			document.getElementById(game+tableNo+"-player"+player+"name").value = newValue;
		}
	}
	// Cause effect of change
	if (getGameInfo(game,"isIST") == true) {createLeaderboard(game, no);}
	else {
		//if (index==0) {createScoretables(game);}
		calculatePlayerTotals(game);
	}
}

function importScoretable() {
	// Set up a way to user-input an array directly to code, with the first row being preferences and the rest being scores
}

function createScoretables(game) {				// Creates regular scoretables
	var repeat = getGameInfo(game,"numTables");
	for (var no = 1; no <= repeat; no++) {
		// Gets or creates container for scoretable & leaderboard
		var tableContainer;
		if (document.getElementById(game+no+"-container") == null) {
			tableContainer = document.createElement("DIV");
			tableContainer.id = game+no+"-container";
			tableContainer.className = "table-container";
			if (no == repeat) {tableContainer.className += " tc-last";}
		} else {
			tableContainer = document.getElementById(game+no+"-container");
			if (no == repeat) {tableContainer.className = "table-container tc-last";}
			else {tableContainer.className = "table-container";}
		}

		// Delete existing scoretable & create new
		clearExisting(game,"scoretable",no);
		var scoretable = document.createElement("DIV");
		scoretable.id = game+no+"-scoretable";
		scoretable.className = "scoretable "+game+"-scoretable";
		var numPlayers = getGameInfo(game,"numPlayers");
		var numRounds = getGameInfo(game,"numRounds");
		//console.log(game,repeat,numPlayers,numRounds)

		var numColumns = numPlayers; var numRows = numRounds+2;

		var errorMessage = document.getElementById("em-"+game+"table");

		if (numColumns>0 && numRows>1) {
			if (numColumns == 1) {	scoretable.style.maxHeight = ((52*numRows)+30) + "px";}
			else {					scoretable.style.maxHeight = ((52*numRows)+2) + "px";}

			// Determines width of columns
			var maxTableWidth = window.innerWidth - 30; // not actually max table width
			var otherColumnsWidth = (maxTableWidth-100) + "px";
			var colwidth = String(100/numColumns)+"%";
			// OLDER - var colwidth = "calc("+String(100/numColumns)+"% - "+String(100/numColumns)+"px)";
			scoretable.style.maxWidth = ((200*numColumns)+100)+"px";
			var otherColumnsMaxWidth = (200*numColumns)+"px";

			// Adds <h2> header
			clearExisting(game,"st-h2",no);
			var h2 = document.createElement("H2");
			h2.id = game+no+"-st-h2";
			h2.style.width = ((200*numColumns)+100)+"px";
			if (repeat != 1) {
				var subgame = game_info[returnGameIndex(game,"game")][getIndex("game-h2")[0]][getIndex("game-h2")[1]+no];
				if (subgame == undefined) {subgame = "";} else {subgame += " ";}
				h2.innerHTML = subgame+getGameInfo(game,"game-h2")+" Scoretable";}
			else {
				h2.innerHTML = getGameInfo(game,"game-h2")+" Scoretable";
			}
			tableContainer.appendChild(h2);

			// Creates first column
			var firstColumn = document.createElement("SECTION");
			firstColumn.className = "st-firstcolumn";
			for (var rn = 0; rn < numRows; rn++) {
				var currentCell = document.createElement("SECTION");
				currentCell.className = "st-cell";
				currentCell.style.backgroundColor = getGameInfo(game,"game-bgcolor");

				if (rn == 0) { // FIRST ROW only
					currentCell.className = "st-cell st-firstrow";
					currentCell.innerHTML = "Round";
				} else if (rn == (numRows-1)) { // LAST ROW only
					currentCell.className = "st-cell st-lastrow";
					currentCell.innerHTML = "Total";
				} else { // OTHER ROWS (round numbers)
					if (game == "fc") {
						switch (rn+2) {
							case 11: currentCell.innerHTML = "J"; break;
							case 12: currentCell.innerHTML = "Q"; break;
							case 13: currentCell.innerHTML = "K"; break;
							default: currentCell.innerHTML = rn+2; break;
						}}
					else {currentCell.innerHTML = rn;}
				}

				// IMPORTANT: Adds cell to end of column
				firstColumn.appendChild(currentCell);
			}
			scoretable.appendChild(firstColumn);

			// Creates other rows
			var otherColumns = document.createElement("SECTION");
			otherColumns.className = "st-othercolumns";
			otherColumns.style.width = otherColumnsWidth;
			otherColumns.style.maxWidth = otherColumnsMaxWidth;
			for (var rn = 0; rn < numRows; rn++) {
				// Creates a row, gives it class st-row
				var currentRow = document.createElement("SECTION");
				currentRow.className = "st-row";

				// Creates row content
				if (rn == 0) {					// FIRST ROW only
					for (var cn = 1; cn <= numColumns; cn++) {
						var currentCell = document.createElement("SECTION");
						currentCell.className = "st-cell st-firstrow";
						currentCell.style.width = colwidth;
						currentCell.style.backgroundColor = getGameInfo(game,"game-bgcolor");

						if (cn == (numColumns)) { currentCell.className = "st-cell st-firstrow st-lastcolumn"; }

						var value = master_scores[returnGameIndex(game,"game")][no-1][cn-1][rn];

						for (var i = 0; i < master_scores[returnGameIndex(game,"game")].length; i++) {
							if (master_scores[returnGameIndex(game,"game")][i][cn-1][rn] != "") {
								value = master_scores[returnGameIndex(game,"game")][i][cn-1][rn];
							}
						}
						currentCell.innerHTML = "<input id='"+game+no+"-player"+cn+"name' class='st-playername "+game+no+"-playername' type='text' placeholder='Player "+cn+"' value='"+value+"' oninput='updateMasterScores(\""+game+"\","+no+","+cn+","+rn+",this.value)'>";

						// IMPORTANT: Adds cell to end of row
						currentRow.appendChild(currentCell);
					}
				} else if (rn == numRows-1) {	// LAST ROW only
					for (var cn = 1; cn <= numColumns; cn++) {
						var currentCell = document.createElement("SECTION");
						currentCell.className = "st-cell st-lastrow "+game+no+"-playertotal";
						currentCell.style.width = colwidth;
						currentCell.style.backgroundColor = getGameInfo(game,"game-bgcolor");

						if (cn == numColumns) {currentCell.className = "st-cell st-lastrow "+game+no+"-playertotal st-lastcolumn";}

						currentCell.id = game+no+"-pt-"+cn;

						// IMPORTANT: Adds cell to end of row
						currentRow.appendChild(currentCell);
					}
				} else {						// Other rows (round rows)
					for (var cn = 1; cn <= numColumns; cn++) {
						var currentCell = document.createElement("SECTION");
						currentCell.className = "st-cell";
						currentCell.style.width = colwidth;

						var value = "";
						if (master_scores[returnGameIndex(game,"game")][no-1][cn-1][rn] != 0)
							{value = master_scores[returnGameIndex(game,"game")][no-1][cn-1][rn];}

						currentCell.innerHTML = "<input id='"+game+no+"-cell-p"+cn+"r"+rn+"' class='st-scorein "+game+no+"-round"+rn+" "+game+no+"-player"+cn+"' type='text' placeholder='0' value='"+value+"' oninput='updateMasterScores(\""+game+"\","+no+","+cn+","+rn+",this.value,this.id)'>";

						// Dealer Cell
						if (cn-1==(rn-1)%numColumns && getGameInfo(game,"enableDC")==1) {
							currentCell.className = "st-cell st-dealercell";
							if (getGameInfo(game,"dealerbonus") != 0) {
								currentCell.innerHTML += "<input type='checkbox' id='"+game+no+"-p"+cn+"r"+rn+"-db' class='dealer-bonus' onclick='assignDealerBonus(\""+game+"\","+no+","+cn+","+rn+", this.checked,this.id)'>";
								currentCell.style.width = "calc("+colwidth+" - 14px)";
								currentCell.className = "st-cell st-dealercell st-dealerbonus";
							}
						} else { // Apply default background color for the game
							currentCell.style.backgroundColor = getGameInfo(game,"game-bgcolor");
						}

						// IMPORTANT: Adds cell to end of column
						currentRow.appendChild(currentCell);
					}
				}
				// IMPORTANT: Adds column to scoretable
				otherColumns.appendChild(currentRow);
			}
			scoretable.appendChild(otherColumns);
			tableContainer.appendChild(scoretable);
			errorMessage.style.display = "none";
			if (document.getElementById(game+no+"-container") == null) {document.getElementById(game+"-screen").appendChild(tableContainer);}

		} else {
			scoretable.style.display = "none";
			errorMessage.style.display = "block";
		}
	}
	calculatePlayerTotals(game);
}
function assignDealerBonus(game,no,player,index,isChecked,id) {
	var bonus = getGameInfo(game,"dealerbonus");
	if (isChecked == false) {bonus *= -1;}

	var value = master_scores[returnGameIndex(game,"game")][no-1][player-1][index];
	var newValue = value + bonus;

	updateMasterScores(game,no,player,index,newValue,id);
}
function calculatePlayerTotals(game) {			// Calculates total cells for regular scoretables
	var repeat = getGameInfo(game,"numTables");
	for (var no = 1; no <= repeat; no++) {
		var numPlayers = getGameInfo(game,"numPlayers");
		for (var cn = 1; cn <= numPlayers; cn++) { // For each player...
			var playerTotal = 0;
			var roundTotalsArray = master_scores[returnGameIndex(game,"game")][no-1][cn-1].slice(1); // Returns new array, not reference
			var roundTotalsCells = document.getElementsByClassName(game+no+"-player"+cn);
			var roundTotalsSorted = [];
			for (var m = 0; m < roundTotalsArray.length; m++) {
				roundTotalsSorted[m] = roundTotalsArray[m];
			}

			roundTotalsSorted.sort(function(a, b){return b - a});

			for (var cell = 0; cell < roundTotalsCells.length; cell++) {
				roundTotalsCells[cell].style.color = "#fff8ed";
			}

			var startIndex = 0;
			if (getGameInfo(game,"elimHighest") == true) {
				startIndex = 1;
				for (var cell = 0; cell < roundTotalsCells.length; cell++) {
					if (roundTotalsCells[cell].value == roundTotalsSorted[0]) {
						roundTotalsCells[cell].style.color = "#f00";
						cell = roundTotalsCells.length;
					}
					else {roundTotalsCells[cell].style.color = "#fff8ed";}
				}
			}
			for (var m = startIndex; m < roundTotalsArray.length; m++) {
				if (roundTotalsSorted[m] != 0) {playerTotal += roundTotalsSorted[m];}
			}
			document.getElementById(game+no+"-pt-"+cn).innerHTML = playerTotal;
		}
	}
	createLeaderboard(game);
}

function createIncrementingScoretables(game) {	// Creates incrementing scoretables
	var repeat = getGameInfo(game,"numTables");
	for (var no = 1; no <= repeat; no++) {
		// Gets or creates container for scoretable & leaderboard
		var tableContainer;
		if (document.getElementById(game+no+"-container") == null) {
			tableContainer = document.createElement("DIV");
			tableContainer.id = game+no+"-container";
			tableContainer.className = "table-container";
			if (no == repeat) {tableContainer.className += " tc-last";}
		} else {
			tableContainer = document.getElementById(game+no+"-container");
			if (no == repeat) {tableContainer.className = "table-container tc-last";}
			else {tableContainer.className = "table-container";}
		}

		// Delete existing scoretable & create new
		clearExisting(game,"scoretable",no);
		var scoretable = document.createElement("DIV");
		scoretable.id = game+no+"-scoretable";
		scoretable.className = "scoretable incrementing-scoretable "+game+"-scoretable";
		var numPlayers = getGameInfo(game,"numPlayers") + 1;

		var errorMessage = document.getElementById("em-"+game+"table");

		if (numPlayers > 1) {

			// Adds <h2>
			clearExisting(game,"st-h2",no)
			var h2 = document.createElement("H2");
			h2.id = game+no+"-st-h2";
			h2.style.maxWidth = "700px";
			if (repeat != 1) {
				var subgame = game_info[returnGameIndex(game,"game")][getIndex("game-name")[0]][no+1];
				if (subgame == undefined) {subgame = "";} else {subgame += " ";}
				h2.innerHTML = subgame+" "+getGameInfo(game,"game-h2")+" Scoretable";}
			else {
				h2.innerHTML = getGameInfo(game,"game-h2")+" Scoretable";
			}
			tableContainer.appendChild(h2);

			// Creates columns
			for (var cn = 0; cn <= 3; cn++) {
				var currentColumn = document.createElement("SECTION");
				currentColumn.className = "ist-column ist-column"+cn;

				for (var rn = 0; rn < numPlayers; rn++) {
					var currentCell = document.createElement("SECTION");
					currentCell.className = "ist-cell";
					currentCell.style.backgroundColor = getGameInfo(game,"game-bgcolor");

					if (rn == 0) {	// FIRST ROW only
						currentCell.className = "ist-cell ist-firstrow";
						switch (cn) {
							case 0: currentCell.innerHTML = "Player"; break;
							case 1: currentCell.innerHTML = "Total"; break;
							case 2: currentCell.innerHTML = "Plus"; break;
							case 3: currentCell.innerHTML = "Minus"; break;
						}
					} else {		// OTHER ROWS (each player)
						switch (cn) {
							case 0:
								var value = master_scores[returnGameIndex(game,"game")][no-1][rn-1][0];
								currentCell.innerHTML = "<input class='ist-playername' id='"+game+no+"-player"+rn+"name' type='text' placeholder='Player "+rn+"' value='"+value+"' oninput='updateMasterScores(\""+game+"\","+no+","+rn+",0,this.value)'>";
								break;
							case 1:
								var pt = document.createElement("SECTION");
								pt.className = "ist-playertotal "+game+no+"-playertotal";
								pt.id = game+no+"-pt-"+rn;
								pt.innerHTML = master_scores[returnGameIndex(game,"game")][no-1][rn-1][1];
								currentCell.appendChild(pt);
								break;
							case 2:
								currentCell.innerHTML = "<button class='ist-plus "+game+no+"-plus' id='"+game+no+"-plus-p"+rn+"' onclick='istChangeScore(\""+game+"\",\"inc\","+rn+","+no+")'>+"+getGameInfo(game,"inc")+"</button>";
								break;
							case 3:
								currentCell.innerHTML = "<button class='ist-minus "+game+no+"-minus' id='"+game+no+"-minus-p"+rn+"' onclick='istChangeScore(\""+game+"\",\"dec\","+rn+","+no+")'>–"+getGameInfo(game,"dec")+"</button>";
								break;
						}
					}
					// IMPORTANT: Adds cell to end of column
					currentColumn.appendChild(currentCell);
				}
				scoretable.appendChild(currentColumn);
			}
			tableContainer.appendChild(scoretable);
			errorMessage.style.display = "none";
			document.getElementById(game+"-screen").appendChild(tableContainer);

		} else {
			scoretable.style.display = "none";
			errorMessage.style.display = "block";
		}
	}
	createLeaderboard(game);
}
function istChangeScore(game,key,player,no) {	// Change player score (for incrementing scoretables)
	// Get total cell & absolute value of change
	var totalCell = document.getElementById(game+no+"-pt-"+player);
	var change = getGameInfo(game,key);

	// Apply change to master_scores
	if (key == "inc") {
		master_scores[returnGameIndex(game,"game")][no-1][player-1][1] += change;
	} else if (key == "dec") {
		master_scores[returnGameIndex(game,"game")][no-1][player-1][1] -= change;
	}

	// Print new total in totalCell
	totalCell.innerHTML = master_scores[returnGameIndex(game,"game")][no-1][player-1][1];
	createLeaderboard(game, no);
}

function createLeaderboard(game) {				// Creates leaderboard
	var repeat = getGameInfo(game,"numTables");
	for (var no = 1; no <= repeat; no++) {
		clearExisting(game,"lb-h2",no);
		clearExisting(game,"leaderboard",no);

		var playerRawTotals = document.getElementsByClassName(game+no+'-playertotal');
		var playerRawNames = master_scores[returnGameIndex(game,"game")][no-1].slice();
		var playerTotals = [];
		var playerTotalsSorted = [];
		var playerNames = [];
		for (var m = 0; m < playerRawTotals.length; m++) { // Gets actual player totals
			playerNames[m] = playerRawNames[m][0].slice();
			playerTotals[m] = [parseInt(playerRawTotals[m].innerHTML),playerNames[m],0];
			playerTotalsSorted[m] = playerTotals[m][0];

			// Changes all total cells to default background color
			playerRawTotals[m].style.backgroundColor = getGameInfo(game,"game-bgcolor");
		}
		if (getGameInfo(game,"sd") != 0) {
			// Sort (and assign place numbers) based on sorting direction
			var tableContainer = document.getElementById(game+no+"-container");

			//console.log(playerTotals,playerNames);

			var leaderboard = document.createElement("DIV");
			leaderboard.id = game+no+'-leaderboard';
			leaderboard.className = "leaderboard";
			leaderboard.innerHTML = "";

			var h2 = document.createElement("H2");
			h2.innerHTML = "Leaderboard";
			h2.style.width = "680px";
			h2.id = game+no+"-lb-h2";
			tableContainer.appendChild(h2);

			var scoringDirection = getGameInfo(game,"sd");
			if (scoringDirection == -1) {playerTotalsSorted.sort(function(a, b){return a - b});}
			if (scoringDirection == 1) {playerTotalsSorted.sort(function(a, b){return b - a});}

			var currentPlace = 1;
			var placesCovered = 1;
			var topPlaces = 1;
			for (var i = 0; i <= playerTotalsSorted.length; i++) {
				for (var j = 0; j < playerTotals.length; j++) {
					if (playerTotalsSorted[i] == playerTotals[j][0]) {
						if (!playerTotals[j][2]) {
							var currentRow = document.createElement("SECTION");
							currentRow.className = "lb-row lb-rank"+topPlaces

							var currentRank = document.createElement("SECTION");
							currentRank.className = "lb-cell lb-rank";
							currentRank.innerHTML = "#"+currentPlace;

							var currentName = document.createElement("SECTION");
							currentName.className = "lb-cell lb-name";
							currentName.innerHTML = playerTotals[j][1];

							var currentScore = document.createElement("SECTION");
							currentScore.className = "lb-cell lb-score";
							currentScore.innerHTML = playerTotals[j][0];

							currentRow.appendChild(currentRank);
							currentRow.appendChild(currentName);
							currentRow.appendChild(currentScore);
							leaderboard.appendChild(currentRow);

							// Manipulates gold/silver/bronze labels on table
							if (!getGameInfo(game,"isIST")) {
								switch (topPlaces) {
									case 1: playerRawTotals[j].style.backgroundColor = colors.gold;  break;
									case 2: playerRawTotals[j].style.backgroundColor = colors.silver; break;
									case 3: playerRawTotals[j].style.backgroundColor = colors.bronze; break;
								}
							}

							playerTotals[j][2] = true;
							placesCovered++;
						}
					}
				}
				if (i+1 != playerTotalsSorted.length) {if (playerTotalsSorted[i] != playerTotalsSorted[i+1]) {
					currentPlace = placesCovered;
					topPlaces++;
				}}
			}
			tableContainer.appendChild(leaderboard);
		}
	}
}

// ************************* Set and change game information ***********************************

var game_info = [ // Format: [game,preferences,changeable_settings]. 0    1   2  3  4  5  6      0 1 2 3 4 5 6 7 8 9
	[["gyn","#222","Get Your Neighbor"], 						  [false, 1, -1, 4, 4,-50,1],	[0,1,1,0,0,0,0,0,0,1]],
	[["fc", "#710071","Five Crowns"],							  [false, 1, -1, 4, 11,0, 1],	[0,1,0,0,0,0,0,0,0,1]],
	[["sol","#030","Solitaire","In-Hand","4-Ace","Combine-Pile","Clock"], [false, 4, -1, 2, 4, 0, 0],	[0,1,1,0,1,0,0,0,0,1]],
	[["inc","#222","Incrementing"],								  [true,  1,  1, 4, 1, 1, 1],	[1,1,0,1,0,0,0,1,1,1]],
	[["gen","#111","General"],									  [false, 1,  1, 4, 4, 0, 1],	[1,1,1,1,0,1,1,0,0,1]],
];

var gameinfo_key = [
	[0,null,"game-name"],
	[0,0,"game"],
	[0,1,"game-bgcolor"],
	[0,2,"game-h2"],

	[1,null,"preferences"],
	[1,0,"isIST"],
	[1,1,"numTables"],
	[1,2,"sd"],
	[1,3,"numPlayers"],
	[1,4,"numRounds"],
	[1,5,"dealerbonus"], // ST (excluding SOL) only
	[1,6,"enableDC"], // ST (excluding SOL) only
	[1,5,"elimHighest"], // SOL only
	[1,5,"inc"], // INC only
	[1,6,"dec"], // INC only

	[2,null,"changeable_settings"],
	[2,0,"setting-numTables"],
	[2,1,"setting-numPlayers"],
	[2,2,"setting-numRounds"],
	[2,3,"setting-sd"],
	[2,4,"setting-elimHighest"],
	[2,5,"setting-enableDC"],
	[2,6,"setting-dealerbonus"],
	[2,7,"setting-inc"],
	[2,8,"setting-dec"],
	[2,9,"setting-clear"],
];

var settings_info = [
	["key", 		"isInput",	"label", 			"id",			"optionLabels",	5,				6],
	["numTables",	true,		"No. of Tables",	"numtables"],
	["numPlayers",	true,		"No. of Players",	"numplayers"],
	["numRounds",	true,		"No. of Rounds",	"numrounds"],
	["sd",			false,		"Scoring",			"changeSD",		[-1,"Low"],		[0,"None"],		[1,"High"]],
	["elimHighest",	false,		"Eliminate",		"elimHighest",	[1,"Highest"],	[0,"None"]],
	["enableDC",	false,		"Dealer Cells",		"changeDC",		[1,"On"],		[0,"Off"]],
	["dealerbonus",	true,		"Dealer Bonus",		"changeDB"],
	["inc",			true,		"Increment By",		"changeINC"],
	["dec",			true,		"Decrement By",		"changeDEC"],
	["clear",		false,		"Clear",			"clear", 		["clear","All"]],
];

function getGameInfo(game,key) {
	var index = getIndex(key);
	for (var i = 0; i < game_info.length; i++) {
		if (game_info[i][0][0] == game) {return game_info[i][index[0]][index[1]];}
	}
}
function getSettingInfo(settingID) {
	return settings_info[settingID];
}
function getIndexSettingsInfo(key) {
	for (var i = 0; i < settings_info[0].length; i++) {
		if (settings_info[0][i] == key) {
			//console.log(settings_info[0][i],i);
			return i;
		}
	}
}
function getGameInfoWithIndex(gameIndex, key) {
	var index = getIndex(key);
	return game_info[gameIndex][index[0]][index[1]];
}
function setGameInfo(game,key,newValue) {
	var index = getIndex(key);
	for (var i = 0; i < game_info.length; i++) {
		if (game_info[i][0][0] == game) {game_info[i][index[0]][index[1]] = newValue; console.log("Updated value: "+newValue); return;}
	}
}
function getIndex(key) {
	for (var i = 0; i < gameinfo_key.length; i++) {
		if (gameinfo_key[i][2] == key) {return gameinfo_key[i];}
	}
	console.log("Invalid key");
}
function returnGameIndex(value, key) { // Index of game in order of games
	var index = getIndex(key);
	for (var i = 0; i < game_info.length; i++) {
		if (game_info[i][index[0]][index[1]] == value) {return i;}
	}
}
function returnGameKeyIndex(value, key) {
	for (var i = 0; i < gameinfo_key.length; i++) {
		if (gameinfo_key[i][2] == value) {return i;}
	}
}
function returnSettingIndex(key) {
	for (var i = 0; i < settings_info.length; i++) {
		if (settings_info[i][0] == key) {return i;}
	}
}

function updateGameInfo(game,key,newValue,id) {
	// Redirect certain keys to other functions
	if (key == "clear") {confirmClear(game);}
	else {
		var isInput = settings_info[returnSettingIndex(key)][getIndexSettingsInfo("isInput")];

		if (isInput == false) { // Only uses game,key
			var setting_info = settings_info[returnSettingIndex(key)];
			var button = document.getElementById(game+"-"+setting_info[getIndexSettingsInfo("id")]);
			var oldValue = getGameInfo(game,key);
			var indexNew;

			var startIndex = getIndexSettingsInfo("optionLabels");
			for (var indexOld = startIndex; indexOld < setting_info.length; indexOld++) {
				if (setting_info[indexOld][0] == oldValue) {
					if (indexOld == setting_info.length-1) {indexNew = startIndex;}
					else {indexNew = indexOld + 1;}
					setGameInfo(game,key,setting_info[indexNew][0]);
					button.innerHTML = setting_info[indexNew][1];
				}
			}
			// Re-create scoretable
			if (getGameInfo(game,"isIST") == true) {createIncrementingScoretables(game);}
			else {createScoretables(game);}
		}
		else if (isInput == true) { // Uses game,key,value,id
			newValue = parseInt(newValue);
			if (newValue > 0) {
				// Set new value
				setGameInfo(game,key,newValue);

				// Cause the effects of the value change
				var game_index = returnGameIndex(game,"game");

				if (key == "numTables") {		// If numTables changed
					while (master_scores[game_index].length < newValue) { // Add new table(s)
						var newTable = [];
						var indexP = getIndex("numPlayers");
						for (var j = 0; j < game_info[game_index][indexP[0]][indexP[1]]; j++) {
							var player = [];
							player[0] = "";
							var indexR = getIndex("numRounds");
							for (var l = 0; l < game_info[game_index][indexR[0]][indexR[1]]; l++) {
								player[l+1] = 0;
							}
							newTable[j] = player;
						}
						master_scores[game_index][master_scores[game_index].length] = newTable;
					}
					while (master_scores[game_index].length > newValue) { // Remove table(s)
						master_scores[game_index].pop();
						clearExisting(game,"container",(master_scores[game_index].length+1));
					}
}
				else if (key == "numPlayers") {	// If numPlayers changed
					var indexT = getIndex("numTables");
					for (var table = 0; table < game_info[game_index][indexT[0]][indexT[1]]; table++) { // for every table
						while (master_scores[game_index][table].length < newValue) { // Add new player(s)
							var player = [];
							player[0] = "";
							var indexR = getIndex("numRounds");
							for (var l = 0; l < game_info[game_index][indexR[0]][indexR[1]]; l++) {
								player[l+1] = 0;
							}
							master_scores[game_index][table][master_scores[game_index][table].length] = player;
						}
						while (master_scores[game_index][table].length > newValue) { // Remove player(s)
							master_scores[game_index][table].pop();
						}
					}}
				else if (key == "numRounds") {	// If numRounds changed
					var indexT = getIndex("numTables");
					for (var table = 0; table < game_info[game_index][indexT[0]][indexT[1]]; table++) { // for every table
						var indexP = getIndex("numPlayers");
						for (var player = 0; player < game_info[game_index][indexP[0]][indexP[1]]; player++) {
							while (master_scores[game_index][table][player].length < newValue+1) { // Add new round(s)
								master_scores[game_index][table][player][master_scores[game_index][table][player].length] = 0;
							}
							while (master_scores[game_index][table][player].length > newValue+1) { // Remove round(s)
								master_scores[game_index][table][player].pop();
							}
						}
					}}
				else if (key == "inc") {		// If increment number changed
					var buttons = document.getElementsByClassName(game+"-plus");
					for (var i = 0; i < buttons.length; i++) {buttons[i].innerHTML = "+"+getGameInfo(game,key);}}
				else if (key == "dec") {		// If decrement number changed
					var buttons = document.getElementsByClassName(game+"-minus");
					for (var i = 0; i < buttons.length; i++) {buttons[i].innerHTML = "–"+getGameInfo(game,key);}
				}

				// Re-create scoretable
				if (getGameInfo(game,"isIST") == true) {createIncrementingScoretables(game);}
				else {createScoretables(game);}
			} else {
				document.getElementById(id).value = getGameInfo(game,key);
				console.log("Incorrect setting");
			}
		}
	}
}

function confirmClear(game) { // Add more specific clearing functionality
	if (confirm("Are you sure you want to clear ALL the scores from the "+getGameInfo(game,"game-h2")+" scoretable(s)?")) {
		var game_index = returnGameIndex(game,"game");
		master_scores[game_index] = [];

		var new_game = [];
		var index2 = getIndex("numTables");
		for (var j = 0; j < game_info[game_index][index2[0]][index2[1]]; j++) { // For each table (sol has 3) (dimension 2)
			var table = [];
			var index3 = getIndex("numPlayers");
			for (var k = 0; k < game_info[game_index][index3[0]][index3[1]]; k++) { // For each player (dimension 3)
				var player = [];
				player[0] = "";
				var index4 = getIndex("numRounds");
				for (var l = 0; l < game_info[game_index][index4[0]][index4[1]]; l++) { // For each score & player name (dimension 4)
					player[l+1] = 0;
				}
				table[k] = player;
			}
			new_game[j] = table;
		}
		master_scores[game_index] = new_game;

		if (getGameInfo(game,"isIST") == true) {createIncrementingScoretables(game);}
		else {createScoretables(game);}
	}
}

colors = { gold:'#caa800', silver:'#999', bronze:'#9d5700' };
// Alternative colors: blue, red, white, white, green, pink, purple, gray, light blue

// ***************************** Utilities *************************************
function clearExisting(game, string, no) {
	if (no == undefined) {no = "";}
	if (document.getElementById(game+no+'-'+string) != null) {document.getElementById(game+no+'-'+string).parentNode.removeChild(document.getElementById(game+no+'-'+string))}
	return;
}

app_setup();
