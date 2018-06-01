var clientContext = {lastFrameTimestamp:0};

function run_client(canvas) {
    clientContext.canvas = canvas;
    clientContext.canvasCtx = canvas.getContext("2d");
    clientContext.starSystem = createStarSystem();

    requestAnimationFrame(mainLoop);
};

function createStarSystem() {
    var planets = [];
    planet01_img = new Image;
    planet01_img.src = "planet01.png";
    planets.push(new Planet({}, 10, [300, 0], [0, -200], 5, planet01_img));

    var starImage = new Image();
    starImage.src = "star.png";
    var starSystem = new StarSystem(starImage);
    starSystem.planets = planets;
    starSystem.center = [clientContext.canvas.width/2, clientContext.canvas.height/2];

    return starSystem;
};

function mainLoop(timestamp) {
    delta = 0.001 * (timestamp - clientContext.lastFrameTimestamp);
    clientContext.lastFrameTimestamp = timestamp;
    document.getElementById("fps").innerHTML = (1/delta).toFixed(2) + " FPS";

    if(window.innerWidth > 500) {
        clientContext.canvas.width  = window.innerWidth;
    }
    else {
        clientContext.canvas.width = 500;
    }
    if(window.innerHeight*0.8 > 500) {
        clientContext.canvas.height = window.innerHeight*0.8;
    }
    else {
        clientContext.canvas.height
    }

    clientContext.canvasCtx.fillStyle="black";
    clientContext.canvasCtx.fillRect(0, 0, clientContext.canvas.width, clientContext.canvas.height);

    updateStarSystem(delta);
    renderStarSystem();
    requestAnimationFrame(mainLoop);
}


function Planet(stock, diameter, pos, velocity, rotationSpeed, image) {
    this.lightOverlay = new Image;
    this.lightOverlay.src = "light.png"

    this.stock = stock;
    this.diameter = diameter;
    this.pos = pos;
    this.velocity = velocity;
    this.rotationSpeed = rotationSpeed;
    this.rotation = 0;
    this.image = image;

    this.update = function (delta) {
        var G = 20000000;
        var vx = this.velocity[0];
        var vy = this.velocity[1];
        var r_sq = this.pos[0]*this.pos[0] + this.pos[1]*this.pos[1];
        var r = Math.sqrt(r_sq);
        var dx = this.pos[0] / r;
        var dy = this.pos[1] / r;
        var ax = -dx*G/r_sq;
        var ay = -dy*G/r_sq;
        this.velocity = [vx+delta*ax, vy+delta*ay];
        this.pos = [this.pos[0] + delta*this.velocity[0], this.pos[1] + delta*this.velocity[1]];

        dRotation = delta*rotationSpeed;
        this.rotation += dRotation;
    };
};

function StarSystem(starSprite) {
    this.starImage = starSprite;
    this.planets = [];
    this.ships = [];
    this.center = [0, 0];
};

function renderStarSystem() {
    var ctx = clientContext.canvasCtx;
    var center = [clientContext.canvas.width/2, clientContext.canvas.height/2];

    ctx.save();
    ctx.translate(center[0], center[1]);
    ctx.drawImage(clientContext.starSystem.starImage, -clientContext.starSystem.starImage.width/2, -clientContext.starSystem.starImage.height/2);
    ctx.restore();

    for(var i in clientContext.starSystem.planets) {
        planet = clientContext.starSystem.planets[i];
        renderPlanet(planet, center);
    }
};


function updateStarSystem(delta) {
    for(i in clientContext.starSystem.planets) {
        clientContext.starSystem.planets[i].update(delta);
    }
};

function renderPlanet(planet, center) {
    var ctx = clientContext.canvasCtx;

    var pos = planet.pos;

    ctx.save();
    ctx.translate(center[0], center[1]);
    ctx.translate(pos[0], pos[1]);
    ctx.rotate(-planet.rotation);
    ctx.drawImage(planet.image, -planet.image.width/2, -planet.image.height/2);
    ctx.restore();

    // Light overlay
    ctx.save();
    ctx.translate(center[0], center[1]);
    ctx.translate(pos[0], pos[1]);
    ctx.rotate(planet.angle);
    ctx.drawImage(planet.lightOverlay, -planet.lightOverlay.width/2, -planet.lightOverlay.height/2);
    ctx.restore();
};
