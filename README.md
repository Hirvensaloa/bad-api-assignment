# bad-api-assignment

This repository contains my solution to Reaktor's bad-api-assignment for junior developer position (Summer 2021).

## assignment

Assignment is to implement a web app for a clothing brands warehouse. From the app workers can check product availability per category. Client uses two legacy APIs where data for categories and manufacturers are stored. 

Assignment presents following problems: 
- APIs don't have CORS-header attached to http-responses
- To get the required information, you have to send one request to API which has category information and multiple request to API which has manufacturer and         availability information. This makes fetching the information very slow as responses take a bit of time. 
- Manufacturer API has built in error case where it randomly responses with just '[]' as data. So request has to be sent again. 
- There are around 18 000 products. 

For more detailed information check: https://www.reaktor.com/junior-dev-assignment/

## My solution

My solution consists of front end and back end (proxy server). Front end makes requests to proxy server and displays data it receives. 

### Proxy server 

Proxy server does most of the heavy lifting. It is used to cache the data from the APIs and add CORS header to responses. Data is updated every few seconds by fetching data from the APIs. Server compares responses Etags and the ones it has stored to check if data has been modified. This makes responding to request quite fast because server always has up-to-date data (with few seconds delay, that is the average time to reach APIs) already parsed and ready to be sent. 

### UI

UI implements a header which has buttons for each category available. Clickin a button renders a category component which then renders items to display. To render items fast, I have implemented a InfiniteList component which utilises react-infinite-scroll-component. This allows to render only the items that are on the screen for much faster performance. 

## Installation and development

To install dependencies you have to run ``npm install`` in the root folder and in /client. Once dependencies are installed you can run the application. 

To run program, you have to first start the proxy server from the root folder by running the command ``npm start`` or ``npm run dev`` (For easier development). Then you can cd to /client and run the front end with ``npm start``
