
"use strict";

//------HUBCONNECTION---------------------
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/Home/Index").build();
var username = "";

//-----------------------------------------------------------------------------------------------

//---------USERNAME------------------

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

//--------DISABLING BUTTON---------

document.getElementById("sendButton").disabled = true;

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//-----------------------------------------------------------------------------------------------

//--------------MESSAGING------------

//receiving messaging
connection.on("RecieveMessage", function (username, message) {
    let currentuser=document.getElementById("username").value;
    var currentdate = new Date();
    console.log(currentuser);
    var delivered = "delivered: "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() ;
    console.log(delivered);
    var msg = message;
    var encodedMsg = `<span>${username} says: ${msg}<sub> [ <i>${delivered}</i></sub> ]</span>`;
    console.log(`before: ${encodedMsg}`);
    var li = document.createElement("li");
  
    li.classList.add("message", "my-message");
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
//-----------------------------------------------------------------------------------------

//---------TYPING-----------

//receiving typing msg

//------APPROACH-1-------------




////sending typing msg

//var showTyping = true;
//document.getElementById("InputChatMessage").addEventListener("keyup", function (event) {
//    if (showTyping) {
//        showTyping = false;
//        var typing = document.getElementById("InputChatMessage").innerHTML = "typing...";
//        connection.invoke("userTypingSend", username, typing);
//    }
//});

//if (document.getElementById("InputChatMessage").addEventListener("keypress") != undefined) {
//    document.getElementById("InputChatMessage").addEventListener("keypress", function (event) {
//        handleKeyPress();
//        connection.invoke("userTypingSend", username, typing)
//    });
//}
//else {
//    document.getElementById("InputChatMessage").addEventListener("keyup", function (event) {
//        handleKeyUp();
//        connection.invoke("userTypingSend", username, typing)
//    });
//}

//-----------APPROACH-2------------

let timer, timeoutVal = 1000; // time it takes to wait for user to stop typing in ms
const status = document.getElementById("typing");
const typing = document.getElementById("InputChatMessage");

//typing.addEventListener("keypress", handleKeyPress);
typing.addEventListener("keyup", handleKeyUp);

connection.on("userTypingReceive", function (username, typing) {
    window.clearTimeout(timer);
    status.innerHTML = username+ " : typing...";

    timer = window.setTimeout(() => {
        status.innerHTML = "";
    }, timeoutVal);

});

// when user is pressing down on keys, clear the timeout
//function handleKeyPress(e) {
    
//    window.clearTimeout(timer);
//    status.innerHTML = "typing...";
//    var typing = status.innerHTML;
//}

// when the user has stopped pressing on keys, set the timeout
// if the user presses on keys before the timeout is reached, then this timeout is canceled
function handleKeyUp(e) {
    connection.invoke("userTypingSend", username, "123");
    //window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    //timer = window.setTimeout(() => {
    //    status.innerHTML = "";
    //}, timeoutVal);

}

//-----------------------------------------------------------------------------------------------

//----------------SEEN-------------

//receiving seen msg
connection.on("msgSeenReceive", function (username, seen) {
    var currentdate = new Date();
    var seen = "Seen: "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() ;
    console.log(seen);
    if (document.getElementById("container") == undefined) {
        console.log("type your message");
        return;
    }
    var snEncodedMsg = `${username} :  <sub>[ <i>${seen}</i> ]</sub>`;
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

//------------LAST SEEN-------------

//receiving LastSeenMsg


connection.on("msgLastSeenReceive", function (username, lastseen) {
    var currentdate = new Date();
    var lastseen = "Last Seen: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes();
    console.log(lastseen);
    if (document.getElementById("container") == undefined) {
        alert("type your message");
        return;
    }
    var ls = `${username} : <sub>[ <i>${lastseen}</i> ]</sub>`;
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