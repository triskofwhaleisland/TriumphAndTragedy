//Arrays framework
module.exports = {
  findDuplicates: function (arg0_array) {
    //Convert from parameters
    var array = arg0_array;

    //Declare local instance variables
    var local_duplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

    //Return statement
    return [... new Set(local_duplicates(array))];
  },

  hasDuplicate: function (arg0_array, arg1_element) {
    //Convert from parameters
    var array = arg0_array;
    var element = arg1_element;

    //Declare local instance variables
    var element_count = 0;

    for (var i = 0; i < array.length; i++)
      if (element == array[i]) element_count++;

    //Return statement
    return (element_count > 0);
  },

  getList: function (arg0_array) {
    //Convert from parameters
    var list = arg0_array;

    //Return statement
    return (Array.isArray(list)) ? list : [list];
  },

  indexesOf: function (arg0_substring, arg1_string) {
		//Convert from parameters
		var substring = arg0_substring;
		var string = arg1_string;

		var a = [], i = -1;
		while ((i = string.indexOf(substring, i+1)) >= 0) a.push(i);

		//Return statement
		return a;
	},

  moveElement: function (arg0_array, arg1_old_index, arg2_new_index) {
    //Convert from parameters
    var array = arg0_array;
    var old_index = arg1_old_index;
    var new_index = arg2_new_index;

    //Move element in array
    if (new_index >= array.length) {
      var local_index = new_index - array.length + 1;
      while (local_index--)
        array.push(undefined);
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);

    //Return statement
    return array;
  },

  randomElement: function (arg0_array) {
    //Convert from parameters
    var array = arg0_array;

    //Return statement
    return array[Math.floor(Math.random()*array.length)];
  },

  removeElement: function (arg0_array, arg1_element) {
    //Convert from parameters
    var array = arg0_array;
    var element = arg1_element;

    //Declare local instance variables and splice element
    try {
      var local_index = array.indexOf(element);
      if (local_index != -1) array.splice(local_index, 1);
    } catch {}

    //Return statement
    return array;
  },

  shuffleArray: function (arg0_array) {
    //Convert from parameters
    var array = arg0_array;

    //Declare local instance variables
    var shuffled_array = array;
    var current_index = array.length,
      temporary_value,
      random_index;

    //Shufle array (Fisher-Yates)
    while (0 != current_index) {
      random_index = Math.floor(Math.random()*current_index);
      current_index--;
      temporary_value = shuffled_array[current_index];
      shuffled_array[current_index] = shuffled_array[random_index];
      shuffled_array[random_index] = temporary_value;
    }

    //Return statement
    return shuffled_array;
  },

  truncateArray: function (arg0_array, arg1_limit) {
    //Convert from parameters
    var array = arg0_array;
    var limit = (arg1_limit) ? parseInt(arg1_limit) : 20;

    //Declare local instance variables
    var local_display_array = [];

    for (var i = 0; i < array.length; i++)
      if (i < limit) {
        local_display_array.push(array[i]);
      } else if (i == limit) {
        local_display_array.push(`(+${parseNumber(array.length - limit)} more)`);
      }

    //Return statement
    return local_display_array;
  },

  unique: function (arg0_array) {
    //Convert from parameters
    var a = arg0_array;

    //Declare local instance variables
		var seen = {};
		return a.filter(function(item) {
			return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		});
	}
};
