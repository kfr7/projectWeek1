
// ********GLOBAL CONSTANTS*************
const API_KEY = `7564e5f1de84def435a762bc31c0221b`;
let currentQueryTerm = "";
let currentPage = 1;
let onHomePage = true;

// ********CREATE DOM REFERENCES***********
let movieForm = document.querySelector("form");
let movieGallery = document.querySelector("#movies-grid");
let loadMoreMoviesBtn = document.querySelector("#load-more-movies-btn");
let img = document.querySelector("img");


// ****CREATE EVENT LISTENER FOR SUBMIT*********
movieForm.addEventListener("submit", getFromQueryAndDisplay);
loadMoreMoviesBtn.addEventListener("click", (event) => {getFromQueryAndDisplay(event, true)});


// *****TIE EVERYTHING TOGETHER*************
async function getFromQueryAndDisplay(event, justLoadMore=false)
{
    if (!justLoadMore)
    {
        console.log("Entered here if finding new search from submit query")
        // console.log("Not just loading more")
        currentPage = 1;
        currentQueryTerm = event.target.searchInput.value.toLowerCase();
        onHomePage = false;
    }

    //console.log("Entered getFromQueryAndDisplay")
    event.preventDefault();
    
    retrieveMovieInformation(currentQueryTerm).then(jsonData => formatIntoHTML(jsonData, justLoadMore));
}

async function getMoreMovies(event)
{

}

// ************GET INFORMATION*****************
async function retrieveMovieInformation(queryTerm)  // pass through queryTerm because it might not be the "currentQueryTerm"
                                                                                        // fix and check parameters later
{
    let apiUrl = "";
    if (onHomePage)
    {
        // display movies in home page before any queries
        // console.log("Showing homepage url json format");
        apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${currentPage}`;
        // console.log(apiUrl);
    }
    else
    {
        // actual query submitted in else clause
        apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${queryTerm}&page=${currentPage}`
    }
    try
    {
        currentPage += 1;
        let response = await fetch(apiUrl);
        let jsonData = await response.json();
        return jsonData;
    }
    catch(err)
    {
        currentPage -= 1;   // Not sure on what 
        console.log("Error encountered inside of retrieveMovieInformation function");
        console.error(err);
        return;
    }

}



// **********SHOW MOVIE IN GRID FORMAT*****************

function formatIntoHTML(jsonData, justLoadMore=false)
{   
    let arrayOfMovies = jsonData["results"];
    if (!justLoadMore)
    {
        // Clear everything on screen if not just "loading more"
        movieGallery.innerHTML = "";
        if (arrayOfMovies.length === 0)
        {
            movieGallery.innerHTML = "<p>No movies found.</p>";
        }
    }
    else
    {
        if (arrayOfMovies.length === 0)
        {
            movieGallery.innerHTML += "<p>No more movies found.</p>";
        }
    }



    // console.log("About to call forEach on the array of movies");
    arrayOfMovies.forEach(singleMovieInfo =>
        {
            
            movieGallery.innerHTML +=  `<div class="movie-card">
                                            <p class="movie-title">${singleMovieInfo["title"]}</p>
                                            <p class="movie-votes">${singleMovieInfo["vote_average"]}</p>
                                            <img class="movie-poster" width=200px src="https://image.tmdb.org/t/p/w200${singleMovieInfo["poster_path"]}" alt="Image not found" onerror="this.onerror=null;this.src='https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg';" />
                                        </div>`
            // console.log(singleMovieInfo["poster_path"]);
        })
}



window.onload = function() {
    retrieveMovieInformation("", true).then(jsonData => formatIntoHTML(jsonData));
}
