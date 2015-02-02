var AmazonController,
  request = require('request'),
  parseXML = require('xml2js').parseString,
  Promise = require('es6-promise').Promise,
  crypto = require('crypto');

AmazonController = function(Secret_Key, AWS_ID, Associate_Tag) {
  var Credentials = { 
    Secret_Key: Secret_Key, 
    AWS_ID: AWS_ID, 
    Associate_Tag: Associate_Tag
  }
  
  function generateSignature(stringToSign, awsSecret) {
    var hmac = crypto.createHmac('sha256', awsSecret);
    var signature = hmac.update(stringToSign).digest('base64');

    return signature;
  }
  
  function EncapsulateItemArray(prefix, ItemArray) {
    if(!Array.isArray(ItemArray)) {
      throw new Error("Parameters not array");
    }
    
    var ReturnArr = new Array();
    
    for(var i = 0; i < ItemArray.length; i++) {
      if(typeof ItemArray[i] === "object") {
        for(var name in ItemArray[i]) {
          ReturnArr.push(prefix + "." + (i+1) + "." + name + "=" + encodeURIComponent(ItemArray[i][name]));
        }
      } else {
        ReturnArr.push(prefix + "." + (i+1) + "=" + encodeURIComponent(ItemArray[i]));  
      }
    }
    
    return ReturnArr.join("&");
  }
  
  function GenerateURL(query) {
    if(typeof query !== "object") {
      throw new Error("Query not Object");
    }
    
    var domain = "webservices.amazon.com";
    var amazonQuery = {
      ASIN: null,
      AWSAccessKeyId: Credentials.AWS_ID,
      Action: null,
      AssociateTag: Credentials.Associate_Tag,
      CartId: null,
      CartItemId: null,
      Condition: "New",
      HMAC: null,
      IdType: null,
      IncludeReviewsSummary: null,
      Item: null,
      ItemId: null,
      ItemLookup: null,
      MarketplaceDomain: null,
      MerchantId: null,
      OfferListingId: null,
      Operation: "ItemLookup",
      Quantity: null,
      RelatedItemPage: null,
      RelationshipType: null,
      ResponseGroup: "Small",
      SearchIndex: null,
      Service: "AWSECommerceService",
      SimilarityType: null,
      Timestamp: (new Date()).toISOString(),
      TruncateReviewsAt: null,
      Validate: null,
      VariationPage: null,
      Version: "2013-08-01",
      XMLEscaping: null
    };

    for(var name in query) {
      if(typeof amazonQuery[name] !== "undefined") {
        if(name === "domain") {
          domain = query[name];
        } else {
          amazonQuery[name] = query[name];
        }
      }
    }
        
    var unsignedString = new Array();
    
    for(var name in amazonQuery) {
      if(amazonQuery[name] !== null) {
        if(Array.isArray(amazonQuery[name])) {
          unsignedString.push(EncapsulateItemArray(name, amazonQuery[name]));
        } else {
          unsignedString.push(name + "=" + encodeURIComponent(amazonQuery[name]));
        }
      }
    }
    
    var signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString.join("&"), Credentials.Secret_Key)).replace(/\+/g, '%2B');
    var queryString = 'http://' + domain + '/onca/xml?' + unsignedString.join("&") + '&Signature=' + signature;
    
    return queryString;
  }
  
  this.Query = function(query, callback) {
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
          parseXML(body, {explicitArray: false}, function(err, resp){
            if(err){
              reject(err)
            }
            for(var name in resp) {
              reject((resp[name]));
              break;
            }
          });
        } else {
          parseXML(body, {explicitArray: false}, function(err, resp){
            for(var name in resp) {
              resolve((resp[name]));
              break;
            }
          });
        }
      });
    });

    return promise;
  }
};

module.exports = AmazonController;
