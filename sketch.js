/*
Week 4 — Side Quest 4
Example 5: Blob Platformer (JSON + Classes)

Course: GBDA 302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This file orchestrates the platformer system:
- loads level data from JSON in preload()
- creates WorldLevel instances from JSON data
- creates and updates a BlobPlayer
- dynamically draws platforms using loops
- automatically advances to the next level when the current one is completed

This builds on earlier grid and level examples by separating data (JSON),
world logic (WorldLevel), and player behavior (BlobPlayer) into reusable classes.
*/
let data; // raw JSON level data
let levelIndex = 0;

let world; // WorldLevel instance (current level)
let player; // BlobPlayer instance

function preload() {
  // Load the level data before setup runs
  data = loadJSON("levels.json");
}

function setup() {
  // Create the player once (it will be respawned per level)
  player = new BlobPlayer();

  // Load the first level
  loadLevel(0);

  // Shared style
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  // Draw world
  world.drawWorld();

  // Update + draw player
  player.update(world.platforms);
  player.draw(world.theme.blob);

  // ✅ Door-based automatic level transition
  if (world.door && playerTouchesDoor(player, world.door)) {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }

  // HUD
  fill(0);
  text(world.name, 10, 18);
  text("Move: A/D or ←/→ • Jump: Space/W/↑", 10, 36);
}

function keyPressed() {
  // Jump controls
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  // Optional manual level cycling (debug / instructor-friendly)
  if (key === "n" || key === "N") {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }
}

/*
Check overlap between the blob player (circle)
and the door (rectangle)
*/
function playerTouchesDoor(player, door) {
  return (
    player.x + player.r > door.x &&
    player.x - player.r < door.x + door.w &&
    player.y + player.r > door.y &&
    player.y - player.r < door.y + door.h
  );
}

/*
Load a level by index:
- create a WorldLevel instance from JSON
- resize canvas based on inferred geometry
- respawn player using level-defined settings
*/
function loadLevel(i) {
  levelIndex = i;

  // Create the world from JSON data
  world = new WorldLevel(data.levels[levelIndex]);

  // Fit canvas to world geometry
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  // Respawn player at level start
  player.spawnFromLevel(world);
}
