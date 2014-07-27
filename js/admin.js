(function(req, Handlebars){
    var $ = function(sel){
        return document.querySelector(sel);
    }
    var $$ = function(sel){
        return document.querySelectorAll(sel);
    }

    var hasLocalStorage = (function(){
            try {
          localStorage.setItem(mod, mod);
          localStorage.removeItem(mod);
          return true;
        } catch(e) {
          return false;
        }
    }())

    var searchBox = $('#search');
    var searchTimerId = 0;
    var searchTemplate = Handlebars.compile($("#search-result-template").innerHTML);
    var mainDisplay = $("#main-display");
    var movieModalTemplate = Handlebars.compile($("#movie-modal-content-template").innerHTML);
    var mainModal = $("#main-modal");
    var currentMedia;


    searchBox.addEventListener('keypress', function(e){
        clearTimeout(searchTimerId);
        searchTimerId = setTimeout(makeSearchRequest,300);
    });

    mainDisplay.addEventListener('click', function(e){
        console.log(e.target.parentNode.classList.contains('search-result'));
        if(e.target && e.target.parentNode.classList.contains('search-result')){
            movieModal(e.target.parentNode.dataset.movieid)
        }
    });

    mainModal.addEventListener('click', function(e){
        if(e.target && e.target.nodeName == 'BUTTON'){
            addFilm(currentMedia)
        }
    });

    function addFilm(film){
        var data = {
            title : film.title,
            genres : film.genres.slice(),
            tmdbId : film.id,
            overview : film.overview,
            tagline : film.tagline,
            posters : {
                small: createImageLink(film.images.posters[0].file_path,300),
                medium : createImageLink(film.images.posters[0].file_path, 600),
                large : createImageLink(film.images.posters[0].file_path, 'original')
            },
            backdrops : {
                small: createImageLink(film.images.backdrops[0].file_path,300),
                medium : createImageLink(film.images.backdrops[0].file_path, 600),
                large : createImageLink(film.images.backdrops[0].file_path, 'original')
            },
            releaseDate : film.release_date
        }
        req({
            url : 'http://localhost:7890/add/movie',
            method : "POST",
            success : mediaAdded,
            error : mediaAddFail,
            data : data
        })
    }

    function mediaAdded(data){
        console.log("Added")
    }

    function mediaAddFail(err){
        console.log(err)
    }

    function movieModal(id){
        req({
            url : 'http://localhost:7890/movie/'+id,
            method : "GET",
            type : "json",
            success : renderMovieModal,
            error : movieError
        })
        jQuery(mainModal).modal()
    }

    function movieError(err){
        console.log(err)
    }

    function renderMovieModal(data){
        currentMedia = data;
        console.log(data)
        data.posterLink = createImageLink(data.poster_path,300);
        mainModal.querySelector('.row').innerHTML = movieModalTemplate(data)
    }

    function makeSearchRequest(){
        var searchQuery = searchBox.value.trim();
        if(searchQuery.length < 3) return;

        req({
            url : 'http://localhost:7890/search',
            data : "query="+searchQuery,
            method : "GET",
            type : "json",
            success : renderSearch,
            error : searchError
        })
    }

    function createImageLink(link,size){
        if(!link) return '';
        if(size == 'original') return 'http://image.tmdb.org/t/p/'+size+link;
        return 'http://image.tmdb.org/t/p/w'+size+link;
    }

    function searchError(err){
        console.log("Search Error!");
        console.log(err);
    }

    function renderSearch(data){
        console.log(data)
        var ctx;
        mainDisplay.innerHTML = '';
        for(var i = 0, l = data.results.length; i < l; i++){
            ctx = data.results[i];
            if(hasLocalStorage){
                
            }
            ctx.backdropDisplay = createImageLink(ctx.backdrop_path, 600);
            mainDisplay.innerHTML += searchTemplate(ctx);
        }
    }

}(reqwest, Handlebars));