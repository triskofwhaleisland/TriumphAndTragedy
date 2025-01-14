module.exports = {
  /*
    generatePops() - Generates a certain number of pops for a given province with standard rolling.
    options: {
      type: "all"/["workers", "soldiers"] - Chooses the types of pops to generate
      amount: 100000 - How many pops should be generated in the given province
    }
  */
  generatePops: function (arg0_province, arg1_options) {
    //Convert from parameters
    var province_obj = getProvince(arg0_province);
    var options = arg1_options;

    //Initialise default options values
    options.type = (options.type) ? ["all"] : getList(options.type);

    //Declare local instance variables
    var all_pops = (options.type.includes("all")) ?
      Object.keys(config.pops) :
      options.type;
    var old_population = (province_obj.pops) ? JSON.parse(JSON.stringify(province_obj.pops)) : {};
    var usr = (province_obj) ? main.users[province_obj.controller] : undefined;

    //Regular error trapping
    try {
      //Remove old_population from user pop trackers
      var all_old_pops = Object.keys(old_population);
      var total_old_population = 0;

      for (var i = 0; i < all_old_pops.length; i++)
        if (all_old_pops[i] != "population") {
          var local_old_pop = old_population[all_old_pops[i]];
          usr.pops[all_old_pops[i]] -= local_old_pop;
          total_old_population += local_old_pop;
        }

      //Remove old user population so that it can be 'reset' to accomodate the new one
      usr.population -= total_old_population;

      //Generate pops similar to settle_province.js
      var population_cache = options.amount;
      if (!province_obj.pops) province_obj.pops = {};

      //Generate specialised pops first
      for (var i = 0; i < all_pops.length; i++)
        if (config.pops[all_pops[i]].specialised_pop) {
          //Roll the dice for the local pop type
          var local_pop = config.pops[all_pops[i]];
          var random_percentage = randomNumber((local_pop.chance*100)/2, (local_pop.chance*100)*2);
          var population_change = Math.ceil(population_cache*(random_percentage/100));

          //Undefined pops save space in the database
          province_obj.pops[all_pops[i]] = (province_obj.pops[all_pops[i]]) ?
            province_obj.pops[all_pops[i]] + population_change :
            population_change;

          //Deduct from cache
          population_cache -= population_change;
        }

      //Partition the remaining pops in the cache between the non-specialised pops
      for (var i = 0; i < all_pops.length; i++)
        if (!config.pops[all_pops[i]].specialised_pop)
          try {
            var population_change = Math.ceil(population_cache*config.pops[all_pops[i]].chance);

            province_obj.pops[all_pops[i]] = (province_obj.pops[all_pops[i]]) ?
              province_obj.pops[all_pops[i]] + population_change :
              population_change;
          } catch (e) {
            log.warn(`generatePops() - ran into an error whilst generating pops of type ${all_pops[i]} in Province ID ${province_id}: ${e}.`)
          }

      //Calculate new total population of province and add it to user tracker variables
      var all_local_pops = Object.keys(province_obj.pops);
      var total_population = 0;

      for (var i = 0; i < all_local_pops.length; i++)
        if (all_local_pops[i] != "population") {
          var local_pop = province_obj.pops[all_local_pops[i]];
          usr.pops[all_local_pops[i]] += local_pop;
          total_population += local_pop;
        }

      //Add total_population back to usr.population and province tracker
      province_obj.pops.population = total_population;
      usr.population += total_population;
    } catch (e) {
      log.error(`generatePops() ran into an error: ${e}.`);
    }
  },

  getDemographics: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var all_pops = Object.keys(config.pops);
    var all_provinces = getProvinces(user_id);
    var pop_obj = {};
    var usr = main.users[actual_id];

    //Iterate over all provinces and calculate population
    for (var i = 0; i < all_provinces.length; i++)
      for (var x = 0; x < all_pops.length; x++) {
        var local_key = `${all_provinces[i].type}_${all_pops[x]}`;

        pop_obj[local_key] = (pop_obj[local_key]) ?
          pop_obj[local_key] + all_provinces[i].pops[all_pops[x]] :
          all_provinces[i].pops[all_pops[x]];
      }

    //Get unique province types
    var all_pop_keys = Object.keys(pop_obj);
    var unique_province_types = [];

    for (var i = 0; i < all_pop_keys.length; i++) {
      var local_pop_array = all_pop_keys[i].split("_");

      if (!unique_province_types.includes(local_pop_array[0]))
        unique_province_types.push(local_pop_array[0]);
    }

    //Calculate total population for each province type
    for (var i = 0; i < unique_province_types.length; i++) {
      var local_key = `${unique_province_types[i]}_population`;

      pop_obj[local_key] = 0;

      for (var x = 0; x < all_pops.length; x++)
        pop_obj[local_key] += pop_obj[`${unique_province_types[i]}_${all_pops[x]}`];

      //Add to total population
      pop_obj.population = (pop_obj.population) ?
        pop_obj.population + pop_obj[local_key] :
        pop_obj[local_key];
    }

    //Return statement
    return pop_obj;
  },

  getFaminePenalty: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var government_obj = config.governments[usr.government];
    var famine_penalty = (government_obj.effect.famine_penalty) ? government_obj.effect.famine_penalty : 0.1;
    var usr = main.users[actual_id];

    //Return statement
    return Math.ceil(usr.population*famine_penalty);
  },

  getMilitaryPops: function () {
    //Declare local instance variables
    var all_pops = Object.keys(config.pops);
    var military_pop_types = [];

    for (var i = 0; i < all_pops.length; i++)
      if (config.pops[all_pops[i]].military_pop)
        military_pop_types.push(all_pops[i]);

    //Return statement
    return military_pop_types;
  },

  getPopModifier: function (arg0_user, arg1_type, arg2_modifier) {
    //Convert from parameters
    var user_id = arg0_user;
    var pop_type = arg1_type;
    var raw_modifier = arg2_modifier;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var pop_obj = config.pops[pop_type];
    var total_modifier = 0;
    var total_pop_type = module.exports.getTotalPopManpower(user_id, pop_type);
    var usr = main.users[actual_id];

    //Regular error trapping just in case the specified modifier does not exist
    try {
      //Calculate total_modifier
      total_modifier = (total_pop_type/100000)*pop_obj.per_100k[raw_modifier];

      //Make sure to implement a proper cap
      if (pop_obj.max_modifier_limit[raw_modifier])
        if (total_modifier > pop_obj.max_modifier_limit[raw_modifier])
          total_modifier = pop_obj.max_modifier_limit[raw_modifier];

      //Return statement
      return total_modifier;
    } catch (e) {
      log.error(`Could not calculate total pop modifier of type ${pop_type} for modifier ${raw_modifier}: ${e}`);
      console.error(e);
    }
  },

  getPopulation: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var pop_obj = module.exports.getDemographics(user_id);
    var usr = main.users[actual_id];

    //Return statement
    return pop_obj.population;
  },

  getTotalActiveDuty: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var all_pops = Object.keys(config.pops);
    var total_active_duty = 0;
    var usr = main.users[actual_id];

    //Fetch total active duty
    for (var i = 0; i < all_pops.length; i++)
      if (config.pops[all_pops[i]].military_pop)
        total_active_duty += usr.pops[`used_${all_pops[i]}`];

    //Return statement
    return total_active_duty;
  },

  getTotalPopManpower: function (arg0_user, arg1_type, arg2_raw_modifier) {
    //Convert from parameters
    var user_id = arg0_user;
    var pop_type = arg1_type;
    var raw_modifier = arg2_raw_modifier;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var pop_obj = config.pops[pop_type];
    var usr = main.users[actual_id];

    var availability_modifier = (pop_obj.military_pop) ?
      usr.modifiers.maximum_manpower*usr.modifiers.national_manpower
      : 1;

    //Return statement
    return (!raw_modifier) ? Math.ceil(usr.pops[pop_type]*availability_modifier) : availability_modifier;
  },

  /*
    killPops() - Kills a certain number of pops from a user based on the available options.
    options: {
      type: "soldiers", - Which type of pop to kill off
      amount: 10000 - How much of the pop to kill off
    }
  */
  killPops: function (arg0_user, arg1_options) {
    //Convert from parameters
    var user_id = arg0_user;
    var options = arg1_options;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var decimation_obj = {};
    var pop_obj = config.pops[options.type];
    var pop_types = getList(options.type);
    var remaining_population = returnSafeNumber(options.amount);
    var usr = main.users[actual_id];

    //Parse 'all' argument as well
    pop_types = (pop_types.includes("all")) ? Object.keys(config.pops) : pop_types;

    //Assign decimation_array to decimation_obj
    var decimation_array = splitNumber(1, pop_types.length);

    for (var i = 0; i < pop_types.length; i++)
      decimation_obj[pop_types[i]] = decimation_array[i];

    //Begin subtracting pops
    for (var i = 0; i < pop_types.length; i++)
      removePops(user_id, Math.ceil(decimation_obj[pop_types[i]]*remaining_population), pop_types[i]);

    //Add to civilian/military casualties tracker
    if (!getList(options.type).includes("all")) {
      if (pop_obj.military_pop)
        usr.recent_military_casualties[usr.recent_military_casualties.length - 1] += options.amount;
      else
        usr.recent_civilian_casualties[usr.recent_civilian_casualties.length - 1] += options.amount;
    } else {
      usr.recent_civilian_casualties[usr.recent_civilian_casualties.length - 1] += options.amount;
    }
  },

  parsePops: function () {
    //Declare local instance variables
    var all_pops = Object.keys(config.pops);

    //Process pop objects
    for (var i = 0; i < all_pops.length; i++) {
      var local_pop = config.pops[all_pops[i]];

      //Set icon values
      if (local_pop.icon) local_pop.icon = config.icons[local_pop.icon];
    }
  },

  removePops: function (arg0_user, arg1_amount, arg2_type) {
    //Convert from parameters
    var user_id = arg0_user;
    var amount = arg1_amount;
    var remaining_population = returnSafeNumber(amount);
    var pop_type = arg2_type;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var shuffled_provinces = shuffleArray(getProvinces(user_id));
    var usr = main.users[actual_id];

    //Begin subtracting
    for (var i = 0; i < shuffled_provinces.length; i++)
      if (remaining_population > 0)
        if (shuffled_provinces[i].pops[pop_type] >= remaining_population) {
          shuffled_provinces[i].pops[pop_type] -= remaining_population;
          remaining_population = 0;
        } else {
          shuffled_provinces[i].pops[pop_type] = 0;
          remaining_population -= shuffled_provinces[i].pops[pop_type];
        }

    //Update tracker variables
    usr.pops[pop_type] -= returnSafeNumber(amount);
    usr.population -= returnSafeNumber(amount);

    //Append to either recent_civilian_casualties or recent_military_casualties depending on pop type
    (getMilitaryPops().includes(pop_type)) ?
      usr.recent_military_casualties[usr.recent_military_casualties.length-1] += returnSafeNumber(amount) :
      usr.recent_civilian_casualties[usr.recent_civilian_casualties.length-1] += returnSafeNumber(amount);
  }
};
