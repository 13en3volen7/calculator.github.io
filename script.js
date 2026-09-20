const MAX_LENGTH = 16;

function initialize() {
    const containerDiv = document.querySelector("#container");

    attachButtonEvents(containerDiv);
    attachKeyboardEvents(containerDiv);
}

function isNumeric(string) {
    return typeof string === "string" && !isNaN(string) && !isNaN(parseFloat(string));
}

function round(num, decimalPlaces = 0) {
    const p = Math.pow(10, decimalPlaces);
    const n = (num * p) * (1 + Number.EPSILON);
    return Math.round(n) / p;
}

function add(a, b) {
    return round(a + b, 2);
}

function subtract(a, b) {
    return round(a - b, 2);
}

function multiply(a, b) {
    return round(a * b, 2);
}

function divide(a, b) {
    if (b === 0) {
        return "MATH ERROR";
    }
    return round(a / b, 2);
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
    const displayDiv = containerDiv.querySelector(".display");
    const contentDiv = displayDiv.firstElementChild;
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
            let editingFirstNumber = !lastOperator || lastOperator === "=";
            if (editingFirstNumber) {
                firstNumber = firstNumberCallback(firstNumber);
            } else {
                secondNumber = secondNumberCallback(secondNumber);
            }
        } else {
            firstNumber = firstNumberCallback(firstNumber);
            secondNumber = secondNumberCallback(secondNumber);
        }
    }

    function updateDisplayBox(callback) {
        const preview = callback(contentDiv.textContent);
        if (preview.length > MAX_LENGTH) {
            return;
        }
        contentDiv.textContent = preview;
    }

    function wipeData() {
        updateNumberVariables(() => "", () => "", true);
        lastOperator = "";
        contentDiv.textContent = "";
    }

    optionsDiv.addEventListener("click", function (event) {
        const target = event.target;
        const className = target.className;

        if (className.startsWith("number")) {
            if (lastOperator === "=") {
                wipeData();
            }
            const number = className.slice(-1);
            updateDisplayBox((text) => text + number);
            updateNumberVariables(fn => fn + number, sn => sn + number);
        } else if (className.startsWith("operator")) {
            console.log(firstNumber, secondNumber, lastOperator);
            if (firstNumber && secondNumber && lastOperator) {
                const result = operate(firstNumber, secondNumber, lastOperator);
                if (!isNaN(+result)) {
                    updateNumberVariables(() => result, () => "", true);
                }
                updateDisplayBox(() => result);
            }

            const operatorName = className.split("-").at(-1);
            const operatorUI = nameToSymbol(operatorName);
            lastOperator = nameToSymbol(operatorName, false);
            if (lastOperator !== "=") {
                if (!contentDiv.textContent.length) {
                    updateNumberVariables(fn => fn + lastOperator, sn => sn, true);
                    lastOperator = "";
                }
                updateDisplayBox((text) => text + operatorUI);
            }
        } else {
            switch (className) {
                case "decimal":
                    const appendDecimalInner = num => {
                        if (num.includes(".")) {
                            return num;
                        }
                        updateDisplayBox((text) => text + ".");
                        return num + ".";
                    }
                    updateNumberVariables(appendDecimalInner, appendDecimalInner);
                    break;
                
                case "del":
                    const lastChar = contentDiv.textContent.at(-1);
                    const isAnOperator = (char) => isNaN(+char) && char !== ".";
                    if (isAnOperator(lastChar)) {
                        const beforeLastChar = contentDiv.textContent.at(-2);
                        lastOperator = isAnOperator(beforeLastChar) ? beforeLastChar : "";
                    } else {
                        updateNumberVariables(fn => fn.slice(0, -1), sn => sn.slice(0, -1));
                    }
                    updateDisplayBox((text) => text.slice(0, -1));
                    break;

                case "clear-entry":
                    if (!lastOperator) {
                        wipeData();
                    } else {
                        const secondNumberStartIndex = contentDiv.textContent.lastIndexOf(secondNumber);
                        updateDisplayBox((text) => text.slice(0, secondNumberStartIndex));
                        updateNumberVariables(fn => fn, () => "");
                    }
                    break;

                case "all-clear":
                    wipeData();
                    break;
            }
        }
    });
}

function attachKeyboardEvents(containerDiv) {
    const optionsDiv = containerDiv.querySelector(".options");
    const invoke = (element, eventType, customEvent) => {
        const e = customEvent ?? new Event(eventType, { bubbles: true });
        element.dispatchEvent(e);
    }

    document.body.addEventListener("keydown", (event) => {
        console.log(`key=${event.key},code=${event.code}`);
        const key = event.key;
        if (!isNaN(+key)) {
            invoke(optionsDiv.querySelector(`.number-${key}`), "click");
        } else {
            switch (key) {
                case "+":
                    invoke(optionsDiv.querySelector(".operator-plus"), "click");
                    break;

                case "-":
                    invoke(optionsDiv.querySelector(".operator-minus"), "click");
                    break;

                case "*":
                    invoke(optionsDiv.querySelector(".operator-multiply"), "click");
                    break;

                case "/":
                    invoke(optionsDiv.querySelector(".operator-divide"), "click");
                    break;

                case "=":
                case "Enter":
                    invoke(optionsDiv.querySelector(".operator-equal"), "click");
                    break;

                case ".":
                    invoke(optionsDiv.querySelector(".decimal"), "click");
                    break;

                case "Backspace":
                    invoke(optionsDiv.querySelector(".del"), "click");
                    break;

                case "Escape":
                    invoke(optionsDiv.querySelector(".all-clear"), "click");
                    break;

                case "Delete":
                    invoke(optionsDiv.querySelector(".clear-entry"), "click");
                    break;
            }
        }
    });
}

initialize();