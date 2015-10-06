
document.addEventListener("DOMContentLoaded", function() {

  document.getElementById("saveButton").addEventListener("click", function() {
    window.close();
  });

  document.getElementById("title").innerText = "Editing " + bloggedMovie.title;

});
