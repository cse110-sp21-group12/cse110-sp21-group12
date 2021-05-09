//alert("extra script loaded");
const target_section = document.getElementById("content");
const yr_start = 2018;
const yr_end = 2025;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


/*
    <div id="2020">
        <div class="year" class="collapsible" class="horiz">
            <button id="2020_button" class = "coll_yr_button">></button>
            <a class="yearlink" href = "/year/2020.html">2020</a>
        </div>
        <div id = "2020_months" class = "collapsible_child">
            <h3>January</h3>
            <h3>February</h3>
            <h3>March</h3>
        </div>
    </div>
*/

alert

function setup(){
    //alert("Load runs");
    for(let yr = yr_start; yr <= yr_end; yr++){
        //wrapper
        let year_wrapper = document.createElement("div");
        year_wrapper.id = yr;
        
        //button group
        let year_nav = document.createElement("div");
        year_nav.classList.add("year");
        year_nav.classList.add("collapsible");
        year_nav.classList.add("horiz");
        //collapse button
        let coll_button = document.createElement("button");
        coll_button.id = yr+"_button";
        coll_button.classList.add("coll_yr_button");
        coll_button.innerText = ">";
        //year link
        let yearlink = document.createElement("a");
        yearlink.classList.add("yearlink");
        yearlink.id = yr+"_link";
        yearlink.href = "/year/"+yr+".html";
        yearlink.innerText = yr+" Yearly Overview";
        //add parts to button group
        year_nav.appendChild(coll_button);
        year_nav.appendChild(yearlink);
        //add button group to wrapper
        year_wrapper.appendChild(year_nav);
    
        //collapsible child
        let months_div = document.createElement("div");
        months_div.id = yr+"_months";
        months_div.classList.add("collapsible_child");
        //add months
        for(let m = 0; m < months.length; m++){
            //setup month link
            let month_name_lc = months[m].toLowerCase();
            let month_link = document.createElement("a");
            month_link.class = "monthlink "+(month_name_lc);
            month_link.id = yr+"_"+month_name_lc;
            month_link.href = "months/"+yr+"/"+month_name_lc+".html";
            month_link.innerText = months[m];
            //add this month to list of months
            months_div.appendChild(month_link);
        }

        months_div.style.display = "none";
        //add collapsible child to wrapper
        year_wrapper.appendChild(months_div);

        //add this year to list of years
        target_section.appendChild(year_wrapper);
    }
}





setup();

//sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(100);

/*
document.getElementById("work").addEventListener("click", on_work);
function on_work(){
    //<!-- <script src="script.js" type="module" defer></script> -->
    let main_script = document.createElement("script");
    main_script.src = "script.js";
    main_script.type="module";
    main_script.defer = true;
    document.body.appendChild(main_script);
}
*/



//alert("setup finished");