/*
WorldLevel.js (Example 5)

WorldLevel wraps ONE level object from levels.json and provides:
- Theme colours (background/platform/blob)
- Physics parameters that influence the player (gravity, jump velocity)
- Spawn position for the player (start)
- An array of Platform instances
- A couple of helpers to size the canvas to fit the geometry

This is directly inspired by your original blob sketch’s responsibilities: 
- parse JSON
- map platforms array
- apply theme + physics
- infer canvas size

Expected JSON shape for each level (from your provided file): 
{
  "name": "Intro Steps",
  "gravity": 0.65,
  "jumpV": -11.0,
  "theme": { "bg":"...", "platform":"...", "blob":"..." },
  "start": { "x":80, "y":220, "r":26 },
  "platforms": [ {x,y,w,h}, ... ]
}
*/
class WorldLevel {
  constructor(levelJson) {
    // A readable label for HUD.
    this.name = levelJson.name || "Level";

    // Theme defaults + override with JSON.
    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme || {},
    );

    // Physics knobs (the blob player will read these).
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Player spawn data.
    this.start = {
      x: levelJson.start?.x ?? 80,
      y: levelJson.start?.y ?? 180,
      r: levelJson.start?.r ?? 26,
    };

    // Door data (optional)
    this.door = levelJson.door || null;

    // Convert raw platform objects into Platform instances.
    this.platforms = (levelJson.platforms || []).map((p) => new Platform(p));
  }

  inferWidth(defaultW = 640) {
    if (!this.platforms.length) return defaultW;
    return max(this.platforms.map((p) => p.x + p.w));
  }

  inferHeight(defaultH = 360) {
    if (!this.platforms.length) return defaultH;
    return max(this.platforms.map((p) => p.y + p.h));
  }

  drawWorld() {
    background(color(this.theme.bg));

    // Platforms
    for (const p of this.platforms) {
      p.draw(color(this.theme.platform));
    }

    // Door
    if (this.door) {
      fill(120, 80, 40);
      rect(this.door.x, this.door.y, this.door.w, this.door.h, 4);

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
