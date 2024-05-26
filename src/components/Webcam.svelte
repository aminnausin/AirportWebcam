<script>
	import { onMount } from 'svelte';
    import toast from 'svelte-french-toast';
    let imageUrl = 'https://goowebcams.com/stream/12861?sid=17&extra=/jpg/1/image.jpg';
    let random = new Date().getTime();
    let delay = 0.5;
    let counter = 0;
    /**
     * @type {HTMLImageElement}
     */
    let buffer; 
    /**
     * @type {number | null}
     */
    let timeOut = null;
    function DisplayImage() { 
        var img = document.querySelector('#webcam');
        
        if(img){
            // @ts-ignore
            img.src = buffer.src; 
            LoadNextImage(); 
        }
    } 
    function LoadBuffer () { 
        var trickname = imageUrl; 
        ++counter; 

        trickname += "?counter=" + (random + counter); 
        buffer.src = trickname; 
        buffer.onload = DisplayImage; 
    } 
    function LoadNextImage() { 
        timeOut = setTimeout(LoadBuffer, 1000*delay); 
    } 

    export function forceUpdate() {
        if(timeOut !== null) clearTimeout(timeOut);
        toast.success('Webcam restarted!');
        LoadNextImage();
    }

    onMount(() => {
        buffer = new Image;
        LoadNextImage(); 
    });
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