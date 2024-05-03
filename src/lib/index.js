// @ts-nocheck
// place files you want to import through the `$lib` alias in this folder.
export var webAudioPeakMeter = (function () {
    'use strict';
    var options = {
        borderSize: 2,
        fontSize: 9,
        backgroundColor: 'black',
        tickColor: '#ddd',
        gradient: ['red 1%', '#ff0 16%', 'lime 45%', '#080 100%'],
        dbRange: 48,
        dbTickSize: 6,
        maskTransition: '0.1s',
    };
    var tickWidth;
    var elementWidth;
    var elementHeight;
    var meterHeight;
    var meterWidth;
    var meterTop;
    var vertical = true;
    var channelCount = 1;
    var channelMasks = [];
    var channelPeaks = [];
    var channelPeakLabels = [];
    var maskSizes = [];
    var textLabels = [];

    var getBaseLog = function (x, y) {
        return Math.log(y) / Math.log(x);
    };

    var dbFromFloat = function (floatVal) {
        return getBaseLog(10, floatVal) * 20;
    };

    var setOptions = function (userOptions) {
        for (var k in userOptions) {
            if (userOptions.hasOwnProperty(k)) {
                options[k] = userOptions[k];
            }
        }
        tickWidth = options.fontSize * 2.0;
        meterTop = options.fontSize * 1.5 + options.borderSize;
    };

    var createMeterNode = function (sourceNode, audioCtx) {
        var c = sourceNode.channelCount;
        var meterNode = audioCtx.createScriptProcessor(2048, c, c);
        sourceNode.connect(meterNode);
        meterNode.connect(audioCtx.destination);
        return meterNode;
    };

    var createContainerDiv = function (parent) {
        var meterElement = document.createElement('div');
        meterElement.style.position = 'relative';
        meterElement.style.width = elementWidth + 'px';
        meterElement.style.height = elementHeight + 'px';
        meterElement.style.backgroundColor = options.backgroundColor;
        parent.appendChild(meterElement);
        return meterElement;
    };

    var createMeter = function (domElement, meterNode, optionsOverrides) {
        setOptions(optionsOverrides);
        elementWidth = domElement.clientWidth;
        elementHeight = domElement.clientHeight;
        var meterElement = createContainerDiv(domElement);
        if (elementWidth > elementHeight) {
            vertical = false;
        }
        meterHeight = elementHeight - meterTop - options.borderSize;
        meterWidth = elementWidth - tickWidth - options.borderSize;
        createTicks(meterElement);
        createRainbow(meterElement, meterWidth, meterHeight,
            meterTop, tickWidth);
        channelCount = meterNode.channelCount;
        var channelWidth = meterWidth / channelCount;
        if (!vertical) {
            channelWidth = meterHeight / channelCount;
        }
        var channelLeft = tickWidth;
        if (!vertical) {
            channelLeft = meterTop;
        }
        for (var i = 0; i < channelCount; i++) {
            createChannelMask(meterElement, options.borderSize,
                meterTop, channelLeft, false);
            channelMasks[i] = createChannelMask(meterElement, channelWidth,
                meterTop, channelLeft,
                options.maskTransition);
            channelPeaks[i] = 0.0;
            channelPeakLabels[i] = createPeakLabel(meterElement, channelWidth,
                channelLeft);
            channelLeft += channelWidth;
            maskSizes[i] = 0;
            textLabels[i] = '-âˆž';
        }
        meterNode.onaudioprocess = updateMeter;
        meterElement.addEventListener('click', function () {
            for (var i = 0; i < channelCount; i++) {
                channelPeaks[i] = 0.0;
                textLabels[i] = '-âˆž';
            }
        }, false);
        paintMeter();
    };

    var createTicks = function (parent) {
        var numTicks = Math.floor(options.dbRange / options.dbTickSize);
        var dbTickLabel = 0;
        if (vertical) {
            var dbTickTop = options.fontSize + options.borderSize;
            for (var i = 0; i < numTicks; i++) {
                var dbTick = document.createElement('div');
                parent.appendChild(dbTick);
                dbTick.style.width = tickWidth + 'px';
                dbTick.style.textAlign = 'right';
                dbTick.style.color = options.tickColor;
                dbTick.style.fontSize = options.fontSize + 'px';
                dbTick.style.position = 'absolute';
                dbTick.style.top = dbTickTop + 'px';
                dbTick.textContent = dbTickLabel + '';
                dbTickLabel -= options.dbTickSize;
                dbTickTop += meterHeight / numTicks;
            }
        } else {
            tickWidth = meterWidth / numTicks;
            var dbTickRight = options.fontSize * 2;
            for (var i = 0; i < numTicks; i++) {
                var dbTick = document.createElement('div');
                parent.appendChild(dbTick);
                dbTick.style.width = tickWidth + 'px';
                dbTick.style.textAlign = 'right';
                dbTick.style.color = options.tickColor;
                dbTick.style.fontSize = options.fontSize + 'px';
                dbTick.style.position = 'absolute';
                dbTick.style.right = dbTickRight + 'px';
                dbTick.textContent = dbTickLabel + '';
                dbTickLabel -= options.dbTickSize;
                dbTickRight += tickWidth;
            }
        }
    };

    var createRainbow = function (parent, width, height, top, left) {
        var rainbow = document.createElement('div');
        parent.appendChild(rainbow);
        rainbow.style.width = width + 'px';
        rainbow.style.height = height + 'px';
        rainbow.style.position = 'absolute';
        rainbow.style.top = top + 'px';
        if (vertical) {
            rainbow.style.left = left + 'px';
            var gradientStyle = 'linear-gradient(to bottom, ' +
                options.gradient.join(', ') + ')';
        } else {
            rainbow.style.left = options.borderSize + 'px';
            var gradientStyle = 'linear-gradient(to left, ' +
                options.gradient.join(', ') + ')';
        }
        rainbow.style.backgroundImage = gradientStyle;
        return rainbow;
    };

    var createPeakLabel = function (parent, width, left) {
        var label = document.createElement('div');
        parent.appendChild(label);
        label.style.textAlign = 'center';
        label.style.color = options.tickColor;
        label.style.fontSize = options.fontSize + 'px';
        label.style.position = 'absolute';
        label.textContent = '-âˆž';
        if (vertical) {
            label.style.width = width + 'px';
            label.style.top = options.borderSize + 'px';
            label.style.left = left + 'px';
        } else {
            label.style.width = options.fontSize * 2 + 'px';
            label.style.right = options.borderSize + 'px';
            label.style.top = (width * 0.25) + left + 'px';
        }
        return label;
    };

    var createChannelMask = function (parent, width, top, left, transition) {
        var channelMask = document.createElement('div');
        parent.appendChild(channelMask);
        channelMask.style.position = 'absolute';
        if (vertical) {
            channelMask.style.width = width + 'px';
            channelMask.style.height = meterHeight + 'px';
            channelMask.style.top = top + 'px';
            channelMask.style.left = left + 'px';
        } else {
            channelMask.style.width = meterWidth + 'px';
            channelMask.style.height = width + 'px';
            channelMask.style.top = left + 'px';
            channelMask.style.right = options.fontSize * 2 + 'px';
        }
        channelMask.style.backgroundColor = options.backgroundColor;
        if (transition) {
            if (vertical) {
                channelMask.style.transition = 'height ' + options.maskTransition;
            } else {
                channelMask.style.transition = 'width ' + options.maskTransition;
            }
        }
        return channelMask;
    };

    var maskSize = function (floatVal) {
        var meterDimension = vertical ? meterHeight : meterWidth;
        if (floatVal === 0.0) {
            return meterDimension;
        } else {
            var d = options.dbRange * -1;
            var returnVal = Math.floor(dbFromFloat(floatVal) * meterDimension / d);
            if (returnVal > meterDimension) {
                return meterDimension;
            } else {
                return returnVal;
            }
        }
    };

    var updateMeter = function (audioProcessingEvent) {
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var i;
        var channelData = [];
        var channelMaxes = [];
        for (i = 0; i < channelCount; i++) {
            channelData[i] = inputBuffer.getChannelData(i);
            channelMaxes[i] = 0.0;
        }
        for (var sample = 0; sample < inputBuffer.length; sample++) {
            for (i = 0; i < channelCount; i++) {
                if (Math.abs(channelData[i][sample]) > channelMaxes[i]) {
                    channelMaxes[i] = Math.abs(channelData[i][sample]);
                }
            }
        }
        for (i = 0; i < channelCount; i++) {
            maskSizes[i] = maskSize(channelMaxes[i], meterHeight);
            if (channelMaxes[i] > channelPeaks[i]) {
                channelPeaks[i] = channelMaxes[i];
                textLabels[i] = dbFromFloat(channelPeaks[i]).toFixed(1);
            }
        }
    };

    var paintMeter = function () {
        for (var i = 0; i < channelCount; i++) {
            if (vertical) {
                channelMasks[i].style.height = maskSizes[i] + 'px';
            } else {
                channelMasks[i].style.width = maskSizes[i] + 'px';
            }
            channelPeakLabels[i].textContent = textLabels[i];
        }
        window.requestAnimationFrame(paintMeter);
    };

    return {
        createMeterNode: createMeterNode,
        createMeter: createMeter,
    };
})();


import jQuery from 'jquery';

export var flightBoardX = ($ = jQuery, CONFIG) => {
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

    function loadFlightData(){
        let url = '';
        switch (CONFIG.dataType) {
            case "arrival":
                url = 'https://www.skyscanner.ca/g/arrival-departure-svc/api/airports/yul/departures?locale=en-US';
                break;

            case "departure":
                url = 'https://www.skyscanner.ca/g/arrival-departure-svc/api/airports/yul/arrivals?locale=en-US';
                break;
        }

        const settings = {
            async: true,
            crossDomain: true,
            url: url,
            method: 'GET'
        };

        return output();
    }

    function loadDepartures(limit = 0){
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
        
                for (let i = 0; i < (limit == 0 || limit > departures.length ? departures.length : limit); i++) {
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
                    var flightGate = flight['boardingGate'] ?? '-';
                    
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
    
    function loadArrivals(limit = 0){
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
                    IN_AIR: 'On Route',
                    IN_GATE: 'Arrived',
                    OUT_GATE: 'Advanced',
                    SCHEDULED: 'On Time',
                    DELAYED: 'Delayed',
                    LANDED: 'Landed',
                    CANCELLED: 'Cancelled'
                }
        
                console.log(response);
                console.log(airportCode);
        
                $('#airportIDHeader').text(airportCode + ' Flight Information');
        
                for (let i = 0; i < (limit == 0 || limit > arrivals.length ? arrivals.length : limit); i++) {
                    const flight = arrivals[i];
                    
                    //console.log(flight);
        
                    var flightArrivalTime = flight['localisedScheduledArrivalTime'];
                    var flightEstimatedArrivalTime = flight['localisedEstimatedArrivalTime'] ?? flightArrivalTime;
        
                    var airlineID = airlineCodes[flight['airlineId']] ?? (airlineCodes[flight['flightNumber'].slice(0, 2)] ?? flight['airlineId']);
                    var airlineCompany = flight['airlineName'];
        
                    var flightNumber = flight['flightNumber'];
                    var flightOrigin = flight['departureAirportCode'];
                    var flightOriginLong = flight['departureAirportName'];
                    var flightState = flightStates[flight['status']] ?? flight['status'];
                    var flightGate = flight['arrivalGate'] ?? '-';
                    
                    var airlineLogo = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x.png` : '';
                    var airlineLogoAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x.png` : '';
                    var airlineLogoAltAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x.png` : '';
                    var flightFollow = `https://www.admtl.com/en/flights/sms-service?vol=${flightNumber}`;
    
                    try {
                        var onTime = `<td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>`
                        var revisedTime = `<td class="tab-col2"><span class="hr" aria-hidden="true">${Date.parse(flightEstimatedArrivalTime)}</span><time class="tableauvols-datetime" datetime="${flightEstimatedArrivalTime}"><span class="tableauvols-hours tableauxvols-medium">${flightEstimatedArrivalTime.slice(-5)}</span><span class="tableauvols-date tableauxvols-medium">${new Date(flightEstimatedArrivalTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"})}</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail ${flightNumber}</button></td>`
                        var tr =    `<tr class="tableauvols-row tab-skin1-row" flight-index="${i}">
                                        <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">${Date.parse(flightArrivalTime)}</span><time class="tableauvols-datetime" datetime="${flightArrivalTime}"><span class="tableauvols-hours tableauxvols-normal">${flightArrivalTime.slice(-5)}</span><span class="tableauvols-date tableauxvols-normal">${new Date(flightArrivalTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"})}</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail ${flightNumber}</button></td>
                                        ${flightArrivalTime == flightEstimatedArrivalTime ? onTime : revisedTime}
                                        <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="${airlineLogo}" alt="${airlineCompany}" onerror='this.onerror=null;this.src="${airlineLogoAlt}"'; " ${airlineLogo == '' ? 'hidden' : ''}><span class="visually-hidden text-for-search" aria-hidden="true">Company ${airlineCompany} </span></td>
                                        <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>${flightNumber}</td>
                                        <td class="tab-col5"><span class="hr" aria-hidden="true">${flightOrigin}</span><span class="visually-hidden">To</span>${flightOriginLong}</td>
                                        <td class="tab-col6"><span class="visually-hidden">Status</span>${Date.parse(flightArrivalTime) > Date.parse(flightEstimatedArrivalTime) ? 'Revised time' : flightState}</td>
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
};

