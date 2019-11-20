function tracking_start() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const container = document.querySelector(".container");
  const answer = [null, "A", "B", "C", "D", "E"];
  const question_multipler = 25;
  const answer_available = 5;
  const y_tostartfrom = 60;

  var summary = [];
  var total_mark = 0;
  var head_pos = [];

  //Register black color to tracking.js
  tracking.ColorTracker.registerColor("black", function(r, g, b) {
    if (r <= 130 && g <= 130 && b <= 130) {
      return true;
    }
    return false;
  });

  const tracker = new tracking.ColorTracker(["black"]);
  tracker.setMinDimension(5);

  tracker.on("track", function(event) {
    let head_start_pos = 0;
    let start = 0;
    event.data.forEach(function(rect) {
      // Y to start scanning
      if (rect.y > y_tostartfrom) {
        //First match always be starting position
        if (head_start_pos == 0) {
          head_start_pos = rect.y;
        }
        if (rect.y >= head_start_pos - 4 && rect.y <= head_start_pos + 4) {
          head_pos.push({
            x: rect.x,
            y: rect.y,
            height: rect.height,
            width: rect.width,
            start: start
          });
          head_pos = head_pos.sort((a, b) => (a.x < b.x ? -1 : 1));
          start = start + question_multipler;
        } else {
          total_mark++;
        }
        plot(rect.x, rect.y, rect.width, rect.height, rect.color);
      }
    });
    console.log("Total mark : " + total_mark);
  });

  tracking.track(canvas, tracker);
  function plot(x, y, w, h, color) {
    console.log(head_pos);
    let answer_no;
    var head_count = 0;
    head_pos.forEach(pos => {
      let answer_holder = { no: null, answer: null };
      if (
        x + w / 2 >= pos.x + pos.width &&
        x + w / 2 <= pos.x + pos.width * (answer_available + 1)
      ) {
        //Loop through total of answer available
        for (let i = 1; i <= answer_available; i++) {
          let from_x = pos.x + pos.width * i;
          let to_x = pos.x + pos.width * (i + 1);
          let center_x = x + w / 2;
          if (center_x >= from_x && center_x <= to_x) {
            //rect.innerHTML = answer[i];
            answer_no = answer[i];
            answer_holder.answer = answer[i];
            break;
          }
        }
        //Loop through total question
        for (let i = 1; i <= question_multipler; i++) {
          let from_y = pos.y + pos.height * i;
          let to_y = pos.y + pos.height * (i + 1);
          let center_y = y + h / 2;
          if (center_y >= from_y && center_y <= to_y) {
            //rect.innerHTML = rect.innerHTML + (pos.start + i);
            answer_no =
              answer_no + parseInt(head_count * question_multipler + i);
            answer_holder.no = head_count * question_multipler + i;
            break;
          }
        }
        if (answer_holder.no != null && answer_holder.answer != null) {
          summary.push(answer_holder);
        }
      }
      head_count++;
    });

    context.strokeStyle = "#F00";
    context.strokeRect(x, y, w, h);
    context.font = "11px Helvetica";
    context.fillStyle = "#f00";

    if (answer_no != undefined) {
      context.fillText(answer_no, x + w + 5, y + 11);
    } else {
      context.fillText("Base box", x + w + 5, y + 11);
    }
  }
}
