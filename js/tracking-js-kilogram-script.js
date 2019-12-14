var score = 0;
var marking = [];
var questionEndLine;
var studentResult;
function tracking_start() {
  return new Promise((resolve, reject) => {
    score = 0;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const container = document.querySelector(".container");
    const answer = [null, "A", "B", "C", "D", "E"];
    const question_multipler = 25;
    const answer_available = 5;
    const y_tostartfrom = (7.85 * screen.height) / 100;

    var summary = [];
    var total_mark = 0;
    var head_pos = [];

    //Register black color to tracking.js
    tracking.ColorTracker.registerColor("black", function(r, g, b) {
      if (r <= 135 && g <= 135 && b <= 135) {
        return true;
      }
      return false;
    });

    const tracker = new tracking.ColorTracker(["black"]);
    tracker.setMinDimension(3);
    tracker.setMinGroupSize(20);

    tracker.on("track", async function(event) {
      document.getElementById("back").style.display = "none";
      document.getElementById("flashlight").style.display = "none";
      let head_start_count = 0;
      let head_array = [];
      event.data.forEach(function(rect) {
        if (
          rect.y > y_tostartfrom &&
          rect.x > 15 &&
          rect.x + rect.width < canvas.width - 15
        ) {
          if (head_start_count < 4) {
            head_array.push(rect);
            head_start_count++;
          } else {
            head_array.sort((a, b) => a.x - b.x);
            return;
          }
        }
      });
      if (head_array.length != 4) {
        alertMSG("ไม่สามารถสแกนได้");
        console.log("Not enough head_array");
        resolve(false);
        return;
      }
      head = [
        {
          x: 0,
          y: head_array[0].y,
          width: head_array[1].x - 5,
          height: head_array[0].height
        },
        {
          x: head_array[1].x - 5,
          y: head_array[1].y,
          width: head_array[2].x - head_array[1].x,
          height: head_array[1].height
        },
        {
          x: head_array[2].x - 5,
          y: head_array[2].y,
          width: head_array[3].x - head_array[2].x,
          height: head_array[2].height
        },
        {
          x: head_array[3].x - 5,
          y: head_array[3].y,
          width: canvas.width,
          height: head_array[3].height
        }
      ];
      for (let i = 0; i < head.length; i++) {
        let headHold = head[i];
        plot(headHold.x, headHold.y, headHold.width, headHold.height, "#F00");
        resolve(true);
        return;
      }
      const headRow = [
        event.data.filter(
          data =>
            data.x + data.width <= head[0].width &&
            data.y > head[0].y + head[0].height
        ),
        event.data.filter(
          data =>
            data.x >= head[1].x &&
            data.x + data.width <= head[1].x + head[1].width &&
            data.y > head[1].y + head[1].height
        ),
        event.data.filter(
          data =>
            data.x >= head[2].x &&
            data.x + data.width <= head[2].x + head[2].width &&
            data.y > head[2].y + head[2].height
        ),
        event.data.filter(
          data => data.x >= head[3].x && data.y > head[3].y + head[3].height
        )
      ];
      for (i = 0; i < 4; i++) {
        headRow[i] = headRow[i].filter(
          data => data.x <= head_array[i].x + head_array[i].width / 2
        );
        headRow[i] = headRow[i].slice(0, 25);
      }
      if (
        headRow[0].length != 25 ||
        headRow[1].length != 25 ||
        headRow[2].length != 25 ||
        headRow[3].length != 25
      ) {
        console.log(headRow[0], headRow[1], headRow[2], headRow[3]);
        alertMSG("ไม่สามารถสแกนได้");
        console.log("Not enough question total");
        resolve(false);
        return;
      }
      questionEndLine = headRow[0][24].y + headRow[0][24].height;
      var right_answer = question_list[selectedQuestion];
      var rows = 0;
      headRow.forEach((row, row_index) => {
        row.forEach((data, index) => {
          if (
            index + 1 + rows * question_multipler >
            Object.keys(right_answer).length
          ) {
            return;
          }
          for (let i = 1; i <= answer_available; i++) {
            let center_x = data.x + data.width * i + data.width / 2;
            let center_y = data.y + data.height / 2;
            if (
              event.data.find(
                find =>
                  center_x > find.x &&
                  center_x < find.x + find.width &&
                  center_y > find.y &&
                  center_y < find.y + find.height
              ) != undefined
            ) {
              marking[index + rows * question_multipler] = answer[i];
              break;
            }
          }
          let answer_mark = event.data.filter(
            filter =>
              filter.x > data.x + data.width &&
              filter.x + filter.width <
                data.x + data.width * (answer_available + 1) + 5 &&
              filter.y + filter.height / 2 > data.y &&
              filter.y + filter.height / 2 < data.y + data.height &&
              filter.y < questionEndLine
          ).length;
          let right_x =
            data.x +
            data.width *
              parseInt(
                right_answer[index + 1 + rows * question_multipler].correct
              ) +
            data.width / 2;
          let center_answer_y = data.y + data.height / 2;
          let result = event.data.findIndex(
            result_data =>
              right_x > result_data.x &&
              right_x < result_data.x + result_data.width &&
              center_answer_y > result_data.y &&
              center_answer_y < result_data.y + result_data.height
          );

          console.log(answer_mark);
          if (result != -1 && answer_mark == 1) {
            const data = event.data[result];
            plot(data.x, data.y, data.width, data.height, "#0F0");
            score++;
          } else {
            /*
            plot(
              data.x +
                (data.width *
                  parseInt(
                    right_answer[index + 1 + rows * question_multipler].correct
                  ) +
                  1),
              data.y,
              data.width,
              data.height,
              "#F00"
            );
	  */
          }
        });
        rows++;
      });
      let idRow = [];
      let studentId;
      event.data.forEach(data => {
        if (data.y > questionEndLine) {
          idRow.push(data);
        }
      });
      idRow.shift();
      idRow.sort((a, b) => a.x - b.x);
      let idHead = idRow.slice(0, 10);
      idHead.sort((a, b) => a.y - b.y);
      let idFill = idRow.slice(10, 20);
      let idResult = [];
      idFill.forEach(data => {
        const y_center = data.y + data.height / 2;
        const result = idHead.findIndex(
          head => y_center > head.y && y_center < head.y + head.height
        );
        plot(data.x, data.y, data.width, data.height, "#F00");
        idResult.push(result);
      });
      if (studentList[idResult.join("")] == undefined) {
        alertMSG("ไม่พบนักเรียนจากหมายเลขประจำตัว ได้คะแนน " + score, true);
        document.getElementById("saveCtrl").style.display = "none";
        resolve(true);
      } else {
        alertMSG(
          "หมายเลขนักเรียน " +
            idResult.join("") +
            " ชื่อผู้สอบ " +
            studentList[idResult.join("")] +
            " ได้คะแนน " +
            score,
          true
        );
        document.getElementById("saveCtrl").style.display = "block";
        resolve(true);
      }
      idResult.length > 0;

      var finalJSON;
      studentResult =
        studentList[idResult.join("")] != undefined ? true : false;
      if (resultJSON == true || resultJSON == false) {
        resultJSON = Object.assign(
          {},
          {
            [selectedQuestion]: {
              [studentList[idResult.join("")]]: {
                totalScore: score,
                marking: marking
              }
            }
          }
        );
      } else {
        if (resultJSON[selectedQuestion] != undefined) {
          finalJSON = {
            [selectedQuestion]: Object.assign(resultJSON[selectedQuestion], {
              [studentList[idResult.join("")]]: {
                totalScore: score,
                marking: marking
              }
            })
          };
        } else {
          finalJSON = {
            [selectedQuestion]: {
              [studentList[idResult.join("")]]: {
                totalScore: score,
                marking: marking
              }
            }
          };
        }
      }
      Object.assign(resultJSON, finalJSON);
    });

    tracking.track(canvas, tracker);
    function plot(x, y, w, h, color, text) {
      context.strokeStyle = color;
      context.strokeRect(x, y, w, h);
      context.font = "12px Helvetica";
      context.fillStyle = color;
      //context.fillText(text, x, y);
    }
  });
}
