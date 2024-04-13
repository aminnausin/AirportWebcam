<script>
    import Radio from '../components/Radio.svelte';
    import gooWebcamsLogo from '$lib/images/logo_goowebcams.jpg';
    import Webcam from '../components/Webcam.svelte';
    import FlightBoard from '../components/FlightBoard.svelte';
</script>

<main class="flex p-4 gap-y-6 flex-wrap">
    <section class="w-10/12 pe-3">
        <Webcam/>
    </section>
    <section class="flex w-1/6 flex-wrap h-fit ps-3 gap-6">
        <Radio />
        <div class="flex flex-wrap gap-2 items-center">
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
        </div>
    </section>
    <section class="w-full">
        <FlightBoard/>
    </section>
</main>
