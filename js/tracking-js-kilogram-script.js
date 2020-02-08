var score = 0;
var marking = [];
var questionEndLine;
var studentResult;
var studentScore = {};
var markHolder = [];
function tracking_start() {
  return new Promise((resolve, reject) => {
    score = 0;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const container = document.querySelector(".container");
    const answer = [null, "A", "B", "C", "D", "E"];
    const question_multipler = 25;
    const answer_available = 5;
    const y_tostartfrom = (9.5 * screen.height) / 100;

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
      document.getElementById("mode").style.display = "none";
      document.getElementById("flashlight").style.display = "none";
      let head_start_count = 0;
      let head_array = [];
      event.data.forEach(function(rect) {
        if (
          rect.y > y_tostartfrom &&
          rect.x > 15 &&
          rect.x + rect.width < canvas.width - 15
        ) {
          if (head_start_count == 0) {
            head_array.push(rect);
            head_start_count++;
          } else if (
            rect.y + rect.height / 2 <=
              head_array[head_array.length - 1].y +
                head_array[head_array.length - 1].height &&
            head_start_count < 4
          ) {
            head_array.push(rect);
            head_start_count++;
          } else {
            head_array.sort((a, b) => a.x - b.x);
            return;
          }
        }
      });

      console.log(head_array);

      if (head_array.length != 4 && head_array.length != 2) {
        alertMSG("ไม่สามารถสแกนได้");
        console.log("Not enough head_array");
        resolve(false);
        return;
      }
      if (head_array.length == 4) {
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
        headRow = [
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
      } else {
        //For 50 question
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
            width: canvas.width,
            height: head_array[1].height
          }
        ];
        headRow = [
          event.data.filter(
            data =>
              data.x + data.width <= head[0].width &&
              data.y > head[0].y + head[0].height
          ),
          event.data.filter(
            data => data.x >= head[1].x && data.y > head[1].y + head[1].height
          )
        ];
      }
      for (i = 0; i < headRow.length; i++) {
        headRow[i] = headRow[i].filter(
          data => data.x <= head_array[i].x + head_array[i].width / 2
        );
        headRow[i] = headRow[i].slice(0, 25);
      }
      if (
        (head_array.length == 4 &&
          (headRow[0].length != 25 ||
            headRow[1].length != 25 ||
            headRow[2].length != 25 ||
            headRow[3].length != 25)) ||
        (head_array.length == 2 &&
          (headRow[0].length != 25 || headRow[1].length != 25))
      ) {
        alertMSG("ไม่สามารถสแกนได้");
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
              right_x > result_data.x - (0.375 * screen.width) / 100 &&
              right_x <
                result_data.x +
                  result_data.width +
                  (0.625 * screen.width) / 100 &&
              center_answer_y > result_data.y - (0.25 * screen.width) / 100 &&
              center_answer_y <
                result_data.y + result_data.height + (0.25 * screen.width) / 100
          );

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
        if (data.y > questionEndLine && data.width <= 100) {
          idRow.push(data);
        }
      });
      idRow.shift();
      idRow.sort((a, b) => a.x - b.x);
      if (idRow.length > 20) {
        resolve(false);
        alertMSG("ไม่สามารถสแกนได้");
        return;
      }
      let idHead = idRow.slice(0, 10);
      idHead.sort((a, b) => a.y - b.y);
      let idFill = idRow.slice(10, 20);
      console.log(idHead, idFill);
      let idResult = [];
      idFill.forEach(data => {
        const y_center = data.y + data.height / 2;
        const result = idHead.findIndex(
          head => y_center > head.y && y_center < head.y + head.height
        );
        plot(data.x, data.y, data.width, data.height, "#F00");
        idResult.push(result);
      });
      if (typeof studentScore[selectedQuestion] == "undefined") {
        studentScore[selectedQuestion] = {};
      }

      if (
        typeof studentScore[selectedQuestion][idResult.join("")] == "undefined"
      ) {
        Object.assign(studentScore[selectedQuestion], {
          [idResult.join("")]: { score: score, marking: markHolder }
        });
      }
      markHolder = [];
      if (studentList[idResult.join("")] == undefined) {
        alertMSG(
          "ไม่พบนักเรียนจากหมายเลขประจำตัว ได้คะแนน " +
            studentScore[selectedQuestion][idResult.join("")]["score"],
          true
        );
        document.getElementById("saveCtrl").style.display = "none";
        if (mode) {
          close_snapshot();
        }
        resolve(true);
      } else {
        alertMSG(
          "หมายเลขนักเรียน " +
            idResult.join("") +
            " ชื่อผู้สอบ " +
            studentList[idResult.join("")].name +
            " ได้คะแนน " +
            studentScore[selectedQuestion][idResult.join("")]["score"],
          true
        );
        document.getElementById("saveCtrl").style.display = "block";
        if (mode) {
          document.getElementById("yes").click();
          close_snapshot();
        }
        resolve(true);
      }
      idResult.length > 0;

      var finalJSON;
      studentResult =
        studentList[idResult.join("")].name != undefined ? true : false;
      if (resultJSON == true || resultJSON == false) {
        resultJSON = Object.assign(
          {},
          {
            [selectedQuestion]: {
              [studentList[idResult.join("")].name]: {
                totalScore:
                  studentScore[selectedQuestion][idResult.join("")]["score"],
                marking: marking,
                room: studentList[idResult.join("")].room
              }
            }
          }
        );
      } else {
        if (resultJSON[selectedQuestion] != undefined) {
          finalJSON = {
            [selectedQuestion]: Object.assign(resultJSON[selectedQuestion], {
              [studentList[idResult.join("")].name]: {
                totalScore:
                  studentScore[selectedQuestion][idResult.join("")]["score"],
                marking: marking,
                room: studentList[idResult.join("")].room
              }
            })
          };
        } else {
          finalJSON = {
            [selectedQuestion]: {
              [studentList[idResult.join("")].name]: {
                totalScore:
                  studentScore[selectedQuestion][idResult.join("")]["score"],
                marking: marking,
                room: studentList[idResult.join("")].room
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
