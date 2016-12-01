import crypto from 'crypto'
import jwt    from 'jsonwebtoken'

const SECRET = 'q1w2e3r4t5'

export default (sequelize, DataType) => {
	const Usuario = sequelize.define('Usuario', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nome: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		email: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				async isUnique(value, next) {
					try {
						const user = await Usuario.findOne({
								where: {email: value},
								attributes: ['id']
							})
						if (user) {
							next('E-mail já existente')
						}
						else next()
					}
					catch(error) { next(error) }
				}
			}
		},
		senha: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		token: {
			type: DataType.STRING,
			allowNull: true
		},
		ultimo_login: {
			type: DataType.DATE,
			allowNull: true
		},
		data_criacao: {
			type: DataType.DATE,
			allowNull: true
		},
		data_atualizacao: {
			type: DataType.DATE,
			allowNull: true
		}
	},
	{
		timestamps: false,
		hooks: {
			beforeCreate: user => {
				const now = new Date()
				user.set('senha', Usuario.encrypt(user.senha))
				user.set('data_criacao', now)
				user.set('data_atualizacao', now)
				user.set('ultimo_login', now)
				user.set('token', Usuario.getToken(user.email))
			},
			beforeUpdate: user => {
				user.set('data_atualizacao', new Date())
			}
		},
		classMethods: {
			associate(models){
				Usuario.hasMany(models.Telefone, {
					as: 'telefones', onDelete: 'cascade'
				})
			},
			encrypt(string) {
				return crypto.createHash('md5').update(string).digest('hex')
			},
			getToken(email) {
				const HALF_HOUR = 30 * 60
				return jwt.sign({email}, SECRET, {
					expiresIn: HALF_HOUR
				})
			},
			verifyToken(token) {
				return new Promise((resolve, reject) => {
					jwt.verify(token, SECRET, (error, decoded) => {
						resolve(decoded? decoded.email : null)
					})
				})
			},
			async verifySession(token) {
				try {
					const HALF_HOUR_TIMESTAMP = 1800000
					const email = await Usuario.verifyToken(token)
					if(email) {
						const user = await Usuario.findOne({
								where: {email}
							})
						const isRealToken = (user.token === token)
						const now = new Date()
						const lastLoginDiff = now - user.ultimo_login
						const isInSessionTime = lastLoginDiff < HALF_HOUR_TIMESTAMP

						if (isRealToken) {
							if(isInSessionTime) {
								return {
									authorization: true,
									user
								}

							}
							else {
								return {
									authorization: false,
									mensagem: 'Sessão inválida'
								}
							}
						}
						else {
							return {
								authorization: false,
								mensagem: 'Não autorizado'
							}
						}
					}
					else {
						return {
							authorization: false,
							mensagem: 'Não autorizado'
						}
					}
				}
				catch(error) { throw error }
			}
		}
	})

	return Usuario
}
