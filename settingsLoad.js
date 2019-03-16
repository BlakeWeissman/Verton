/*This script sets certain settings controls based on user settings*/

//Set theme toggle based on theme set
if (theme === "light") {
    document.getElementById("theme-checkbox").checked = false;
}
else if (theme === "dark") {
    document.getElementById("theme-checkbox").checked = true;
}