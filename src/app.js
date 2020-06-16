const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//middleware to validate id from uuid
function validateId(request,response,next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid Id"});
  }
  return next();
}

// just a middleware for log :)
function logMiddleware(request,response,next){
  const {method, url} = request;
  const log = `[${method}] from [${url}]`;
  console.log(log);

  return next();

}

app.use(logMiddleware);

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  const id = uuid();
  const repositorie = {id,title,url,techs,likes: 0}

  repositories.push(repositorie);

  return response.status(200).json(repositorie);

});

app.put("/repositories/:id",validateId, (request, response) => {
    const {id} = request.params;

    const idCurrent = repositories.findIndex(repo => repo.id == id);

    if(idCurrent < 0){
      return response.status(400).json({error: "Id not Found"});

    }else{
      const {title,url,techs} = request.body;

      repositories[idCurrent].title = title;
      repositories[idCurrent].url = url;
      repositories[idCurrent].techs = techs;

      return response.status(200).json(repositories[idCurrent]); 
    }
});

app.delete("/repositories/:id",validateId, (request, response) => {
  const {id} = request.params;
  const idCurrent = repositories.findIndex(repo => repo.id == id);
  
  if(idCurrent < 0){
    return response.status(400).json({error: "Id not Found"});
  }else{
    repositories.splice(idCurrent,1);

    return response.status(204).send(); 
  }
  
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const {id} = request.params;
  const idCurrent = repositories.findIndex(repo => repo.id == id);

  if(idCurrent < 0){
    return response.status(400).json({error: "Id not found"});
  }else{
    repositories[idCurrent].likes++;

    return response.status(200).json(repositories[idCurrent]);
  }

});

module.exports = app;
