// neon border lines creation
let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("height", window.innerHeight - 4);
svg.setAttribute("width", window.innerWidth - 4);
let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", `M ${window.innerWidth / 2 - 340} ${window.innerHeight / 2} l 0 450 l 680 0 l 0 -900 l -680 0 z`);
svg.appendChild(path);
document.getElementById("neon_display").appendChild(svg);

let scoreboard = document.getElementById("scoreboard");
scoreboard.style.top = "100px";
scoreboard.style.left = `${(window.innerWidth / 2 - 340) - 400}px`;
scoreboard.innerHTML = `score  ${score}`;
