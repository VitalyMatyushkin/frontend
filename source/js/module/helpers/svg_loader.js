/**
 * Created by wert on 07.12.15.
 */
const Bowser = require('bowser');

/** Will add new div with svg icons */
function loadSVG() {
        var scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1],
        xhr = new XMLHttpRequest();

    xhr.onload = function () {
        var div = document.createElement('div');
        div.innerHTML = this.responseText;
        div.style.display = 'none';
        script.parentNode.insertBefore(div, script);
    };
	if (Bowser.msie || Bowser.msedge) {
		xhr.open('get', '/build/images/iconsIE.svg', true) // for Edge and IE
	} else {
		xhr.open('get', '/build/images/icons.svg', true); //for other browser
	}
    xhr.send();
}


module.exports = loadSVG;