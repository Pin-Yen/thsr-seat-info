function displayStationStatus(wrapper, stationStatus, seatType) {
  var cartype = document.createElement("div");
  cartype.className = 'cell car-type';
  cartype.innerHTML = seatType == 'standard' ? "標準艙" : "商務艙";

  $(wrapper).append(cartype);

  stations.forEach(function(s) {
    var station = document.createElement("div");
    station.className = 'cell station';

    switch (stationStatus[s]) {
      case 'F':
        station.innerHTML = '✖';
        station.style.color = '#f43029';
        break;
      case 'L':
        station.innerHTML = '▲';
        station.style.color = '#f5fc2a';
        break;
      case 'A':
        station.innerHTML = '𐩒';
        station.style.color = '#33d6d3';
        break;
      default:
        station.innerHTML = '-';
        station.style.color = 'white';
    }

    $(wrapper).append(station);
  });
}
// table header
var header = document.getElementById('header');
header.id = 'header';

var trainNo = document.createElement("div");
trainNo.className = 'cell train-no';
trainNo.innerHTML = '車次';

var deptTime = document.createElement("div")
deptTime.className = 'cell dept-time';
deptTime.innerHTML = '發車時間';

var dest = document.createElement("div")
dest.className = 'cell dest';
dest.innerHTML = '開往';
$(header).append(trainNo).append(deptTime).append(dest);

var cartype = document.createElement("div");
cartype.className = 'cell car-type-header';
$(header).append(cartype);

// add station headers
var stations = ["南港","台北","板橋","桃園","新竹","苗栗","台中","彰化","雲林","嘉義","台南","左營"];
var stationIds = ["0990", "1000", "1010", "1020", "1030", "1035", "1040", "1043", "1047", "1050", "1060", "1070"];

for (var i = 0; i < stations.length; ++i) {
  var station = document.createElement("div");
  station.className = 'cell station-header';
  station.innerHTML = stations[i];
  station.stationId = stationIds[i];
  station.addEventListener('click', function(e){
    $('body, .station-header').css("cursor", "progress");
    fetchData(e.currentTarget.stationId);
  });
  $(header).append(station);
}

function updateTable(data) {
  // remove old data
  $('.train-row').remove();

  // sort data according to departure time
  data.AvailableSeats.sort(function(a, b){
    return a.DepartureTime.toString() > b.DepartureTime.toString() ? 1: -1;
  });

  data.AvailableSeats.forEach(function(seats) {
    var row = document.createElement("div");
    row.className = 'train-row';

    var trainNo = document.createElement("div");
    trainNo.className = 'cell train-no';
    trainNo.innerHTML = seats.TrainNo;

    var deptTime = document.createElement("div")
    deptTime.className = 'cell dept-time';
    deptTime.innerHTML = seats.DepartureTime ;

    var dest = document.createElement("div")
    dest.className = 'cell dest';
    dest.innerHTML = seats.EndingStationName['Zh_tw'];

    $(row).append(trainNo).append(deptTime).append(dest);

    var stationStatusStd = {"左營":'N',"台南":'N',"嘉義":'N',"雲林":'N',"彰化":'N',"台中":'N',"苗栗":'N',"新竹":'N',"桃園":'N',"板橋":'N',"台北":'N',"南港":'N'},
    		stationStatusBus = {"左營":'N',"台南":'N',"嘉義":'N',"雲林":'N',"彰化":'N',"台中":'N',"苗栗":'N',"新竹":'N',"桃園":'N',"板橋":'N',"台北":'N',"南港":'N'};

    seats.StopStations.forEach(function(seat) {
      stationStatusStd[seat.StationName['Zh_tw']] = seat.StandardSeatStatus.charAt(0);
      stationStatusBus[seat.StationName['Zh_tw']] = seat.BusinessSeatStatus.charAt(0);
    });

    // standard
    var stdWrapper = document.createElement("div");
    stdWrapper.className = 'seat-availability-wrapper standard'
    displayStationStatus(stdWrapper, stationStatusStd, "standard");

    var busWrapper = document.createElement("div");
    busWrapper.className = 'seat-availability-wrapper business'
    displayStationStatus(busWrapper, stationStatusBus, "business");

    $(row).append(stdWrapper).append(busWrapper);
    $('#table').append(row);
  })
}

function fetchData(stationId) {
  var request = new XMLHttpRequest();
  request.open('GET',`http://ptx.transportdata.tw/MOTC/v2/Rail/THSR/AvailableSeatStatusList/${stationId}?$top=300&$format=JSON`);

  request.onreadystatechange = function() {
    if (request.readyState != 4 || request.status != 200) return;

    updateTable(JSON.parse(request.responseText)[0]);

    $("body").css("cursor", "default");
    $('.station-header').css("cursor", "pointer");
  }

  request.send();
}