const express = require("express");
const router = express.Router();

const MenuItem = require("./../modals/MenuItem");

router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("Data Fetched", data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newMenuItem = new MenuItem(data);
    const response = await newMenuItem.save();
    console.log("Data saved", response);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error." });
  }
});

router.get("/:menuTaste", async(req,res)=>{
try{
    const menuTaste=req.params.menuTaste;
    if(menuTaste == "Sweet" || "Sour" || "Spicy")
        {
            const response = await MenuItem.find({ taste: menuTaste });
      console.log("Response fetched");
      res.status(200).json(response);
        }
        else {
            res.status(404).json({ error: "Invalid menu taste." });
          }
}
catch(error){
    console.log(error);
    res.status(500).json({error: "Internal server error."})
}
})

module.exports = router;
