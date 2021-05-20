import Builder from './PagaCollectClient.js';
import UtilFunction from './UtilFunction.js';

class PagaCollect extends UtilFunction {

    constructor(build) {
        super(build)
    }

    async getBanks(data) {
        try {
            const {
                referenceNumber
            } = data;
            let requestData = {
                referenceNumber
            }
            console.log(requestData);

            let header = this.buildHeader(referenceNumber);
            let response = await this.postRequest(header, requestData, this.getBaseUrl("banks"));
            return this.checkError(response);

        } catch (err) {
            console.log(err);
        }

    }


    async paymentRequest(data) {

        try {
            const {
                referenceNumber,
                amount,
                currency = "NGN",
                payer,
                payee,
                expiryDateTimeUTC = null,
                isSuppressMessages,
                payerCollectionFeeShare,
                recipientCollectionFeeShare,
                isAllowPartialPayments = null,
                callBackUrl,
                paymentMethods
            } = data;

            const payerDetails = {
                
                    email: payer.email || null,
                    name : payer.name,
                    bankId : payer.bankId  || null,
                    phoneNumber : payer.phoneNumber || null
    
               
            }

            const payeeDetails = {
                bankAccountNumber : payee.bankAccountNumber || null,
                bankId : payee.bankId || null,
                name : payee.name,
                phoneNumber : payee.phoneNumber || null,
                accountNumber : payee.accountNumber || null,
                
            }

            let requestData = {
                referenceNumber,
                amount,
                currency,
                payer:payerDetails,
                payee: payeeDetails,
                expiryDateTimeUTC,
                isSuppressMessages,
                payerCollectionFeeShare,
                recipientCollectionFeeShare,
                isAllowPartialPayments,
                callBackUrl,
                paymentMethods
            }

            let hashObj = {
                referenceNumber,
                amount,
                currency,
                payerPhoneNumber: payerDetails.phoneNumber,
                payerEmail:payerDetails.email,
                payeeAccountNumber:payeeDetails.accountNumber,
                payeePhoneNumber: payeeDetails.phoneNumber,
                payeeBankId: payeeDetails.bankId, 
                payeeBankAccountNumber: payee.bankAccountNumber

            }

            console.log(hashObj);
            // let hashParams = `${referenceNumber}${amount}${currency}${payer.phoneNumber}${payer.email}${payee.accountNumber}${payee.phoneNumber}${payee.bankId}${payee.bankAccountNumber}`;
            let hashParams = Object.values(this.filterOptionalFields(hashObj)).join("");
            console.log(hashParams);
            let header = this.buildHeader(hashParams);
            let response = await this.postRequest(header, this.filterOptionalFields(requestData), this.getBaseUrl("paymentRequest"));
            return this.checkError(response);


        } catch (err) {
            throw new Error(err)
        }
    }

    async paymentStatus(data) {
        try {
            const {
                referenceNumber,

            } = data;

            let requestData = {
                referenceNumber,

            }
            console.log(requestData);

            let header = this.buildHeader(referenceNumber);

            console.log(this.getBaseUrl("status"));

            let response = await this.postRequest(header, requestData, this.getBaseUrl("status"));
            console.log(response);
            return this.checkError(response);
        } catch (err) {
            throw new Error(err);

        }
    }


    async paymentHistory(data) {
        try {
            const {
                referenceNumber,
                startDateTimeUTC,
                endDateTimeUTC
            } = data;

            let requestData = {
                referenceNumber,
                startDateTimeUTC,
                endDateTimeUTC
            }
            console.log(requestData);

            let header = this.buildHeader(referenceNumber);

            console.log(this.getBaseUrl("history"));

            let response = await this.postRequest(header, requestData, this.getBaseUrl("history"));
            console.log(response);
            return this.checkError(response);
        } catch (err) {
            throw new Error(err);

        }
    }



    // build() {
    //     return new PagaCollect(this);
    // }
    static Builder() {

        return new Builder()
        // return new PagaCollect(new Builder());
    }

}

export default PagaCollect;