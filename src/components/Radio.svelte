<script>
    // @ts-nocheck
	import { toast } from 'svelte-french-toast';
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("X-API-Key", "0c69eb98e9374ea5a1a86b4e23");

            const res = await fetch('https://api.checkwx.com/metar/CYUL/decoded', {method: 'GET', headers: myHeaders, redirect: 'follow'});
            const response = await res.json();
            metar = response.data[0].raw_text;
        } catch (error) {
            console.log(error);
        }

        try {
            const {webAudioPeakMeter} = await import('$lib');
            var myMeterElement = document.getElementById('my-peak-meter');
            var myAudio = document.getElementById('player');
            var audioCtx = new window.AudioContext();
            var sourceNode = audioCtx.createMediaElementSource(myAudio);
            sourceNode.connect(audioCtx.destination);
            var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);
            webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
            myAudio.addEventListener('play', function() {
                audioCtx.resume();
            });
        } catch (error) {
            toast.error('Audio Peak Meter Error: ' + error)
        }
    });

    let metar = 'CYUL 142300Z 29005KT 15SM FEW060 SCT080 12/07 A2970 RMK SC2AC1 SLP062';
</script>
<div class="flex gap-2 flex-col w-full">

    <h3 class="text-base leading-[110%] font-light" style="font-family: Helvetica, sans-serif">You are listening to: <br>CYUL Tower - Montreal, Quebec, Canada</h3>
    <h3 class="text-xs leading-[110%] font-mono font-light text-[#adadad]">{metar}</h3>
    <audio id="player" class="my-2 w-full" crossorigin="anonymous" preload="metadata" src="https://s1-bos.liveatc.net/cyul_twr2" controls={true} autoplay={true}></audio>
    <div id="my-peak-meter" class="w-full h-12 my-4">
    </div>

    <div class="font-bold text-red-600 text-sm">
        If stream doesn't start automatically press the play button
        <br>
        If stream stops then <a href="/" class="text-[#0275c2]">reload</a> player then press play
    </div>
</div>