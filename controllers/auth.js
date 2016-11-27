import * as decorator from 'express-decorators';
import HTTPStatus     from 'http-status'

const responseError = (response, error) => {
	const message = { mensagem: error.message }
	response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(message)
}

@decorator.controller('/')
export default class Auth {
	constructor(UsuarioModel) {
		this.UsuarioModel  = UsuarioModel
	}

	@decorator.post('/sign_up')
	async createUser(request, response) {
		try {
			const newUser = await this.UsuarioModel.create(request.body)

			response.status(HTTPStatus.CREATED).json({
				id: newUser.id,
				data_criacao: newUser.data_criacao,
				data_atualizacao: newUser.data_atualizacao,
				ultimo_login: newUser.ultimo_login,
				token: newUser.token
			})
		}
		catch(error) { responseError(response, error) }
	}

	@decorator.post('/sign_in')
	async authenticate(request, response) {
		try {
			const email = request.body.email
			const senha = this.UsuarioModel.encrypt(request.body.senha)
			const user  = await this.UsuarioModel.findOne({
				where: {email, senha}
			})

			if(user) {
				await this.UsuarioModel.update({
						ultimo_login: new Date(),
						token: this.UsuarioModel.getToken(email)
					},
					{
						where: { id: user.id}
					})

				const updatedUser = await this.UsuarioModel.findOne({
						where: {id: user.id}
					})

				response.status(HTTPStatus.OK).json({
					id: updatedUser.id,
					data_criacao: updatedUser.data_criacao,
					data_atualizacao: updatedUser.data_atualizacao,
					ultimo_login: updatedUser.ultimo_login,
					token: updatedUser.token
				})
			}
			else {
				response.status(HTTPStatus.UNAUTHORIZED).json({
					mensagem: 'Usuário e/ou senha inválidos'
				})
			}

		}
		catch(error) { responseError(response, error) }
	}
}
