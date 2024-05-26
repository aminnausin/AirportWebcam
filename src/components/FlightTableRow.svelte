<script>
// @ts-nocheck

    export let CONFIG = {};
    export let flight = {};

    const AIRLINE_CODES = {
        AC: 'ACA',
        PD: 'POE',
        TS: 'TSC',
        "3H": 'AIE',
        QK: 'ACA',
        TU: 'TAR',
        AF: 'AFR',
        LH: 'DLH',
        AA: 'AAL',
        "5T": 'MPE',
        WS: 'WJA',
        F8: 'FLAIR',
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
        LX: 'SHR',
        YN: 'CRQ',
        LX: 'SWR',
        TK: 'turkish',
        TP: 'TAP%20-%20Copy',
        OS: 'Austria%20-%20Copy',
        AV: 'AVA',
        SY: 'SY',
        RJ: 'RJA',
        CM: 'copaairlines'
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

    /**
     * Parse data components from raw flight data
     */
    function parseFlight() {
        flightTime = CONFIG.dataType === 'departures' ? flight['localisedScheduledDepartureTime'] : flight['localisedScheduledArrivalTime'];
        flightEstimatedTime = CONFIG.dataType === 'departures' ? flight['localisedEstimatedDepartureTime'] ?? '' : flight['localisedEstimatedArrivalTime'] ?? flightTime;

        airlineID = AIRLINE_CODES[flight['airlineId']] ?? (AIRLINE_CODES[flight['flightNumber'].slice(0, 2)] ?? flight['airlineId']);
        airlineCompany = flight['airlineName'];

        flightNumber = flight['flightNumber'];
        flightAirport = CONFIG.dataType === 'departures' ? flight['arrivalAirportCode'] : flight['departureAirportCode'];
        flightAirportLong = CONFIG.dataType === 'departures' ? flight['arrivalAirportName'] : flight['departureAirportName'];
        flightState = flightStates[flight['status']] ?? flight['status'];
        flightGate = CONFIG.dataType === 'departures' ? flight['boardingGate'] ?? '-' : flight['arrivalGate'] ?? '-';
        
        airlineLogoSet = [
            airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x.png` : '404.png',
            airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x_0.png` : '404.png',
            airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x.png` : '404.png',
            airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x_0.png` : '404.png',
            airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x.png` : '404.png',
            airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x_0.png` : '404.png',
            airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}.png` : '404.png',
        ]
        flightFollow = `https://www.admtl.com/en/flights/sms-service?vol=${flightNumber}`;

        airlineLogoIndex = 0;
        expanded = false;
    }
        
    /**
     * Trigger re-parsing flight data on prop update.
     * @param node // unused
     * @param param // flight data prop
     */
    function updateFlightDataTrigger(node, param) {
        parseFlight();
        return {
            update(param) {
                parseFlight();
            },
        };
    }


    // Flight Data
    
    let flightTime = CONFIG.dataType === 'departures' ? flight['localisedScheduledDepartureTime'] : flight['localisedScheduledArrivalTime'];
    let flightEstimatedTime = CONFIG.dataType === 'departures' ? flight['localisedEstimatedDepartureTime'] ?? '' : flight['localisedEstimatedArrivalTime'] ?? flightTime;

    let airlineID = AIRLINE_CODES[flight['airlineId']] ?? (AIRLINE_CODES[flight['flightNumber']?.slice(0, 2)] ?? flight['airlineId']);
    let airlineCompany = flight['airlineName'];

    let flightNumber = flight['flightNumber'];
    let flightAirport = CONFIG.dataType === 'departures' ? flight['arrivalAirportCode'] : flight['departureAirportCode'];
    let flightAirportLong = CONFIG.dataType === 'departures' ? flight['arrivalAirportName'] : flight['departureAirportName'];
    let flightState = flightStates[flight['status']] ?? flight['status'];
    let flightGate = CONFIG.dataType === 'departures' ? flight['boardingGate'] ?? '-' : flight['arrivalGate'] ?? '-';
    
    let airlineLogoSet = [
        airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x.png` : '404.png',
        airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x_0.png` : '404.png',
        airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x.png` : '404.png',
        airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x_0.png` : '404.png',
        airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x.png` : '404.png',
        airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x_0.png` : '404.png',
        airlineID.length ? `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}.png` : '404.png',
    ]
    let flightFollow = `https://www.admtl.com/en/flights/sms-service?vol=${flightNumber}`;

    let airlineLogoIndex = 0;
    let expanded = false;
</script>

<tr class="tableauvols-row tab-skin1-row" use:updateFlightDataTrigger={flight} on:click={() => {expanded = !expanded;}}>
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
            src="{airlineLogoSet[airlineLogoIndex]}" 
            alt="{airlineCompany}" 
            on:error={() => {airlineLogoIndex = airlineLogoIndex < airlineLogoSet.length - 1 ? airlineLogoIndex + 1 : airlineLogoIndex;}}>
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
        <a href="{flightFollow}" class="tableauvols-alertsms-shortdesc hover:no-underline">
            <span class="icon after:content-['\E011'] text-[1.9em] text-[#0abbff] hover:text-[#0899dd]" aria-hidden="true"></span>
            <span class="hidden">
                {`Track by SMS ${flightNumber}`}
            </span>
        </a>
    </td>
</tr>
{#if expanded}
    <!-- content here -->
    <tr class="bg-[#303437]">
        <td class="cursor-default hover:bg-[#303437]" colspan="8">
            <div class="tableauxvols-flightdetails flex" colspan="8">
                <div class="tableauxvols-flightdetails-left w-1/6 pl-2 pr-3 md:w-48 md:pl-5 md:pr-7">
                    <img
                        class={`w-full h-12 object-contain object-center`}
                        src="{airlineLogoSet[airlineLogoIndex]}" 
                        alt="{airlineCompany}" 
                        on:error={() => {airlineLogoIndex = airlineLogoIndex < airlineLogoSet.length - 1 ? airlineLogoIndex + 1 : airlineLogoIndex;}}
                    />
                    <span class="tableauxvols-flightdetails-flight text-right block">Flight</span>
                    <span class="block text-right text-[1.4rem] md:text-[1.8rem] font-bold pb-8 text-[#0abbff]">{flightNumber}</span>
                    <a href="{flightFollow}" class="block text-right pl-6 relative align-middle">
                        <span class="icon after:content-['\E011'] text-[1.9em] text-[#0abbff] -left-1 -top-3 absolute"aria-hidden="true"></span>
                        <span class="w-full leading-[125%] text-[#0abbff] text-base ">Track by SMS 
                            <span class="hidden">{flightNumber}</span>
                        </span>
                    </a>
                </div>
                <ul class="tableauxvols-flightdetails-right w-full">
                    {#if CONFIG.dataType === 'departures'}
                        <li class="py-2.5 border-b border-solid border-[#3c4144]">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">To</div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">{flightAirportLong}</div>
                        </li>
                        <li class="py-2.5 border-b border-solid border-[#3c4144]">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">
                                Departure time
                            </div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">
                                <span class="tableauxvols-flightdetails-hours tableauxvols-normal">{flightTime.slice(-5)}</span>
                                <span class="tableauxvols-flightdetails-hoursrevised">{new Date(flightTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"}).split(' ').join('. ').toLowerCase()}</span>
                            </div>
                        </li>
                        <li class="py-2.5 border-b border-solid border-[#3c4144]">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">Gate</div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">
                                <span class="align-middle">{flightGate}</span>
                                <span class="icon after:content-['\E00D']"></span>
                            </div>
                        </li>
                        <li class="pt-2.5">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">Status</div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">
                                <span>{flightState}</span>
                            </div>
                        </li>
                        <hr class="border-b border-solid border-[#60686d] my-5"/>
                        <li class="tableauxvols-waiting-time">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">Customs waiting time</div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">
                                N/A 
                                <span class="tableauxvols-flightdetails-waitinglightbox text-xs font-normal align-middle">
                                    <span class="hidden">Customs waiting time</span> 
                                    (<span class="text-[#0abbff]">currently</span>)
                                </span>
                            </div>
                        </li>
                    {:else}
                        <li class="py-2.5 border-b border-solid border-[#3c4144] pt-4">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">From</div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">{flightAirportLong}</div>
                        </li>
                        <li class="py-2.5 border-b border-solid border-[#3c4144]">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">
                                Arrival time
                            </div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">
                                <span class="tableauxvols-flightdetails-hours tableauxvols-normal">{flightTime.slice(-5)}</span>
                                <span class="tableauxvols-flightdetails-hoursrevised">{new Date(flightTime).toLocaleDateString('en-ca', {month:"short", day:"2-digit"}).split(' ').join('. ').toLowerCase()}</span>
                            </div>
                        </li>
                        <li class="pt-2.5">
                            <div class="align-top text-left w-1/6 pr-2 md:w-52 md:pr-5 inline-block">Status</div>
                            <div class="align-top text-left w-1/2 md:text-lg leading-none font-bold inline-block">
                                <span>{flightState}</span>
                            </div>
                        </li>
                    {/if}
                </ul>
            </div>
        </td>
    </tr>
{/if}