const divMain = document.querySelector('.main')
const divGame = document.querySelector('.game')

document.querySelectorAll('.category').forEach(divCat => {
	divCat.addEventListener('click', () => {
		divMain.classList.add('hidden')
		divGame.classList.remove('hidden')
		startGame(divCat.id)
	})
})

document.querySelector('button#return-main-menu').addEventListener('click', () => {
	divMain.classList.remove('hidden')
	divGame.classList.add('hidden')
	initialGameState()
})
