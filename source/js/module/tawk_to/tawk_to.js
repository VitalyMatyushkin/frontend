/**
 * Created by wert on 02.11.16.
 */


/**
 * This is simple transcript of tawk.to script to module.
 * It just add new <script> entry into global html.
 * Also it creates two global vars. I don't know why, but tawk.to code requires it
 * @type {{}}
 */

window.$_Tawk_API = {};
window.$_Tawk_LoadStart = new Date();

const initTawkTo = function(){
	const 	s1=document.createElement("script"),
			s0=document.getElementsByTagName("script")[0];

	s1.async = true;
	s1.src = 'https://embed.tawk.to/57dd563e11028a70b19dda0f/default';
	s1.charset = 'UTF-8';
	s1.setAttribute('crossorigin','*');
	s0.parentNode.insertBefore(s1, s0);
};

module.exports = initTawkTo;