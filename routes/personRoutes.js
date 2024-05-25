const express = require("express");
const router = express.Router();

const Person = require("./../modals/Person");
const {jwtAuthMiddleware, generateToken}=require("./../jwt")
//post route to add a person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newPerson = new Person(data);
    const response = await newPerson.save();
    console.log("data saved", response);

    const payload = {
      id: response.id,
      username: response.username
    }
    console.log(JSON.stringify(payload))
    const token = generateToken(payload);
    console.log("Token is: ", token)
    res.status(200).json({response: response, token: token});
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error" });
  }
});
//Login route
router.post("login", async(req,res)=>{
  try{
    //Extract username and password from request body
    const {username, password}=req.body;
    //Find the user by username
  const user = await Person.findOne({username:username});
  //If user does not exist or password does not match, return error
  if(!user || !(await user.comparePassword(password)))
    {
      return res.status(404).json({error: "Invalid username or password"})
    }
    //generate token
    const payload = {
      id : user.id,
      username : user.username
    }
    const token = generateToken(payload)
    //return token as response
    res.json({token})
  }
  catch(err){
    console.log(err)
    res.status(500).json({error: "Internal server error"})
  }
})

//get route to add a person
router.get("/", async (req, res) => {
  try {
    const data = await Person.find();

    console.log("data fetched", data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error" });
  }
});
//worktype route to add workType
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType;
    if (workType == "chef" || "manager" || "waiter") {
      const response = await Person.find({ work: workType });
      console.log("Response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid work type." });
    }
  } catch (err) {
    res.status(500).json({ err: "Internal server error." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedPersonData = req.body;
    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!response) {
      return res.status(404).json({ error: "Person not found." });
    }
    console.log("Data updated.");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const response = await Person.findOneAndDelete(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found." });
    }
    console.log("Data deleted.");
    res.status(200).json({ message: "Data deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error." });
  }
});

module.exports = router;
