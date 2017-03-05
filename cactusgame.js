$(document).ready(function() {
  var water = false;
  var salt = false;
  var growthRate = 10
  var score = 0;
  var height = 100;

  var logNo = 0;
  var log = [];

  $("#cactus1").click( function () {
    if (water) {
      // Make cactus grow. Cactus likes to grow :)
      height += growthRate
      $(this).animate({
          height: '+=' + growthRate + 'px',
      });
      // Kinda ugly hack to put breaks in to the text,
      // but that's the easiest way to get line breaks into the html
      updateLog("You watered the cactus.<br/>The cactus grew!");
    }
    else if (salt) {
      // Make cactus shrink :'(
      if (height > 100) {
        height -= growthRate
        $(this).animate({
            height: '-=' + growthRate + 'px',
        });
      }
      updateLog("You put salt on the cactus,<br />why would you do that?");
    }
    else {
      updateLog("It's a cactus, obviously.<br />");
    }
    updateScore();
  });

  $("#water").click( function () {
    salt = false;
    water = true;
    updateLog("Equipped water<br />");
  });

  $("#salt").click( function () {
    salt = true;
    water = false;
    updateLog("Equipped salt<br />");
  });

  function updateLog(newString) {
    logNo += 1;
    log.push(logNo + ": " + newString);
    if (log.length > 10) {
      log.shift();
    }
    var out = log.join("<br>");
    $("#log p").replaceWith("<p>" + out + "</p>");
  }

  function updateScore() {
    score = height - 100;
    $("#score").html(score);
  }

  // Functions communicating with parent window

  // Send window settings
  window.parent.postMessage({"messageType": "SETTING", "options": {"width": 804, "height": 600} }, "*");

  // Send score to parent window
  $("#submit_score").click( function () {
    window.parent.postMessage({"messageType": "SCORE", "score": score}, "*");
  });

  // Send save data to parent window
  $("#save").click( function () {
    var message = {
      "messageType": "SAVE",
      "gameState": {
        "water": water,
        "salt": salt,
        "score": score,
        "height": height,
        "log": log,
        "logNo": logNo
      }
    };
    window.parent.postMessage(message, "*");
  });

  // Send load request to parent window
  $("#load").click( function () {
    window.parent.postMessage({"messageType": "LOAD_REQUEST"}, "*");
  });

  // Listen for incoming gamestates or error messages
  window.addEventListener("message", function(event) {
    if(event.data.messageType === "LOAD") {
      var s = event.data.gameState;
      water = s.water;
      salt = s.salt;
      score = s.score;
      height = s.height;
      log = s.log;
      logNo = s.logNo;
      // Update log without changing values
      var out = log.join("<br>");
      $("#log p").replaceWith("<p>" + out + "</p>");
      updateScore();
      $(".cactus").height(height);
    } else if (event.data.messageType === "ERROR") {
      alert(event.data.info);
    }
  });
});
