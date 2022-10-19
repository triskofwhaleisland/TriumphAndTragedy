module.exports = {
  /*
    Client state data structure:
    {
      id: client_state_id,

      name: "Netherlands",
      flag: "<image URL>",
      colour: [235, 159, 76],

      capital_id: "1",
      provinces: ["345", "572", "580"]
    }
  */

  createClientState: function (arg0_user, arg1_name) {
    //Convert from parameters
    var user_id = arg0_user;
    var country_name = arg1_name.trim();

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var client_state_id = module.exports.generateClientStateID(user_id);
    var usr = main.users[actual_id];

    //Create a new client state object
    var client_state_obj = initCountry(client_state_id, country_name);

    //Check to make sure name is valid
    if (client_state_obj) {
      var client_state = {
        id: client_state_id,

        name: client_state_obj.name,
        flag: client_state_obj.flag,
        colour: client_state_obj.colour,

        provinces: []
      };

      usr.client_states[client_state_id] = client_state;

      //Return statement
      return [client_state_obj, client_state];
    }
  },

  generateClientStateID: function (arg0_user) {
    //Convert from parameters
    var user_id = arg0_user;

    //Declare local instance variables
    var actual_id = main.global.user_map[user_id];
    var usr = main.users[actual_id];

    var all_client_states = Object.keys(usr.client_states);

    //While loop to find ID, just in-case of conflicting random ID's:
    while (true) {
      var local_id = generateUserID();

      if (!all_client_states.includes(local_id)) {
        return local_id;
        break;
      }
    }
  }
};