<script>
// @ts-nocheck

    export let CONFIG = {};
    export let flight = {};

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

    let flightStates = CONFIG.dataType == 'departures' ? {
        IN_AIR: 'Departed',
        OUT_GATE: 'Taxiing',
        IN_GATE: 'Boarding',
        SCHEDULED: '-',
        DELAYED: 'Delayed',
        LANDED: 'Landed',
        CANCELLED: 'Cancelled'
    } : {
        IN_AIR: 'On Route',
        IN_GATE: 'Arrived',
        OUT_GATE: 'Advanced',
        SCHEDULED: 'On Time',
        DELAYED: 'Delayed',
        LANDED: 'Landed',
        CANCELLED: 'Cancelled'
    }
        
    let flightTime = CONFIG.dataType === 'departures' ? flight['localisedScheduledDepartureTime'] : flight['localisedScheduledArrivalTime'];
    let flightEstimatedTime = CONFIG.dataType === 'departures' ? flight['localisedEstimatedDepartureTime'] ?? '' : flight['localisedEstimatedArrivalTime'] ?? flightTime;

    let airlineID = airlineCodes[flight['airlineId']] ?? (airlineCodes[flight['flightNumber'].slice(0, 2)] ?? flight['airlineId']);
    let airlineCompany = flight['airlineName'];

    let flightNumber = flight['flightNumber'];
    let flightAirport = CONFIG.dataType === 'departures' ? flight['arrivalAirportCode'] : flight['departureAirportCode'];
    let flightAirportLong = CONFIG.dataType === 'departures' ? flight['arrivalAirportName'] : flight['departureAirportName'];
    let flightState = flightStates[flight['status']] ?? flight['status'];
    let flightGate = CONFIG.dataType === 'departures' ? flight['boardingGate'] ?? '-' : flight['arrivalGate'] ?? '-';
    
    let airlineLogo = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x.png` : '';
    let airlineLogoAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x.png` : '';
    let airlineLogoAltAlt = airlineID.length == 3 ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x.png` : '';
    let flightFollow = `https://www.admtl.com/en/flights/sms-service?vol=${flightNumber}`;
</script>

<tr class="tableauvols-row tab-skin1-row">
    <td class="first tab-col1">
        <span class="hr" aria-hidden="true">
            todayflight</span>
        <span class="hr" aria-hidden="true">
            {Date.parse(flightTime)}
        </span>
        <time class="flex flex-col items-center justify-center text-left w-full" datetime="{flightTime}">
            <span class="mb-1 tableauxvols-normal">{flightTime.slice(-5)}</span>
            <span class="ml-1 text-[0.65em] tableauxvols-normal">{new Date(flightTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"})}</span>
        </time>
        <button class="tableauvols-toggle-button hidden" aria-expanded="false">
            Toggle the flight detail {flightNumber}
        </button>
    </td>
    {#if flightTime === flightEstimatedTime}
        <td class="tab-col2">
            <span class="hidden">No revision for this flight.</span>
        </td>
    {:else}
        <td class="tab-col2">
            <span class="hr" aria-hidden="true">
                {Date.parse(flightEstimatedTime)}
            </span>
            <time class="flex flex-col items-center justify-center text-left w-full" datetime="{flightEstimatedTime}">
                <span class="mb-1 text-[#fbbb37]">{flightEstimatedTime.slice(-5)}</span>
                <span class="ml-1 text-[0.65em] line text-[#fbbb37]">{flightEstimatedTime ? new Date(flightEstimatedTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"}) : ''}</span>
            </time>
            <button class="tableauvols-toggle-button hidden" aria-expanded="false">
                Toggle the flight detail {flightNumber}
            </button>
        </td>
    {/if}
    <td class="tab-col3">
        <img 
            class="tableauxvols-flightdetails-logo-small" 
            src="{airlineLogo}" 
            alt="{airlineCompany}" 
            onerror='this.onerror=null;this.src="{airlineLogoAlt}";'>
        <span class="hidden text-for-search" aria-hidden="true">Company {airlineCompany} </span>
    </td>
    <td class="tab-col4 text-[#0abbff] font-bold">
        <span class="hidden">Flight</span>
        {flightNumber}
    </td>
    <td class="tab-col5">
        <span class="hr" aria-hidden="true">{flightAirport}</span>
        <span class="hidden">To/From</span>
        <span class="line-clamp-1 w-full">{flightAirportLong}</span>
    </td>
    <td class="tab-col6">
        <span class="hidden">
            Status
        </span>
        <span class="w-full">
            {#if Date.parse(flightTime) > Date.parse(flightEstimatedTime)}
            Revised time
            {:else}
                {flightState}
            {/if}
        </span>
    </td>
    <td class="tab-col8">
        <span class="hidden">
            Door number
        </span>
        {flightGate}
    </td>
    <td class="tab-col7 tableauvols-suivi last">
        <a href="{flightFollow}" class="tableauvols-alertsms-shortdesc">
            <span class="tableauvols-icon tableauvols-icon-favoris"></span>
            <span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span>
            <span class="hidden">
                Track by SMS {flightNumber}
            </span>
        </a>
    </td>
</tr>
