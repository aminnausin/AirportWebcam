import { json, error } from '@sveltejs/kit';
import { WX_API_KEY } from '$env/static/private';

export async function GET({ url }) {
    try {
        // @ts-ignore
        const ICAO = url.searchParams.get('ICAO') ?? '';

        var myHeaders = new Headers();
        myHeaders.append("X-API-Key", WX_API_KEY);

        const res = await fetch(`https://api.checkwx.com/metar/${ICAO}/decoded`, {method: 'GET', headers: myHeaders, redirect: 'follow'});
        const response = await res.json();
        return json(response);
    } catch (err) {
        return error(400, `${err}`);
    }
}