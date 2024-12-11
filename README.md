# AirportWebcam
Combined Webcam, Radio and Arrival/Departures board for YUL ✈

### Sources
🛫 - Flight Information : skyscanner.ca (Airline logos don't work because YUL updated their website and deleted all of them)

📷 - Webcam : goowebcams.com

📻 - ATC Radio : liveatc.net (BLOCKED forever by CORS 😭)

🎨 - Styling : A tailwind implementation of the (now discontinued/replaced) ]YUL airport flightboard](https://www.admtl.com/en-CA/flights/departures)

### Demo

Screenshot of the current webpage on Desktop.

!
!

|![Dark](./doc/img/demo.png)|
|:-:|
|Dark Mode on Desktop|

### Building

To build for deployment:

```bash
npm install
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
