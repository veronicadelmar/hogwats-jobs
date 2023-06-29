// selectors 
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)
// hide and show elements
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
// lean container and variables
const cleanContainer = (selector) => $(selector).innerHTML = ''
let skills = []
let isRegistered = false
// get jobs
const getJobs = (location = "", category = "", seniority = "") =>{
    let search = ""
    search = location != "" ? `?location=${location}` : ""
    search = category != "" ? `?category=${category}` : "";
    search = seniority != "" ? `?seniority=${seniority}` : "";
    fetch(`https://649078f91e6aa71680cb527f.mockapi.io/jobs${search}`)
    .then(res => res.json())
    .then(data => {
        renderJobs(data)
    })
}
// get job
const getJob = (jobId) =>{
    fetch(`https://649078f91e6aa71680cb527f.mockapi.io/jobs/${jobId}`)
    .then(res => res.json())
    .then(data => {
        renderJobDetails(data)
    })
}
// delete job
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
    }).finally(() => window.location.reload())
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
// all jobs
const renderJobs = (jobs) => {
    cleanContainer("#cards")
    showElements(["#snitch"])
    if (jobs) {
        setTimeout(() => {
            hideElements(["#snitch"])
            for (const {id, name, image, description, location, seniority, category} of jobs) {
                const minDescription = description.slice(0, 70);
                $("#cards").innerHTML += `
                <article class="w-screen mx-10 p-4 border-solid border-2 border-[#aa8855] rounded-lg shadow-2xl sm:m-4 sm:w-5/12 lg:w-1/4">
                <img src="${image}" alt="${name}"class="hidden sm:flex mb-6 w-60 m-auto rounded">
                <h3 class="text-4xl font-bold">${name}</h3>
                <p class="text-xl text-justify">${minDescription}...</p>
                <div class="text-lg text-[#fff] my-6 flex flex-wrap gap-2 justify-star">
                    <p class="p-1 rounded bg-[#c61c1c] inline">${location}</p>
                    <p class="p-1 rounded bg-[#bdbd00] inline">${seniority}</p>
                    <p class="p-1 rounded bg-[#1c6f98] inline">${category}</p>
                </div>
                <button class="text-2xl border-[#006231] text-white bg-[#006231]/[0.8] border-solid border-4 py-1 px-3 rounded-full lg:hover:bg-[#00472d] lg:hover:border-[#aa8855]" onclick="getJob('${id}')">Show Details</button>
                </article>
                `
            }
        }, 2000)
    }
}
// details job
const renderJobDetails = (job) => {
    cleanContainer("#cards")
    showElements(["#snitch"])
    if (job) {
        setTimeout(() => {
            hideElements(["#snitch"])
            $("#cards").innerHTML += `
            <article class="w-screen mx-10 p-4 border-solid border-2 border-[#aa8855] rounded-lg shadow-2xl sm:w-4/5 md:w-3/5 lg:w-4/6">
            <div class="flex mb-8 sm:flex-col lg:flex-row lg:justify-start lg:gap-2">
                <figure class="hidden md:flex md:m-auto md:mb-4 lg:m-auto">
                    <img src="${job.image}" alt="${job.name}" class="sm:w-60 rounded">
                </figure>
                <article class="lg:m-auto lg:w-3/5">
                    <h3 class="text-4xl font-bold">${job.name}</h3>
                    <p class="text-2xl text-justify">${job.description}</p>
                </article>
            </div>
            <img class="w-6 inline" src="https://img.icons8.com/color/48/marker--v1.png" alt="${job.location}"/>
            <h3 class="text-2xl font-bold inline">Location</h3>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] my-3 text-xl">${job.location}</p>
            <img class="w-8 inline" src="https://img.icons8.com/doodle/48/scroll.png" alt="Benefits"/>
            <h3 class="text-2xl font-bold inline">Benefits</h3>
            <h4 class="text-xl font-boldmy-6">Vacation</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.benefits.vacation}</p>
            <h4 class="text-xl font-bold">Health ensurance</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.benefits.health_ensurance}</p>
            <h4 class="text-xl font-bold">Lunch at work</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-6 text-xl">${renderBoolean(job.benefits.lunch_at_work)}</p>
            <img class="w-8 inline" src="https://img.icons8.com/emoji/48/coin-emoji.png" alt="${job.salary}"/>
            <h4 class="text-xl font-bold inline">Salary (Galleons)</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] my-3 text-xl">${job.salary}</p>
            <img class="w-8 inline" src="https://img.icons8.com/plasticine/100/magic-crystal-ball.png" alt="${job.seniority}"/>
            <h4 class="text-2xl font-bold inline">Requirements</h4>
            <h4 class="text-xl font-bold">Seniority</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] mb-3 text-xl">${job.seniority}</p>
            <img class="w-12 inline" src="https://img.icons8.com/bubbles/50/tarot-cards.png" alt="Skills"/>
            <h4 class="text-xl font-bold inline">Skills</h4>
            <ul id="job-skills" class="list-disc my-3"></ul>
            <img class="w-8 inline" src="https://i.ibb.co/DMhD06R/giroscope.png" alt="${renderBoolean(job.long_term)}"/>
            <h4 class="text-xl font-bold inline">Term type</h4>
            <p class="text-xl font-semibold p-1 rounded bg-[#fcf5e7] my-3 text-xl">${renderBoolean(job.long_term)}</p>
            <button class="btn-edit text-2xl bg-[#006231] text-[#fff] p-3 rounded mr-[15px]" data-id="${job.id}" job-details="${job}">Edit Job</button>
            <button class="btn-delete text-2xl bg-[#c61c1c] text-[#fff] p-3 rounded">Delete Job</button>
            </article>
            `
            for (const skill of job.skills){
                $("#job-skills").innerHTML += `
                <li class="ml-6 text-xl font-semibold rounded bg-[#fcf5e7] mb-3 text-xl">${skill}</li>
                `
            }
            // mejorar edit
            $(".btn-edit").addEventListener("click", () => {
                showElements(["#form"])
                isRegistered = true
                setFormValues(job) 
                $("#submit").setAttribute("data-id", job.id)
            })
            // open modal delete
            $(".btn-delete").addEventListener("click", () => {
                showElements(["#modal-delete"])
                hideElements(["#cards"])
                $("#delete-job").setAttribute("data-id", job.id)
            })
        }, 2000)
    }
}
// render boolean
const renderBoolean = (value) => {
    if(value){
        return "Yes"
    } else {
        return "No"
    }
}
// functions skills
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
            <li class="p-2 italic rounded bg-[#fcf5e7] my-2 w-fit">${skill}
                <button class="btn-delete text-xl bg-[#9d193d] text-[#fff] pt-1 px-3 rounded-full" data-id="${id}">Delete</button>
            </li>
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
// set form values
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
    $("#url-image").value = job.image
    // mejorar skills
    skills = job.skills
    renderSkills()
}
// save job
const saveJob = () => {
    return{
            name: $("#job-title").value,
            image: $("#url-image").value,
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

// events
$("#open-menu-btn").addEventListener("click", () => {
    if (!$("#open-menu-btn").classList.contains("hidden")) {
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

$("#search").addEventListener("click", () =>{
    const location = $("#location").value
    const category = $("#category").value
    const seniority = $("#seniority").value
    getJobs(location, category, seniority)
})

$("#clear").addEventListener("click", () => {
    $("#location").value = ""
    $("#category").value = ""
    $("#seniority").value = ""
    getJobs()
})

$(".btn-add").addEventListener("click", () => {
    event.preventDefault()
    addSkill($("#new-skill").value)
})

$("#form").addEventListener("submit", (e) => {
    e.preventDefault()
    if (isRegistered) {
        const jobId = $("#submit").getAttribute("data-id")
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
// selects
$("#location").addEventListener("change", () => {
    $("#category").value = ""
    $("#seniority").value = ""
})
$("#category").addEventListener("change", () => {
    $("#location").value = ""
    $("#seniority").value = ""
})
$("#seniority").addEventListener("change", () => {
    $("#location").value = ""
    $("#category").value = ""
})

$("#delete-job").addEventListener("click", () => {
    const id = $("#delete-job").getAttribute("data-id")
    deleteJob(id)
})



window.addEventListener("load", () => {
    getJobs()
})