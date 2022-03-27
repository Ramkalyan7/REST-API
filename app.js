const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
  title:String,
  content:String
};

const Article=mongoose.model("Article",articleSchema);

//////////////////////////////////////Requests targeting all articles////////////////////////////////

app.route("/articles")

.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})

.post(function(req,res){

const newArticle=new Article({
  title:req.body.title,
  content:req.body.content
});
newArticle.save(function(err){
  if(!err){
    res.send("added new article to the database sucessfully");
  }else{
    res.send(err);
  }
});

})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("sucessfully deleted  all the articles");
    }else{
      res.send(err);
    }
  });
});


//////////////////////////////////////Requests targeting a specific article////////////////////////////////


app.route("/articles/:articleTitle")

.get(function(req,res){
Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
  if(foundArticle){
    res.send(foundArticle);
  }
  else{
    res.send("no article found with that title");
  }
});
})

.put(function(req,res){
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    function(err){
      if(!err){
        res.send("sucessfully updated the article")
      }
    }
    );
})

// .put(function(req,res){
//   Article.update(
//     {title:req.params.articleTitle},
//     {title:req.body.title,content:req.body.content},
//     {overwrite:true},
//     function(err){
//       if(!err){
//         res.send("sucessfully replaced the article");
//       }
//     }
//   );
// })

// .patch(function(req,res){
//   Aricle.update(
//     {title:req.params.articleTitle},
//     {$set:req.body},
//     function(err){
//       if(!err){
//         res.send("sucessfully updated the article");
//       }else{
//         res.send(err);
//       }
//     }
//   )
// })

.patch(function(req,res){
    Article.updateOne(
      {title:req.params.articleTitle},
      {$set:req.body},
      function(err){
        if(!err){
          res.send("succesfully updated the article");
        }else{
          res.send(err);
        }
      }
    );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err,result){
    if(!err){
      res.send("sucessfully delete the article");
    }
    else{
      res.send(err);
    }
  });
});






app.listen(3000,function(){
  console.log("server started at port 3000.");
});
