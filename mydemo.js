/**
 * @author svye&hsingleton
 */

//list of devices
//var deviceList = [
    //{ DeviceId: 'A-002', URL: 'http://192.168.204.45:8080/tvm/tvm/state/1.0/' },
    //{ DeviceId: 'A-003', URL: 'http://192.168.204.45:8080/tvm/tvm/state/1.0/' },
    //{ DeviceId: 'G-002', URL: 'http://192.168.204.45:8080/tvm/tvm/state/1.0/' },
    //{ DeviceId: 'G-003', URL: 'http://192.168.204.45:8080/tvm/tvm/state/1.0/' },
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

function StateRequest()
{ 
	//the status information string
	var statusInformation = "...waiting...";
	
	//the background colour for the status
	var theBackground = "green";
	
	//the request and url
	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://192.168.204.45:8080/tvm/state/1.0/";
	
	//The open asynchronous call (as it is set to true), which is needed for the callback 
	// ready state change event handler
	xmlHttp.open("GET", theUrl, true);
	
	//the ready state change event handler for the request
	//with the function to change the colour and information string to be displyed
	xmlHttp.onreadystatechange = function()
	{
		//State and status check
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
		{ 
			//check request string length, if greater than 0, then it has something in it so parse accordingly
			if(xmlHttp.responseText.length > 0)
			{
				var burglary = xmlHttp.responseText.indexOf("\"\burglary\"\:true",0);
				if(burglary != -1) 
				{
					theBackground = "red";
					statusInformation = "Burglary"; 
				}
				else
				{
					var outOfOrder = xmlHttp.responseText.indexOf("\"\outOfOrder\"\:true",0);
					if(outOfOrder != -1)
					{
						theBackground = "red";
						statusInformation = "Out of Order";
					}
					else 
					{
						var degraded = xmlHttp.responseText.indexOf("\"\degraded\"\:true",0);
						if(degraded != -1)
						{
							theBackground = "orange";
							statusInformation = "Degraded";
						}
						else
						{
							theBackground = "green";
							statusInformation = "Full Service";
						}
					}
				}
			}
			else
			{
				//request response string is empty so display error
				theBackground = "red";
				statusInformation = "No Server Information"; 
			}
		}
		else
		{
			//request has not returned ready and ok state so display error
			theBackground = "red";
			statusInformation = "Not Ready State"; 
		}
		if (xmlHttp.readyState == null)
		{
				theBackground = "red";
				statusInformation = "No Response"; 			
		}
	//The element to be updated with specified string and colour
	document.getElementById('1-state').style.backgroundColor = theBackground;
	document.getElementById('1-state').innerHTML = statusInformation;
	
	};
	
	//the send for the request (debate on where this should be specifed! whether is should be before or after the ready state change event handler)
	xmlHttp.send(null);

	
}	

//the function called within a timed interval, set at 5 secs for now
setInterval(StateRequest, 5000);
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
    