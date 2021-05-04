const players = require("./Model");
const APIfeatures = require("./ClassApi");

const ShowPlayers = async (req, res) => {
  try {
    const features = new APIfeatures(players.find(), req.query)
      .filtering()
      .sorting()
      .paginating();
    const featuredPlayers = await features.query;
    res.status(200).json({
      status: "success",
      results: featuredPlayers.length,
      data: featuredPlayers,
    });
  } catch (error) {
    res.status(404).json({
      status: "players not found",
      message: error.message,
    });
  }
};

const createPlayer = async (req, res) => {
  try {
    const { name, country, acutionPrice, iplTeam } = req.body;
    if (!name || !country || !acutionPrice || !iplTeam)
      return res.status(400).jaon({
        message: "somehing missing!",
      });
    const checkExists = await players.findOne(name);
    if (checkExists)
      return res.status(400).json({ messasge: "Player already exists" });
    const newPlayer = new players({
      name: name.toLowerCase(),
      country: country.toLowerCase(),
      acutionPrice,
      iplTeam: iplTeam.toLowerCase(),
    });
    await newPlayer.save();
    res.status(200).json({
      status: "success",
      message: "player created successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed to create new player",
      message: error.message,
    });
  }
};
module.exports = {
  ShowPlayers,
  createPlayer,
};
