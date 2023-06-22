import { environment } from "./environment";

const ws = {
    me: environment.urls.me.host + ':' + environment.urls.me.port + environment.urls.me.prefix,
    api: environment.urls.api.host + '/'+ environment.urls.api.prefix+'/v1',
};

export const endpoint = {
    api: {
        empty: ws.api + '/',
        auth: ws.api + '/auth',
    },
    current: {
        images: ws.me + '/assets/images/'
    },
    disableRegister: environment.external,
};