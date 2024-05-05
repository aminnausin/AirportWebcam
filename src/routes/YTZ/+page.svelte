<script>
    import Radio from '../../components/Radio.svelte';
    import gooWebcamsLogo from '$lib/images/logo_goowebcams.jpg';
    import Webcam from '../../components/Webcam.svelte';
    import FlightBoard from '../../components/FlightBoard.svelte';

    let liveCam = false;

    const handleFeedSwap = () => {
        liveCam = !liveCam;
    }
</script>

<main class="flex p-4 gap-y-6 flex-wrap">
    <section class="w-full lg:w-10/12 pe-3">
        <Webcam live={liveCam}/>
    </section>
    <section class="flex lg:w-1/6 lg:flex-wrap h-fit ps-3 gap-6">
        <Radio airport={{'short' : 'ytz', 'icao' : 'CYTZ', 'radio': '4', 'location': 'Toronto, Ontario, Canada'}} />
        <div class="flex flex-wrap gap-2 items-center w-1/2 shrink-0 lg:w-full">
            <h6 class="w-full font-bold text-sm">
                If the webcam isn't working, the source website may be down. 
                <a href="https://goowebcams.com/webcam/12861-montreal-dickie-moore-aeroport-international-pierreelliotttrudeau.html" class="text-[#0275c2]">
                    Check Source
                </a>
            </h6>
            <div class="flex gap-2 items-center justify-between w-full">
                <img src={gooWebcamsLogo} alt="Webcam company logo" class="h-12 object-contain rounded-md">
                <button class="font-medium rounded-md bg-neutral-100 p-2 text-black h-fit line-clamp-1 flex w-full text-center justify-center items-center">Force Update Webcam</button>
            </div>
            <div class='w-full'>
                <button class="font-medium rounded-md bg-neutral-100 p-2 text-black h-fit line-clamp-1 flex w-full text-center justify-center items-center" on:click={handleFeedSwap}>
                    {#if !liveCam}
                        Swap to video source
                    {:else}
                        Swap to standard source
                    {/if}
                </button>
            </div>
        </div>
    </section>
    <section class="w-full aspect-video">
        <FlightBoard airport={{'short' : 'ytz', 'icao' : 'CYTZ', 'radio': '4', 'location': 'Toronto, Ontario, Canada'}}/>
    </section>
</main>
