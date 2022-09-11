$( document ).ready(function() {
  count = 1;
  setInterval(() => {
    count++;
    if(count === 4) {
      count = 1;
    }
    if (count === 1) {
      $(`#img${3}`).css("visibility", "hidden");
    } else {
      $(`#img${count - 1}`).css("visibility", "hidden");
    }
    $(`#img${count}`).css("visibility", "visible");
  },3000);
});