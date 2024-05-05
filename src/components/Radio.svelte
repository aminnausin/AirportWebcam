<script>
    // @ts-nocheck
	import { toast } from 'svelte-french-toast';
    import { onMount } from "svelte";

    export let airport = {'code' : 'yul', 'icao' : 'CYUL', 'radio': '_twr2', 'location': 'Montreal, Quebec, Canada'};

    const initMetar = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("ICAO", airport.icao);

            const res = await fetch(`/metar?ICAO=${airport.icao}`, {method: 'GET', headers: myHeaders, redirect: 'follow'});
            const response = await res.json();
            metar = response.data[0].raw_text;
            return response.data[0].raw_text;
        } catch (error) {
            console.log(error);
            return `${airport.icao} 142300Z 29005KT 15SM FEW060 SCT080 12/07 A2970 RMK SC2AC1 SLP062 (EXAMPLE)`
        }
    }

    const initAudio = async () => {
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
            console.log(error);
        }
    }

    const initRadio = async () => {
        try {
            radioSrc = `htps://s1-bos.liveatc.net/${airport.icao.toLocaleLowerCase()}${airport.radio}`;
            var myAudio = document.getElementById('player');
            myAudio.dispatchEvent(new Event("play"))
        } catch (error) {
            toast.error('Radio Error: ' + error)
            console.log(error);
        }
    }

    onMount(async () => {
        metar = await initMetar();
        await initAudio();
        initRadio();
    });

    function a(node, param) {
        initMetar();
        return {
            update(param) {
                initMetar();
            },
        };
    }

    let metar = `${airport.icao} 142300Z 29005KT 15SM FEW060 SCT080 12/07 A2970 RMK SC2AC1 SLP062`;

    let radioSrc = `https://s1-bos.liveatc.net/${airport.icao.toLocaleLowerCase()}${airport.radio}`;
</script>
<div class="flex gap-2 flex-col lg:w-full h-fit shrink ">

    <h3 class="text-base leading-[110%] font-light" style="font-family: Helvetica, sans-serif">You are listening to: <br>{airport.icao} Tower - {airport.location}</h3>
    <h3 class="text-xs leading-[110%] font-mono font-light text-[#adadad]" use:a={airport}>{metar}</h3>
    <audio id="player" class="my-2 w-full" crossorigin="anonymous" preload="metadata" src={`https://s1-bos.liveatc.net/${airport.icao.toLocaleLowerCase()}${airport.radio}`} controls={true} autoplay={false}></audio>
    <div id="my-peak-meter" class="w-full h-12 my-4">
    </div>

    <div class="font-bold text-red-600 text-sm">
        If stream doesn't start automatically press the play button
        <br>
        If stream stops then <a href="/" class="text-[#0275c2]">reload</a> player then press play
    </div>
</div>