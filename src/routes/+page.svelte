<script>
    import Radio from '../components/Radio.svelte';
    import gooWebcamsLogo from '$lib/images/logo_goowebcams.jpg';
    import Webcam from '../components/Webcam.svelte';
    import FlightBoard from '../components/FlightBoard.svelte';

    /**
     * Swap between webcam types:
     * - The YUL webcam switches between a youtube live video and an image based webcam 
     *   occasionally and this function lets users swap between them as required.
     */
    const handleFeedSwap = () => {
        liveCam = !liveCam;
    }

    /**
     * Swap Flight board and radio to another airport from the airports array
     * @param index
     */
    const handleAirportSwap = (/** @type {number} */ index) => {
        if (airports[index] == selectedAirport) {
            return;
        }
        selectedAirport = airports[index]
    }

    /**
     * @type {Webcam}
     */
    let webcam;
    let liveCam = false;
    let airports = [{'code' : 'yul', 'icao' : 'CYUL', 'radio': '_twr2', 'location': 'Montreal, Quebec, Canada'}, {'code' : 'ytz', 'icao' : 'CYTZ', 'radio': '4', 'location': 'Toronto, Ontario, Canada'}];
    let selectedAirport = airports[0] ?? null;
</script>

<main class="flex p-4 gap-y-6 flex-wrap">
    <section class="w-full xl:w-10/12 xl:pe-3">
        <Webcam live={liveCam} bind:this={webcam}/>
    </section>
    <section class="flex w-full flex-wrap sm:flex-nowrap xl:w-1/6 xl:flex-wrap ps-0 xl:ps-3 gap-6 h-full">
        <Radio airport={selectedAirport}/>
        <!-- sm:flex-col sm: -->
        <div class="flex flex-col items-center justify-between sm:w-1/3 xl:w-full gap-y-12 sm:gap-y-0">
            <!-- w-1/2 sm: pe-2 sm:pe-0 -->
            <div class="w-full flex flex-wrap gap-y-2 sm:gap-x-2 items-center h-fit "> 
                <div class="flex gap-1">
                    <h6 class="w-full font-bold text-sm">
                        If the webcam isn't working, the source website may be down. 
                        <a href="https://goowebcams.com/webcam/17623-montreal-aeroport-international-montrealtrudeau.html" target="_blank" class="text-[#0275c2]">
                            Check Source
                        </a>
                        
                    </h6>
                </div>
                <div class="flex gap-2 items-center justify-between w-1/2 sm:w-full pe-1 sm:pe-0">
                    <img src={gooWebcamsLogo} alt="Webcam company logo" class="hidden sm:block h-12 object-contain rounded-md">
                    <button class="font-medium rounded-md bg-neutral-100 p-2 text-black h-fit flex w-full text-center justify-center items-center" on:click={() => {if(webcam) webcam.forceUpdate()}}> <span class="line-clamp-1 sm:line-clamp-2">Refresh Webcam</span></button>
                </div>
                <div class='w-1/2 sm:w-full ps-1 sm:ps-0'>
                    <button class="font-medium rounded-md bg-neutral-100 p-2 text-black h-fit flex w-full text-center justify-center items-center" on:click={handleFeedSwap}>
                        <span class="line-clamp-1 ">
                            {#if !liveCam}
                                Swap to Video Source
                            {:else}
                                Swap to Standard Source
                            {/if}
                        </span>
                    </button>
                </div>
            </div>
            <!-- w-1/2 sm: ps-2 sm:ps-0 h-full sm: -->
            <div class="w-full flex flex-col gap-2 xl:mt-4 justify-between h-fit">
                <h6 class="w-full font-bold text-sm sm:line-clamp-1">Select Airport (Radio and Flights)</h6>
                <div class="flex items-center w-full justify-between gap-2 h-fit">
                    {#each airports as airport, idx}
                    <button class={`font-medium rounded-md ${selectedAirport === airport ? 'bg-red-700 text-white' : ''} bg-neutral-100 hover:bg-red-800 hover:text-white p-2 text-black h-fit line-clamp-1 w-full`} on:click={() => {handleAirportSwap(idx)}}>
                        {airport.code?.toLocaleUpperCase()}
                    </button>
                    {/each}
                </div>
            </div>
        </div>
    </section>
    <section class="w-full aspect-video">
        <FlightBoard airport={selectedAirport}/>
    </section>
</main>
