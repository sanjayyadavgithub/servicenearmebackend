var express = require('express');
var multer = require('multer');
var md5 = require('md5');
var cors = require('cors');
var app = express();
var fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var rn = require('random-number');
var request = require('request');
var dateTime = require('node-datetime');
var util = require('util');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
var header = require('headers');
var net = require('net');
var httpHeaders = require('http-headers');
const nodemailer = require('nodemailer');
var Hogan = require('hogan.js');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
app.use(express.json());
//require("./uploads/service/")
// var template = fs.readFileSync('./view/index.hbs', 'utf-8');
// var compileTemplate = Hogan.compile(template);

// var otptemplate = fs.readFileSync('./view/Otp.hbs', 'utf-8');
// var compileOtpTemplate = Hogan.compile(otptemplate);
// app.use(bodyParser.json({
//     limit: '50mb'
// }));

/*
Database: servicen_nervice
Username: rootservice
Email: bedocil876@noobf.com
*/

var url = 'http://35.237.232.37';
// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',    //database usernae ->id16481260_servicenearme
// 	password: '',//K$WM39h[aPYDi7w|
// 	database: 'servicen_nervice'   //id16481260_servicen_nervice
// });

//for db4free.et data base using connection   and temperery mail temp Mail search  phpmyadmin link ->https://www.db4free.net/phpMyAdmin/
// website link   https://www.db4free.net/confirm.php?create=2dbfeed1e4c0e69a088327d898e12812

var connection = mysql.createConnection({
	host: 'db4free.net',
	port: '3306',
	user: 'rootservice',
	password: 'service123@',
	database: 'servicen_nervice'
})



connection.connect();
app.use(express.static('uploads/service'));
app.use(fileUpload());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With'
	);
	next();
});
let transporter = nodemailer.createTransport({
	host: 'smtp.sendgrid.net',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'apikey', // generated ethereal user
		pass: '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' // generated ethereal password
	}
});


//for image get method   src="http://localhost:4200/api/uploads/service/handyman/handyman.jpg"
// app.get('/api/uploads/service/:servicename/:filename',(req,res)=>{
// 	console.log(req.params.servicename+'/'+req.params.filename+".jpg");
// 	res.download('./uploads/service/'+req.params.path+'/'+req.params.path+".jpg");
// })


//list states
app.get('/getStates', (req, res) => {
	connection.query('SELECT * FROM `state`', function(error, results, fields) {
		if (error) {
			console.log(error);
			res.send({
				code: 400,
				failed: 'error ocurred'
			});
		} else if (results.length > 0) {
			//console.log(results);
			res.send({
				code: 200,
				result: results
			});
		} else {
			res.send({
				code: 400,
				error: 'No States Found'
			});
		}
	});
});


//get all service done
app.get('/getAllService', (req, res) => {
	connection.query('SELECT id,name,permalink,description,tollFreeNo,bannerContent,questionContent,pageTitle,mainTitle,image,status,metaTags FROM `service`', function(error, results, fields) {
		if (error) {
			res.send({
				code: 400,
				failed: 'error ocurred'
			});
		} else if (results.length > 0) {
			res.send({
				code: 200,
				result: results
			});
		} else {
			res.send({
				code: 400,
				error: 'No Service Found'
			});
		}
	});
});


//add all service done
app.post('/addService', (req, res) => {
	console.log('body', req.body);
	console.log('image', req.files);
	if (req.files) {
;		let sampleFile = req.files.image;
		console.log(sampleFile);
		var query = {
			//'pid': parseInt(req.body.pId),
			name: req.body.name,
			permalink: req.body.permalink,
			status: req.body.status,
			tollFreeNo: req.body.tollFreeNo,
			description: req.body.description,
			bannerContent: req.body.bannerContent,
			questionContent: req.body.questionContent,
			pageTitle: req.body.pageTitle,
			mainTitle: req.body.mainTitle,
			image: sampleFile.name,
			metaTags: req.body.metaTags,
			faqs: req.body.faqs
		};
		//console.log(query);
		var dir = './uploads/service/' + query.permalink;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		sampleFile.mv('uploads/service/' + query.permalink + '/' + sampleFile.name, function(err) {
			if (err) {
				res.send({
					code: 400,
					error: err
				});
			} else {
				// Use the mv() method to place the file somewhere on your server
				connection.query('INSERT INTO service SET ?', query, (error, results) => {
					if (error) {
						res.send({
							code: 400,
							error: error
						});
					} else {
						res.send({
							code: 200,
							data: 'Service is added SuccessFully'
						});
					}
				});
			}
		});
	} else {
		res.send({
			code: 400,
			error: 'image not found'
		});
	}
});
//get One
app.get('/getService/:id', (req, res) => {
	var id = parseInt(req.params.id);
	console.log("getService",id);
	connection.query('SELECT * FROM service WHERE id= ?', id, (error, results) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else if (results.length == 0) {
			res.send({
				code: 400,
				error: 'Not Found'
			});
		} else {
			res.send({
				code: 200,
				result: results[0]
			});
		}
	});
});
app.get('/getServicePermalink/:permalink', (req, res) => {     //http://localhost:1802/getServicePermalink/dishTV
	var permalink = req.params.permalink;
	console.log("getServicepermalink method",permalink);
	connection.query('SELECT * FROM service WHERE permalink= ?', permalink, (error, results) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else if (results.length == 0) {
			res.send({
				code: 400,
				error: 'Not Found'
			});
		} else {
			res.send({
				code: 200,
				result: results[0]
			});
		}
	});
});

//edit
app.post('/editService', (req, res) => {
	console.log("edit",req.body);
	console.log("edit",req.files);
	if (req.files) {
		let sampleFile = req.files.image;
		var query = {
			id: parseInt(req.body.id),
			name: req.body.name,
			permalink: req.body.permalink,
			status: req.body.status,
			tollFreeNo: req.body.tollFreeNo,
			description: req.body.description,
			bannerContent: req.body.bannerContent,
			questionContent: req.body.questionContent,
			pageTitle: req.body.pageTitle,
			mainTitle: req.body.mainTitle,
			image: sampleFile.name,
			metaTags: req.body.metaTags,
			faqs: req.body.faqs
		};
		console.log("edit",query);
		var dir = './uploads/service/' + query.permalink;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		sampleFile.mv('uploads/service/' + query.permalink + '/' + sampleFile.name, function(err) {
			if (err) {
				res.send({
					code: 400,
					error: err
				});
			} else {
				// Use the mv() method to place the file somewhere on your server
				connection.query('UPDATE service SET ? WHERE id=?', [ query, query.id ], (error, results) => {
					if (error) {
						res.send({
							code: 400,
							error: error
						});
					} else {
						res.send({
							code: 200,
							data: 'Service is updated  SuccessFully'
						});
					}
				});
			}
		});
	} else {
		var query = {
			id: parseInt(req.body.id),
			name: req.body.name,
			permalink: req.body.permalink,
			status: req.body.status,
			tollFreeNo: req.body.tollFreeNo,
			description: req.body.description,
			bannerContent: req.body.bannerContent,
			questionContent: req.body.questionContent,
			pageTitle: req.body.pageTitle,
			mainTitle: req.body.mainTitle,
			metaTags: req.body.metaTags,
			faqs: req.body.faqs
		};
		console.log(query);
		connection.query('UPDATE service SET ? WHERE id=?', [ query, query.id ], (error, results) => {
			if (error) {
				res.send({
					code: 400,
					error: error
				});
			} else {
				res.send({
					code: 200,
					data: 'Service is updated SuccessFully'
				});
			}
		});
	}
});
//list
app.get('/getAllTargetStates', (req, res) => {
	connection.query(
		'SELECT targeted_states.*,service.name as serviceName FROM targeted_states INNER JOIN service ON targeted_states.service=service.id',
		function(error, results, fields) {
			if (error) {
				res.send({
					code: 400,
					failed: 'error ocurred'
				});
			} else if (results) {
				res.send({
					code: 200,
					result: results
				});
			} else {
				res.send({
					code: 400,
					error: 'No Service Found'
				});
			}
		}
	);
});

app.get('/contactdetail', (req, res) => {
	connection.query("SELECT * from contactdata",(error,result)=>{
		if (error) {
				res.send({
					code: 400,
					failed: 'error ocurred'
				});
			} else if (result) {
				res.send({
					code: 200,
					result: result
				});
			} else {
				res.send({
					code: 400,
					error: 'No Service Found'
				});
			}
	})
})
//contact details page 
app.post('/contactUs', (req, res) => {
	console.log("body contact=>",req.body);
	var query = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		address: req.body.address,
		message: req.body.message
	};
	var sql = "INSERT INTO contactdata SET ?";
	connection.query(sql, [query], (error, results) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else {
			res.send({
				code: 200,
				data: 'Contact Us data is added SuccessFully'
			});
		}
	})
})

//add
app.post('/addTargetState', (req, res) => {
	console.log("addtarget",req.body);
	console.log("addtarget",req.files);
	var query = {
		//'pid': parseInt(req.body.pId),
		name: req.body.name,
		permalink: req.body.permalink,
		content: req.body.content,
		state: parseInt(req.body.state),
		service: parseInt(req.body.service),
		status: req.body.status,
		tollFreeNo: req.body.tollFreeNo,
		faqs: req.body.faqs,
		metaTags: req.body.metaTags
	};
	console.log("add target",query);
	connection.query('INSERT INTO targeted_states SET ?', query, (error, results) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else {
			res.send({
				code: 200,
				data: 'Target State is added SuccessFully'
			});
		}
	});
});
//get One
app.get('/getTargetState/:id', (req, res) => {
	var id = parseInt(req.params.id);
	console.log("gettargerid",id);
	connection.query('SELECT * FROM targeted_states WHERE id= ?', id, (error, results) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else if (results.length == 0) {
			res.send({
				code: 400,
				error: 'Not Found'
			});
		} else {
			res.send({
				code: 200,
				result: results[0]
			});
		}
	});
});
app.get('/getServiceState/:id', (req, res) => {
	//id replace service field
	var id = parseInt(req.params.id);
	connection.query('SELECT * FROM targeted_states WHERE service= ?', id, (error, results) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else if (results.length == 0) {
			res.send({
				code: 400,
				error: 'Not Found'
			});
		} else {
			res.send({
				code: 200,
				result: results
			});
		}
	});
});

app.get('/getTargetState/:service/:permalink', (req, res) => {     //http://localhost:1802/getTargetState/appliance-repair/colorado
	var service = req.params.service;
	var permalink = req.params.permalink;
	connection.query(
		'SELECT targeted_states.*,service.name as serviceName FROM targeted_states INNER JOIN service ON targeted_states.service=service.id WHERE service.permalink = ? AND targeted_states.permalink= ?',
		[ service, permalink ],
		(error, results) => {
			if (error) {
				res.send({
					code: 400,
					error: error
				});
			} else if (results.length == 0) {
				res.send({
					code: 400,
					error: 'Not Found'
				});
			} else {
				res.send({
					code: 200,
					data: results[0]
				});
			}
		}
	);
});
//edit
app.post('/editTargetState', (req, res) => {
	var query = {
		id: parseInt(req.body.id),
		name: req.body.name,
		permalink: req.body.permalink,
		content: req.body.content,
		status: req.body.status,
		state: parseInt(req.body.state),
		service: parseInt(req.body.service),
		tollFreeNo: req.body.tollFreeNo,
		faqs: req.body.faqs,
		metaTags: req.body.metaTags
	};
	console.log(query);
	connection.query('UPDATE targeted_states SET ? WHERE id=?', [ query, query.id ], (error, results) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else {
			res.send({
				code: 200,
				data: 'Target State is updated SuccessFully'
			});
		}
	});
});
app.get("/login", (req, res) => {
	connection.query('SELECT * FROM admin', (error, results, fields)=> {
		console.log("result", results);
		res.send(results);
	})
})

app.post('/login', (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	console.log("req body ",req.body);
	connection.query('SELECT * FROM admin WHERE email = ? ', [email], function (error, results, fields) {
		console.log("login data", results);
		if (error) {
			res.send({
				code: 400,
				failed: 'error ocurred'
			});
		} else if (results.length > 0) {
			if (results[0].password == md5(password)) {
				const token = jwt.sign(
					{
						email: results[0].email,
						id: results[0].id
					},
					'supersecret',
					{
						expiresIn: '1h'
					}
				);
				res.send({
					code: 200,
					token: token,
					role: results[0].role,
					id: results[0].id,
					name: results[0].name,
					image: results[0].image
				});
			} else {
				res.send({
					code: 400,
					error: 'Wrong Password'
				});
			}
		} else {
			res.send({
				code: 400,
				error: 'UnAuthorized'
			});
		}
	});
});

app.get('/getAllUserOnCategory', (req, res) => {
	connection.query('SELECT * FROM service', function(error, results, fields) {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else if (results.length > 0) {
			res.send({
				code: 200,
				data: results
			});
		} else {
			res.send({
				code: 400,
				data: 'No Record'
			});
		}
	});
});

//USER MANAGEMENT API'S

//Get All Users on the basis of category
app.get('/api/getAllUserOnCategory/:categoryId', (req, res) => {
	var cId = req.params.categoryId;
	var userBlockStatus = 0;
	connection.query(
		'SELECT * FROM register WHERE categoryId = ? AND blockstatus = ?',
		[ cId, userBlockStatus ],
		function(error, results) {
			if (error) {
				res.send({
					code: 400,
					error: error
				});
			} else if (results.length > 0) {
				res.send({
					code: 200,
					data: results
				});
			} else {
				res.send({
					code: 400,
					data: 'No Record'
				});
			}
		}
	);
});


app.post('/register', (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const repassword = req.body.repassword;
	const blockstatus = 0;
	const categoryId = Math.floor(Math.random() * (100 - 1) + 1);
	const query = {
		name: name,
		email: email,
		password: password,
		blockstatus: blockstatus,
		categoryId:categoryId
	}
	if (password == repassword) {
		connection.query('INSERT INTO register SET ?', query, (error, result) => {
			if (error) res.status(404).send({ 'msg': "Something Went worng!!" + error });
			res.status(202).send({ 'msg': "User Register Sucessfull!....." });
		})
	} else {
		res.send({ 'msg': "Password and Re-password not match" });
	}
	
})

//get single user detail
app.get('/api/getUserData/:userId', (req, res) => {
	var userId = req.params.userId;
	connection.query('SELECT * FROM register WHERE id = ?', [ userId ], function(error, results, fields) {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else if (results.length > 0) {
			res.send({
				code: 200,
				data: results
			});
		} else {
			res.send({
				code: 400,
				error: 'No Record'
			});
		}
	});
});
app.post('/api/ResetPassword', urlencodedParser, (req, res) => {
	var password = md5(req.body.password);
	var token = req.body.token;
	console.log(token);
	console.log(password);
	connection.query('SELECT * FROM admin WHERE resetToken = ?', [ token ], function(error, results, fields) {
		if (err) {
			res.send({
				code: 400,
				error: err
			});
		} else if (results.length > 0) {
			jwt.verify(token, 'supersecret', (err2, authData) => {
				if (err2) {
					console.log(err2);
					res.send({
						code: 400,
						result: 'Token Expired'
					});
				} else {
					connection.query('UPDATE admin SET password = ? WHERE resetToken=?', [ password, token ], function(
						err3,
						results3,
						fields3
					) {
						if (err3) {
							console.log(err3);
							res.send({
								code: 400,
								error: err3
							});
						} else {
							// let mailOptions = {

							//     from: 'Skill2skills <Skill2skills@gmail.com>', // sender address
							//     to: email, // list of receivers
							//     subject: 'Forget Password Link', // Subject line
							//     html: compileOtpTemplate.render({ email: email, name: results[0].username,link:results[0].resetToken }) // html body
							//     // html body
							// };

							// transporter.sendMail(mailOptions, (error, info) => {
							//     if (error) {
							//     	console.log(error)
							//         res.send({
							//             "code": 400,
							//             "error": error
							//         })

							//     } else {
							res.send({
								code: 200,
								data: 'Password reset successfully.'
							});
							//     }
							// });
						}
					});
				}
			});
		}
	});
});

app.get('/api/checkEmail', (req, res) => {
	let mailOptions = {
		from: 'Skill2skills <Skill2skills@gmail.com>', // sender address
		to: 'tarunsharmaait@gmail.com', // list of receivers
		subject: 'Forget Password Link', // Subject line
		html: 'sdfsdfdsfsdfsdf' // html body
		// html body
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.send({
				code: 400,
				error: error
			});
		} else {
			res.send({
				code: 200,
				data: 'Password reset successfully.',
				result: info
			});
		}
	});
});

app.post('/api/sendLinkForResetPassword', urlencodedParser, (req, res) => {
	var email = req.body.email;
	console.log(email);
	connection.query('SELECT * FROM admin WHERE email = ?', [ email ], function(error, results, fields) {
		if (error) {
			console.log(error);
			res.send({
				code: 400,
				error: err
			});
		} else if (results.length > 0) {
			const token = jwt.sign(
				{
					id: results[0].id
				},
				'supersecret',
				{
					expiresIn: '2h'
				}
			);
			connection.query('UPDATE admin SET resetToken = ? WHERE email = ?', [ token, email ], (err1, results1) => {
				if (err1) {
					console.log(err1);
					res.send({
						code: 400,
						error: err1
					});
				} else {
					let mailOptions = {
						from: 'digitalservice99pvtldt@gmail.com',//'Skill2skills <Skill2skills@gmail.com>',
						to: email, // list of receivers
						subject: 'Forget Password Link', // Subject line
						html: compileOtpTemplate.render({
							email: email,
							name: results[0].username,
							link: results[0].resetToken
						}),
						attachments: [
							{
								filename: 'logo.png',
								path: __dirname + '/view/images/logo.png',
								cid: 'unique@cid'
							}
						]
					};

					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							console.log(error);
							res.send({
								code: 400,
								error: error
							});
						} else {
							res.send({
								code: 200,
								data: 'Password reset link has been sent to your email.'
							});
						}
					});
				}
			});
		} else {
			res.send({
				code: 400,
				error: 'Email address not found'
			});
		}
	});
});
// api for Block user
app.get('/api/BlockUser/:userId', (req, res) => {
	var userId = req.params.userId;
	var userBlockStatus = 1;
	connection.query('UPDATE register SET blockstatus = ? WHERE id = ? ', [ userBlockStatus, userId ], function(
		error,
		results,
		fields
	) {
		if (error) {
			res.send({
				code: 400,
				failed: 'error'
			});
		} else {
			res.send({
				code: 200,
				success: 'User Blocked SuccessFully'
			});
		}
	});
});

//api for unblockuser
app.get('/api/UnBlockUser/:userId', (req, res) => {
	var userId = req.params.userId;
	var userBlockStatus = 0;
	connection.query('UPDATE register SET blockstatus = ? WHERE id = ? ', [ userBlockStatus, userId ], function(
		error,
		results,
		fields
	) {
		if (error) {
			res.send({
				code: 400,
				failed: 'error'
			});
		} else {
			res.send({
				code: 200,
				success: 'User UnBlocked SuccessFully'
			});
		}
	});
});


//api for get blocked users
app.get('/api/getBlockedUserForAdmin', (req, res) => {
	var userBlockStatus = 1;
	connection.query('SELECT * FROM register WHERE blockstatus=?', [ userBlockStatus ], function(error, results) {
		if (error) {
			res.send({
				code: 400,
				failed: 'error'
			});
		} else {
			res.send({
				code: 200,
				success: results
			});
		}
	});
});

app.listen(1802, function() {
	console.log('Working on port 1802');
});


