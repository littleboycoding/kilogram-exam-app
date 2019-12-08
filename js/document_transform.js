async function transform() {
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;

  let img = cv.imread("canvas");
  cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
  let src = img.clone();
  let dst = new cv.Mat(screenHeight, screenWidth, cv.CV_8UC4);

  cv.convertScaleAbs(img, img, 1.1);

  cv.GaussianBlur(src, src, new cv.Size(5, 5), 0, 0);
  cv.Canny(src, src, 80, 255, 3, true);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  cv.findContours(
    src,
    contours,
    hierarchy,
    cv.RETR_LIST,
    cv.CHAIN_APPROX_SIMPLE
  );

  class SortableContours {
    constructor(area, perim, cnt) {
      this.area = area;
      this.perim = perim;
      this.cnt = cnt;
    }
  }

  let sortableContours = [];

  for (let i = 0; i < contours.size(); i++) {
    let cnt = contours.get(i);
    let area = cv.contourArea(cnt, false);
    let perim = cv.arcLength(cnt, false);

    sortableContours.push(new SortableContours(area, perim, cnt));
  }
  sortableContours = sortableContours
    .sort((a, b) => (a.area > b.area ? -1 : a.area < b.area ? 1 : 0))
    .slice(0, 5);

  let approx = new cv.Mat();
  cv.approxPolyDP(
    sortableContours[0].cnt,
    approx,
    0.05 * sortableContours[0].perim,
    true
  );

  console.log(approx.rows);
  if (approx.rows != 4) {
    await alert("ไม่เจอกระดาษ");
    await document.body.requestFullscreen();
    return false;
  }

  let cornerArray = [];

  for (let i = 0; i < 8; i = i + 2) {
    cornerArray.push(new cv.Point(approx.data32S[i], approx.data32S[i + 1]));
  }

  cornerArray = cornerArray
    .sort((a, b) => (a.y < b.y ? -1 : a.y > b.y ? 1 : 0))
    .slice(0, 5);

  let sortedCorner = [];
  sortedCorner.push(
    cornerArray[0].x < cornerArray[1].x ? cornerArray[0] : cornerArray[1]
  );
  sortedCorner.push(
    cornerArray[0].x > cornerArray[1].x ? cornerArray[0] : cornerArray[1]
  );
  sortedCorner.push(
    cornerArray[2].x < cornerArray[3].x ? cornerArray[2] : cornerArray[3]
  );
  sortedCorner.push(
    cornerArray[2].x > cornerArray[3].x ? cornerArray[2] : cornerArray[3]
  );

  let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    sortedCorner[0].x,
    sortedCorner[0].y,
    sortedCorner[1].x,
    sortedCorner[1].y,
    sortedCorner[2].x,
    sortedCorner[2].y,
    sortedCorner[3].x,
    sortedCorner[3].y
  ]);

  let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    screenWidth,
    0,
    0,
    screenHeight,
    screenWidth,
    screenHeight
  ]);
  cv.warpPerspective(
    img,
    dst,
    cv.getPerspectiveTransform(srcTri, dstTri),
    new cv.Size(screenWidth, screenHeight),
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  );

  cv.imshow("canvas", dst);

  src.delete();
  dst.delete();
  img.delete();
  contours.delete();
  hierarchy.delete();
  srcTri.delete();
  dstTri.delete();
  approx.delete();

  return true;
}
