$(document).ready(function() {
  var water = false;
  var soil = false;
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
      updateLog("The cactus grew!");
    }
    else if (soil) {
      updateLog("You put soil on the cactus, but nothing happened...");
    }
    else {
      updateLog("It's a cactus, obviously.");
    }
    updateScore();
  });

  $("#water").click( function () {
    soil = false;
    water = true;
    updateLog("Equipped water");
  });

  $("#soil").click( function () {
    soil = true;
    water = false;
    updateLog("Equipped soil");
  });

  function updateLog(newString) {
    logNo += 1;
    log.push(logNo + ": " + newString);
    if (log.length > 8) {
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
  window.parent.postMessage({"messageType": "SETTING", "options": {"width": 800, "height": 600} });

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
        "soil": soil,
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

  // Listen for incoming gamestates
  window.addEventListener("message", function(event) {
    if(event.data.messageType === "LOAD") {
      var s = event.data.gameState;
      water = s.water;
      soil = s.soil;
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
