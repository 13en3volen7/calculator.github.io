function initialize() {
    const containerDiv = document.querySelector("#container");

    attachButtonEvents(containerDiv);
}

function isNumeric(string) {
    return typeof string === "string" && !isNaN(string) && !isNaN(parseFloat(string));
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
    if (b === 0) {
        return "MATH ERROR";
    }
    return a / b;
}

function operate(a, b, op) {
    if (!isNumeric(a) || !isNumeric(b)) {
        return "SYNTAX ERROR";
    }
    a = +a;
    b = +b;
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
    let lastOperator = "";
    
    function nameToSymbol(operatorName, ui = true) {
        switch (operatorName) {
            case "plus": return "+";
            case "minus": return ui ? "−" : "-";
            case "multiply": return ui ? "×" : "*";
            case "divide": return ui ? "÷" : "/";
            case "equal": return "=";
        }
    }

    function updateNumberVariables(firstNumberCallback, secondNumberCallback, forceUpdate = false) {
        if (!forceUpdate) {
            let firstNumberNotInputted = !lastOperator;
            if (firstNumberNotInputted) {
                firstNumber = firstNumberCallback(firstNumber);
            } else {
                secondNumber = secondNumberCallback(secondNumber);
            }
        } else {
            firstNumber = firstNumberCallback(firstNumber);
            secondNumber = secondNumberCallback(secondNumber);
        }
    }

    optionsDiv.addEventListener("click", function (event) {
        const target = event.target;
        const containerDiv = target.closest("#container");
        const displayDiv = containerDiv.querySelector(".display");
        const contentDiv = displayDiv.firstElementChild;
        const className = target.className;

        function wipeData() {
            updateNumberVariables(() => "", () => "", true);
            lastOperator = "";
            contentDiv.textContent = "";
        }

        if (className.startsWith("number")) {
            if (lastOperator === "=") {
                wipeData();
            }
            const number = className.slice(-1);
            contentDiv.textContent += number;
            updateNumberVariables(fn => fn + number, sn => sn + number);
        } else if (className.startsWith("operator")) {
            console.log(firstNumber, secondNumber, lastOperator);
            if (firstNumber && secondNumber && lastOperator) {
                const result = operate(firstNumber, secondNumber, lastOperator);
                if (!isNaN(+result)) {
                    updateNumberVariables(() => result, () => "", true);
                }
                contentDiv.textContent = result;
            }

            const operatorName = className.split(" ").at(-1);
            const operatorUI = nameToSymbol(operatorName);
            lastOperator = nameToSymbol(operatorName, false);
            if (lastOperator !== "=") {
                if (!contentDiv.textContent.length) {
                    updateNumberVariables(fn => fn + lastOperator, sn => sn, true);
                    lastOperator = "";
                }
                contentDiv.textContent += operatorUI;
            }
        } else {
            switch (className) {
                case "dot":
                    contentDiv.textContent += ".";
                    updateNumberVariables(fn => fn + ".", sn => sn + ".");
                    break;
                
                case "clear-entry":
                    contentDiv.textContent = contentDiv.textContent.slice(0, -1);
                    updateNumberVariables(fn => fn.slice(0, -1), sn => sn.slice(0, -1));
                    break;

                case "all-clear":
                    wipeData();
                    break;
            }
        }
    });
}

initialize();