function type(text, speed = 20) {
    let i = 0;
    const interval = setInterval(() => {
      output.textContent += text[i++];
      if (i >= text.length) clearInterval(interval);
    }, speed);
  }

const input = document.getElementById("input");
const log = document.getElementById("log");
var isAuthenticated = false;

const menu = `
## Ministry Of Energy Production Database ##\n
`;

const nAuth = `
## MEPDB - User not authenticated
`

if (!isAuthenticated) {log.textContent = nAuth;}


input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    input.value = "";
    handleCommand(cmd);
  }
});

function print(line) {
    log.textContent = line;
}
function printm(line) {
    log.innerHTML += line;
}


function handleCommand(cmd) {
    if (!isAuthenticated) {
        switch (cmd) {
            case "0013.mep":
                isAuthenticated = true;
                print("User successfully authenticated. Welcome to the database.");
                printm(menu)
                break;
        }

    } else {
        switch (cmd) {
            case "dir":
                terminal.classList.add("expanded");
                print(menu)
                printm("<a href='../database/bsu0013.html'>../database/bsu0013</a> | 3.44kb \n");
        
                break;
            case "help":
                print(menu)
                printm("The database is currently under maintenance.\n");
                printm("dir - lists available entries \n");
                printm("clear - clears the terminal\n");
              break;
        
            case "clear":
              log.textContent = menu;
              return;
        
            default:
              log.textContent += "Unknown command.\n";
          }
        
    }

  output.scrollTop = output.scrollHeight;
}