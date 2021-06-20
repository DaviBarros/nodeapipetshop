const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor


roteador.get('/', async (req, res) => {
   const resultados = await TabelaFornecedor.listar()
   const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type')
   )
   res.status(200)
   res.send(
      serializador.serializar(resultados)
   )
})

roteador.post('/', async (req, res, proximo) => {

   try {

      const dadosRecebidos = req.body
      const fornecedor = new Fornecedor(dadosRecebidos)
      await fornecedor.criar()
      res.status(201)
      const serializador = new SerializadorFornecedor(
         res.getHeader('Content-Type')
      )
      res.send(
         serializador.serializar(fornecedor)
      )

   } catch (error) {
      
      proximo(error)

   }



})

roteador.get('/:id', async (req, res, proximo) => {


   try {

      const id = req.params.id
      const fornecedor = new Fornecedor({ id: id })
      await fornecedor.carregar()
      res.status(200)
      const serializador = new SerializadorFornecedor(
         res.getHeader('Content-Type'),
         ['email','dataCriacao','dataAtualizacao','versao']
      )
      res.send(
         serializador.serializar(fornecedor)
      )

   } catch (error) {
      proximo(error)
   }
})

roteador.put('/:id', async (req, res, proximo) => {


   try {

      const id = req.params.id
      const dadosRecebidos = req.body
      const dados = Object.assign({}, dadosRecebidos, { id: id })
      const fornecedor = new Fornecedor(dados)
      await fornecedor.atualizar()
      res.status(204)
      res.end()

   } catch (error) {
     
      proximo(error)

   }

})

roteador.delete('/:id', async (req, res, proximo) => {

   try {

      const id = req.params.id
      const fornecedor = new Fornecedor({ id: id })
      await fornecedor.carregar()
      await fornecedor.remover()
      res.status(204)
      res.end()

   } catch (error) {
      proximo(error)
   }
})

module.exports = roteador