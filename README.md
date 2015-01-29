Node.js client for [Amazon Product Advertising API](https://affiliate-program.amazon.com/gp/advertising/api/detail/main.html) Version 2013-08-01   

## Installation
Install using npm:
```sh
npm install aws-product-api
```

## Usage

Require library
```javascript
amazon = require('aws-product-api');
```

Create REST Object
```javascript
var RESTobj = new amazon("Secret_Key", "AWS_ID", "Associate_Tag");
```

Now you can search for items on amazon:

This is a complete implementation of the Product Advertising API, you must specify an Operation and any required entries.

ItemLookup:
```javascript
RESTobj.Query({
  Operation: "ItemLookup",
  ItemID: "ID1,ID2",
  ResponseGroup: "Large"
}, function(err, results) {
  if (err) {
	  // err.Error: [ { Code: [ String ], Message: [ String ] } ]
  } else {
	  // items: [ { Request: [ [ Object ] ], Item: [ [ Object ], [ Object ] ] } ]
  }
});
```


RESTob.Query can return an es-6 Promise:
```javascript
RESTobj.Query({
  Operation: "ItemLookup",
  ItemID: "ID1,ID2",
  ResponseGroup: "Large"
}).then(function(items){
	// items: [ { Request: [ [ Object ] ], Item: [ [ Object ], [ Object ] ] } ]
}).catch(function(err){
	// err.Error: [ { Code: [ String ], Message: [ String ] } ]
});
```

###Query object options:

[ASIN:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartAdd.html)  
Default: None  
Valid Values: Valid ASIN.  
Constraint: Required if an OfferListingId is not specified.

[Action:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartModify.html)  
Default: None  
Valid Values:  
 * MoveToCart
 * SaveForLater

[CartId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartAdd.html)  
Default: None  
Valid Values: Value returned by CartCreate.

[CartItemId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartModify.html)  
Default: None  
Valid Values: Value returned by CartCreate or CartAdd.

[Condition:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Default: New  
Valid Values:  
 * Used
 * Collectible
 * Refurbished, All

[HMAC:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartAdd.html)  
Default: None  
Valid Values: Value is calculated using request parameters, their values, a cryptographic function, and the Secret Key, which acts as the "key" for the function.

[IdType:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Default: ASIN  
Valid Values:  
 * SKU
 * UPC
 * EAN
 * ISBN (US only, when search index is Books). UPC is not valid in the CA locale.

[IncludeReviewsSummary:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Default: True  
Valid Values:  
 * True
 * False

[Item:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartCreate.html)  
For REST, a prefix for ASIN and quantity, both of which are used to specify the item to add to the cart, for example, item.1.ASIN=1234abcd, item.1.quantity=2. Valid Values: Use an array of objects e.g.
```javascript
Item: [
  {
    ASIN: "ID1", 
    Quantity: 2
  }, 
  {
    ASIN: "ID2", 
    Quantity: 1
  }
];
```

[ItemId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Default: None  
Constraints: Must be a valid item ID.  
For more than one ID, use a comma-separated list of up to ten IDs.

[MarketplaceDomain:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CommonRequestParameters.html)  
Valid values: Amazon

[MerchantId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Valid values: Amazon

[OfferListingId:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartAdd.html)  
Default: None  
Valid Values: Valid offer listing ID.  
Constraint: Required if ASIN is not offered

[Operation:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CommonRequestParameters.html)  
Valid values:  
 * BrowseNodeLookup
 * CartAdd
 * CartClear
 * CartCreate
 * CartGet
 * CartModify
 * ItemLookup
 * ItemSearch
 * SimilarityLookup

[Quantity:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CartAdd.html)  
Default: None  
Valid Values: Positive integer between 1 and 999, inclusive

[RelatedItemPage:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Valid values: Page Number

[RelationshipType:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Goto [RelationshipTypes](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SuggestingSimilarItemstoBuy.html#RelationshipTypes) to view valid values

[ResponseGroup:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Default: Small  
Valid Values:  
 * Accessories
 * BrowseNodes
 * EditorialReview
 * Images
 * ItemAttributes
 * ItemIds
 * Large
 * Medium
 * OfferFull
 * Offers
 * PromotionSummary
 * OfferSummary| RelatedItems
 * Reviews
 * SalesRank
 * Similarities
 * Small
 * Tracks
 * VariationImages
 * Variations (US only)
 * VariationSummary
You may use a comma separated list to return multiple Response Groups

[SearchIndex:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Default: None  
Valid Values: A search index, for example, Apparel, Beauty, Blended, Books, and so forth. For a complete of search indices, see [Locale Reference](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/localevalues.html).  
Constraint:If ItemIdis an ASIN, a search index cannot be specified in the request.  
Required for non-ASIN ItemIds.

[SimilarityType:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SimilarityLookup.html)  
Default: Intersection  
Valid Value: Random

[TruncateReviewsAt:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Valid values: Amazon

[Validate:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CommonRequestParameters.html)  
True tests your request without returning results.  
Default: False  
Valid values: True, False

[VariationPage:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html)  
Default: All  
Valid Values: Integer between 1 and 150, inclusive

[Version:](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/CommonRequestParameters.html)  
Default: 2013-08-01

