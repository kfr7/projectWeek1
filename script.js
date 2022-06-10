// is git pull working

// ********GLOBAL CONSTANTS*************
const API_KEY = `7564e5f1de84def435a762bc31c0221b`;
let currentQueryTerm = "";
let currentPage = 1;
let onHomePage = true;

// ********CREATE DOM REFERENCES***********
let movieForm = document.querySelector("form");
let movieGallery = document.querySelector("#movies-grid");
let loadMoreMoviesBtn = document.querySelector("#load-more-movies-btn");
let closeSearchGoHome = document.querySelector("#close-search-btn");
let categorySpecific = document.querySelector("#specificCategoryTag");
let noMoreMoviesTag = document.querySelector("#noMoreMoviesTag");


// ****CREATE EVENT LISTENER FOR SUBMIT*********
movieForm.addEventListener("submit", getFromQueryAndDisplay);
loadMoreMoviesBtn.addEventListener("click", (event) => {getFromQueryAndDisplay(event, true)});
closeSearchGoHome.addEventListener("click", goBackHome);


// *****TIE EVERYTHING TOGETHER*************
async function goBackHome(event)
{
    event.preventDefault();
    currentQueryTerm = "";
    categorySpecific.innerHTML = "Now trending..."
    noMoreMoviesTag.innerHTML = "";
    currentPage = 1;
    onHomePage = true;
    retrieveMovieInformation("", true).then(jsonData => formatIntoHTML(jsonData));
}

async function getFromQueryAndDisplay(event, justLoadMore=false)
{
    if (!justLoadMore)
    {   // Enter if NOT LOADING MORE (new query search)
        console.log("Entered here if finding new search from submit query")
        // console.log("Not just loading more")
        currentPage = 1;
        currentQueryTerm = event.target.searchInput.value.toLowerCase();
        categorySpecific.innerHTML = `Searching for "${event.target.searchInput.value}"...`
        noMoreMoviesTag.innerHTML = "";
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
async function retrieveMovieInformation(queryTerm)  
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
            noMoreMoviesTag.innerHTML = "No more movies found";
        }
    }



    // console.log("About to call forEach on the array of movies");
    arrayOfMovies.forEach(singleMovieInfo =>
        {
            
            movieGallery.innerHTML +=  `<div class="movie-card">
                                            <!-- <div class="border"></div> -->
                                            <h5 class="movie-title">${singleMovieInfo["title"]}</h5>
                                            <img class="movie-poster" src="https://image.tmdb.org/t/p/w200${singleMovieInfo["poster_path"]}" alt="Image not found" onerror="this.onerror=null;this.src='https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg';" />
                                            <div class="star-with-rating">
                                                <img class="star" src="pictures/testing.jpg"/>
                                                <p class="movie-votes">${singleMovieInfo["vote_average"]} / 10</p>
                                            </div>
                                        </div>`
            // console.log(singleMovieInfo["poster_path"]);
        })
}



window.onload = function() {
    retrieveMovieInformation("", true).then(jsonData => formatIntoHTML(jsonData));
}
