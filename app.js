import express    from 'express'
import bodyParser from 'body-parser'

import datasource from './config/datasource'
import Auth       from './controllers/auth'
import Usuario    from './controllers/usuario'

const ENV_PORT = process.env.PORT

const app  = express()

const enableCORS = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept')
	next()
}
app.use(bodyParser.json())
app.use(enableCORS)
app.datasource = datasource

app.set('port', ENV_PORT || 3000)

let auth = new Auth(datasource.models.Usuario)

auth.register(app)

let usuario = new Usuario(
		datasource.models.Usuario,
		datasource.models.Telefone
	)

usuario.register(app)

export default app
