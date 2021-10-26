//Initialise global variables at start
module.exports = {
  initGlobal: function () {
    //Declare objects
    if (!main.global) main.global = {};
      if (!main.global.user_map) main.global.user_map = {};
    if (!main.interfaces) main.interfaces = {};
    if (!main.users) main.users = {};

    //Date trackers
    if (!main.date) main.date = {};
      if (!main.date.year) main.date.year = (config.defines.common.starting_year) ? config.defines.common.starting_year : 1500;
      if (!main.date.month) main.date.month = (config.defines.common.starting_month) ? config.defines.common.starting_month : 1;
      if (!main.date.day) main.date.day = (config.defines.common.starting_day) ? config.defines.common.starting_day : 1;
    if (!main.round_count) main.round_count = 0;

    //Declare tracker variables
    if (!main.last_backup) main.last_backup = new Date().getTime();
  }
};
