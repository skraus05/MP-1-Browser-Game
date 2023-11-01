/* set project up
create controlled player
create enemy players (invaders)
create bullets
shoot invaders
have invaders shoot back
invader destruction
score
*/

let scoring = document.querySelector('#score')
let canvas = document.querySelector('canvas') //setting up project canvas
let context = canvas.getContext('2d')

//setting up project canvas

class userPlayer { //creating user player
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.opacity = 1
        let image = new Image()
        image.src = './assets/dddd.png'
        image.onload = () => {
            this.image = image
            this.width = image.width * 0.10;
            this.height = image.height * 0.10;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 30
            }
        }

    }
    draw() {
        //context.fillStyle = 'green'
        //context.fillRect(this.position.x, this.position.y, this.width, this.height)
        context.save()
        context.globalAlpha = this.opacity
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        context.restore()
    }

    update() {
        if (this.image) {
        this.draw()
        this.position.x += this.velocity.x
        }
    }
}

class Bullet {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 3
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'yellow'
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Boom {
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        context.save()
        context.globalAlpha = this.opacity
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = this.color
        context.fill()
        context.closePath()
        context.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades)
        this.opacity -= 0.01
    }
}

class enemyBullet {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 5
    }

    draw() {
        context.fillStyle = 'white'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Enemy { //creating space invaders
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }

        let image = new Image()
        image.src = './assets/reallyscaryenemy.jpeg'
        image.onload = () => {
            this.image = image
            this.width = image.width * 0.20;
            this.height = image.height * 0.20;
            this.position = {
                x: position.x,
                y: position.y
            }
        }

    }
    draw() {
        //context.fillStyle = 'green'
        //context.fillRect(this.position.x, this.position.y, this.width, this.height)
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if (this.image) {
        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
        }
    }

    fire(enemyBullets) {
        enemyBullets.push(new enemyBullet({
            position: {
                x: this.position.x +this.width / 2,
                y: this.position.y +this.height
            },
            velocity: {
                x: 0,
                y: 4
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0    
        }

        this.velocity = {
            x: 2.5   ,
            y: 0
        }

        this.enemies = []
        let columns = Math.floor(Math.random() * 10 + 5)
        let rows = Math.floor(Math.random() * 5 + 2)
        this.width = columns * 82
        for (let i = 0; i < columns; i++) {
            for (let y = 0; y < rows; y++) {
            this.enemies.push(new Enemy({position: {
                x: i * 82,
                y: y * 82
            }}))
        }
    }
}

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x +this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 82
        }
    }
}

let player = new userPlayer()
let bullets = []
let grids = []
let enemyBullets = []
let booms = []
let buttons = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let sections = 0
let numbers = Math.floor(Math.random() * 500) + 500
let game = {
    over: false,
    active: true
}
 let score = 0


function explosion({object, color, fades}) {
    for (let i = 0; i < 15; i++) {
        booms.push(
            new Boom({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                radius: Math.random() * 3,
                color: color || 'white',
                fades: fades || false,
            })
        )
    }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    booms.forEach((boom, p) => {
        if (boom.opacity <= 0) {
            setTimeout(() => {
                booms.splice(p, 1)
            }, 0)
        } else {
            boom.opacity -= 0.01;
            boom.update()
        }
    })
    enemyBullets.forEach((enemyBullet, index) => {
        enemyBullet.update()
    if (player.opacity > 0 &&
        enemyBullet.position.y + enemyBullet.height >= player.position.y &&
        enemyBullet.position.x + enemyBullet.width >= player.position.x &&
        enemyBullet.position.x <= player.position.x + player.width) {
        setTimeout(() => {
        enemyBullets.splice(index, 1)
        player.opacity = 0;
        game.over = true;
        }, 0)
        setTimeout(() => {
        game.active = false;
        }, 1200)
        explosion({
            object: player,
            color: 'white',
            fades: true
        });
    }
});

    bullets.forEach(bullet => {
        bullet.update()
    })

    grids.forEach((grid, gridIndex) => {
        grid.update();
        if (sections % 100 === 0 && grid.enemies.length > 0) {
            grid.enemies[Math.floor(Math.random() * grid.enemies.length)].fire(enemyBullets)
        }
        grid.enemies.forEach((Enemy, z) => {
            Enemy.update({ velocity: grid.velocity });
    
            bullets.forEach((bullet, b) => {
                if (
                    bullet.position.y - bullet.radius <= Enemy.position.y + Enemy.height &&
                    bullet.position.x + bullet.radius >= Enemy.position.x &&
                    bullet.position.x - bullet.radius <= Enemy.position.x + Enemy.width &&
                    bullet.position.y + bullet.radius >= Enemy.position.y
                ) {
                    score += 100
                    scoring.innerHTML = score
                    explosion({
                        object: Enemy,
                        fades: true
                    })
                    grid.enemies.splice(z, 1);
                    bullets.splice(b, 1);

                    if (grid.enemies.length > 0) {
                        let firstEnemy = grid.enemies[0]
                        let lastEnemy = grid.enemies[grid.enemies.length - 1]

                        grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                        grid.position.x = firstEnemy.position.x
                    } else {
                        grids.splice(gridIndex, 1)
                    }
                }
            });
        });
    });

    if (buttons.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -7
    } else if (buttons.ArrowRight.pressed && player.position.x +player.width <= canvas.width) {
        player.velocity.x = 7
    } else {
        player.velocity.x = 0
    }

    if (sections % numbers === 0) {
        grids.push(new Grid())
        numbers = Math.floor(Math.random() * 500) + 500
        sections = 0   
    }

    sections++
}
animate()

addEventListener('keydown', ({key}) => {
    if (game.over) return
    switch (key) {
        case 'ArrowLeft':
            console.log('left')
            buttons.ArrowLeft.pressed = true
            break
        case 'ArrowRight':
            console.log('right')
            buttons.ArrowRight.pressed = true
            break
        case ' ':
            console.log('space')
            bullets.push(new Bullet({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                } ,
                velocity: {
                    x:0,
                    y: -7
                }
            }))   
            break 
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            console.log('left')
            buttons.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            console.log('right')
            buttons.ArrowRight.pressed = false
            break
        case ' ':
            console.log('space')    
    }
})