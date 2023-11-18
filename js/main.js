var imageUrl = '';
var random = new Date().getTime();
var delay = 0.5;
var counter = 0;
var buffer = new Image; 

var isDepartures = true;

//Flight Info Section
var minSinceLastFlightUpdate = 0;
var airlineCodes = {
    AC: 'ACA',
    PD: 'POE',
    TS: 'TSC',
    "3H": 'AIE',
    QK: 'ACA',
    TU: 'TAR',
    AF: 'AFR',
    LH: 'DLH',
    AA: 'AAL',
    "5T": 'AKT',
    WS: 'WJA',
    F8: 'FLE',
    PB: 'PVL',
    DL: 'DAL',
    UA: 'UAL',
    BA: 'BAW',
    QR: 'QTR',
    EK: 'UAE',
    KL: 'KLM',
    AT: 'RAM',
    AM: 'AMX',
    WG: 'SWG',
    Y9: 'DAT',
    AH: 'DAH',
    PJ: 'SPM',
    OS: 'AUA',
    LX: 'SHR'
}

function loadFlights(departures = isDepartures){
    departures ? loadDepartures() : loadArrivals();
}

function loadDepartures(startID = 0){
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://www.skyscanner.ca/g/arrival-departure-svc/api/airports/yul/departures?locale=en-US',
        method: 'GET'
    };

    $('#tableauvols-tbody').empty();
    $('#tableauvols-arrival-thead').hide();
    $('#tableauvols-departure-thead').show();

    
    $.ajax(settings).done(function (response) {
        try {
            var airportCode = response['airportInfo']['iataCode'];
            var departures = response['departures']; 
    
            var flightStates = {
                IN_AIR: 'Departed',
                OUT_GATE: 'Taxiing',
                IN_GATE: 'Boarding',
                SCHEDULED: '-',
                DELAYED: 'Delayed',
                LANDED: 'Landed',
                CANCELLED: 'Cancelled'
            }
    
            console.log(response);
            console.log(airportCode);
    
            $('#airportIDHeader').text(airportCode + ' Flight Information');
    
            for (let i = startID; i < departures.length; i++) {
                const flight = departures[i];
                
                //console.log(flight);
    
                var flightDepartureTime = flight['localisedScheduledDepartureTime'];
                var flightEstimatedDepartureTime = flight['localisedEstimatedDepartureTime'] ?? flightDepartureTime;
    
                var airlineID = airlineCodes[flight['airlineId']] ?? (airlineCodes[flight['flightNumber'].slice(0, 2)] ?? flight['airlineId']);
                var airlineCompany = flight['airlineName'];
    
                var flightNumber = flight['flightNumber'];
                var flightDest = flight['arrivalAirportCode'];
                var flightDestLong = flight['arrivalAirportName'];
                var flightState = flightStates[flight['status']] ?? flight['status'];
                var flightGate = flight['boardingGate'] ?? '';
                
                var airlineLogo = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x.png` : '';
                var airlineLogoAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x.png` : '';
                var airlineLogoAltAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x.png` : '';
                var flightFollow = `https://www.admtl.com/en/flights/sms-service?vol=${flightNumber}`;

                try {
                    var onTime = `<td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>`
                    var revisedTime = `<td class="tab-col2"><span class="hr" aria-hidden="true">${Date.parse(flightEstimatedDepartureTime)}</span><time class="tableauvols-datetime" datetime="${flightEstimatedDepartureTime}"><span class="tableauvols-hours tableauxvols-medium">${flightEstimatedDepartureTime.slice(-5)}</span><span class="tableauvols-date tableauxvols-medium">${new Date(flightEstimatedDepartureTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"})}</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail ${flightNumber}</button></td>`
                    var tr =    `<tr class="tableauvols-row tab-skin1-row" flight-index="${i}">
                                    <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">${Date.parse(flightDepartureTime)}</span><time class="tableauvols-datetime" datetime="${flightDepartureTime}"><span class="tableauvols-hours tableauxvols-normal">${flightDepartureTime.slice(-5)}</span><span class="tableauvols-date tableauxvols-normal">${new Date(flightDepartureTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"})}</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail ${flightNumber}</button></td>
                                    ${flightDepartureTime == flightEstimatedDepartureTime ? onTime : revisedTime}
                                    <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="${airlineLogo}" alt="${airlineCompany}" onerror='this.onerror=null;this.src="${airlineLogoAlt}"'; " ${airlineLogo == '' ? 'hidden' : ''}><span class="visually-hidden text-for-search" aria-hidden="true">Company ${airlineCompany} </span></td>
                                    <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>${flightNumber}</td>
                                    <td class="tab-col5"><span class="hr" aria-hidden="true">${flightDest}</span><span class="visually-hidden">To</span>${flightDestLong}</td>
                                    <td class="tab-col6"><span class="visually-hidden">Status</span>${Date.parse(flightDepartureTime) > Date.parse(flightEstimatedDepartureTime) ? 'Revised time' : flightState}</td>
                                    <td class="tab-col8"><span class="visually-hidden">Door number</span>${flightGate}</td>
                                    <td class="tab-col7 tableauvols-suivi last"><a href="${flightFollow}" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS ${flightNumber}</span></a></td>
                                </tr>`
                    $('#tableauvols-tbody').append(tr);
                } catch (error) {
                    console.error(error);
                }
    
                //if(i > 10) break;
            }
            FlightInfoBuffer();
        } catch (error) {
            console.log(error);
            console.log(response);
        }
        
    });
}

function loadArrivals(startID = 0){
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://www.skyscanner.ca/g/arrival-departure-svc/api/airports/yul/arrivals?locale=en-US',
        method: 'GET'
    };

    $('#tableauvols-tbody').empty();
    $('#tableauvols-departure-thead').hide();
    $('#tableauvols-arrival-thead').show();

    $.ajax(settings).done(function (response) {
        try {
            var airportCode = response['airportInfo']['iataCode'];
            var arrivals = response['arrivals']; 
    
            var flightStates = {
                IN_AIR: 'Departed',
                OUT_GATE: 'Taxiing',
                IN_GATE: 'Boarding',
                SCHEDULED: '-',
                DELAYED: 'Delayed',
                LANDED: 'Landed',
                CANCELLED: 'Cancelled'
            }
    
            console.log(response);
            console.log(airportCode);
    
            $('#airportIDHeader').text(airportCode + ' Flight Information');
    
            for (let i = startID; i < arrivals.length; i++) {
                const flight = arrivals[i];
                
                //console.log(flight);
    
                var flightDepartureTime = flight['localisedScheduledDepartureTime'];
                var flightEstimatedDepartureTime = flight['localisedEstimatedDepartureTime'] ?? flightDepartureTime;
    
                var airlineID = airlineCodes[flight['airlineId']] ?? (airlineCodes[flight['flightNumber'].slice(0, 2)] ?? flight['airlineId']);
                var airlineCompany = flight['airlineName'];
    
                var flightNumber = flight['flightNumber'];
                var flightDest = flight['arrivalAirportCode'];
                var flightDestLong = flight['arrivalAirportName'];
                var flightState = flightStates[flight['status']] ?? flight['status'];
                var flightGate = flight['boardingGate'] ?? '';
                
                var airlineLogo = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x.png` : '';
                var airlineLogoAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x.png` : '';
                var airlineLogoAltAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x.png` : '';
                var flightFollow = `https://www.admtl.com/en/flights/sms-service?vol=${flightNumber}`;

                try {
                    var onTime = `<td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>`
                    var revisedTime = `<td class="tab-col2"><span class="hr" aria-hidden="true">${Date.parse(flightEstimatedDepartureTime)}</span><time class="tableauvols-datetime" datetime="${flightEstimatedDepartureTime}"><span class="tableauvols-hours tableauxvols-medium">${flightEstimatedDepartureTime.slice(-5)}</span><span class="tableauvols-date tableauxvols-medium">${new Date(flightEstimatedDepartureTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"})}</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail ${flightNumber}</button></td>`
                    var tr =    `<tr class="tableauvols-row tab-skin1-row" flight-index="${i}">
                                    <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">${Date.parse(flightDepartureTime)}</span><time class="tableauvols-datetime" datetime="${flightDepartureTime}"><span class="tableauvols-hours tableauxvols-normal">${flightDepartureTime.slice(-5)}</span><span class="tableauvols-date tableauxvols-normal">${new Date(flightDepartureTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"})}</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail ${flightNumber}</button></td>
                                    ${flightDepartureTime == flightEstimatedDepartureTime ? onTime : revisedTime}
                                    <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="${airlineLogo}" alt="${airlineCompany}" onerror='this.onerror=null;this.src="${airlineLogoAlt}"'; " ${airlineLogo == '' ? 'hidden' : ''}><span class="visually-hidden text-for-search" aria-hidden="true">Company ${airlineCompany} </span></td>
                                    <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>${flightNumber}</td>
                                    <td class="tab-col5"><span class="hr" aria-hidden="true">${flightDest}</span><span class="visually-hidden">To</span>${flightDestLong}</td>
                                    <td class="tab-col6"><span class="visually-hidden">Status</span>${Date.parse(flightDepartureTime) > Date.parse(flightEstimatedDepartureTime) ? 'Revised time' : flightState}</td>
                                    <td class="tab-col8"><span class="visually-hidden">Door number</span>${flightGate}</td>
                                    <td class="tab-col7 tableauvols-suivi last"><a href="${flightFollow}" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS ${flightNumber}</span></a></td>
                                </tr>`
                    $('#tableauvols-tbody').append(tr);
                } catch (error) {
                    console.error(error);
                }
    
                //if(i > 10) break;
            }
            FlightInfoBuffer();
        } catch (error) {
            console.log(error);
            console.log(response);
        }
        
    });
}

function DisplayImage() { 
    document.camimage.src = buffer.src; 
    LoadNextImage(); 
} 
function LoadBuffer () { 
    var trickname = imageUrl; 
    ++counter; 

    trickname += "?counter=" + (random + counter); 
    buffer.src = trickname; 
    buffer.onload = DisplayImage; 
} 
function LoadNextImage() { 
    setTimeout("LoadBuffer()", 1000*delay); 
} 

function FlightInfoBuffer(reset=false){
    minSinceLastFlightUpdate += 1;
    if(minSinceLastFlightUpdate > 5) $('.flightsRefreshAlert').show();

    switch (Math.floor(minSinceLastFlightUpdate / 2)) {
        case 0:
            $('.automaticupdate-label').text('a few seconds ago');
            $('.flightsRefreshAlert').hide();
            break;
    
        case 1:
            $('.automaticupdate-label').text('a minute ago');
            $('.flightsRefreshAlert').hide();
            break;
        default:
            $('.automaticupdate-label').text(minSinceLastFlightUpdate + ' minutes ago')
            break;
    }
    if(reset) return;
    UpdateFlightInfo();
}

function ReloadFlightInfo() {
    minSinceLastFlightUpdate = 0;
    FlightInfoBuffer(true);
}

function UpdateFlightInfo() { 
    setTimeout("FlightInfoBuffer()", 30000*delay); 
} 

$(document).ready(function(){
    imageUrl = $('#camImage')[0].src;
    LoadNextImage(); 
    loadFlights();

    $(".tableauvols-automaticupdate-trigger").off('click.tableauvols').on('click.tableauvols', function() {
        ReloadFlightInfo();
        loadFlights();
    });

    $("#tableauvols-show-arrivals").off('click.tableauvols').on('click.tableauvols', function() {
        isDepartures = false;
        loadFlights();
    });

    $("#tableauvols-show-departures").off('click.tableauvols').on('click.tableauvols', function() {
        isDepartures = true;
        loadFlights();
    });
})