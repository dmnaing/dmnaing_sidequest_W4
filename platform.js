/*
Platform.js (Example 5)

A Platform is a single axis-aligned rectangle in the world.

Why a class for something "simple"?
- It standardizes the shape of platform data.
- It makes later upgrades easy (e.g., moving platforms, icy platforms, spikes).
- It keeps drawing code in the object that knows what it is.

In JSON, platforms are stored like:
{ "x": 0, "y": 324, "w": 640, "h": 36 } 
*/

class Platform {
  constructor({ x, y, w, h }) {
    // Position is the top-left corner.
    this.x = x;
    this.y = y;

    // Size (width/height).
    this.w = w;
    this.h = h;
  }

  draw(fillColor) {
    // Main platform body
    fill(fillColor);
    rect(this.x, this.y, this.w, this.h, 6);

    // Subtle top highlight to add depth
    fill(255, 255, 255, 60);
    rect(this.x, this.y, this.w, 4, 6);

    // Subtle shadow under platform
    fill(0, 0, 0, 40);
    rect(this.x, this.y + this.h - 4, this.w, 4, 6);
  }
}
