window.onload = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
	barcodescan();
}

function onDeviceReady() {
    this.receivedEvent('deviceready');
	this.barcodescan();
}

function receivedEvent(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
}
	
function barcodescan() {
	alert(8);
	cordova.plugins.barcodeScanner.scan(
		alert(9);
		function (result) {
			alert("We got a barcode\n" +
			"Result: " + result.text + "\n" +
			"Format: " + result.format + "\n" +
			"Cancelled: " + result.cancelled);
		},
		function (error) {
			alert("Scanning failed: " + error);
		},
		{
			preferFrontCamera : true,
			showFlipCameraButton : true,
			showTorchButton : true,
			torchOn: true,
			prompt : "Place a barcode inside the scan area",
			resultDisplayDuration: 500,
			formats : "QR_CODE,PDF_417",
			orientation : "landscape"
		}
	);
}
	
