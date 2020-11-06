document.querySelector(".burger").addEventListener("click", function() {
    this.classList.toggle("burger--active");
    document.querySelector(".static-navbar").classList.toggle("static-navbar--active");
});