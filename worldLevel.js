/*
WorldLevel.js — Example 5 (Side Quest 4)

WorldLevel wraps ONE level object from levels.json and provides:
- Theme colours (background / platform / blob)
- Physics parameters that influence the player (gravity, jump velocity)
- Spawn position for the player (start)
- Optional door data for level progression
- An array of Platform instances
- Helpers to size the canvas based on level geometry

This follows the responsibilities of the original blob sketch:
- parse JSON
- map platform arrays using loops
- apply theme + physics
- infer canvas size from data

Expected JSON shape for each level:
{
  "name": "Intro Steps",
  "gravity": 0.65,
  "jumpV": -11.0,
  "theme": { "bg":"...", "platform":"...", "blob":"..." },
  "start": { "x":80, "y":220, "r":26 },
  "door": { "x":580, "y":280, "w":30, "h":40 },
  "platforms": [ {x,y,w,h}, ... ]
}
*/

class WorldLevel {
  constructor(levelJson) {
    // Label for HUD
    this.name = levelJson.name || "Level";

    // Theme defaults + JSON overrides
    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme || {},
    );

    // Physics parameters (read by BlobPlayer)
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Player spawn data
    this.start = {
      x: levelJson.start?.x ?? 80,
      y: levelJson.start?.y ?? 180,
      r: levelJson.start?.r ?? 26,
    };

    // Optional door for level completion
    this.door = levelJson.door || null;

    // Convert platform data → Platform objects (loop-based)
    this.platforms = (levelJson.platforms || []).map((p) => new Platform(p));
  }

  // Infer canvas width from platform geometry
  inferWidth(defaultW = 640) {
    if (!this.platforms.length) return defaultW;
    return max(this.platforms.map((p) => p.x + p.w));
  }

  // Infer canvas height from platform geometry
  inferHeight(defaultH = 360) {
    if (!this.platforms.length) return defaultH;
    return max(this.platforms.map((p) => p.y + p.h));
  }

  /*
  Draw the world only:
  - background
  - platforms
  - door (if present)

  Player draws itself separately.
  */
  drawWorld() {
    // Subtle vertical gradient background
    for (let y = 0; y < height; y++) {
      const t = map(y, 0, height, 0, 1);
      const c = lerpColor(color("#EAF2FF"), color(this.theme.bg), t);
      stroke(c);
      line(0, y, width, y);
    }
    noStroke();

    // Platforms
    for (const p of this.platforms) {
      p.draw(color(this.theme.platform));
    }

    // Door (goal)
    if (this.door) {
      // Door body
      fill(120, 80, 40);
      rect(this.door.x, this.door.y, this.door.w, this.door.h, 4);

      // Door glow / outline
      noFill();
      stroke(255, 200, 0);
      rect(
        this.door.x - 2,
        this.door.y - 2,
        this.door.w + 4,
        this.door.h + 4,
        6,
      );
      noStroke();
    }
  }
}
