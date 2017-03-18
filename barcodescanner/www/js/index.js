var db = null;

window.onload = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
	document.getElementById('encoderesult').innerHTML="<img src='img/squares.gif' class='loadingimage'></p>";
}

function onDeviceReady() {
	//barcodescan();
	db = window.sqlitePlugin.openDatabase({name: 'barcode.db', location: 'default'});
}
function formatDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return date.getMonth()+1 + "/" + date.getDate() + "/" + parseInt(date.getFullYear().toString().substr(2)) + " " + strTime;
}

function barcodescan() {
	document.getElementById('encoderesult').innerHTML="";
	cordova.plugins.barcodeScanner.scan(
		
		function (result) {
			document.getElementById("outputcard").className += " show";
			document.getElementById("homepageicons").className += " active";
			document.getElementById("barcodevalue").innerHTML = result.text;
			document.getElementById("barcodeformat").innerHTML = result.format;
			if(result.format == "QR_CODE"){
				document.getElementById('qrlink').style.display = "inline";
				document.getElementById('barcodedecode').style.display = "none";
			}
			else {
				document.getElementById('qrlink').style.display = "none";
				document.getElementById('barcodedecode').style.display = "inline";
			}
			var curdate = new Date();
			var formatdate = formatDate(curdate);
			
			db.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS BarCodeTable (scandate, code, format)');
				tx.executeSql('INSERT INTO BarCodeTable VALUES (?,?,?)', [formatdate, result.text, result.format]);
			}, function(error) {
				window.plugins.toast.showWithOptions(
				{
					message: 'Transaction ERROR: ' + error.message,
					duration: "short",
					position: "bottom",
					addPixelsY: -150
				});
			}, function() {
				window.plugins.toast.showWithOptions(
				{
					message: 'Search history saved successfully',
					duration: "short",
					position: "bottom",
					addPixelsY: -150
				});
			});
		},
		function (error) {
			alert("Scanning failed: " + error);
		},
		{
			showFlipCameraButton : true,
			showTorchButton : true,
			resultDisplayDuration: 500
		}
	);
}

function cleardb(){
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM BarCodeTable");
	}, function(error) {
		window.plugins.toast.showWithOptions(
		{
			message: 'Transaction ERROR: ' + error.message,
			duration: "short",
			position: "bottom",
			addPixelsY: -150
		});
	}, function() {
		window.plugins.toast.showWithOptions(
		{
			message: 'History cleared successfully',
			duration: "short",
			position: "bottom",
			addPixelsY: -150
		});
	});
	populatedb();
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
				if(jsonout.status.message == "Product not found" || !jsonout.product.attributes || jsonout.status.code == "404") {
					document.getElementById('encoderesult').innerHTML = '<p><h5>Product not found!</h5></p>';
				}
				else {
					jsonoutput = '<p><h5>' + jsonout.product.attributes.product + '</h5></p>' +
							  '<p>' + jsonout.product.attributes.category_text + '</p>' +
							  '<p>' + jsonout.product.attributes.long_desc + '</p>' +
							  '<p>' + jsonout.product.attributes.features + '</p>' +
							  '<p>' + jsonout.product.attributes.binding + '</p>';
							  
					document.getElementById('encoderesult').innerHTML = "<p><img src=" + jsonout.product.image +"></p>";
					document.getElementById('encoderesult').innerHTML += jsonoutput;
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

function encodeqrcode() {
	var result = document.getElementById("barcodevalue").innerHTML;
	var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var match = result.match(urlRegex);
	var ref = window.open(match, '_blank', 'location=yes');
	ref.addEventListener('loadstart', function(event) { });
	ref.addEventListener('exit', cardclose);
}

function populatedb() {
	var tableout = "";
	$('#modal1').modal();
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM BarCodeTable ORDER BY scandate DESC LIMIT 10', [], function(tx, rs) {
			if(rs.rows.length == 0){
				tableout += "<tr><td><h5 class='red-text'>No records found!</h5></td></tr>";
			}
			else {
				for (var i=0; i < rs.rows.length; i++){
					row = rs.rows.item(i);
					tableout += "<tr class='teal-text'><td>" + row.scandate + "</td><td>" + row.code + "</td><td>" + row.format + "</td></tr>";
				}
			}
			document.getElementById('historytable').innerHTML = tableout;
		}, function(tx, error) {
			alert('SELECT error: ' + error.message);
		});
	});
}
