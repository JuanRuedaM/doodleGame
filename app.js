// document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const doodler = document.createElement('div')

  let doodlerLeftSpace = 10
  let startPoint = 150 
  let doodlerBottomSpace = startPoint
  let platformCount = 5
  let platforms = []
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId
  let score = 0

  const createDoodler = () => {
    grid.appendChild(doodler)
    doodler.classList.add('doodler')
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px'
    doodler.style.bottom = doodlerBottomSpace + 'px'
  }

  class Platform {
    constructor(newPlatBottom){
      this.bottom = newPlatBottom
      this.left = Math.random() * 315
      this.visual = document.createElement('div')

      const visual = this.visual
      visual.classList.add('platform')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'

      grid.appendChild(visual)
    }
  }

  const createPlatforms = () => {
    for(i = 0; i < platformCount; i++){
      let platGap = 600 / platformCount
      let newPlatBottom = 200 + i * platGap
      let newPlatform = new Platform(newPlatBottom)
      platforms.push(newPlatform)
      //? console.log(`🚀 ~ createPlatforms ~ platforms`, platforms)
    }
  }

  const movePlatforms = () => {
    if(doodlerBottomSpace > 200){
      platforms.forEach(platform => {
        platform.bottom -= 4
        let visual = platform.visual
        visual.style.bottom = platform.bottom + 'px'

        if(platform.bottom < 10){
          let firstPlatform = platforms[0].visual
          firstPlatform.classList.remove('platform')
          platforms.shift()
          score++
          // console.log(platforms)

          let newPlatform = new Platform(600)
          platforms.push(newPlatform)
        }
      })
    }
  }

  const jump = () => {
    clearInterval(downTimerId)
    isJumping = true

    upTimerId = setInterval(() => {
      doodlerBottomSpace += 5
      doodler.style.bottom = doodlerBottomSpace + 'px'

      if(doodlerBottomSpace > startPoint + 200){
        fall()
      }
    }, 10)
  }

  const fall = () => {
    clearInterval(upTimerId)
    isJumping = false

    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5
      doodler.style.bottom = doodlerBottomSpace + 'px'

      if(doodlerBottomSpace <= 0){
        gameOver()
      }

      platforms.forEach(platform => {
        if(
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          (doodlerLeftSpace + 60) >= platform.left &&
          doodlerLeftSpace <= (platform.left + 85) &&
          !isJumping
        ){
          // console.log('landing')
          startPoint = doodlerBottomSpace
          jump()
        }
      })

    }, 20)
  }

  const gameOver = () => {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = `
      <h1>SCORE</h1>
      <p>${score}</p>
    ` 
    const againBtn = document.createElement('button')
    grid.appendChild(againBtn)
    againBtn.innerHTML = 'TRY AGAIN'
    againBtn.addEventListener(('click'), () => {
      // console.log('clicked')
      start()   
    })


    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  const control = (e) => {
    if(e.key === 'ArrowLeft'){
      moveLeft()
    } else if(e.key === 'ArrowRight'){
      moveRight()
    }
    // if(e.key === 'ArrowUp'){
    //   moveUp()
    // }
    else {
      moveUp()
    }
  }

  const moveLeft = () => {
    doodler.style.backgroundImage = "url('../public/doodle-left.png')"

    if(isGoingRight) {
      clearInterval(rightTimerId)
      isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(() => {
      if(doodlerLeftSpace >= 0){
        doodlerLeftSpace -= 2
        doodler.style.left = doodlerLeftSpace + 'px'
      }else{
        moveRight()
      }
    }, 30)
  }

  const moveRight = () => {
    doodler.style.backgroundImage = "url('../public/doodle-right.png')"

    if(isGoingLeft) {
      clearInterval(leftTimerId)
      isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(() => {
      if(doodlerLeftSpace <= 340){
        doodlerLeftSpace += 2
        doodler.style.left = doodlerLeftSpace + 'px'
      }else{
        moveLeft()
      }
    }, 30)
  }

  const moveUp = () => {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(rightTimerId)
    clearInterval(leftTimerId)
  }

  const start = () => {
    grid.innerHTML = ''
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    doodlerLeftSpace = 10
    startPoint = 150 
    doodlerBottomSpace = startPoint
    platformCount = 5
    platforms = []
    upTimerId
    downTimerId
    isJumping = true
    isGoingLeft = false
    isGoingRight = false
    leftTimerId
    rightTimerId
    score = 0
    createPlatforms()
    createDoodler()
    setInterval(movePlatforms, 30)
    jump()
    document.addEventListener('keyup', control)
  }

  const startBtn = document.createElement('button')
  grid.appendChild(startBtn)
  startBtn.innerHTML = 'START'
  startBtn.addEventListener(('click'), () => {
    // console.log('clicked')
    start()   
  })
// })