var selected = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    update();
  });

function addToMovieList(bloggedMovie) {
  var list = document.getElementById("movieList");
  var li = document.createElement("li");
  var editButton = document.createElement("button");
  editButton.appendChild(document.createTextNode("Edit"));
  editButton.addEventListener("click", function() {
    edit(bloggedMovie);
  });

  li.appendChild(document.createTextNode(bloggedMovie.title+" - "+bloggedMovie.comment));
  li.appendChild(editButton);
  list.appendChild(li);
}

function edit(bloggedMovie) {
  chrome.app.window.create("edit.html", null, function(createdWindow) {
    createdWindow.contentWindow.bloggedMovie = bloggedMovie;
  });
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

function formatDate(dateAsLong) {
  var date = new Date(dateAsLong);
  return date.toISOString().slice(0, 19).replace("T", " ");
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
      var xml =
              "<?xml version='1.0' encoding='UTF-8' ?>\n" +
              "\n" +
              "<rss\n" +
              "  version='2.0'\n" +
              "  xmlns:content='http://purl.org/rss/1.0/modules/content/'\n" +
              "  xmlns:wp='http://wordpress.org/export/1.2/'>\n" +
              "\n" +
              "  <channel>\n" +
              "    <wp:wxr_version>1.2</wp:wxr_version>\n\n\n";
      for (var titleId in bloggedMovies) {
        var bloggedMovie = bloggedMovies[titleId];
        xml +=
                "<item>\n" +
                "  <title><![CDATA["+bloggedMovie.title+"]]></title>\n" +
                "  <category domain='category' nicename='movies'><![CDATA[Movies]]></category>\n" +
                "  <content:encoded><![CDATA["+bloggedMovie.comment+"]]></content:encoded>\n" +
                "  <wp:post_date>"+formatDate(bloggedMovie.when)+"</wp:post_date>\n" +
                "  <wp:post_type>post</wp:post_type>\n" +
                "  <wp:postmeta>\n" +
                "    <wp:meta_key>imdb-url</wp:meta_key>\n" +
                "    <wp:meta_value><![CDATA["+bloggedMovie.imdbUrl+"]]></wp:meta_value>\n" +
                "  </wp:postmeta>\n" +
                "</item>\n\n";
      }
      xml +=
              "\n\n\n" +
              "  </channel>\n\n" +
              "</rss>\n";
      chrome.fileSystem.chooseEntry({type: "saveFile", suggestedName: "blog.xml"}, function(writableFileEntry) {
        writableFileEntry.createWriter(function(writer) {
          writer.write(new Blob([xml], {type: "text/xml"}));
        });
      });
    });
  });

});
