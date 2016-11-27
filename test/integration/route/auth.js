describe('Integration: Route Auth', () => {
	const Usuario  = app.datasource.models.Usuario
	const Telefone = app.datasource.models.Telefone
	const newUser = {
		nome: 'New User',
		email: 'newuser@mail.com',
		senha: 'newUserPwd'
	}

	before(done => {
		app.datasource.database.sync().done(() => {
			done()
		})
	})

	beforeEach(done => {
		Usuario
			.destroy({ where: {} })
			.then(Telefone.destroy({where: {}}))
			.then(() => done())
	})

	describe('POST /sign_up', () => {

		it('should create a user', done => {
			request.post('/sign_up')
				.send(newUser)
				.expect('Content-Type', /json/)
				.expect(201)
				.end((err, res) => {
					expect(res.body).to.have.property('id')
					expect(res.body).to.have.property('data_criacao')
					expect(res.body).to.have.property('data_atualizacao')
					expect(res.body).to.have.property('ultimo_login')
        			done(err)
				})
		})

		it('should return a valid token', done => {
			request.post('/sign_up')
				.send(newUser)
				.expect('Content-Type', /json/)
				.expect(201)
				.end((err, res) => {
					Usuario.verifyToken(res.body.token)
						.then(email => {
							expect(email).to.eql(newUser.email)
		        			done(err)
						})
						.catch(err => done(err))
				})
		})

		it('should return error for already existing email', done => {
			const otherUser = {
				nome: 'Other User',
				email: 'otheruser@mail.com',
				senha: 'OtherUserPwd'
			}

			request.post('/sign_up')
				.send(otherUser)
				.end((err, res) => {
					otherUser.id = 4
					otherUser.nome = 'Other 2'
					request.post('/sign_up')
						.send(otherUser)
						.expect(500)
						.end((err2, res2) => {
							expect(res2.body.mensagem)
								.to.have.string('E-mail já existente')
							done(err||err2)
						})
				})
		})

	})

	describe('POST /sign_in', () => {
		const login = {
				nome: 'Login User',
				email: 'login@mail.com',
				senha: 'loginUserPwd'
			}

		it('should return a user data', done => {
			Usuario.create(login)
				.then(user => {
					request.post('/sign_in')
						.send({email:login.email, senha: login.senha})
						.expect(200)
						.expect('Content-Type', /json/)
						.end((err, res) => {
							expect(res.body).to.have.property('id')
							expect(res.body).to.have.property('data_criacao')
							expect(res.body).to.have.property('data_atualizacao')
							expect(res.body).to.have.property('ultimo_login')
							expect(res.body).to.have.property('token')
							done(err)
						})
				})
		})

		it('should update "ultimo_login"', done => {
			Usuario.create(login)
				.then(user => {
					request.post('/sign_in')
						.send({email:login.email, senha: login.senha})
						.expect(200)
						.expect('Content-Type', /json/)
						.end((err, res) => {
							expect(res.body.ultimo_login)
								.to.be.not.eql(user.ultimo_login)
							done(err)
						})
				})
		})

		it('should return unauthorized for invalid user or invalid password', done => {

			request.post('/sign_in')
				.send({email:'test', senha: 'test'})
				.expect(401)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					expect(res.body.mensagem)
						.to.have.string('Usuário e/ou senha inválidos')
					done(err)
				})
		})
	})
})
