module.exports = {
  renameVassal: function (arg0_user, arg1_user, arg2_new_motto) {
    //Convert from parameters
    var user_id = arg0_user;
    var ot_user_id = arg1_user;
    var new_motto = arg2_new_motto.trim();

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var actual_ot_user_id = main.global.user_map[ot_user_id];
    var game_obj = getGameObject(user_id);
    var ot_user = main.users[actual_ot_user_id];
    var usr = main.users[actual_id];
    var vassal_obj = getVassal(actual_ot_user_id);

    //Check to see if user is actually a vassal
    if (ot_user) {
      if (vassal_obj) {
        if (vassal_obj.overlord == actual_id) {
          //Check to make sure that the new motto is under 250 characters
          if (new_motto.length <= 250) {
            var old_vassal_motto = JSON.parse(JSON.stringify(ot_user.motto));

            ot_user.motto = new_motto;

            //Print user feedback
            printAlert(game_obj.id, `${config.icons.checkmark} You have successfully changed the country motot of **${old_vassal_name}** to **${new_motto}**.`);
          } else {
            printError(game_obj.id, `**${processed_new_name}** exceeded the maximum limit of **250** characters by a total of **${parseNumber(processed_new_name.length - 250)}** character(s)! Consider shortening the name down, or picking another one.`);
          }
        } else {
          printError(game_obj.id, `**${ot_user.name}** might be a vassal, but they certainly aren't _your_ vassal, and that's what matters here.`)
        }
      } else {
        printError(game_obj.id, `The target country of **${ot_user.name}** must be vassalised to begin with before it can be bossed around by someone else!`);
      }
    } else {
      printError(game_obj.id, `No one at the Cartography Office seems to know whom that is! Try specifying a valid country name, or type **[View Ledger]** to view a full list of all diplomatically recognised nations.`);
    }
  }
};
