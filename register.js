// https://medium.com/@timtamimi/getting-started-with-authentication-in-node-js-with-passport-and-postgresql-2219664b568c

const express = require("express");
const router = express.Router();
const db = require('./db');
router.get("/", (request, response) => {
	//var pwd = await bcrypt.hash(request.body.password, 5);
	console.log('hmmm');
	db.any('SELECT id FROM "users" WHERE "email"=$1', [request.body.username])
	.then( results => response.json( results ) )
	.catch( error => {
		console.log( error )
		response.json({ error })
	})
});
/*router.get("/", (request, response) => {
	db.any(`INSERT INTO test_table2 ("testString") VALUES ('Hello at ${Date.now()}')`)
	.then( _ => db.any('SELECT * FROM test_table2') )
	.then( results => response.json( results ) )
	.catch( error => {
	console.log( error )
	response.json({ error })
	})
});*/
module.exports = router;




 /*try{
 const client = await pool.connect()
 await client.query(‘BEGIN’)
 var pwd = await bcrypt.hash(req.body.password, 5);
 await JSON.stringify(client.query(‘SELECT id FROM “users” WHERE “email”=$1’, [req.body.username], function(err, result) {
 if(result.rows[0]){
 req.flash(‘warning’, “This email address is already registered. <a href=’/login’>Log in!</a>”);
 res.redirect(‘/join’);
 }
 else{
 client.query(‘INSERT INTO users (id, “firstName”, “lastName”, email, password) VALUES ($1, $2, $3, $4, $5)’, [uuidv4(), req.body.firstName, req.body.lastName, req.body.username, pwd], function(err, result) {
 if(err){console.log(err);}
 else {
 
 client.query(‘COMMIT’)
 console.log(result)
 req.flash(‘success’,’User created.’)
 res.redirect(‘/login’);
 return;
 }
 });
 
 
 }
 
 }));
 client.release();
 } 
 catch(e){throw(e)}
 });*/