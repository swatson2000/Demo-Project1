var api = 'https://collectionapi.metmuseum.org/public/collection/v1/';
var ai = 'https://imagga.com/profile/dashboard#acc_1a2fa75f3805c60';
//use hasimages
//maybe use medium
//artistOrCulture	
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
            var randomObjectIDs = getRandomElements(objectIDs, 9); // Change the number (3) to display more or fewer results

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


