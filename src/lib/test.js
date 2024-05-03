const FlightBoardSortable = ($, DataProvider, Flights) => {
    /**************************************** UTILITIES ************************************************/

    var Generali18n = {
        "searchForFlight": "Search for flights ...",
        "trackBySms": "Track by SMS",
        "enProvenanceDe": "From",
        "heureArrivee": "Arrival time",
        "Statut": "Status",
        "Porte": "Gate",
        "Phone": "Phone :",
        "SansFrais": "Toll free :",
        "Website": "Website ",
        "ADestinationDe": "To",
        "HeureDeDepart": "Departure time",
        "Vol": "Flight",
        "ErrorAjaxFilter": "Sorry, a system error prevents us from displaying the list of commerces that you've requested..",
        "ErrorAjaxFilterLink": "Try refreshing the page later.",
        "ErrorAjaxGlobal": "Failure of the last attempt. The service is temporarily unavailable.",
        "RequestImages": "Ask the selected images",
        "SelectAImage": "Please select an image",
        "currently": "currently",
        "selHours": "Time",
        "HomeNewsMobile": "Press releases, public notices and other communications",
        "HomeNews": "See all",
        "RefreshData": "Refresh flight information",
        "previous": "Previous",
        "next": "Next",
        "play": "Play",
        "pause": "Pause",
        "search": "Search",
        "priorityLow": "Low occupancy",
        "priorityMedium": "Average occupancy",
        "priorityHigh": "High occupancy",
        "toggleFlightDetail": "Toggle the flight detail",
        "noRevisionFlight": 'No revision for this flight.',
        "compagny": 'Compagny',
        "doorNumber": 'Door number',
    };

    var Datatablesi18n = {
        "sEmptyTable": "No data available in table",
        "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
        "sInfoEmpty": "Showing 0 to 0 of 0 entries",
        "sInfoFiltered": "(filtered from _MAX_ total entries)",
        //avoid empty strings
        "sInfoPostFix": (""),
        //avoid empty strings
        "sInfoThousands": (","),
        "sLengthMenu": "Show _MENU_ entries",
        "sLoadingRecords": "Loading...",
        "sProcessing": "Processing...",
        "sSearch": "Search:",
        "sZeroRecords": "No matching records found",
        "oPaginate": {
            "sFirst": "First",
            "sLast": "Last",
            "sNext": "Next",
            "sPrevious": "Previous"
        },
        "oAria": {
            "sSortAscending": ": activate to sort column ascending",
            "sSortDescending": ": activate to sort column descending"
        }
    };

    var formatFlightDetails = {
        destination: function(label, destination) {
            var sOut = "";

            sOut += "<li class='tableauxvols-flightdetails-infos tableauxvols-flightdetails-destination'>";
            sOut += "<span class='tableauxvols-flightdetails-icons icon icon-volsdestinations'></span>";
            sOut += "<div class='tableauxvols-flightdetails-infoslabel'>" + label + "</div>";
            sOut += "<div class='tableauxvols-flightdetails-infostext'>" + destination + "</div>";
            sOut += "</li>";

            return sOut;
        },
        hours: function(label, statusCode, hours, hoursRevised) {
            var sOut = "",
                statusClass = this.getClassByStatusCode(statusCode);

            sOut += "<li class='tableauxvols-flightdetails-infos tableauxvols-flightdetails-hourswrapper'>";
            sOut += "<span class='tableauxvols-flightdetails-icons icon icon-heures'></span>";
            sOut += "<div class='tableauxvols-flightdetails-infoslabel'>" + label + "</div>";
            sOut += "<div class='tableauxvols-flightdetails-infostext'><span class='tableauxvols-flightdetails-hours " + statusClass + "'>" + hours + "</span> <span class='tableauxvols-flightdetails-hoursrevised'>" + hoursRevised + "</span></div>";
            sOut += "</li>";

            return sOut;
        },
        door: function(label, door) {
            var sOut = "";

            sOut += "<li class='tableauxvols-flightdetails-infos tableauxvols-flightdetails-doorwrapper tableauxvols-flightdetails-infos-skin2'>";
            sOut += "<span class='tableauxvols-flightdetails-icons icon icon-statusvol'></span>";
            sOut += "<div class='tableauxvols-flightdetails-infoslabel'>" + label + "</div>";
            sOut += "<div class='tableauxvols-flightdetails-infostext'><span class='tableauxvols-flightdetails-door'>" + door + "</span><span class='icon icon-orientation tableauxvols-flightdetails-dooricon'></span></div>";     // TODO :: Add icon for the door
            sOut += "</li>";

            return sOut;
        },
        status: function(label, statusCode, status, statusMore) {
            var sOut = "",
                statusClass = this.getClassByStatusCode(statusCode);

            sOut += "<li class='tableauxvols-flightdetails-infos tableauxvols-flightdetails-statuswrapper last'>";
            sOut += "<span class='tableauxvols-flightdetails-icons icon icon-infos'></span>";
            sOut += "<div class='tableauxvols-flightdetails-infoslabel'>" + label + "</div>";
            sOut += "<div class='tableauxvols-flightdetails-infostext'><span class='tableauxvols-flightdetails-status " + statusClass + "'>" + status + "</span><span class='tableauxvols-flightdetails-status'> " + statusMore + "</span></div>";
            sOut += "</li>";

            return sOut;
        },
        waiting: function(label, duration) {
            var sOut = "";

            sOut += "<li class='tableauxvols-waiting-time'>";
            sOut += "<div class='tableauxvols-flightdetails-infoslabel'>" + label + "</div>";

            var waitingTimeMessage = " <span class='tableauxvols-flightdetails-waitinglightbox'>(<a href='#tableauxvols-overlay-douanes' class='enhance' data-enhance='magnificPopup'  data-magnific-popup-type='selector' data-effect='mfp-zoom-in'><span class='visually-hidden'>" + label + "</span> " + Generali18n.currently + "</a>)</span>";

            if(isDarksite){
                waitingTimeMessage = "";
            }

            sOut += "<div class='tableauxvols-flightdetails-infostext'>" + duration + waitingTimeMessage + "</div>";
            sOut += "</li>";

            return sOut;
        },
        canceled: function(label, phoneNumber, freePhoneNumber, website, companyname) {
            var sOut = "";

            sOut += "<div>";
            sOut += "<div class='tableauxvols-flightdetails-infoslabel tableauxvols-flightdetails-canceledlabel'>" + label + "</div>";
            sOut += "<div class='tableauxvols-flightdetails-infostext'>";
            sOut += "<span class='tableauxvols-flightdetails-canceledtext'>" + Generali18n.Phone + " " + phoneNumber + "</span>";
            sOut += "<span class='tableauxvols-flightdetails-canceledtext'>" + Generali18n.SansFrais + " " + freePhoneNumber + "</span>";
            sOut += "<span class='tableauxvols-flightdetails-canceledtext'>" +  "<a href='" + website + "'>" + Generali18n.Website + "(" + companyname + ")" + "</a></span>";       // TODO :: add link
            sOut += "</div>";
            sOut += "</div>";

            return sOut;
        },
        leftContent: function(logo, logoRetina, logoAlt, flightNumber, alertSmsUrl) {
            var sOut = "";

            sOut += "<div class='tableauxvols-flightdetails-left'>";
            if (logo !== "")
                sOut += "<div  class='enhance tableauxvols-flightdetails-logo' role='img' aria-label='" + logoAlt + "'data-enhance='retinaImages' data-interchange='[" + logo + ", (normal)], [" + logoRetina + ", (retina)]'></div>";
            sOut += "<span class='tableauxvols-flightdetails-flight'>" + Generali18n.Vol + " </span><span class='tableauxvols-flightdetails-flightnumber'>" + flightNumber + "</span>";

            var url = alertSmsUrl;
            if(!isDarksite){
                sOut += "<a href='" + url + "' class='tableauxvols-flightdetails-smswrapper analytics_vol_alertesms'><span class='icon icon-alertesms tableauxvols-flightdetails-smsicon' aria-hidden='true'></span><span class='tableauxvols-flightdetails-sms'>" + Generali18n.trackBySms + " <span class='visually-hidden'>" + flightNumber + "</span></span></a>";
            }
            sOut += "</div>";

            return sOut;
        },
        getClassByStatusCode: function(statusCode) {
            var customClass = "";

            switch (statusCode) {
                case "ANN":
                case "CAN":
                case "ANN/CAN":
                case "ANN\/CAN":
                    customClass = "tableauxvols-critical";
                    break;
                case "RET":
                case "DEL":
                case "RET\/DEL":
                case "RET/DEL":
                case "DEV":
                case "DEP/REV":
                case "ARR/REV":
                case "DEV/EARLY":
                case "DEV\/EARLY":
                    customClass = "tableauxvols-medium";
                    break;
                default:
                    customClass = "tableauxvols-normal";
                    break;
            }
            return customClass;
        }
    };

    function FlightTableRow(type, data, today, tomorrow) {
        var data = data,
            flight = [];

        function getRowDate(timestamp, hours, date, isPlannedDate, haveRevisedDate) {
            var html5Datetime = new Date(timestamp + ' GMT').toLocaleString([], {year: 'numeric', month: '2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}),
                status = "",
                template,
                customClass;

            if (isPlannedDate) {
                status = "todayflight";

                if (haveRevisedDate) {
                    customClass = "tableauvols-prevu-inactive";
                } else {
                    // TODO :: inser the status here is they have one
                    customClass = getStatusClass();
                }

                // the <span> with class hr is a workaround to make functionnal the filter with datatables ( with todayflight for the initialization , the timestamp for the sorting asc/desc )
                template = "<span class='hr' aria-hidden='true'>" + status + "</span><span class='hr' aria-hidden='true'>" + timestamp + "</span>";
            } else {
                var customClass = getStatusClass();

                // the <span> with class hr is a workaround to make functionnal the filter with datatables( the timestamp for the sorting asc/desc )
                template = "<span class='hr' aria-hidden='true'>" + timestamp + "</span>";
            }

            var time = "<span class='tableauvols-hours " + customClass + "'>" + hours + "</span><span class='tableauvols-date " + customClass + "'>" + date + "</span>"
            template += '<time  class="tableauvols-datetime" datetime="' + html5Datetime + '">' + time + '</time>';

            template += '<button class="tableauvols-toggle-button visually-hidden" aria-expanded="false">' + Generali18n.toggleFlightDetail + " " + data.flightNumber + "</button>";

            return template;
        }

        function getRowPlanned() {

            var havePlannedDate = (typeof data.plannedTimestamp != "undefined") ? true : false,
                haveRevisedDate = (data.revisedTimestamp !== "" || data.revisedHours !== "" || data.revised !== "") ? true : false;

            return havePlannedDate ? getRowDate(data.plannedTimestamp, data.plannedHours, data.planned, true, haveRevisedDate) : "";
        }

        function getRowRevised() {
            var haveRevisedDate = (data.revisedTimestamp !== "") ? true : false;
            var emptyRevision = '<span class="visually-hidden">' + Generali18n.noRevisionFlight + '</span>';

            return haveRevisedDate ? getRowDate(data.revisedTimestamp, data.revisedHours, data.revised, false, false) : emptyRevision;
        }

        function getVol1() {
            var compagnyTxt = Generali18n.compagny + ' ' + data.company;
            var img = "<img class='tableauxvols-flightdetails-logo-small' src='" + data.company_logo + "' alt='" + compagnyTxt + "'>";

            if (data.company_logo !== "") {
                return img + '<span class="visually-hidden text-for-search" aria-hidden="true">' + compagnyTxt + '</span>';
            }

            return '<span class="visually-hidden">' + compagnyTxt + '</span>';
        }

        function getVol2() {
            return '<span class="visually-hidden">' + Generali18n.Vol + '</span>' + data.flightNumber;
        }

        function getDestination() {
            // WORKAROUND for the sorting with name with accent character
            // We used a hidden span  with the destinationname without accent for the sorting
            return "<span class='hr' aria-hidden='true'>" + data.destinationWithoutAccent + "</span>" + '<span class="visually-hidden">' + Generali18n.ADestinationDe + '</span>' + data.destination;
        }

        function getStatus() {
            return '<span class="visually-hidden">' + Generali18n.Statut + '</span>' + data.status;
        }

        function getSuivre() {
            return "<a href='" + data.alertSmsUrl + "' class='tableauvols-alertsms-shortdesc analytics_vol_alertesms'><span class='tableauvols-icon tableauvols-icon-favoris'></span><span class='tableauvols-icon tableauvols-icon-sms' aria-hidden='true'></span><span class='visually-hidden'>" + Generali18n.trackBySms + " " + data.flightNumber + "</span></a>";
        }

        function getDoorNumber() {
            return '<span class="visually-hidden">' + Generali18n.doorNumber + '</span>' + data.details.doorNumber;
        }

        function getStatusClass() {
            var customClass;

            switch (data.statusCode) {
                case "ANN":
                case "CAN":
                case "ANN/CAN":
                case "ANN\/CAN":
                    customClass = "tableauxvols-critical";
                    break;
                case "RET":
                case "DEL":
                case "RET\/DEL":
                case "RET/DEL":
                case "DEV":
                case "DEV/EARLY":
                case "DEP/REV":
                case "ARR/REV":
                case "DEV\/EARLY":
                    customClass = "tableauxvols-medium";
                    break;

                default:
                    customClass = "tableauxvols-normal";
                    break;
            }

            return customClass;
        }
    /* PRÉVU */                 flight.push(getRowPlanned());
    /* REVISÉ */                flight.push(getRowRevised());
    /* VOL */                   flight.push(getVol1());
    /* VOL */                   flight.push(getVol2());
    /* PROVENANCE */            flight.push(getDestination());
    /* STATUS */                flight.push(getStatus());
        if (type == "departure") flight.push(getDoorNumber());
    /* SUIVRE */                flight.push(getSuivre());

        return flight;
    }

    function FlightsTableRow(type, data) {
        var flightsFormatted = [];

        var today = new Date().toLocaleString([], {year: 'numeric', month: '2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12: true}),
            tomorrow = new Date().setDate(new Date().getDate() + 1).toLocaleString([], {year: 'numeric', month: '2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12: true});

        function init(data) {
            var i = 0,
                length = data.length;

            for (i; i < length; i++) {

                var currentData = data[i],
                    timestamp = currentData.plannedTimestamp,
                    cDate,
                    areToday,
                    areTomorrow;

                if (timestamp !== "") {
                    flightsFormatted.push(new FlightTableRow(type, currentData, today, tomorrow));
                }
            }
        }

        init(data);

        return flightsFormatted;
    }

    function Warning(opts) {

        var $el = opts.$el,
            $label = opts.$label;

        return {
            setLabel: function (text) {
                $label.text(text);
            },
            show: function () {
                $el.css("display", "block");
                if ($el.css("opacity") == 0) {
                    TweenLite.to($el, .5, {
                        css: { "opacity": "1" }
                    });
                }
            },
            hide: function () {
                if ($el.css("opacity") == 1) {
                    TweenLite.to($el, .5, {
                        css: { "opacity": "0" },
                        onComplete: function () {
                            $el.css("display", "none");
                        }
                    });
                }
            },
            kill: function () {
                $el.remove();
            }
        }
    }

    /***********************************  FlightBoard  ****************************************/

    var FlightBoardSortable = {
        init: function (context) {
            var _t = this;

            eventEmitter = ADM.eventEmitter;

            $(context).each(function (index, el) {
                new FlightBoardSortableInstance(el);
            });
        }
    };

    function isDateInverted() {
        var filterSpan = $(".tableauvols-complexe thead th:first div span");

        return filterSpan.hasClass("icon-arrow-down");
    }

    function FlightBoardSortableInstance(el) {

        var $el = $(el),
            $elParrent = $(el).parent(),
            isUpdateIsStopped = false,
            isFirstFilter = true,
            isInverted = false,
            isDatatablesCreated = false,
            $datatables,
            CONFIG = {
                numElementsInThePage: $el.data("flightboardsortable-itemsbypage") || 15,
                limitItems: $el.data("flightboardsortable-limititems") || 5,
                receiverEvent: $el.data("flightboardsortable-receiverevent") || null,
                triggeredEvent: $el.data("flightboardsortable-triggeredevent") || null,
                filterUpdateEvent: $el.data("flightboardsortable-filtersupdate") || null,
                dataType: $el.data("flightboardsortable-data") || "arrival", // Possible value : "arrival" || "departure"
                type: $el.data("flightboardsortable-type") || "all", // Possible value : "all" || "limited",
                mobileShowAll: $el.data("flightboardsortable-mobile-show-all") ? $el.data("flightboardsortable-mobile-show-all") : false, // Possible value : true || false,
                numCols: $(el).find("thead tr th").length - 1
            },
            datatablesi18n = $.extend(Datatablesi18n, { "sSearch": "" }),
            flights = [],
            flightsTableRow = [],
            warning = new Warning({
                $el: $el.parent().find(".warningnbox"),
                $label: $el.parent().find(".warningnbox .warningbox-label")
            }),
            searchBox,
            flightDetails,
            dateLines;

        function init() {

            loadFlightData(function (data) {
                isDataSucceed(data, function () {
                    initDataTable();
                });
            });

            createEvents();
        }

        function showDatatables() {
            $el.siblings(".tableauvols-filters").removeClass("hide");
            $el.removeClass("hide");
        }

        function isDataSucceed(data, callback) {
            //flights
            parseFlightData(data);
            switch (flights.status.code) {
                case 200:
                    warning.hide();
                    if (callback)
                        callback();
                    break;

                default:
                    //TODO :: Handle error show message and stop automaticUpdate
                    warning.setLabel(flights.status.message);
                    warning.show();
                    //TODO ::
                    if (!isUpdateIsStopped) eventEmitter.emitEvent(CONFIG.triggeredEvent, ["updatedError", flights.update]);
                    break;
            }
        }

        function getDatatablesOptions() {
            var dataTablesOpts = {
                "aaSorting": [[0, "asc"]],
                "iDisplayLength": CONFIG.numElementsInThePage,
                "bLengthChange": false,
                "bInfo": false,
                "bJQueryUI": true,
                "bAutoWidth": false,
                "sPaginationType": "full_numbers",
                "asStripeClasses": ['tab-skin1-row'],
                "bSortClasses": false,
                "fnHeaderCallback": function (nHead, aData, iStart, iEnd, aiDisplay) {
                    $(nHead).find("th").eq(0).addClass("first tab-col1");
                    $(nHead).find("th").eq(1).addClass("tab-col2");
                    $(nHead).find("th").eq(2).addClass("tab-col3");
                    $(nHead).find("th").eq(3).addClass("tab-col4");
                    $(nHead).find("th").eq(4).addClass("tab-col5");
                    $(nHead).find("th").eq(5).addClass("tab-col6");

                    if (CONFIG.dataType == "departure") {
                        $(nHead).find("th").eq(6).addClass("tab-col8");
                        $(nHead).find("th").eq(7).addClass("tab-col7 tableauvols-suivi-header");
                    } else {
                        $(nHead).find("th").eq(6).addClass("tab-col7 tableauvols-suivi-header ");
                    }

                    if (aiDisplay.length === 1) {
                        setTimeout(function () {
                            $("[flight-index=" + aiDisplay[0] + "]", $(nHead).parents("table")).addClass("openedRow").click();
                        }, 200);
                    }
                },
                "fnCreatedRow": function (nRow, aData, iDataIndex) {
                    var $row = $(nRow);
                    $row.find("td").eq(0).addClass("first tab-col1");
                    $row.find("td").eq(1).addClass("tab-col2");
                    $row.find("td").eq(2).addClass("tab-col3");
                    $row.find("td").eq(3).addClass("tab-col4 tableauvols-numvol");
                    $row.find("td").eq(4).addClass("tab-col5");
                    $row.find("td").eq(5).addClass("tab-col6");

                    if (CONFIG.dataType == "departure") {
                        $row.find("td").eq(6).addClass("tab-col8");
                        $row.find("td").eq(7).addClass("tab-col7 tableauvols-suivi last");
                    } else {
                        $row.find("td").eq(6).addClass("tab-col7 tableauvols-suivi last");
                    }

                    $row.addClass("tableauvols-row");
                    $row.attr("flight-index", iDataIndex);

                },
                "aoColumnDefs": [
                    { 'bSortable': false, 'aTargets': [CONFIG.numCols] }
                ],
                "aoColumns": [
                    { "sType": "html" },
                    { "sType": "html" },
                    { "sType": "html" },
                    null,
                    null,
                    null,
                    null
                ],
                "oLanguage": datatablesi18n,
                "sPaginationType": "bootstrap",
                "fnDrawCallback": function () {
                    if (typeof dateLines != "undefined" && !wasSorted) {
                        dateLines.recreateLines();
                    }
                    if (typeof jScrollApi != "undefined") {

                        if ((wasFiltered || wasSorted) || (!wasMobile && isMobile())) {
                            jScrollApi.destroy();
                        }

                        if (!isMobile()) {
                            if ((wasFiltered || wasSorted) || (wasMobile && !isMobile())) {
                                $('.dataTables_scrollBody').bind('jsp-scroll-y', function (event, scrollPositionY, isAtTop, isAtBottom) {
                                    adjustFiltersToScroll(event, scrollPositionY, isAtTop, isAtBottom, isInverted);
                                }).jScrollPane({ autoReinitialise: true, autoReinitialiseDelay: 500, maintainPosition: true });
                                jScrollApi = $('.dataTables_scrollBody').data('jsp');
                            }

                            if ($resizer.find("a.dispLess").filter(":visible").length >= 1 || $('.jspPane').height() <= 600) {
                                $(".jspPane").css("position", "relative");
                                $(".jspContainer, .dataTables_scrollBody").css("height", "auto");
                                $(".dataTables_scroll").removeClass("withShadow");
                                $(".tableauvols-resize").removeClass("withShadow");
                            } else {
                                $(".dataTables_scroll").addClass("withShadow");
                                $(".tableauvols-resize").addClass("withShadow");
                            }
                        }

                        if (wasMobile && !isMobile()) {
                            wasMobile = false;
                        } else if (!wasMobile && isMobile()) {
                            wasMobile = true;
                        }
                    }
                    else if (typeof $resizer != "undefined"
                        && typeof jScrollApi == "undefined"
                        && (!isMobile() || (isMobile() && CONFIG.mobileShowAll))) {
                        setTimeout(function () {
                            if ($resizer.find("a.dispLess").filter(":visible").length >= 1 || $('.dataTables_scrollBody .tableauvols-complexe').height() < 600) {
                                $(".dataTables_scrollBody").css("height", "auto");
                                $(".dataTables_scroll").removeClass("withShadow");
                                $(".tableauvols-resize").removeClass("withShadow");
                            } else {
                                $(".dataTables_scrollBody").css("position", "static");
                                $(".dataTables_scroll").addClass("withShadow");
                                $(".tableauvols-resize").addClass("withShadow");
                            }
                        }, 50)
                    }
                }
            };

            var myScrollHeight;

            if (isMobile() && !CONFIG.mobileShowAll) {
                myScrollHeight = "auto";
            } else {
                myScrollHeight = "600";
            }

            switch (CONFIG.type) {
                case "all":
                    $.extend(dataTablesOpts, {
                        "aaData": flightsTableRow,
                        "bPaginate": false,
                        "sScrollY": myScrollHeight,
                        "bScrollCollapse": true
                    });
                    break;

                case "limited":
                    $.extend(dataTablesOpts, {
                        "aaData": flightsTableRow,
                        "bFilter": false,
                        "iDisplayLength": CONFIG.limitItems,
                        "bPaginate": false,
                        "bSort": false
                    });
                    break;
            }

            return dataTablesOpts;
        }

        function haveInitFilter() {
            var url = $.url.parse(window.location.href);
            return url.params ? true : false;
        }


        function loadFlightData(callback) {

            // ==> /admtldata/api/flight?limit=5&type=arrival&&sort=field_planned&direction=DESC

            var dataprovider,
                opts = {
                    loader: {
                        $ctn: $el.parent(),
                        ctnClass: "block-tableauVols-isloading",
                        diameter: 40,
                        color: "#000000"
                    },
                    ajaxOpts: {
                        type: CONFIG.dataType,
                        sort: "field_planned",
                        direction: "ASC",
                        rule: "24h"
                    }
                };


            switch (CONFIG.dataType) {
                case "arrival":
                    dataprovider = DataProvider.arrivals;
                    break;

                case "departure":
                    dataprovider = DataProvider.departures;
                    break;
            }

            if (CONFIG.type == "limited") {
                opts.ajaxOpts.limit = CONFIG.limitItems;
            }


            dataprovider.call(DataProvider, opts, function (data) {
                if (callback)
                    callback(data);
            });
        }

        function untoggleButtonGroup() {
            // Simulate User Click to toggle all button in the ButtonsGroup
            $el.parent().parent().find(".tableauvols-filters .btn-action").eq(0).trigger("deselectall.buttonsgroup");
            $el.parent().parent().find(".tableauvols-filters .btn-action").eq(0).removeClass("dark").removeClass("selected").removeClass("buttonsgroup-button-inactive");
        }

        function handleFilters(filters) {
            if (isFirstFilter) {
                isFirstFilter = false;
                $datatables.fnFilter("", null);
            }

            $datatables.fnFilter(filters[0], 0, false, true, false, true);
        }

        function parseFlightData(data) {
            flights = new Flights(data);
            flightsTableRow = new FlightsTableRow(CONFIG.dataType, flights.flights);
        }

        function initDatatablesFilter() {
            if (CONFIG.type == "all") {
                var initFilterData = getFlightInitFilter();

                if (initFilterData == "todayflight") {
                    $datatables.fnFilter(initFilterData, 0);
                } else {
                    if (typeof initFilterData === "object") {
                        if (initFilterData.todayonly === "true") {
                            $datatables.fnFilter("todayflight", 0);
                            $datatables.fnFilter(initFilterData.flightNumber, null);
                        } else {
                            $datatables.fnFilter(initFilterData.flightNumber, null);
                        }
                    } else {
                        $datatables.fnFilter(initFilterData, null);
                    }
                }

                if (haveInitFilter() && initFilterData.todayonly !== "true")
                    untoggleButtonGroup();
            }
        }

        function initDataTable() {
            wasFiltered = false;
            wasSorted = false;
            wasMobile = isMobile();
            currFilter = 0;
            showDatatables();
            isDatatablesCreated = true;
            $datatables = $el.dataTable(getDatatablesOptions());
            initDatatablesFilter();
            overwriteDatatablesDOM();

            flightDetails = new FlightboardDetails({
                $datatables: $datatables,
                $el: $el,
                data: flights.flights,
                dataType: CONFIG.dataType,
                numCols: CONFIG.numCols
            });

            dateLines = new FlightboardDateLines({
                $datatables: $datatables,
                $el: $el,
                data: flights.flights,
                dataType: CONFIG.dataType,
                numCols: CONFIG.numCols
            });

            if (!isUpdateIsStopped) {
                eventEmitter.emitEvent(CONFIG.triggeredEvent, ["start", flights.update]);
            }

            /* Stop the update as we need it to be manually started from now on */
            eventEmitter.emitEvent(CONFIG.triggeredEvent, ["stop", flights.update]);

            if ($(".tableauvols-complexe").length >= 1) {

                $("a.tableauvols-automaticupdate-trigger").bind("click", function (e) {
                    if (typeof (refreshAlert) != "undefined") {
                        refreshAlert.closeIt();
                    }
                    if (typeof (refreshSticky) != "undefined") {
                        refreshSticky.closeIt();
                    }
                });

                if (!isMobile() || isMobile() && CONFIG.mobileShowAll) {
                    var throttleTimeout;

                    $(".dataTables_scroll").addClass("withShadow");
                    $(".tableauvols-resize").addClass("withShadow");

                    refreshAlert = new RefreshAlert({
                        $el: $el,
                        resetTimeVal: 120000
                    });

                    $resizer.show();
                    $resizer.bind("click", function (e) {
                        e.preventDefault();
                        var that = $(e.target).parent();

                        if (that.hasClass("dispAll")) {
                            that.hide();
                            $resizer.find("a.dispLess").show();
                            $(".jspPane").css("position", "relative");
                            $(".jspContainer, .dataTables_scrollBody").css("height", "auto");
                            filterBtns.removeClass("selected").removeClass("dark");
                            filterBtns.eq(0).addClass("selected").addClass("dark");
                            $(".dataTables_scroll").removeClass("withShadow");
                            $(".tableauvols-resize").removeClass("withShadow");
                        } else if (that.hasClass("dispLess")) {
                            that.hide();
                            $resizer.find("a.dispAll").show();
                            if (typeof jScrollApi != "undefined" && $('.jspPane').height() >= 600) {
                                $("html, body").animate({ scrollTop: $('.dataTables_scroll').offset().top }, "fast");
                                $(".jspContainer, .dataTables_scrollBody").css("height", "600");
                                $(".jspPane").css("position", "absolute");
                                $(".dataTables_scroll").addClass("withShadow");
                                $(".tableauvols-resize").addClass("withShadow");
                            } else if (typeof jScrollApi == "undefined" && $('.dataTables_scrollBody .tableauvols-complexe').height() >= 600) {
                                $("html, body").animate({ scrollTop: $('.dataTables_scroll').offset().top }, "fast");
                                $(".dataTables_scrollBody").css("height", "600");
                                $(".dataTables_scroll").addClass("withShadow");
                                $(".tableauvols-resize").addClass("withShadow");
                            }
                        }
                    });

                    if ($("html").hasClass("firefox")) {
                        $('.dataTables_scrollBody').bind('jsp-scroll-y', function (event, scrollPositionY, isAtTop, isAtBottom) {
                            adjustFiltersToScroll(event, scrollPositionY, isAtTop, isAtBottom, isInverted);
                        }).jScrollPane({ autoReinitialise: true, autoReinitialiseDelay: 500, maintainPosition: true });
                        jScrollApi = $('.dataTables_scrollBody').data('jsp');
                        jScrollApi.scrollToY($(".tab-skin1-row:first").height() / 2 - 5, true);
                    } else {
                        $(".dataTables_scrollBody").bind("scroll", function () {
                            adjustFiltersToScrollNoAPI();
                        });
                    }

                    $(window).bind('resize', function () {
                        if ($(window).width() != winWidth) {
                            if (!throttleTimeout) {
                                throttleTimeout = setTimeout(
                                    function () {
                                        if (isMobile() && !wasMobile) {
                                            currFilter = 1;
                                            manageFiltersHighligh(0);
                                        } else if (!isMobile() && wasMobile) {
                                            $("html, body").animate({ scrollTop: $('.dataTables_scroll').offset().top }, "slow");
                                        }

                                        // Make DataTables recalculate the column sizes
                                        $datatables.fnAdjustColumnSizing();

                                        throttleTimeout = null;
                                    },
                                    1000
                                );
                            }
                            winWidth = $(window).width();
                        }
                    });
                } else {
                    /* Create a sticky to update data after a while, only for mobile */
                    refreshSticky = new RefreshSticky({
                        $el: $el,
                        resetTimeVal: 120000
                    });
                }

                $datatables.bind('filter', function () {
                    wasFiltered = true;
                });
                $datatables.bind('sort', function () {
                    var filterSpan = $(".tableauvols-complexe thead th:first div span");
                    if (!filterSpan.hasClass("icon-arrow-up") && !filterSpan.hasClass("icon-arrow-down")) {
                        wasSorted = true;
                    } else {
                        wasSorted = false;
                    }

                    isInverted = isDateInverted();

                    if (filterSpan.hasClass("icon-arrow-up") || filterSpan.hasClass("icon-arrow-down")) {
                        filterBtns.removeClass("neutral");
                    } else {
                        filterBtns.removeClass("selected");
                        filterBtns.addClass("neutral");
                    }
                });
            }
        }

        function adjustFiltersToScroll(event, scrollPositionY, isAtTop, isAtBottom, isInverted) {
            var nbSeps = $('.tab-skin1-sep').length;
            if (nbSeps && !isInverted) {
                if (nbSeps < 2 && scrollPositionY >= $('.tab-skin1-sep').eq(0).position().top - 15) {
                    manageFiltersHighligh(1);
                } else if (nbSeps >= 2 && scrollPositionY >= $('.tab-skin1-sep').eq(1).position().top - 15) {
                    manageFiltersHighligh(1);
                } else {
                    manageFiltersHighligh(0);
                }
            } else if (nbSeps) {
                /* Inverted order of days, so Today and Tomorrow points to inverted anchors */
                if (scrollPositionY <= $('.tab-skin1-sep').eq(0).position().top - 15) {
                    manageFiltersHighligh(1);
                } else {
                    manageFiltersHighligh(0);
                }
            }
        }

        function adjustFiltersToScrollNoAPI() {
            var nbSeps = $('.tab-skin1-sep').length;
            if (nbSeps && !isInverted) {
                if (nbSeps < 2 && $('.tab-skin1-sep').eq(0).position().top - 150 <= 0) {
                    manageFiltersHighligh(1);
                } else if (nbSeps >= 2 && $('.tab-skin1-sep').eq(1).position().top <= 0) {
                    manageFiltersHighligh(1);
                } else {
                    manageFiltersHighligh(0);
                }
            } else if (nbSeps) {
                if ($('.tab-skin1-sep').eq(0).position().top - 150 >= 0) {
                    manageFiltersHighligh(1);
                } else {
                    manageFiltersHighligh(0);
                }
            }
        }

        function manageFiltersHighligh(targetFilter) {
            if (currFilter != targetFilter) {
                filterBtns.removeClass("selected").removeClass("dark");
                filterBtns.eq(targetFilter).addClass("selected").addClass("dark");
                currFilter = targetFilter;
            }
        }

        function overwriteDatatablesDOM() {
            if (CONFIG.type == "all") {
                searchBox = new FlightboardSearch({
                    $datatables: $datatables
                });
            }
        }

        function refreshDatatables() {
            $datatables.fnClearTable(true);
            $datatables.fnAddData(flightsTableRow);
            flightDetails.updateData(flights.flights);
        }

        function createEvents() {

            /****************************** Datatables *******************************/

            $elParrent.delegate(".tableauvols tbody tr,.tableauvols thead tr, .dataTables_paginate, .searchDataTables, .tableauvols-filters", "click", cancelAutomaticUpdate)

            function cancelAutomaticUpdate() {
                if (!isUpdateIsStopped) {
                    isUpdateIsStopped = true;
                    eventEmitter.emitEvent(CONFIG.triggeredEvent, ["stop"]);
                }
            }

            if (CONFIG.receiverEvent) {

                eventEmitter.addListener(CONFIG.receiverEvent, function () {
                    loadFlightData(function (data) {
                        isDataSucceed(data, function () {
                            if (!isDatatablesCreated) {
                                initDataTable();
                            } else {
                                refreshDatatables();
                                eventEmitter.emitEvent(CONFIG.triggeredEvent, ["updatedCompleted", flights.update]);
                            }

                        });
                    });
                });
            }

            //TODO :: See if I can include this in the receiver event to be more consistent
            if (CONFIG.filterUpdateEvent) {
                eventEmitter.addListener(CONFIG.filterUpdateEvent, function (eventType, el) {
                    var $els = $(el),
                        filters = [];

                    $els.each(function (index, $el) {
                        var $el = $($el);
                        filters.push($el.data("flightboard-filter"));
                    });

                    handleFilters(filters);
                });
            }
        }

        init();
    }

    /************************************** FlightboardSearch ***************************************/

    function FlightboardSearch(opts) {

        var _t = this,
            eventEmitter = opts.eventEmitter,
            $datatables = opts.$datatables,
            $filters = $datatables.parent().parent().parent().parent().find(".tableauvols-filters"),
            $inputWrapper = $datatables.parent().parent().parent().find(".fg-toolbar").eq(0),
            $inputCtn = $inputWrapper.find("label"),
            $inputSearch = $inputCtn.find("input"),
            layoutType = "splitLayout";
        filterBtns = $filters.find('a');
        $resizer = $(".tableauvols-resize");

        function init() {
            overwriteDataTablesDom();
            bindFilters();
            update();
        }

        function overwriteDataTablesDom() {
            $datatables.parent().parent().addClass("clearfix");
            $datatables.parent().parent().parent().addClass("tableauvols-wrapper");       // Use this manner
            $inputWrapper.addClass("searchDataTables-wrapper");
            $inputWrapper.addClass("clearfix");
            $inputCtn.append("<span class='visually-hidden'>" + Generali18n.searchForFlight + "</span><button class='fakebutton icon search' aria-hidden='true' aria-label='" + Generali18n.search + "'></button>");
            $inputSearch.attr('placeholder', Generali18n.searchForFlight);
            $inputSearch.placeholder();

            var $button = $inputCtn.find('.fakebutton');
            $button.attr("disabled", "disabled");
            $inputSearch.bind("keyup", function (event) {
                var keyword = $inputSearch.val();
                if (keyword.length > 1) {
                    $button.removeAttr("disabled");
                } else {
                    $button.attr("disabled", "disabled");
                }
            });
            $button.on("click keyup", function (event) {
                if (event.type === 'click' || event.keyCode === 32 || event.keyCode === 13) {
                    setTimeout(function () {
                        var $resultList = $datatables.find('.tab-skin1-tbody .tab-skin1-row');
                        $($resultList[0]).attr("tabindex", 0);
                        $($resultList[0]).focus();
                    }, 500);
                }
            });
        }

        function update() {
            switch (layoutType) {
                case "inline":
                    inlineLayout();
                    break;
                case "splitLayout":
                    splitLayout();
                    break;
            }
        }

        function matchMedia() {
            return {
                match: function () {
                    layoutType = "inline";
                },
                unmatch: function () {
                    layoutType = "splitLayout";
                },
                setup: function () {
                    layoutType = "inline";
                },
                deferSetup: true
            };
        }

        function inlineLayout() {
            $inputWrapper.css("width", "");
            $inputWrapper.addClass("searchDatatables-wrapper-mobile");
            $filters.addClass("tableauvols-filters-mobile");
        }

        function splitLayout() {
            $inputWrapper.removeClass("searchDatatables-wrapper-mobile");
            $filters.removeClass("tableauvols-filters-mobile");

            var ctnWidth = $datatables.width(),
                filterWidth = $filters.width(),
                remainingSpace = ctnWidth - filterWidth;

            $inputWrapper.css("width", remainingSpace);
        }


        function scrollInTableWithJScroll(anchorNB) {
            var $target = $(anchorNB);

            if ($target.length === 0) {
                jScrollApi.scrollToY(0, true);
            } else {
                jScrollApi.scrollToElement(anchorNB, true, true);
            }
        }

        function scrollInTable(anchorNB, offset = 0) {
            var $target = $(anchorNB);
            var y = $target.position().top + offset;

            if ($target.length === 0) {
                y = 0
            }

            $('.dataTables_scrollBody').animate({
                scrollTop: y
            }, 500);
        }

        function scrollTableInPage(anchorNB, offset = 0) {
            var $target = $(anchorNB);
            var $header = $('.header-rebrand');
            var headerSpaceInPage = $header.height() + $header.position().top;

            if ($target.length === 0) {
                $target = $datatables;
            }

            $('html, body').animate({
                scrollTop: $target.offset().top + offset - headerSpaceInPage
            }, 500);
        }

        function bindFilters() {
            filterBtns.bind("click", function (e) {
                e.preventDefault();

                var isInverted = isDateInverted();
                var anchorNB = $(this).data("anchor");

                var isSmallTable = $(".dataTables_scrollBody").height() <= 600;
                var isJScrollAvailable = typeof jScrollApi != "undefined" && jScrollApi != "undefined";

                /* Scroll using jScrollPane if available only */
                if ($('.tab-skin1-sep').length >= 1 && !isInverted) {
                    /* So the table is NOT sorted by DESC scheduled date */
                    if (isSmallTable) {
                        if (isJScrollAvailable) {
                            scrollInTableWithJScroll(anchorNB);
                        } else {
                            var offset = $('.dataTables_scrollBody').scrollTop() - 150;
                            scrollInTable(anchorNB, offset)
                        }
                    } else {
                        // Big table mode
                        scrollTableInPage(anchorNB);
                    }
                } else if ($('.tab-skin1-sep').length >= 1 && isInverted) {
                    /* So the table IS sorted by DESC scheduled date */
                    if (isSmallTable) {
                        if (isJScrollAvailable) {
                            scrollInTableWithJScroll(anchorNB);
                        } else {
                            var offset = $('.dataTables_scrollBody').scrollTop() - 150;
                            scrollInTable(anchorNB, offset)
                        }
                    } else {
                        // Big table mode
                        scrollTableInPage(anchorNB);
                    }
                }
            });
        }

        init();
    }

    function FlightboardDateLines(opts) {
        //HAVE TO SET DATE LINES FUNCTIONALITY OVER HERE
        var _t = this,
            data = opts.data,
            dataType = opts.dataType, // Possible value : "arrival" || "departure"
            $datatables = opts.$datatables,
            $el = opts.$el,
            defaulNumCol = opts.numCols,
            numCol = defaulNumCol,
            breakpoints = breakpoint[dataType];

        function init() {
            createEvents();
            createLines();
        }

        function createEvents() {
            $(window).resize(function () {
                update();
            });
        }

        function update() {
            if (!isDarksite) {
                $el.find(".tab-skin1-sep td").attr("colspan", numCol);
            } else {
                $el.find(".tab-skin1-sep td").attr("colspan", $el.find(".tab-skin1-row:first td:visible").length);
            }
        }

        function matchMedia(col) {
            return {
                match: function () {
                    numCol = col;
                }
            };
        }

        function createLines() {
            function getDatetimeFromRow(el) {
                var date = new Date($(el).attr('datetime'))

                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);

                return date.getTime();
            }

            var $dateList = $datatables.find("tbody tr td.first .tableauvols-datetime");
            var firstDate = getDatetimeFromRow($dateList.first());
            var currentDate = firstDate;
            var isInverted = isDateInverted();
            var anchorList = []

            // Found where to put anchor in table
            $dateList.each(function () {
                var isNewDateRow = getDatetimeFromRow(this) != currentDate;

                var rowDate = getDatetimeFromRow(this);
                var isNewDateRow = rowDate != currentDate;

                if (isNewDateRow) {
                    var thatDateValue = rowDate.toLocaleString('default', { month: 'long', day: 'numeric'});

                    anchorList.push({
                        colspan: numCol,
                        label: thatDateValue,
                        elementBefore: $(this).parent().parent()
                    })

                    // For next iteration
                    currentDate = rowDate;
                }
            });

            // Create Anchors
            for (let i = 0; i < anchorList.length; i++) {
                var idOffset = 2; // Start at 1 and skip the first date
                var anchorId = isInverted ? anchorList.length - i : i + idOffset;

                $("<tr class='tab-skin1-sep' id='dateAnchor" + anchorId + "'><td colspan='" + anchorList[i].colspan + "'>" + anchorList[i].label + "</td></tr>").insertBefore(anchorList[i].elementBefore);
            }
        }

        init();

        /*************************************** PUBLIC FUNCTIONS ******************************************/

        return {
            recreateLines: function () {
                createLines();
            }
        }
    }

    function RefreshAlert(opts) {
        var _t = this,
            resetTimeVal = opts.resetTimeVal,
            alertSelector = $(".flightsRefreshAlert"),
            alertSelectorWrapper = $(".flightsRefreshAlertWrapper");

        function init() {
            setTimeout(function (e) {
                alertSelectorWrapper.append(alertSelector);
                alertSelector.focus();
                alertSelector.fadeIn();
            }, resetTimeVal);

            alertSelector.bind("click", function (e) {
                e.preventDefault();
                $(".tableauvols-automaticupdate-trigger").eq(0).click();
            });
        }

        function closeIt() {
            alertSelector.fadeOut();
            alertSelectorWrapper.after(alertSelector);

            setTimeout(function (e) {
                alertSelector.fadeIn();
            }, resetTimeVal);
        }

        init();

        /*************************************** PUBLIC FUNCTIONS ******************************************/

        return {
            closeIt: function () {
                closeIt();
            }
        }
    }

    function RefreshSticky(opts) {
        var _t = this,
            resetTimeVal = opts.resetTimeVal,
            stickySelector = $(".flightsRefreshSticky"),
            isClosed = true;

        function init() {
            addEmitEvents();

            if ($(".region-warnings:visible").length >= 1) {
                stickySelector.addClass("secWarning");
            }

            setTimeout(function (e) {
                stickySelector.css({ "top": "75", "right": "auto", "left": "0" });
                stickySelector.css({ "transform": "translateX(0%)" });
                stickySelector.css({ "-webkit-transform": "translateX(0%)" });

                stickySelector.find("span").css({ "transform": "translateX(0%)" }).css({ "-webkit-transform": "translateX(0%)" });
                stickySelector.find("a").css({ "transform": "translateX(0%)" }).css({ "-webkit-transform": "translateX(0%)" });

                stickySelector.addClass("show-mobile");
                isClosed = false;
            }, resetTimeVal);

            stickySelector.find("a.mobile").bind("click", function (e) {
                e.preventDefault();
                /* TODO: Really bind to automaticUpdate instead of triggering a click */
                $(".tableauvols-automaticupdate-trigger").eq(0).click();
            });


            stickySelector.find("a.warning-message-closebtn").bind("click", function (e) {
                e.preventDefault();
                closeIt();
            });
        }

        function closeIt() {
            isClosed = true;
            stickySelector.removeClass("show-mobile");

            setTimeout(function (e) {
                stickySelector.addClass("show-mobile");
                isClosed = false;
            }, resetTimeVal)
        }

        function addEmitEvents() {
            eventEmitter.addListener('mobileShowNav', function () {
                stickySelector.removeClass("show-mobile");
            });
            eventEmitter.addListener('mobileHideNav', function () {
                if (!isClosed) {
                    setTimeout(function () {
                        stickySelector.addClass("show-mobile");
                    }, 500);
                }
            });
        }

        init();

        /*************************************** PUBLIC FUNCTIONS ******************************************/

        return {
            closeIt: function () {
                closeIt();
            }
        }
    }

    function FlightboardDetails(opts) {

        var _t = this,
            data = opts.data,
            dataType = opts.dataType, // Possible value : "arrival" || "departure"
            $datatables = opts.$datatables,
            $el = opts.$el,
            defaulNumCol = opts.numCols,
            numCol = defaulNumCol,

        function init() {
            createEvents();
            update();
        }

        function createEvents() {
            $(window).resize(function () {
                update();
            });

            /* Add event listener for opening and closing details about a flight
             * Note that the indicator for showing which row is open is not controlled by DataTables,
             * rather it is done here
             */
            $el.on("click", ".tableauvols-row", function (event) {
                if ($(event.target).parents('.tableauvols-alertsms-shortdesc').length === 0) {
                    event.preventDefault();
                    $(this).find('.tableauvols-toggle-button').click();
                }
            });

            $el.on("click", ".tableauvols-toggle-button", function (evt) {
                evt.stopPropagation();

                var $button = $(evt.target);
                var $row = $button.parents('.tableauvols-row');
                var rowElement = $row[0];

                function collapse() {
                    $button.attr('aria-expanded', false);
                    var compHeight = $("td.tableauxvols-flightdetails").parent().height() + 600;
                    $datatables.fnClose(rowElement);

                    if (typeof jScrollApi != "undefined" && $(".jspPane").height() < compHeight) {
                        $(".jspPane").css("position", "relative");
                        $(".jspContainer, .dataTables_scrollBody").css("height", "auto");
                    }
                }

                function expand() {
                    $button.attr('aria-expanded', true);

                    var compHeight = $(".jspPane").height();
                    var tableHeight = $('.dataTables_scrollBody .tableauvols-complexe').height();

                    $datatables.fnOpen(rowElement, fnFormatFlightDetails($datatables, $row.attr("flight-index")), 'tableauxvols-flightdetails');
                    update();
                    $el.enhance();

                    if (typeof jScrollApi != "undefined") {
                        if (compHeight < 600) {
                            $(".jspPane").css("position", "relative");
                            $(".jspContainer, .dataTables_scrollBody").css("height", "auto");
                        } else {
                            if ($row.next().next().length == 0) {
                                var valToScroll = $("td.tableauxvols-flightdetails").parent().height() + $row.height();
                                jScrollApi.scrollBy(0, valToScroll, true);
                            }

                        }
                    } else if (typeof jScrollApi == "undefined" && tableHeight >= 600 && $row.next().next().length == 0) {
                        $('.dataTables_scrollBody').animate({
                            scrollTop: $('.dataTables_scrollBody').scrollTop() + $("td.tableauxvols-flightdetails").parent().height()
                        }, 500);
                    }

                    var status = "arrival";

                    if ($row.parents("table").hasClass("tableauvols-departure")) {
                        status = "departure";
                    }

                    dataLayer.push({
                        'event': 'visionnement_vol_' + status + '_en',
                        'visionnement_vol': $row.find(".tableauvols-numvol").text()
                    });
                }

                if ((evt.type === 'click' && !$(evt.target).hasClass("tab-col7") && !$(evt.target).hasClass("tableauvols-icon")) || evt.keyCode === 32 || evt.keyCode === 13) {
                    if ($datatables.fnIsOpen(rowElement)) {
                        collapse();
                    } else if (typeof $row.attr("flight-index") != "undefined") {
                        expand();
                    }
                }

            });
        }

        function update() {
            if (!isDarksite) {
                $el.find(".tableauxvols-flightdetails").attr("colspan", numCol);
            } else {
                $el.find(".tableauxvols-flightdetails").attr("colspan", $el.find(".tab-skin1-row:first td:visible").length);
            }
        }

        function matchMedia(col) {
            return {
                match: function () {
                    numCol = col;
                }
            };
        }

        init();

        /*************************************** TEMPLATING ******************************************/

        /* Formating function for row details */
        function fnFormatFlightDetails(oTable, index) {
            var template;

            switch (dataType) {
                case "arrival":
                    template = fnFormatFlightDetailsArrival(index);
                    break;

                case "departure":
                    template = fnFormatFlightDetailsDeparture(index);
                    break;

            }

            // TODO :: Add Icon "Etape au Debarquement pour ce vol"
            return "<div class='tableauxvols-flightdetails'>" + template + "</div>";
        }



        function fnFormatFlightDetailsArrival(index) {
            var flightData = data[index],
                flightDataDetails = flightData.details;

            var sOut = "";
            // Left Content
            sOut += formatFlightDetails.leftContent(flightData.company_logo, flightData.company_logo_retina, flightData.company, flightData.flightNumber, flightData.alertSmsUrl);

            // Right Content
            sOut += "<ul class='tableauxvols-flightdetails-right'>";
            if (flightData.destination !== "")
                sOut += formatFlightDetails.destination(Generali18n.enProvenanceDe, flightData.destination);
            if (flightDataDetails.hours !== "")
                sOut += formatFlightDetails.hours(Generali18n.heureArrivee, flightData.statusCode, flightDataDetails.hours, flightDataDetails.hoursRevised);
            if (flightData.status !== "")
                sOut += formatFlightDetails.status(Generali18n.Statut, flightData.statusCode, flightData.status, flightDataDetails.statusMore);
            if (flightDataDetails.canceledInfos.label) // ajouter ce code dans la condition si le waitingtime s'affiche à nouveau : flightDataDetails.waitingtime.label !== "" ||
                sOut += "<hr class='tableauxvols-flightdetails-splitter' />";
            //MTLADM-86 : Demande de retrait du waitingtime
            /*
            if (flightDataDetails.waitingtime.label !== "")
                sOut += formatFlightDetails.waiting(flightDataDetails.waitingtime.label, flightDataDetails.waitingtime.duration);
            */
            if (flightDataDetails.canceledInfos.label !== "")
                sOut += formatFlightDetails.canceled(flightDataDetails.canceledInfos.label, flightDataDetails.canceledInfos.phoneNumber, flightDataDetails.canceledInfos.freePhoneNumber, flightDataDetails.canceledInfos.website, flightData.company);
            sOut += "</ul>";

            return sOut;
        }

        function fnFormatFlightDetailsDeparture(index) {
            var flightData = data[index],
                flightDataDetails = flightData.details;

            var sOut = "";
            // Left Content
            sOut += formatFlightDetails.leftContent(flightData.company_logo, flightData.company_logo_retina, flightData.company, flightData.flightNumber, flightData.alertSmsUrl);

            // Right Content
            sOut += "<ul class='tableauxvols-flightdetails-right'>";
            if (flightData.destination !== "")
                sOut += formatFlightDetails.destination(Generali18n.ADestinationDe, flightData.destination);
            if (flightDataDetails.hours !== "")
                sOut += formatFlightDetails.hours(Generali18n.HeureDeDepart, flightData.statusCode, flightDataDetails.hours, flightDataDetails.hoursRevised);
            if (flightDataDetails.doorNumber !== "")
                sOut += formatFlightDetails.door(Generali18n.Porte, flightDataDetails.doorNumber);
            if (flightData.status !== "")
                sOut += formatFlightDetails.status(Generali18n.Statut, flightData.statusCode, flightData.status, flightDataDetails.statusMore);
            if (flightDataDetails.waitingtime.label !== "" || flightDataDetails.canceledInfos.label)
                sOut += "<hr class='tableauxvols-flightdetails-splitter' />";
            if (flightDataDetails.waitingtime.label !== "")
                sOut += formatFlightDetails.waiting(flightDataDetails.waitingtime.label, flightDataDetails.waitingtime.duration);
            if (flightDataDetails.canceledInfos.label !== "")
                sOut += formatFlightDetails.canceled(flightDataDetails.canceledInfos.label, flightDataDetails.canceledInfos.phoneNumber, flightDataDetails.canceledInfos.freePhoneNumber, flightDataDetails.canceledInfos.website, flightData.company);

            sOut += "</ul>";

            return sOut;
        }

        /*************************************** PUBLIC FUNCTIONS ******************************************/

        return {
            updateData: function (newData) {
                // TODO :: UPDATE THE DATA
                data = newData;
            }
        }
    }

    return FlightBoardSortable;
}

// export var FlightBoardSortable = FlightBoardSortable(jQuery, null, null);