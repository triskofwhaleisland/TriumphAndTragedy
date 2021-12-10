module.exports = {
  createAutoTrade: function (arg0_user, arg1_receiving_user, arg2_amount, arg3_good_type) { //[WIP] - Remember to update auto-trade UI when being focused on by user
    //Convert from parameters
    var user_id = arg0_user;
    var other_user = arg1_receiving_user;
    var raw_amount = parseInt(Math.ceil(arg2_amount));
    var raw_good_name = arg3_good_type.toLowerCase();
    var good_name = getGood(arg3_good_type, { return_key: true });
    var good_obj = getGood(arg3_good_type);

    //Convert from parameters
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);
    var ot_actual_id = main.global.user_map[other_user];
    var ot_user = main.users[ot_actual_id];
    var usr = main.users[actual_id];

    //Make sure that the other user exists to begin with
    if (ot_user) {
      if (ot_actual_id != actual_id) {
        if (good_obj || raw_good_name == "money") {
          if (!good_obj.research_good) {
            if (!good_obj.doesnt_stack) {
              if (!isNaN(raw_amount)) {
                if (raw_amount > 0) {
                  if (!isBlockaded(actual_id)) {
                    if (!isBlockaded(ot_actual_id)) {
                      usr.auto_trades[generateAutoTradeID()] = {
                        exporter: actual_id,
                        target: ot_actual_id,

                        amount: raw_amount,
                        good_type: (raw_good_name == "money") ?
                          "money" :
                          good_name
                      };
                    } else {
                      printError(game_obj.id, `You can't ship items to other blockaded users!`);
                    }
                  } else {
                    printError(game_obj.id, `You can't conduct auto-trades whilst blockaded!`);
                  }
                } else if (raw_amount == 0) {
                  printError(game_obj.id, `Why did you even try to set up an auto-trade ...`);
                } else {
                  printError(game_obj.id, `You can't steal items from other players like that!`);
                }
              } else {
                printError(game_obj.id, `You must ship valid numeric amounts of goods to other countries!`);
              }
            } else {
              printError(game_obj.id, `You can't ship non-stackable goods to other countries!`);
            }
          } else {
            printError(game_obj.id, `You can't ship Knowledge to other countries!`);
          }
        } else {
          printError(game_obj.id, `You can only ship inventory items or money to other countries!`);
        }
      } else {
        printError(game_obj.id, `You can't conduct auto-trades with yourself!`);
      }
    } else {
      printError(game_obj.id, `The country you are trying to ship items to doesn't even exist!`);
    }
  }
};
