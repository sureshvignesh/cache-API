# cache-API
Code Challenge for Fashion Cloud

## Instructions to set up
1. Clone the repository
2. npm install
3. npm start

#Cache Endpoints 
## cached Data for given Key

Endpoint: [http://localhost:8181/api/v1/cache/:key](http://localhost:8181/api/v1/cache/:key)

Method: GET

curl Example: 

	curl -X GET \
	  http://localhost:8181/api/v1/cache/wefr34gvewcsdvsd \
	  -H 'Content-Type: application/json' 

## All stored Keys

Endpoint: [http://localhost:8181/api/v1/cache/](http://localhost:8181/api/v1/cache/)

Method: GET

curl Example: 

	curl -X GET \
	  http://localhost:8181/api/v1/cache/ \
	  -H 'Content-Type: application/json' 
  
## Create or Update Data

Endpoint: [http://localhost:8181/api/v1/cache/:key](http://localhost:8181/api/v1/cache/:key)

Method: POST

curl Example: 

	curl -X POST \
	  http://localhost:8181/api/v1/cache/sefcsdvcsd \
	  -H 'Content-Type: application/json' \
	  -d '{
		"value": "text123  hsfbsdf 12"
	}'

## Delete a cache of given key

Endpoint: [http://localhost:8181/api/v1/cache/:key](http://localhost:8181/api/v1/cache/:key)

Method: DELETE

curl Example: 

	curl -X DELETE \
	  http://localhost:8181/api/v1/cache/kjnjknjkjknk \
	  -H 'Content-Type: application/json' 
  
## Delete all the keys

Endpoint: [http://localhost:8181/api/v1/cache/](http://localhost:8181/api/v1/cache/)

Method: DELETE

curl Example: 

	curl -X DELETE \
	  http://localhost:8181/api/v1/cache/ \
	  -H 'Cache-Control: no-cache' \
	  -H 'Content-Type: application/json' 

# Conditions
## Cache Limit
 getCount() function overwrites the oldest element with the new element by using the lastUpdated timestamp if the max count exceeds.

## TTL
  TTL also uses lastUpdated timestamp and validates the presense. The TTL will be restet by updating the lastUpdated after every DB operation on the record.

# Configuration
## config.josn

Use this file to configure TTL and maxCount
