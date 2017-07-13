
// function fetchData(stationId){
// 	var request = new XMLHttpRequet();

// 	return data;
// }
var stationsNB = ["左營","台南","嘉義","雲林","彰化","台中","苗栗","新竹","桃園","板橋","台北","南港"];
var stationNBindex = {"左營":0,"台南":1,"嘉義":2,"雲林":3,"彰化":4,"台中":5,"苗栗":6,"新竹":7,"桃園":8,"板橋":9,"台北":10,"南港":11};
function displayStationStatus(wrapper, stationStatus, seatType) {
	var cartype = document.createElement("div");
	cartype.className = 'car-type';
	if(seatType == 'standard')
		cartype.innerHTML = "標準艙";
	else if(seatType == 'business')
		cartype.innerHTML = "商務艙";

	$(wrapper).append(cartype);

	for (var k = 0; k < stations.length; ++k) {
		var station = document.createElement("div");
		station.className = 'w3-cell station ' + seatType;
		if (stationStatus[stations[k]] == 'F') {
			station.innerHTML = '✖';
			station.style.color = '#f43029';
		}
		else if (stationStatus[stations[k]] == 'L') {
			station.innerHTML = '▲';
			station.style.color = '#f5fc2a';

		}
		else if (stationStatus[stations[k]] == 'A') {
			station.innerHTML = '𐩒';
			station.style.color = '#33d6d3';
		}
		else if (stationStatus[stations[k]] == 'N') {
			station.innerHTML = '-';
			station.style.color = 'white'
		}
		$(wrapper).append(station);
	}
}
// table header
var header = document.createElement("div");
header.className = 'w3-cell-row table-header';
header.id = 'header';

var trainNo = document.createElement("div");
trainNo.className = 'w3-cell train-no-header';
trainNo.innerHTML = '車次';

var deptTime = document.createElement("div")
deptTime.className = 'w3-cell dept-time-header';
deptTime.innerHTML = '發車時間';

var dest = document.createElement("div")
dest.className = 'w3-cell dest-header';
dest.innerHTML = '開往';
$(header).append(trainNo).append(deptTime).append(dest);


var cartype = document.createElement("div");
cartype.className = 'car-type-header';
$(header).append(cartype);

// add station headers
var stations = ["南港","台北","板橋","桃園","新竹","苗栗","台中","彰化","雲林","嘉義","台南","左營"];
var stationIds = ["0990", "1000", "1010", "1020", "1030", "1035", "1040", "1043", "1047", "1050", "1060", "1070"];

for (var i = 0; i < stations.length; ++i) {
	var station = document.createElement("div");
	station.className = 'w3-cell station-header';
	station.innerHTML = stations[i];
	station.stationId = stationIds[i];
	station.addEventListener('click', function(e){
		console.log('clicked');
		fetchData(e.currentTarget.stationId);
	});
	$(header).append(station);
}

$(header).insertBefore('.table');



function updateTable(data) {
	// remove old data
	$('.train-row').remove();
	
	// sort data according to departure time
	data.AvailableSeats.sort(function(a, b){
		return a.DepartureTime.toString() > b.DepartureTime.toString() ? 1: -1;
	});

	for (var i = 0; i < data.AvailableSeats.length; ++i) {
		var row = document.createElement("div");
		row.className = 'w3-cell-row train-row';

		var trainNo = document.createElement("div");
		trainNo.className = 'w3-cell train-no';
		trainNo.innerHTML = data.AvailableSeats[i].TrainNo;

		var deptTime = document.createElement("div")
		deptTime.className = 'w3-cell dept-time';
		deptTime.innerHTML = data.AvailableSeats[i].DepartureTime ;

		var dest = document.createElement("div")
		dest.className = 'w3-cell dest';
		dest.innerHTML = data.AvailableSeats[i].EndingStationName['Zh_tw'];

		$(row).append(trainNo).append(deptTime).append(dest);

		var stationStatusStd = {"左營":'N',"台南":'N',"嘉義":'N',"雲林":'N',"彰化":'N',"台中":'N',"苗栗":'N',"新竹":'N',"桃園":'N',"板橋":'N',"台北":'N',"南港":'N'};
		var stationStatusBus = {"左營":'N',"台南":'N',"嘉義":'N',"雲林":'N',"彰化":'N',"台中":'N',"苗栗":'N',"新竹":'N',"桃園":'N',"板橋":'N',"台北":'N',"南港":'N'};

		for (var k = 0; k < data.AvailableSeats[i].StopStations.length; ++k) {
			// standard seats
			if (data.AvailableSeats[i].StopStations[k].StandardSeatStatus == 'Full')
				stationStatusStd[data.AvailableSeats[i].StopStations[k].StationName['Zh_tw']] = 'F';
			else if (data.AvailableSeats[i].StopStations[k].StandardSeatStatus == 'Limited')
				stationStatusStd[data.AvailableSeats[i].StopStations[k].StationName['Zh_tw']] = 'L';
			else if (data.AvailableSeats[i].StopStations[k].StandardSeatStatus == 'Available')
				stationStatusStd[data.AvailableSeats[i].StopStations[k].StationName['Zh_tw']] = 'A';
		// business seats
		if (data.AvailableSeats[i].StopStations[k].BusinessSeatStatus == 'Full')
			stationStatusBus[data.AvailableSeats[i].StopStations[k].StationName['Zh_tw']] = 'F';
		else if (data.AvailableSeats[i].StopStations[k].BusinessSeatStatus == 'Limited')
			stationStatusBus[data.AvailableSeats[i].StopStations[k].StationName['Zh_tw']] = 'L';
		else if (data.AvailableSeats[i].StopStations[k].BusinessSeatStatus == 'Available')
			stationStatusBus[data.AvailableSeats[i].StopStations[k].StationName['Zh_tw']] = 'A';
		}

		// standard
		var stdWrapper = document.createElement("div");
		stdWrapper.className = 'seat-availability-wrapper'
		displayStationStatus(stdWrapper, stationStatusStd, "standard");

		var busWrapper = document.createElement("div");
		busWrapper.className = 'seat-availability-wrapper'
		displayStationStatus(busWrapper, stationStatusBus, "business");
		$(row).append(stdWrapper).append(busWrapper);
		$('.table').append(row);
	}
}

function fetchData(stationId) {
	var request = new XMLHttpRequest();
	request.open('GET',`http://ptx.transportdata.tw/MOTC/v2/Rail/THSR/AvailableSeatStatusList/${stationId}?$top=300&$format=JSON`);
	
	request.onreadystatechange = function() {
		if (request.readyState != 4 || request.status != 200)
			return;

		updateTable(JSON.parse(request.responseText)[0]);
	}

	request.send();
}
