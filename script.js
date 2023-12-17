const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const print = (t) => console.log(t)

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(vec2) {
        this.x += vec2.x
        this.y += vec2.y
    }
    absSum() {
        return Math.abs(this.x + this.y)
    }
    mult(m) {
        this.x *= m
        this.y *= m
    }
    copy() {
        return new Vector(this.x, this.y)
    }
}

function CM(value) {
    if (value < 0) {
        return 0
    }
    if (value > 255) {
        return 255
    }
    return value
}

function getElectricForce(charge, point, charge2 = 1) {
    var F = -charge.q * charge2 * 1000 / ((charge.x - point.x) ** 2 + (charge.y - point.y) ** 2)
    var x = F * (charge.x - point.x)
    var y = F * (charge.y - point.y)
    return new Vector(x, y)
}

class Point {
    constructor(x, y) {
        this.pos = new Vector(x, y)
        this.value = new Vector(0, 0)
        this.color = "black"
    }
    get x() { return this.pos.x }
    get y() { return this.pos.y }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.strokeStyle = this.color
        ctx.lineTo(this.x + this.value.x, this.y + this.value.y)
        ctx.stroke()
        ctx.closePath()
    }
    calculate() {
        var Force = new Vector(0, 0)
        for (var i in Electrics) {
            Force.add(getElectricForce(Electrics[i], this.pos))
        }
        var Fsum = Force.absSum()
        var R = CM(255 - Fsum * 2)
        var B = CM(Fsum * 3)
        this.color = `rgba(${R},0, ${B * 3}, 0.8)`
        this.value = Force
    }
}

class Charge {
    constructor(x, y, q, isMove = true) {
        this.isMove = isMove
        this.pos = new Vector(x, y)
        this.q = q
        this.vel = new Vector(0, 0)
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    move() {
        if(this.isMove == false){
            return
        }
        var Force = new Vector(0, 0)
        for (var i in Electrics) {
            var F = getElectricForce(Electrics[i], this.pos, this.q)

            if (isNaN(F.x) || isNaN(F.y)) {
                continue
            }
            Force.add(F)
        }

        Force.mult(0.0001)
        this.vel.add(Force)
        this.pos.add(this.vel)
        print(this.pos)
    }
    get x() { return this.pos.x }
    get y() { return this.pos.y }
}

const Points = []
const Electrics = [
    new Charge(0, 800, -2, false),
    new Charge(400, 400, -2, false),
    new Charge(520, 450, +1),
    new Charge(620, 300, +1),
]

for (var i = 0; i < 40; i++) {
    Points.push([])
    for (var j = 0; j < 40; j++) {
        Points[i].push(new Point(i * 20, j * 20))
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(255,255,255, 0.5)"
    for (var i = 0; i < 40; i++) {
        for (var j = 0; j < 40; j++) {
            Points[i][j].draw()
            Points[i][j].calculate()
        }
    }

    ctx.fillStyle = "rgba(255,255,0, 0.7)"
    for (var i in Electrics) {
        Electrics[i].draw()
        Electrics[i].move()
    }
    requestAnimationFrame(render)
}

render()