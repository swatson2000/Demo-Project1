var api = 'https://collectionapi.metmuseum.org/public/collection/v1/';
var ai = 'https://imagga.com/profile/dashboard#acc_1a2fa75f3805c60';
var departmentList = {}
//use hasimages
//maybe use medium
//artistOrCulture	

function getDepartments() {
    // Changes Api to include departments in the Met Museum
    var searchUrl = api + 'departments?per_page=3';
    fetch(searchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // See where the data is nested
            console.log('DATA:', data.departments[0])
            var departmentList = {};
            // Loop thru all departments in Api
            for (var department of data.departments) {
                // Console logs the current department. Since it loops through, it should display all the departments available.
                console.log(department);

                // Returns the departments stored in local storage.
                var museumDepartment = JSON.parse(localStorage.getItem('departments')) || [];
                // failure condition
                if (!museumDepartment.includes(department)) {
                    museumDepartment.push(department)
                }
                // Set items in local storage. Stringify so it can return as an array
                localStorage.setItem('departments', JSON.stringify(museumDepartment));
                
            }
            console.log(museumDepartment[0].departmentId);
            // Moved the items in local storage into a listed dictionary for easier access. 
            for (var i = 0; i < museumDepartment.length; i++) {
                departmentList[museumDepartment[i].displayName] = [museumDepartment[i].departmentId];
            }
            // departmentList is variable stored to access departments
            console.log(departmentList)
            // Accessing the departmentId of a given department
            // console.log(departmentList[0][0])
            // Accessing the displayName of the department
            // console.log(departmentList[1][0])
            viewDepartments();
        });
}

function viewDepartments () {
    console.log(departmentList);

    // Variables to use as sub for apibelow
    // var qUrlKey = jk
    // var departmentIdKey = jk


    // Use local storage to input the 'q' and 'departmentId' using variables. MUST OBTAIN 'objectIDs' value
    // var apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=asian&departmentId=6&hasImages=true'

    // fetch(apiUrl)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         console.log(data);
    //     });

    var objectIDsKey = []
    // Using the 'objectIDs' value, generate an image or something
    // var apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+ 'CODE ID GOES HERE'
}

getDepartments();
viewDepartments();
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


