<script>
	import { onMount } from 'svelte';
    let imageUrl = 'https://goowebcams.com/stream/12861?sid=17&extra=/jpg/1/image.jpg';
    let  random = new Date().getTime();
    let delay = 0.5;
    let counter = 0;
    /**
     * @type {HTMLImageElement}
     */
    let buffer; 

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
        setTimeout(LoadBuffer, 1000*delay); 
    } 

    onMount(() => {
        buffer = new Image;
        LoadNextImage(); 
    });
</script>

<img id="webcam" src="https://goowebcams.com/stream/12861?sid=17&extra=/jpg/1/image.jpg" onerror="this.src='assets/webcamDefault.jpg';" alt="live webcam" class="w-full">