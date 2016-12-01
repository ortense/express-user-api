describe('Contract: Usuario', () => {
	const Usuario     = app.datasource.models.Usuario
	const Telefone    = app.datasource.models.Telefone
	const defaultUser = {
		id: 1,
		nome: 'Test User',
		email: 'test@mail.com',
		senha: 'testPassword',
		telefones: [
			{ddd: '11', numero: '987654321'},
			{ddd: '21', numero: '87654321'}
		]
	}

	let token

	before(done => {
		app.datasource.database.sync().done(() => {
			done()
		})
	})

	beforeEach(done => {
		Usuario
			.destroy({ where: {} })
			.then(Telefone.destroy({where: {}}))
			.then(() => Usuario.create(
				defaultUser, {
					include: [{	model: Telefone, as: 'telefones'}]
				}))
			.then(user => {
				token = user.token
				done()
			})
	})

	describe('GET /usuario', () => {
		it('should validate a list of users', done => {
			const userList = Joi.array().items(Joi.object().keys({
				id: Joi.number(),
				nome: Joi.string(),
				email: Joi.string(),
				token: Joi.string(),
				data_criacao: Joi.date().iso(),
				data_atualizacao: Joi.date().iso(),
				ultimo_login: Joi.date().iso(),
				telefones: Joi.array().items(Joi.object().keys({
					ddd: Joi.string(),
					numero: Joi.string()
				}))
			}))

			request.get('/usuario')
				.set('Authorization', `Bearer ${token}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					joiAssert(res.body, userList)
					done(err)
				})
		})
	})

	describe('GET /usuario', () => {
		it('should validate a users', done => {
			const user = Joi.object().keys({
				id: Joi.number(),
				nome: Joi.string(),
				email: Joi.string(),
				senha: Joi.string(),
				token: Joi.string(),
				data_criacao: Joi.date().iso(),
				data_atualizacao: Joi.date().iso(),
				ultimo_login: Joi.date().iso(),
				telefones: Joi.array().items(Joi.object().keys({
					ddd: Joi.string(),
					numero: Joi.string()
				}))
			})

			request.get('/usuario/1')
				.set('Authorization', `Bearer ${token}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					joiAssert(res.body, user)
					done(err)
				})
		})
	})
})
