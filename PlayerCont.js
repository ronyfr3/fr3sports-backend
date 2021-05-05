const players = require("./Model");
const APIfeatures = require("./ClassApi");

const ShowPlayers = async (req, res) => {
  //   console.log(req.query);
  //   {
  //   page: '1',
  //   limit: '4',
  //   sort: '-acutionPrice',
  //   auctionPrice: { gte: '10' }
  // }
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
      status: "Failed",
      message: error.message,
    });
  }
};

const createPlayer = async (req, res) => {
  try {
    const { name, country, auctionPrice, iplTeam, image, teamLogo } = req.body;
    if (!name || !country || !auctionPrice || !iplTeam || !image || !teamLogo)
      return res.status(400).jaon({
        message: "player details missing!",
      });
    const checkExists = await players.findOne(name);
    if (checkExists)
      return res.status(400).json({ messasge: "Player already exists" });
    const newPlayer = new players({
      name: name.toLowerCase(),
      country: country.toLowerCase(),
      auctionPrice,
      iplTeam: iplTeam.toLowerCase(),
      image,
      teamLogo,
    });
    await newPlayer.save();
    res.status(200).json({
      status: "success",
      message: "player created successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};
module.exports = {
  ShowPlayers,
  createPlayer,
};
