//alert("main script runs");
var collapsible_years_list = document.getElementsByClassName('coll_yr_button');

//shows or hides collapsible_child of button
function collapsible_year_toggle() {
    this.classList.toggle('active');
    let target_year = this.id.substring(0, 4);
    let target = document.getElementById(target_year + '_months');
    if (target.style.display === 'flex') {
        target.style.display = 'none';
        this.innerText = '>';
    } else {
        target.style.display = 'flex';
        this.innerText = 'v';
    }
}

//alert("Collapsibles found: "+ collapsible_years_list.length);
//alert("Sanity check: " + sanity_check.length);
for (let i = 0; i < collapsible_years_list.length; i++) {
    collapsible_years_list[i].addEventListener(
        'click',
        collapsible_year_toggle
    );
}
