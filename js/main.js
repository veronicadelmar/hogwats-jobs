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
// clean container and variables
const cleanContainer = (selector) => $(selector).innerHTML = ''
let skills = []
let isRegistered = false
// get jobs
const getJobs = (location = "", seniority = "", category = "") =>{
    const search =
    location !== ""
      ? `?location=${location}`
      : category !== ""
      ? `?category=${category}`
      : seniority !== ""
      ? `?seniority=${seniority}`
      : ""
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
                <article class="w-screen bg-white mx-10 p-4 border-2 border-[#aa8855] rounded-lg shadow-2xl sm:mb-4 sm:mx-0 sm:w-5/12 lg:w-[30%]">
                <img src="${image}" alt="${name}"class="hidden sm:flex mb-6 w-60 h-60 m-auto rounded">
                <h3 class="text-2xl font-bold">${name}</h3>
                <p class="text-lg text-justify mb-8">${minDescription}...</p>
                <div class=" text-[#fff] mb-4 mt-2 flex flex-wrap gap-4 justify-star">
                    <p class="p-1 px-2 rounded bg-[#c61c1c] inline">${location}</p>
                    <p class="p-1 px-2 rounded bg-[#d8a110] inline">${seniority}</p>
                    <p class="p-1 px-2 rounded bg-[#1c6f98] inline">${category}</p>
                </div>
                <button class="text-2xl font-medium text-white bg-[#006231] pt-1 px-3 rounded-full lg:hover:bg-[#00472d]/[0.8]" onclick="getJob('${id}')">Show Details</button>
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
            <article class="w-screen mx-10 bg-white p-4 border-solid border-2 border-[#aa8855] rounded-lg shadow-2xl sm:w-4/5 md:w-3/5 lg:w-4/6">
            <div class="flex mb-8 sm:flex-col lg:flex-row lg:justify-start lg:gap-2">
                <figure class="hidden md:flex md:m-auto sm:mb-4 lg:m-auto">
                    <img src="${job.image}" alt="${job.name}" class="sm:w-60 sm:mb-4 rounded">
                </figure>
                <article class="lg:m-auto lg:w-3/5">
                    <h3 class="text-4xl font-bold mb-2">${job.name}</h3>
                    <p class="text-2xl text-justify">${job.description}</p>
                </article>
            </div>
            <div class="flex flex-row flex-wrap justify-between mb-3">
                <div>
                    <img class="w-6 inline" src="https://img.icons8.com/color/48/marker--v1.png" alt="${job.location}"/>
                    <h3 class="text-xl font-bold inline">Location</h3>
                    <p class="font-medium p-1 px-4 w-fit rounded bg-[#fcf5e7] my-3">${job.location}</p>
                </div>
                <div>
                    <img class="w-8 inline" src="https://i.ibb.co/DMhD06R/giroscope.png" alt="${renderBoolean(job.long_term)}"/>
                    <h4 class="text-xl font-bold inline">Term type</h4>
                    <p class="font-medium p-1 text-center rounded bg-[#fcf5e7] my-3">${renderBoolean(job.long_term)}</p>  
                </div>
                <div>
                    <img class="w-8 inline" src="https://img.icons8.com/emoji/48/coin-emoji.png" alt="${job.salary}"/>
                    <h4 class="text-xl font-bold inline">Salary (Galleons)</h4>
                    <p class="font-medium text-center p-1 rounded bg-[#fcf5e7] my-3">${job.salary}</p>
                </div>
            </div>
            <div class="lg:flex lg:flex-row lg:gap-2 lg:flex-wrap lg:justify-between">
                <div class="lg:w-[46%]">
                    <img class="w-8 inline mb-2" src="https://img.icons8.com/plasticine/100/magic-crystal-ball.png" alt="${job.seniority}"/>
                    <h4 class="text-xl font-bold inline">Requirements</h4>
                    <h4 class="text-xl font-bold">Seniority</h4>
                    <p class="font-medium p-1 rounded bg-[#fcf5e7] mb-3">${job.seniority}</p>
                </div>
                <div class="lg:w-[46%]">
                    <img class="w-8 inline" src="https://img.icons8.com/doodle/48/scroll.png" alt="Benefits"/>
                    <h3 class="text-xl font-bold inline">Benefits</h3>
                    <h4 class="text-xl font-bold">Vacation</h4>
                    <p class="font-medium p-1 rounded bg-[#fcf5e7] mb-3">${job.benefits.vacation}</p>
                    <h4 class="text-xl font-bold">Health ensurance</h4>
                    <p class="font-medium p-1 rounded bg-[#fcf5e7] mb-3">${job.benefits.health_ensurance}</p>
                    <h4 class="text-xl font-bold">Lunch at work</h4>
                    <p class="font-medium p-1 rounded bg-[#fcf5e7] mb-6">${renderBoolean(job.benefits.lunch_at_work)}</p>
                </div>
            </div>
            <img class="w-12 inline" src="https://img.icons8.com/bubbles/50/tarot-cards.png" alt="Skills"/>
            <h4 class="text-xl font-bold inline">Skills</h4>
            <ul id="job-skills" class="list-disc my-3 lg:w-[50%]"></ul>
            <div class="flex flex-row justify-end">
                <button class="btn-edit text-2xl bg-[#006231] font-semibold text-[#fff] pt-1 px-3 rounded mr-[15px]" data-id="${job.id}" job-details="${job}">Edit Job</button>
                <button class="btn-delete text-2xl bg-[#c61c1c] font-semibold text-[#fff] pt-1 px-3 rounded">Delete Job</button>
            </div>
            </article>
            `
            for (const skill of job.skills){
                $("#job-skills").innerHTML += `
                <li class="ml-6 font-medium rounded bg-[#fcf5e7] mb-3">${skill}</li>
                `
            }
            // edit job
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
                hideElements(["#form"])
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
                <button class="btn-delete text-xl bg-[#c61c1c] text-[#fff] pt-1 px-3 rounded-full" data-id="${id}">Delete</button>
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
// validate form
const validateForm = () => {
    const name = $("#job-title").value
    const image = $("#url-image").value
    const description = $("#job-description").value
    const location = $("#job-location").value
    const category = $("#job-category").value
    const seniority = $("#job-seniority").value
    const vacation = $("#job-vacation").value
    const health_ensurance = $("#job-health-ensuranse").value
    const salary = $("#job-salary").value
    if (name == "" || image == "" || description == "" || location == "" || category == "" || seniority == "" || vacation == "" || health_ensurance == "" || salary == "" || skills.length < 1){
        showElements(["#msj"])
    } else{
        hideElements(["#msj"])
        if (isRegistered) {
            const jobId = $("#submit").getAttribute("data-id")
            editJob(jobId)
            hideElements("#form")  
        } else {
            registerJobs()        
        }
        $("#form").reset()
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
// create job
$("#btn-create-job").addEventListener("click", () => {
    hideElements(["#cards"])
    showElements(["#form"])
    isRegistered = false
    renderSkills()
})
// search
$("#search").addEventListener("click", () =>{
    const location = $("#location").value
    const seniority = $("#seniority").value
    const category = $("#category").value
    getJobs(location, seniority, category)
})
// clear
$("#clear").addEventListener("click", () => {
    $("#location").value = ""
    $("#category").value = ""
    $("#seniority").value = ""
    getJobs()
})
// add skills
$(".btn-add").addEventListener("click", () => {
    event.preventDefault()
    addSkill($("#new-skill").value)
})
// submit
$("#form").addEventListener("submit", (e) => {
    e.preventDefault()
    validateForm()
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
// delete job
$("#delete-job").addEventListener("click", () => {
    const id = $("#delete-job").getAttribute("data-id")
    deleteJob(id)
})
window.addEventListener("load", () => {
    getJobs()
})