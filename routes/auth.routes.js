const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require("bcrypt")
const config = require("config")
const jwt = require("jsonwebtoken")


router.post('/login', cors(), async function (req, res) {
    try {
        const password = req.body.password

        let data = fs.readFileSync(path.join(__dirname, `/DB/auth.json`));
        let DB = JSON.parse(data);

        const isPassValid = bcrypt.compareSync(password, DB.password)
        if (!isPassValid) {
            return res.send({message: "Invalid password", resultCode: 10})
        }
        const token = jwt.sign({id: DB.id}, config.get("secretKey"), {expiresIn: "18h"})
        return res.send({
            token,
            id: DB.id,
            resultCode: 0
        })
    } catch (e) {
        console.log(e)
    }
});

router.options('/', cors());


module.exports = router;