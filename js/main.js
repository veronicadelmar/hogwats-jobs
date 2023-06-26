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
        for (const {id, name, image, description, location, seniority, category} of jobs) {
            $("#cards").innerHTML += `
            <article class="w-full p-4 border-solid border-2 border-[#aa8855] rounded shadow-2xl md:w-5/12 lg:w-1/4">
               <img src="${image}" alt="${name}" class="mb-2">
               <h3 class="text-4xl font-bold">${name}</h3>
               <p class="text-2xl text-justify">${description}</p>
               <div class="text-xl text-[#fff] flex justify-between mb-6">
                  <p class="p-1 rounded bg-[#9d193d]">${location}</p>
                  <p class="p-1 rounded bg-[#c0882a]">${seniority}</p>
                  <p class="p-1 rounded bg-[#20293a]">${category}</p>
               </div>
               <button class="btn-show-datails text-2xl bg-[#00472d] text-[#fff] p-3 rounded" data-id="${id}">Show Details</button>
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
            <article class="w-full p-4 border-solid border-2 border-[#aa8855] rounded shadow-2xl md:w-5/12 lg:w-1/4">
            <img src="${job.image}" alt="${job.name}" class="mb-2">
            <h3 class="text-4xl font-bold">${job.name}</h3>
            <p class="text-2xl text-justify">${job.description}</p>
            <h3 class="text-2xl font-bold">Location</h3>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.location}</p>
            <h3 class="text-2xl font-bold">Benefits</h3>
            <h4 class="text-xl font-bold">Vacation</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.benefits.vacation}</p>
            <h4 class="text-xl font-bold">Health ensurance</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.benefits.health_ensurance}</p>
            <h4 class="text-xl font-bold">Lunch at work</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-6 text-xl">${renderBoolean(job.benefits.lunch_at_work)}</p>
            <h4 class="text-xl font-bold">Salary (Galleons)</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.salary}</p>
            <h4 class="text-2xl font-bold">Requirements</h4>
            <h4 class="text-xl font-bold">Seniority</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.seniority}</p>
            <h4 class="text-xl font-bold">Skills</h4>
            <ul id="job-skills" class="list-disc"></ul>
            <h4 class="text-xl font-bold">Term type</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${renderBoolean(job.long_term)}</p>
            <button class="btn-edit text-2xl bg-[#00472d] text-[#fff] p-3 rounded" data-id="${job.id}" job-details="${job}">Edit Job</button>
            <button class="btn-delete text-2xl bg-[#9d193d] text-[#fff] p-3 rounded" data-id="${job.id}">Delete Job</button>
            </article>
            `
            for (const skill of job.skills){
                $("#job-skills").innerHTML += `
                <li class="ml-6 text-xl font-semibold rounded bg-[#fcf5e7] mb-3 text-xl">${skill}</li>
                `
            }
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

/* render boolean */
const renderBoolean = (value) => {
    if(value){
        return "Yes"
    } else {
        return "No"
    }
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
        $("header").classList.toggle("mb-[90px]")
        $("main").classList.toggle("mt-[90px]")
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