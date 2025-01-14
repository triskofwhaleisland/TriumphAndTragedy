module.exports = {
  printCBs: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var all_cbs = Object.keys(config.casus_belli);
    var all_embeds = [];
    var game_obj = getGameObject(user_id);
    var usr = main.users[actual_id];

    //Declare cb_list_string, dynamic_cbs
    var cb_list_fields = [];
    var cb_list_string = [];
    var dynamic_list_fields = [];
    var dynamic_list_string = [];

    //Format cb_list_string
    cb_list_string.push(`**Notice:** 'White Peace' indicates a CB with no additional peace demands.`);
    cb_list_string.push(config.localisation.blank);

    //Format dynamic_list_string
    dynamic_list_string.push(`**Notice:** The following Casus Belli are dynamic CB's, meaning they are only triggered by event and cannot be justified normally.`);
    dynamic_list_string.push(config.localisation.blank);

    //Iterate over all CB's and print them out
    for (var i = 0; i < all_cbs.length; i++) {
      var local_cb = config.casus_belli[all_cbs[i]];
      var local_cb_description = (local_cb.description) ? local_cb.description : "";
      var local_cb_icon = (local_cb.icon) ? config.icons[local_cb.icon] + " " : "";
      var local_cb_infamy = returnSafeNumber(local_cb.infamy);
      var local_cb_name = (local_cb.name) ? local_cb.name : all_cbs[i];
      var local_cb_string = [];

      //Format peace_demands_array
      var peace_demands_localisation = getPeaceDemandsLocalisation(local_cb);
      var peace_demands_array = [];

      if (local_cb.peace_demands) {
        var all_demands = Object.keys(local_cb.peace_demands);

        for (var x = 0; x < all_demands.length; x++)
          try {
            var local_amount = local_cb.peace_demands[all_demands[x]];
            var local_wargoal = getWargoal(all_demands[x]);

            peace_demands_array.push(`[${(local_wargoal.name) ? local_wargoal.name : all_demands[x]}] (__${parseNumber(local_amount)}__)`);
          } catch (e) {
            log.error(`Error whilst parsing wargoal key '${all_demands[x]}': ${e}`);
          }
      }

      //Format CB
      local_cb_string.push(config.localisation.blank);
      local_cb_string.push(`- ${config.icons.old_scroll} Requirement: ${local_cb_description}`);

      if (peace_demands_array.length > 0 && !local_cb.attacker_peace_demands && !local_cb.defender_peace_demands)
        local_cb_string.push(`- ${config.icons.diplomacy} Peace Demands:\n • ${peace_demands_array.join("\n• ")}\n`);

      if (local_cb.attacker_peace_demands || local_cb.defender_peace_demands) {
        local_cb_string.push(`- ${config.icons.diplomacy} Attacker Peace Demands:\n • ${peace_demands_localisation.attacker_peace_demands_string.join("\n• ")}\n`);
        local_cb_string.push(`- ${config.icons.diplomacy} Defender Peace Demands:\n • ${peace_demands_localisation.defender_peace_demands_string.join("\n• ")}\n`);
      }

      local_cb_string.push(`- ${config.icons.infamy} Infamy: ${parseNumber(local_cb_infamy)}`);
      local_cb_string.push(config.localisation.blank);

      //Push to fields object
      (!local_cb.dynamic_limit && local_cb.limit) ?
        cb_list_fields.push({ name: `${local_cb_icon}**__${local_cb_name}__**:`, value: local_cb_string.join("\n"), inline: true }) :
        dynamic_list_fields.push({ name: `${local_cb_icon}**__${local_cb_name}__**:`, value: local_cb_string.join("\n"), inline: true });
    }

    //Remove control panel
    removeControlPanel(game_obj.id);

    //Return embeds
    var regular_cb_embeds = [];
    var dynamic_cb_embeds = [];

    try {
      regular_cb_embeds = splitEmbed(cb_list_string, {
       title: `[Back] | [Jump To Page] | List of Regular Casus Belli:`,
       fields: cb_list_fields,
       title_pages: true,
       fixed_width: true,
       maximum_fields: 12,
       table_width: 2
     });
    } catch {}
    try {
      dynamic_cb_embeds = splitEmbed(dynamic_list_string, {
        title: `[Back] | [Jump To Page] | List of Dynamic Casus Belli:`,
        fields: dynamic_list_fields,
        title_pages: true,
        fixed_width: true,
        maximum_fields: 12,
        table_width: 2
      });
    } catch {}

    //Push both to all_embeds
    if (regular_cb_embeds.length > 0)
      for (var i = 0; i < regular_cb_embeds.length; i++)
        all_embeds.push(regular_cb_embeds[i]);
    if (dynamic_cb_embeds)
      for (var i = 0; i < dynamic_cb_embeds.length; i++)
        all_embeds.push(dynamic_cb_embeds[i]);

    //Return statement
    return all_embeds;
  },

  printCBList: function (arg0_user, arg1_user) {
    //Convert from parameters
    var user_id = arg0_user;
    var ot_user_id = arg1_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id]
    var actual_ot_user_id = main.global.user_map[ot_user_id];
    var game_obj = getGameObject(user_id);
    var ot_user = main.users[actual_ot_user_id];
    var usr = main.users[actual_id];

    //Declare local tracker variables
    var all_cbs = Object.keys(config.casus_belli);
    var casus_belli_string = [];
    var has_casus_belli_on_target = false;

    //Check if at least one casus belli is valid for the target user
    for (var i = 0; i < usr.diplomacy.casus_belli.length; i++) {
      var local_cb = usr.diplomacy.casus_belli[i];

      if (local_cb.target == actual_ot_user_id)
        has_casus_belli_on_target = true;
    }

    //Check for all CB's that the target user has
    if (has_casus_belli_on_target) {
      casus_belli_string.push(`**[Justify Wargoal]**`);
      casus_belli_string.push("");
      casus_belli_string.push(config.localisation.divider);
      casus_belli_string.push("");
      casus_belli_string.push(`Valid CB's:`);
      casus_belli_string.push("");

      for (var i = 0; i < usr.diplomacy.casus_belli.length; i++) {
        var local_cb = usr.diplomacy.casus_belli[i];

        //Check if local_cb is on actual_ot_user_id
        if (local_cb.target == actual_ot_user_id) {
          var cb_obj = getCB(local_cb.type);
          var raw_cb_name = getCB(local_cb.type, { return_key: true });

          //Push to casus_belli_string
          casus_belli_string.push(`${(cb_obj.icon) ? config.icons[cb_obj.icon] + " " : ""}[${(cb_obj.name) ? cb_obj.name : raw_cb_name}]`);
        }
      }
    } else {
      casus_belli_string.push(`_We have no valid CB's on this nation as of yet._`);
    }

    //Return embed
    return splitEmbed(casus_belli_string, {
      title: `CB List on ${ot_user.name}:`,
      title_pages: true,
      fixed_width: true
    });
  },

  printCBTooltip: function (arg0_user, arg1_user, arg2_cb_name) {
    //Convert from parameters
    var user_id = arg0_user;
    var ot_user_id = arg1_user;
    var casus_belli_name = arg2_cb_name.trim().toLowerCase();

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id]
    var actual_ot_user_id = main.global.user_map[ot_user_id];
    var cb_obj = getCB(casus_belli_name);
    var game_obj = getGameObject(user_id);
    var ot_user = main.users[actual_ot_user_id];
    var peace_demands_localisation = getPeaceDemandsLocalisation(cb_obj);
    var raw_cb_name = getCB(casus_belli_name, { return_key: true });
    var usr = main.users[actual_id];

    if (cb_obj) {
      //Declare local tracker variables
      var attacker_peace_demands_string = [];
      var cb_is_valid = false;
      var defender_peace_demands_string = [];
      var has_wargoal = false;
      var justification_obj = getJustification(user_id, {
        target: actual_ot_user_id,
        type: raw_cb_name
      });
      var justification_time = (hasRivalry(user_id, ot_user_id)) ?
        Math.round(config.defines.diplomacy.justify_wargoal_time/2) :
        config.defines.diplomacy.justify_wargoal_time;
      var tooltip_string = [];

      //Check if cb_is_valid and if user already has wargoal
      for (var i = 0; i < usr.diplomacy.casus_belli.length; i++)
        if (
          (usr.diplomacy.casus_belli[i].target == actual_ot_user_id) &&
          (usr.diplomacy.casus_belli[i].type == raw_cb_name)
        )
          cb_is_valid = true;

      for (var i = 0; i < usr.diplomacy.wargoals.length; i++)
        if (
          (usr.diplomacy.wargoals[i].target == actual_ot_user_id) &&
          (usr.diplomacy.wargoals[i].type == raw_cb_name)
        )
          has_wargoal = true;

      //Print tooltip
      tooltip_string.push(`${(cb_obj.icon) ? config.icons[cb_obj.icon] : cb_obj.icon}**${(cb_obj.name) ? cb_obj.name : raw_cb_name}**:`);
      tooltip_string.push("");

      //CB info
      if (cb_obj.description)
        tooltip_string.push(`- Requirement: ${cb_obj.description}`);

      tooltip_string.push(`- Attacker Peace Demands: ${peace_demands_localisation.attacker_peace_demands_string.join(", ")}`);
      tooltip_string.push(`- Defender Peace Demands: ${peace_demands_localisation.defender_peace_demands_string.join(", ")}`);

      tooltip_string.push(`- Infamy: ${parseNumber(returnSafeNumber(cb_obj.infamy))}`);
      tooltip_string.push("");

      (cb_is_valid) ?
        tooltip_string.push(`You can justify using this CB on **${ot_user.name}**! Justification is expected to take **${parseNumber(justification_time)}** turn(s).`) :
        tooltip_string.push(`You do not currently have any CB's of this type available on **${ot_user.name}**.`);
      (has_wargoal) ?
        tooltip_string.push(`You can declare war on **${ot_user.name}** using this wargoal!`) :
        tooltip_string.push(`You have no wargoals of this type currently available on **${ot_user.name}**.`);

      if (justification_obj) {
        tooltip_string.push("");
        tooltip_string.push(`You are currently justifying on **${ot_user.name}** using this casus belli. You will gain a wargoal on them in **${parseNumber(justification_obj.duration)}** turn(s).`);
      }

      //Print alert
      printAlert(game_obj.id, tooltip_string.join("\n"));
    }
  },

  printWargoals: function (arg0_user, arg1_user) {
    //Convert from parameters
    var user_id = arg0_user;
    var ot_user_id = arg1_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id]
    var actual_ot_user_id = main.global.user_map[ot_user_id];;
    var game_obj = getGameObject(user_id);
    var ot_user = main.users[actual_ot_user_id];
    var usr = main.users[actual_id];

    //Declare local tracker variables
    var has_wargoal_on_target = false;
    var wargoal_string = [];

    //Check if at least one wargoal has been justified on the target user
    for (var i = 0; i < usr.diplomacy.wargoals.length; i++) {
      var local_wargoal = usr.diplomacy.wargoals[i];

      if (local_wargoal.target == actual_ot_user_id)
        has_wargoal_on_target = true;
    }

    //Check for all valid wargoals the target user has
    if (has_wargoal_on_target) {
      wargoal_string.push(`**[Cancel Wargoal]** | **[Declare War]**`);
      wargoal_string.push("");
      wargoal_string.push(config.localisation.divider);
      wargoal_string.push("");
      wargoal_string.push(`Valid Wargoals:`);
      wargoal_string.push("");

      for (var i = 0; i < usr.diplomacy.wargoals.length; i++) {
        var local_wargoal = usr.diplomacy.wargoals[i];

        if (local_wargoal.target == actual_ot_user_id) {
          var cb_obj = getCB(local_wargoal.type);
          var raw_cb_name = getCB(local_wargoal.type, { return_key: true });

          //Push to wargoal_string
          wargoal_string.push(`${(cb_obj.icon) ? cb_obj.icon + " " : ""}**[${(cb_obj.name) ? cb_obj.name : raw_cb_name}]**`);
        }
      }
    } else {
      wargoal_string.push(`_We have no valid wargoals on this nation as of yet._\n\nConsider justifying some in **[View CBs]**!`);
    }

    //Return statement
    return splitEmbed(casus_belli_string, {
      title: `CB List on ${ot_user.name}:`,
      title_pages: true,
      fixed_width: true
    });
  }
};
