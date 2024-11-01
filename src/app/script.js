var modecolor = "light"

export const setupNavTest = () => {
    
    const body = document.querySelector("body");
    const sidebar = body.querySelector(".sidebar");
    const toggle = body.querySelector(".toggle");
    const modeSwitch = body.querySelector(".toggle-switch");
    const modeText = body.querySelector(".mode-text");

    let sidebarState = 1; // เริ่มต้นที่ 1 เพื่อให้ sidebar เป็นขนาดเล็กสุดเมื่อโหลดหน้าเว็บ

    if (modeSwitch) {
        modeSwitch.addEventListener("click", () => {
            toggleDarkMode();
            updateModeText();
        });
    }
    
    toggle.addEventListener("click", () => {
        sidebarState = (sidebarState + 1) % 2; // สลับสถานะของ sidebar ระหว่าง 1 และ 0
        if (sidebarState === 0) {
            sidebar.classList.add("close"); // เพิ่มคลาส close เพื่อให้ขนาดของ sidebar เล็กลง
        } else {
            sidebar.classList.remove("close"); // ลบคลาส close เพื่อให้ขนาดของ sidebar เพิ่มขึ้น
        }
    });

    if(body.classList.contains("dark")){
        modeText.innerText = "Light Mode"
    }else{
        modeText.innerText = "Dark Mode"
    }
};

export const toggleDarkMode = () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    const switchBtn = document.querySelector(".toggle-switch .switch");
    switchBtn.classList.toggle("dark");
};

export const updateModeText = () => {
    const body = document.querySelector("body");
    const modeText = document.querySelector(".mode-text");
    
    if (body.classList.contains("dark")) {
        modeText.innerText = "Light Mode";
    } else {
        modeText.innerText = "Dark Mode";
    }
};

// const axios = require('axios');

// function test() {
//     axios.get('https://apib17.bd2-cloud.net/')
//         .then(response => {
//             console.log(response.data);
//             document.getElementById("test").innerText = response.data;
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }

//setInterval(test, 10000);



