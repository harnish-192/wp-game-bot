const http = require("http");

//get a random emoji of rock paper scissors
const randomRPCEmo = () => {
  //rock paper scissors emoji
  const emojis = ["✌", "✊", "🖐"];
  const random = Math.floor(Math.random() * 3);
  return emojis[random];
};

//
const allEmos = {
  papers: ["🖐", "✋", "🤚"],
  scissors: ["✌"], //it's a yellow hand u cant see it
  rocks: ["✊", "👊", "🤛", "🤜"]
};
const emos = { paper: "🖐", scissor: "✌", rock: "✊" };

const {rock, paper, scissor} = emos; //destructre

//login what will beat what
const matches = {
  [scissor]: paper,
  [paper]: rock,
  [rock]: scissor
};

const runGame = userEmo => {
  const botEmo = randomRPCEmo();

  const emojiEntry = Object.entries(allEmos)
    // Destructure the type like "papers" and the array of emojis
    // Check if the incoming emoji is in the array
    .find(([type, emojis]) => emojis.some(e => userEmo.startsWith(e)));

  if (!emojiEntry) {
    return console.log("no valid emoji found");
  }

  // Destructure the type like "rocks", "papers" and the array
  const [type, allColorVariants] = emojiEntry;

  userEmo = allColorVariants[0];

  console.log(type, allColorVariants);

  //winning condition for bot user will lose
  const isitWin = () => {
    //get object values in array and check if emoji is there
    if (!Object.values(emos).includes(userEmo)) {
      return `You sen't an unknown emoji 😒`;
    } // if both emoji are same then its a draw
    else if (userEmo === botEmo) {
      return `Oh! It's a draw 🤐`;
    }
    //now if our condition is matched with bot then user lost
    else if (matches[userEmo] === botEmo) {
      return `You los't the game 😂\n Try again`;
    } // if none is true then user has won the game
    else {
      return `Oh No!\n You won 🏆 congrats`;
    }
  };

  return { replies: [{ message: botEmo }, { message: isitWin() }] };
};

console.log(randomRPCEmo());

const server = http.createServer((req, res) => {
  let data = [];
  req.on("data", chunk => {
    data.push(chunk);
  });

  let msg;
  req.on("end", () => {
    try {
      const response = JSON.parse(data);
      console.log(response);
      msg = response.query.message;

      console.log(msg);

      const reply = runGame(msg);

      res.end(JSON.stringify(reply));
    } catch (error) {
      console.log(error);
      res.end("Whatsup");
    }
  });
});

server.listen(5000);
