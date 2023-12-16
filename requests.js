const baseUrl = "http://twserver.alunos.dcc.fc.up.pt:8008/";

function newRequest (url, method, data=null) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(JSON.parse(xhttp.responseText));

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


function register (nick, password) {
    if (!nick || !password) {
        console.error("Error: All arguments are required.");
        return;
    }
    let data = {nick: nick, password: password};
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

function leave(nick, password, game) {
    if (!nick || !password || !game) {
        console.error("Error: All arguments are required.");
        return;
    }
    let data = { nick: nick, password: password, game: game };
    newRequest(baseUrl + "leave", "DELETE", data);
}

function notify(nick, password, game, move) {
    if (!nick || !password || !game || !move) {
        console.error("Error: All arguments are required.");
        return;
    }
    let data = { nick: nick, password: password, game: game, move: move};
    newRequest(baseUrl + "notify", "PUT", data);
}

function update(game, nick) {
    if (!game || !nick) {
        console.error("Error: All arguments are required.");
        return;
    }
    let data = { game: game, nick: nick };
    newRequest(baseUrl + "update", "GET", data);
}

function ranking(group, size) {
    if (!group || !size) {
        console.error("Error: All arguments are required.");
        return;
    }
    let data = { group: group, size: size };
    newRequest(baseUrl + "ranking", "POST", data);
}

