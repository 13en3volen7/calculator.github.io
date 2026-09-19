function initialize() {
    const containerDiv = document.querySelector("#container");

    attachButtonEvents(containerDiv);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, op) {
    switch (op) {
        case "+": return `${add(a, b)}`;
        case "-": return `${subtract(a, b)}`;
        case "*": return `${multiply(a, b)}`;
        case "/": return `${divide(a, b)}`;
    }
}

function attachButtonEvents(containerDiv) {
    const optionsDiv = containerDiv.querySelector(".options");
    let firstNumber = "";
    let secondNumber = "";
    let operatorInner = "";
    
    function nameToSymbol(operatorName, ui = true) {
        switch (operatorName) {
            case "plus": return "+";
            case "minus": return ui ? "−" : "-";
            case "multiply": return ui ? "×" : "*";
            case "divide": return ui ? "÷" : "/";
            case "equal": return "=";
        }
    }

    function updateNumberVariables(firstNumberCallback, secondNumberCallback, force = false) {
        if (!force) {
            let firstNumberNotInputted = !operatorInner;
            if (firstNumberNotInputted) {
                firstNumber = firstNumberCallback();
            } else {
                secondNumber = secondNumberCallback();
            }
        } else {
            firstNumber = firstNumberCallback();
            secondNumber = secondNumberCallback();
        }
    }

    optionsDiv.addEventListener("click", function (event) {
        const target = event.target;
        const containerDiv = target.closest("#container");
        const displayDiv = containerDiv.querySelector(".display");
        const contentDiv = displayDiv.firstElementChild;
        const className = target.className;

        function wipeData() {
            firstNumber = "";
            secondNumber = "";
            operatorInner = "";
            contentDiv.textContent = "";
        }

        if (className.startsWith("number")) {
            if (operatorInner === "=") {
                wipeData();
            }
            const number = className.slice(-1);
            contentDiv.textContent += number;
            updateNumberVariables(() => firstNumber + number, () => secondNumber + number);
        } else if (className.startsWith("operator")) {
            console.log(firstNumber, secondNumber, operatorInner);
            if (firstNumber && secondNumber && operatorInner) {
                const result = operate(+firstNumber, +secondNumber, operatorInner);
                updateNumberVariables(() => result, () => "", true);
                contentDiv.textContent = result;
            }

            const operatorName = className.split(" ").at(-1);
            const operatorUI = nameToSymbol(operatorName);
            operatorInner = nameToSymbol(operatorName, false);
            if (operatorInner !== "=") {
                if (!contentDiv.textContent.length) {
                    operatorInner = "";
                    updateNumberVariables(() => firstNumber + operatorInner, () => {});
                }
                contentDiv.textContent += operatorUI;
            }
        } else {
            switch (className) {
                case "dot":
                    contentDiv.textContent += ".";
                    updateNumberVariables(() => firstNumber + ".", () => secondNumber + ".");
                    break;
                
                case "clear-entry":
                    contentDiv.textContent = contentDiv.textContent.slice(0, -1);
                    updateNumberVariables(() => firstNumber.slice(0, -1), () => secondNumber.slice(0, -1));
                    break;

                case "all-clear":
                    wipeData();
                    break;
            }
        }
    });
}

initialize();