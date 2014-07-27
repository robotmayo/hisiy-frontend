(function(req,Handlebars){
    var $ = function(sel){
        return document.querySelector(sel);
    }
    var $$ = function(sel){
        return document.querySelectorAll(sel);
    }


    var templates = {
        seenMedia : Handlebars.compile($("#seen-media-template").innerHTML),
        unseenMedia : Handlebars.compile($("#unseen-media-template").innerHTML),
        watchingMedia : Handlebars.compile($("#watching-media-template").innerHTML)
    }
    var mainDisplay = $('#main-display');

    var mediaList = [];
    var mediaListPointer = 0;
    function Media(media){
        this.data = media;
        mediaList.push(this);
    }

    Media.prototype.render = function() {
        if(this.el){
            // Update code here
        }else{
            var dummyEl = document.createElement('div');
            if(this.data.seen === true){
                dummyEl.innerHTML = templates.seenMedia(this.data).trim();
                this.el = mainDisplay.appendChild(dummyEl.childNodes[0]);
            }else if(this.data.seen === false){
                console.log(this.data.seen)
                dummyEl.innerHTML = templates.unseenMedia(this.data).trim();
                console.log(dummyEl.childNodes[0])
                this.el = mainDisplay.appendChild(dummyEl.childNodes[0]);
                //dummyEl = null;
            }
        }
    };

    req({
        url : 'http://localhost:7890/list',
        type : 'json',
        method : 'GET',
        success : renderMedia,
        error : getListError
    })

    function getListError(err){
        console.log(err)
    }

    function renderMedia(data){
        console.log(data)
        var m;
        for (var i = 0, l = data.length; i < l; i++) {
            m = new Media(data[i]);
            m.render();
        }
    }

    function fetch(key,val,arr){
        return arr.filter(function(v){
            return v[key] = val;
        })[0]
    }


}(reqwest,Handlebars));