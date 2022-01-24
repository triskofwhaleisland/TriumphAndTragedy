module.exports = {
  initialiseConvoyRaid: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var game_obj = getGameObject(user_id);

    //Initialise visual prompt
    visualPrompt(game_obj.alert_embed, user_id, {
      title: `Trade Interdiction:`,
      prompts: [
        [`Which exporting country would you like to sink a convoy from?\n\nType **[View Ledger]** to view a full list of diplomatically recognised nations.`, "mention"],
        [`Which submarine flotilla would you like to assign to this task?\n\nType **[Army List]** to view a list of all combat formations.\nType 'none' to use available armies instead.`, "string"]
      ]
    },
    function (arg) {
      module.exports.initialiseSubmarineRaid(user_id, arg[1], arg[0], "convoy");
    },
    function (arg) {
      switch (arg) {
        case "army list":
          createPageMenu(game_obj.middle_embed, {
            embed_pages: printArmyList(user_id),
            user: game_obj.user
          });
          return true;

          break;
        case "view ledger":
          printLedger(user_id);
          return true;

          break;
      }
    });
  }
};