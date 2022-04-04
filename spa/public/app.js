document.getElementById('login').addEventListener("click", login, false);
document.getElementById('logout').addEventListener("click", logout, false);

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

console.log(`Using oidc-client version: ${Oidc.Version}`);

function greetUser(email) {
    const userUnknown = !email;
    const greeting = userUnknown ? 'Hello stranger!' : `Hello ${email}!`;
    document.getElementById('greeting').innerHTML = greeting;
    document.getElementById('login').hidden = !userUnknown;
    document.getElementById('logout').hidden = userUnknown;
}

greetUser();

const mgr = new Oidc.UserManager(oidcConfig);

mgr.signinRedirectCallback().then(user => {
    greetUser(user.email);
}).catch(err => { console.log(err); });


mgr.events.addUserLoaded(user => { greetUser(user.email); });
mgr.events.addUserUnloaded(e => { greetUser(); });

function login() {
    const someState = { message: 'some data' };
    mgr.signinRedirect({ state: someState, useReplaceToNavigate: true }).then(() => {
        console.log('signinRedirect done');
    }).catch(err => { console.log(err); });
    // mgr.signinSilent({state:'some data'}).then(user => {
    //     greetUser(user.email);
    // }).catch(err => {
    //     console.log(err);
    // });
}

function logout() {
}
