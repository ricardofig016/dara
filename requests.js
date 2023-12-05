const baseUrl = "http://twserver.alunos.dcc.fc.up.pt:8008/";

function newRequest(url, method, data = null) {
  debugger;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      debugger;
      console.log(JSON.parse(xhttp.responseText));
      //document.getElementById("demo").innerHTML = xhttp.responseText;
      return JSON.parse(xhttp.responseText);
    } else {
      return false;
    }
  };
  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-Type", "application/json");

  if (data) {
    xhttp.send(JSON.stringify(data));
  } else {
    xhttp.send();
  }
}

function register(nick, password) {
  if (!nick || !password) {
    console.error("Error: All arguments are required.");
    return;
  }
  let data = { nick: nick, password: password };
  newRequest(baseUrl + "register", "POST", data);
}

function join(group, nick, password, size) {
  if (!group || !nick || !password || !size) {
    console.error("Error: All arguments are required.");
    return;
  }
  let data = { group: group, nick: nick, password: password, size: size };
  newRequest(baseUrl + "join", "POST", data);
}

function leave() {}

function notify() {}

function update() {}

function ranking() {}
