<script>
	import FlightTableRow from './FlightTableRow.svelte';
    export let airport = {'code' : 'yul', 'icao' : 'CYUL', 'radio': '_twr2', 'location': 'Montreal, Quebec, Canada'};

    let CONFIG = {
        dataType: 'departures'
    };

    const currentDate = new Date();
    const formatMonth = (/** @type {string} */ str) => {
        return str.slice(0,3) + '.' + str.slice(3);
    }

    let dateToday = formatMonth(currentDate.toLocaleDateString('en-ca', { month:"short", day: "numeric"}));
    let dateTomorrow = formatMonth(new Date(Date.now() + 1000 * 3600 * 24).toLocaleDateString('en-ca', { month:"short", day: "numeric"}));
    let lastUpdate = 'a few seconds ago';

    // @ts-ignore
    let rawLastUpdate = null;
    
    let sort = [0, 0, 0, 0, 0, 0, 0]; // Sort states by column (1 for asc, 2 for desc, 0 for not in use)

    const handleUpdate = () => {
        // @ts-ignore
        rawLastUpdate = new Date();
        flightInfoBuffer();
        loadFlightData();
    };

    const handleLoadFlightData = (/** @type {string} */ dataType) => {
        CONFIG.dataType = dataType;
        loadFlightData();
    };

    const loadFlightData = async () => {
        rawFlights = [[], []];
        status = 'Loading...'
        /**
         * @type {any[]}
         */
        let flightsToday = [];
        /**
         * @type {any[]}
         */
        let flightsTomorrow = [];
        let url = '';
        boardTitle = CONFIG.dataType === 'departures' ? 'Departures' : 'Arrivals';
        switch (CONFIG.dataType) {
            case "arrivals":
                url = `https://www.skyscanner.ca/g/arrival-departure-svc/api/airports/${airport.code}/arrivals?locale=en-US`;
                break;
            case "departures":
                url = `https://www.skyscanner.ca/g/arrival-departure-svc/api/airports/${airport.code}/departures?locale=en-US`;
                break;
        }

        fetch(url)
        .then(response => response.json())
        .then(async (data) => {
            let rawFlightsCombined = data[CONFIG.dataType] ?? [];
            let parsedDateToday = currentDate.toLocaleDateString([], { day: "numeric"});
            let parsedDateTomorrow = (new Date(dateTomorrow)).toLocaleDateString([], { day: "numeric"});
            for (let i = 0; i < rawFlightsCombined.length; i++) {
                const flight = rawFlightsCombined[i];
                let dateSource = CONFIG.dataType === 'departures' ? 'localisedScheduledDepartureTime' : 'localisedScheduledArrivalTime';
                let flightDate = new Date(flight[dateSource]).toLocaleDateString([], { day: "numeric"});

                // @ts-ignore
                let airlineID = AIRLINE_CODES[flight['airlineId']] ?? (AIRLINE_CODES[flight['flightNumber'].slice(0, 2)] ?? false);
                if(!airlineID) continue;

                // @ts-ignore
                if(!(airlineID in logoURLs)) await generateLogoURL(airlineID);
                flight['airlineID'] = airlineID;
                if (flightDate <= parsedDateToday) {
                    // @ts-ignore
                    flightsToday = [...flightsToday, flight];
                }
                else if(flightDate === parsedDateTomorrow){
                    // @ts-ignore
                    flightsTomorrow = [...flightsTomorrow, flight];
                }
            }
            rawFlights = [flightsToday, flightsTomorrow];
            filterFlights();
        }).catch(error => {
            console.log(error);
            rawFlights = [[], []];
        });
    };

    /**
     * @param {any} node
     * @param {{ code: string; }} param
     */
    function titleUpdateTrigger(node, param) {
        title = `${param.code.toLocaleUpperCase()} Flight Information`;

        handleUpdate();
        return {
            /**
             * @param {{ code: string; }} param
             */
            update(param) {
                title = `${param.code.toLocaleUpperCase()} Flight Information`;
                rawLastUpdate = new Date();
                handleUpdate();
            },
        };
    }

    const flightInfoBuffer = () => {
        if(!rawLastUpdate) return;
        if(timeoutID) clearTimeout(timeoutID);
        const rawAge = Date.now() - rawLastUpdate.getTime();

        const weeks = Math.round(rawAge / (1000 * 3600 * 24 * 7));
        const days = Math.round(rawAge / (1000 * 3600 * 24));
        const hours = Math.round(rawAge / (1000 * 3600));
        const minutes = Math.round(rawAge / (1000 * 60));
        const seconds = Math.round(rawAge / 1000);

	    lastUpdate = weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : days > 0 ? `${days} day${days > 1 ? 's' : ''} ago` : hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ago` : minutes > 0 ? `${minutes}m ago` : `a few seconds ago`
        timeoutID = setTimeout(() => {
            flightInfoBuffer();
        }, 3000);
    }

    const filterFlights = () => {
        // filteredFlights = rawFlights[selectedFlightSet];
        filteredFlights = rawFlights[selectedFlightSet].filter((/** @type {{ [x: string]: string; }} */ flight) => {
            let reg = new RegExp(searchQuery, 'i');
            let flightRaw = `${CONFIG.dataType === 'departures' ? 
                                `${flight['localisedScheduledDepartureTime']} 
                                ${flight['arrivalAirportCode']}
                                ${flight['arrivalAirportName']}
                                ${flight['localisedEstimatedDepartureTime'] ?? ''}
                                ${flight['arrivalGate'] ?? ''}`
                            : 
                                `${flight['localisedScheduledArrivalTime']}
                                ${flight['departureAirportCode']}
                                ${flight['departureAirportName']}
                                ${flight['localisedEstimatedArrivalTime'] ?? ''}
                                ${flight['boardingGate'] ?? ''}`}
                            ${flight['airlineName']} 
                            ${flight['flightNumber']}`
            return reg.test(flightRaw)
        })
        sort = [0,0,0,0,0,0,0];
        status = 'No Results'
    }

    const sortTrigger = (/** @type {number} */ index) => {
        for (let i = 0; i < sort.length; i++) {
            if(i !== index) sort[i] = 0
        }

        sort[index] += 1;
        if(sort[index] > 2) sort[index] = 1;

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

        filteredFlights = filteredFlights.sort((/** @type {{ [x: string]: string; }} */ flightA, /** @type {{ [x: string]: string; }} */ flightB) => {
            let dir = sort[index];
            // @ts-ignore
            let flightStateA = flightStates[flightA['status']] ?? flightA['status'];
            // @ts-ignore
            let flightStateB = flightStates[flightB['status']] ?? flightB['status'];

            switch (index) {
                case 0:
                    if(CONFIG.dataType === 'departures'){
                        return dir == 1 ? flightA['localisedScheduledDepartureTime']?.localeCompare(flightB['localisedScheduledDepartureTime']) : -flightA['localisedScheduledDepartureTime']?.localeCompare(flightB['localisedScheduledDepartureTime']);
                    }
                    else return dir == 1 ? flightA['localisedScheduledArrivalTime']?.localeCompare(flightB['localisedScheduledArrivalTime']) : -flightA['localisedScheduledArrivalTime']?.localeCompare(flightB['localisedScheduledArrivalTime']);
                case 1:
                    if(CONFIG.dataType === 'departures'){
                        return dir == 1 ? flightA['localisedEstimatedDepartureTime']?.localeCompare(flightB['localisedEstimatedDepartureTime']) : -flightA['localisedEstimatedDepartureTime']?.localeCompare(flightB['localisedEstimatedDepartureTime']);
                    }
                    else return dir == 1 ? flightA['localisedEstimatedArrivalTime']?.localeCompare(flightB['localisedEstimatedArrivalTime']) : -flightA['localisedEstimatedArrivalTime']?.localeCompare(flightB['localisedEstimatedArrivalTime']);
                case 2:
                    return dir == 1 ? flightA['airlineName']?.localeCompare(flightB['airlineName']) : -flightA['airlineName']?.localeCompare(flightB['airlineName']);
                case 3:
                    return dir == 1 ? flightA['flightNumber']?.localeCompare(flightB['flightNumber']) : -flightA['flightNumber']?.localeCompare(flightB['flightNumber']);
                case 4:
                    if(CONFIG.dataType === 'departures'){
                        return dir == 1 ? flightA['arrivalAirportName']?.localeCompare(flightB['arrivalAirportName']) : -flightA['arrivalAirportName']?.localeCompare(flightB['arrivalAirportName']);
                    }
                    else return dir == 1 ? flightA['departureAirportName']?.localeCompare(flightB['departureAirportName']) : -flightA['departureAirportName']?.localeCompare(flightB['departureAirportName']);
                case 5:
                    return dir == 1 ? flightStateA?.localeCompare(flightStateB) : -flightStateA?.localeCompare(flightStateB);
                case 6:
                    if(CONFIG.dataType === 'departures'){
                        return dir == 1 ? flightA['boardingGate']?.localeCompare(flightB['boardingGate']) : -flightA['boardingGate']?.localeCompare(flightB['boardingGate']);
                    }
                    else return dir == 1 ? flightA['arrivalGate']?.localeCompare(flightB['arrivalGate']) : -flightA['arrivalGate']?.localeCompare(flightB['arrivalGate']);
                default:
                    console.log('help');
                    break;
            }
        });
    }

    /**
    * Airline codes that connect flight numbers to corresponding keywords used by YUL to display airline logos
    */
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

    let logoURLs = {}

    
    /**
     * @param {string} airlineID
     */
    async function generateLogoURL(airlineID, index = 0){
        let airlineLogoSet = [
            `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x.png`,
            `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS%402x_0.png`,
            `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x.png`,
            `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}_FIDS2%402x_0.png`,
            `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x.png`,
            `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}%402x_0.png`,
            `https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/${airlineID}.png`,
        ]

        const url = airlineLogoSet[index];
        // @ts-ignore
        logoURLs[airlineID] = "";
        try {
            var img = new Image();
            img.src = url;
            img.onload = (() => {
                // @ts-ignore
                logoURLs[airlineID] = url;
                //console.log('img found');
                // console.log(logoURLs);
            }); 
            img.onerror = (() => {
                // @ts-ignore
                img = undefined;
                //console.log(`img not found ${index} ${airlineID}`);
                if(index >= 6) return;
                generateLogoURL(airlineID, index + 1);
            });
        } catch (error) {
            console.log(error);
        }
        
    }

    /**
     * @type {any[]}
     */
    let rawFlights = [[],[]];
    let selectedFlightSet = 0;
    let filteredFlights = rawFlights[selectedFlightSet];
    let title = '';
    let boardTitle = '';
    let searchQuery = '';
    /**
     * @type {number | undefined}
     */
    let timeoutID;
    let status = 'No Results'
</script>

<div class="block-tableauVols w-full">
    <div class="tableauxvols-automaticupdate-wrapper overflow-hidden flex flex-col md:flex-row md:justify-between items-start gap-1 mb-2">
        <section data-enhance="automaticUpdate" class="flex flex-wrap items-center min-w-[66%]">
            <div class="font-bold text-xl w-full align-middle tableauxvols-automaticupdate-label justify-start flex flex-wrap" id="airportIDHeader" use:titleUpdateTrigger={airport}>
                <span class="line-clamp-1">{title}</span>&nbsp;<span class="line-clamp-1">({filteredFlights.length} Results)</span>
            </div>
            <div class="font-bold text-xl align-middle tableauxvols-automaticupdate-label">
                Last update :&nbsp;      
            </div>
            <div class="leading-7 align-middle h-full blockautomaticupdate-label">{lastUpdate}</div>
            <a class="tableauvols-automaticupdate-trigger cursor-pointer" href="/" on:click={handleUpdate}>
                <span id="canvasloader-container-tTlE9tm1ge" class="canvasloader-wrapper hidden">
                    <div id="canvasLoader-tTlE9tm18h" class="block">
                        <canvas width="16" height="16"></canvas>
                        <canvas width="16" height="16" class="hidden"></canvas>
                    </div>
                </span>
                <span class="refresher icon after:content-['\E080'] px-2 block">
                    <span class="hidden">Refresh flight information</span>
                </span>
            </a>
        </section>


        <section class="flex gap-1 w-full md:justify-end md:h-full md:items-end">
            {#if CONFIG.dataType == 'departures'}
                <button id="tableauvols-show-arrivals" class=" inline-block text-[#0275c2] hover:text-[#005580]" on:click={(e) => {handleLoadFlightData('arrivals')}}>
                    <span class="icon icon-arrow-left after:content-['\E02A'] align-middle" aria-hidden="true"></span>
                    <span class="hover:underline align-middle">See arrivals</span>
                </button>
            {:else}
                <button id="tableauvols-show-departures" class=" inline-block text-[#0275c2] hover:text-[#005580]" on:click={(e) => {handleLoadFlightData('departures')}}>
                    <span class="icon icon-arrow-left after:content-['\E02A'] align-middle" aria-hidden="true"></span>
                    <span class="hover:underline align-middle">See departures</span>
                </button>
            {/if}
        </section>
    </div>

    <div class="flightsRefreshAlert hidden">
        <span class="icon icon-rafraichissement cursor-pointer"></span>
        <a href="/">New information available</a>
    </div>

    <!-- tableauvols-filters-mobile
    neutral -->

    <div id="DataTables_Table_0_wrapper" class="dataTables_wrapper tableauvols-wrapper">
        <div class="flex flex-col md:flex-row justify-between items-center mb-5 gap-2">
            <div class="w-full md:w-72 flex divide-x divide-white">
                <button class={`btn-action w-full rounded-l-md ${selectedFlightSet === 0 ? 'dark' : ''}`} on:click={() => {selectedFlightSet = 0; filteredFlights = rawFlights[selectedFlightSet]; filterFlights();}}>
                    <span class="tableauvols-filters-day w-full">today</span>
                    <span class="tableauvols-filters-date w-full line-clamp-1">({dateToday})</span>
                </button>
                <button class={`btn-action w-full rounded-r-md ${selectedFlightSet === 1 ? 'dark' : ''}`} on:click={() => {selectedFlightSet = 1; filteredFlights = rawFlights[selectedFlightSet]; filterFlights();}}>
                    <span class="tableauvols-filters-day w-full">tomorrow</span>
                    <span class="tableauvols-filters-date w-full line-clamp-1">({dateTomorrow})</span>
                </button>
            </div>
            <div id="DataTables_Table_filter" class="w-full md:w-auto text-[#6c757b] ring-inset ring-2 ring-[#bcc1c4] rounded-md bg-white">
                <label for="search" class="relative block h-full  p-0 leading-5">
                    <input type="text" id="search" placeholder="Search for flights ..." class="focus-within:outline-none w-full h-full font-light py-4 ps-6 pe-14 bg-transparent" bind:value={searchQuery} on:input={() => {filterFlights();}} >
                    <span class="hidden">Search for flights ...</span>
                    <button class="fakebutton absolute h-full right-0 -top-[0.0625rem] cursor-pointer icon after:content-['\E037'] text-4xl leading-5 shado" aria-hidden="true" aria-label="Search" disabled={true}></button>
                </label>
            </div>
        </div>
        <section class="relative">
            <!-- <div class="dataTables_scrollHead overflow-auto border-0 w-full shadow-lg rounded-t-md z-10 hidden">
                <div class="dataTables_scrollHeadInner">
                    <table id="tableauvols-main" class="tab tab-skin1 tableauvols tableauvols-complexe tableauvols-departure enhance enhance-flightBoardSortable-applied dataTable">
                        <thead class="tab-skin1-thead">
                            {#if CONFIG.dataType === 'departures'}
                                <tr id="tableauvols-departure-thead">
                                    <th class="first tab-col1" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Sched: activate to sort column ascending" on:click={() => {sortTrigger(0)}}>
                                        <div class="DataTables_sort_wrapper">
                                            Sched<span class={`DataTables_sort_icon icon ${sort[0] ? (sort[0] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="tab-col2" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 11px;" aria-label="Revised: activate to sort column ascending" on:click={() => {sortTrigger(1)}}>
                                        <div class="DataTables_sort_wrapper">
                                            Revised<span class={`DataTables_sort_icon icon ${sort[1] ? (sort[1] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="tab-col3" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 15px;" aria-label="Flight: activate to sort column ascending" on:click={() => {sortTrigger(2)}}>
                                        <div class="DataTables_sort_wrapper">
                                            <span class="tableauvols-voltitle">Flight</span>
                                            <span class={`DataTables_sort_icon icon ${sort[2] ? (sort[2] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="tab-col4" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 11px;" aria-sort="descending" aria-label="Flight number: activate to sort column ascending" on:click={() => {sortTrigger(3)}}>
                                        <div class="DataTables_sort_wrapper">
                                            <span class="tableauvols-voltitle2 visually-hidden">Flight number</span>
                                            <span class={`DataTables_sort_icon icon ${sort[3] ? (sort[3] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="tab-col5" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 17px;" aria-label="Destination: activate to sort column ascending" on:click={() => {sortTrigger(4)}}>
                                        <div class="DataTables_sort_wrapper">
                                            Destination<span class={`DataTables_sort_icon icon ${sort[4] ? (sort[4] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="tab-col6" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 13px;" aria-label="State: activate to sort column ascending" on:click={() => {sortTrigger(5)}}>
                                        <div class="DataTables_sort_wrapper">
                                            State<span class={`DataTables_sort_icon icon ${sort[5] ? (sort[5] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="tab-col8" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Gate: activate to sort column ascending" on:click={() => {sortTrigger(6)}}>
                                        <div class="DataTables_sort_wrapper">
                                            Gate<span class={`DataTables_sort_icon icon ${sort[6] ? (sort[6] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="last tab-col7 no-sortable tableauvols-suivi-header" rowspan="1" colspan="1" style="width: 10px;">
                                        Follow
                                    </th>
                                </tr>
                            {:else}
                                <tr id="tableauvols-arrival-thead">
                                    <th class="first tab-col1" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Sched: activate to sort column descending" style="width: 13px;" on:click={() => {sortTrigger(0)}}>
                                        <div class="DataTables_sort_wrapper">Sched<span class={`DataTables_sort_icon icon ${sort[1] ? (sort[1] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                    </th>
                                    <th class="tab-col2" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Revised: activate to sort column ascending" style="width: 12px;" on:click={() => {sortTrigger(1)}}>
                                        <div class="DataTables_sort_wrapper">Revised<span class={`DataTables_sort_icon icon ${sort[1] ? (sort[1] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                    </th>
                                    <th class="tab-col3" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Flight: activate to sort column ascending" style="width: 16px;" on:click={() => {sortTrigger(2)}}>
                                        <div class="DataTables_sort_wrapper"><span class="tableauvols-voltitle">Flight</span><span class={`DataTables_sort_icon icon ${sort[2] ? (sort[2] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                    </th>
                                    <th class="tab-col4" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Flight number: activate to sort column ascending" style="width: 9px;" on:click={() => {sortTrigger(3)}}>
                                        <div class="DataTables_sort_wrapper"><span class="tableauvols-voltitle2 visually-hidden">Flight number</span><span class={`DataTables_sort_icon icon ${sort[3] ? (sort[3] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                    </th>
                                    <th class="tab-col5" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Origin: activate to sort column ascending" style="width: 21px;" on:click={() => {sortTrigger(4)}}>
                                        <div class="DataTables_sort_wrapper">Origin<span class={`DataTables_sort_icon icon ${sort[4] ? (sort[4] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                    </th>
                                    <th class="tab-col6" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="State: activate to sort column ascending" style="width: 16px;" on:click={() => {sortTrigger(5)}}>
                                        <div class="DataTables_sort_wrapper">State<span class={`DataTables_sort_icon icon ${sort[5] ? (sort[5] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                    </th>
                                    <th class="tab-col8" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Gate: activate to sort column ascending" on:click={() => {sortTrigger(6)}}>
                                        <div class="DataTables_sort_wrapper">
                                            Gate<span class={`DataTables_sort_icon icon ${sort[6] ? (sort[6] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                        </div>
                                    </th>
                                    <th class="last tab-col7 no-sortable tableauvols-suivi-header" role="columnheader" rowspan="1" colspan="1" aria-label="Follow" style="width: 13px;">
                                        <div class="DataTables_sort_wrapper">Follow<span class="DataTables_sort_icon"></span></div>
                                    </th>
                                </tr>
                            {/if}
                        </thead>
                    </table>
                </div>
            </div> -->
            <div class="dataTables_scrollBody w-full rounded-md shadow overflow-auto">
                <table class="tab tab-skin1 tableauvols tableauvols-complexe tableauvols-departure enhance enhance-flightBoardSortable-applied dataTable" data-flightboardsortable-itemsbypage="3000" data-flightboardsortable-type="all" data-flightboardsortable-filtersupdate="tableauvols-filtersupdate" data-flightboardsortable-triggeredevent="tableauvols-start" data-flightboardsortable-receiverevent="tableauvols-update" data-flightboardsortable-data="departure" data-flightboardsortable-mobile-show-all="true" data-enhance="flightBoardSortable" style="margin-left: 0px; width: 100%;">
                    <thead class="tab-skin1-thead">
                        {#if CONFIG.dataType === 'departures'}
                            <tr id="tableauvols-departure-thead">
                                <th class="first tab-col1" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Sched: activate to sort column ascending" on:click={() => {sortTrigger(0)}}>
                                    <div class="DataTables_sort_wrapper">
                                        Sched<span class={`DataTables_sort_icon icon ${sort[0] ? (sort[0] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="tab-col2" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 11px;" aria-label="Revised: activate to sort column ascending" on:click={() => {sortTrigger(1)}}>
                                    <div class="DataTables_sort_wrapper">
                                        Revised<span class={`DataTables_sort_icon icon ${sort[1] ? (sort[1] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="tab-col3" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 15px;" aria-label="Flight: activate to sort column ascending" on:click={() => {sortTrigger(2)}}>
                                    <div class="DataTables_sort_wrapper">
                                        <span class="tableauvols-voltitle">Flight</span>
                                        <span class={`DataTables_sort_icon icon ${sort[2] ? (sort[2] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="tab-col4" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 11px;" aria-sort="descending" aria-label="Flight number: activate to sort column ascending" on:click={() => {sortTrigger(3)}}>
                                    <div class="DataTables_sort_wrapper">
                                        <span class="tableauvols-voltitle2 visually-hidden">Flight number</span>
                                        <span class={`DataTables_sort_icon icon ${sort[3] ? (sort[3] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="tab-col5" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 17px;" aria-label="Destination: activate to sort column ascending" on:click={() => {sortTrigger(4)}}>
                                    <div class="DataTables_sort_wrapper">
                                        Destination<span class={`DataTables_sort_icon icon ${sort[4] ? (sort[4] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="tab-col6" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 13px;" aria-label="State: activate to sort column ascending" on:click={() => {sortTrigger(5)}}>
                                    <div class="DataTables_sort_wrapper">
                                        State<span class={`DataTables_sort_icon icon ${sort[5] ? (sort[5] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="tab-col8" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Gate: activate to sort column ascending" on:click={() => {sortTrigger(6)}}>
                                    <div class="DataTables_sort_wrapper">
                                        Gate<span class={`DataTables_sort_icon icon ${sort[6] ? (sort[6] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="last tab-col7 no-sortable tableauvols-suivi-header" rowspan="1" colspan="1" style="width: 10px;">
                                    Follow
                                </th>
                            </tr>
                        {:else}
                            <tr id="tableauvols-arrival-thead">
                                <th class="first tab-col1" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Sched: activate to sort column descending" style="width: 13px;" on:click={() => {sortTrigger(0)}}>
                                    <div class="DataTables_sort_wrapper">Sched<span class={`DataTables_sort_icon icon ${sort[1] ? (sort[1] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                </th>
                                <th class="tab-col2" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Revised: activate to sort column ascending" style="width: 12px;" on:click={() => {sortTrigger(1)}}>
                                    <div class="DataTables_sort_wrapper">Revised<span class={`DataTables_sort_icon icon ${sort[1] ? (sort[1] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                </th>
                                <th class="tab-col3" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Flight: activate to sort column ascending" style="width: 16px;" on:click={() => {sortTrigger(2)}}>
                                    <div class="DataTables_sort_wrapper"><span class="tableauvols-voltitle">Flight</span><span class={`DataTables_sort_icon icon ${sort[2] ? (sort[2] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                </th>
                                <th class="tab-col4" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Flight number: activate to sort column ascending" style="width: 9px;" on:click={() => {sortTrigger(3)}}>
                                    <div class="DataTables_sort_wrapper"><span class="tableauvols-voltitle2 visually-hidden">Flight number</span><span class={`DataTables_sort_icon icon ${sort[3] ? (sort[3] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                </th>
                                <th class="tab-col5" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Origin: activate to sort column ascending" style="width: 21px;" on:click={() => {sortTrigger(4)}}>
                                    <div class="DataTables_sort_wrapper">Origin<span class={`DataTables_sort_icon icon ${sort[4] ? (sort[4] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                </th>
                                <th class="tab-col6" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="State: activate to sort column ascending" style="width: 16px;" on:click={() => {sortTrigger(5)}}>
                                    <div class="DataTables_sort_wrapper">State<span class={`DataTables_sort_icon icon ${sort[5] ? (sort[5] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span></div>
                                </th>
                                <th class="tab-col8" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Gate: activate to sort column ascending" on:click={() => {sortTrigger(6)}}>
                                    <div class="DataTables_sort_wrapper">
                                        Gate<span class={`DataTables_sort_icon icon ${sort[6] ? (sort[6] == 1 ? 'icon-arrow-up' : 'icon-arrow-down') : 'icon-arrow-updown'} icon-sortable-desactive`}></span>
                                    </div>
                                </th>
                                <th class="last tab-col7 no-sortable tableauvols-suivi-header" role="columnheader" rowspan="1" colspan="1" aria-label="Follow" style="width: 13px;">
                                    <div class="DataTables_sort_wrapper">Follow<span class="DataTables_sort_icon"></span></div>
                                </th>
                            </tr>
                        {/if}
                    </thead>
                    <tbody class="tab-skin1-tbody" aria-live="polite" aria-relevant="all" id="tableauvols-tbody">
                        {#each filteredFlights as flight}
                            <FlightTableRow CONFIG={CONFIG} flight={flight} logo={logoURLs[flight['airlineID']]}/>
                            <!-- <li>{flight['flightNumber']}</li> -->
                        {/each}
                        {#if filteredFlights.length === 0}
                            <tr>
                                <td class="p-[16.8px] w-full" colspan="8">{status}</td>
                            </tr>
                        {/if} 
                        
                    </tbody>   
                </table>
            </div>
        </section>
    </div>   
</div>              