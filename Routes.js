const { ShowPlayers, createPlayer } = require("./PlayerCont");
const router = require("express").Router();

router.get("/", ShowPlayers);
router.post("/", createPlayer);

module.exports = router;
