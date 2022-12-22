
"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/Home/Index").build();
var username = "";

//-----------------------------------------------------------------------------------------------


//setting input username as a username
function SetUsername() {
    var usernameinput = document.getElementById("username").value;
    if (usernameinput == "") {
        alert("Please enter your username");
        return;
    }
    username = usernameinput;

    document.getElementById("userinfo").style.display = "none";
    document.getElementById("messagearea").style.display = "block";

    document.getElementById("username1").innerHTML = usernameinput;
}

//-----------------------------------------------------------------------------------------------



//disabling button
document.getElementById("sendButton").disabled = true;

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//-----------------------------------------------------------------------------------------------


//receiving messaging
connection.on("RecieveMessage", function (username, message) {
    var currentdate = new Date();
    var delivered = "delivered: "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log(delivered);
    var msg = message;
    var encodedMsg = `<span><p>${username} says: ${msg}</p><sub><i>${delivered}</i></sub></span>`;
    console.log(`before: ${encodedMsg}`);
    var li = document.createElement("li");
    li.innerHTML = `${encodedMsg}`;
    console.log(`after: ${li.textContent}`);
    document.getElementById("messagesList").appendChild(li);
});

//sending messaging
document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("InputChatMessage").value;
    if (message == "") {
        alert("type your message");
        return;
    }
    connection.invoke("SendMessage", username, message).then(function () {
        document.getElementById("InputChatMessage").value = "";
    }).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
//-----------------------------------------------------------------------------------------------

////receiving msgs Pvt
//connection.on("ReceivePrivateMessage", function (user, pvtMsg) {
//    var pvtMessage = pvtMsg;
//    var encodedPvtMsg = user + "Privately saying: " + pvtMessage;
//    var li = document.createElement("li");
//    li.textContent = encodedPvtMsg;
//    document.getElementById("pvtMsgList").appendChild(li);
//});


////sending msgs Pvt
//document.getElementById("sendPvtButton").addEventListener("click", function (event) {
//    var pvtMsg = document.getElementById("InputPvtChatMessage").value;
//    connection.invoke("SendPrivateMessage", user, pvtMsg).then(function () {
//        document.getElementById("InputPvtChatMessage").value = "";
//    }).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});


//-----------------------------------------------------------------------------------------------

//receiving typing msg

connection.on("userTypingReceive", function (username, typing) {
        var typ = typing;
        var typEncodedMsg = `<span>${username} <i>is ${typ}</i></span>`;
        var li = document.createElement("li");
        li.innerHTML = typEncodedMsg;
        document.getElementById("typing").appendChild(li);
        typ = true;
        var Notyp;
        if (Notyp != undefined) clearTimeout(Notyp);
        Notyp = setTimeout(typingHide, 5000);
    
});

function typingHide() {
    console.log("");
    typ = document.getElementById("typing").innerHTML = "";
    typ = false;
}


//sending typing msg

var showTyping = true;
document.getElementById("InputChatMessage").addEventListener("keyup", function (event) {
    if (showTyping) {
        showTyping = false;
        var typing = document.getElementById("InputChatMessage").innerHTML = "typing...";
        connection.invoke("userTypingSend", username, typing);
    }
});


//-----------------------------------------------------------------------------------------------

//----------------SEEN-------------

//receiving seen msg
connection.on("msgSeenReceive", function (username, seen) {
    var currentdate = new Date();
    var seen = "Seen: "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log(seen);
    if (document.getElementById("container") == undefined) {
        alert("type your message");
        return;
    }
    var snEncodedMsg = `${username} :  <sub><i>${seen}</i></sub>`;
    var li = document.createElement("li");
    li.innerHTML = snEncodedMsg;
    document.getElementById("seen").appendChild(li);
});
//sending seen msg
document.getElementById("InputChatMessage").addEventListener("focusin", function (event) {
    var seen = document.getElementById("seen").innerHTML;
    connection.invoke("msgSeenSend", username, seen);
});


//-----------------------------------------------------------------------------------------------


//receiving LastSeenMsg


connection.on("msgLastSeenReceive", function (username, lastseen) {
    var currentdate = new Date();
    var lastseen = "Last Seen: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log(lastseen);
    if (document.getElementById("container") == undefined) {
        alert("type your message");
        return;
    }
    var ls = `${username} : <sub><i>${lastseen}</i></sub>`;
    var li = document.createElement("li");
    li.innerHTML = ls;
    document.getElementById("lastSeen").appendChild(li);
});

//sending LastSeenMsg

document.getElementById("InputChatMessage").addEventListener("focusout", function (event) {
    var lastseen = document.getElementById("InputChatMessage").innerHTML;
    connection.invoke("msgLastSeenSend", username, lastseen);
});

//---------------------------------------------------------------------------------------------