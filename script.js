var api = 'https://collectionapi.metmuseum.org/public/collection/v1/';
var ai = 'https://imagga.com/profile/dashboard#acc_1a2fa75f3805c60';
var departmentList = {}
//use hasimages
//maybe use medium
//artistOrCulture	
var museumId = document.querySelector('#museum')
function getDepartments() {
    // Changes Api to include departments in the Met Museum
    var searchUrl = api + 'departments';
    console.log(searchUrl)
    fetch(searchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Hopefully this will empty the object/dictionary, but if not CHANGE
            departmentList = {};
            // Clears the previous clicked departments(if any)
            museumId.innerHTML = '';
            localStorage.clear(museumDepartment);
            // Loop thru all departments in Api
            for (var department of data.departments) {
                // Console logs the current department. Since it loops through, it should display all the departments available.
                // console.log(department);

                // Returns the departments stored in local storage.
                var museumDepartment = JSON.parse(localStorage.getItem('departments')) || [];
                // failure condition
                if (!museumDepartment.includes(department)) {
                    museumDepartment.push(department)
                }
                // Set items in local storage. Stringify so it can return as an array
                localStorage.setItem('departments', JSON.stringify(museumDepartment));
            }
            // Gets the value of the id for the department
            // console.log(museumDepartment[0].departmentId);

            // Moved the items in local storage into a listed dictionary for easier access. 
            for (var i = 0; i < museumDepartment.length; i++) {
                departmentList[museumDepartment[i].displayName] = museumDepartment[i].departmentId;
            }
            // departmentList is variable stored to access departments
            console.log(departmentList)

            var userInput = document.getElementById('department').value;

            console.log(userInput)
            viewObjectValue(userInput);
        });
}

function viewObjectValue (displayName) {
// Variables to use as sub for apibelow~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ NOTE: IF WE WANT TO ADD MORE PARAMETERS FOR SEARCH, ADD MORE VARIABLES... too much, but it is limited.
    // Stores the name of the department
    var qUrlKey = displayName;
    // Stores the ID number value
    var departmentIdKey = departmentList[displayName]

    // Use local storage to input the 'q' and 'departmentId' using variables. MUST OBTAIN 'objectIDs' value
    var apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q='+ qUrlKey +'&departmentId='+ departmentIdKey +'&hasImages=true'
    console.log(apiUrl)
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Stores the objectIDs value (used for objectsApiUrl)
            var objectIDsValue = [];
            // Adds the first 20 ids into the array/list above
            for (var i = 0; i < 15; i++) {
                objectIDsValue.push(data.objectIDs[i]);
            }
            console.log(objectIDsValue)
            getMuseumObject(objectIDsValue);
        });
};
console.log('hi')
function getMuseumObject (ID) {
    // Using the 'objectIDsValue' value, iterate through and use all for the api, generate an image or something. Likely needs loops
    for (i = 0; i < ID.length; i++) {
        var objectsApiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+ ID[i]
        fetch(objectsApiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                console.log(data.title)
                console.log(data.primaryImage)
                if (!data.primaryImage == '') {
                var containerEl = document.createElement('p');                
                var titleEl = document.createElement('p')
                var imageEl = document.createElement('img')

                var imageMuseum = data.primaryImage
                titleEl.textContent = data.title;
                imageEl.setAttribute('src', imageMuseum)
                containerEl.setAttribute('class', 'containers')
                titleEl.setAttribute('class', 'artTitle')

                containerEl.appendChild(titleEl)
                containerEl.appendChild(imageEl);

                museumId.appendChild(containerEl);    
                } else {
                    return
                }
            });
        console.log(objectsApiUrl)
    }
}

function searchObjects() {
    var searchQuery = document.querySelector('#searchBar').value;

    // Perform a search query to get object IDs
    var searchUrl = api + 'search?q=' + encodeURIComponent(searchQuery);

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            // Extract the object IDs from the search response
            var objectIDs = data.objectIDs;
            if (objectIDs.length === 0) {
                alert('No objects found.');
                return;
            }

            // Randomly select multiple object IDs
            var randomObjectIDs = getRandomElements(objectIDs, 5); // Change the number (3) to display more or fewer results

            // Get object details for the selected object IDs
            var objectPromises = randomObjectIDs.map(objectID => {
                var objectUrl = api + 'objects/' + objectID;
                return fetch(objectUrl)
                    .then(response => response.json());
            });

            Promise.all(objectPromises)
                .then(results => {
                    // Clear previous results
                    clearResults();

                    // Display the object details for each result
                    results.forEach(result => {
                        var objectTitle = result.title;
                        var objectImageUrl = result.primaryImage;
                        var objectDescription = result.objectDescription;

                        // Create HTML elements for each result
                        var resultContainer = document.createElement('div');
                        resultContainer.classList.add('result-container');

                        var titleElement = document.createElement('h2');
                        titleElement.textContent = objectTitle;

                        var imageElement = document.createElement('img');
                        imageElement.setAttribute('src', objectImageUrl);
                        imageElement.setAttribute('alt', 'Object Image');

                        var descriptionElement = document.createElement('p');
                        descriptionElement.textContent = objectDescription;

                        resultContainer.appendChild(titleElement);
                        resultContainer.appendChild(imageElement);
                        resultContainer.appendChild(descriptionElement);

                        // Append the result container to the HTML
                        document.querySelector('#results').appendChild(resultContainer);
                    });
                })
                .catch(error => {
                    console.error('Error fetching object details:', error);
                });
        })
        .catch(error => {
            console.error('Error searching objects:', error);
        });
}

function clearResults() {
    var resultsContainer = document.querySelector('#results');
    resultsContainer.innerHTML = '';
}

function getRandomElements(arr, count) {
    var shuffled = arr.slice(0);
    var i = arr.length;
    var min = i - count;
    var temp;
    var index;

    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }

    return shuffled.slice(min);
}

document.querySelector('#submit').addEventListener('click', searchObjects);
document.querySelector('#department').addEventListener('click', getDepartments);


