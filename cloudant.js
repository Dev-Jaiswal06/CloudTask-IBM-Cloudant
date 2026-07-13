const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const cloudant = CloudantV1.newInstance({
    authenticator: new IamAuthenticator({
        apikey: process.env.CLOUDANT_APIKEY,
    }),
});

cloudant.setServiceUrl(process.env.CLOUDANT_URL);

module.exports = cloudant;