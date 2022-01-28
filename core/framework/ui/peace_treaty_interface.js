module.exports = {
  //closePeaceTreaty() - Closes the peace treaty UI and unloads the cached map
  closePeaceTreaty: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);

    //Close UI
    removeControlPanel(game_obj.id);
    printStats(user_id);
    game_obj.page = "country_interface";

    //Delete map file
    try {
      fs.unlinkSync(`./map/${actual_id}_peace_treaty`);
    } catch {}
  },

  initialiseAddWargoal: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_side = "";
    var has_error = [false, ""]; //[has_error, error_msg];
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Fetch a list of all enemies
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Fetch a list of all available wargoals
    for (var i = 0; i < war_obj.wargoals.length; i++)
      wargoal_array.push(`${(war_obj.wargoals.length - 1 == i) ? "or "}**${(config.localisation[war_obj.wargoals[i]]) ? config.localisation[war_obj.wargoals[i]] : war_obj.wargoals[i]}**`);

    //Initialise visual prompt
    visualPrompt(game_obj.id, user_id, {
      title: `Add Wargoal To Peace Treaty:`,
      prompts: [
        [`Which wargoal would you like to add to this peace treaty?\n\nPlease type either ${wargoal_array.join(", ")}.`, "string"]
      ]
    },
    function (arg) {
      if (wargoal_array.includes(arg[0].trim().toLowerCase()))
        switch (arg[0].trim().toLowerCase()) {
          //[WIP] - Handle wargoal cases later
          case "status_quo":
            peace_obj.demands.status_quo = true;
            module.exports.initialisePeaceOfferScreen(user_id, peace_obj);
            module.exports.initialiseModifyPeaceTreaty(user_id, peace_obj);

            break;
          case "install_government":
            module.exports.initialiseInstallGovernment(user_id, peace_obj);

            break;
          case "cut down to size":
            module.exports.initialiseCutDownToSize(user_id, peace_obj);

            break;
          case "liberation":
            module.exports.initialiseLiberation(user_id, peace_obj);

            break;
          case "puppet":
            module.exports.initialisePuppet(user_id, peace_obj);

            break;
          case "retake_cores":
            module.exports.initialiseRetakeCores(user_id, peace_obj);

            break;
          case "annexation":
            module.exports.initialiseAnnexation(user_id, peace_obj);

            break;
        }
      else
        switch (arg[0].trim().toLowerCase()) {
          case "back":
            module.exports.initialisePeaceOfferScreen(user_id, peace_obj);
            module.exports.initialiseModifyPeaceTreaty(user_id, peace_obj);

            break;
          default:
            module.exports.initialiseAddWargoal(user_id, peace_obj);

            break;
        }
    });
  },

  initialiseAnnexAll: function (arg0_user, arg1_peace_treaty_object, arg2_owner_id) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;
    var owner = arg2_owner_id;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_side = "";
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Determine enemy_side and friendly_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Send visual prompt
    visualPrompt(game_obj.id, user_id, {
      title: `Full Annexation Request For **${main.users[owner].name}**:`,
      prompts: [
        [`Which enemy country in this conflict would you like to be fully annexed by **${main.users[owner].name}**?\n${enemy_countries.join("\n- ")}\n\nType **[Back]** to add a different annexation request.`, "mention"]
      ]
    },
    function (arg) {
      var has_error = [false, ""]; //[has_error, error_msg];

      //Check to make sure the enemy country exists and is a belligerent
      if (main.users[arg[0]]) {
        var local_user = main.users[arg[0]];

        if (war_obj[enemy_side].includes(arg[0])) {
          if (arg[0] != owner) {
            //Check to make sure that this country is not already going to be fully annexed by another user
            if (peace_obj.demands.annexation) {
              var all_demands = Object.keys(peace_obj.demands.annexation);

              for (var i = 0; i < all_demands.length; i++) {
                var local_demand = peace_obj.demands.annexation[all_demands[i]];

                if (local_demand.annex_all)
                  if (local_demand.annex_all.includes(arg[0]))
                    has_error = [true, `**${local_user.name}** is already proposed to be annexed by **${main.users[local_demand.id].name}**! Consider removing this wargoal first before trying again.`];
              }
            }

            if (!has_error[0]) {
              //Add demand
              if (peace_obj.demands.annexation)
                if (peace_obj.demands.annexation[owner])
                  if (peace_obj.demands.annexation[owner].annex_all)
                    peace_obj.demands.annexation[owner].annex_all.push(arg[0]);
                  else
                    peace_obj.demands.annexation[owner].annex_all = [arg[0]];
                else
                  peace_obj.demands.annexation[owner] = {
                    id: owner,
                    annex_all: [arg[0]]
                  };

              //Print user feedback
              printAlert(game_obj.id, `${config.icons.checkmark} Your peace delegation has successfully motioned for a full annexation of **${local_user.name}** on behalf of **${main.users[owner].name}**.`);

              //Go back to the starting menu after one second
              setTimeout(function(){
                module.exports.initialiseAddWargoal(user_id, peace_obj);
              }, 1000);
            }
          } else {
            has_error = [true, `You cannot make **${local_user.name}** annex themselves!`];
          }
        } else {
          has_error = [true, `**${local_user.name}** is not currently fighting you in this conflict! Are you sure they aren't fighting you in a different conflict you're currently in?`];
        }
      } else {
        has_error = [true, `The country you are trying to fully absorb into another nation doesn't even exist!`];
      }

      //Error handler
      if (has_error[0]) {
        printError(game_obj.id, has_error[1]);

        //Wait 3 seconds before reinitialising prompt
        setTimeout(function(){
          module.exports.initialiseAnnexAll(user_id, peace_obj);
        }, 3000);
      }
    },
    function (arg) {
      switch (arg) {
        case "back":
          module.exports.initialiseAnnexation(user_id, peace_obj);
          return true;

          break;
      }
    });
  },

  initialiseAnnexation: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_side = "";
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Determine enemy_side and friendly_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Send visual prompt
    visualPrompt(game_obj.id, user_id, {
      title: `Annexation Request:`,
      prompts: [
        [`For which country would you like to motion an annexation request for?\nNote: You can choose any country (even if they are currently at war with you), so long as they are not the same country you are annexing provinces from.\n\nType **[Back]** to add a different wargoal to this peace treaty.`, "mention"],
        [`What type of request would you like to file? Type either 'full annexation' to demand a full annexation, or 'partial annexation' to annex only some provinces off of this country.\n\nType **[Back]** to add a different wargoal to this peace treaty.`, "string"]
      ]
    },
    function (arg) {
      var has_error = [false, ""]; //[has_error, error_msg];

      //Check to make sure that the annexing country actually exists
      if (main.users[arg[0]]) {
        //Check to make sure that they are filing a valid request
        switch (arg[1].trim().toLowerCase()) {
          case "full annexation":
            //Print user feedback
            printAlert(game_obj.id, `${config.icons.checkmark} You have successfully filed a motion for the full annexation of a belligerent nation to **${local_user.name}**.`);

            setTimeout(function(){
              module.exports.initialiseAnnexAll(user_id, peace_obj, arg[0]);
            }, 1000);

            break;
          case "partial annexation":
            //Print user feedback
            printAlert(game_obj.id, `${config.icons.checkmark} You have successfully filed a motion for the partial annexation of a belligerent nation to **${local_user.name}**.`);

            setTimeout(function(){
              module.exports.initialiseDemandProvinces(user_id, peace_obj, arg[0]);
            }, 1000);

            break;
          default:
            has_error = [true, `You must file a valid request for either the 'partial annexation' or 'full annexation' of a belligerent user!`];

            break;
        }
      } else {
        has_error = [true, `The country you are trying to file an annexation request for doesn't even exist!`];
      }

      //Error handler
      if (has_error[0]) {
        printError(game_obj.id, has_error[1]);

        //Wait 3 seconds before reinitialising prompt
        setTimeout(function(){
          module.exports.initialiseAnnexation(user_id, peace_obj);
        }, 3000);
      }
    },
    function (arg) {
      switch (arg) {
        case "back":
          module.exports.initialisePeaceOfferScreen(user_id, peace_obj);
          module.exports.initialiseModifyPeaceTreaty(user_id, peace_obj);
          return true;

          break;
      }
    });
  },

  initialiseCutDownToSize: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_side = "";
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Determine enemy_side and friendly_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Send visual prompt
    visualPrompt(game_obj.id, user_id, {
      title: `Cut Down To Size:`,
      prompts: [
        [`Which of your enemies would you like to cut down to size? Cutting down to size removes up to **90%** of their military from the equation.\n${enemy_countries.join("\n- ")}\n\nType **[Back]** to go back to the previous wargoal menu.`, "mention"]
      ]
    },
    function (arg) {
      var has_error = [false, ""]; //[has_error, error_msg];

      if (main.users[arg[0]]) {
        var local_user = main.users[arg[0]];

        if (war_obj[enemy_side].includes(arg[0])) {
          if (peace_obj.demands.cut_down_to_size)
            if (peace_obj.demands.cut_down_to_size.includes(arg[0]))
              has_error = [true, `You have already demanded that **${local_user.name}** cut down the size of their armed forces by **90%!** If you wish to remove this wargoal instead, type **[Back]** and then **[Remove Wargoal]**.`];

          if (!has_error[0]) {
            //Set demand
            if (peace_obj.demands.cut_down_to_size)
              peace_obj.demands.cut_down_to_size.push(arg[0]);
            else
              peace_obj.demands.cut_down_to_size = [arg[0]];

            //Print user feedback
            printAlert(game_obj.id, `${config.icons.checkmark} You have successfully demanded that **${local_user.name}** trim down their armed forces by **90%**.`);

            //Go back to the starting menu after one second
            setTimeout(function(){
              module.exports.initialiseAddWargoal(user_id, peace_obj);
            }, 1000);
          }
        } else {
          has_error = [true, `You are not currently at war with **${local_user.name}** in this conflict! Please pick a valid belligerent to cut down to size from.`];
        }
      } else {
        has_error = [true, `You cannot cut a fictional army down to size! Please choose an actual enemy belligerent fighting in the war next time.`];
      }

      //Error handler
      if (has_error[0]) {
        printError(game_obj.id, has_error[1]);

        //Wait 3 seconds before reinitialising prompt
        setTimeout(function(){
          module.exports.initialiseCutDownToSize(user_id, peace_obj);
        }, 3000);
      }
    },
    function (arg) {
      switch (arg) {
        case "back":
          module.exports.initialisePeaceOfferScreen(user_id, peace_obj);
          module.exports.initialiseModifyPeaceTreaty(user_id, peace_obj);
          return true;

          break;
      }
    });
  },

  initialiseDemandProvinces: function (arg0_user, arg1_peace_treaty_object, arg2_owner_id) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;
    var owner = arg2_owner_id;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_side = "";
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Determine enemy_side and friendly_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Send visualPrompt()
    visualPrompt(game_obj.id, user_id, {
      title: `Demand Provinces:`,
      prompts: [
        [`Which provinces would you like to demand for this nation?\nPlease separate each province with a space like so: '4702 4703 4709'.\n\nType **[Back]** to add a different annexation request instead.`, "string"]
      ]
    },
    function (arg) {
      var all_provinces = arg[0].trim().split(" ");
      var has_error = []; //[error_array]
      var local_user = main.users[owner];

      var neutral_provinces = [];
      var nonexistent_provinces = [];
      var same_country = [];

      //Check to make sure that all provinces exist
      for (var i = 0; i < all_provinces.length; i++)
        if (!main.provinces[all_provinces[i]])
          nonexistent_provinces.push(all_provinces[i]);
        else {
          var local_province = main.provinces[all_provinces[i]];

          //Check to see whether the owner of the province is actually a valid enemy
          if (!war_obj[enemy_side].includes(local_province.owner))
            neutral_provinces.push(all_provinces[i]);

          //Check to see if the province is going to the same owner
          if (local_province.owner == owner)
            same_country.push(all_provinces[i]);

          //Check to see whether the province is already included in an existing annexation demand
          if (peace_obj.demands.annexation) {
            var all_demands = Object.keys(peace_obj.demands.annexation);

            for (var x = 0; x < all_demands.length; x++) {
              var local_demand = peace_obj.demands.annexation[all_demands[x]];

              if (local_demand.annex_all)
                if (local_demand.annex_all.includes(local_province.owner))
                  has_error.push(`**${main.users[local_province.owner].name}** is already going to be fully annexed by **${main.users[local_demand.id].name}** in the current peace treaty!`);
            }
          }
        }

      //If no errors are present, set the object to properly demand all provinces from all_provinces
      if (has_error.length + neutral_provinces.length + nonexistent_provinces.length + same_country.length == 0)
        if (peace_obj.demands.annexation)
          if (peace_obj.demands.annexation[owner])
            peace_obj.demands.provinces = unique(all_provinces);
          else
            peace_obj.demands.annexation[owner] = {
              id: owner,
              provinces: unique(all_provinces)
            };
        else
          peace_obj.demands.annexation = {
            [owner]: {
              id: owner,
              provinces: unique(all_provinces)
            }
          };

      //Return user feedback
      printAlert(game_obj.id, `${config.icons.checkmark} You have successfully added an annexation request on the behalf of **${local_user.name}** for the provinces of **${parseList(unique(all_provinces))}**.`);

      //Go back to the starting menu after one second
      setTimeout(function(){
        module.exports.initialiseAddWargoal(user_id, peace_obj);
      }, 1000);

      //Error handler
      if (has_error.length + neutral_provinces.length + nonexistent_provinces.length + same_country.length > 0) {
        printError(game_obj.id, `Your petition to add an annexation request on the behalf of **${local_user.name}** failed for the following reasons:${has_error.join("\n - ")}${(neutral_provinces.length > 0) ? `\n- The following provinces don't even belong to any enemy belligerents! ${neutral_provinces.join(", ")}` : ``}${(nonexistent_provinces.length > 0) ? `\n- Your cartographers are currently puzzling over your maps, as the following provinces don't even exist! ${nonexistent_provinces.join(", ")}` : ``}${(same_country.length > 0) ? `\n- You are currently trying to cede the following provinces to the same country! ${same_country.join(", ")}` : ``}`);

        //Wait 3 seconds before reinitialising prompt
        setTimeout(function(){
          module.exports.initialiseDemandProvinces(user_id, peace_obj);
        }, 3000);
      }
    },
    function (arg) {
      switch (arg) {
        case "back":
          module.exports.initialiseAnnexation(user_id, peace_obj);
          return true;

          break;
      }
    });
  },

  initialiseInstallGovernment: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_side = "";
    var game_obj = getGameObject(user_id);
    var usr = main.users[actual_id];
    var war_obj = main.global.wars[peace_obj.war_id];

    //Fetch friendly_side and enemy_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Send visual prompt
    visualPrompt(game_obj.id, user_id, {
      title: `Install Government:`,
      prompts: [
        [`Whom would you like to force a change of government for? Please mention one of the following belligerent countries:\n${enemy_countries.join("\n- ")}`, "mention"],
        [`Which government type would you like to install in place of their current regime?\n\nType **[Back]** to go back to the main Add Wargoal menu.\nType **[View Governments]** for a full list of available governments.`, "string"]
      ]
    },
    function (arg) {
      var government_type = getGovernment(arg[1].trim().toLowerCase());
      var has_error = [false, ""]; //[has_error, error_msg];
      var raw_government_type = getGovernment(arg[1].trim().toLowerCase(), { return_key: true });

      if (government_type) {
        if (main.users[arg[0]]) {
          var local_user = main.users[arg[0]];

          if (war_obj[enemy_side].includes(arg[0])) {
            if (!government_type.is_anarchy) {
              if (usr.available_governments.includes(raw_government_type)) {
                if (!peace_obj.demands.install_government)
                  peace_obj.demands.install_government = {};

                //Set new regime change
                peace_obj.demands.install_government[arg[0]] = {
                  id: arg[0],
                  type: raw_government_type;
                };

                //Print user feedback
                printAlert(game_obj.id, `${config.icons.checkmark} You have succcessfully demanded that **${local_user.name}** change their government type to **${(government_type.name) ? government_type.name : arg[1]}**.`);

                //Go back to the starting wargoal menu after one second
                setTimeout(function(){
                  module.exports.initialiseAddWargoal(user_id, peace_obj);
                }, 1000);
              } else {
                has_error = [true, `Your people have never even heard of the concept of **${(government_type.name) ? government_type.name : raw_government_type}** yet, let alone installing it in foreign countries!`];
              }
            } else {
              has_error = [true, `You cannot install anarchy in a foreign country!`];
            }
          } else {
            has_error = [true, `You are not currently at war with **${local_user.name}** in this conflict! Please check for a list of valid belligerents`];
          }
        } else {
          has_error = [true, `The country you are attempting to force a regime change in doesn't even exist!`];
        }
      } else {
        has_error = [true, `The government type you have specified does not exist! Please check your **[View Governments]** list for a full list of valid governments to install.`];
      }

      //Error handling
      if (has_error[0]) {
        printError(game_obj.id, has_error[1]);

        //Wait 3 seconds before reinitialising prompt
        setTimeout(function(){
          module.exports.initialiseInstallGovernment(user_id, peace_obj);
        }, 3000);
      }
    },
    function (arg) {
      switch (arg) {
        case "back":
          module.exports.initialisePeaceOfferScreen(user_id, peace_obj);
          module.exports.initialiseModifyPeaceTreaty(user_id, peace_obj);
          return true;

          break;
        case "view governments":
          createPageMenu(game_obj.middle_embed, {
            embed_pages: printGovernmentList(actual_id),
            user: game_obj.user
          });
          return true;

          break;
      }
    });
  },

  initialiseLiberation: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_side = "";
    var friendly_side = "";
    var has_error = [false, ""]; //[has_error, error_msg];
    var game_obj = getGameObject(user_id);
    var vassal_obj = getVassal(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Determine enemy_side and friendly_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Check if user is already demanding their liberation
    if (vassal_obj) {
      if (war_obj[enemy_side].includes(vassal_obj.overlord)) {
        if (!peace_obj.demands.liberation) {
          peace_obj.demands.liberation = true;

          //Print user feedback
          printAlert(game_obj.id, `${config.icons.checkmark} You have successfully demanded your liberation from your current overlord, **${main.users[vassal_obj.overlord].name}**.`);

          //Go back to the starting menu after one second
          setTimeout(function(){
            module.exports.initialiseAddWargoal(user_id, peace_obj);
          }, 1000);
        } else {
          has_error = [true, `You have already demanded your liberation from your overlord!`];
        }
      } else {
        has_error = [true, `Your current overlord is not fighting against you in this conflict!`];
      }
    } else {
      has_error = [true, `You can't demand liberation from your overlord if you aren't a puppet of anyone!`];
    }

    //Error handler
    if (has_error[0]) {
      printError(game_obj.id, has_error[1]);

      setTimeout(function(){
        module.exports.initialiseAddWargoal(user_id, peace_obj);
      }, 3000);
    }
  },

  initialiseModifyPeaceTreaty: function (arg0_user, arg1_peace_treaty_object, arg2_tooltip) { //[WIP] - Code bulk of function
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;
    var tooltip = (arg2_tooltip) ? arg2_tooltip : "";

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);
    var usr = main.users[actual_id];
    var war_obj = main.global.wars[peace_obj.war_id];
    var wargoal_array = [];

    //Create invisible visualPrompt()
    visualPrompt(game_obj.id, user_id, {
      title: `Editing Peace Offer for **${war_obj.name}**:`,
      do_not_display: true,

      prompts: [
        [`Which of the above actions would you like to take?`, "string"]
      ]
    },
    function (arg) {
      switch (arg[0]) {
        case "add wargoal":
          //Bring up a dynamic wargoal handler
          module.exports.initialiseAddWargoal(user_id, peace_obj);

          break;
        case "back":
          module.exports.closePeaceTreaty(user_id);

          break;
      }
    });
  },

  initialisePeaceOfferScreen: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Initialise page menu showing peace treaty effects
    createPageMenu(game_obj.bottom_embed, {
      embed_pages: splitEmbed(parsePeaceTreatyString(war_obj, peace_obj), {
        title: `[Back] ¦ Editing Peace Offer For **${war_obj.name}**:`,
        description: [
          `---`,
          "",
          `**[Add Wargoal]** ¦ **[Remove Wargoal]**`
        ].join("\n"),
        title_pages: true,
        fixed_width: true
      }),
      user: user_id
    });
  },

  initialisePuppet: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_countries = [];
    var friendly_side = "";
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Determine enemy_side and friendly_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy/friendly countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);
    for (var i = 0; i < war_obj[friendly_side].length; i++)
      friendly_countries.push(`**${main.users[war_obj[friendly_side][i]].name}**`);

    //Send visual prompt
    visualPrompt(game_obj.id, user_id, {
      title: `Puppet A Nation:`,
      prompts: [
        [`Which belligerent nation would you like to assign as a puppet? Please choose one of the following countries:\n${enemy_countries.join("\n- ")}\n\nType **[Back]** to go back to the previous wargoal menu.`, "mention"],
        [`Whom would you like to become their new overlord? Please choose one of the following countries:\n${friendly_countries.join("\n- ")}\n\nType **[Back]** to go back to the previous wargoal menu.`, "mention"]
      ]
    },
    function (arg) {
      var has_error = [false, ""]; //[has_error, error_msg];

      //Check if user even exists
      if (main.users[arg[0]]) {
        var local_user = main.users[arg[0]];

        if (war_obj[enemy_side].includes(arg[0])) {
          if (main.users[arg[1]]) {
            var local_overlord = main.users[arg[1]];

            if (war_obj[friendly_side].includes(arg[1])) {
              if (peace_obj.demands.puppet)
                peace_obj.demands.puppet = {
                  [arg[0]]: {
                    id: arg[0],
                    overlord: arg[1]
                  }
                };
              else
                peace_obj.demands.puppet[arg[0]] = {
                  id: arg[0],
                  overlord: arg[1]
                };

              //Print user feedback
              printAlert(game_obj.id, `${config.icons.checkmark} You have successfully mandated that **${local_user.name}** should become the puppet of **${local_overlord.name}** after the end of the war.`);

              //Go back to the starting menu after one second
              setTimeout(function(){
                module.exports.initialiseAddWargoal(user_id, peace_obj);
              }, 1000);
            } else {
              has_error = [true, `You can only give puppets to co-combatants of the conflict you're in, not some random countries!`];
            }
          } else {
            has_error = [true, `The country you are trying to assign as **${local_user.name}**'s overlord doesn't even exist! Please assign a valid co-combatant as their overlord.`];
          }
        } else {
          has_error = [true, `**${local_user.name}** is not currently fighting against you in this war!`];
        }
      } else {
        has_error = [true, `The country you are trying to puppet doesn't even exist! Please choose a valid enemy belligerent next time.`];
      }

      //Error handler
      if (has_error[0]) {
        printError(game_obj.id, has_error[1]);

        //Wait 3 seconds before reinitialising prompt
        setTimeout(function(){
          module.exports.initialisePuppet(user_id, peace_obj);
        }, 3000);
      }
    },
    function (arg) {
      switch (arg) {
        case "back":
          module.exports.initialisePeaceOfferScreen(user_id, peace_obj);
          module.exports.initialiseModifyPeaceTreaty(user_id, peace_obj);
          return true;

          break;
      }
    });
  },

  initialiseRetakeCores: function (arg0_user, arg1_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var peace_obj = arg1_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var enemy_countries = [];
    var enemy_side = "";
    var friendly_countries = [];
    var friendly_side = "";
    var game_obj = getGameObject(user_id);
    var war_obj = main.global.wars[peace_obj.war_id];

    //Determine enemy_side and friendly_side
    if (war_obj.attackers.includes(actual_id)) {
      friendly_side = "attackers";
      enemy_side = "defenders";
    }
    if (war_obj.defenders.includes(actual_id)) {
      friendly_side = "defenders";
      enemy_side = "attackers";
    }

    //Add all enemy/friendly countries to display
    for (var i = 0; i < war_obj[enemy_side].length; i++)
      enemy_countries.push(`**${main.users[war_obj[enemy_side][i]].name}**`);

    //Send visualPrompt()
    visualPrompt(game_obj.id, user_id, {
      title: `Grant Cores:`,
      mention: [`Whom would you like to grant their cores back to? Please type in the name of a valid nation.\n\nThis country does not have to be a nation associated with this current conflict.`, "mention"]
    },
    function (arg) {
      var has_error = [false, ""]; //[has_error, error_msg];

      if (main.users[arg[0]]) {
        var local_user = main.users[arg[0]];

        //Check if user is already intending on giving cores back to this user
        if (peace_obj.demands.retake_cores)
          if (peace_obj.demands.retake_cores.includes(arg[0]))
            has_error = [true, `You have already demanded that **${local_user.name}** get their cores back from enemy belligerents in this war!`];

        if (!has_error[0]) {
          //Add this as a valid demand
          if (peace_obj.demands.retake_cores)
            peace_obj.demands.retake_cores.push(arg[0]);
          else
            peace_obj.demands.retake_cores = [arg[0]];

          //Print user feedback
          printAlert(game_obj.id, `${config.icons.checkmark} You have successfully added a demand that **${local_user.name}** receive their cores back from any enemy belligerents engaged in this current conflict.`);

          //Go back to the starting menu after one second
          setTimeout(function(){
            module.exports.initialiseAddWargoal(user_id, peace_obj);
          }, 1000);
        }
      } else {
        has_error = [true, `You can't grant cores back to a nation that never existed!`];
      }

      //Error handling
      if (has_error[0]) {
        printError(game_obj.id, has_error[1]);

        //Wait 3 seconds before reinitialising prompt
        setTimeout(function(){
          module.exports.initialiseRetakeCores(user_id, peace_obj);
        }, 3000);
      }
    }, function (arg) {
      switch (arg) {
        case "back":
          module.exports.initialisePeaceOfferScreen(user_id, peace_obj);
          module.exports.initialiseModifyPeaceTreaty(user_id, peace_obj);
          return true;

          break;
      }
    })
  },

  /*
    modifyPeaceTreaty() - Opens up the map in a separate mapmode for showing annexed provinces, with an in-depth province selector

    Also creates a new peace treaty SVG file - should be deleted when peace treaty is parsed
  */
  modifyPeaceTreaty: function (arg0_user, arg1_war_name, arg2_peace_treaty_object) {
    //Convert from parameters
    var user_id = arg0_user;
    var war_name = arg1_war_name.trim().toLowerCase();
    var peace_obj = arg2_peace_treaty_object;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var belligerents = [];
    var game_obj = getGameObject(user_id);
    var map_file = `${actual_id}_peace_treaty`;
    var usr = main.users[actual_id];
    var war_obj = getWar(war_name);

    //Cache a new SVG
    loadMap(`${map_file}.svg`, map_file);

    //Shade in the base provinces - but only for the belligerents currently involved in the war
    for (var i = 0; i < war_obj.attackers.length; i++)
      belligerents.push(war_obj.attackers[i]);
    for (var i = 0; i < war_obj.defenders.length; i++)
      belligerents.push(war_obj.defenders[i]);

    for (var i = 0; i < belligerents.length; i++) {
      var local_provinces = getProvinces(belligerents[i], { include_hostile_occupations: true });
      var local_user = main.users[belligerents[i]];

      for (var x = 0; x < local_provinces.length; x++) {
        //Check if province will be annexed (either by retaking cores, or by outright annexation)
        var new_colour = local_user.colour;
        var new_owner = hasProvinceOwnerChange(local_provinces[x].id, peace_obj);

        //Check if province owner is proposed for vassalisation
        if (peace_obj.puppet) {
          var all_demands = Object.keys(peace_obj.puppet);

          for (var y = 0; y < all_demands.length; y++)
            if (all_demands[y] == local_provinces[x].owner) {
              var overlord_obj = main.users[peace_obj.puppet[all_demands[y]].overlord];

              new_colour = [
                Math.max(overlord_obj.colour[0] - 20, 0),
                Math.max(overlord_obj.colour[1] - 20, 0),
                Math.max(overlord_obj.colour[2] - 20, 0),
              ];
            }
        }

        //Check for annexation
        if (new_owner != local_provinces[x].owner)
          new_colour = main.users[new_owner].colour;

        //Shade in province
        setProvinceColour(map_file, local_provinces[x].id, new_colour);
      }
    }

    //Initialise map viewer
    initialiseMapViewer(game_obj.id, map_file);

    //Visual interface using visualPrompt() before creating a page menu
    module.exports.initialiseModifyPeaceTreaty(user_id);
    module.exports.initialisePeaceOfferScreen(user_id);
  }
};
