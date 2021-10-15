const form_tag = document.getElementsByTagName('form')[0]
const listOfTasks = document.querySelector('.inputed-values-container')
const actionBar = document.querySelector('.actions-bar')
const crossBtn = document.querySelector('.cross')
const themeMode = document.querySelector('.mode')
const backgroundImg = document.querySelector('.bg')


let childNodesArr = []

let listArr = JSON.parse(localStorage.getItem('list')) || []
let completedArr = []
let activeListArr = []

function inputHandler(e) {
    e.preventDefault()

    let task = document.querySelector('[type=text]').value;
    let taskObj = {
        checked: false,
        task: `${task}`
    }

    if(task != '') {
    listArr.push(taskObj)
    }

    localStorage.setItem('list', JSON.stringify(listArr))
    displayInputs(listArr)
    form_tag.reset()
}


function displayInputs(taskArr) {

    listOfTasks.innerHTML = taskArr.map((element, index) => {
            return `
            <div class='task' draggable="true" data-index=${index}>
                <input type="checkbox" name='task-${index+1}' data-index=${index} ${element.checked ? 'checked' : ''}>
                <p draggable="true">${element.task}</p>
                <img src="./images/icon-cross.svg" class='cross' data-index=${index} alt="cross-img">
            </div>`
        }).join('')

    if(listArr.length >= 1){
        actionBar.innerHTML = `
        <p class="items-left-info">${taskArr.length} items left</p>
        <p class="all-btn btn">All</p>
        <p class="active-btn btn">Active</p>
        <p class="completed-btn btn">Completed</p>
        <p class="clear-completed-btn btn">Clear Completed</p>`

        actionBar.classList.add('bar')
        childNodesArr = listOfTasks.childNodes
    } else {
        actionBar.classList.remove('bar')
    }
}
displayInputs(listArr)


function toggleItem(e) {
    if(e.target.matches('input')){
        let index = e.target.dataset.index;
        listArr[index].checked = !listArr[index].checked
        localStorage.setItem('list', JSON.stringify(listArr))
    }
}


function clearTask(e) {
    if(e.target.matches('img')){
        let index = e.target.dataset.index;
        listArr = listArr.filter((a) => {
            return listArr.indexOf(a) != index
        })

        localStorage.setItem('list', JSON.stringify(listArr))
        displayInputs(listArr)
    }
}

function activeTask(e) {
    if(e.target.textContent != 'Active') return 
    activeListArr = listArr.filter((list) => list.checked == false)
    displayInputs(activeListArr)
    let element = e.target
    console.log(element);
}

function completedTask(e) {
    if(e.target.textContent != 'Completed') return
    completedArr = listArr.filter((list) => list.checked == true)
    displayInputs(completedArr)
}

function clearCompletedTask(e) {
    if(e.target.textContent != 'Clear Completed') return
    activeListArr = listArr.filter((list) => list.checked == false)
    if(activeListArr != []) {
        listArr = activeListArr
    }
    displayInputs(listArr)
    localStorage.setItem('list', JSON.stringify(listArr))
}

function displayAllTask(e) {
    if(e.target.textContent != 'All') return
    displayInputs(listArr)
}

function displayActiveBtn(e) {
    if(e.target.classList[1] != 'btn') return
    e.target.classList.add('active')
}

// code to get the previous theme set by the user
let theme = localStorage.getItem('theme')

if(theme != null){
    console.log(theme);
    changeTheme(theme)
} else {
    changeTheme('light')
}


function changeTheme(mode) {
    let link_tag = document.getElementById('theme-style')

    if (mode === 'dark'){
        link_tag.href = './dark-mode.css'
        themeMode.dataset.mode = 'light'
        themeMode.src = './images/icon-sun.svg'
        backgroundImg.src = './images/bg-desktop-dark.jpg'
        localStorage.setItem('theme', 'dark')

    } else if (mode === 'light') {
        link_tag.href = ''
        themeMode.dataset.mode = 'dark'
        themeMode.src = './images/icon-moon.svg'
        backgroundImg.src = './images/bg-desktop-light.jpg'
        localStorage.setItem('theme', 'light')
    }
}

function eventListeners() {
    form_tag.addEventListener('submit', inputHandler)
    listOfTasks.addEventListener('click', toggleItem)
    listOfTasks.addEventListener('click', clearTask)
    actionBar.addEventListener('click', displayActiveBtn)
    actionBar.addEventListener('click', activeTask)
    actionBar.addEventListener('click', completedTask)
    actionBar.addEventListener('click', clearCompletedTask)
    actionBar.addEventListener('click', displayAllTask)
    themeMode.addEventListener('click', function() {
        let mode = this.dataset.mode;
        changeTheme(mode)
    })
}

eventListeners()


// function for implementing drag operation
childNodesArr.forEach((task) => {
    task.addEventListener('dragstart', dragStart)
    task.addEventListener('dragenter', dragEnter)
    task.addEventListener('dragleave', dragLeave)
    task.addEventListener('drop', dragDrop)
    task.addEventListener('dragover', dragOver);
})

let startPosition = 0
function dragStart() {
    startPosition = this.dataset.index
    console.log('start', startPosition);
}

function dragEnter() {
    this.classList.add('over')
}

function dragLeave() {
    this.classList.remove('over')
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop() {
    let stopPosition = this.dataset.index
    this.classList.remove('over')
    swapItems(startPosition, stopPosition)
}

function swapItems(startPos, stopPos) {
    let item1 = listArr[startPos]
    let item2 = listArr[stopPos]

    listArr[stopPos] = item1
    listArr[startPos] = item2
    displayInputs(listArr)
    localStorage.setItem('list', JSON.stringify(listArr))
    location.reload()
}