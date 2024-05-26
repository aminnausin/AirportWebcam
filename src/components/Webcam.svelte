<script lang="ts">
	import { onMount } from 'svelte';
    import toast from 'svelte-french-toast';

    const IMAGE_URL = 'https://goowebcams.com/stream/12861?sid=17&extra=/jpg/1/image.jpg';
    const RANDOM = new Date().getTime();
    const DELAY = 0.75; // Delay between loading images in seconds

    let counter = 0;
    let buffer: HTMLImageElement; 
    let timeOut: number | null | undefined = null; // Holds timeout ID

    /**
     * Display webcam image from buffer
     */
    function DisplayImage() { 
        var img = (document.querySelector('#webcam') as HTMLImageElement);
        
        if(img){
            img.src = buffer.src; 
            LoadNextImage(); 
        }
    } 

    /**
     * Load next webcam image to buffer
     */
    function LoadBuffer () { 
        var trickname = IMAGE_URL; 
        ++counter; 

        trickname += "?counter=" + (RANDOM + counter); 
        buffer.src = trickname; 
        buffer.onload = DisplayImage; 
    } 

    /**
     * Trigger loading the next webcam image to buffer after time set by DELAY (s)
     */
    function LoadNextImage() { 
        timeOut = setTimeout(LoadBuffer, 1000*DELAY); 
    } 

    /**
     * Force update webcam image when buffer stops loading (usually due to a sleeping tab)
     */
    export function forceUpdate() {
        if(timeOut !== null) clearTimeout(timeOut);
        toast.success('Webcam restarted!');
        LoadNextImage();
    }

    /**
     * Load first image on page load
    */
    onMount(() => {
        buffer = new Image;
        LoadNextImage(); 
    });

    /**
     * State that determines if webcam uses image or livestream source
     */
    export let live = false;
</script>


{#if !live}
    <img id="webcam" src="https://goowebcams.com/stream/12861?sid=17&extra=/jpg/1/image.jpg" onerror="this.src='assets/webcamDefault.jpg';" alt="live webcam" class="w-full">
{:else}
    <iframe 
        src="https://www.youtube.com/embed/AMwf1ZVbuPA?si=uPtYZXzA_zp2qqhU" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen
        class='aspect-video w-full'>
    </iframe>
{/if}