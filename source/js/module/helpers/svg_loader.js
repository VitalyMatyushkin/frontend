/**
 * Created by wert on 07.12.15.
 */

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

    xhr.open('get', '/build/images/icons.svg', true);
    xhr.send();
}


module.exports = loadSVG;