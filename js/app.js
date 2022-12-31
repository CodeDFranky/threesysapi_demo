let api_gen_link = "https://threesysapi.up.railway.app/generate"
let api_ver_link = "https://threesysapi.up.railway.app/verify"

let gen_form = document.querySelector('#gen-form');
let ver_form = document.querySelector('#ver-form');

let movables = document.querySelectorAll(".movable");
let message_bar = document.querySelector(".message-bar");
let message_container = document.querySelector(".message-container");
let message_close_btn = document.querySelector(".message-close-btn-container");

let downloadable = document.querySelector(".downloadable");
let download_close_btn = document.querySelector(".download-close-btn-container");

message_close_btn.onclick = () => {
    clear_and_hide_message_bar();
}

download_close_btn.onclick = () => {
    turn_off_all_movables_except(0);
}

gen_form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clear_and_hide_message_bar();
    turn_off_all_movables_except(2);
    let form_data = new FormData(gen_form);
    let response_blob = await request_api(api_gen_link, form_data);
    if (response_blob.type == "application/pdf") {
        let response_url = await parse_blob(response_blob.type, response_blob);
        set_downloadable(response_url);
        turn_off_all_movables_except(1);
    }
    else {
        let response_json_string = await parse_blob(response_blob.type, response_blob);
        let response_json = JSON.parse(response_json_string);
        let message = response_json.message;
        message_container.innerText = message;
        message_bar.classList.add("active");
        turn_off_all_movables_except(0);
        temporary_message_bar();
    }


})

ver_form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clear_and_hide_message_bar();
    turn_off_all_movables_except(2);
    let form_data = new FormData(ver_form);
    let response_blob = await request_api(api_ver_link, form_data);
    let response_json_string = await parse_blob(response_blob.type, response_blob);
    let response_json = JSON.parse(response_json_string);
    let message = response_json.message;
    message_container.innerText = message;
    if (response_json.plain) {
        message_container.innerText += `\n${response_json.plain}`;
    }
    message_bar.classList.add("active");
    turn_off_all_movables_except(0);
    temporary_message_bar();
})

const request_api = async (url, form_data) => {
    try {
        let response = await fetch(url, {
            method: "POST",
            body: form_data
        });
        if (response.status >= 400) {
            message_close_btn.classList.remove("active");
            message_bar.classList.add("fail");
            message_bar.classList.remove("pass");
            message_container.classList.add("centered-text");
        }
        else {
            message_close_btn.classList.add("active");
            message_bar.classList.remove("fail");
            message_bar.classList.add("pass");
            message_container.classList.remove("centered-text");
        }
        return response.blob();
    } catch (error) {
        console.log(error)
    }
}

function parse_blob(type, blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        switch (type) {
            case "application/pdf":
                reader.readAsDataURL(blob);
                break;
            case "application/json":
                reader.readAsText(blob);
        }
    });
}

function set_downloadable(url) {
    downloadable.setAttribute("download", "signed.pdf");
    downloadable.href = url;
}

function turn_off_all_movables_except(chosen) {
    movables.forEach(movable => {
        movable.classList.remove("active");
    });
    movables[chosen].classList.add("active");
}

function temporary_message_bar() {
    if (message_bar.classList.contains("fail")) {
        setTimeout(() => {
            message_bar.classList.remove("active");
        }, 5000);
    }
}

function clear_and_hide_message_bar() {
    if (message_bar.classList.contains("pass")) {
        message_container.innerText = "";
        message_bar.classList.remove("active");
    }
}