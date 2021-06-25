const Builder = require("./PagaCollectClient");
const UtilFunction = require("./UtilFunction");

class PagaCollect extends UtilFunction {
  constructor(build) {
    super(build);
  }

  async getBanks(data) {
    try {
      const { referenceNumber } = data;
      let requestData = {
        referenceNumber,
      };

      let header = this.buildHeader(referenceNumber);
      let response = await this.postRequest(
        header,
        requestData,
        this.getBaseUrl("banks")
      );
      return this.checkError(response);
    } catch (err) {
      throw new Error(err);
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
        paymentMethods,
      } = data;

      const payerDetails = {
        email: payer.email || null,
        name: payer.name,
        bankId: payer.bankId || null,
        phoneNumber: payer.phoneNumber || null,
      };

      const payeeDetails = {
        bankAccountNumber: payee.bankAccountNumber || null,
        bankId: payee.bankId || null,
        name: payee.name,
        phoneNumber: payee.phoneNumber || null,
        accountNumber: payee.accountNumber || null,
      };

      let requestData = {
        referenceNumber,
        amount,
        currency,
        payer: payerDetails,
        payee: payeeDetails,
        expiryDateTimeUTC,
        isSuppressMessages,
        payerCollectionFeeShare,
        recipientCollectionFeeShare,
        isAllowPartialPayments,
        callBackUrl,
        paymentMethods,
      };

      let hashObj = {
        referenceNumber,
        amount,
        currency,
        payerPhoneNumber: payerDetails.phoneNumber,
        payerEmail: payerDetails.email,
        payeeAccountNumber: payeeDetails.accountNumber,
        payeePhoneNumber: payeeDetails.phoneNumber,
        payeeBankId: payeeDetails.bankId,
        payeeBankAccountNumber: payee.bankAccountNumber,
      };

      let hashParams = Object.values(this.filterOptionalFields(hashObj)).join(
        ""
      );
      let header = this.buildHeader(hashParams);
      let response = await this.postRequest(
        header,
        this.filterOptionalFields(requestData),
        this.getBaseUrl("paymentRequest")
      );
      return this.checkError(response);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @param   {Object}  data              Request object
   * @param   {string}  data.referenceNumber - A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
   * @param   {string}  data.phoneNumber                        The amount of money to transfer to the recipient.
   * @param   {string}  data.firstName                      The currency of the operation, if being executed in a foreign currency.
   * @param   {string}  data.lastName           The account identifier for the recipient receiving the money transfer. This account identifier may be a phone number, account nickname, or any other unique account identifier supported by the Paga platform. If destinationBank is specified, this is the bank account number.
   * @param   {string}  data.accountName               For money transfers to a bank account, this is the destination bank code.
   * @param   {string}  data.financialIdentificationNumber               The authentication principal for the user sending money if the money is being sent on behalf of a user. If null, the money transfer will be processed from the 3rd parties own account.
   * @param   {string}  data.accountReference              The authentication credentials for the user sending money if the money is being sent on behalf of a user
   * @param   {string}  data.creditBankId                  public Id of the bank that you want deposits to be transferred directly to fo every payment.
   * @param   {string}  data.creditBankAccountNumber       This must be provided if creditBankId is included in the request payload. It is the bank account number of the bank that you want deposits to be transferred to. This must be a valid account number for the bank specified by creditBankId
   * @param   {string}  data.callbackUrl                   A custom callback URL for the payment webhook notifications for this specific account to be sent to. If provided, requests are sent to this URL exactly as provided. This allows you to set custom query parameters to the URL which you will be provided during webhook notifications for this specific account.
   *
   * @returns {Promise< {"error":false,
   *                    "response": {
   *                    "response" :0, 
   *                    "message": null, 
   *                    "referenceNumber": "0053459875439143453000", 
   *                    "accountReference": "123467891334",
   *                    "accountNumber": "3414743183"},
   *                    "message":""
   *                }>}  Register persistent payment account response
   *
   *
   *
   */
  async registerPersistentPaymentAccount(data) {
    try {
      const {
        referenceNumber,
        phoneNumber,
        firstName,
        lastName,
        accountName,
        financialIdentificationNumber,
        accountReference,
        creditBankId = null,
        creditBankAccountNumber = null,
        callbackUrl = null,
      } = data;

      let requestData = {
        referenceNumber,
        phoneNumber,
        firstName,
        lastName,
        accountName,
        financialIdentificationNumber,
        accountReference,
        creditBankId,
        creditBankAccountNumber,
        callbackUrl,
      };

      const hashObj = {
        referenceNumber,
        accountReference,
        financialIdentificationNumber,
        creditBankId,
        creditBankAccountNumber,
        callbackUrl,
      };

      let hashParams = Object.values(this.filterOptionalFields(hashObj)).join(
        ""
      );
      let header = this.buildHeader(hashParams);
      let response = await this.postRequest(
        header,
        this.filterOptionalFields(requestData),
        this.getBaseUrl("registerPersistentPaymentAccount")
      );
      // @ts-ignore
      return this.checkError(response);
    } catch (error) {
      throw new Error(error);
    }
  }

  async paymentStatus(data) {
    try {
      const { referenceNumber } = data;

      let requestData = {
        referenceNumber,
      };

      let header = this.buildHeader(referenceNumber);

      let response = await this.postRequest(
        header,
        requestData,
        this.getBaseUrl("status")
      );
      return this.checkError(response);
    } catch (err) {
      throw new Error(err);
    }
  }

  async paymentHistory(data) {
    try {
      const { referenceNumber, startDateTimeUTC, endDateTimeUTC } = data;

      let requestData = {
        referenceNumber,
        startDateTimeUTC,
        endDateTimeUTC,
      };

      let header = this.buildHeader(referenceNumber);


      let response = await this.postRequest(
        header,
        requestData,
        this.getBaseUrl("history")
      );
      return this.checkError(response);
    } catch (err) {
      throw new Error(err);
    }
  }

  static Builder() {
    return new Builder();
  }
}

module.exports = PagaCollect;
