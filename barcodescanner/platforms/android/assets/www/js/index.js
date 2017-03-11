window.onload = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
	document.getElementById('encoderesult').innerHTML="<img src='img/squares.gif' class='loadingimage'></p>"
}

function onDeviceReady() {
	//barcodescan();
}
	
function barcodescan() {
	cordova.plugins.barcodeScanner.scan(
		
		function (result) {
			document.getElementById("outputcard").className += " show";
			document.getElementById("homepageicons").className += " active";
			document.getElementById("barcodevalue").innerHTML = result.text;
			document.getElementById("barcodeformat").innerHTML = result.format;
			
			/*cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, result.text, function(success) {
				alert("encode success: " + success);
			  }, function(fail) {
				alert("encoding failed: " + fail);
			  }
			);*/
		},
		function (error) {
			alert("Scanning failed: " + error);
		},
		{
			//preferFrontCamera : true,
			showFlipCameraButton : true,
			showTorchButton : true,
			//torchOn: true,
			//prompt : "Place a barcode inside the scan area",
			resultDisplayDuration: 500,
			//formats : "QR_CODE,PDF_417",
			//orientation : "landscape"
		}
	);
}

function cardclose() {
	document.getElementById("outputcard").className = "row outputcard";
	document.getElementById("homepageicons").className = "homepageicons";
	document.getElementById("encoderesult").innerHTML = "";
}

function encodebarcode() {
	var result = document.getElementById("barcodevalue").innerHTML;
	document.getElementById('encoderesult').innerHTML="<img src='img/squares.gif' class='loadingimage'></p>"
	document.getElementById('encoderesult').style.opacity = 1;
	
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
			    var jsonout = JSON.parse(xmlhttp.responseText);
				if(jsonout.status.message != "Product not found") {
					jsonoutput = '<p><h5>' + jsonout.product.attributes.product + '</h5></p>' +
							  '<p>' + jsonout.product.attributes.category_text + '</p>' +
							  '<p>' + jsonout.product.attributes.long_desc + '</p>' +
							  '<p>' + jsonout.product.attributes.features + '</p>' +
							  '<p>' + jsonout.product.attributes.binding + '</p>';
							  
					document.getElementById('encoderesult').innerHTML = "<p><img src=" + jsonout.product.image +"></p>";
					document.getElementById('encoderesult').innerHTML += jsonoutput;
				}
				else {
					document.getElementById('encoderesult').innerHTML = '<p><h5>' + jsonout.status.message + '!</h5></p>';
				}
           }
           else if (xmlhttp.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('Please check your internet connectivity');
           }
        }
    };

    xmlhttp.open("GET", "http://eandata.com/feed/?v=3&keycode=7F35D39458C459F1&mode=json&find=" + result, true);
    xmlhttp.send();
}

//7F35D39458C459F1
//
	
