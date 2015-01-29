var AmazonController,
  request = require('request'),
  parseXML = require('xml2js').parseString,
  Promise = require('es6-promise').Promise;

AmazonController = {
  var Credentials = {Secret_Key: null, AWS_ID: null, Associate_Tag: null},
  var generateSignature = function(stringToSign, awsSecret) {
    var hmac = crypto.createHmac('sha256', awsSecret);
    var signature = hmac.update(stringToSign).digest('base64');

    return signature;
  },
  var EncapsulateItemArray = function(prefix, ItemArray) {
    if(!Array.isArray(ItemArray)) {
      throw new Error("Parameters not array");
    }
    
    var ReturnArr = new Array();
    
    for(int i = 0; i < ItemArray.length; i++) {
      if(typeof ItemArray[i] !== "object") {
        throw new Error("Array value not Object");
      }
      
      for(var name in ItemArray[i]) {
        ReturnArr.push(prefix + "." + i + "." + name + "=" + ItemArray[i][name]);
      }
    }
    
    return ReturnArr.join("&");
  },
  var GenerateURL = function(query) {
    if(typeof query !== "object") {
      throw new Error("Query not Object");
    }
    
    var domain = "webservices.amazon.com";
    var amazonQuery = {
      ASIN: null,
      AWSAccessKeyId: credentials.awsId,
      Action: null,
      AssociateTag: credentials.awsTag,
      CartId: null,
      CartItemId: null,
      Condition: "All",
      ContentType: null,
      HMAC: null,
      IdType: null,
      IncludeReviewsSummary: null,
      Item: null,
      ItemId: null,
      MarketplaceDomain: null,
      MerchantId: null,
      OfferListingId: null,
      Operation: "ItemLookup",
      Quantity: null,
      RelatedItemPage: null,
      RelationshipType: null,
      ResponseGroup: "Large",
      SearchIndex: null,
      Service: "AWSECommerceService",
      SimilarityType: null,
      Timestamp: encodeURIComponent((new Date()).toISOString()),
      TruncateReviewsAt: null,
      Validate: null,
      VariationPage: null,
      Version: "2011-08-01",
      XMLEscaping: null
    };

    for(var name in query) {
      if(typeof amazonQuery[name] !== "undefined") {
        if(name === "domain") {
          domain = query[name];
        } else {
          amazonQuery[name] = encodeURIComponent(query[name]);
        }
      }
    }
    
    var unsignedString = new Array();
    
    for(var name in amazonQuery) {
      if(amazonQuery[name] !== null) {
        if(Array.isArray(amazonQuery[name])) {
          unsignedString.push(EncapsulateItemArray(name, amazonQuery[name]));
        } else {
          unsignedString.push(name + "=" + amazonQuery[name]);
        }
      }
    }
    
    var signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString.join("&"), credentials.awsSecret)).replace(/\+/g, '%2B');
    var queryString = 'http://' + domain + '/onca/xml?' + unsignedString.join("&") + '&Signature=' + signature;
    
    return queryString;
  },
  Setup : function(input_Credentials) {
    if(typeof input_Credentials !== "object") {
      throw new Error("Credential Object Error");
    }
    
    for(var name in input_Credentials) {
      if(typeof Credentials[name] !== "undefined") {
        Credentials[name] = input_Credentials[name];
      }
    }
  },
  Query : function(query, callback) {
    var url = GenerateURL(query);

    if (typeof callback === 'function') {
      request(url, function(err, response, body) {
        if (err) {
          callback(err);
        }

        if (response.statusCode != 200) {
          parseXML(body, function(err, resp){
            if (err){
              callback(err);
            }
            callback(resp[query.Operation + "ErrorResponse"]);
          });
        } else {
          parseXML(body, function(err, resp){
            callback(null, resp[query.Operation + "Response"].Items);
          });
        }
      });

    }

    var promise = new Promise(function(resolve, reject) {
      request(url, function(err, response, body) {
        if (err) {
          reject(err);
        }

        if (response.statusCode != 200) {
          parseXML(body, function(err, resp){
            if(err){
              reject(err)
            }
            reject(resp[query.Operation + "ErrorResponse"]);
          });
        } else {
          parseXML(body, function(err, resp){
            results = resp[query.Operation + "Response"].Items;
            resolve(results);
          });
        }
      });
    });

    return promise;
  },
};

module.exports = AmazonController;
