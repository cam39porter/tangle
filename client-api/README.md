# Client Api

This api is responsible for serving clients for capturing and surfacing. It is a node server that offers a graphql spec.

## Starting the server

In order to make use of this api in development, you will need a live version of sql. The recommended path is to follow this guide to set up a local proxy. Note that this should only be used for dev, and not production https://cloud.google.com/sql/docs/mysql/quickstart-proxy-test
<br>
If you dont have time to read and understand that link

> curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64 <br>
> chmod +x cloud_sql_proxy <br>
> ./cloud_sql_proxy -instances=<opit-193719:us-central1:mysql-test>=tcp:3306 <br>

Now the hard part is out of the way <br>

> npm i <br>
> npm start

## Hitting the server

Via curl:

> curl -v "http://localhost:3000/graphql?query..."

Via graphical

> http://localhost:3000/graphiql <br>
> query {
> ...
> }

## Debugging

Start auto compiling. Otherwise you will be quite frustrated by making a change and not seeing anything new. Also you mappings will get out of wack.<br>

> npm run compile <br>

Now, in vscode hit F5. Set breakpoints as desired and hit the app in a way defined above.
