// @ts-nocheck
const crypto = require('crypto');
const fetch = require('node-fetch');

class UtilFunction {

    constructor(build) {
        const {
            clientId,
            password,
            apiKey,
            test
        } = build || {};

        this.clientId = clientId;
        this.password = password;
        this.apiKey = apiKey;
        this.test = test;
    }

    getBaseUrl(endpoint) {
        const testServer = "https://beta-collect.paga.com/";
        const liveServer = "https://collect.paga.com/";
        let url = this.test ? testServer : liveServer;
        return `${url}${endpoint}`;
    }

    buildHeader(hashParams) {

        console.log('We are here o')
        console.log(this.password)
        let basicAuth = this.generateBasicAuth(this.clientId, this.password);
        let pattern = `${hashParams}${this.apiKey}`;
        let hashData = this.generateHash(pattern);
        return {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            "Authorization": basicAuth,
            "hash": hashData
        }
    }

    generateBasicAuth(username, password) {
        let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        return auth;
    }

    generateHash(hasParams) {
        let hash = crypto.createHash('sha512');
        let data = hash.update(hasParams, 'utf-8');
        return data.digest('hex');
    }


    checkError(response) {
        console.log(response);
        const {
            statusCode
        } = response;
        if (parseInt(statusCode) <= 2 && parseInt(statusCode) >= 0) {
            console.log(response);
            return {
                error: false,
                response
            }
        } else {
            return {
                error: true,
                message: response.statusMessage,
                response
            }

        }
    }

    filterOptionalFields(obj) {
        let data = Object.keys(obj)
            .filter((k) => obj[k] != null)
            .reduce((a, k) => ({
                ...a,
                [k]: obj[k]
            }), {});
        return data;
    }

    async postRequest(headers, jsonData, url) {

        const data = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(jsonData)
        });
        return await data.json();

    }


}

module.exports = UtilFunction;