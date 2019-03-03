import Constants from './constants';

export async function fetchSessionDetails () {
    return await fetch(Constants.Api.Session).then(res => res.json());
}