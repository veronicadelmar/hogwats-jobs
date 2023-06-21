/* selectors, hide and show elements, clean container */
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const hideElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}

const showElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove("hidden")
    }
}

const cleanContainer = (selector) => $(selector).innerHTML = ''

/* get jobs */
const getJobs = (jobId = "") =>{
    fetch(`https://649078f91e6aa71680cb527f.mockapi.io/jobs/${jobId}`)
    .then(res => res.json())
    .then(data => {
        if(jobId === ""){
            renderJobs(data)
        } else {
            renderJobDetails(data)
        }
    })
}

/* all jobs */
const renderJobs = (jobs) => {
    if (jobs) {
        for (const {id, name, description, location, seniority, category} of jobs) {
            $("#cards").innerHTML += `
            <article class="w-4/5 p-4 border-solid border-4 border-black md:w-5/12 lg:w-1/4">
               <figure id="image">IMAGEN</figure>
               <h3>${name}</h3>
               <p>${description}</p>
               <div>
                  <p>${location}</p>
                  <p>${seniority}</p>
                  <p>${category}</p>
               </div>
               <button class="btn-show-datails" data-id="${id}">Show Details</button>
            </article>
            `
        }
    }

    for (const btn of $$(".btn-show-datails")) {
        btn.addEventListener("click", () => {
            cleanContainer("#cards")
            const jobId = btn.getAttribute("data-id")
            getJobs(jobId)
        })
    }
}

/* details job */
const renderJobDetails = (job) => {
    if (job) {
        $("#cards").innerHTML += `
            <article class="w-4/5 p-4 border-solid border-4 border-black md:w-5/12 lg:w-1/4">
               <h3>${job.name}</h3>
               <p>${job.description}</p>
               <div>
                  <p>${job.location}</p>
                  <p>${job.seniority}</p>
                  <p>${job.category}</p>
               </div>
               <button class="btn-edit" data-id="${job.id}">Edit Job</button>
               <button class="btn-delete" data-id="${job.id}">Delete Job</button>
            </article>
            `
    }
}

$(".btn-burger").addEventListener("click", () => {
    if (!$(".btn-burger").classList.contains("hidden")) {
        $("nav").classList.toggle("hidden")
        $("header").classList.toggle("mb-28")
        $("main").classList.toggle("mt-20")
    }
})

// image card - url
$("#url-image").addEventListener("input", () => {
    $("#image").style.backgroundImage = `url(${$("#url-image").value})`
})

// $(".btn-show-datails").addEventListener("click", () => {
//     const jobId = $(".btn-show-datails").getAttribute("data-id")
//     cleanContainer("#cards")
//     getJobs(jobId)
// })



window.addEventListener("load", () => {
    getJobs()
})