var customerDetails = {
  cif: "12345",
  customerCategory: ["EMPLOYEE", "WEALTH"],
  usedCodes: [
    {
      codeType: "P",
      codeName: "KOTAKFIRST",
      usedCount: "1",
    },
    {
      codeType: "D",
      codeName: "STUDENT",
      usedCount: "2",
    },
  ],
};

var Transction = {
  requestID: "1",
  transDate: "01-04-2020",
  transTypeCode: "SVC-R",
  currency: "USD",
  amount: "1500",
  promoCode: "KOTAKFIRST",
  channel: "PORTAL",
  rate: "77.31",
  ibr: "75.31",
  cardRate: "77.31",
  perUnit: "1",
  buySellSign: "-1",
  orgCharges: "100",
  lcyAmount: "115965",
};

var OfferCode = {
  codeType: "D",
  validFor: "RC",
  codeName: "STUDENT",
  description:
    " DISCOUNT FOR EDUCATIONAL SEASON- CHARGES Rs 100 OFF, 50 PAISE DISCOUNT ON CARD RATE",
  startDateTime: "01-04-2020 00:00:00",
  endDateTime: "01-07-2020 00:00:00",
  minMaxAmountType: "LCY",
  minimumINRAmount: "1000",
  maximumINRAmount: "1000000",
  maximumTotalUsage: "100000",
  maximumUsagePerCustomer: "1",
  rateApplyType: "GBL",
  applicableRateMargin: "50",
  chargesDiscount: {
    chargeDiscountType: "F",
    chargeDiscount: "100",
  },
  rateDiscount: {
    rateDiscountType: "F",
    rateDiscountOn: "IBR",
    rateDiscountOrMargin: "50",
  },
  termsFilter: {
    channel: ["branch", "mobile"],
    transTypeCode: ["CN-SALE", "SVC-S", "SVC-R", "TT-SALE", "DD-SALE"],
    customerCategory: ["STUDENT", "EMPLOYEE"],
    currency: [
      {
        currCode: "USD",
        minAmount: "",
        maxAmount: "",
        discount: "",
      },
      {
        currCode: "EUR",
        minAmount: "",
        maxAmount: "",
        discount: "",
      },
      {
        currCode: "GBP",
        minAmount: "",
        maxAmount: "",
        discount: "",
      },
    ],
  },
};

var IsCodeApplicableForTransaction = {
  requestID: Transction.requestID,
  codeType: OfferCode.codeType,
  validFor: OfferCode.validFor,
  codeName: OfferCode.codeName,
  applicable: "N",
  message: null,
};

customer();
function customer() {
  if (OfferCode.termsFilter.channel.includes(Transction.channel)) {
    console.log(true);
    if (
      OfferCode.termsFilter.transTypeCode.includes(Transction.transTypeCode)
    ) {
      console.log(true);
      if (
        OfferCode.termsFilter.customerCategory.includes(
          customerDetails.customerCategory)){
        console.log(true);
   
        if (
            OfferCode.termsFilter.currency.includes(Transction.currency)){
            console.log(true);
             
      if(Transction.lcyAmount>OfferCode.minimumINRAmount || Transction.lcyAmount<OfferCode.maximumINRAmount){
            console.log(true);

       if(Transction.transDate>OfferCode.startDateTime ||Transction.transDate<OfferCode.endDateTime){
         console.log(true);
         
         if(customerDetails.usedCodes[1].usedCount <= OfferCode.maximumUsagePerCustomer){
         console.log(true);
         
        } else {
          IsCodeApplicableForTransaction.message =
          " usedcodes'" +
          Transction.usedCount +
          "'Customer has already used  maximim no of usages'" +
          OfferCode.codeName +
          "'  '" +
          OfferCode.maximumUsagePerCustomer +
          "'"; 
        }
        } else {
        IsCodeApplicableForTransaction.message =
        " transdate'" +
        Transction.transDate +
        "' is Not with range '" +
        OfferCode.codeName +
        "' startDateTime & endDateTime '" +
        OfferCode.startDateTime.OfferCode.endDateTime +
        "'";  
        
    console.log(IsCodeApplicableForTransaction); 
              }

        } else {
            IsCodeApplicableForTransaction.message =
            " lcyAmount'" +
            Transction.lcyAmount +
            "' is Not with range '" +
            OfferCode.codeName +
            "',  minimumINRAmount & maximumINRAmount '" +
            OfferCode.minimumINRAmount.OfferCode.maximumINRAmount +  "'";  
            
        console.log(IsCodeApplicableForTransaction); 
                  }


        } else {
            IsCodeApplicableForTransaction.message =
            " currency'" +
            Transction.currency +
            "' is Not Applicable for '" +
            OfferCode.codeName +
            "', Aviailable currency '" +
           OfferCode.termsFilter.currency +
            "'";  
            
        console.log(IsCodeApplicableForTransaction); 
                  }
                

      } else {
        IsCodeApplicableForTransaction.message =
        " customerCategory'" +
        customerDetails.customerCategory +
        "' is Not Applicable for '" +
        OfferCode.codeName +
        "', Aviailable customerCategory '" +
        OfferCode.termsFilter.customerCategory +
        "'";  
        
    console.log(IsCodeApplicableForTransaction); 
              }
    } else {
      
        IsCodeApplicableForTransaction.message =
        " transTypeCode'" +
        Transction.transTypeCode +
        "' is Not Applicable for '" +
        OfferCode.codeName +
        "', Aviailable Transction Types'" +
        OfferCode.termsFilter.transTypeCode +
        "'";    
    
        console.log(IsCodeApplicableForTransaction);
    }
  
  } else {
    IsCodeApplicableForTransaction.message =
      "Channel '" +
      Transction.channel +
      "' is Not Applicable for '" +
      OfferCode.codeName +
      "', Aviailable Channels '" +
      OfferCode.termsFilter.channel +
      "'";

    console.log(IsCodeApplicableForTransaction);
  }
}
