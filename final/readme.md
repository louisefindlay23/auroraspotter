# Final: Back-End

The final version of the site uses a NodeJS backend and EJS template engine, served by Express to create a dynamic version of the Aurora website. The login system is replaced by a more secure MongoDB database, the (previously static) content is created through EJS pages and partials and images can be uploaded for profile pictures and aurora observations.

## Plugins Used

**Web Server** = Express

**Database** = MongoDB

**Image Upload** = Multer & Path

## Run Instructions ##

If running on Codio, make sure MongoDB and and the correct version of MongoDB is installed `npm install mongodb@2.2.33`

If you have cannot find modules errors, run `npm install` and if the error persists, `npm install (name of module referenced in the error that it cannot find`

If starting with an empty database, import some entries: `mongoimport -d usersdb -c observations --file testObservations.json --jsonArray` and `mongoimport -d usersdb -c photo --file photos.json --jsonArray`
