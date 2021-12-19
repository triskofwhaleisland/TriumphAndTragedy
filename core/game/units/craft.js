module.exports = {
  craft: function (arg0_user, arg1_amount, arg2_unit_name) { //[WIP] - Update Reserves UI if user is currently situated on that page
    //Convert from parameters
    var user_id = arg0_user;
    var raw_amount = arg1_amount;
    var unit_amount = Math.ceil(parseInt(arg1_amount));
    var unit_name = arg2_unit_name;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);
    var raw_unit_name = getUnit(unit_name, { return_key: true });
    var unit_obj = getUnit(unit_name);
    var usr = main.users[actual_id];

    //Check if usr, unit_obj exist
    if (usr) {
      if (unit_obj) {
        if (!isNaN(unit_amount)) {
          //Check if unit is unlocked or not
          if (usr.available_units.includes(raw_unit_name)) {
            //Make sure unit_amount is valid
            if (unit_amount >= 1) {
              //Check if user has enough resources to actually conduct training
              var raw_category_name = getUnitCategoryFromUnit(raw_unit_name, { return_key: true });
              var resource_shortages = {};
              var unit_costs = getUnitCost(actual_id, raw_unit_name, { amount: unit_amount });

              //Iterate over all keys in unit_costs and check for prospective shortages
              var all_goods = getGoods({ return_names: true });
              var all_pops = Object.keys(config.pops);
              var all_unit_costs = Object.keys(unit_costs);

              for (var i = 0; i < all_unit_costs.length; i++) {
                var local_cost = unit_costs[all_unit_costs[i]];

                //Check if resource cost is good, pop, or other
                if (all_goods.includes(all_unit_costs[i])) {
                  if (usr.inventory[all_unit_costs[i]] < local_cost)
                    resource_shortages[all_unit_costs[i]] = local_cost - usr.inventory[all_unit_costs[i]];
                } else if (all_pops.includes(all_unit_costs[i])) {
                  var available_pops = usr.pops[all_unit_costs[i]] - usr.pops[`used_${all_unit_costs[i]}`];

                  if (available_pops < local_cost)
                    resource_shortages[all_unit_costs[i]] = local_cost - available_pops;
                } else {
                  if (usr[all_unit_costs[i]] < local_cost)
                    resource_shortages[all_unit_costs[i]] = local_cost - usr[all_unit_costs[i]];
                }
              }

              //Check to see if anything is in resource_shortages. If so, print it out and return an error
              var all_resource_shortages = Object.keys(resource_shortages);

              if (all_resource_shortages.length == 0) {
                //Train units immediately since they have no training time
                var unit_name = (unit_obj.name) ? unit_obj.name : raw_unit_name;
                var unit_quantity = returnSafeNumber(unit_obj.quantity, 1);

                usr.reserves[raw_unit_name] += (unit_amount*unit_quantity);

                //Deduct unit_costs from inventory and other user metrics
                for (var i = 0; i < all_unit_costs.length; i++) {
                  var local_cost = unit_costs[all_unit_costs[i]];

                  //Check if resource cost is good, pop, or other
                  if (all_goods.includes(all_unit_costs[i])) {
                    usr.inventory[all_unit_costs[i]] -= local_cost;
                  } else if (all_pops.includes(all_unit_costs[i])) {
                    usr.pops[`used_${all_unit_costs[i]}`] += local_cost;
                  } else {
                    usr[all_unit_costs[i]] -= local_cost;
                  }
                }

                //[WIP] - Update reserves UI if user is currently on it

                //Print alert
                printAlert(game_obj.id, `You have successfully trained **${parseNumber(unit_amount)}** ${(unit_amount == 1) ? "regiment" : "regiments"} of ${unit_name}!`);
              }
            } else if (unit_amount == 0) {
              printError(game_obj.id, `You can't train your units as alternate personalities of yourself. I say this as an alternate personality.`);
            } else {
              printError(game_obj.id, `You can't train negative units!`);
            }
          } else {
            printError(game_obj.id, `The unit you have specified for training is not yet currently unlocked by your nation!`);
          }
        } else {
          printError(game_obj.id, `You must specify an actual number of unit requests to file in for construction! **${raw_amount}** was not recognised as a valid number.`);
        }
      } else {
        printError(game_obj.id, `The unit you have specified does not exist!`);
      }
    } else {
      printError(game_obj.id, `You must have a country before being able to craft units!`);
    }
  }
};