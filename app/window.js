function addToMovieList(text) {
  var list = document.getElementById("movieList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(text));
  list.appendChild(li);
}

document.addEventListener("DOMContentLoaded", function() {
  addToMovieList("hejsan");
  chrome.storage.sync.get("bloggedMovies", function(v) {
    addToMovieList("hejsan");
    if (!v.bloggedMovies) {

      addToMovieList("hejsan");
      v.bloggedMovies = {};
    }
    for (var id in v.bloggedMovies) {
      addToMovieList(id);
    }
  });

});
