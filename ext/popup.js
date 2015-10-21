function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function setTitle(titleId) {
  var url = "http://www.omdbapi.com/?i="+titleId+"&plot=short&r=json"
  var x = new XMLHttpRequest();
  x.open("GET", url);
  x.responseType = "json";
  x.onload = function() {
    var response = x.response;
    if (!response) {
      error(2);
      return;
    }
    if (!response.Title) {
      error(3);
      return;
    }

    document.getElementById("title").textContent = response.Title+", "+response.Year;
    document.getElementById("actualTitle").value = response.Title;

    document.getElementById("blogButton").addEventListener("click", function() {
      document.getElementById("blogButton").disabled = "disabled";

      var title = document.getElementById("actualTitle").value;
      if (document.getElementById("includeYear").checked) {
        title = title + " ("+response.Year+")";
      }
      var comment = document.getElementById("comment").value;
      var imdbUrl = "http://www.imdb.com/title/"+titleId+"/";
      blog(titleId, title, imdbUrl, comment);
    });
  };
  x.onerror = function() {
    error(1);
  };
  x.send();
}

function blog(titleId, title, imdbUrl, comment) {
  var extensionId = "iokfcafeenbckhekpamcnhnijmkenjje";
  var when = new Date().getTime();
  var bloggedMovie = {titleId:titleId, title:title, imdbUrl:imdbUrl, comment:comment, when:when};
  chrome.runtime.sendMessage(extensionId, bloggedMovie, function(response) {
    if (response === "got your message captain") {
      window.close();
    } else {
      error(chrome.runtime.lastError);
    }
  });
}

function error(message) {
  document.getElementById("title").textContent = "Error, "+message;
}

function renderTitle(titleText) {
  document.getElementById("title").textContent = titleText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    var url_token = "imdb.com/title/";

    var index = url.indexOf(url_token);
    if (index <= 0) {
       renderTitle("Not an IMDb movie URL");
       return;
    }
    var partAfter = url.substring(index+url_token.length);
    var firstSlash = partAfter.indexOf("/");
    if (index <= 0) {
       renderTitle("Not an IMDb movie URL");
       return;
    }

    document.getElementById("main").className = "wide";
    var titleId = partAfter.substring(0, firstSlash);
    renderTitle("IMDb title ID: "+titleId);
    setTitle(titleId);

  });
});
