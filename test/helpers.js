import supertest from 'supertest'
import Joi       from 'joi'
import joiAssert from 'joi-assert'
import chai      from 'chai'
import app       from '../app'

global.app       = app
global.expect    = chai.expect
global.request   = supertest(app);
global.Joi       = Joi
global.joiAssert = joiAssert
