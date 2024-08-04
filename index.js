// let users = require('./users.json');
let users = []
await fetch("./users.json")
    .then(response => {
        return response.json();
    })
    .then(d => users = d);

let container_dates = document.querySelector(".container__dates-wrap")
let hide_btn = document.querySelector(".hide-btn")
let backlog = document.querySelector(".backlog")
let backlogItems = document.querySelector(".backlog__items")
let containerContent = document.querySelector(".container__content")


let dates = []
let closedBacklog = false
let backlog_items_data = []

function Init() {
    // Dates
    let date = new Date()
    setDates(date.getMonth(), date.getFullYear())
    console.log(dates)
    for (let item of dates) {
        let date_item = document.createElement("div")
        date_item.classList.add("container__dates-item")
        date_item.textContent = item.stringType
        container_dates.appendChild(date_item)
    }

    // Users
    setUsers()
}
Init()

function setDates(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    for (let item of days) {
        let dateItem = {
            dateType: item,
            stringType: item.getDate() + "." + (item.getMonth() + 1)
        }
        dates.push(dateItem)
    }
}

// Users and their tasks
function setUsers() {
    if (users && users.length > 0) {
        for (let item of users) {
            // Check with user: false = backlog, else = into user row
            if (item.no_user == true) {
                createBacklogItems(item)
                continue
            }
            createTaskOfUser(item)
        }
    }
}

function createTaskOfUser(item) {
    let currentDates = document.querySelectorAll(".container__dates-item")
    let arrCurrdates = Array.from(currentDates)

    let row = document.createElement("div")
    row.classList.add("userrow")
    let username = document.createElement("div")
    username.classList.add("username")
    let firstname = document.createElement("p")
    firstname.textContent = item.firstname
    let lastname = document.createElement("p")
    lastname.textContent = item.lastname
    username.appendChild(firstname)
    username.appendChild(lastname)

    let usertasks = document.createElement("div")
    usertasks.classList.add("usertasks")
    if (item.tasks && item.tasks.length > 0) {
        for (let ta of item.tasks) {
            let task = document.createElement("div")
            task.classList.add("usertaskitem")
            // task.textContent = ta.name
            task.setAttribute("taskid", ta.id)
            let sameDate = arrCurrdates.find(e => e.textContent == ta.start)
            let endDate = arrCurrdates.find(e => e.textContent == ta.end)

            if (sameDate) {
                let coords = sameDate.getBoundingClientRect();
                console.log(coords)
                task.style.left = coords.left + "px";
            }
            if (endDate) {
                let coordsEnd = endDate.getBoundingClientRect()
                task.style.right = coordsEnd.right + "px";
                task.style.width = (((Number(ta.end) + 1) - Number(ta.start)) * 100) + "px"
            }

            // append Modal
            let linkToModal = document.createElement("a")
            linkToModal.href = "#modal-task"
            linkToModal.style = "width: 100%; height: 100%;"
            linkToModal.textContent = ta.name

            document.querySelector(".text-modal").textContent = ta.text_modal

            task.appendChild(linkToModal)
            usertasks.appendChild(task)
        }
    }

    row.appendChild(username)
    row.appendChild(usertasks)

    containerContent.appendChild(row)
}

function createBacklogItems(item) {
    if (item.tasks && item.tasks.length > 0) {
        for (let task of item.tasks) {
            let backLogItem = document.createElement("div")
            backLogItem.classList.add("backlog__item")
            backLogItem.dataset.id = task.id
            backLogItem.innerHTML = "<b>" + task.name + "</b>" + "<p>" + task.text_modal + "</p>"

            backlogItems.appendChild(backLogItem)

            backlog_items_data.push({
                id: task.id,
                name: task.name,
                text_modal: task.text_modal
            })
        }
    }
}

document.querySelector(".backlog__search").addEventListener("keyup", (event) => {
    if(!event.target.value) {
        document.querySelectorAll(".backlog__item").forEach(e => {
            e.style.display = "block"
        })
        return
    }

    let inpVal = event.target.value.toLowerCase()

    let bySearch = backlog_items_data.filter(e => e.name.toLowerCase().includes(inpVal) || e.text_modal.toLowerCase().includes(inpVal))
    if(bySearch && bySearch.length > 0) {
        let ids = bySearch.map(e => e.id)
        document.querySelectorAll(".backlog__item").forEach(e => {
            if(ids.indexOf(e.dataset.id) == -1) {
                e.style.display = "none"
            } else {
                e.style.display = "block"
            }
        })
    } else {
        document.querySelectorAll(".backlog__item").forEach(e => {
            e.style.display = "none"
        })
    }
})