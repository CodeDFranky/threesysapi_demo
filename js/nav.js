let choices = document.querySelectorAll(".choice");
let forms = document.querySelectorAll("form");

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

let file_labels = document.querySelectorAll(".file-label");
let file_inputs = document.querySelectorAll(".file");

file_inputs.forEach((file_input, i) => {
    file_input.addEventListener("change", function () {
        file_name = this.value.split("\\").splice(-1, 1)[0];
        file_labels[i].innerText = file_name || "Upload a file";
    });
})

