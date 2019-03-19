requestImageData();

function requestImageData(){
    browser.runtime.sendMessage({action: "returnImageData"})
        .then(handleResponse)
        .catch((err)=>{
            if (logToConsole) {
                console.error(err);
                console.log("Failed to retrieve image EXIF tags.");
            }
        });
}

function handleResponse(message) {
    let action = message.action;
    let imageUrl = message.data.imageUrl;
    let imageTags = message.data.imageTags;
    switch (action) {
        case "displayExifTagsInSidebar":
            createExifTagsPage(imageUrl, imageTags);
            break;
		default:
			break;
	}
}

function createExifTagsPage(imageUrl, imageTags){
    let content = document.getElementById("content");
    let table = document.createElement("table");
    for (let tag in imageTags) {
        if (tag === "undefined") continue;
        let tr = document.createElement("tr");
        let tdTag = document.createElement("td");
        tdTag.setAttribute("class", "key");
        let tdValue = document.createElement("td");
        tdValue.setAttribute("class", "value");
        tdTagText = document.createTextNode(tag);
        if (typeof(imageTags[tag]) === "object") {
            tdValueText = document.createTextNode(`${JSON.stringify(imageTags[tag])}`);
        } else {
            tdValueText = document.createTextNode(`${imageTags[tag]}`);
        }
        tdTag.appendChild(tdTagText);
        tdValue.appendChild(tdValueText);
        tr.appendChild(tdTag);
        tr.appendChild(tdValue);
        table.appendChild(tr);
    }
    content.appendChild(table);
}
