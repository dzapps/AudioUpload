 
 var generateCopyURL = function(_id) {
    var songURL = window.location.protocol + '//' + window.location.host + '/files/' + _id;
	var songURL_DOM_ID = '#' + _id + '-url';
    var songURLBox_DOM_ID = '#' + _id + '-urlbox';

     $(document).ready(function(){
     	$(songURL_DOM_ID).val(songURL);
     });
        
        $(songURLBox_DOM_ID).click(function(){$(songURL_DOM_ID).select();
    });
        $(songURLBox_DOM_ID).vmousedown(function(){$(songURL_DOM_ID).select();
    });

        $(songURLBox_DOM_ID).mouseleave(function(){$(songURL_DOM_ID).blur();
    });
}

var OpenURL = function(_id) {
    var songURL = window.location.protocol + '//' + window.location.host + '/files/' + _id;

    window.open(songURL,"","width=600,height=300");
}
