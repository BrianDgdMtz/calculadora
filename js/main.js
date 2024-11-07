const pantalla = document.querySelector(".pantalla");
const botones = document.querySelectorAll(".btn");

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;

        if (boton.id === "c") {
            pantalla.textContent = "0"
            return
        }

        if (boton.id === "borrar") {
            if (pantalla.textContent.length === 1 || pantalla.textContent === "Error!") {
                pantalla.textContent = "0";
            } else {
                pantalla.textContent = pantalla.textContent.slice(0, -1)
            }
            return;
        }

        if (boton.id === "igual") {
            try {
                pantalla.textContent = eval(pantalla.textContent)
            } catch {
                pantalla.textContent = "Error!";
            }
            return;
        }

        if (pantalla.textContent === "0" || pantalla.textContent === "Error!") {
            pantalla.textContent = botonApretado;
        } else {
            pantalla.textContent += botonApretado
        }
    })
})

// Función para manejar atajos de teclado
document.addEventListener("keydown", (event) => {
    const key = event.key;
    let botonCorrespondiente;

    // Identificar el botón correspondiente a la tecla presionada
    if (!isNaN(key) || key === ".") {
        botonCorrespondiente = Array.from(botones).find(boton => boton.textContent === key);
        if (pantalla.textContent === "0" || pantalla.textContent === "Error!") {
            pantalla.textContent = key;
        } else {
            pantalla.textContent += key;
        }
    } else if (key === "Enter") {
        botonCorrespondiente = document.querySelector("#igual");
        try {
            pantalla.textContent = eval(pantalla.textContent);
        } catch {
            pantalla.textContent = "Error!";
        }
    } else if (key === "Backspace") {
        botonCorrespondiente = document.querySelector("#borrar");
        if (pantalla.textContent.length === 1 || pantalla.textContent === "Error!") {
            pantalla.textContent = "0";
        } else {
            pantalla.textContent = pantalla.textContent.slice(0, -1);
        }
    } else if (key === "c" || key === "C") {
        botonCorrespondiente = document.querySelector("#c");
        pantalla.textContent = "0";
    } else if (key === "+") {
        botonCorrespondiente = document.querySelector("#sumar");
        pantalla.textContent += "+";
    } else if (key === "-") {
        botonCorrespondiente = document.querySelector("#restar");
        pantalla.textContent += "-";
    } else if (key === "*") {
        botonCorrespondiente = document.querySelector("#multiplicar");
        pantalla.textContent += "*";
    } else if (key === "/") {
        botonCorrespondiente = document.querySelector("#dividir");
        pantalla.textContent += "/";
    }

    // Aplicar el estilo de hover si se encuentra el botón
    if (botonCorrespondiente) {
        botonCorrespondiente.classList.add("hover-temporal");
        setTimeout(() => {
            botonCorrespondiente.classList.remove("hover-temporal");
        }, 200); // Remover la clase después de 200ms
    }
});
