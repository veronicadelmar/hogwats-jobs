/* selectors */
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)
/* hide and show elements */
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
/* clean container and variables */
const cleanContainer = (selector) => $(selector).innerHTML = ''
let skills = []
let isRegistered = false

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

/* delete job */
const deleteJob = (jobId) => {
    fetch(`https://649078f91e6aa71680cb527f.mockapi.io/jobs/${jobId}`, {
        method: "DELETE"
    }).finally(() => window.location.reload())
}

// register jobs
const registerJobs = () => {
    fetch(`https://649078f91e6aa71680cb527f.mockapi.io/jobs`, {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJob())
    })
}

// edit job
const editJob = (jobId) => {
    fetch(`https://649078f91e6aa71680cb527f.mockapi.io/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJob())
    }).finally(() => window.location.reload())
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
               <button class="btn-edit" data-id="${job.id}" job-details="${job}">Edit Job</button>
               <button class="btn-delete" data-id="${job.id}">Delete Job</button>
            </article>
            `
    }
    // mejorar edit
    $(".btn-edit").addEventListener("click", () => {
        hideElements(["#cards"])
        showElements(["#form"])
        isRegistered = true
        setFormValues(job) 
        $("#submit").setAttribute("data-id", job.id)
    })
    //mejorar delete
    $(".btn-delete").addEventListener("click", () => {
        deleteJob(job.id)
    })
}




/* skills */
const addSkill = (skill) => {
    skills.push(skill)
    $("#new-skill").value = ""
    renderSkills()
}

const deleteSkill = (id) => {
    skills.splice(id,1)
    renderSkills()
}

const renderSkills = () => {
    cleanContainer("#skills")
    let id = 0
    for (skill of skills){
        $("#skills").innerHTML += `
            <span>${skill}</span>
            <button class="btn-delete" data-id="${id}">Delete</button>
        `
        id ++
    }

    for (const btn of $$(".btn-delete")) {
        btn.addEventListener("click", () => {
            const skillId = btn.getAttribute("data-id")
            deleteSkill(skillId)
        })
    }
}

/* set form values */
const setFormValues = (job) => {
    $("#job-title").value = job.name
    $("#job-description").value = job.description
    $("#job-location").value = job.location
    $("#job-seniority").value = job.seniority
    $("#job-category").value = job.category
    $("#job-vacation").value = job.benefits.vacation
    $("#job-health-ensuranse").value = job.benefits.health_ensurance
    $("#job-lunch").checked = job.benefits.lunch_at_work
    $("#job-salary").value = job.salary
    $("#job-long-term").checked = job.long_term
    // imagen
    // mejorar skills
    skills = job.skills
    renderSkills()
}

const saveJob = () => {
    return{
            name: $("#job-title").value,
            image: "",
            description: $("#job-description").value,
            location: $("#job-location").value,
            category: $("#job-category").value,
            seniority: $("#job-seniority").value,
            benefits: {
              vacation: $("#job-vacation").value,
              health_ensurance: $("#job-health-ensuranse").value,
              lunch_at_work: $("#job-lunch").checked
            },
            salary: $("#job-salary").value,
            long_term: $("#job-long-term").checked,
            skills: skills
     }
}

/* events */

$(".btn-burger").addEventListener("click", () => {
    if (!$(".btn-burger").classList.contains("hidden")) {
        $("nav").classList.toggle("hidden")
        $("header").classList.toggle("mb-28")
        $("main").classList.toggle("mt-20")
    }
})

$("#btn-create-job").addEventListener("click", () => {
    hideElements(["#cards"])
    showElements(["#form"])
    isRegistered = false
    renderSkills()
})



$(".btn-add").addEventListener("click", () => {
    event.preventDefault()
    addSkill($("#new-skill").value)
})

$("#form").addEventListener("submit", (e) => {
    e.preventDefault()
    if (isRegistered) {
        const jobId = $("#submit").getAttribute("data-id")
        console.log(jobId)
        editJob(jobId)
        hideElements("#form")
    } else {
        registerJobs()
    }
    $("#form").reset()
})



// image card - url
$("#url-image").addEventListener("input", () => {
    $("#image").style.backgroundImage = `url(${$("#url-image").value})`
})



window.addEventListener("load", () => {
    getJobs()
})