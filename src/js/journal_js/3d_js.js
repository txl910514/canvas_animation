$(function () {
  $('.one').css('z-index', 99);
  var count = 0;
  var ele_index = 0;
  (function d_each() {
    if(count>3) {
      count = 0;
    }
    $('#camera>div').each(function (i, ele) {
      var deg = (count + i + 1) *90;
      if (count === i) {
        ele_index = i;
        ele.setAttribute('style','transform:rotateY('+deg+'deg) translateZ(200px);z-index:99;')
      }
      else if (3-count === i) {
        ele.setAttribute('style','transform:rotateY('+deg+'deg) translateZ(200px);z-index:99;')
      }
      else {
        ele.setAttribute('style','transform:rotateY('+deg+'deg) translateZ(200px);z-index:0;')
      }
    })
    setTimeout(function () {
      $('#camera>div').eq(ele_index).css('z-index', 0)
      $('#camera>div').eq(3-ele_index).css('z-index', 99)
    }, 1800)
    count ++;
    setTimeout(d_each, 10*1000)
  })()
})