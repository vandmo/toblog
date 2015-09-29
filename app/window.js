var selected = {};

function addToMovieList(bloggedMovie) {
  var list = document.getElementById("movieList");
  var li = document.createElement("li");
  var inp = document.createElement("input");
  var ia = document.createAttribute("type");
  ia.value = "checkbox";
  inp.setAttributeNode(ia);
  inp.addEventListener("click", function() {
    if (inp.checked) {
      selected[bloggedMovie.titleId] = bloggedMovie;
    } else {
      delete selected[bloggedMovie.titleId];
    }
  });
  li.appendChild(inp);
  li.appendChild(document.createTextNode(bloggedMovie.title+" - "+bloggedMovie.comment));
  list.appendChild(li);
}

function update() {
  chrome.storage.sync.get("bloggedMovies", function(v) {
    if (!v.bloggedMovies) {
      v.bloggedMovies = {};
    }
    var l = document.getElementById("movieList");
    while (l.firstChild) {
      l.removeChild(l.firstChild);
    }
    for (var titleId in v.bloggedMovies) {
      addToMovieList(v.bloggedMovies[titleId]);
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
    chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: 'myfile.html'}, function(writableFileEntry) {
      writableFileEntry.createWriter(function(writer) {
        writer.write(new Blob(["fewfwe"], {type: 'text/plain'}));
      });
    });
  });

});
