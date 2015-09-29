var selected = {};

function addToMovieList(bloggedMovie) {
  var list = document.getElementById("movieList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(bloggedMovie.title+" - "+bloggedMovie.comment));
  list.appendChild(li);
}

function getBloggedMovies(callback) {
  chrome.storage.sync.get("bloggedMovies", function(v) {
    var bloggedMovies = v.bloggedMovies;
    if (!bloggedMovies) {
      bloggedMovies = {};
    }
    callback(bloggedMovies);
  });
}

function update() {
  getBloggedMovies(function(bloggedMovies) {
    var l = document.getElementById("movieList");
    while (l.firstChild) {
      l.removeChild(l.firstChild);
    }
    for (var titleId in bloggedMovies) {
      addToMovieList(bloggedMovies[titleId]);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  update();

  document.getElementById("deleteButton").addEventListener("click", function() {
    document.getElementById("reallyDeleteButton").className = "";
  });
  document.getElementById("reallyDeleteButton").addEventListener("click", function() {
    chrome.storage.sync.clear(update);
  });

  document.getElementById("exportButton").addEventListener("click", function() {
    getBloggedMovies(function (bloggedMovies) {
      var xml = "";
      for (var titleId in bloggedMovies) {
        var bloggedMovie = bloggedMovies[titleId];
        xml += bloggedMovie.title;
      }
      chrome.fileSystem.chooseEntry({type: "saveFile", suggestedName: "blog.xml"}, function(writableFileEntry) {
        writableFileEntry.createWriter(function(writer) {
          writer.write(new Blob([xml], {type: "text/xml"}));
        });
      });
    });
  });

});
