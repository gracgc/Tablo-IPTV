const {Router} = require('express');
const router = Router();


router.get('/', function (req, res) {
    res.sendFile(__dirname + "/BD/test.json")
});



// router.put('', (req, res) => {
//     const minutes = req.body.minutes;
//     const seconds = req.body.seconds;
//     const milliseconds = req.body.milliseconds;
//     Timer.findByIdAndUpdate({_id: "5f70b7a294b15820c02c50f0"},
//         {
//             minutes: minutes,
//             seconds: seconds,
//             milliseconds: milliseconds
//
//         }, {returnOriginal: false, new: true }
//     ).then(result => {
//         res.json(result)
//     })
// });

module.exports = router;
