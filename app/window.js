function addToMovieList(bloggedMovie) {
  var list = document.getElementById("movieList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(bloggedMovie.title));
  list.appendChild(li);
}

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.sync.get("bloggedMovies", function(v) {
    if (!v.bloggedMovies) {
      v.bloggedMovies = {};
    }
    for (var titleId in v.bloggedMovies) {
      addToMovieList(v.bloggedMovies[titleId]);
    }
  });

});
