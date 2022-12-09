module.exports = {
  sendVolunteerArmies: function (arg0_user, arg1_war_name, arg2_armies) { //[WIP] - Update UI
    //Convert from parameters
    var user_id = arg0_user;
    var war_name = (typeof arg1_war_name != "object") ? arg1_war_name.trim().toLowerCase() : arg1_war_name;
    var armies = parseArmies(arg2_armies);

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);
    var usr = main.users[actual_id];
    var war_obj = (typeof war_name != "object") ? getWar(war_name) : war_name;

    //Check if war_obj exists
    if (war_obj) {
      //Check if user has sent volunteers to the war
      if (war_obj[`${actual_id}_sent_volunteers`]) {
        //Fetch army limit
        var current_volunteers = getVolunteerArmiesSize(user_id, war_obj);
        var volunteer_limit = Math.ceil(getTotalActiveDuty(user_id)*config.defines.diplomacy.send_volunteer_army_limit);

        //Check to see what armies exist
        var empty_armies = 0;
        var navies = 0;
        var nonexistent_armies = 0;
        var sent_armies = 0;
        var total_sent = 0;

        for (var i = 0; i < armies.length; i++) {
          var local_army = getArmy(user_id, armies[i]);

          if (local_army) {
            var all_units = Object.keys(local_army.units);

            if (local_army.type != "navy") {
              if (all_units.length > 0) {
                var local_army_size = getArmySize(user_id, local_army);

                sent_armies++;
                total_sent += returnSafeNumber(local_army_size);
              } else {
                empty_armies++;
              }
            } else {
              navies++;
            }
          } else {
            nonexistent_armies++;
          }
        }

        //Check to make sure that the total amount of sent troops in this war does not exceed the 5% limit
        if (current_volunteers + total_sent <= volunteer_limit) {
          //Mark armies as sent
          for (var i = 0; i < armies.length; i++) {
            var local_army = getArmy(user_id, armies[i]);

            if (local_army) {
              var all_units = Object.keys(local_army.units);

              if (all_units.length > 0 && local_army.type != "navy")
                local_army.volunteering = [true, war_obj.id];
            }
          }

          //Print user feedback
          if (sent_armies != 0) {
            (sent_armies == armies.length) ?
              printAlert(game_obj.id, `${config.icons.checkmark} You have successfully sent **${parseNumber(armies.length)}** armies to serve as volunteers in the **${war_obj.name}** for the **${friendly_side}** name.`) :
              printAlert(game_obj.id, `${config.icons.checkmark} You have sent **${parseNumber(sent_armies)}**/${parseNumber(armies.length)} armies to serve as volunteers in the **${war_obj.name}** for the **${friendly_side}**.\n\nOf the missing armies, **${parseNumber(nonexistent_armies)}** proved to be nonexistent, and **${parseNumber(empty_armies)}** were completely empty.${(navies > 0) ? ` You also attempted sending **${parseNumber(navies)}** naval flotillas as volunteers. Send them under your own flag!` : ""}`);

            //Update UI's

          } else {
            printError(game_obj.id, `None of the armies you have specified had any troops in them!`);
          }
        } else {
          printError(game_obj.id, `Only **${printPercentage(config.defines.diplomacy.send_volunteer_army_limit)}** of all active military personnel can be sent as volunteers to an armed conflict! This means you are only able to send **${parseNumber()}`)
        }
      } else {
        (war_obj.attackers.includes(actual_id) || war_obj.defenders.includes(actual_id)) ?
          printError(game_obj.id, `You are already involved as a full-fledged participant in the **${war_obj.name}**!`) :
          printError(game_obj.id, `You must send volunteers to the **${war_obj.name}** before you can send volunteer armies! Declare your intention to do so first.`);
      }
    } else {
      printError(game_obj.id, `The conflict you have specified, the **${war_name}**, could not be found as a valid active conflict! Type **[View Wars]** to see a list of all ongoing wars.`);
    }
  },

  sendVolunteers: function (arg0_user, arg1_war_name, arg2_side) { //[WIP] - Update UI
    //Convert from parameters
    var user_id = arg0_user;
    var war_name = (typeof arg1_war_name != "object") ? arg1_war_name.trim().toLowerCase() : arg1_war_name;
    var side = arg2_side;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);
    var usr = main.users[actual_id];
    var war_obj = (typeof war_name != "object") ? getWar(war_name) : war_name;

    var all_armies = Object.keys(usr.armies);
    var total_active_duty = getTotalActiveDuty(user_id);

    //Check if war_obj exists
    if (war_obj) {
      //Check if user is already involved in the war
      var involved_side = "";

      if (war_obj.attackers.includes(actual_id))
        involved_side = "attacking";
      if (war_obj.defenders.includes(actual_id))
        invovled_side = "defending";

      if (involved_side == "") {
        //Check if user has already sent volunteers to the war
        if (!war_obj[`${actual_id}_sent_volunteers`]) {
          //Check if side is valid
          var friendly_side = "";

          if (["attacking", "attacker", "attackers", "aggressor", "aggressors", "offensive"].includes(side))
            friendly_side = "attackers";
          if (["defending", "defender", "defenders", "attacked", "defensive"].includes(side))
            friendly_side = "defenders";

          if (friendly_side != "") {
            //Check if user has enough Political Capital
            if (usr.modifiers.political_capital >= config.defines.diplomacy.send_volunteer_armies_cost) {
              if (total_active_duty > 0) {
                if (all_armies.length > 0) {
                  //Remove Political Capital
                  usr.modifiers.political_capital -= config.defines.diplomacy.send_volunteer_armies_cost;

                  //Mark involvement in war
                  war_obj[`${actual_id}_sent_volunteers`] = friendly_side;

                  //Print user feedback
                  printAlert(game_obj.id, `${config.icons.checkmark} You have begun preparations for sending up to **${printPercentage(config.defines.diplomacy.send_volunteer_army_limit)}** of your armed forces as volunteers to fight in the **${war_obj.name}** on the side of the **${friendly_side}**. This involvement will cost ${config.icons.political_capital} **${parseNumber(config.defines.diplomacy.send_volunteer_armies_maintenance_cost)}** Political Capital per turn until you enter the war as a full participant, the war ends, or you repatriate your troops.`);

                  //Update UI

                } else {
                  printError(game_obj.id, `You currently have no active combat formations capable of being sent overseas! Consider creating a few armies first for service before trying to send volunteers.`);
                }
              } else {
                printError(game_obj.id, `You don't even have any troops in your military! Recruit some first before thinking about sending troops to fight in an overseas war.`);
              }
            } else {
              printError(game_obj.id, `You don't have enough Political Capital to send volunteers to intervene in the **${war_name}**! Sending volunteers requires at least ${config.icons.political_capital} **${parseNumber(config.defines.diplomacy.send_volunteer_armies_cost)}** Political Capital, meaning you require an additional ${config.icons.political_capital} **${parseNumber(config.defines.diplomacy.send_volunteer_armies_cost)}** Political Capital to send volunteer armies over.`);
            }
          } else {
            printError(game_obj.id, `You must specify a valid side of this conflict to send volunteers to! **${side}** was not recognised as a valid side. Try typing 'attacking' or 'defending' instead.`);
          }
        } else {
          printError(game_obj.id, `You have already sent volunteer armies to fight in this war on the side of the **${war_obj[`${actual_id}_sent_volunteers`]}**! Repatriate your volunteers first if you want to switch sides, or type **[Send Volunteer Armies]** to specify individual armies to ship overseas.`);
        }
      } else {
        printError(game_obj.id, `You are already an active participant of the **${war_name}** on the **${involved_side}** side!`);
      }
    } else {
      printError(game_obj.id, `The conflict you have specified, **${war_name}**, has either already ended or never existed in the first place!`);
    }
  }
};
