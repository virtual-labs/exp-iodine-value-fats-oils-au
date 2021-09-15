/** Event handling functions starts here */
/** Function for starting the experiment */
function startExperiment(scope) {
    if (!start_flag) {
        /** Denote experiment is started */
        start_flag = true;
        scope.start_exp = _("Stop");
        scope.titrate_disable = true;
        scope.dropdown_disable = true;
        /** Interval for setting turner on */
        turner_timer = setInterval(function() {
            turner_count++;
            if (turner_count == 5) {
                clearInterval(turner_timer);

            }
            turnerRotate(scope, turner_count)
        }, 50);
        getChild(fat_oil_estimation_stage, "drop1").y = 448;
        dropDown();
        /**calls calculate function with in an interval*/
        startTitration(scope);
    } else {
        /**clears the interval for calling calculateFn*/
        clearInterval(start_counter);
        clearFn();
        scope.start_exp = _("Start");
        start_flag = false;
    }
}

/** Function for making turner off and on*/
turner_rect.on("click", function() {
	/** Making turner on */
	if(!turner_start_flag) {
		turner_start_flag = true;
		startExperiment(scope_temp);
	}
	/** Making turner off */
	else {
		turner_start_flag = false;
		startExperiment(scope_temp);
	}
	scope_temp.$apply();
});

/**function for resetting the experiment*/
function resetFn(scope) {
	turner_rect.mouseEnabled = true;
	initialisationOfImages();
	initialisationOfVariables(scope);
	scope.titration_soln = titration_solution_Array[0];
	scope.test_type = select_Type_Array[0];
	clearInterval(start_counter);
	mask_flask_rect.y=536;
	mask_burette_rect.y=161.5;
}

/**function for setting fat/oil*/
function setFatOilFn(scope) {
    /**identify the type of fat/oil selected*/
    selected_type_var = Type_Array[scope.test_type];
    /**set end point for selected type from the endpoint_Array*/
    end_point_val = endpoint_Array[scope.test_type];
}

/**function for selecting titrate*/
function selectTitrationFn(scope) {
    /**while selecting test solution enable dropdown for selecting fat/oil otherwise make it disable*/
    if (scope.titration_soln == 1) {
        scope.dropdown_disable = false;
        /**select type of fat/oil from an array*/
        selected_type_var = Type_Array[0];
        /**Range of iodine value for [coconut oil(6-10),soya bean oil(127-143),sesame oil(103-120),olive oil(78-88),mustard oil(105-126)]
		we can randomly select endpoint for corresponding test solutions based on the range of iodine value*/
        end_point_val = endpoint_Array[0];
    } else {
        scope.dropdown_disable = true;
    }
}

/**function for adding starch*/
function addStarchFn(scope) {
    /**while clicking add starch button, a purple colour is observed due to the formation of starch iodine complex*/
    scope.starch_btn = true;
    solution_flag = true;
    for (var i = 1; i <= 4; i++) {
        getChild(fat_oil_estimation_stage, "conical_flask_solution" + i).alpha = 0;
    }
    getChild(fat_oil_estimation_stage, "conical_flask_solution3").alpha = 1;
}

/**function for changing the speed of the drop*/
function changeDropSpeedFn(scope) {
    var _current_speed = scope.speed;
    delay_counter = dalay_max / (_current_speed * 0.5);
    drop_speed_var = scope.speed;
    if (start_flag == true){
		startTitration(scope);
	}
}

/**function for filling the burette from the start point*/
function fillSolutionFn(scope) {
	scope.refill_btn = true;
	scope.start_exp = _("Start");
	mask_burette_rect.y = 161.5;
	turner_rect.mouseEnabled = true;
}
    /**Event handling functions ends here*/

/**calclation function starts here*/
function calculateFn(scope) {
	/**calculate the solution level in each interval*/
	burette_sol = solution_vol + burette_soln_incr;
	flask_sol = solution_vol + flask_soln_incr;
	/**adjust drop's y position according to the movement of solution in the conical flask*/
	drop_y = drop_y - flask_soln_incr;
	/**calculate the value for titrant used*/
	titrant_sol = parseFloat((titrant_sol + titrant_incr).toFixed(1));
	/**display the value for titrant used*/
	scope.titrant_used = titrant_sol;
	/**when burette solution reaches at zero, again fill the solution from the top*/
	if (titrant_sol >= 50 && burette_soln_flag == false) {
		burette_soln_flag = true;
		scope.refill_btn = false;
		turner_rect.mouseEnabled = false;
		clearFn(scope);
	}
	if (start_flag == true) {
		/**after starting experiment fill and unfill the flask solution and burette solution respectively*/
		mask_flask_rect.y -= flask_sol;
		mask_burette_rect.y += burette_sol;
		/**when titrant used reaches 38 a pale yellow colour is observed due to the formation of iodine in the solution*/
		if (titrant_sol >= initial_titration_point && solution_flag == false) {
			scope.starch_btn = false;
			for (var i = 1; i <= 4; i++) {
				getChild(fat_oil_estimation_stage, "conical_flask_solution" + i).alpha = 0;
			}
			getChild(fat_oil_estimation_stage, "conical_flask_solution2").alpha = 1;
			if (titrant_sol >= final_titration_point) {
				scope.start_disable = true;
				scope.starch_btn = true;
				turner_rect.mouseEnabled = false;
				clearFn(scope);
			}
		}
		/**after adding starch, when reaching the end point, the test solution become colourless as a result of iodine completely 
	react with sodium thiosulphate*/
		else if (titrant_sol >= end_point_val && solution_flag == true) {
			for (var i = 1; i <= 4; i++) {
				getChild(fat_oil_estimation_stage, "conical_flask_solution" + i).alpha = 0;
			}
			getChild(fat_oil_estimation_stage, "conical_flask_solution4").alpha = 1;
			if (titrant_sol >= final_titration_point) {
				scope.start_disable = true;
				scope.starch_btn = true;
				turner_rect.mouseEnabled = false;
				clearFn(scope);
			}
		}
		/**based on the water level , adjusting the water's reflecting movement*/
		for (var i = 1; i <= 5; i++) {
			getChild(fat_oil_estimation_stage, "reflect" + i).y -= flask_sol;
			if (getChild(fat_oil_estimation_stage, "reflect" + i).y <= 519) {
				getChild(fat_oil_estimation_stage, "reflect" + i).x += flask_sol / 2;
				getChild(fat_oil_estimation_stage, "reflect" + i).scaleX -= flask_sol / 60.3;
				if (getChild(fat_oil_estimation_stage, "reflect" + i).y <= 465) {
					clearInterval(start_counter);
				}
			}
		}
	} else {
		clearInterval(start_counter);
	}
	scope.$apply();
}
/**calclation function ends here*/

/**function for clearing all the functionality when experiment ends*/
function clearFn(scope) {
    /**deactivate start and add starch button */
    start_flag = false;
    getChild(fat_oil_estimation_stage, "drop1").alpha = 0;
    getChild(fat_oil_estimation_stage, "drop2").alpha = 0;
    getChild(fat_oil_estimation_stage, "drop3").alpha = 0;
    /**timer for closing the burette lid*/
    turner_timer = setInterval(function() {
        turner_count--;
        if (turner_count == 1) {
            clearInterval(turner_timer);
        }
        turnerRotate(scope, turner_count)
    }, 50);
    /**clear the interval*/
    clearInterval(start_counter);
}

/** function for setting movement of drop*/
function dropDown() {
    if (start_flag == true) {
		/** After starting the experiment adjust the number of drops according to the speed of titrant slider value*/
        getChild(fat_oil_estimation_stage, "drop1").alpha = 1;
        if (drop_speed_var >= 0.5 && drop_speed_var <= 1.0) {
            var drop1_tween = createjs.Tween.get(getChild(fat_oil_estimation_stage, "drop1")).to({
                y: drop_y
            }, 800).call(dropUp);
        } else if (drop_speed_var >= 1.0 && drop_speed_var <= 1.5) {
            var drop1_tween = createjs.Tween.get(getChild(fat_oil_estimation_stage, "drop1")).to({
                y: 475
            }, 500);
            var drop2_tween = createjs.Tween.get(getChild(fat_oil_estimation_stage, "drop2")).to({
                y: drop_y
            }, 500).call(dropUp);
        } else if (drop_speed_var >= 1.5 && drop_speed_var <= 2.0) {
            var drop1_tween = createjs.Tween.get(getChild(fat_oil_estimation_stage, "drop1")).to({
                y: 475
            }, 500);
            var drop2_tween = createjs.Tween.get(getChild(fat_oil_estimation_stage, "drop2")).to({
                y: 500
            }, 500);
            var drop3_tween = createjs.Tween.get(getChild(fat_oil_estimation_stage, "drop3")).to({
                y: drop_y
            }, 500).call(dropUp);
        }
    } else {
        getChild(fat_oil_estimation_stage, "drop1").alpha = 0;
        getChild(fat_oil_estimation_stage, "drop2").alpha = 0;
        getChild(fat_oil_estimation_stage, "drop3").alpha = 0;
    }
}

/**function for setting the initial position of the solution drop*/
function dropUp() {
    if (start_flag == true) {
		/** After completing tween set the initial point for each of the drop*/
        if (drop_speed_var >= 0.5 && drop_speed_var <= 1.0) {
            getChild(fat_oil_estimation_stage, "drop1").y = 446;
			getChild(fat_oil_estimation_stage, "drop2").alpha = 0;
			getChild(fat_oil_estimation_stage, "drop3").alpha = 0;
        } else if (drop_speed_var >= 1.0 && drop_speed_var <= 1.5) {
            getChild(fat_oil_estimation_stage, "drop2").alpha = 1;
            getChild(fat_oil_estimation_stage, "drop1").y = 446;
            getChild(fat_oil_estimation_stage, "drop2").y = 475;
			getChild(fat_oil_estimation_stage, "drop3").alpha = 0;
        } else if (drop_speed_var >= 1.5 && drop_speed_var <= 2.0) {
            getChild(fat_oil_estimation_stage, "drop1").y = 446;
            getChild(fat_oil_estimation_stage, "drop2").y = 475;
            getChild(fat_oil_estimation_stage, "drop3").y = 500;
            getChild(fat_oil_estimation_stage, "drop2").alpha = 1;
            if (drop_y >= 528) {
                getChild(fat_oil_estimation_stage, "drop3").alpha = 1;
            }
        }
    }
    dropDown();
}

/**function for turning turner on and off*/
function turnerRotate(scope, inr) {
    for (var i = 1; i <= 5; i++) {
        getChild(fat_oil_estimation_stage, "turner" + i).alpha = 0;
    }
    getChild(fat_oil_estimation_stage, "turner" + inr).alpha = 1;
}

/**function for beginning the titration*/
function startTitration(scope) {
    clearInterval(start_counter);
    start_counter = setInterval(function() {
        calculateFn(scope)
    }, delay_counter);
}

function getChild(stage,name) {
    return stage.getChildByName(name);
}