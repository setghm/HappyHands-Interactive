/**
 * HappyHands Interactive
 *
 * By Set HM 2023.
 *
 *
 * Designed for children to use, learn the animal species, different shapes and colors,
 * and demonstrate their skill and memory.
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

/**
 * The Main window field.
 */
let mainWindow = null

/**
 * Creates the main window and performs some tweaks on it.
 */
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 620,
		show: false,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
	})

	mainWindow.loadFile('renderer/index.html')
	mainWindow.maximize()
	mainWindow.show()
}

app.whenReady().then(() => {
	ipcMain.handle('get:ports', getAvailablePorts)
	ipcMain.on('device-open', openDevice)
	ipcMain.on('device-selected', openDevice)
	
	createWindow()
})

/* Remote Control */

const colors = {
	'V': 'green',
	'A': 'yellow',
	'B': 'blue'
}

const actions = {
	'P': 'pressed',
	'R': 'released'
}

let esp32

let prevMessage = {
	color: '',
	action: ''
}

// Ports logic

/**
 * List all the available devices that can be opened via serial communication.
 */
async function getAvailablePorts() {
	const ports = await SerialPort.list()
	
	if (ports.length === 0) {
		return "No devices"
	}
	
	return ports
}

/**
 * Opens a serial communication at the desired path.
 * @param event Received from the caller.
 * @param path The selected port to be opened.
 */
function openDevice(event, path) {
	console.log(`Selected port: ${path}`)

	esp32 = new SerialPort({
		path: path,
		baudRate: 115200
	}, err => {
		if (err) {
			console.log(err)
		} else {
			console.log('openDevice(): No errors detected')
			
			esp32.write('')
			const parser = esp32.pipe(new ReadlineParser())

			parser.on('data', getDeviceMessage)
			parser.on('error', getDeviceError)
		}
	})
}

/**
 * Reads which button of the control was pushed down or released and its color.
 * @param data A string that contains two characters one for the color and one for the action.
 */
function getDeviceMessage(data) {
	console.log(data)
	
	let message = data.toString().trim()
	
	let color = colors[message.charAt(0)]
	let action = actions[message.charAt(1)]
	
	if (!(prevMessage.color === color && prevMessage.action === action)) {
		console.log(color, action)
		
		mainWindow.webContents.send(`button:${action}`, color)
		
		prevMessage.color = color
		prevMessage.action = action
	}
	
	setTimeout(() => {
		prevMessage.color = ' '
		prevMessage.action = ' '
	}, 500)
}

/**
 * Displays an error in the console given an error object.
 * @param err The error object to be analyzed.
 */
function getDeviceError(err) {
	if (err.disconnected == true) {
		console.log('Device was disconnected')
	}
}
