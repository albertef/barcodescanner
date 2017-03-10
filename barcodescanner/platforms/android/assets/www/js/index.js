window.onload = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
	//barcodescan();
}
	
function barcodescan() {
	cordova.plugins.barcodeScanner.scan(
		
		function (result) {
			console.log("test");
			var out = "We got a barcode\n" +
			"Result: " + result.text + "\n" +
			"Format: " + result.format + "\n" +
			"Cancelled: " + result.cancelled;
			
			document.getElementById("barcoderesult").innerHTML = out;
			
			cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, result.text, function(success) {
				alert("encode success: " + success);
			  }, function(fail) {
				alert("encoding failed: " + fail);
			  }
			);
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
	
