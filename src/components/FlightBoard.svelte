<script>
    const currentDate = new Date()

    const formatMonth = (/** @type {string} */ str) => {
        return str.slice(0,3) + '.' + str.slice(3);
    }

    let dateToday = formatMonth(currentDate.toLocaleDateString('en-ca', { month:"short", day: "numeric"}));
    let dateTomorrow = formatMonth(new Date(Date.now() + 1000 * 3600 * 24).toLocaleDateString('en-ca', { month:"short", day: "numeric"}));
</script>

<div class="block-tableauVols">
    <div class="tableauxvols-automaticupdate-wrapper overflow-hidden" >
        <div data-enhance="automaticUpdate" class="enhance tableauxvols-automaticupdate enhance-automaticUpdate-applied" data-automaticupdate-receiverevent="tableauvols-start" data-automaticupdate-type="serverside" data-automaticupdate-triggeredevent="tableauvols-update" data-automaticupdate-start="false" data-automaticupdate-trigger=".tableauvols-automaticupdate-trigger" style="color: #ffffff;">
            <span class="tableauxvols-automaticupdate-label" id="airportIDHeader">
                &nbsp;      
            </span>
            <br>
            <span class="tableauxvols-automaticupdate-label">
                Last <strong>update </strong>:&nbsp;      
            </span>
            <span class="automaticupdate-label">calculating</span>
            <a class="tableauvols-automaticupdate-trigger" href="/" style="cursor: pointer;">
                <span id="canvasloader-container-tTlE9tm1ge" style="display: none;" class="canvasloader-wrapper">
                    <div id="canvasLoader-tTlE9tm18h" style="display: block;">
                        <canvas width="16" height="16"></canvas>
                        <canvas width="16" height="16" style="display: none;"></canvas>
                    </div>
                </span>
                <span class="refresher" style="display: block;">
                    <span class="visually-hidden">Refresh flight information</span>
                </span>
            </a>
        </div>

        <a id="tableauvols-show-arrivals" class="tableauxvols-showall"><span class="icon icon-arrow-left" aria-hidden="true"></span><span>See arrivals</span></a>
        <a id="tableauvols-show-departures" class="tableauxvols-showall"><span class="icon icon-arrow-left" aria-hidden="true"></span><span>See departures</span></a>
    </div>

    <div class="flightsRefreshAlertWrapper" aria-live="polite"></div>
    <div class="flightsRefreshAlert" style="display: block;" hidden><span class="icon icon-rafraichissement"></span><a href="#">New information available</a></div>
    <div class="warningnbox hide" style="opacity: 0; display: none;"><span class="icon icon-attention"></span><span class="warningbox-label"></span></div>

    <!-- tableauvols-filters-mobile
    neutral -->

    <div id="DataTables_Table_0_wrapper" class="dataTables_wrapper tableauvols-wrapper">
        <div class="equalize tableauvols-filters enhance enhance-equalize-applied" data-enhance="equalize">
            <div class="equalize-row">
                <a data-anchor="#dateAnchor1" id="analytics_departure_today" class="btn-primary btn-action btn-tabulation equalize-cell dark" style="width: 50%;">
                    <span class="tableauvols-filters-day">today</span>
                    <span class="tableauvols-filters-date">({dateToday})</span>
                </a>
                <a data-anchor="#dateAnchor2" id="analytics_departure_tomorrow" class="btn-primary btn-action btn-tabulation equalize-cell last" style="width: 50%;">
                    <span class="tableauvols-filters-day">tomorrow</span>
                    <span class="tableauvols-filters-date">({dateTomorrow})</span>
                </a>
            </div>
        </div>
        <div class="fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corn**er-tr ui-helper-clearfix searchDataTables-wrapper clearfix"> <!-- searchDatatables-wrapper-mobile-->
            <div class="dataTables_filter searchDataTables" id="DataTables_Table_0_filter">
                <label for="search" class="searchLabel">
                    <input type="text" id="search" placeholder="Search for flights ...">
                    <span class="visually-hidden">Search for flights ...</span>
                    <button class="fakebutton icon search" aria-hidden="true" aria-label="Search" disabled={true}></button>
                </label>
            </div>
        </div>
        <div class="dataTables_scroll clearfix withShadow">
            <div class="dataTables_scrollHead ui-state-default" style="overflow: hidden; position: relative; border: 0px; width: 100%;">
                <div class="dataTables_scrollHeadInner" style="width: 462px; padding-right: 0px;">
                    <table id="tableauvols-main" class="tab tab-skin1 tableauvols tableauvols-complexe tableauvols-departure enhance enhance-flightBoardSortable-applied dataTable" data-flightboardsortable-itemsbypage="3000" data-flightboardsortable-type="all" data-flightboardsortable-filtersupdate="tableauvols-filtersupdate" data-flightboardsortable-triggeredevent="tableauvols-start" data-flightboardsortable-receiverevent="tableauvols-update" data-flightboardsortable-data="departure" data-flightboardsortable-mobile-show-all="true" data-enhance="flightBoardSortable" style="margin-left: 0px; width: 462px;">
                        <thead class="tab-skin1-thead">
                            <tr role="row" id="tableauvols-departure-thead">
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
                            <tr role="row" id="tableauvols-arrival-thead" style="display: none;">
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
                        </thead>
                    </table>
                </div>
            </div>
            <div class="dataTables_scrollBody" style="overflow: auto; height: 600px; width: 100%; position: static;">
                <table class="tab tab-skin1 tableauvols tableauvols-complexe tableauvols-departure enhance enhance-flightBoardSortable-applied dataTable" data-flightboardsortable-itemsbypage="3000" data-flightboardsortable-type="all" data-flightboardsortable-filtersupdate="tableauvols-filtersupdate" data-flightboardsortable-triggeredevent="tableauvols-start" data-flightboardsortable-receiverevent="tableauvols-update" data-flightboardsortable-data="departure" data-flightboardsortable-mobile-show-all="true" data-enhance="flightBoardSortable" style="margin-left: 0px; width: 100%;">
                    <thead class="tab-skin1-thead">
                        <tr role="row" style="height: 0px;">
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
                        <!-- <tr class="tableauvols-row tab-skin1-row" flight-index="9">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697919000</span><time class="tableauvols-datetime" datetime="2023-10-21T16:10"><span class="tableauvols-hours tableauxvols-normal">16:10</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail AC1606</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/ACA_FIDS%402x.png" alt="Company AIR CANADA"><span class="visually-hidden text-for-search" aria-hidden="true">Company AIR CANADA</span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>AC1606</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Fort Lauderdale</span><span class="visually-hidden">To</span>Fort Lauderdale</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>C76</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=AC1606" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS AC1606</span></a></td>
                        </tr>
                        <tr class="tableauvols-row tab-skin1-row" flight-index="63">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697931600</span><time class="tableauvols-datetime" datetime="2023-10-21T19:40"><span class="tableauvols-hours tableauxvols-normal">19:40</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail TS174</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/TSC_FIDS%402x.png" alt="Company AIR TRANSAT"><span class="visually-hidden text-for-search" aria-hidden="true">Company AIR TRANSAT</span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>TS174</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Porto</span><span class="visually-hidden">To</span>Porto</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>A61</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=TS174" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS TS174</span></a></td>
                        </tr>
                        <tr class="tableauvols-row tab-skin1-row" flight-index="65">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697931900</span><time class="tableauvols-datetime" datetime="2023-10-21T19:45"><span class="tableauvols-hours tableauxvols-normal">19:45</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail AC8015</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/ACA_FIDS%402x.png" alt="Company AIR CANADA "><span class="visually-hidden text-for-search" aria-hidden="true">Company AIR CANADA </span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>AC8015</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Ottawa</span><span class="visually-hidden">To</span>Ottawa</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>A10</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=AC8015" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS AC8015</span></a></td>
                        </tr> 
                        <tr class="tableauvols-row tab-skin1-row" flight-index="34">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697925900</span><time class="tableauvols-datetime" datetime="2023-10-21T18:05"><span class="tableauvols-hours tableauxvols-normal">18:05</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail LH479</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/DLH_FIDS%402x.png" alt="Compagny LUFTHANSA"><span class="visually-hidden text-for-search" aria-hidden="true">Compagny LUFTHANSA</span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>LH479</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Francfort/Frankfurt</span><span class="visually-hidden">To</span>Francfort/Frankfurt</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>A61</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=LH479" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS LH479</span></a></td>
                        </tr>
                        <tr class="tableauvols-row tab-skin1-row" flight-index="45">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697928000</span><time class="tableauvols-datetime" datetime="2023-10-21T18:40"><span class="tableauvols-hours tableauxvols-normal">18:40</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail PD126</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/POE_FIDS%402x.png" alt="Compagny PORTER "><span class="visually-hidden text-for-search" aria-hidden="true">Compagny PORTER </span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>PD126</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Toronto Pearson</span><span class="visually-hidden">To</span>Toronto Pearson</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>A2</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=PD126" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS PD126</span></a></td>
                        </tr>
                        <tr class="tableauvols-row tab-skin1-row" flight-index="101">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697941800</span><time class="tableauvols-datetime" datetime="2023-10-21T22:30"><span class="tableauvols-hours tableauxvols-normal">22:30</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail DL8955</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/DAL_FIDS%402x.png" alt="Compagny DELTA"><span class="visually-hidden text-for-search" aria-hidden="true">Compagny DELTA</span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>DL8955</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Washington Dulles</span><span class="visually-hidden">To</span>Washington Dulles</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>C73</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=DL8955" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS DL8955</span></a></td>
                        </tr>
                        <tr class="tableauvols-row tab-skin1-row" flight-index="100">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697941800</span><time class="tableauvols-datetime" datetime="2023-10-21T22:30"><span class="tableauvols-hours tableauxvols-normal">22:30</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail TS324</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/TSC_FIDS%402x.png" alt="Compagny AIR TRANSAT"><span class="visually-hidden text-for-search" aria-hidden="true">Compagny AIR TRANSAT</span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>TS324</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Amsterdam</span><span class="visually-hidden">To</span>Amsterdam</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>A68</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=TS324" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS TS324</span></a></td>
                        </tr>
                        <tr class="tableauvols-row tab-skin1-row" flight-index="102">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697942100</span><time class="tableauvols-datetime" datetime="2023-10-21T22:35"><span class="tableauvols-hours tableauxvols-normal">22:35</span><span class="tableauvols-date tableauxvols-normal">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail QR764</button></td>
                            <td class="tab-col2"><span class="visually-hidden">No revision for this flight.</span></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/QTR_FIDS%402x.png" alt="Compagny QATAR AIRWAYS "><span class="visually-hidden text-for-search" aria-hidden="true">Compagny QATAR AIRWAYS </span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>QR764</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Doha</span><span class="visually-hidden">To</span>Doha</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>-</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>A59</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=QR764" class="tableauvols-alertsms-shortdesc"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS QR764</span></a></td>
                        </tr> 
                        <tr class="tableauvols-row tab-skin1-row" flight-index="38">
                            <td class="first tab-col1"><span class="hr" aria-hidden="true">todayflight</span><span class="hr" aria-hidden="true">1697928000</span><time class="tableauvols-datetime" datetime="2023-10-21T18:40"><span class="tableauvols-hours tableauvols-prevu-inactive">18:40</span><span class="tableauvols-date tableauvols-prevu-inactive">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail AC8725</button></td>
                            <td class="tab-col2"><span class="hr" aria-hidden="true">1697929200</span><time class="tableauvols-datetime" datetime="2023-10-21T19:00"><span class="tableauvols-hours tableauxvols-medium">19:00</span><span class="tableauvols-date tableauxvols-medium">Oct. 21</span></time><button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">Toggle the flight detail AC8725</button></td>
                            <td class="tab-col3"><img class="tableauxvols-flightdetails-logo-small" src="https://www.admtl.com/sites/default/files/styles/reduced_for_retina/public/ACA_FIDS%402x.png" alt="Compagny AIR CANADA "><span class="visually-hidden text-for-search" aria-hidden="true">Compagny AIR CANADA </span></td>
                            <td class="tab-col4 tableauvols-numvol"><span class="visually-hidden">Flight</span>AC8725</td>
                            <td class="tab-col5"><span class="hr" aria-hidden="true">Washington Dulles</span><span class="visually-hidden">To</span>Washington Dulles</td>
                            <td class="tab-col6"><span class="visually-hidden">Status</span>Delayed</td>
                            <td class="tab-col8"><span class="visually-hidden">Door number</span>C87</td>
                            <td class="tab-col7 tableauvols-suivi last"><a href="https://www.admtl.com/en/flights/sms-service?vol=AC8725" class="tableauvols-alertsms-shortdesc analytics_vol_alertesms"><span class="tableauvols-icon tableauvols-icon-favoris"></span><span class="tableauvols-icon tableauvols-icon-sms" aria-hidden="true"></span><span class="visually-hidden">Track by SMS AC8725</span></a></td>
                        </tr> -->
                    </tbody>    
                </table>
            </div>
        </div>
    </div>   
    <div class="tableauvols-resize withShadow" style="display: block;">
        <div>
            <a href="#" class="dispAll" style="display: inline;"><span class="icon icon-arrow-down"></span> <span>See more flights</span></a>
            <a href="#" class="dispLess" style="display: none;"><span class="icon icon-arrow-up"></span> <span>See fewer flights</span></a>
        </div>
    </div> 
</div>              