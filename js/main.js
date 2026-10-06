// Elementos del DOM
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

const btnModeCalc = document.getElementById('mode-calc');
const btnModeGraph = document.getElementById('mode-graph');
const displayCalc = document.getElementById('display-calc');
const displayGraph = document.getElementById('display-graph');

const screen = document.getElementById('screen');
const historyScreen = document.getElementById('history');
const graphInput = document.getElementById('graph-input');
const botones = document.querySelectorAll('.btn');

// Estado de la Calculadora
let currentInput = "";
let isGraphMode = false;

// ==========================================
// 1. MANEJO DE TEMAS (DARK / LIGHT)
// ==========================================
// Cargar tema guardado en localStorage si existe
if (localStorage.getItem('theme') === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
});

// ==========================================
// 2. MANEJO DE MODOS (CALCULADORA / GRÁFICA)
// ==========================================
btnModeCalc.addEventListener('click', () => {
    isGraphMode = false;
    btnModeCalc.classList.add('active');
    btnModeGraph.classList.remove('active');
    
    displayCalc.classList.add('active-display');
    displayGraph.classList.remove('active-display');
});

btnModeGraph.addEventListener('click', () => {
    isGraphMode = true;
    btnModeGraph.classList.add('active');
    btnModeCalc.classList.remove('active');
    
    displayGraph.classList.add('active-display');
    displayCalc.classList.remove('active-display');

    // Intentar renderizar si hay una ecuación válida con X, si no, dibujar un ejemplo
    if (currentInput.includes('x')) {
        renderPlot(currentInput);
    } else {
        renderPlot("x^2"); // Parábola de ejemplo
    }
});

// ==========================================
// 3. MOTOR MATEMÁTICO Y GRÁFICADOR
// ==========================================

// Función para actualizar la interfaz visual de las pantallas
function updateScreen() {
    if (currentInput === "") {
        screen.textContent = "0";
        graphInput.value = "";
    } else {
        screen.textContent = currentInput;
        graphInput.value = currentInput;
    }
}

// Procesar el cálculo matemático usando Math.js
function calculate() {
    if (currentInput === "") return;
    
    try {
        // math.evaluate previene errores de inyección que tendría eval()
        // y tiene un soporte avanzado para matemáticas (pi, e, log, sin...)
        let result = math.evaluate(currentInput);
        
        // Formatear para evitar precisiones raras como 0.30000000000004
        let formatResult = math.format(result, { precision: 14 });
        
        historyScreen.textContent = currentInput + " =";
        currentInput = formatResult.toString();
        updateScreen();
    } catch (error) {
        historyScreen.textContent = currentInput;
        screen.textContent = "Error";
        currentInput = ""; // Reiniciamos si hay error
    }
}

// Pintar la gráfica usando function-plot
function renderPlot(expression) {
    try {
        const width = document.getElementById('plot-container').clientWidth;
        const height = document.getElementById('plot-container').clientHeight;

        functionPlot({
            target: '#plot-container',
            width: width,
            height: height,
            grid: true,
            data: [{
                fn: expression,
                color: '#8b5cf6' // Color purple accent
            }]
        });
        graphInput.value = expression;
    } catch (e) {
        console.warn("La ecuación introducida aún no es válida o está incompleta para ser graficada.");
    }
}

function plotCurrent() {
    if (currentInput === "") return;
    if (!isGraphMode) {
        btnModeGraph.click(); // Cambiar automáticamente al modo gráfica
    } else {
        renderPlot(currentInput);
    }
}

// ==========================================
// 4. LÓGICA DE BOTONES Y ENTRADA
// ==========================================
function handleInput(val, id) {
    // Si la pantalla dice "Error", reiniciarla al tipear
    if (screen.textContent === "Error") {
        currentInput = "";
        updateScreen();
    }

    if (id === "c") {
        currentInput = "";
        historyScreen.textContent = "";
        updateScreen();
        return;
    }

    if (id === "borrar") {
        currentInput = currentInput.slice(0, -1);
        updateScreen();
        return;
    }

    if (id === "igual") {
        calculate();
        return;
    }

    if (id === "btn-plot") {
        plotCurrent();
        return;
    }

    // Agregar el valor del botón al input
    if (currentInput === "0" && val !== ".") {
        currentInput = val; // Sobreescribir el 0 inicial
    } else {
        currentInput += val;
    }
    
    updateScreen();
}

// Escuchar los clicks en todos los botones
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const val = boton.getAttribute('data-val');
        const id = boton.id;
        handleInput(val, id);
    });
});

// ==========================================
// 5. ATAJOS DE TECLADO COMPLETOS
// ==========================================
document.addEventListener("keydown", (event) => {
    const key = event.key;
    let botonCorrespondiente = null;

    // Teclas directas: números, operadores, y letras específicas
    const teclasValidas = ["0","1","2","3","4","5","6","7","8","9", ".", "+", "-", "*", "/", "(", ")", "^", "x", "e", "p"];
    
    if (teclasValidas.includes(key.toLowerCase())) {
        let mappedKey = key.toLowerCase();
        if (mappedKey === "p") mappedKey = "pi"; // 'p' para pi
        
        handleInput(mappedKey, null);
        botonCorrespondiente = Array.from(botones).find(b => b.getAttribute('data-val') === mappedKey);
    } 
    else if (key === "Enter" || key === "=") {
        handleInput(null, "igual");
        botonCorrespondiente = document.getElementById("igual");
        event.preventDefault(); // Prevenir que "Enter" active el último botón clickeado
    } 
    else if (key === "Backspace") {
        handleInput(null, "borrar");
        botonCorrespondiente = document.getElementById("borrar");
    } 
    else if (key === "Escape" || key === "c" || key === "C") {
        handleInput(null, "c");
        botonCorrespondiente = document.getElementById("c");
    }

    // Aplicar el efecto visual (hover-temporal)
    if (botonCorrespondiente) {
        botonCorrespondiente.classList.add("hover-temporal");
        setTimeout(() => {
            botonCorrespondiente.classList.remove("hover-temporal");
        }, 150);
    }
});
