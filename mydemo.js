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

//Global array to store the device info
var deviceInfoArray = [];

function init()
{
	//Load DeviceList.xml
	var xhttp = new XMLHttpRequest(); 	
    xhttp.open("GET", "DeviceList.xml", false);
    xhttp.send();
    xmlDoc = xhttp.responseXML; 
    
    //Get the number of DeviceInfo elements
    var deviceCount = xmlDoc.getElementsByTagName("DeviceInfo").length;
    
    //initialise global device info array
    deviceInfoArray = [];
    
    //The following code is retrieving the device info and sticking it in an array of arrays 
    //(fun eh?) 
    //loop through the deviceinfo elements retrieving the specific information
	for (var i = 0; i < deviceCount; i++)
	{
		//get the text with tag of ID
		var _ID = xmlDoc.getElementsByTagName("ID")[i].childNodes[0].textContent;
		//get the text with the tag of IP
		var _IP = xmlDoc.getElementsByTagName("IP")[i].childNodes[0].textContent;
		//get the text with the tag of Devicetype
		var _DeviceType = xmlDoc.getElementsByTagName("DeviceType")[i].childNodes[0].textContent;
		//create new array object with the elements in	
		var arr = [_ID, _IP,_DeviceType];
		//Use the loop index to insert the array collection just constructed into the outer deviceInfoArray
		//array
		deviceInfoArray[i] = arr;
		//bit of debug code I've put in
		alert("device array1 " + deviceInfoArray[i][0]);
	}
	
	//bit more debug code
	alert("DIA: " + deviceInfoArray.length);
	
	//The following code is trying to extract the information from the array of arrays just constructed
	//(more fun eh?)
	//all of this may want to go into a seperate function
	//this is probabaly where the table would be created and paopulated as well
	//Loop through the deviceInfoArray to extract info
    for(var i=0; i < deviceInfoArray.length; i++)
    {
    	var dr = [];
    	//get the device info using the index on the outer array
    	dr = deviceInfoArray[i];	
    	//debug code again
    	alert(dr.length);
    	//looping through the elements of the inner array using the length
    	for (var j=0; j <dr.length; j++)
    	{
    		//debug, probably where the table will be organised\created?
			alert(dr[j]);
    	}
    }
}

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
    