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
        case "−": return `${subtract(a, b)}`;
        case "×": return `${multiply(a, b)}`;
        case "÷": return `${divide(a, b)}`;
    }
}

function attachButtonEvents(containerDiv) {
    const optionsDiv = containerDiv.querySelector(".options");
    let firstNumber = "";
    let secondNumber = "";
    let operator = "";
    let firstNumberIsNegative = false;
    
    function nameToSymbol(operatorName) {
        switch (operatorName) {
            case "plus": return "+";
            case "minus": return "−";
            case "multiply": return "×";
            case "divide": return "÷";
            case "equal": return "=";
        }
    }

    function wipeData() {
        firstNumber = "";
        secondNumber = "";
        operator = "";
    }

    optionsDiv.addEventListener("click", function (event) {
        const target = event.target;
        const containerDiv = target.closest("#container");
        const displayDiv = containerDiv.querySelector(".display");
        const contentDiv = displayDiv.firstElementChild;
        const className = target.className;

        if (className.startsWith("number")) {
            if (operator === "=") {
                wipeData();
                contentDiv.textContent = "";
            }
            const number = className.slice(-1);
            contentDiv.textContent += number;
            if (!operator) {
                if (firstNumberIsNegative) {
                    firstNumber = "-" + firstNumber;
                    firstNumberIsNegative = false;
                }
                firstNumber += number;  
            } else {
                secondNumber += number;
            }
        } else if (className.startsWith("operator")) {
            console.log(firstNumber, secondNumber, operator);
            if (firstNumber && secondNumber && operator) {
                const result = operate(+firstNumber, +secondNumber, operator);
                firstNumber = result;
                secondNumber = "";
                contentDiv.textContent = result;
            }

            operator = nameToSymbol(className.split(" ").at(-1));
            if (operator !== "=") {
                contentDiv.textContent += operator;
                if (contentDiv.textContent.length === 1) {
                    if (operator === "+") {
                        operator = "";
                    } else if (operator === "−") {
                        firstNumberIsNegative = true;
                        operator = "";
                    }
                }
            }
        } else {
            switch (className) {
                case "dot":
                    contentDiv.textContent += ".";
                    if (!operator) {
                        firstNumber += ".";
                    } else {
                        secondNumber += ".";
                    }
                    break;
                
                case "clear-entry":
                    contentDiv.textContent = contentDiv.textContent.slice(0, -1);
                    if (!operator) {
                        firstNumber = firstNumber.slice(0, -1);
                    } else {
                        secondNumber = secondNumber.slice(0, -1);
                    }
                    break;

                case "all-clear":
                    wipeData();
                    contentDiv.textContent = "";
                    break;
            }
        }
    });
}

initialize();