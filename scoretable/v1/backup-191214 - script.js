
// Nav buttons & hide/show screens on page load
document.getElementById('nb-home').style.color = "#07a";
function changeScreen(screenName, buttonName) {
    // Hide all screens
    var screens = document.getElementsByClassName('screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].style.display = 'none';
    }
    // Show corresponding screen
    document.getElementById(screenName).style.display = "block";

    // Make all buttons the default color
    var buttons = document.getElementsByClassName('nav-button');
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].style.color = '#09e';
    }
    // Add special color to active "link"
    document.getElementById(buttonName).style.color = "#07a";
}

// ************************* Creates scoretables ***********************************
var master_scores = []; // Filled in with initializeMasterScores()

function initializeMasterScores() {
	for (var i = 0; i < preferences.length; i++) { // For each game (dimension 1)
		var game = [];
		for (var j = 0; j < preferences[i][2]; j++) { // For each table (sol has 3) (dimension 2)
			var table = [];
			for (var k = 0; k < preferences[i][4]; k++) { // For each player (dimension 3)
				var player = [];
				player[0] = "";
				for (var l = 0; l < preferences[i][5]; l++) { // For each score & player name (dimension 4)
					player[l+1] = 0;
				}
				table[k] = player;
			}
			game[j] = table
		}
		master_scores[i] = game;
	}
}

function importScoretable() {
	// Set up a way to user-input an array directly to code, with the first row being preferences and the rest being scores
}

function updateScore(game, index, newValue) {
	for (var i = 0; i < master_values.length; i++) {
		for (var j = 0; j < master_values[i].length; j++) {
			if (game = master_values[i][j][0]) {
				master_values[i][j][index] = newValue;
				updateScoretable(game)
			}
		}
	}
}


function createInitialScoretable(game, no) {
	if (no == undefined) {no = "";}
	clearExisting(game,"scoretable",no);

    var scoretable = document.createElement("DIV");
	scoretable.id = game+no+"-scoretable";
    scoretable.className = "scoretable";
    var numPlayers = parseInt(document.getElementById(game+"-numplayers").value);
    var numRounds;
    if (game == "fc") {numRounds = 13;}
    else {numRounds = parseInt(document.getElementById(game+"-numrounds").value) + 2;}

	var numColumns = numPlayers; var numRows = numRounds;

    var errorMessage = document.getElementById("em-"+game+"table");

    if (numColumns>0 && numRows>1) {
        scoretable.style.display = "block";
		if (numColumns == 1) {	scoretable.style.maxHeight = ((52*numRounds)+30) + "px";}
		else {					scoretable.style.maxHeight = ((52*numRounds)+2) + "px";}
        errorMessage.style.display = "none";

        scoretable.id = game+no+"-scoretable";

        // Deletes pre-existing table
        scoretable.innerHTML = "";

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
		switch (game) {
			case "gyn": h2.innerHTML = "Get Your Neighbor Scoretable"; break;
			case "fc": h2.innerHTML = "Five Crowns Scoretable"; break;
			case "gen": h2.innerHTML = "General Scoretable"; break;
			case "sol": switch (no) {
				case 1: h2.innerHTML = "4-Ace Solitaire Scoretable"; break;
				case 2: h2.innerHTML = "Combine Pile Solitaire Scoretable"; break;
				case 3: h2.innerHTML = "In-Hand Solitaire Scoretable"; break;
			} break;
		}
		document.getElementById(game+"-screen").appendChild(h2);

        // Creates first column
        var currentColumn = document.createElement("SECTION");
        currentColumn.className = "st-firstcolumn";
        for (var rn = 0; rn < numRows; rn++) {
            var currentCell = document.createElement("SECTION");
            currentCell.className = "st-cell";

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
            currentColumn.appendChild(currentCell);
        }
        scoretable.appendChild(currentColumn);


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
            if (rn == 0) {                    // FIRST ROW only
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell st-firstrow";
                    currentCell.style.width = colwidth;

					if (cn == (numColumns)) { currentCell.className = "st-cell st-firstrow st-lastcolumn"; }
                    currentCell.innerHTML = "<input class='st-playername "+game+no+"-playername' type='text' placeholder='Player "+cn+"' onchange='calculatePlayerTotals(\""+game+"\", "+numColumns+","+no+")'>";

                    // IMPORTANT: Adds cell to end of row
                    currentRow.appendChild(currentCell);
                }
            } else if (rn == (numRows-1)) {   // LAST ROW only
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell st-lastrow "+game+no+"-playertotal";
                    currentCell.style.width = colwidth;

					if (cn == (numColumns)) {currentCell.className = "st-cell st-lastrow "+game+no+"-playertotal st-lastcolumn";}
                    currentCell.id = game+no+"-pt-"+cn;

                    // IMPORTANT: Adds cell to end of row
                    currentRow.appendChild(currentCell);
                }
            } else {                          // Other rows (round rows)
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell";
                    currentCell.style.width = colwidth;

                    // Dealer Cell
                    if (cn-1==(rn-1)%numColumns && game!="sol") {
                        currentCell.className = "st-cell st-dealercell";
						currentCell.style.backgroundColor = "#014";
                    }
                    currentCell.innerHTML = "<input class='st-scorein "+game+no+"-round"+rn+" "+game+no+"-player"+cn+"' type='text' placeholder='0' id='"+game+no+"-cell-p"+cn+"r"+rn+"' onchange='calculatePlayerTotals(\""+game+"\", "+numColumns+","+no+")'>";

                    // IMPORTANT: Adds cell to end of column
                    currentRow.appendChild(currentCell);
                }

            }
            // IMPORTANT: Adds column to scoretable
            otherColumns.appendChild(currentRow);
        }
        scoretable.appendChild(otherColumns);
		document.getElementById(game+"-screen").appendChild(scoretable);
        calculatePlayerTotals(game, no);

    } else {
        scoretable.style.display = "none";
        errorMessage.style.display = "block";
    }
}

function createScoretable(game, no) {
	if (no == undefined) {no = "";}
	clearExisting(game,"scoretable",no);

    var scoretable = document.createElement("DIV");
	scoretable.id = game+no+"-scoretable";
    scoretable.className = "scoretable";
    var numPlayers = parseInt(document.getElementById(game+"-numplayers").value);
    var numRounds;
    if (game == "fc") {numRounds = 13;}
    else {numRounds = parseInt(document.getElementById(game+"-numrounds").value) + 2;}

	var numColumns = numPlayers; var numRows = numRounds;

    var errorMessage = document.getElementById("em-"+game+"table");

    if (numColumns>0 && numRows>1) {
        scoretable.style.display = "block";
		if (numColumns == 1) {	scoretable.style.maxHeight = ((52*numRounds)+30) + "px";}
		else {					scoretable.style.maxHeight = ((52*numRounds)+2) + "px";}
        errorMessage.style.display = "none";

        scoretable.id = game+no+"-scoretable";

        // Deletes pre-existing table
        scoretable.innerHTML = "";

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
		switch (game) {
			case "gyn": h2.innerHTML = "Get Your Neighbor Scoretable"; break;
			case "fc": h2.innerHTML = "Five Crowns Scoretable"; break;
			case "gen": h2.innerHTML = "General Scoretable"; break;
			case "sol": switch (no) {
				case 1: h2.innerHTML = "4-Ace Solitaire Scoretable"; break;
				case 2: h2.innerHTML = "Combine Pile Solitaire Scoretable"; break;
				case 3: h2.innerHTML = "In-Hand Solitaire Scoretable"; break;
			} break;
		}
		document.getElementById(game+no+"-screen").appendChild(h2);

        // Creates first column
        var currentColumn = document.createElement("SECTION");
        currentColumn.className = "st-firstcolumn";
        for (var rn = 0; rn < numRows; rn++) {
            var currentCell = document.createElement("SECTION");
            currentCell.className = "st-cell";

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
            currentColumn.appendChild(currentCell);
        }
        scoretable.appendChild(currentColumn);


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
            if (rn == 0) {                    // FIRST ROW only
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell st-firstrow";
                    currentCell.style.width = colwidth;

					if (cn == (numColumns)) { currentCell.className = "st-cell st-firstrow st-lastcolumn"; }
                    currentCell.innerHTML = "<input class='st-playername "+game+no+"-playername' type='text' placeholder='Player "+cn+"' onchange='calculatePlayerTotals(\""+game+"\", "+no+")'>";

                    // IMPORTANT: Adds cell to end of row
                    currentRow.appendChild(currentCell);
                }
            } else if (rn == (numRows-1)) {   // LAST ROW only
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell st-lastrow "+game+no+"-playertotal";
                    currentCell.style.width = colwidth;

					if (cn == (numColumns)) {currentCell.className = "st-cell st-lastrow "+game+no+"-playertotal st-lastcolumn";}
                    currentCell.id = game+no+"-pt-"+cn;

                    // IMPORTANT: Adds cell to end of row
                    currentRow.appendChild(currentCell);
                }
            } else {                          // Other rows (round rows)
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell";
                    currentCell.style.width = colwidth;

                    // Dealer Cell
                    if (cn-1==(rn-1)%numColumns && game!="sol") {
                        currentCell.className = "st-cell st-dealercell";
						currentCell.style.backgroundColor = "#014";
                    }
                    currentCell.innerHTML = "<input class='st-scorein "+game+no+"-round"+rn+" "+game+no+"-player"+cn+"' type='text' placeholder='0' id='"+game+no+"-cell-p"+cn+"r"+rn+"' onchange='calculatePlayerTotals(\""+game+"\", "+no+")'>";

                    // IMPORTANT: Adds cell to end of column
                    currentRow.appendChild(currentCell);
                }

            }
            // IMPORTANT: Adds column to scoretable
            otherColumns.appendChild(currentRow);
        }
        scoretable.appendChild(otherColumns);
		document.getElementById(game+no+"-screen").appendChild(scoretable);
        calculatePlayerTotals(game, no);

    } else {
        scoretable.style.display = "none";
        errorMessage.style.display = "block";
    }
}

function createMultipleScoretables(game, repeat) {
	for (var i = 1; i <= repeat; i++) {
		createScoretable(game, i)
	}
}

function appendScoretable(game,prefID) {
	var oldNumPlayers = matchPreferences(game,prefID);
	var newNumPlayers = parseInt(document.getElementById(game+no+"-numplayers").value);
	if (newNumPlayers > oldNumPlayers) {

	}
}

// ************************* Calculates SCORETABLE player totals ***********************************
function calculatePlayerTotals(game, no) {
	if (no == undefined) {no = "";}
	var playerRawTotals = document.getElementsByClassName(game+no+'-playertotal');
    for (var cn = 1; cn <= playerRawTotals.length; cn++) { // For each player...
        var playerRoundTotalsRaw = document.getElementsByClassName(game+no+"-player"+cn);;
        var playerTotal = 0;
	    var playerRoundTotals = new Array;
	    var playerRoundTotalsSorted = new Array;
	    for (var m = 0; m < playerRoundTotalsRaw.length; m++) { // Gets actual player totals
			if (isNaN(parseInt(playerRoundTotalsRaw[m].value))) {playerRoundTotals[m] = 0;}
			else if (playerRoundTotalsRaw[m].value == undefined) {playerRoundTotals[m] = 0;}
			else if (playerRoundTotalsRaw[m].value == "") {playerRoundTotals[m] = 0;}
			else {playerRoundTotals[m] = parseInt(playerRoundTotalsRaw[m].value);}
	        playerRoundTotalsSorted[m] = playerRoundTotals[m];
		}

		playerRoundTotalsSorted.sort(function(a, b){return b - a});

		var startIndex = 0; if (game == "sol") {startIndex = 1;}
        for (var m = startIndex; m < playerRoundTotalsRaw.length; m++) {
            if (playerRoundTotalsSorted[m] != 0) {playerTotal += playerRoundTotalsSorted[m];}
        }
        document.getElementById(game+no+"-pt-"+cn).innerHTML = playerTotal;
    }
	createLeaderboard(game, no);
}

// ************************* Creates incremeting scoretable ***********************************
function createIncrementingScoretable(game, no) {
	if (no == undefined) {no = "";}
	clearExisting(game,"scoretable",no);

    var scoretable = document.createElement("DIV");
    scoretable.className = "scoretable incrementing-scoretable";
    var numPlayers = parseInt(document.getElementById(game+"-numplayers").value) + 1;

    var errorMessage = document.getElementById("em-"+game+no+"table");

    if (numPlayers > 1) {
        //scoretable.style.maxHeight = (52*numPlayers)+2) + "px";
        errorMessage.style.display = "none";
		scoretable.id = game+no+"-scoretable";

        // Deletes pre-existing table
        scoretable.innerHTML = "";

		// Adds <h2>
		clearExisting(game,"ist-h2",no)
		var h2 = document.createElement("H2");
		h2.id = game+no+"-ist-h2";
		switch (game) {
			case "inc": h2.innerHTML = "Incrementing Scoretable"; break;
		}
		h2.style.maxWidth = "700px";
		document.getElementById(game+no+"-screen").appendChild(h2);

        // Creates columns
        for (var cn = 0; cn <= 3; cn++) {
			var currentColumn = document.createElement("SECTION");
	        currentColumn.className = "ist-column ist-column"+cn;

			for (var rn = 0; rn < numPlayers; rn++) {
	            var currentCell = document.createElement("SECTION");
	            currentCell.className = "ist-cell";

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
						case 0: currentCell.innerHTML = "<input class='ist-playername "+game+no+"-playername' type='text' placeholder='Player "+rn+"' onchange='createLeaderboard(\""+game+"\", true, "+no+")'>"; break;
						case 1: var pt = document.createElement("SECTION"); pt.className = "ist-playertotal "+game+no+"-playertotal"; pt.id = game+no+"-pt-"+rn; pt.innerHTML = "0"; currentCell.appendChild(pt); break;
						case 2: currentCell.innerHTML = "<button class='ist-plus "+game+no+"-plus' id='"+game+no+"-plus-p"+rn+"' onclick='istChangeScore(\""+game+"\",\"plus\","+rn+")'>+"+matchPreferences(game,6)+"</button>"; break;
						case 3: currentCell.innerHTML = "<button class='ist-minus "+game+no+"-minus' id='"+game+no+"-minus-p"+rn+"' onclick='istChangeScore(\""+game+"\",\"minus\","+rn+")'>–"+matchPreferences(game,7)+"</button>"; break;
					}
	            }

            // IMPORTANT: Adds cell to end of column
            currentColumn.appendChild(currentCell);
		}
        scoretable.appendChild(currentColumn);
		document.getElementById(game+no+"-screen").appendChild(scoretable);
		createLeaderboard(game, no);
	}

    } else {
        scoretable.style.display = "none";
        errorMessage.style.display = "block";
    }
}

// ****************** Calculate incrementing scoretable player scores ***********************
function istChangeScore(game, op, playerNumber, no) {
	if (no == undefined) {no = "";}
    var currentTotal = document.getElementById(game+no+"-pt-"+playerNumber);
	if (op == "plus") {currentTotal.innerHTML = parseInt(currentTotal.innerHTML) + matchPreferences(game,6);}
	if (op == "minus") {currentTotal.innerHTML = parseInt(currentTotal.innerHTML) - matchPreferences(game,7)}
	createLeaderboard(game, no);
    //var newTotal = currentTotal + ;
    //for (var m = 0; m < playerRoundTotals.length; m++) {
    //    if (playerRoundTotals[m].value != 0) {playerTotal = playerTotal + parseInt(playerRoundTotals[m].value);}
    //}
    //document.getElementById(game+"-pt-"+cn).innerHTML = playerTotal;
}

// ************************* Create 1st-3rd place markers ***********************************
function createLeaderboard(game, no) {
	clearExisting(game,"lb-h2",no);
	clearExisting(game,"leaderboard",no);
	if (matchPreferences(game,3) != 0) {
		if (no == undefined) {no = "";}
		var playerRawTotals = document.getElementsByClassName(game+no+'-playertotal');
		var playerRawNames = document.getElementsByClassName(game+no+'-playername');
	    var playerTotals = new Array;
	    var playerTotalsSorted = new Array;
		var playerNames = new Array;
	    for (var m = 0; m < playerRawTotals.length; m++) { // Gets actual player totals
			playerNames[m] = playerRawNames[m].value;
	        playerTotals[m] = [parseInt(playerRawTotals[m].innerHTML),playerNames[m],0];
	        playerTotalsSorted[m] = playerTotals[m][0];

	        // Changes all total cells to default background color
	        switch (game) {
	            case "gyn": playerRawTotals[m].style.backgroundColor = '#222'; break;
	            case "fc": playerRawTotals[m].style.backgroundColor = '#470070'; break;
	            case "sol": playerRawTotals[m].style.backgroundColor = '#111'; break;
				case "gen": playerRawTotals[m].style.backgroundColor = '#111'; break;
	        }
	    }

	    // Sort (and assign place numbers) based on sorting direction
		var leaderboard = document.createElement("DIV");
		leaderboard.id = game+no+'-leaderboard';
		leaderboard.className = "leaderboard";
		leaderboard.innerHTML = "";

		var h2 = document.createElement("H2");
		h2.innerHTML = "Leaderboard";
		h2.style.width = "680px";
		h2.id = game+no+"-lb-h2";
		document.getElementById(game+no+"-screen").appendChild(h2);

		var scoringDirection = matchPreferences(game,3);
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
						if (!matchPreferences(game,1)) {
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
		document.getElementById(game+no+"-screen").appendChild(leaderboard);
	}
}

// ************************* Change preferences ***********************************

// Set original preferences
//		0: "game"
//		1: Is incremeting scoretable?
//		2: Number of tables
//		3: Scoring direction
//		4: Number of players
//		5: Number of rounds
//		6-8: varies
var preferences = [
//	["game",isIST,numTables,scoringDirection,numPlayers,numRounds]
	["gyn", false,	1,	-1,	4,	4],
	["fc" , false,	1,	-1,	4,	13],
	["gen", false,	1,	1,	4,	4],

//	["game",isIST,numTables,scoringDirection,numPlayers,numRounds,eliminateHighestScore]
	["sol", false,	3,	-1,	4,	4,	true],

//	["game",isIST,numTables,scoringDirection,numPlayers,numRounds(1),inc,dec]
	["inc", true,	1,	1,	4,	1,	1,	1]
];

function matchPreferences(game,prefID) {
	for (var i = 0; i < preferences.length; i++) {
		if (preferences[i][0] == game) {return preferences[i][prefID];}
	}
}
function setPreference(game,prefID,newValue) {
	for (var i = 0; i < preferences.length; i++) {
		if (preferences[i][0] == game) {preferences[i][prefID] = newValue; return;}
	}
}

rawColors = { gold:'#caa800', silver:'#999', bronze:'#9d5700' };
colors = JSON.parse(JSON.stringify(rawColors));
// Alternative colors: blue red, white, white, green, pink, purple, gray, light blue

function changeScoringDirection(game, no) {
	if (no == undefined) {no = "";}
    var changeSDButton = document.getElementById(game+no+'-changeSD');
	var sd = matchPreferences(game,3);
	if (sd == 1) { // change High to Low
        setPreference(game,3,-1);
        changeSDButton.innerHTML = "Low";
    } else if (sd == -1) { // change Low to None
        setPreference(game,3,0);
        changeSDButton.innerHTML = "None";
    } else { // change None to High
        setPreference(game,3,1);
        changeSDButton.innerHTML = "High";
    }
    var numPlayers = parseInt(document.getElementById(game+no+"-numplayers").value);
    createLeaderboard(game, no);
}

// Increment number
function changeIncrementNumber(game, op) {
	if (op == "inc") {
		var newValue = parseInt(document.getElementById(game+"-changeINC").value);
		if (newValue > 0) {
			setPreference(game,6,newValue);
			var buttons = document.getElementsByClassName(game+"-plus");
			for (var i = 0; i < buttons.length; i++) {buttons[i].innerHTML = "+"+matchPreferences(game,6)}
		} else {newValue = matchPreferences(game,6);}
	} else if (op == "dec") {
		var newValue = parseInt(document.getElementById(game+"-changeDEC").value);
		if (newValue > 0) {
			setPreference(game,7,newValue);
			var buttons = document.getElementsByClassName(game+"-minus");
			for (var i = 0; i < buttons.length; i++) {buttons[i].innerHTML = "–"+matchPreferences(game,7)}
		} else {newValue = matchPreferences(game,7);}
	}
}

// ***************************** Utilities *************************************
function clearExisting(game, string, no) {
	if (document.getElementById(game+no+'-'+string) != null) {document.getElementById(game+no+'-'+string).parentNode.removeChild(document.getElementById(game+no+'-'+string))}
	return;
}

// Create scoretables on page load
createScoretable("gyn"); createScoretable("fc"); createScoretable("gen"); createIncrementingScoretable("inc");
createMultipleScoretables("sol",3);
