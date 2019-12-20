export default function(url, callback) {
  var script = document.createElement('script');
  var uid = 'script_' + Date.now;
  script.onload = function() {
    document.getElementById(uid).remove();
    callback && callback();
  };
  script.src = url;
  script.id = uid;
  document.body.appendChild(script);
}
