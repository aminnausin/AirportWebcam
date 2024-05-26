<script>
	import FlightTableRow from './FlightTableRow.svelte';
    export let airport = {'code' : 'yul', 'icao' : 'CYUL', 'radio': '_twr2', 'location': 'Montreal, Quebec, Canada'};

    const currentDate = new Date();
    const formatMonth = (/** @type {string} */ str) => {
        return str.slice(0,3) + '.' + str.slice(3);
    }

    let dateToday = formatMonth(currentDate.toLocaleDateString('en-ca', { month:"short", day: "numeric"}));
    let dateTomorrow = formatMonth(new Date(Date.now() + 1000 * 3600 * 24).toLocaleDateString('en-ca', { month:"short", day: "numeric"}));
    let lastUpdate = 'a few seconds ago';

    // @ts-ignore
    /**
     * @type {Date | null}
     */
    let rawLastUpdate = null;

    let CONFIG = {
        dataType: 'departures'
    };
    
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
        .then(data => {
            let rawFlightsCombined = data[CONFIG.dataType] ?? [];

            for (let i = 0; i < rawFlightsCombined.length; i++) {
                const flight = rawFlightsCombined[i];
                let dateSource = CONFIG.dataType === 'departures' ? 'localisedScheduledDepartureTime' : 'localisedScheduledArrivalTime';
                let flightDate = new Date(flight[dateSource]).toLocaleDateString([], { day: "numeric"});
                if (flightDate == currentDate.toLocaleDateString([], { day: "numeric"})) {
                    // @ts-ignore
                    flightsToday = [...flightsToday, flight];
                }
                else{
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
        console.log(searchQuery);
        filteredFlights = rawFlights[selectedFlightSet].filter((/** @type {{ [x: string]: string; }} */ flight) => {
            let reg = new RegExp(searchQuery);
            return reg.test(flight['flightNumber'])
        })
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
</script>

<div class="block-tableauVols w-full">
    <div class="tableauxvols-automaticupdate-wrapper overflow-hidden flex flex-col md:flex-row md:justify-between items-start gap-1 mb-2">
        <section data-enhance="automaticUpdate" class="flex flex-wrap items-center min-w-[66%]">
            <div class="font-bold text-xl w-full align-middle tableauxvols-automaticupdate-label justify-start flex" id="airportIDHeader" use:titleUpdateTrigger={airport}>
                <span class="line-clamp-1">{title}</span>&nbsp;<span class="line-clamp-1">({filteredFlights.length} Results)</span>
            </div>
            <div class="font-bold text-xl align-middle tableauxvols-automaticupdate-label">
                Last update :&nbsp;      
            </div>
            <div class="leading-7 align-middle h-full blockautomaticupdate-label">{lastUpdate}</div>
            <a class="tableauvols-automaticupdate-trigger cursor-pointer" href="/" on:click={handleUpdate}>
                <span id="canvasloader-container-tTlE9tm1ge" style="display: none;" class="canvasloader-wrapper">
                    <div id="canvasLoader-tTlE9tm18h" style="display: block;">
                        <canvas width="16" height="16"></canvas>
                        <canvas width="16" height="16" style="display: none;"></canvas>
                    </div>
                </span>
                <span class="refresher icon after:content-['\E080'] px-2" style="display: block;">
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
                <button class={`btn-action w-full ${selectedFlightSet === 0 ? 'dark' : ''}`} on:click={() => {selectedFlightSet = 0; filteredFlights = rawFlights[selectedFlightSet]; filteredFlights = filteredFlights;}}>
                    <span class="tableauvols-filters-day w-full">today</span>
                    <span class="tableauvols-filters-date w-full line-clamp-1">({dateToday})</span>
                </button>
                <button class={`btn-action w-full ${selectedFlightSet === 1 ? 'dark' : ''}`} on:click={() => {selectedFlightSet = 1; filteredFlights = rawFlights[selectedFlightSet]; filteredFlights = filteredFlights;}}>
                    <span class="tableauvols-filters-day w-full">tomorrow</span>
                    <span class="tableauvols-filters-date w-full line-clamp-1">({dateTomorrow})</span>
                </button>
            </div>
            <div id="DataTables_Table_filter" class="w-full md:w-auto text-[#6c757b] border-solid border border-[#bcc1c4]">
                <label for="search" class="relative block h-full  p-0 leading-5">
                    <input type="text" id="search" placeholder="Search for flights ..." class="focus-within:outline-none w-full h-full font-light py-4 ps-6 pe-14" bind:value={searchQuery} on:input={() => {filterFlights();}} >
                    <span class="hidden">Search for flights ...</span>
                    <button class="fakebutton absolute h-full right-0 top-0 cursor-pointer icon after:content-['\E037'] text-4xl leading-5" aria-hidden="true" aria-label="Search" disabled={true}></button>
                </label>
            </div>
        </div>
        <section class="relative">
            <div class="dataTables_scrollHead ui-state-default overflow-hidden border-0 w-full shadow-lg rounded-t-md z-10">
                <div class="dataTables_scrollHeadInner">
                    <table id="tableauvols-main" class="tab tab-skin1 tableauvols tableauvols-complexe tableauvols-departure enhance enhance-flightBoardSortable-applied dataTable">
                        <thead class="tab-skin1-thead">
                            {#if CONFIG.dataType === 'departures'}
                                <tr id="tableauvols-departure-thead">
                                    <th class="first tab-col1 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Sched: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            Sched<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span>
                                        </div>
                                    </th>
                                    <th class="tab-col2 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 11px;" aria-label="Revised: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            Revised<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span>
                                        </div>
                                    </th>
                                    <th class="tab-col3 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 15px;" aria-label="Flight: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            <span class="tableauvols-voltitle">Flight</span>
                                            <span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span>
                                        </div>
                                    </th>
                                    <th class="tab-col4 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 11px;" aria-sort="descending" aria-label="Flight number: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            <span class="tableauvols-voltitle2 visually-hidden">Flight number</span>
                                            <span class="DataTables_sort_icon icon icon-arrow-down icon-sortable-desc"></span>
                                        </div>
                                    </th>
                                    <th class="tab-col5 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 17px;" aria-label="Destination: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            Destination<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span>
                                        </div>
                                    </th>
                                    <th class="tab-col6 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 13px;" aria-label="State: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            State<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span>
                                        </div>
                                    </th>
                                    <th class="tab-col8 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Gate: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            Gate<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span>
                                        </div>
                                    </th>
                                    <th class="last tab-col7 no-sortable tableauvols-suivi-header" rowspan="1" colspan="1" style="width: 10px;">
                                        Follow
                                    </th>
                                </tr>
                            {:else}
                                <tr id="tableauvols-arrival-thead">
                                    <th class="first tab-col1 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Sched: activate to sort column descending" style="width: 13px;">
                                        <div class="DataTables_sort_wrapper">Sched<span class="DataTables_sort_icon icon icon-arrow-up icon-sortable-asc"></span></div>
                                    </th>
                                    <th class="tab-col2 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Revised: activate to sort column ascending" style="width: 12px;">
                                        <div class="DataTables_sort_wrapper">Revised<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span></div>
                                    </th>
                                    <th class="tab-col3 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Flight: activate to sort column ascending" style="width: 16px;">
                                        <div class="DataTables_sort_wrapper"><span class="tableauvols-voltitle">Flight</span><span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span></div>
                                    </th>
                                    <th class="tab-col4 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Flight number: activate to sort column ascending" style="width: 9px;">
                                        <div class="DataTables_sort_wrapper"><span class="tableauvols-voltitle2 visually-hidden">Flight number</span><span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span></div>
                                    </th>
                                    <th class="tab-col5 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="Origin: activate to sort column ascending" style="width: 21px;">
                                        <div class="DataTables_sort_wrapper">Origin<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span></div>
                                    </th>
                                    <th class="tab-col6 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" aria-label="State: activate to sort column ascending" style="width: 16px;">
                                        <div class="DataTables_sort_wrapper">State<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span></div>
                                    </th>
                                    <th class="tab-col8 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="width: 12px;" aria-label="Gate: activate to sort column ascending">
                                        <div class="DataTables_sort_wrapper">
                                            Gate<span class="DataTables_sort_icon icon icon-arrow-updown icon-sortable-desactive"></span>
                                        </div>
                                    </th>
                                    <th class="last tab-col7 no-sortable ui-state-default tableauvols-suivi-header" role="columnheader" rowspan="1" colspan="1" aria-label="Follow" style="width: 13px;">
                                        <div class="DataTables_sort_wrapper">Follow<span class="DataTables_sort_icon"></span></div>
                                    </th>
                                </tr>
                            {/if}
                        </thead>
                    </table>
                </div>
            </div>
            <div class="dataTables_scrollBody w-full rounded-b-md shadow overflow-auto">
                <table class="tab tab-skin1 tableauvols tableauvols-complexe tableauvols-departure enhance enhance-flightBoardSortable-applied dataTable" data-flightboardsortable-itemsbypage="3000" data-flightboardsortable-type="all" data-flightboardsortable-filtersupdate="tableauvols-filtersupdate" data-flightboardsortable-triggeredevent="tableauvols-start" data-flightboardsortable-receiverevent="tableauvols-update" data-flightboardsortable-data="departure" data-flightboardsortable-mobile-show-all="true" data-enhance="flightBoardSortable" style="margin-left: 0px; width: 100%;">
                    <thead class="tab-skin1-thead">
                        <tr style="height: 0px;">
                            <th class="first tab-col1 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 12px;" aria-label="Sched: activate to sort column ascending"></th>
                            <th class="tab-col2 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 11px;" aria-label="Revised: activate to sort column ascending"></th>
                            <th class="tab-col3 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 15px;" aria-label="Flight: activate to sort column ascending"></th>
                            <th class="tab-col4 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 11px;" aria-sort="descending" aria-label="Flight number: activate to sort column ascending"></th>
                            <th class="tab-col5 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 17px;" aria-label="Destination: activate to sort column ascending"></th>
                            <th class="tab-col6 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 13px;" aria-label="State: activate to sort column ascending"></th>
                            <th class="tab-col8 ui-state-default" role="columnheader" tabindex="0" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 12px;" aria-label="Gate: activate to sort column ascending"></th>
                            <th class="last tab-col7 no-sortable tableauvols-suivi-header" rowspan="1" colspan="1" style="padding-top: 0px; padding-bottom: 0px; border-top-width: 0px; border-bottom-width: 0px; height: 0px; width: 10px;"></th>
                        </tr>
                    </thead>
                    <tbody class="tab-skin1-tbody" aria-live="polite" aria-relevant="all" id="tableauvols-tbody">
                        {#each filteredFlights as flight}
                            <FlightTableRow CONFIG={CONFIG} flight={flight}/>
                            <!-- <li>{flight['flightNumber']}</li> -->
                        {/each}
                    </tbody>    
                </table>
            </div>
        </section>
    </div>   
</div>              