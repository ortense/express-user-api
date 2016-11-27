const NODE_ENV = process.env.NODE_ENV || 'development'

export default {
	database: 'books',
	username: '',
	password: '',
	params: {
		logging: false,
		dialect: 'sqlite',
		storage: `${NODE_ENV}_users.sqlite`,
		define: {
			underscored: true,
		}
	}
}
