const userScheme = mongoose.Schema({
	_id: String,
	username: String,
	password: String,
	email: String,
	info: {
		name: String,
		occupation: String,
		gender: String
	},
	authens:[
		{google: {id: String, token: String, email: String, name: String}},
		{twitter: {id: String, token: String, username: String, displayName: String}},
		{facebook: {id: String, token: String, email: String, name: String}}
	],
	projects:[ObjectID(), ...]
})

const projectScheme = mongoose.Schema({
	_id: String,
	title: String,
	description: String,
	createAt: ISO8601,
	collaborator: ObjectID(),
	language: String,
	files:[
		{_id: String, name: String, lastModify: ISO8601, code: String},
		...
	]
})
