module.exports = {
  rival: function (arg0_user, arg1_user) {
    //Convert from parameters
    var user_id = arg0_user;
    var ot_user_id = arg1_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var actual_ot_user_id = main.global.user_map[ot_user_id];
    var game_obj = getGameObject(user_id);
    var ot_user = main.users[actual_ot_user_id];
    var usr = main.users[actual_id];

    //Check if other user even exists
    if (ot_user) {
      //Check if user is trying to rival themselves
      if (actual_id != actual_ot_user_id) {
        //Check if user has already been rivalled
        if (!hasRivalry(user_id, ot_user_id)) {
          if (!hasAlliance(user_id, ot_user_id)) {
            //Check if user is currently being protected
            if (!hasGuarantee(user_id, ot_user_id)) {
              //Check if relations are too high
              var current_relations = getRelations(user_id, ot_user_id);

              if (current_relations[0] < config.defines.diplomacy.rival_relations_threshold) {
                //Check if user has enough Political Capital
                if (usr.modifiers.political_capital >= config.defines.diplomacy.declare_rival_cost) {
                  //Check for rival slots
                  if (Object.keys(usr.diplomacy.rivals).length < usr.modifiers.rival_slots) {
                    //Add as rivals for both countries
                    createRivalry(user_id, ot_user_id);

                    //Remove political_capital, send alert, create rivalry
                    usr.modifiers.political_capital -= config.defines.diplomacy.rival_relations_threshold;

                    sendAlert(ot_user_id, config.defines.diplomacy.revoke_guarantee_alert_id, {
                      FROM: actual_id,
                      TO: actual_ot_user_id
                    });

                    //Status updater
                    if (game_obj.page.startsWith("diplomacy_view_")) {
                      var current_ot_user_id = game_obj.page.replace("diplomacy_view_", "");

                      if (current_ot_user_id == actual_ot_user_id)
                        viewDiplomacy(user_id, current_ot_user_id);
                    }

                    //Send user feedback
                    printAlert(game_obj.id, `${config.icons.infamy} You have rivalled the enemy nation of **${ot_user.name}**.`);
                  } else {
                    printError(game_obj.id, `You are already using up your maximum amount of **${parseNumber(usr.modifiers.rival_slots)}** rival slots!`);
                  }
                } else {
                  printError(game_obj.id, `You don't have enough Political Capital remaining! You need at least ${config.icons.political_capital} **${parseNumber(config.defines.diplomacy.declare_rival_cost - usr.modifiers.political_capital)}** more Political Capital before you can declare a rivalry with **${ot_user.name}**.`);
                }
              } else {
                printError(game_obj.id, `Current relations are too high for a genuine rivalry! Relations with the target country must be at least **${parseNumber(config.defines.diplomacy.rival_relations_threshold, { display_prefix: true })}** or below to declare a rivalry. Current public opinion in your country of **${ot_user.name}** is hovering around **${parseNumber(current_relations[0], { display_prefix: true })}**.`);
              }
            } else {
              printError(game_obj.id, `You can't rival a country you're currently protecting! Revoke the guarantee of independence first, then rival.`);
            }
          } else {
            printError(game_obj.id, `You are currently allies with **${ot_user.name}**!`);
          }
        } else {
          printError(game_obj.id, `You have already rivalled **${ot_user.name}**!`);
        }
      } else {
        printError(game_obj.id, `Pick a real rival ..`);
      }
    } else {
      printError(game_obj.id, `Please choose a valid rival that actually geographically exists.`);
    }
  },

  initialiseRival: function (arg0_user) {
    var user_id = arg0_user;

    //Declare local instance variables
    var game_obj = getGameObject(user_id);

    //Initialise visual prompt
    visualPrompt(game_obj.alert_embed, user_id, {
      title: `Rival A Country:`,
      prompts: [
        [`Who would you like to declare your new rival?\n\nType **[View Ledger]** to a view a ledger of all valid nations.`, "mention"]
      ]
    },
    function (arg) {
      module.exports.rival(user_id, arg[0]);
    },
    function (arg) {
      switch (arg) {
        case "view ledger":
          printLedger(user_id);
          return true;

          break;
      }
    })
  }
};
