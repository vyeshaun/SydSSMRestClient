/**
 * @author svye&hsingleton
 */

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
	for (var deviceInfoArrIdx = 0; deviceInfoArrIdx < deviceCount; deviceInfoArrIdx++)
	{
		//get the text with tag of ID
		var _ID = xmlDoc.getElementsByTagName("ID")[deviceInfoArrIdx].childNodes[0].textContent;
		//get the text with the tag of IP
		var _IP = xmlDoc.getElementsByTagName("IP")[deviceInfoArrIdx].childNodes[0].textContent;
		//get the text with the tag of Devicetype
		var _DeviceType = xmlDoc.getElementsByTagName("DeviceType")[deviceInfoArrIdx].childNodes[0].textContent;
		//get the text with the tag default status 
		var _DeviceStatus = xmlDoc.getElementsByTagName("DefaultStatus")[deviceInfoArrIdx].childNodes[0].textContent;
		//create new array object with the elements in	
		var arr = [_ID, _IP,_DeviceType, _DeviceStatus];
		//Use the loop index to insert the array collection just constructed into the outer deviceInfoArray
		//array
		deviceInfoArray[deviceInfoArrIdx] = arr;
	}
	
	//The following code is trying to extract the information from the array of arrays just constructed
	//(more fun eh?)
	//all of this may want to go into a seperate function
	//this is probabaly where the table would be created and populated as well
	//get the table
	var tableBody = document.getElementById("DeviceListTable");
	
	//Loop through the deviceInfoArray to extract info
    for(var outerArrIdx = 0; outerArrIdx < deviceInfoArray.length; outerArrIdx++)
    {
		var rowContents = [];
		//get the device info using the index on the outer array 
		rowContents = deviceInfoArray[outerArrIdx];
		//create the row element
		var tr = document.createElement('TR');
		//looping through the elements of the inner array using the length
		for (var innerArrIdx=0; innerArrIdx <rowContents.length; innerArrIdx++)
		{
			//create the cells 
			var td = document.createElement('TD');
			//create an identifier for the cell
			var IDAttr = '';
			//create the name for the attr using the outer array index
			switch(innerArrIdx)
			{
				case 0:
					IDAttr = 'DeviceID' + outerArrIdx;
					break;
				case 1:
					IDAttr = 'DeviceIP'+ outerArrIdx;
					break;
				case 2:
					IDAttr = 'DeviceType'+ outerArrIdx;
					break;
				case 3:
					IDAttr = 'DeviceStatus'+ outerArrIdx;
					break;
			}
			//set the identifier
			td.id = IDAttr;
			//add the text from the xml file into the cell
			td.appendChild(document.createTextNode(rowContents[innerArrIdx]));
			//add the cell to the row
			tr.appendChild(td);
			
		}
		//add the row to the table
		tableBody.appendChild(tr);
    }
}

function UpdateState()
{
	//get rows from table
	var rows = document.getElementsByTagName('TR');
	//minus 1 for the headers
	var rowsCount = (rows.length -1);
	//loop round the rows
	for(var tableRowIdx = 0; tableRowIdx < rowsCount; tableRowIdx++)
	{
		//get the device status cell
		var statusCellID = 'DeviceStatus' + tableRowIdx;
		//get the ip cell
		var IPCellID = 'DeviceIP' + tableRowIdx;
		//get the information in the ip cell
		var CellInfo = document.getElementById(IPCellID).innerHTML;
		//create an empty array for status info
		var statusInfo = [];
		//the url string without the IP
		var theUrl = "http://:8080/tvm/state/1.0/";
		//split the url string out and stick the ip from the ip cell where required
		var IPString = theUrl.substr(0, 7) + CellInfo + theUrl.substr(7);
		//get the status of the device using the construucted url string and pass in the cell id to update
		statusInfo = StateRequest(IPString, statusCellID);
	}
}

function StateRequest(IPString, statusCellID)
{ 
	//the status information string
	var statusInformation = "...waiting...";
	
	//the background colour for the status
	var theBackground = "green";
	
	//the request and url
	var xmlHttp = new XMLHttpRequest();
	//use the string of the url passed in
	var theUrl = IPString;
	
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
				var burglary = xmlHttp.responseText.indexOf("\"burglary\":true",0);
				if(burglary != -1) 
				{
					theBackground = "red";
					statusInformation = "Burglary"; 
				}
				else
				{
					var outOfOrder = xmlHttp.responseText.indexOf("\"outOfOrder\":true",0);
					if(outOfOrder != -1)
					{
						theBackground = "red";
						statusInformation = "Out of Order";
					}
					else 
					{
						var degraded = xmlHttp.responseText.indexOf("\"degraded\":true",0);
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
			statusInformation = "Disconnected/Not Ready"; 
		}
		if (xmlHttp.readyState == null)
		{
				theBackground = "red";
				statusInformation = "No Response"; 			
		}
		
		//update the status cell with the information returned by the state request
		document.getElementById(statusCellID).style.backgroundColor = theBackground;
		document.getElementById(statusCellID).innerHTML = statusInformation;
	};
	
	//the send for the request (debate on where this should be specifed! whether is should be before or after the ready state change event handler)
	xmlHttp.send(null);
}

//the function called within a timed interval, set at 5 secs for now
setInterval(UpdateState, 5000);


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
    