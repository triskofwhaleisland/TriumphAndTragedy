module.exports = {
  printBuildList: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var game_obj = getGameObject(user_id);
    var usr = main.users[actual_id];

    //Initialise building_string
    var building_string = [];

    //Iterate over all valid buildings
    var all_building_categories = getBuildingCategories();

    for (var i = 0; i < all_building_categories.length; i++) {
      var local_building_category = getBuildingCategory(all_building_categories[i]);
      var local_building_category_name = (local_building_category.name) ? local_building_category.name : parseString(all_building_categories[i]);
      var local_building_category_string = [];
      var local_buildings = Object.keys(local_building_category);

      //Iterate over all buildings in category and push them to the list based on availability
      for (var x = 0; x < local_buildings.length; x++) {
        //Only push building to category if user has the building unlocked
        if (usr.available_buildings.includes(local_building)) {
          //Get building costs, consumption and production
          var building_costs = getBuildingCost(actual_id, local_buildings[x]);
          var building_maintenance = getBuildingConsumption(actual_id, local_buildings[x]);
          var building_production = getBuildingProduction(actual_id, local_buildings[x], getCapital(actual_id).name);
          var local_building = getBuilding(local_buildings[x]);

          //Production indicator stuff
          var costs_array = [];
          var maintenance_array = [];
          var manpower_array = [];
          var production_array = [];

          var construction_string = "";
          var costs_string = "";
          var manpower_string = "";
          var production_string = "";

          //Display variables
          var building_icon = (local_building.icon) ? config.icons[local_building.icon] + " " : "";
          var building_name = (local_building.name) ? local_building.name : local_buildings[x];

          //Run through all building costs
          var all_building_costs = Object.keys(building_costs);

          //Get costs string
          for (var y = 0; y < all_building_costs.length; y++) {
            var local_building_cost = building_costs[all_building_costs[y]];
            var resource_obj = getGood(all_building_costs[y]);

            //Fetch resource_name, pop_name
            var resource_name = (resource_obj) ?
              (resource_obj.name) ? resource_obj.name : all_building_costs[y] :
              parseString(all_building_costs[y]);
            var pop_name = (Object.keys(config.pops).includes(all_building_costs[y])) ?
              (config.pops[all_building_costs[y]].name) ?
                config.pops[all_building_costs[y]].name :
                all_building_costs[y] :
              parseString(all_building_costs[y]);

            //Parse debug name
            (all_building_costs[y] != "money") ?
              costs_array.push(`${parseNumber(Math.ceil(local_building_cost))} ${resource_name}`) :
              costs_array.push(`£${parseNumber(Math.ceil(local_building_cost))}`);

            if (Object.keys(config.pops).includes(all_building_costs[y]))
              manpower_array.push(`${parseNumber(Math.ceil(local_building_cost))} ${pop_name}`);

            //Set manpower_string
            if (manpower_array.length > 0)
              manpower_string = ` ¦ ${manpower_array.join(", ")}`;
          }

          //Get production_string
          var all_produced_goods = Object.keys(building_production);

          for (var y = 0; y < all_produced_goods.length; y++) {
            var local_building_production = building_production[all_produced_goods[y]];
            var resource_obj = getGood(all_produced_goods[y]);

            //Fetch resource_name
            var resource_name = (resource_obj) ?
              (resource_obj.name) ? resource_obj.name : all_produced_goods[y] :
              parseString(all_produced_goods[y]);

            //Parse debug name; two-fold array with random minimum to maximum production, one-fold array with the same production value all the time
            if (local_building_production[0] >= 0 && local_building_production[0] >= 0) {
              (all_produced_goods[y] != "money") ?
                production_array.push(`${parseNumber(Math.ceil(local_building_production[0]))} - ${parseNumber(Math.ceil(local_building_production[1]))} ${resource_name}`) :
                production_array.push(`£${parseNumber(Math.ceil(local_building_production[0]))} - £${parseNumber(Math.ceil(local_building_production[1]))}`);
            } else {
              (all_produced_goods[y] != "money") ?
                production_array.push(`${parseNumber(Math.ceil(local_building_production[0]))} ${resource_name}`) :
                production_array.push(`£${parseNumber(Math.ceil(local_building_production[0]))}`);
            }
          }

          //Get maintenance_string
          var all_maintenance_costs = Object.keys(building_maintenance);

          for (var y = 0; y < all_maintenance_costs.length; y++) {
            var local_building_consumption = building_production[all_maintenance_costs[y]];
            var resource_obj = getGood(all_maintenance_costs[y]);

            //Fetch resource_name
            var resource_name = (resource_obj) ?
              (resource_obj.name) ? resource_obj.name : all_maintenance_costs[y] :
              parseString(all_maintenance_costs[y]);

            //Parse debug name; two-fold array with random minimum to maximum production, one-fold array with the same production value all the time
            if (local_building_consumption[0] >= 0 && local_building_consumption[0] >= 0) {
              (all_maintenance_costs[y] != "money") ?
                maintenance_array.push(`${parseNumber(Math.ceil(local_building_consumption[0]))} - ${parseNumber(Math.ceil(local_building_consumption[1]))} ${resource_name}`) :
                maintenance_array.push(`£${parseNumber(Math.ceil(local_building_consumption[0]))} - £${parseNumber(Math.ceil(local_building_consumption[1]))}`);
            } else {
              (all_maintenance_costs[y] != "money") ?
                maintenance_array.push(`${parseNumber(Math.ceil(local_building_consumption[0]))} ${resource_name}`) :
                maintenance_array.push(`£${parseNumber(Math.ceil(local_building_consumption[0]))}`);
            }
          }

          //Get construction_string
          if (building_obj.construction_turns) {
            construction_string = (building_obj.construction_turns > 0) ?
              ` ¦ Takes ${parseNumber(Math.ceil(building_obj.construction_turns))} Turn(s) to construct` :
              ` ¦ Constructed instantly`;
          } else {
            construction_string = ` ¦ Takes ${parseNumber(Math.ceil(config.defines.economy.construction_turns*usr.modifiers.construction_time))} Turn(s) to construct`;
          }

          //Entry logic
          if (production_array.length > 0 && maintenance_array.length > 0) {
            production_string = ` ¦ Produces ${production_array.join(", ")} from ${maintenance_array.join(", ")}`;
          } else if (production_array.length > 0) {
            production_string = ` ¦ Produces ${production_array.join(", ")} per turn`;
          } else if (maintenance_array.length > 0) {
            production_string = ` ¦ Consumes ${maintenance_array.join(", ")} per turn`;
          } else {
            //Custom localisation
            if (building_obj.description)
              production_string = ` ¦ ${building_obj.description}`;
          }

          //Manpower string
          if (manpower_array.length > 0)
            manpower_string = ` ¦ ${manpower_array.join(", ")}`;

          //Push building to local_building_category_string
          local_building_category_string.push(`${building_icon}**${building_name}** - ${costs_array.join(", ")}${manpower_string}${production_string}${construction_string}`);
        }
      }

      //Push building category strings to global array only if building entries exist in the first place
      if (local_building_category_string.length > 0) {
        building_string.push(`**${local_building_category_name}:**`);
        building_string.push(config.localisation.divider);
        building_string.push("");

        for (var x = 0; x < local_building_category_string.length; x++)
          building_string.push(local_building_category_string[x]);

        //Insert margin
        building_string.push("");
      }
    }

    //Return statement
    return splitEmbed(building_string, {
      title: "Build List:",
      title_pages: true,
      fixed_width: true
    });
  }
};