
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
function createScoretable(game) {
    var scoretable = document.getElementById(game.concat("-scoretable"));
    scoretable.className = "scoretable";
    var numPlayers = parseInt(document.getElementById(game.concat("-numplayers")).value);
    var numRounds;
    if (game == "fc") {numRounds = 13;}
    else {numRounds = parseInt(document.getElementById(game.concat("-numrounds")).value) + 2;}

	var numColumns = numPlayers; var numRows = numRounds;

    var errorMessage = document.getElementById("em-".concat(game,"table"));

    if (numColumns>0 && numRows>1) {
        scoretable.style.display = "block";
        scoretable.style.maxHeight = String((52*numRounds)+2).concat("px");
        errorMessage.style.display = "none";

        scoretable.id = game.concat("-scoretable");

        // Deletes all prexisting rows
        scoretable.innerHTML = "";

        // Determines width of columns
        var tableWidth = window.innerWidth - 30;
        var otherColumnsWidth = tableWidth - 100 - (0*numColumns);
        //var colwidth = String(otherColumnsWidth/numColumns).concat("px");
        var colwidth = String(100/numColumns).concat("%");
        var otherColumnsWidth = String(otherColumnsWidth).concat("px");

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
                    currentCell.innerHTML = "<input class='st-playername ".concat(game,"-playername' type='text' placeholder='Player ",cn,"'>");

                    // IMPORTANT: Adds cell to end of row
                    currentRow.appendChild(currentCell);
                }
            } else if (rn == (numRows-1)) {   // LAST ROW only
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell st-lastrow ".concat(game,"-playertotal");
                    currentCell.style.width = colwidth;

					if (cn == (numColumns)) {currentCell.className = "st-cell st-lastrow ".concat(game,"-playertotal st-lastcolumn");}
                    currentCell.id = game.concat("-pt-",cn);

                    // IMPORTANT: Adds cell to end of row
                    currentRow.appendChild(currentCell);
                }
            } else {                          // Other rows (round rows)
                for (var cn = 1; cn <= numColumns; cn++) {
                    var currentCell = document.createElement("SECTION");
                    currentCell.className = "st-cell";
                    currentCell.style.width = colwidth;

                    // Dealer Cell
                    if (cn-1==(rn-1)%numColumns) {
                        currentCell.className = "st-cell st-dealercell";
                    }
                    currentCell.innerHTML = "<input class='st-scorein ".concat(game,"-round",rn," ",game,"-player",cn,"' type='text' placeholder='0' id='",game,"-cell-p",cn,"r",rn,"' onchange='calculatePlayerTotals(\"",game,"\", ",numColumns,")'>");

                    // IMPORTANT: Adds cell to end of column
                    currentRow.appendChild(currentCell);
                }

            }
            // IMPORTANT: Adds column to scoretable
            otherColumns.appendChild(currentRow);
        }
        scoretable.appendChild(otherColumns);
        calculatePlayerTotals(game, numColumns);

    } else {
        scoretable.style.display = "none";
        errorMessage.style.display = "block";
    }
}

// ************************* Calculates SCORETABLE player totals ***********************************
function calculatePlayerTotals(game, numPlayers) {
    for (var cn = 1; cn < (numPlayers+1); cn++) {
        var playerRoundTotals = document.getElementsByClassName(game.concat("-player",cn));
        var playerTotal = 0;
        for (var m = 0; m < playerRoundTotals.length; m++) {
            if (playerRoundTotals[m].value != 0) {playerTotal = playerTotal + parseInt(playerRoundTotals[m].value);}
        }
        document.getElementById(game.concat("-pt-",cn)).innerHTML = playerTotal;
    }
	calculatePodium(game, numPlayers);
}

// ************************* Creates incremeting scoretable ***********************************
function createIncrementingScoretable(game) {
    var scoretable = document.getElementById(game.concat("-scoretable"));
    scoretable.className = "scoretable incrementing-scoretable";
    var numPlayers = parseInt(document.getElementById(game.concat("-numplayers")).value) + 1;

    var errorMessage = document.getElementById("em-".concat(game,"table"));

    if (numPlayers > 1) {
        //scoretable.style.maxHeight = String((52*numPlayers)+2).concat("px");
        errorMessage.style.display = "none";

        scoretable.id = game.concat("-scoretable");

        // Deletes all prexisting rows
        scoretable.innerHTML = "";

        // Creates columns
        for (var cn = 0; cn <= 3; cn++) {
			var currentColumn = document.createElement("SECTION");
	        currentColumn.className = "ist-column ist-column".concat(cn);

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
						case 0: currentCell.innerHTML = "<input class='ist-playername' type='text' placeholder='Player ".concat(rn,"'>"); break;
						case 1: var pt = document.createElement("SECTION"); pt.className = "ist-playertotal ".concat(game,"-playertotal"); pt.id = game.concat("-pt-",rn); pt.innerHTML = "0"; currentCell.appendChild(pt); break;
						case 2: currentCell.innerHTML = "<button class='ist-plus inc-plus' id='inc-plus-p".concat(rn,"' onclick='istChangeScore(\"",game,"\",\"plus\",",rn,")'>+",incINC,"</button>"); break;
						case 3: currentCell.innerHTML = "<button class='ist-minus inc-minus' id='inc-minus-p".concat(rn,"' onclick='istChangeScore(\"",game,"\",\"minus\",",rn,")'>–1</button>"); break;
					}
	            }

            // IMPORTANT: Adds cell to end of column
            currentColumn.appendChild(currentCell);
		}
        scoretable.appendChild(currentColumn);
        //calculatePlayerTotals(game, numColumns);
	}

    } else {
        scoretable.style.display = "none";
        errorMessage.style.display = "block";
    }
}

// ****************** Calculate incrementing scoretable player scores ***********************
function istChangeScore(game, op, playerNumber) {
    var currentTotal = document.getElementById(game.concat("-pt-",playerNumber));
	if (op == "plus") {currentTotal.innerHTML = parseInt(currentTotal.innerHTML) + incINC;}
	if (op == "minus") {currentTotal.innerHTML = parseInt(currentTotal.innerHTML) + decINC;}
    //var newTotal = currentTotal + ;
    //for (var m = 0; m < playerRoundTotals.length; m++) {
    //    if (playerRoundTotals[m].value != 0) {playerTotal = playerTotal + parseInt(playerRoundTotals[m].value);}
    //}
    //document.getElementById(game.concat("-pt-",cn)).innerHTML = playerTotal;
}

// ************************* Create 1st-3rd place markers ***********************************
function calculatePodium(game, numPlayers) {
    var scoringDirection = matchSD(game);
	var playerRawTotals = document.getElementsByClassName(game+'-playertotal');
	var playerRawNames = document.getElementsByClassName(game+'-playernames');
    var playerTotals = new Array;
    var playerTotalsUnsorted = new Array;
    for (var m = 0; m < numPlayers; m++) { // Gets actual player totals
        playerTotals[m] = [parseInt(playerRawTotals[m].innerHTML),0]; // concatenates to end of array?????
        playerTotalsUnsorted[m] = parseInt(playerRawTotals[m].innerHTML); // concatenates to end of array?????

        // Changes all total cells to default background color
        switch (game) {
            case "gyn": playerRawTotals[m].style.backgroundColor = '#222'; break;
            case "fc": playerRawTotals[m].style.backgroundColor = '#470070'; break;
            case "gen": playerRawTotals[m].style.backgroundColor = '#111'; break;
        }
    }

	console.log(game,playerTotals);

    // Sort (and assign place numbers) based on sorting direction
    if (scoringDirection == -1) {
        playerTotals.sort(function(a, b){return a - b}); // Compare function (https://www.w3schools.com/js/js_array_sort.asp)
        // Determine 2nd place threshold
        threshold2nd = 2;
        for (var i = 2; i < playerTotals.length; i++) {
            if (playerTotals[1] < playerTotals[i]) {
                threshold2nd = i;
                break;
            }
        }
        // Determine 3rd place threshold
        threshold3rd = 3;
        for (var i = threshold2nd; i < playerTotals.length; i++) {
            if (playerTotals[threshold2nd] < playerTotals[i]) {
                threshold3rd = i;
                break;
            }
        }

        // Assigns colors to 1st-3rd place cells
        for (var n = 0; n < numPlayers; n++) {
            if (playerTotals[threshold3rd] == playerTotalsUnsorted[n+1]) { // Third place
                playerRawTotals[n].style.backgroundColor = '#9d5700';
            }
            if (playerTotals[threshold2nd] == playerTotalsUnsorted[n+1]) { // Second place
                playerRawTotals[n].style.backgroundColor = '#999';
            }
            if (playerTotals[1] == playerTotalsUnsorted[n+1]) { // First place
                playerRawTotals[n].style.backgroundColor = '#caa800';
            }
        }
    } else if (scoringDirection == 1) {
        playerTotals.sort(function(a, b){return b - a}); // Compare function (https://www.w3schools.com/js/js_array_sort.asp)
        // Determine 2nd place threshold
        threshold2nd = 1;
        for (var i = 1; i < playerTotals.length; i++) {
            if (playerTotals[0] < playerTotals[i]) {
                threshold2nd = i;
                break;
            }
        }
        // Determine 3rd place threshold
        threshold3rd = 2;
        for (var i = threshold2nd; i < playerTotals.length; i++) {
            if (playerTotals[threshold2nd] < playerTotals[i]) {
                threshold3rd = i;
                break;
            }
        }

        // Assigns colors to 1st-3rd place cells
        for (var n = 0; n < numPlayers; n++) {
            if (playerTotals[threshold3rd] == playerTotalsUnsorted[n+1]) { // Third place
                playerRawTotals[n].style.backgroundColor = '#9d5700';
            }
            if (playerTotals[threshold2nd] == playerTotalsUnsorted[n+1]) { // Second place
                playerRawTotals[n].style.backgroundColor = '#999';
            }
            if (playerTotals[0] == playerTotalsUnsorted[n+1]) { // First place
                playerRawTotals[n].style.backgroundColor = '#caa800';
            }
        }
    }
}

// ************************* Change preferences ***********************************

// Scoring direction
var scoringDirections = [
	["gyn", -1],
	["fc" , -1],
	["gen", 1],
	["inc", 1]
];

function changeScoringDirection(game) {
    var changeSDButton = document.getElementById(game.concat('-changeSD'));
	if (game == "inc") {
		if (sdINC == 1) { // change High to Low
	        sdINC = -1;
	        changeSDButton.innerHTML = "Low";
	    } else if (sdINC == -1) { // change Low to None
	        sdINC = 0;
	        changeSDButton.innerHTML = "None";
	    } else { // change None to High
	        sdINC = 1;
	        changeSDButton.innerHTML = "High";
	    }
	    var numINCPlayers = parseInt(document.getElementById("inc-numplayers").value);
	    calculatePodium("inc",numINCPlayers);
	} else if (game == "gen") {
		if (sdGEN == 1) { // change High to Low
	        sdGEN = -1;
	        changeSDButton.innerHTML = "Low";
	    } else if (sdGEN == -1) { // change Low to None
	        sdGEN = 0;
	        changeSDButton.innerHTML = "None";
	    } else { // change None to High
	        sdGEN = 1;
	        changeSDButton.innerHTML = "High";
	    }
	    var numGENPlayers = parseInt(document.getElementById("gen-numplayers").value);
	    calculatePodium("gen",numGENPlayers);
	}

}

function matchSD(game) {
	for (var i = 0; i < scoringDirections.length; i++) {
		if (scoringDirections[i][0] == game) {return scoringDirections[i][1];}
	}
}

// Increment number
var incINC = 1;
var decINC = -1;
function changeIncrementNumber(game, op) {
	if (op == "inc") {
		if (game == "inc") {
			var newValue = parseInt(document.getElementById("inc-changeINC").value);
			if (newValue > 0) {
				incINC = newValue;
				var buttons = document.getElementsByClassName("inc-plus");
				for (var i = 0; i < buttons.length; i++) {buttons[i].innerHTML = "+".concat(incINC)}
			} else {newValue = incINC;}
		}
	} else if (op == "dec") {
		if (game == "inc") {
			var newValue = parseInt(document.getElementById("inc-changeDEC").value);
			if (newValue > 0) {
				decINC = -1*newValue;
				var buttons = document.getElementsByClassName("inc-minus");
				for (var i = 0; i < buttons.length; i++) {buttons[i].innerHTML = "–".concat(newValue)}
			} else {newValue = decINC;}
		}
	}
}

// Create scoretables on page load
createScoretable("gyn"); createScoretable("fc"); createScoretable("gen"); createIncrementingScoretable("inc");
