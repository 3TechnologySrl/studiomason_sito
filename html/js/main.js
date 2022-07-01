import axios from 'axios'
import GDPRModule from "@3technologysrl/front-gdpr"
//import CtvLegalDialog from '@3technologysrl/front-gdpr/lit/legal-dialog'

window.addEventListener('DOMContentLoaded', () => {
    console.log("main loaded!");

    // Imposta il submit dei form
    let vforms = document.querySelectorAll("form")
    vforms.forEach((form) => {
        try {

            let button = form.querySelector("button") || form.querySelector("input[type=submit]")
            form.onsubmit = (evt) => {
                evt.preventDefault()

                let endpoint = form.getAttribute("data-endpoint")
                if (endpoint == null || endpoint == "")
                    return;

                const output = document.querySelector(`#${form.getAttribute('data-form-output')}`)

                output.classList.remove("active", "error", "success");
                form.classList.add('form-in-process');

                if (output.classList.contains("snackbars")) {
                    output.innerHTML = '<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>';
                    output.classList.add("active");
                }

                button.setAttribute("disabled", "disabled")
                // button.style.minWidth = button.getBoundingClientRect().width + "px"
                // let ih = button.innerHTML
                // button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`

                let data = {}
                form.querySelectorAll("[data-param]").forEach(input => {
                    if (input.type == 'radio' && input.checked == false)
                        return;

                    let key = input.getAttribute("data-param")
                    data[key] = input.value
                })

                axios.post(endpoint, data)
                    .then((ret) => {
                        form.classList.remove('form-in-process');
                        form.classList.add('success');

                        if (output.classList.contains("snackbars")) {
                            output.innerHTML = '<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>Successo!</span></p>';
                        } else {
                            output.classList.add("active", "success");
                        }

                        setTimeout(function () {
                            output.classList.remove("active", "error", "success");
                            form.classList.remove('success');
                        }, 3500);
                    })
                    .catch((err) => {
                        output.innerHTML("Si è verificato un errore");
                        form.classList.remove('form-in-process');
                        console.error(err);
                    })
                    .finally(() => {
                        button.removeAttribute("disabled")
                        // button.innerHTML = ih
                        form.querySelectorAll("[data-param]").forEach((input) => {
                            if (input.type != "hidden" && input.type != "radio")
                                input.value = ""
                        })
                    })
            }

        }
        catch (Ex) {
            console.log(Ex)
        }
    })

    document.querySelectorAll(".CookiePolicy").forEach((el) => el.onclick = (evt) => {
        evt.preventDefault();
        CtvLegalDialog.ShowCookies(
            {
            url:"https://cdnstatic.studio-mason.it/legal/cookies.md",
            isMarkdown:true
            }
        )        
    })
    document.querySelectorAll(".PrivacyPolicy").forEach((el) => el.onclick = (evt) => {
        evt.preventDefault();
        CtvLegalDialog.ShowPrivacy(
            {
                url:"https://cdnstatic.studio-mason.it/legal/privacy.md",
                isMarkdown:true
             }
        )
    })

});