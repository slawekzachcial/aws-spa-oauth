Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

console.log(`Using oidc-client version: ${Oidc.Version}`);

AWS.config.region = 'us-east-1';
// console.log(`Using AWS SDK version: XXX`);

const mgr = new Oidc.UserManager(oidcConfig);

const login = () => mgr.signinRedirect();
const logout = () => mgr.signoutRedirect();

const logUser = (user) => {
    console.log(JSON.stringify(user));
    return user;
}

const showUserInfo = (user) => {
    const greeting = user ? `Hello, ${user.profile.email}!` : `Hello, Stranger!`;
    document.getElementById('greeting').innerHTML = greeting;

    document.getElementById('login').hidden = !!user;
    document.getElementById('logout').hidden = !user;

    return user;
}

const showAwsCallerIdentity = (user) => {
    const awsInfo = document.getElementById('aws');
    awsInfo.hidden = !user;

    if (user) {
        if (!AWS.config.credentials || AWS.config.credentials.expired) {
            AWS.config.credentials = new AWS.WebIdentityCredentials({
                RoleArn: 'arn:aws:iam::TBD:role/aws_spa_oauth',
                WebIdentityToken: user.access_token,
                RoleSessionName: user.profile.email
            });
            console.log(`AWS creds: ${JSON.stringify(AWS.config.credentials)}`);
        }

        const sts = new AWS.STS();
        sts.getCallerIdentity({}, (err, data) => {
            if (err) {
                console.log(err, err.stack);
            } else {
                awsInfo.innerHTML = JSON.stringify(data);
            }
        })
    }

    return user;
}

document.getElementById('login').addEventListener("click", login, false);
document.getElementById('logout').addEventListener("click", logout, false);

mgr.getUser()
    .then(logUser)
    .then(showUserInfo)
    .then(showAwsCallerIdentity)
    .catch(console.error);
