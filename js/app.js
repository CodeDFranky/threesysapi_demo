
let api_gen_link = "https://threesysapi.up.railway.app/generate"
let api_ver_link = "https://threesysapi.up.railway.app/verify"

let gen_form = document.querySelector('#gen-form');
let ver_form = document.querySelector('#ver-form');

let movables = document.querySelectorAll(".movable");
let message_bar = document.querySelector(".message-bar");
let message_container = document.querySelector(".message-container");

let downloadable = document.querySelector(".downloadable");

let message_close_btn = document.querySelector(".message-close-btn-container");
let download_close_btn = document.querySelector(".download-close-btn-container");
let tutorial_close_btn = document.querySelector(".tutorial-close-btn-container");

let choices = document.querySelectorAll(".choice");
let forms = document.querySelectorAll("form");

let file_labels = document.querySelectorAll(".file-label");
let file_inputs = document.querySelectorAll(".file");

let about_btn = document.querySelector(".about-btn");

let last_seen_movable = 0;

message_close_btn.onclick = () => {
    clear_and_hide_message_bar();
}

download_close_btn.onclick = () => {
    turn_off_all_movables_except(0);
}

tutorial_close_btn.onclick = () => {
    turn_off_all_movables_except(last_seen_movable);
}

gen_form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clear_and_hide_message_bar();
    turn_off_all_movables_except(2);
    let form_data = new FormData(gen_form);
    let response = await request_api(api_gen_link, form_data);
    let response_blob = await response.blob();
    if (response_blob.type == "application/pdf") {
        let response_url = await parse_blob(response_blob.type, response_blob);
        let header_content_disposition = response.headers.get("Content-Disposition");
        let parts = header_content_disposition.split(';');
        let file_name = parts[1].split('=')[1];
        set_downloadable(response_url, file_name);
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
    let response = await request_api(api_ver_link, form_data);
    let response_blob = await response.blob();
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
            // message_container.classList.add("centered-text");
        }
        else {
            message_close_btn.classList.add("active");
            message_bar.classList.remove("fail");
            message_bar.classList.add("pass");
            // message_container.classList.remove("centered-text");
        }
        return response;
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

function set_downloadable(url, file_name) {
    downloadable.setAttribute("download", file_name);
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

choices.forEach((choice, i) => {
    choice.onclick = () => {
        switch (i) {
            case 0:
                // generate
                forms[0].classList.add("active");
                forms[1].classList.remove("active");
                choices[0].classList.remove("deactivate");
                choices[1].classList.add("deactivate");
                break;
            case 1:
                // verify
                forms[0].classList.remove("active");
                forms[1].classList.add("active");
                choices[0].classList.add("deactivate");
                choices[1].classList.remove("deactivate");
                break;
        }
    }
});

file_inputs.forEach((file_input, i) => {
    file_input.addEventListener("change", function () {
        file_name = this.value.split("\\").splice(-1, 1)[0];
        file_labels[i].innerText = file_name || "Upload a file";
    });
})



about_btn.onclick = () => {
    movables.forEach((movable, i) => {
        if (movable.classList.contains("active")) {
            last_seen_movable = i;
        }
    });
    turn_off_all_movables_except(3);
}