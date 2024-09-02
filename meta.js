function getMeta(url, callback) {
    const img = new Image();
    img.src = url;
    img.onload = function() { callback(this.width, this.height); }
}

getMeta(
  "https://pbs.twimg.com/media/F2R7Du7boAALVmK?format=jpg&name=large",
  (width, height) => {w = width, h=height}
);

//console.log(w);
//console.log(h);
let aspect = 0;
let orientation_w=0;
if (w > h) {
    orientation_w=1;
    aspect = w/h;
}
else {
    orientation_w = 0;
    aspect = h/w;
}

