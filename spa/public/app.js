Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

console.log(`Using oidc-client version: ${Oidc.Version}`);

const mgr = new Oidc.UserManager(oidcConfig);

const login = () => mgr.signinRedirect();
const logout = () => mgr.signoutRedirect();

const greetUser = (user) => {
    console.log(JSON.stringify(user));
    const greeting = user ? `Hello, ${user.profile.email}!` : `Hello, Stranger!`;
    document.getElementById('greeting').innerHTML = greeting;
    document.getElementById('login').hidden = !!user;
    document.getElementById('logout').hidden = !user;
}

document.getElementById('login').addEventListener("click", login, false);
document.getElementById('logout').addEventListener("click", logout, false);

mgr.getUser().then(greetUser).catch(console.error);
