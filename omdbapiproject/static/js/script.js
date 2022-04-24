const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const moviesList = document.getElementById('moviesList')
const watchlist = document.getElementById('watchlist')
const removeWatchlistBtn = document.getElementsByClassName('remove-watchlist-btn')
const cardWatchlistBtn = document.getElementsByClassName('watchlist-btn')
const readMore = document.getElementsByClassName('read-more')
const readMorePlot = document.getElementsByClassName('read-more-plot')
const movieKey = document.getElementsByClassName('movie-key')
const localStorageKeys = Object.keys(localStorage)

if (searchBtn) {
    searchBtn.addEventListener('click', searchMovies)
}

async function searchMovies() {

    if (moviesList.children) {
        let children = moviesList.children
        let childrenArr = Array.prototype.slice.call(children)
        childrenArr.forEach((child) => child.remove())
    }

    let res = await fetch(`https://www.omdbapi.com/?s=${searchInput.value.trim()}&apikey=adb27daf`)
    let data = await res.json()

    const movies = data.Search


    movies.forEach(async (movie) => {
        let response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=adb27daf`)
        let moviesListData = await response.json()

        const readMoreMovieID = moviesListData.imdbID + 'more'
        const hideReadMore = moviesListData.imdbID + 'hide'

        const summaryPlot = `${moviesListData.Plot.substring(0, 110)}<span id=${hideReadMore}>...<button class="black read-more" onclick="showCompletePlot(${readMoreMovieID}, ${hideReadMore})">Read more</button></span>`

        const readMorePlot = `<span class="read-more-plot" id=${readMoreMovieID} >${moviesListData.Plot.substring(110, moviesListData.Plot.length)}</span>`

        const completePlot = moviesListData.Plot
        const longPlot = summaryPlot + readMorePlot
        const movieID = moviesListData.imdbID
        const movieIDkey = moviesListData.imdbID + 'key'
        const watchlistBtnKey = moviesListData.imdbID + 'watchlistBtn'
        const removeBtnKey = moviesListData.imdbID + 'removeBtn'

        moviesList.innerHTML += `
                <div class="cards">
                    <div class="card" id=${movieID}>
                        <span id=${movieIDkey} class="hide movie-key">${movieIDkey}</span>
                        <img src=${moviesListData.Poster} class="card-poster" />

                        <div class="card-header">
                            <h2 class="card-title">${moviesListData.Title}</h2>
                            <span class="card-rating">${moviesListData.imdbRating}</span>
                        </div>

                        <div class="card-meta">
                            <span class="card-runtime">${moviesListData.Runtime}</span>
                            <span>${moviesListData.Genre}</span>

                            <button class="card-btn card-watchlist watchlist-btn" id="${watchlistBtnKey}" onclick="addToWatchlist(${movieIDkey}, ${movieID}, ${watchlistBtnKey}, ${removeBtnKey})">&nbsp;Add to Watchlist</button>

                            <button class="card-btn card-watchlist remove-watchlist-btn" id="${removeBtnKey}" onclick="removeFromWatchlist(${movieIDkey}, ${removeBtnKey}, ${watchlistBtnKey}, ${removeBtnKey})">&nbsp;Remove</button>
                        </div>
                        <p class="card-plot">${completePlot.length < 110 ? completePlot : longPlot}</p>
                    </div>
                </div>
            `

        displayWatchlistOrRemoveBtn()
    })
}

function displayWatchlistOrRemoveBtn() {
    for (let movie of movieKey) {
        const removeBtnID = movie.id.slice(0, 9) + 'removeBtn'
        const removeBtn = document.getElementById(removeBtnID)

        const watchlistBtnID = movie.id.slice(0, 9) + 'watchlistBtn'
        const watchlistBtn = document.getElementById(watchlistBtnID)

        localStorageKeys.forEach((key) => {
            if (movie.id === key) {
                removeBtn.style.display = 'inline'
                watchlistBtn.style.display = 'none'
            }
        })
    }
}

function showCompletePlot(readMoreMovieID, hideReadMore) {
    readMoreMovieID.style.display = 'inline'
    hideReadMore.style.display = 'none'
}

function addToWatchlist(movieIDkey, movieID, watchlistBtnKey, removeBtnKey) {
    localStorage.setItem(movieIDkey.innerHTML, movieID.innerHTML)
    watchlistBtnKey.style.display = 'none'
    removeBtnKey.style.display = 'inline'
}

function removeFromWatchlist(movieIDkey, removeBtnKey, watchlistBtnKey, removeBtnKey) {
    localStorage.removeItem(movieIDkey.innerHTML)

    if (watchlist) {
        localStorage.removeItem(movieIDkey.innerHTML)

        const parentEl = document.getElementById(movieIDkey.innerHTML).parentElement
        parentEl.remove()
    }

    watchlistBtnKey.style.display = 'inline'
    removeBtnKey.style.display = 'none'

    if (watchlist && localStorage.length === 0) {
        if (watchlist.children) {
            const children = watchlist.children
            const childrenArr = Array.prototype.slice.call(children)
            childrenArr.forEach((child) => (child.style.display = 'flex'))
        }
    }
}

if (watchlist && localStorage.length > 0) {
    if (watchlist.children) {
        const children = watchlist.children
        const childrenArr = Array.prototype.slice.call(children)
        childrenArr.forEach((child) => (child.style.display = 'none'))
    }
}

for (let i = 0; i < localStorage.length; i++) {
    const getLocalStorage = localStorage.getItem(localStorage.key(i))

    if (watchlist) {
        watchlist.innerHTML += `<div class="card">${getLocalStorage}</div>`

        for (let button of cardWatchlistBtn) {
            button.style.display = 'none'
        }

        for (let button of removeWatchlistBtn) {
            button.style.display = 'inline'
        }
    }
}
