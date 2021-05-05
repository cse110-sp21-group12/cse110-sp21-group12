var collapsibles_list = document.getElementsByClassName("coll_button");

function collapsible_year_toggle(){
    this.classList.toggle("active");
    let target_year = this.id.substring(0, 4);
    let target = document.getElementById(target_year + "_months");
    if (target.style.display === "block") {
      target.style.display = "none";
      this.innerText = ">";
    } else {
      target.style.display = "block";
      this.innerText = "v";
    }
}

//alert("Collapsibles found: "+ i);
for (let i = 0; i < collapsibles_list.length; i++) {
    collapsibles_list[i].addEventListener("click", collapsible_year_toggle);
}
