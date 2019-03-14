const { ipcRenderer } = require('electron');
const storeClass = require('./storedata.js');
const electron = require('electron');
const path = require('path');
const fs = require('fs');
window.$ = window.jQuery = require('./jquery-3.3.1.min.js');
const { globalShortcut } = require('electron');

let css = document.documentElement;
let packageActive = 1;
let packageIconsGet = fs.readdirSync('packages').filter( elm => elm.match(new RegExp(`.*\.(${"verton"})`, 'ig')));
let packageIconsAdd = packageIconsGet.length;
let packageAmount = 3 + packageIconsAdd;
const display = document.getElementById('display');
let vertonActivate;
let vertonOutput = null;

//Class that can create user data file to store data
const store = new storeClass({
    configName: 'Verton',
    defaults: {
    windowDimensions: { width: 520, height: 345 },
    packages: 3,
    theme: "light", 
    }
});

//Function that changes theme to light or dark
function themeChange(themeName) {
    if (themeName === "dark") {
    css.style.setProperty('--theme-packagebar-background', "linear-gradient(#4e4b49, #3d3d3d)");
    css.style.setProperty('--theme-background', "#2d2d2d");
    css.style.setProperty('--theme-primary-color', "#2d2d2d");
    css.style.setProperty('--theme-secondary-color', "#fff");   
    store.set("theme", "dark");
    }
    if (themeName === "light") {
    css.style.setProperty('--theme-packagebar-background', "linear-gradient(#e5e5e5, #cfcfcf)");
    css.style.setProperty('--theme-background', "#fff");
    css.style.setProperty('--theme-primary-color', "#fff");
    css.style.setProperty('--theme-secondary-color', "#2d2d2d");   
    store.set("theme", "light");
    }
}
    
//Retrieve and set theme based on user data
let theme = store.get('theme');
if (theme === "light") {
    themeChange("light");
}
else if (theme === "dark") {
    themeChange("dark");
}

//Receive requests from the main process to change the theme
ipcRenderer.on("send-theme", (event, message) => {
    themeChange(message);
});
    
//Load main package into display on startup and set appropriate package icon to active
$("#display").load(packageActive + ".html");
document.getElementById(packageActive).getElementsByClassName("packagebar-icon")[0].className += " packagebar-icon-active";
document.getElementById(packageActive).getElementsByClassName("packagebar-icon-art")[0].className += " packagebar-icon-art-active";
setTitle(packageActive);
activateVerton();

//Function that loads a package associated with its id
function loadPackage(id) {
    if (packageActive != id) {
        document.getElementById(packageActive).getElementsByClassName("packagebar-icon")[0].className = "packagebar-icon";
        document.getElementById(packageActive).getElementsByClassName("packagebar-icon-art")[0].className = "packagebar-icon-art";
        packageActive = id;
        $("#display").load(packageActive + ".html");
        document.getElementById(packageActive).getElementsByClassName("packagebar-icon")[0].className += " packagebar-icon-active";
        document.getElementById(packageActive).getElementsByClassName("packagebar-icon-art")[0].className += " packagebar-icon-art-active";
        setTitle(packageActive);
        if (packageActive == 1) {
            activateVerton();
        }
        else if (packageActive != 1 && vertonActivate === true) {
            deactivateVerton();
            document.getElementById("display-verton-input").value= "";
        }
    }
}

//Function that creates icons in the packagebar
function createIcon(iconId) {
    let newElement = document.createElement("div");
    newElement.setAttribute("class", "packagebar-icon-outline");
    newElement.setAttribute("id", iconId);
    newElement.setAttribute("onclick", "loadPackage(this.id)");
    newElement.innerHTML = '<div class=\"packagebar-icon\"> \n              <div class=\"packagebar-icon-art-wrap\">          \n                <div class=\"packagebar-icon-art\" style=\"-webkit-mask-box-image: url(http:\/\/www.clker.com\/cliparts\/F\/5\/I\/M\/f\/U\/running-icon-white-on-transparent-background-md.png);\"><\/div>\n              <\/div>\n            <\/div>';
    document.getElementById("packagebar-section-main").appendChild(newElement);
}

//Create icons for relevant packages
for (i = 0; i < packageIconsAdd; i++) {
    createIcon(i + 4);
}

//Function that changes the display title
function setTitle(packageId) {
    if (packageId == 1) {
    $("h1.display-title").html("Assistant");
    }
    if (packageId == 2) {
    $("h1.display-title").html('Creator');
    }
    if (packageId == 3) {
    $("h1.display-title").html('Packages');
    }
    if (packageId == "settings") {
    $("h1.display-title").html('Settings');
    }
}

//Scroll display to the bottom and display appropriate fade effects outside the display on startup
window.onload = function () {
    display.scrollTop = display.scrollHeight;
}

//Function that activates the Verton UI's useable state
function activateVerton() {
    show("#display-verton-activate-wrap");
    show("#display-verton-activate");
    hide("#display-verton-deactivate-wrap");
    hide("#display-verton-deactivate");
    vertonActivate = true;
}

//Function that deactivates the Verton UI's useable state
function deactivateVerton() {
    hide("#display-verton-activate-wrap");
    hide("#display-verton-activate");
    show("#display-verton-deactivate-wrap");
    show("#display-verton-deactivate");
    vertonActivate = false;
}

//Function that fully starts Verton
function startVerton() {
    activateVerton();
}

//Function that hides an element
function hide(element) {
    $(element).addClass("hide");
    $(element).removeClass("show");
}

//Function that shows and element after being hidden
function show(element) {
    $(element).removeClass("hide-activate");
    $(element).removeClass("hide");
    $(element).addClass("show");
}

//Listener that detects if a "hide" animation has occured and executes appropriate code
document.addEventListener('animationend', function (element) {
    if (element.animationName === "hide") {
        element.target.classList.add('hide-activate');
    }
});


//Function that creates and shows Verton input and output
function createVertonOutput(){
    let newOutput = document.createElement("div");
    if (vertonOutput != null) {
        newOutput.setAttribute("class", "one-chat-bubble one-chat-bubble-verton");
        newOutput.innerHTML = "<p class='one-chat-bubble'>" + vertonOutput + "</p>";
        document.getElementById("one-chat").appendChild(newOutput);
    }
    else if (vertonOutput == null) {
        vertonOutput = "I'm sorry, I did not recognize your command."
        newOutput.setAttribute("class", "one-chat-bubble one-chat-bubble-verton");
        newOutput.innerHTML = "<p class='one-chat-bubble'>" + vertonOutput + "</p>";
        document.getElementById("one-chat").appendChild(newOutput);
        vertonOutput = null;
    }
}

//Function that lets Verton recognize commands, contains all pre-made Verton commands
function vertonRecognize(vertonInput) {
    if (vertonInput != "") {
        vertonOutput = null;
        let newInput = document.createElement("div");
        newInput.setAttribute("class", "one-chat-bubble one-chat-bubble-user");
        newInput.innerHTML = "<p class='one-chat-bubble'>" + vertonInput + "</p>";
        document.getElementById("one-chat").appendChild(newInput);

        if(vertonInput.includes("hello")) {
            vertonOutput = "Hello!"
        }   
        createVertonOutput();
    }
}

//Listener that detects if a user wants to deactivate Verton by clicking outside of the Verton input area
document.addEventListener("click", function(element) { 
    if (!event.target.closest("#display-verton-wrap") && packageActive != 1 && vertonActivate === true) {
        deactivateVerton();
    }
});