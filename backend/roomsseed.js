const room = require("./models/rooms");

const rooms = [
  {
    roomname: "Devops",
    createon: new Date(),
    users: [],
  },
  {
    roomname: "Cloud Computing",
    createon: new Date(),
    users: [],
  },
  {
    roomname: "Covid19",
    createon: new Date(),
    users: [],
  },
  {
    roomname: "Sports",
    createon: new Date(),
    users: [],
  },
  {
    roomname: "NodeJS",
    createon: new Date(),
    users: [],
  },
];

async function seedRooms() {
  try {
    await room.insertMany(rooms);
    console.log("Rooms seeded successfully");
  } catch (error) {
    if (error.code !== 11000) {
      console.error("Error seeding rooms:", error);
    }
  }
}

module.exports = seedRooms;
