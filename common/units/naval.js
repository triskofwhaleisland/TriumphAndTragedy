config.units.naval = {
  name: "Naval",
  icon: "naval_units",
  type: "naval",

  branch_name: "Navy",

  //Naval Units
  caravels: {
    name: "Caravels",
    singular: "Caravel",

    attack: 200,
    defence: 500,
    manoeuvre: 8,
    movement: 7.41,
    initiative: 1,

    cost: {
      lumber: 2,
      iron: 1,
      food: 5,
      money: 500,
      naval_units_cp: 5
    },
    maintenance: {
      food: 2,
      iron: 1,
      lumber: 1,

      money: 350,
      naval_units_cp: 2
    },
    manpower_cost: {
      soldiers: 200
    },
    quantity: 5
  },
  galleons: {
    name: "Galleons",
    singular: "Galleon",

    attack: 2500,
    defence: 1250,
    manoeuvre: 2,
    movement: 12.96,
    initiative: 3,

    cost: {
      lumber: 3,
      iron: 2,
      lead: 2,
      food: 7,
      money: 1000,

      naval_units_cp: 10
    },
    maintenance: {
      food: 3,
      lead: 2,
      lumber: 2,

      money: 800,
      naval_units_cp: 7
    },
    manpower_cost: {
      soldiers: 500
    },
    quantity: 1
  },
  men_of_war: {
    name: "Men-of-War",
    singular: "Man-of-War",

    attack: 3250,
    defence: 1500,
    manoeuvre: 2,
    movement: 15.74,
    initiative: 4,

    cost: {
      lumber: 5,
      iron: 3,
      lead: 3,
      food: 7,
      food: 15,
      money: 1500,

      naval_units_cp: 15
    },
    maintenance: {
      food: 4,
      lumber: 3,
      iron: 2,
      lead: 2,

      money: 1200,
      naval_units_cp: 7
    },
    manpower_cost: {
      soldiers: 600
    },
    quantity: 1
  },
  ships_of_the_line: {
    name: "Ships-of-the-Line",
    singular: "Ship-of-the-Line",

    attack: 3000,
    defence: 2000,
    manoeuvre: 3,
    movement: 22.22,
    initiative: 4,

    cost: {
      lumber: 5,
      iron: 3,
      lead: 3,
      food: 7,
      money: 2000,

      naval_units_cp: 15
    },
    maintenance: {
      food: 5,
      lumber: 4,
      iron: 2,
      lead: 2,
      copper: 1,

      money: 2500,
      naval_units_cp: 8
    },
    manpower_cost: {
      soldiers: 1100
    },
    quantity: 1
  },
  first_rates: {
    name: "First Rates",
    singular: "First Rate",

    attack: 4250,
    defence: 1750,
    manoeuvre: 3,
    movement: 26.70,
    initiative: 5,

    cost: {
      lumber: 7,
      iron: 3,
      lead: 5,
      food: 6,
      money: 2500,

      naval_units_cp: 20
    },
    maintenance: {
      food: 5,
      lumber: 5,
      lead: 3,
      copper: 2,
      iron: 2,

      money: 3000,
      naval_units_cp: 10
    },
    manpower_cost: {
      soldiers: 850
    },
    quantity: 1
  },
  frigates: {
    name: "Frigates",
    singular: "Frigate",

    attack: 1250,
    defence: 875,
    maneouvre: 4,
    movement: 25.93,
    initiative: 3,

    cost: {
      lumber: 5,
      iron: 2,
      lead: 3,
      food: 4,
      money: 1500,

      naval_units_cp: 10
    },
    maintenance: {
      food: 4,
      lumber: 3,
      lead: 2,
      copper: 1,
      iron: 1,

      money: 2500,
      naval_units_cp: 6
    },
    manpower_cost: {
      soldiers: 630
    },
    quantity: 2
  },
  steamboats: {
    name: "Steamboats",
    singular: "Steamboat",

    attack: 350,
    defence: 600,
    manoeuvre: 6,
    movement: 6.44,
    initiative: 1,

    cost: {
      lumber: 2,
      artillery: 1,
      iron: 5,
      lead: 2,
      food: 5,
      money: 3000,

      naval_units_cp: 10
    },
    maintenance: {
      food: 2,
      coal: 1,
      copper: 1,
      lead: 1,
      machine_parts: 1,
      uniforms: 1,

      money: 3000,
      naval_units_cp: 4
    },
    manpower_cost: {
      soldiers: 200
    },
    quantity: 5
  },
  clippers: {
    name: "Clippers",
    singular: "Clipper",

    attack: 150,
    defence: 300,
    manoeuvre: 8,
    movement: 30,
    initiative: 3,

    cost: {
      lumber: 3,
      iron: 1,
      food: 7,
      money: 1500,

      naval_units_cp: 5
    },
    maintenance: {
      lumber: 8,
      food: 6,
      lead: 2,
      iron: 2,

      money: 900,
      naval_units_cp: 2
    },
    manpower_cost: {
      soldiers: 4000
    },
    quantity: 5
  },
  gunboats: {
    name: "Gunboats",
    singular: "Gunboat",

    attack: 600,
    defence: 250,
    manoeuvre: 4,
    movement: 25.93,
    initiative: 4,

    cost: {
      iron: 5,
      artillery: 1,
      uniforms: 5,
      ammunition: 2,
      food: 6,
      money: 2000,

      naval_units_cp: 10
    },
    maintenance: {
      steel: 4,
      ammunition: 2,
      coal: 2,
      food: 2,
      artillery: 1,
      copper: 1,
      machine_parts: 1,
      uniforms: 1,

      money: 2000,
      naval_units_cp: 5
    },
    manpower_cost: {
      soldiers: 200
    },
    quantity: 5
  },
  ironclads: {
    name: "Ironclads",
    singular: "Ironclad",

    attack: 6000,
    defence: 9000,
    manoeuvre: 3,
    movement: 26.50,
    initative: 1,

    cost: {
      iron: 10,
      artillery: 3,
      uniforms: 5,
      ammunition: 5,
      coal: 3,
      food: 5,
      money: 5000,

      naval_units_cp: 20
    },
    maintenance: {
      coal: 4,
      iron: 4,
      ammunition: 2,
      artillery: 2,
      food: 2,
      copper: 1,
      machine_parts: 1,
      uniforms: 2,

      money: 3500,
      naval_units_cp: 8
    },
    manpower_cost: {
      soldiers: 320
    },
    quantity: 1
  },
  breastwork_monitors: {
    name: "Breastwork Monitors",
    singular: "Breastwork Monitor",
    type: ["cruiser"],

    attack: 7500,
    defence: 10000,
    manoeuvre: 3,
    movement: 11.11,
    initiative: 4,

    cost: {
      iron: 12,
      artillery: 4,
      uniforms: 5,
      ammunition: 10,
      coal: 3,
      food: 3,
      money: 5500,

      naval_units_cp: 30
    },
    maintenance: {
      iron: 6,
      ammunition: 4,
      coal: 4,
      artillery: 2,
      food: 2,
      lead: 2,
      copper: 1,
      machine_parts: 1,
      uniforms: 2,

      money: 4000,
      naval_units_cp: 10
    },
    manpower_cost: {
      soldiers: 136
    },
    quantity: 1
  },
  destroyers: {
    name: "Destroyers",
    singular: "Destroyer",
    type: ["destroyer"],

    attack: 800,
    defence: 1200,
    manoeuvre: 5,
    movement: 65,
    initiative: 4,

    cost: {
      steel: 8,
      artillery: 4,
      uniforms: 10,
      ammunition: 10,
      refined_petroil: 3,
      food: 5,
      money: 3000,

      naval_units_cp: 10
    },
    maintenance: {
      coal: 3,
      steel: 3,
      ammunition: 2,
      food: 2,
      lead: 2,
      artillery: 1,
      machine_parts: 1,
      uniforms: 1,

      money: 3500,
      naval_units_cp: 8
    },
    manpower_cost: {
      soldiers: 230
    },
    quantity: 5
  },
  cruisers: {
    name: "Cruisers",
    singular: "Cruiser",
    type: ["cruiser"],

    attack: 5000,
    defence: 3750,
    manoeuvre: 4,
    movement: 55.56,
    initiative: 5,

    cost: {
      steel: 12,
      artillery: 5,
      uniforms: 10,
      ammunition: 15,
      refined_petroil: 5,
      food: 7,

      naval_units_cp: 15
    },
    maintenance: {
      refined_petroil: 4,
      steel: 4,
      ammunition: 3,
      artillery: 2,
      food: 2,
      lead: 2,
      uniforms: 2,
      machine_parts: 1,

      money: 5000,
      naval_units_cp: 12
    },
    manpower_cost: {
      soldiers: 1340
    },
    quantity: 2
  },
  pre_dreadnoughts: {
    name: "Pre-Dreadnoughts",
    singular: "Pre-Dreadnought",

    attack: 10000,
    defence: 17500,
    manoeuvre: 2,
    movement: 37.04,
    initiative: 6,

    cost: {
      steel: 15,
      machine_parts: 5,
      ammunition: 16,
      refined_petroil: 5,
      food: 8,
      money: 7000,

      naval_units_cp: 20
    },
    maintenance: {
      refined_petroil: 6,
      steel: 5,
      ammunition: 4,
      artillery: 2,
      food: 2,
      lead: 2,
      machine_parts: 2,
      uniforms: 2,

      money: 6000,
      naval_units_cp: 14
    },
    manpower_cost: {
      soldiers: 392
    },
    quantity: 1
  },
  dreadnoughts: {
    name: "Dreadnoughts",
    singular: "Dreadnought",

    attack: 17500,
    defence: 20000,
    manoeuvre: 1,
    movement: 38.89,
    initiative: 5,

    cost: {
      steel: 18,
      machine_parts: 10,
      ammunition: 20,
      iron: 5,
      refined_petroil: 5,
      food: 9,
      money: 10000,

      naval_units_cp: 40
    },
    maintenance: {
      refined_petroil: 6,
      steel: 6,
      ammunition: 4,
      artillery: 4,
      lead: 4,
      food: 3,
      machine_parts: 2,
      uniforms: 2,

      money: 8000,
      naval_units_cp: 20
    },
    manpower_cost: {
      soldiers: 810
    },
    quantity: 1
  },
  torpedo_boats: {
    name: "Torpedo Boats",
    singular: "Torpedo Boat",

    attack: 2000,
    defence: 50,
    manoeuvre: 6,
    movement: 46.50,
    initiative: 5,

    cost: {
      steel: 3,
      iron: 2,
      ammunition: 5,
      refined_petroil: 3,
      food: 5,
      money: 1500,

      naval_units_cp: 5
    },
    maintenance: {
      ammunition: 2,
      machine_parts: 2,
      food: 1,
      lead: 1,
      refined_petroil: 1,
      uniforms: 1,

      money: 3500,
      naval_units_cp: 5
    },
    manpower_cost: {
      soldiers: 150
    },
    quantity: 5
  },
  battlecruisers: {
    name: "Battlecruisers",
    singular: "Battlecruiser",

    attack: 17500,
    defence: 10000,
    manoeuvre: 4,
    movement: 49.30,
    initiative: 6,

    cost: {
      steel: 5,
      artillery: 5,
      machine_parts: 10,
      ammunition: 10,
      iron: 4,
      lead: 3,
      refined_petroil: 7,
      food: 7,
      money: 6500,

      naval_units_cp: 20
    },
    maintenance: {
      ammunition: 4,
      steel: 4,
      lead: 4,
      refined_petroil: 4,
      artillery: 3,
      food: 3,
      uniforms: 3,
      machine_parts: 2,

      money: 6000,
      naval_units_cp: 15
    },
    manpower_cost: {
      soldiers: 1430
    },
    quantity: 1
  },
  submarines: {
    name: "Submarines",
    singular: "Submarine",
    type: ["submarine"],

    attack: 17500,
    defence: 500,
    manoeuvre: 8,
    movement: 56,
    initiative: 4,

    cost: {
      steel: 3,
      machine_parts: 5,
      artillery: 1,
      small_arms: 2,
      ammunition: 5,
      refined_petroil: 3,
      food: 8,
      money: 2000,

      naval_units_cp: 10
    },
    maintenance: {
      machine_parts: 4,
      steel: 4,
      ammunition: 2,
      food: 2,
      refined_petroil: 2,
      artillery: 1,
      uniforms: 1,

      money: 4000,
      naval_units_cp: 6
    },
    manpower_cost: {
      soldiers: 300
    },
    quantity: 5
  },
  air_carriers: {
    name: "Air Carriers",
    singular: "Air Carrier",
    type: ["aircraft_carrier"],

    attack: 1500,
    carrier_capacity: 20,
    defence: 2000,
    manoeuvre: 2000,
    movement: 28.71,
    initiative: 1,

    cost: {
      steel: 12,
      small_arms: 5,
      lumber: 10,
      ammunition: 10,
      refined_petroil: 10,
      food: 10,
      money: 9000,

      naval_units_cp: 40
    },
    maintenance: {
      machine_parts: 6,
      steel: 4,
      ammunition: 4,
      food: 4,
      refined_petroil: 4,
      artillery: 2,
      lead: 2,
      uniforms: 2,

      money: 8000,
      naval_units_cp: 15
    },
    manpower_cost: {
      soldiers: 470
    },
    quantity: 1
  },
  battleships: {
    name: "Battleships",
    singular: "Batlteship",

    attack: 25000,
    defence: 37500,
    manoeuvre: 3,
    movement: 61.10,
    initiative: 5,

    cost: {
      steel: 15,
      machine_parts: 7,
      artillery: 8,
      small_arms: 10,
      lumber: 5,
      lead: 5,
      refined_petroil: 7,
      food: 12,
      money: 8000,

      naval_units_cp: 20
    },
    maintenance: {
      refined_petroil: 8,
      ammunition: 8,
      machine_parts: 6,
      artillery: 4,
      food: 4,
      steel: 4,
      uniforms: 4,
      lead: 2,

      money: 8500,
      naval_units_cp: 10
    },
    manpower_cost: {
      soldiers: 2065
    },
    quantity: 1
  },
  aircraft_carriers: {
    name: "Aircraft Carriers",
    singular: "Aircraft Carrier",
    type: ["aircraft_carrier"],

    attack: 1200,
    carrier_capacity: 35,
    defence: 2200,
    manoeuvre: 2,
    movement: 61,
    initiative: 1,

    cost: {
      steel: 20,
      lumber: 15,
      machine_parts: 10,
      artillery: 5,
      small_arms: 20,
      ammunition: 20,
      gold: 1,
      refined_petroil: 10,
      food: 10,
      money: 10000,

      naval_units_cp: 40
    },
    maintenance: {
      refined_petroil: 10,
      ammunition: 6,
      food: 4,
      lead: 4,
      machine_parts: 4,
      uniforms: 4,
      artillery: 2,
      steel: 2,

      money: 9000,
      naval_units_cp: 20
    },
    manpower_cost: {
      soldiers: 2220
    },
    quantity: 1
  },
  nuclear_submarines: {
    name: "Nuclear Submarines",
    singular: "Nuclear Submarine",
    type: ["submarine"],

    attack: 112500,
    defence: 2750,
    manoeuvre: 6,
    movement: 82.80,
    initiative: 2,

    cost: {
      steel: 15,
      artillery: 5,
      machine_parts: 15,
      ammunition: 10,
      gold: 3,
      refined_petroil: 7,
      food: 10,
      money: 5000,

      naval_units_cp: 30
    },
    maintenance: {
      ammunition: 8,
      machine_parts: 6,
      lead: 4,
      artillery: 2,
      food: 2,
      gold: 2,
      refined_petroil: 2,
      steel: 2,
      uniforms: 2,

      money: 9000,
      naval_units_cp: 15
    },
    manpower_cost: {
      soldiers: 130
    },
    quantity: 1
  },
  supercarriers: {
    name: "Supercarriers",
    singular: "Supercarrier",
    type: ["aircraft_carrier"],

    attack: 2000,
    carrier_capacity: 50,
    defence: 3500,
    manoeuvre: 1,
    movement: 61,
    initiative: 1,

    cost: {
      steel: 25,
      artillery: 5,
      machine_parts: 10,
      ammunition: 25,
      gold: 10,
      refined_petroil: 10,
      food: 15,
      money: 15000,

      naval_units_cp: 40
    },
    maintenance: {
      refined_petroil: 12,
      ammunition: 8,
      machine_parts: 8,
      food: 6,
      uniforms: 5,
      lead: 4,
      artillery: 2,
      gold: 2,
      steel: 2,

      money: 10000,
      naval_units_cp: 20
    },
    manpower_cost: {
      soldiers: 3532
    },
    quantity: 1
  },
  modern_cruisers: {
    name: "Modern Cruisers",
    singular: "Modern Cruiser",
    type: ["cruiser"],

    attack: 17500,
    defence: 15000,
    manoeuvre: 4,
    movement: 55.56,
    initiative: 5,

    cost: {
      steel: 20,
      artillery: 4,
      machine_parts: 10,
      ammunition: 20,
      gold: 5,
      copper: 10,
      refined_petroil: 7,
      food: 10,
      money: 5000,

      naval_units_cp: 15
    },
    maintenance: {
      refined_petroil: 8,
      ammunition: 6,
      machine_parts: 6,
      uniforms: 4,
      artillery: 3,
      food: 3,
      lead: 2,
      gold: 1,
      steel: 1,

      money: 8500,
      naval_units_cp: 10
    },
    manpower_cost: {
      soldiers: 556
    },
    quantity: 1
  },
  modern_frigates: {
    name: "Modern Frigates",
    singular: "Modern Frigate",
    type: ["destroyer"],

    attack: 6250,
    defence: 8750,
    manoeuvre: 5,
    movement: 59.26,
    initiative: 4,

    cost: {
      steel: 15,
      machine_parts: 15,
      ammunition: 10,
      gold: 3,
      lead: 5,
      refined_petroil: 5,
      food: 7,
      money: 3500,

      naval_units_cp: 10
    },
    maintenance: {
      refined_petroil: 6,
      ammunition: 4,
      machine_parts: 4,
      food: 3,
      artillery: 2,
      lead: 2,
      uniforms: 2,
      steel: 1,

      money: 7500,
      naval_units_cp: 8
    },
    manpower_cost: {
      soldiers: 420
    },
    quantity: 2
  },
  railgun_cruisers: {
    name: "Railgun Cruisers",
    singular: "Railgun Cruiser",
    type: ["cruiser"],

    attack: 27500,
    defence: 14000,
    manoeuvre: 3,
    movement: 60,
    initiative: 4,

    cost: {
      steel: 25,
      machine_parts: 25,
      ammunition: 5,
      gold: 15,
      copper: 10,
      lead: 5,
      refined_petroil: 10,
      food: 15,
      money: 15000,

      naval_units_cp: 20
    },
    maintenance: {
      machine_parts: 12,
      ammunition: 8,
      gold: 6,
      refined_petroil: 6,
      artillery: 4,
      food: 4,
      steel: 4,
      lead: 3,
      uniforms: 3,

      money: 9000,
      naval_units_cp: 14
    },
    manpower_cost: {
      soldiers: 650
    },
    quantity: 1
  }
};
