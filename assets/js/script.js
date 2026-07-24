function scrollToSection(id){

    document.getElementById(id)
    .scrollIntoView({
        behavior:"smooth"
    });

}

document.getElementById("contactForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    alert("Message Sent Successfully!");

    this.reset();

});

const sections=document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

sections.forEach(section=>{

const top=section.getBoundingClientRect().top;

if(top<window.innerHeight-120){

section.classList.add("show");

}

});

});

function sendEmail(){
    window.location.href = "mailto:aminulislammahim2013@gmail.com"
}