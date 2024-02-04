function status(request, response) {
  response.status(200).json({chave:"curso.dev"})
}

export default status