(function(req,Handlebars){
    var $ = function(sel){
        return document.querySelector(sel);
    }
    var $$ = function(sel){
        return document.querySelectorAll(sel);
    }

    var mediaTemplate = Handlebars.compile($('#media-template').innerHTML);


    req({
        url : 'http://jsonstub.com/list',
        headers : {
            'JsonStub-User-Key' : 'cfeae35a-70c9-45c3-9273-bc7ebc69cc03',
            'JsonStub-Project-Key' : 'dba6f9fa-8c55-46a5-8216-a56b8813d271'
        },
        type : 'json',
        method : 'GET',
        success : renderMedia,
        error : getListError
    })

    function getListError(err){
        console.log(err)
    }

    function renderMedia(data){
        console.log(data.length)
        $("#main-display").innerHTML = mediaTemplate(data);
    }


}(reqwest,Handlebars));