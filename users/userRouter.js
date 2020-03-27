const express = require('express');
const usersDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();



router.post('/', validateUser, (req, res) => {
  usersDb.insert(req.body)
  .then(user => { res.status(201).json(user);})
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'Could not create user' });
  });
});



router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postDb.insert(req.body)
  .then((p) => {
    res.status(201).json(p);
  })
  .catch(() => {
    res.status(500).json({
      message: "couldn't post a post"
    })
  })
});

router.get('/', (req, res) => {
  usersDb.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({ error: "Error getting users from the user database..." })
    })
});

router.get('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    usersDb.getById(id)
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => {
        res.status(500).json({ error: "This user does not exist from the user database..." })
      })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;
  usersDb.getUserPosts(id)
    .then(post => {
      if(!post.length) {
          res.status(404).json({
              message: "The post with the specified ID does not exist"
          })
      } else if (post.length) {
        usersDb.getUserPosts(id).then(post => {
              if (!post.length) {
                  res.status(500).json({
                      error: "The comments information could not be retrieved"
                  });
              } else if (post.length) {
                  res.status(200).json(post);
              }
          })
      }
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  usersDb.getById(id)
  .then(user => {
    console.log(user);
    if (!user){
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      });
    }
    else {
      usersDb.remove(id)
      .then( user => { 
        console.log("delete user", user)
        res.status(201).json({ message: "This user has been deleted"})
      })
      .catch(err => {
        res.status(500).json({ error: "The user could not be removed" }, err);
      });
    }
  });
});

router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  usersDb.update(id, req.body)
  .then(user => {
    if (user) {
      res.status(200).json(req.body);
    } else {
      res.status(404).json({ message: 'The user could not be found' });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error updating the user',
    });
  });
});



//custom middleware
function validateUserId(req, res, next) {
  usersDb.getById(req.params.id)
  .then(user => {
    console.log("validate user", user)
    if(user) {
      req.user = user;
    } else {
      res.status(400).json({ message: "invalid user id" })
    }
  })
  next();
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing user data" })
  } else if(req.body.name === "") {
    res.status(400).json({ message: "missing required name field" })
  }else{
    next();
  }
}

function validatePost(req, res, next) {
  response = {
    text: req.body.text,
    user_id: req.params.id
  }
  if(!req.body) {
    res.status(400).json({
      message: "missing post data"
    })
  } else if (!req.body.text) {
    res.status(400).json({
      message: "missing required text field"
    })
  } else {
    req.body = response;
    next();
  }
}  
module.exports = router;
