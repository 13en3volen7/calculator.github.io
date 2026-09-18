function initialize() {
    const containerDiv = document.querySelector("#container");
    const optionsDiv = containerDiv.querySelector(".options");

    optionsDiv.addEventListener("click", handleButtonClick);
}

function handleButtonClick(event) {
    const target = event.target;
    const containerDiv = target.closest("#container");
    const displayDiv = containerDiv.querySelector(".display");
    const contentDiv = displayDiv.firstElementChild;
    const className = target.className;

    if (className.startsWith("number")) {
        contentDiv.textContent += className.slice(-1);
    } else if (className.startsWith("operator")) {
        if (className.endsWith("plus")) {
            contentDiv.textContent += "+";
        } else if (className.endsWith("minus")) {
            contentDiv.textContent += "−";
        } else if (className.endsWith("multiply")) {
            contentDiv.textContent += "×";
        } else if (className.endsWith("divide")) {
            contentDiv.textContent += "÷";
        }
    } else {
        switch (className) {
            case "dot":
                contentDiv.textContent += ".";
                break;
            
            case "clear-entry":
                contentDiv.textContent = contentDiv.textContent.slice(0, -1);
                break;

            case "all-clear":
                contentDiv.textContent = "";
                break;
        }
    }
}

initialize();