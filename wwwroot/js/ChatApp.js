
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
    var msg = message;
    var encodedMsg = username + " says: " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);

    
});

//sending messaging
document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("InputChatMessage").value;
    connection.invoke("SendMessage", username, message).then(function () {
        document.getElementById("InputChatMessage").value = "";
    }).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});


//-----------------------------------------------------------------------------------------------

//receiving typing msg

connection.on("userTypingReceive", function (username, typing) {
    var typ = typing;
    var typEncodedMsg = username + " is " + typ;
    var li = document.createElement("li");
    li.textContent = typEncodedMsg;
    document.getElementById("typing").appendChild(li);
    typ = true;
    var Notyp;
    if (Notyp != undefined) clearTimeout(Notyp);
    Notyp = setTimeout(typingHide, 900);
    
});

function typingHide() {
    console.log("");
    typ = document.getElementById("typing").innerHTML = "";
    /*typ = false;*/
}


//sending typing msg
var showTyping = true;
document.getElementById("InputChatMessage").addEventListener("keyup", function (event) {
    if (showTyping = true) {
        showTyping = false;
        var typing = document.getElementById("InputChatMessage").innerHTML = "typing...";
        connection.invoke("userTypingSend", username, typing);
    }
});


//-----------------------------------------------------------------------------------------------

////receiving delivered/seen msg

//if (seen != "seen") {
//    connection.on("msgDeliveredReceive", function (username, delivered) {
//        var del = delivered;
//        var delEncodedMsg = username + " : " + del;
//        var li = document.createElement("li");
//        li.textContent = delEncodedMsg;
//        document.getElementById("delivered/seen").appendChild(li);
//    });
//}
//else {
//    connection.on("msgSeenReceive", function (username, seen) {
//        var sn =  seen;
//        var snEncodedMsg = username + " : " + sn;
//        var li = document.createElement("li");
//        li.textContent = snEncodedMsg;
//        document.getElementById("delivered/seen").appendChild(li);
//}


//sending delivered/seen msg
//document.getElementById("InputChatMessage").addEventListener("focusin", function (event) {
    //if (this.onmouseenter = document.getElementById("msgActivity").innerHTML)
    //{
    //    var delivered = document.getElementById("delivered/seen").innerHTML = "delivered";
    //    connection.invoke("msgDeliveredsend", username, delivered);
    //}
    //else (this.onmouseleave = document.getElementById("msgActivity").innerHTML)
    //{
    //    var seen = document.getElementById("delivered/seen").innerHTML = "seen";
    //    connection.invoke("msgSeenSend", username, seen);
    //}
//});

//-----------------------------------------------------------------------------------------------


//receiving LastSeenMsg

//connection.on("msgLastSeenReceive", function (username, lastseen) {
//    var ls = username + " : " + lastseen;
//    var lsEncodedMsg = ls;
//    var li = document.createElement("li");
//    li.textContent = lsEncodedMsg;
//    document.getElementById("lastSeen").appendChild(li);
//});

////sending LastSeenMsg

//document.getElementById("InputChatMessage").addEventListener("focusout", function (event) {
//    var lastseen = document.getElementById("InputChatMessage").innerHTML = "lastseen";
//    connection.invoke("msgLastSeenSend", username, lastseen);
//});

//---------------------------------------------------------------------------------------------