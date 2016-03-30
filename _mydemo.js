/**
 * @author svye&hsingleton
 */

//list of devices
//var deviceList = [
    //{ DeviceId: 'A-002', DeviceIp: '192.168.204.45' },
    //{ DeviceId: 'A-003', DeviceIp: '192.168.204.46' },
    //{ DeviceId: 'G-002', DeviceIp: '192.168.204.47' },
    //{ DeviceId: 'G-003', DeviceIp: '192.168.204.48' },
//];


//<!--Script for Posting EMS Login Request-->
JSONTest = function() {

    var resultDiv = $("#resultDivContainer");
	$.crossDomain = true;
    $.ajax({
        url: "http://192.168.204.45:8080/tvm/state/1.0/startMaintenance",
        type: "POST",
        data: "\{\"level\":2, \"agentId\":\"2222\",\"order\":\"1\"\}",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            switch (result) {
                case true:
                    processResponse(result);
                    break;
                default:
                    resultDiv.html(result);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
        }
    });
};

var test = setInterval(function() {StateRequest();},10000);
var rt = "";
//<!--Script for getting the TVM State every 2 seconds-->     
function StateRequest()
    {	
	  var theUrl = "http://192.168.204.46:8080/tvm/state/1.0/";
	  var xmlHttp = new XMLHttpRequest();
	  var statusInformation = "...waiting...";
	   setInterval('stateRequest()',5000);
	  xmlHttp.open( "GET", theUrl, false );
	  if (xmlHttp.onreadyStatechange === xmlHttp.status === 200)
	  {
	  xmlHttp.send( null );
	  }
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
	 //return xmlHttp;

 //<!--Script for getting the TVM raised Alarms Every 20 seconds-->    
    //setInterval(function(){	
	    //var theUrl = "http://192.168.204.45:8082/tvm/supervisor/1.0/alarms/get/";
	//    var xmlHttp = new XMLHttpRequest();
	//    xmlHttp.open( "POST", theUrl, false );
	//    xmlHttp.send( null );
	//    xmlHttp.setRequestHeader("Content-Type", "text/html; charset=ISO-8859-1");
	    //xmlHttp.timeout = 30000; // time in milliseconds
	//    document. getElementById('alarms')
	//    	.innerHTML = xmlHttp.responseText;
  //  },3000);
    
$('.div:contains("\"degraded"\":true,")').css('background-color', 'orange');