function tracking_start() {
  const exam = document.querySelector("#player");
  const container = document.querySelector(".container");
  const answer = [null, "A", "B", "C", "D", "E"];
  const question_multipler = 5;
  const answer_available = 5;
  const y_tostartfrom = 30;
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext('2d');

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

  const tracker = new tracking.ColorTracker(["magenta", "cyan", "yellow"]);
  tracker.setMinDimension(5);
  //tracker.on("track", function(event) {
    //let head_start_pos = 0;
    //let start = 0;
    //event.data.forEach(function(rect) {
      //// Y to start scanning
      //if (rect.y > y_tostartfrom) {
        ////First match always be starting position
        //if (head_start_pos == 0) {
          //head_start_pos = rect.y;
        //}
        //if (rect.y >= head_start_pos - 5 && rect.y <= head_start_pos + 5) {
          //head_pos.push({
            //x: rect.x,
            //y: rect.y,
            //height: rect.height,
            //width: rect.width,
            //start: start
          //});
          //start = start + question_multipler;
        //} else {
          //total_mark++;
        //}
        //plot(rect.x, rect.y, rect.width, rect.height, rect.color);
      //}
    //});
    //console.log("Total mark : " + total_mark);
  //});

tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
          context.strokeStyle = rect.color;
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          context.font = '11px Helvetica';
          context.fillStyle = "#fff";
          context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
      });

  tracking.track(exam, tracker);
  function plot(x, y, w, h, color) {
    let rect = document.createElement("div");
    container.appendChild(rect);
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
            rect.innerHTML = answer[i];
            answer_holder.answer = answer[i];
            break;
          }
        }
        //Loop through total quesion
        for (let i = 1; i <= question_multipler; i++) {
          let from_y = pos.y + pos.height * i;
          let to_y = pos.y + pos.height * (i + 1);
          let center_y = y + h / 2;
          if (center_y >= from_y && center_y <= to_y) {
            rect.innerHTML = rect.innerHTML + (pos.start + i);
            answer_holder.no = pos.start + i;
            break;
          }
        }
        if (answer_holder.no != null && answer_holder.answer != null) {
          summary.push(answer_holder);
        }
      }
    });
    rect.style.color = "red";
    rect.classList.add("rect");
    rect.style.border = "2px solid " + color;
    rect.style.width = w + "px";
    rect.style.height = h + "px";
    rect.style.fontSize = "15px";
    rect.style.left = exam.offsetLeft + x + "px";
    rect.style.top = exam.offsetTop + y + "px";
  }
  console.log(summary);
}
