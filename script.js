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
    if (!a && !b && !op) {
        return "";
    }
    if (a && !b && !op) {
        return a;
    }
    if (a && !b && op) {
        return "SYNTAX ERROR";
    }
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
    let wasFinalResult = false;
    
    function formatOperator(operatorName) {
        switch (operatorName) {
            case "plus": return "+";
            case "minus": return "-";
            case "multiply": return "*";
            case "divide": return "/";
            default: return "";
        }
    }

    function getOperatorDisplay(operator) {
        switch (operator) {
            case "+": return "+";
            case "-": return "−";
            case "*": return "×";
            case "/": return "÷";
            default: return "";
        }
    }

    function updateDisplayBox(fn, sn, op, msg = null) {
        if (msg && msg.length <= MAX_LENGTH) {
            contentDiv.textContent = msg;
            return;
        }
        fn = fn || "";
        sn = sn || "";
        op = getOperatorDisplay(op) || "";
        const preview = fn + op + sn;
        if (preview.length > MAX_LENGTH) {
            return;
        }
        contentDiv.textContent = preview;
    }

    function updateNumberVariables(fnCallback, snCallback, forceUpdate = false) {
        if (!forceUpdate) {
            const editingFirstNumber = !lastOperator || lastOperator === "=";
            if (editingFirstNumber) {
                firstNumber = fnCallback(firstNumber);
            } else {
                secondNumber = snCallback(secondNumber);
            }
        } else {
            firstNumber = fnCallback(firstNumber);
            secondNumber =  snCallback(secondNumber);
        }
    }

    function tryWipeData(forceWipe = false, reset = true) {
        if (wasFinalResult || forceWipe) {
            lastOperator = "";
            updateNumberVariables(() => "", () => "", true);
            updateDisplayBox(firstNumber, secondNumber, lastOperator);
            wasFinalResult = !reset;
        }
    }

    optionsDiv.addEventListener("click", function (event) {
        const target = event.target;
        const className = target.className;

        if (className.startsWith("number")) {
            tryWipeData();
            const number = className.slice(-1);
            updateNumberVariables(fn => fn + number, sn => sn + number);
            updateDisplayBox(firstNumber, secondNumber, lastOperator);
        } else if (className.startsWith("operator")) {
            if (wasFinalResult) {
                wasFinalResult = false;
            }
            console.log(firstNumber, lastOperator, secondNumber);
            if (firstNumber && secondNumber && lastOperator) {
                const result = operate(firstNumber, secondNumber, lastOperator);
                const error = !isNumeric(result);
                if (!error) {
                    updateNumberVariables(() => result, () => "", true);
                    updateDisplayBox(firstNumber, secondNumber, lastOperator);
                } else {
                    wasFinalResult = true;
                    updateDisplayBox(firstNumber, secondNumber, lastOperator, result);
                }
            }
            const operatorName = className.split("-").at(-1);
            lastOperator = formatOperator(operatorName);
            if (!wasFinalResult) {
                updateDisplayBox(firstNumber, secondNumber, lastOperator);
            }
        } else {
            switch (className) {
                case "plus-minus":
                    const toggleNegative = (num) => {
                        if (num) {
                            num = +num;
                            num *= -1;
                        }
                        return `${num}`;
                    }
                    updateNumberVariables(toggleNegative, toggleNegative);
                    updateDisplayBox(firstNumber, secondNumber, lastOperator);
                    break;

                case "equal":
                    tryWipeData(false, false);
                    const result = operate(firstNumber, secondNumber, lastOperator);
                    const error = !isNumeric(result);
                    if (!error) {
                        lastOperator = "";
                        updateNumberVariables(() => result, () => "", true);
                        updateDisplayBox(firstNumber, secondNumber, lastOperator);
                    } else {
                        wasFinalResult = true;
                        updateDisplayBox(firstNumber, secondNumber, lastOperator, result);
                    }
                    break;

                case "decimal":
                    const appendDecimalInner = num => {
                        if (num.includes(".")) {
                            return num;
                        }
                        return num + ".";
                    }
                    updateNumberVariables(appendDecimalInner, appendDecimalInner);
                    updateDisplayBox(firstNumber, secondNumber, lastOperator);
                    break;
                
                case "del":
                    const lastChar = contentDiv.textContent.at(-1);
                    const isAnOperator = (char) => isNumeric(+char) && char !== "=" && char !== ".";
                    if (isAnOperator(lastChar)) {
                        lastOperator = "";
                        updateDisplayBox(firstNumber, secondNumber, lastOperator);
                    } else {
                        updateNumberVariables(fn => fn.slice(0, -1), sn => sn.slice(0, -1));
                        updateDisplayBox(firstNumber, secondNumber, lastOperator);
                    }
                    break;

                case "clear-entry":
                    if (!lastOperator) {
                        tryWipeData(true);
                    } else {
                        updateNumberVariables(fn => fn, () => "");
                        updateDisplayBox(firstNumber, secondNumber, lastOperator);
                    }
                    break;

                case "all-clear":
                    tryWipeData(true);
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
        const key = event.key;
        if (isNumeric(key)) {
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