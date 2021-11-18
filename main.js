//Node.js imports
global._ = require("underscore");
global.bn_graph = require("ngraph.graph");
global.bn_path = require("ngraph.path");
global.Canvas = require("canvas");
global.diacriticless = require("diacriticless"); //TODO: install
global.Discord = require("discord.js");
global.fs = require("fs");
global.HTML = require("node-html-parser");
global.opus = require("opusscript");
global.path = require("path");
global.voice = require("@discordjs/voice");

//Import Core Framework
const FileManager = require("./core/file_manager");

//Import Core Functions
FileManager.import("./ABRS");

FileManager.import("./framework/arrays");
FileManager.import("./framework/colours");
FileManager.import("./framework/log");
FileManager.import("./framework/numbers");
FileManager.import("./framework/strings");
FileManager.import("./framework/users");

FileManager.import("./framework/data/base_user_initialisation");
FileManager.import("./framework/data/buildings_framework");
FileManager.import("./framework/data/games");
FileManager.import("./framework/data/global_initialisation");
FileManager.import("./framework/data/goods_framework");
FileManager.import("./framework/data/government_framework");
FileManager.import("./framework/data/modifier_framework");
FileManager.import("./framework/data/pop_framework");
FileManager.import("./framework/data/tech_framework");
FileManager.import("./framework/data/turn_framework");
FileManager.import("./framework/data/user_framework");

FileManager.import("./framework/discord/channels");
FileManager.import("./framework/discord/button_handler");
FileManager.import("./framework/discord/command_handler");
FileManager.import("./framework/discord/inactivity_clearer");
FileManager.import("./framework/discord/permissions_handler");
FileManager.import("./framework/discord/reaction_framework");
FileManager.import("./framework/discord/select_handler");
FileManager.import("./framework/discord/users");

FileManager.import("./framework/map/map_renderer");
FileManager.import("./framework/map/province_renderer");

FileManager.import("./framework/ui/cities_interface");
FileManager.import("./framework/ui/country_interface");
FileManager.import("./framework/ui/economy_interface");
FileManager.import("./framework/ui/games");
FileManager.import("./framework/ui/government_interface");
FileManager.import("./framework/ui/map_viewer");
FileManager.import("./framework/ui/page_handler");
FileManager.import("./framework/ui/pops_interface");
FileManager.import("./framework/ui/provinces_interface");
FileManager.import("./framework/ui/tech_interface");
FileManager.import("./framework/ui/topbar_interface");
FileManager.import("./framework/ui/ui_framework");

//Game command files

FileManager.import("./game/colonisation/settle");

FileManager.import("./game/country/create_country");

FileManager.import("./game/politics/coup_government");
FileManager.import("./game/politics/set_government");
FileManager.import("./game/politics/set_tax");

FileManager.import("./game/province/cities");
FileManager.import("./game/province/settle_province");

//Declare config loading order
global.config = {};
global.load_order = {
  load_directories: [
    "common",
    "events",
    "interface",
    "localisation"
  ],
  load_files: [
    ".config_backend.js",
    "icons.js"
  ]
};
FileManager.loadConfig();
FileManager.loadFile("settings.js");

//Initialise Discord.js client and related instance variables
global.client = new Discord.Client({ intents: [1, 4, 8, 16, 32, 64, 128, 512, 1024, 2048, 4096, 8192, 16384] });
global.backup_loaded = false;
global.interfaces = {};
global.visual_prompts = {};

client.login(settings.bot_token);

//Load DB from JSON
loadBackupArray();
loadMostRecentSave();

//Global error handling
process.on("unhandledRejection", (error) => {
  log.error(`Unhandled promise rejection. ${error.toString()}`);
  console.log(error);
});

//Reaction/interaction framework
client.on("interactionCreate", (interaction) => {
  buttonHandler(interaction);
  selectHandler(interaction);
});
client.on("messageReactionAdd", async (reaction, user) => {
  reactionHandler(reaction, user);
});

//Command handling
client.on("messageCreate", async (message) => {
  //Fetch local parameters
  username = message.author.username;
  user_id = message.author.id;
  input = message.content;

  //Parse arguments
  if (settings.no_space) input = input.replace(settings.prefix, `${settings.prefix} `);
  var arg = splitCommandLine(input);

  //Check output
  log.info(`
    Author: ${username}
    Arguments: ${arg.join(", ")}

    Original Content: ${input}
  `);

  if (!message.author.bot) {
    //Debug commands (these ones have a prefix)
    {
      if (equalsIgnoreCase(arg[0], settings.prefix)) {
        if (equalsIgnoreCase(arg[1], "console")) {
          var full_code = [];
          for (var i = 2; i < arg.length; i++) full_code.push(arg[i]);

          eval(full_code.join(" "));

          //Send back prompt
          message.channel.send("Console command executed. Warning! This command can be highly unstable if not used correctly.").then((msg) => {
						//Delete console command output after 10 seconds
						setTimeout(function() { msg.delete(); }, 10000);
					});
        }
      }
    }

    //Lobby commands (these also have a prefix, with the exception of visual prompts)
    {
      if (equalsIgnoreCase(arg[0], settings.prefix)) {
        if (equalsIgnoreCase(arg[1], "play")) {
          createNewGame(user_id, message);
        }
      }
    }

    //Game input commands
    {
      if (getGame(user_id)) {
        var game_obj = interfaces[getGame(user_id)];

        if (game_obj.channel == message.channel.id) {
          message.delete();
          commandHandler(getGame(user_id), arg.join(" "));

          //Check if game is still active
          if (returnGameFromChannelID(message.channel.id))
            interfaces[returnGameFromChannelID(message.channel.id)].last_active = new Date().getTime();
        }
      }
    }
  }
});


//Logic loops, 1-second logic loop
setInterval(function(){
  //Cache interfaces
  main.interfaces = interfaces;

  //Initialise variables before anything else!
	initGlobal();

  //Delete inactive channels
  clearInactiveGames();

  //ABRS - Save backups!
	var current_date = new Date().getTime();
	var time_difference = current_date - main.last_backup;
  var turn_time_difference = current_date - main.last_turn;

	if (time_difference > settings.backup_timer*1000) {
		main.last_backup = current_date;
		writeSave({ file_limit: settings.backup_limit });
	}

  //Turn processing for all users
  if (turn_time_difference > settings.turn_time*1000) {
    main.last_backup = current_date;
    main.last_turn = current_date;
    writeSave({ file_limit: settings.backup_limit });

    //Iterate over all users and process their turns
    var all_users = Object.keys(main.users);

    for (var i = 0; i < all_users.length; i++)
      nextTurn(all_users[i]);
  }

  //Write to database.js
  try {
  	fs.writeFile('database.js', JSON.stringify(main), function (err,data) {
  		if (err) return log.info(err);
  	});
  } catch (e) {
    log.error(`Ran into an error whilst attempting to save to database.js! ${e}.`);
  }
}, 1000);
