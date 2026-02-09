/*
Week 4 — Example 5: Example 5: Blob Platformer (JSON + Classes)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This file orchestrates everything:
- load JSON in preload()
- create WorldLevel from JSON
- create BlobPlayer
- update + draw each frame
- handle input events (jump, optional next level)

This matches the structure of the original blob sketch from Week 2 but moves
details into classes.
*/

// Raw JSON data
let data;
let levelIndex = 0;

// Current level + player
let world;
let player;

function preload() {
  // Load level data before setup
  data = loadJSON("levels.json");
}

function setup() {
  // Create canvas (will be resized per level)
  createCanvas(640, 360);

  // Create player once
  player = new BlobPlayer();

  // Load first level
  loadLevel(0);

  // Shared styling
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  // 1) Draw the world (background + platforms + goal)
  world.drawWorld();

  // 2) Update and draw the player
  player.update(world.platforms);
  player.draw(world.theme.blob);

  // 3) HUD
  fill(0);
  text(world.name, 10, 18);
  text("Move: A/D or ←/→  •  Jump: Space/W/↑", 10, 36);

  // 4) Win condition: reach goal zone
  if (world.goal) {
    if (
      player.pos.x > world.goal.x &&
      player.pos.x < world.goal.x + world.goal.w &&
      player.pos.y > world.goal.y &&
      player.pos.y < world.goal.y + world.goal.h
    ) {
      const next = (levelIndex + 1) % data.levels.length;
      loadLevel(next);
    }
  }
}

function keyPressed() {
  // Jump controls
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  // Optional: manual level skip
  if (key === "n" || key === "N") {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }
}

/*
Load a level by index:
- Create WorldLevel from JSON
- Resize canvas to fit level geometry
- Respawn player using level settings
*/
function loadLevel(i) {
  levelIndex = i;

  // Create world from JSON
  world = new WorldLevel(data.levels[levelIndex]);

  // Resize canvas to fit platforms
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  // Respawn player
  player.spawnFromLevel(world);
}
