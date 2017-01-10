function loadBlacklist() {   
    
    // LOADING blacklist
    var blacklist_url = '/webgivi/blacklist_output.php';    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET" ,blacklist_url, false ); // false for synchronous request
    xmlHttp.send( null );
    var blacklisttext = xmlHttp.responseText;  
    //alert(blacklisttext);

    
    // listing all blacklist terms in blacklistDict{}
    var blacklistList=[];
    d3.text(blacklisttext, function (text){

            var lines = blacklisttext.split("\n");
            var skipline = "#TIME:";
            for (var i = 0; i < lines.length; ++i) {
                if (!(lines[i].substring(0, skipline.length) === skipline) && lines[i].trim()){
                    blacklistList.push(lines[i]);                
                }
            }
            
            var showString = "";
            for (var i=0; i< blacklistList.length; i++){
                showString += blacklistList[i]+"\n";
            }
            $("#blacklist_txt").val(showString);

    });


    function savelist(){
        //alert($("#blacklist_txt").val());
        currentlist = $("#blacklist_txt").val();
        var lines = currentlist.split("\n");
        var saveString ="";
        for (var i = 0; i < lines.length; ++i){
            if (lines[i].trim()){
                saveString += lines[i]+"\n";    
            }                
        }

        $.ajax({
            url: '/webgivi/updateblacklist.php',
            type: 'POST',
            data: {
                txt: saveString
            },
            dataType: "text",
            beforeSend: function () {
                $('#wait').show();
            },
            success: function () {
                $('#wait').hide();
            },
            error: function () {
                $('#wait').hide();
                alert("failure");
            }
        });

    };

    
    // reload the blacklist textarea
    $("#reload").off().click(function () {
        loadOriginallist();
    });

    // save the blacklist textarea
    $("#save").off().click(function () {
        savelist();
    });

    // save and exit
    $("#save_exit").off().click(function () {
        savelist();
        window.close();
    });
    
    //loadOriginallist();


    function loadOriginallist(){

        var blacklistList=[];
    
        d3.text(blacklisttext, function (text){

            var lines = blacklisttext.split("\n");
            var skipline = "#TIME:";
            for (var i = 0; i < lines.length; ++i) {
                if (!(lines[i].substring(0, skipline.length) === skipline) && lines[i].trim()){
                    blacklistList.push(lines[i]);                
                }
            }
            
            var showString = "";
            for (var i=0; i< blacklistList.length; i++){
                showString += blacklistList[i]+"\n";
            }
            $("#blacklist_txt").val(showString);

        });

       
    }

}
