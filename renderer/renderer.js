const green = document.querySelector('button#green')
const yellow = document.querySelector('button#yellow')
const blue = document.querySelector('button#blue')

let actionsDisabled = true

const OPTIONS = {
	'yellow': 0,
	'green': 1,
	'blue': 2
}

yellow.addEventListener('click', () => {
	console.log('yellow selected')
	optionSelected(OPTIONS['yellow'])
})

green.addEventListener('click', () => {
	console.log('green selected')
	optionSelected(OPTIONS['green'])
})

blue.addEventListener('click', () => {
	console.log('blue selected')
	optionSelected(OPTIONS['blue'])
})

function buttonPressed(button) {
	button.classList.add('active')
}

function buttonReleased(button) {
	button.classList.remove('active')
	button.click()
}

window.electronAPI.buttonPressed((event, color) => {
	if (actionsDisabled) return
	
	const byColor = {
		'green': () => buttonPressed(green),
		'yellow': () => buttonPressed(yellow),
		'blue': () => buttonPressed(blue)
	}
	byColor[color]()
})

window.electronAPI.buttonReleased((event, color) => {
	if (actionsDisabled) return
	
	const byColor = {
		'green': () => buttonReleased(green),
		'yellow': () => buttonReleased(yellow),
		'blue': () => buttonReleased(blue)
	}
	byColor[color]()
})

/* PORTS LOGIC */

let PORTS = {}
const buttonGetPorts = document.querySelector('button#get-ports')
const portSelect = document.querySelector('#port-select')

// When distinct port is selected by the user
portSelect.addEventListener('change', () => {
    deviceOpen(portSelect.value)
})

function deviceOpen(path) {
    window.electronAPI.deviceOpen(path)
}

// Update the list of available ports
buttonGetPorts.addEventListener('click', function() {
    window.electronAPI.getPortList()
    .then((ports) => {
        PORTS = []
    
        if (ports === 'No devices') {
            portSelect.disabled = true
            portSelect.innerHTML = `<option value="" selected disabled hidden>Sin dispositivos</option>`
        } else {
            portSelect.disabled = false
            portSelect.innerHTML = ""
            
            ports.forEach(port => {
                portSelect.innerHTML += `<option value="${port.path}">${port.path}</option>`
                PORTS[port.path] = port
            })
    
            portSelect.value = ports[0].path
            deviceOpen(portSelect.value)
        }
    })
})


