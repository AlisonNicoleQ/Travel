const faqHeads = document.querySelectorAll(".faq .head");

faqHeads.forEach((faqHead) => {

    faqHead.addEventListener("click", () => {

        const faq = faqHead.parentNode;

        const faqContent = faqHead.nextElementSibling;
        

        faq.classList.toggle("active");
        

        if (faq.classList.contains("active")) {
            faqContent.style.height = (faqContent.scrollHeight + 30) + "px";
        } else {
            faqContent.style.height = "0px";
        }
    });
});
