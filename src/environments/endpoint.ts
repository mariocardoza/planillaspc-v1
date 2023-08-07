import { environment } from "./environment";

const ws = {
    me: environment.urls.me.host + ':' + environment.urls.me.port + environment.urls.me.prefix,
    api: environment.urls.api.host + ':'+ environment.urls.api.port + '/'+ environment.urls.api.prefix,
};

export const endpoint = {
    api: {
        empty: ws.api + '/',
        auth: ws.api + '/auth',
        naturales: ws.api + '/PersonasNaturales',
        juridicas: ws.api + '/PersonasJuridicas',
        usuarios: ws.api + '/Usuarios',
        planillas: ws.api+ '/Planillas',
        upload: ws.api + "/Upload",
        download: ws.api + '/Download/',
    },
    current: {
        images: ws.me + '/assets/images/'
    },
    disableRegister: environment.external,
};