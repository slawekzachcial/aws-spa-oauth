Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

console.log(`--> Using oidc-client version: ${Oidc.Version}`);

AWS.config.region = 'us-east-1';
// console.log(`Using AWS SDK version: XXX`);

// spaOidcConfig.userStore = new Oidc.WebStorageStateStore({prefix: 'spaOidc.', store: Oidc.Global.sessionStore});
// awsOidcConfig.userStore = new Oidc.WebStorageStateStore({prefix: 'awsOidc.', store: Oidc.Global.sessionStore});

const mgr = new Oidc.UserManager(spaOidcConfig);

const login = () => mgr.signinRedirect();
const logout = () => mgr.signoutRedirect();

const logUser = (user) => {
    console.log(`--> User: ${JSON.stringify(user)}`);
    return user;
}

const showUserInfo = (user) => {
    const greeting = user ? `Hello, ${user.profile.email}!` : `Hello, Stranger!`;
    document.getElementById('greeting').innerHTML = greeting;

    document.getElementById('login').hidden = !!user;
    document.getElementById('logout').hidden = !user;

    return user;
}

const showAwsCallerIdentity = (spaUser) => {
    const awsInfo = document.getElementById('aws');
    awsInfo.hidden = !spaUser;

    if (!spaUser) {
        return undefined;
    }

    console.log(`--> AWS creds before: ${JSON.stringify(AWS.config.credentials)}`);

    AWS.config.credentials = new AWS.WebIdentityCredentials({
        RoleArn: 'arn:aws:iam::520400067019:role/aws_spa_oauth',
        WebIdentityToken: spaUser.id_token,
        RoleSessionName: spaUser.profile.email
    });
    console.log(`--> AWS creds: ${JSON.stringify(AWS.config.credentials)}`);
    // const awsOidcMgr = new Oidc.UserManager(awsOidcConfig);

    // awsOidcMgr.signinSilent().then(awsUser => {
    //     console.log(`--> awsUser: ${awsUser}`);
    //     AWS.config.credentials = new AWS.WebIdentityCredentials({
    //         RoleArn: 'arn:aws:iam::520400067019:role/aws_spa_oauth',
    //         WebIdentityToken: awsUser.access_token,
    //         RoleSessionName: awsUser.profile.email
    //     });
    //     console.log(`--> AWS creds: ${JSON.stringify(AWS.config.credentials)}`);
    // }).catch(console.error);


    AWS.config.credentials.get(err => {
        if (err) {
            console.error(err);
        } else {
            console.log(`--> AWS creds2: ${JSON.stringify(AWS.config.credentials)}`);
            const sts = new AWS.STS();
            sts.getCallerIdentity({}, (err, data) => {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    awsInfo.innerHTML = JSON.stringify(data);
                }
            })
        }
    })

    return spaUser;
}

document.getElementById('login').addEventListener("click", login, false);
document.getElementById('logout').addEventListener("click", logout, false);

mgr.getUser()
    .then(logUser)
    .then(showUserInfo)
    .then(showAwsCallerIdentity)
    .catch(console.error);
