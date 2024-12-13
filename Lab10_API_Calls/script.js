//constructors
const fetchButton = document.getElementById("fetch-btn");
const dataOutput = document.getElementById("data-output");
const XHRButton = document.getElementById("XHR-btn");
const form = document.getElementById("post-form");
const formMessage = document.getElementById("form-msg");
const postBtn = document.getElementById("post-btn");
const putBtn = document.getElementById("put-btn");

//listener for GET request button
fetchButton.addEventListener("click", () => {
    //clear/fetching output
    dataOutput.textContent = "Retrieving..."
    
    //GET request using fetch()
    fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => {
        //check response retrieval success
        if (!response.ok) {
            //400 errors
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`Client Error: ${response.status}`);
            //500 errors
            } else if (response.status >= 500) {
                throw new Error(`Server Error: ${response.status}`);
            //other types of errors
            } else {
                throw new Error(`Unexpected Error: ${response.status}`);
            }
        }
        return response.json();
    })
    .then((data) => {
        //successful fetch
        dataOutput.innerHTML = `<h3>${data.title}</h3><p>${data.body}</p>`;
    })
    .catch((error) => {
        //determine error and display appropriate error message
        if (error.message.includes("Failed to fetch")) {
            dataOutput.textContent = "Network Error: Please check your connection.";
        } else if (error.message.includes("Client Error")) {
            dataOutput.textContent = `Client Error: Please verify the request. (${error.message})`;
        } else if (error.message.includes("Server Error")) {
            dataOutput.textContent = `Server Error: There is a server issue. (${error.message})`;
        } else {
            dataOutput.textContent = `Unknown Error: ${error.message}`;
        }
    });
});

//listener for XHR request button
XHRButton.addEventListener("click", () => {
    //clear/fetching output
    dataOutput.textContent = "Retrieving...";

    const xhr = new XMLHttpRequest();

    // GET XHR request
    xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/2", true);

    xhr.onload = function () {
        //successful data retrieval
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            dataOutput.innerHTML = `<h3>${data.title}</h3><p>${data.body}</p>`;
        //400 error
        } else if (xhr.status >= 400 && xhr.status < 500) {
            dataOutput.textContent = `Client Error: ${xhr.status} - ${xhr.statusText}`;
        //500 error
        } else if (xhr.status >= 500) {
            dataOutput.textContent `Server Error: ${xhr.status} - ${xhr.statusText}`;
        //other types of errors
        } else {
            dataOutput.textContent = `Unknown Error: ${xhr.status} - ${xhr.statusText}`;
        }
    };
    xhr.onerror = function () {
        dataOutput.textContent = "Network Error: Please check your connection.";
    };
    xhr.send();
})

//form submission using POST
form.addEventListener("submit", (event) => {
    //prevent default form submission
    event.preventDefault();

    //get input values
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    //clear previous message
    formMessage.textContent = "Submitting...";

    //POST request
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/JSON"
        },
        body: JSON.stringify({
            title: title,
            body: body
        })
    })
        .then((response) => {
            //check submittion success
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            //confirmation message
            formMessage.textContent = `Post submitted successfully! ID: ${data.id}, Title: ${data.title}`;
        })
        .catch((error) => {
            //error message
            formMessage.textContent = `Failed to submit post: ${error.message}`;
        });
});

//form submission using PUT
putBtn.addEventListener("click", () => {
    const postId = prompt("Enter post ID to update:");
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    //validate
    if (!postId || isNaN(postId)) {
        formMessage.textContent = "Invalid post ID.";
        return;
    }
    //clear message
    formMessage.textContent = "Updating...";

    //PUT request
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", "https://jsonplaceholder.typicode.com/posts/{postId}", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    //onload
    xhr.onload = function () {
        if (xhr,this.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            formMessage.textContent = `Post updated successfully! ID: ${data.id}, Title: ${data.title}`;
        } else {
            formMessage.textContent = `Failed to update post: ${xhr.status} - ${xhr.statusText}`;
        }
    };

    //onerror
    xhr.onerror = function () {
        formMessage.textContent = "Network Error: Please check your connection.";
    };
    //send and update data
    xhr.send(JSON.stringify({
        title: title,
        body: body
    }));
});