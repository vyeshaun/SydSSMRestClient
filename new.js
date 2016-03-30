var test = setInterval(function() {StateRequest();},10000);
var rt = "";
//<!--Script for getting the TVM State every 2 seconds-->     
function StateRequest()
    {	
	  var theUrl = "http://192.168.204.45:8080/tvm/state/1.0/";
	  var xmlHttp = new XMLHttpRequest();
	  var statusInformation = "...waiting...";
	   setInterval('stateRequest()',5000);
	  xmlHttp.open( "GET", theUrl, false );
	  xmlHttp.send( null );
	  document.getElementById('state').innerHTML = xmlHttp.responseText;
	  document. getElementById('state').rt = statusInformation;
	  var rt = xmlHttp.responseText;
	  var x = document.getElementById('state').style;
	  //xmlHttp.timeout = 30000; // time in milliseconds
			//var x = document.getElementById('state').style;
	   	 	var burglary = rt.indexOf("\"\burglary\"\:true",0);
	    	if(rt.length > 0)
	    		{
	    		if(burglary != -1)
	    			{	    		
	   				x.backgroundColor = "red";
	    			statusInformation = "Burglary";	
	    			}
	    		else
	    			{
	    			var outOfOrder = rt.indexOf("\"\outOfOrder\"\:true",0);
	    			if(outOfOrder != -1)
	    				{
	    				x.backgroundColor = "red";
	    				statusInformation = "Out of Order";
	    				}
	    			else 
	    				{
	    				var degraded = rt.indexOf("\"\degraded\"\:true",0);
	    				if(degraded != -1)
	    					{
	    					x.backgroundColor = "orange";
	    					statusInformation = "Degraded";
	    					}
	    				else
	    					{
	    					x.backgroundColor = "green";
	    					statusInformation = "Full Service";
	    					}
	    				}
	    			}
	    		}
	    	else
	    		{
	    		x.backgroundColor = "red";
	    		statusInformation = "No Response";	
	    		}
	    	document. getElementById('state').innerHTML = statusInformation;
}