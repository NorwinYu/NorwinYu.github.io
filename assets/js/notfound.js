(function () {
  var path = window.location.pathname;
  if ((path === "/zh" || path.indexOf("/zh/") === 0) && path !== "/zh/404.html") {
    window.location.replace("/zh/404.html");
  }
})();
