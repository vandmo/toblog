chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("window.html", {
    "outerBounds": {
      "width": 400,
      "height": 500
    }
  });
});

chrome.runtime.onMessageExternal.addListener(
  function(bloggedMovie, sender, sendResponse) {
    chrome.storage.sync.get("bloggedMovies", function(v) {
      if (!v.bloggedMovies) {
        v.bloggedMovies = {};
      }
      v.bloggedMovies[bloggedMovie.titleId] = bloggedMovie;
      chrome.storage.sync.set(v);
    });
    sendResponse("got your message captain");
  });

