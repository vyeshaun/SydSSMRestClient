
//<!--Script for getting the TVM State every 2 seconds-->     
function StateRequest()
    {	
	    var theUrl = "http://192.168.204.47:8080/tvm/state/1.0/";
	    var xmlHttp = new XMLHttpRequest();
	    var statusInformation = "...waiting...";
	   	var rt = xmlHttp.responseText;
	    xmlHttp.timeout = 30000; // time in milliseconds
	   	document. getElementById('state').innerHTML = statusInformation;
	}
	
	function ReadyRequest()
	{
		get readyState
	}
