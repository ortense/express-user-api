import fs        from 'fs'
import path      from 'path'
import Sequelize from 'sequelize'
import config    from './config'

const NODE_ENV     = process.env.NODE_ENV || 'development'
const DATABASE_URL = process.env.DATABASE_URL
const modelsDir    = path.resolve(__dirname, '../models')
const models       = {}

let sequelize

if (DATABASE_URL) {
	sequelize = new Sequelize(process.env.DATABASE_URL)
}
else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config.params
	)
}

fs.readdirSync(modelsDir)
	.filter(file => (file.indexOf('.') !== 0))
	.forEach(file => {
		const model = sequelize.import(path.join(modelsDir, file))
		models[model.name] = model
	})

Object.keys(models).forEach(modelName => {
	if ('associate' in models[modelName]) {
		models[modelName].associate(models)
	}
})

const datasource = {
	models,
	database: sequelize
}

export default datasource
