(function (doc) {
	var scripts = doc.getElementsByTagName('script'),
		script = scripts[scripts.length - 1],
		xhr = new XMLHttpRequest();

	xhr.onload = function () {
		var div = doc.createElement('div');

		div.innerHTML = this.responseText;
		div.style.display = 'none';
		script.parentNode.insertBefore(div, script);
	};

	xhr.open('get', '/build/images/icons.svg', true);
	xhr.send()
})(document);